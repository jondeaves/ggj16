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
var clickCircle = new Phaser.Circle(300, 100,64);
var filter;

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
    //  audio
    game.load.audio('mountain', 'assets/audio/music/pImp-gasm.mp3');

    // images
    game.load.image("background", "assets/bg/screenMockUp.png");

    // spritesheets
    game.load.spritesheet('imp1', 'assets/sprites/sprite_imp_1.png', 676, 764, 2);
    game.load.spritesheet('imp2', 'assets/sprites/sprite_imp_2.png', 616, 669, 3);
    game.load.spritesheet('sheep', 'assets/sprites/sheep.png', 324, 473, 2);
    game.load.spritesheet('spider', 'assets/sprites/spider.png', 422, 490, 3);

    // scripts
    game.load.script('filter', 'assets/scripts/lib/Fire.js');
  },
  create: function(){

    // Pretty
    var bgImage = game.add.image(0, 0, "background");
    bgImage.width = 800;
    bgImage.height = 480;
    var bgImage2 = game.add.image(0, 0, "background");
    bgImage.width = 800;
    bgImage.height = 480;

    filter = game.add.filter('Fire', 800, 600);
    filter.alpha = 0.5;

    // slowly reduce this value as the game gets closer to completion
    bgImage2.alpha = 0.8;
    // bgImage2.opacity = 0.5;

    bgImage.filters = [filter];


    // Init Physics system
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = physicsBaseRestitution;


    // Sounds good
    songMountain = game.add.audio('mountain');
    // songMountain.play();


    // Init Input
    cursors = game.input.keyboard.createCursorKeys();


    // Create some objects, apply physics to entire Group
    impGroup = game.add.physicsGroup(Phaser.Physics.P2JS);
    impCollisionGroup = game.physics.p2.createCollisionGroup();

    for (var i = 0; i < 1; i++)
    {
      var imp = new Imp(game, impGroup, impCollisionGroup, i);
      game.add.existing(imp);
      impGroup.add(imp);
    }

    setupLevel();
  },
  update: function(){
    updateTimer();

    // drawClickLine();

    filter.update();
    if (clickLine.x !== 0){
      updateClickLine(clickNearestImp.x, clickNearestImp.y, game.input.x, game.input.y );
    }
  },
  render: function() {
    game.debug.geom(clickLine, '#ff0000');
    game.debug.lineInfo(clickLine, 32, 32);
    game.debug.geom(clickCircle,'#cfffff', false);

  }
};


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
  console.log(arrIn.length);
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
    clickNearestImp.turnToTarget = clickPoint;


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




function accelerateToObject(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = 60; }
    // var angle = game.math.angleBetween(obj1.x, obj1.y, obj2.x, obj2.y);
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
    obj1.body.force.y = Math.sin(angle) * speed;
}




/*
imp = game.add.sprite(60, 200, 'imp');
imp.animations.add('walk');
imp.animations.play('walk', 10, true);
imp.scale.setTo(0.1, 0.1);

sheep = game.add.sprite(260, 200, 'sheep');
sheep.animations.add('walk');
sheep.animations.play('walk', 2, true);
sheep.scale.setTo(0.14, 0.14);

spider = game.add.sprite(460, 200, 'spider');
spider.animations.add('walk');
spider.animations.play('walk', 4, true);
spider.scale.setTo(0.15, 0.15);
*/
