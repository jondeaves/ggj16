/* global Phaser */
var game;
var carrot;

window.onload = function() {
    game = new Phaser.Game(800, 480, Phaser.AUTO, 'game_canvas');
    game.state.add("StartGame", startGame);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
};


var startGame = function(){};
var playGame = function(){};

startGame.prototype = {
    preload: function() {
        game.load.image("splash", "assets/bg/splash.jpg");
    },
    create: function(){
        game.add.image(0, 0, "splash");
    },
    update: function(){ }
};

playGame.prototype = {
    preload: function() {
        game.load.image("parrot", "assets/sprites/parrot2.png");
    },
    create: function(){

        // Init Physics system
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 1.1;


        // game.physics.p2.friction = 10000;
        // game.physics.p2.applyDamping = false;
        game.physics.p2.frameRate = 1 / 25;


        // Init Input
        cursors = game.input.keyboard.createCursorKeys();


        // Create some objects, apply physics to entire Group
        parrotGroup = game.add.physicsGroup(Phaser.Physics.P2JS);
        for (var i = 0; i < 1; i++)
        {
                parrot = parrotGroup.create(game.world.randomX, game.world.randomY, 'parrot');
                parrot.body.setCircle(32);
                parrot.body.thrust(2000);
                parrot.body.damping = 0.1;      // Deceleration

                // Track collisions with anything
                parrot.body.onBeginContact.add(objectCollision, this);
        }


    },
    update: function(){
    }
};




function objectCollision (body, bodyB, shapeA, shapeB, equation) {

    //  The block hit something.
    //
    //  This callback is sent 5 arguments:
    //
    //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
    //  The p2.Body this Body is in contact with.
    //  The Shape from this body that caused the contact.
    //  The Shape from the contact body.
    //  The Contact Equation data array.
    //
    //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
    if (body) {
        result = 'You last hit: ' + body.sprite.key;
    }
    else {
        result = 'You last hit: The wall :)';
    }
    console.log(result);

}
