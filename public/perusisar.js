// Initialisation ***************************************

// Il faut commencer par charger /socket.io/socket.io.js

var socket = io.connect('https://perusisar.herokuapp.com');

var pseudo = prompt('Quel est votre pseudo ?');
var room = prompt('Dans quelle partie jouer ?');

socket.emit('new_client', {username: pseudo, room: room});


document.title = pseudo + ' - ' + room + ' - ' + document.title; // juste pour pas se perdre mdr
$('.pseudo').text(pseudo + ' - ' + room);


var dices = [2,3,4,5,6];
var cache = false;

showDice(dices);

function showDice(dices) {
    $('.dices').empty();

    for (var i = dices.length - 1; i >= 0; i--) {
        $('.dices').append('<img src="./imgs/' + dices[i] + '.png" alt="' + dices[i] + '" class="dice">');
    }

    $('.dices img').addClass('animated tada');
}


// Boutons **********************************************

$('.addDice').click(function() {

    if (dices.length < 5 && !cache)
    {
        dice = Math.floor(Math.random() * 6) + 1;
        dices.push(dice);

        showDice(dices);

        socket.emit('add_dice', {});
    }
});

$('.removeDice').click(function() {

    if (dices.length > 1 && !cache)
    {
        dices.splice(0,1);

        showDice(dices);

        socket.emit('remove_dice', {});
    }
});

$('.cacher').click(function() {

    if (cache == false)
    {
        cache = true;
        $('.dices img').removeClass('rollIn').addClass('animated rollOut');
    }
    else
    {
        cache = false;
        $('.dices img').removeClass('rollOut').addClass('animated rollIn');
    }
});

$('.roll').click(function() {
    if (!cache)
    {
    
        var dateNow = new Date(); // for now
        var toAppend = '<p><b>' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds() + ' > Rolled, was :</b>';

        var d1 = 0, d2 = 0, d3 = 0, d4 = 0, d5 = 0, d6 = 0;

        for (var i = dices.length - 1; i >= 0; i--) {
            if (dices[i] == 1) { d1 ++ }
            else if (dices[i] == 2) { d2 ++ }
            else if (dices[i] == 3) { d3 ++ }
            else if (dices[i] == 4) { d4 ++ }
            else if (dices[i] == 5) { d5 ++ }
            else if (dices[i] == 6) { d6 ++ }
        }

        toAppend += '<br>Phenix : ' + d1 + '<br>Mannequins de pisse : ' + d2 + '<br>Igloos : ' + d3 + '<br>Buckets : ' + d4 + '<br>Cowboys : ' + d5 + '<br>Yodas : ' + d6 + '</p>';

        $('.chat').prepend(toAppend);

        for (var i = dices.length - 1; i >= 0; i--) {
            dices[i] = Math.floor(Math.random() * 6) + 1;
        }

        showDice(dices);

        socket.emit('roll_dices', {}); // y'a rien à dire, objet vide
    }
});

socket.on('new_user', function(data) { // data = {username = ''}
    $('.chat').prepend('<p><em>' + data.username + ' a rejoint la partie !</em></p>');
});

socket.on('roll_dices', function(data) { // data = {username = ''}
    $('.chat').prepend('<p><em>' + data.username + ' just rolled his dices</em></p>');
});

socket.on('add_dice', function(data) { // data = {username = ''}
    $('.chat').prepend('<p><em>' + data.username + ' just added one dice</em></p>');
});

socket.on('remove_dice', function(data) { // data = {username = ''}
    $('.chat').prepend('<p><em>' + data.username + ' just removed a dice</em></p>');
});

socket.on('change_room', function(data) { // data = {username = ''}
    $('.chat').prepend('<p><em>' + data.username + ' a changé de partie</em></p>');
});

socket.on('user_leave', function(data) { // data = {username = ''}
    $('.chat').prepend('<p><em>' + data.username + ' s\'est déconnecté</em></p>');
});