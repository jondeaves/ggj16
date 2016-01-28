/* global Phaser */
var game;

window.onload = function() {
    game = new Phaser.Game(800, 480, Phaser.AUTO, 'game_canvas');
    game.state.add("StartGame", startGame);
    game.state.start("StartGame");
};


var startGame = function(game){};
startGame.prototype = {
    preload: function() {
        game.load.image("splash", "/assets/bg/splash.jpg");
    },
    create: function(){
        game.add.image(0, 0, "splash");
    },
    update: function(){ }
};
