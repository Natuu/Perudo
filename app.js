var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    express = require("express"),
    fs = require('fs');

app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, username) {
    socket.on('new_client', function(message) {
        socket.username =  ent.encode(message.username);
        socket.room = ent.encode(message.room);

        socket.join(socket.room);
        socket.to(socket.room).emit('new_user', {username: socket.username});
    });

    socket.on('roll_dices', function(message) {
      socket.broadcast.to(socket.room).emit('roll_dices', {username: socket.username});
    });

    socket.on('remove_dice', function(message) {
      socket.broadcast.to(socket.room).emit('remove_dice', {username: socket.username});
      console.log(socket.username + ' removed');
    });

    socket.on('add_dice', function(message) {
      socket.broadcast.to(socket.room).emit('add_dice', {username: socket.username});
    });

    socket.on('change_room', function(message) {
      socket.broadcast.to(socket.room).emit('leave_room', {username: socket.username});
      socket.leave(socket.room);
      socket.room = ent.encode(message.room);
      socket.join(socket.room);
      socket.to(socket.room).emit('new_user', {username: socket.username});
    });

    socket.on('disconnect', function() {
      socket.broadcast.to(socket.room).emit('user_leave', {username: socket.username});
    });

});

server.listen(8080);
