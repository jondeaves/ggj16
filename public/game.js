/* global Phaser */
var game;
var cursors;


// Track some timing stuff
var gameTimer;

var startTime = 0;
var elapsedTime = 0;
var previousElapsedTime = 0;
var timeSinceLastTick = 0;            // Difference between elapsed and previous elapsed

var clickPoint = null;
var clickRelease = null;
var clickNearestImp = null;
var clickLine = new Phaser.Line(0, 0, 0, 0);

// audio
var songMountain;

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
    game.load.audio('mountain', 'assets/audio/music/pImp-gasm.mp3');
    game.load.spritesheet('imp', 'assets/sprites/imp2.png', 676, 764, 2);
  },
  create: function(){

    // Init Physics system
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = physicsBaseRestitution;

    songMountain = game.add.audio('mountain');
    songMountain.play();


    // Init Input
    cursors = game.input.keyboard.createCursorKeys();


    // Create some objects, apply physics to entire Group
    impGroup = game.add.physicsGroup(Phaser.Physics.P2JS);
    impCollisionGroup = game.physics.p2.createCollisionGroup();

    for (var i = 0; i < 20; i++)
    {
      var impScale = game.rnd.realInRange(impScaleLimits[0], impScaleLimits[1]);
      var frames = game.cache.getFrameData('imp').getFrames();

      imp = impGroup.create(game.world.randomX, game.world.randomY, 'imp');
      imp.scale.setTo(impScale, impScale);
      imp.body.setCircle((frames[0].width * impScale) / 2);
      imp.body.damping = (impBaseDamping * impScale);
      imp.id="imp"+i;


      // Set-up Collisions
      imp.body.setCollisionGroup(impCollisionGroup);
      imp.body.collideWorldBounds = false;
      imp.body.collides([impCollisionGroup]);
      imp.body.onBeginContact.add(objectCollision, this);


      // Animate
      imp.animations.add('walk');
      imp.animations.play('walk', 10, true);

    }

        setupLevel();
    },
    update: function(){
        updateImps();
        updateTimer();

        // drawClickLine();
        // if (game.input.mousePointer.isDown){
        if (clickLine.x !== 0){

          updateClickLine(clickNearestImp.x, clickNearestImp.y, game.input.x, game.input.y );
          // console.log('hey');
          // clickNearestImp = getNearest(impGroup, game.input );
          // debugger;
          // debugger;
          // console.log(nearest.id);
        }
    },
    render: function() {
      game.debug.geom(clickLine, '#ff0000');
      game.debug.lineInfo(clickLine, 32, 32);
    }
};


function updateImps() {
  impGroup.forEach(function(imp) {
    imp.body.thrust(impBaseThrust);

    // Bring back into the world if imp has escaped
    var isOutside = (imp.x+imp.width < 0) || (imp.y+imp.height < 0) ||  (imp.x > game.width) || (imp.y > game.height);
    if(isOutside) {
      var targetAngle = this.game.math.angleBetween(imp.x, imp.y, game.width / 2, game.height / 2);
      imp.body.rotation = (180/Math.PI) * targetAngle;
    }
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

function setupLevel(){

  game.input.mouse.onMouseDown = function (e){

    clickNearestImp = getNearest(impGroup, game.input );
    clickPoint = {x:e.x, y:e.y};

    updateClickLine(clickNearestImp.x, clickNearestImp.y, clickPoint.x, clickPoint.y );

  };
  game.input.mouse.onMouseUp = function (e){

    updateClickLine(0, 0, 0, 0 );

  };
}

function updateClickLine(x1, y1, x2, y2){
  clickLine.start.x = x1;
  clickLine.start.y = y1;
  clickLine.end.x =  x2;
  clickLine.end.y =y2;
}
