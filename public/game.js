/* global Phaser */
var game;
var cursors;


// Track some timing stuff
var gameTimer;

var startTime = 0;
var elapsedTime = 0;
var previousElapsedTime = 0;
var timeSinceLastTick = 0;            // Difference between elapsed and previous elapsed


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
        game.load.image("imp", "assets/sprites/parrot2.png");
    },
    create: function(){

        // Init Physics system
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = physicsBaseRestitution;


        // Init Input
        cursors = game.input.keyboard.createCursorKeys();


        // Create some objects, apply physics to entire Group
        impGroup = game.add.physicsGroup(Phaser.Physics.P2JS);
        for (var i = 0; i < 10; i++)
        {
                var impScale = game.rnd.realInRange(impScaleLimits[0], impScaleLimits[1]);

                imp = impGroup.create(game.world.randomX, game.world.randomY, 'imp');
                imp.body.setCircle((imp.width * impScale) / 2);
                imp.body.damping = impBaseDamping;      // Deceleration
                imp.scale.setTo(impScale, impScale);
                imp.id="imp"+i;

                // Track collisions with anything
                imp.body.onBeginContact.add(objectCollision, this);
        }


    },
    update: function(){
        updateImps();
        updateTimer();



      if (game.input.mousePointer.isDown){
        var nearest = getNearest(impGroup, game.input );
        console.log(nearest.id);
      }


    }
};


function updateImps() {
    impGroup.forEach(function(imp) {
        imp.body.thrust(impBaseThrust);
        imp.body.rotation += 0.01;
    }, this);
}


function updateTimer() {
    // Time Tracking
    elapsedTime = game.time.time - startTime;
    if(previousElapsedTime === 0) {
        previousElapsedTime = elapsedTime;
    }
    timeSinceLastTick = elapsedTime - previousElapsedTime;
    previousElapsedTime = elapsedTime;                                          // We are finished previous time at time point
}




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



function getDistance(pointA, pointB){
  return Math.sqrt( Math.pow((pointA.x-pointB.x), 2) + Math.pow((pointA.y-pointB.y), 2) );
}


function getNearest(arrIn, pointIn){
  var nearest = null;
  var currentNearestDistance = 10000000000000;
  var dist;
  arrIn.forEach(function(obj){
    dist = getDistance(pointIn, obj.position);
    if (dist < currentNearestDistance){
      currentNearestDistance = dist;
      nearest = obj;
    }
    // console.log(getDistance(pointIn, obj.position));
    // console.log(obj.position.x);
  });
  return nearest || null;
}
