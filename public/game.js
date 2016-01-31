/* global Phaser */
var game;


// Track some timing stuff
var gameTimer;

var impDeaths = 0;

var startTime = 0;
var elapsedTime = 0;
var previousElapsedTime = 0;
var timeSinceLastTick = 0;            // Difference between elapsed and previous elapsed

var clickPoint = null;
var clickRelease = null;
var clickNearestImp = null;

var rectUpper = new Phaser.Rectangle(0, screenWidthY*0.3, screenWidthX*0.45, screenWidthY*0.03);
var rectLowerr = new Phaser.Rectangle(0, screenWidthY*0.65, screenWidthX*0.45, screenWidthY*0.03);
var rectLeft = new Phaser.Rectangle(0, screenWidthY*0.3, screenWidthY*0.03, screenWidthY*0.35);
var clickLine = new Phaser.Line(0, 0, 0, 0);
var clickCircle = new Phaser.Circle(0, 0,0);
var filter;
var bgImage;
var pentagram;
var pentImp = null;

var particles = [];
var stars = [];
var particle;
var star;

// audio
var songMountain;
var crash;
var nuuuu;
var i_made_it;
var impaled;
var impossible;
var impressive;
var impudent;
var whoohoo;
var whoop;
var yes;
var bump1;
var bump2;
var bump3;
var bump4;
var impWin;
var impWin2;
var click;

var player;

window.onload = function() {
  game = new Phaser.Game(screenWidthX, screenWidthY, Phaser.AUTO, 'game_canvas');
  game.state.add("StartGame", startGame);
  game.state.add("InstructionScreen", instructionScreen);
  game.state.add("CreditScreen", creditScreen);
  game.state.add("PlayGame", playGame);
  game.state.add("WinGame", winGame);
  game.state.add("LoseGame", loseGame);
  game.state.start("StartGame");
};


var startGame = function(){};
var instructionScreen = function() {};
var creditScreen = function() {};
var playGame = function(){};
var winGame = function(){};
var loseGame = function(){};

startGame.prototype = {
  preload: function() {
    game.load.image("startScreen", "assets/bg/StartScreen.png");
  },
  create: function(){
    var startScreen = game.add.image(0, 0, "startScreen");
    startScreen.width = screenWidthX;
    startScreen.height = screenWidthY;
  },
  update: function(){

    game.input.mouse.onMouseUp = function (e){

      if(game.input.y > 220 && game.input.y < 280) {
        game.state.start("PlayGame");
      }
      if(game.input.y > 295 && game.input.y < 335) {
        game.state.start("InstructionScreen");
      }
      if(game.input.y > 350 && game.input.y < 395) {
        game.state.start("CreditScreen");
      }

    };
  }
};

instructionScreen.prototype = {
  preload: function() {
    game.load.image("instructionScreen", "assets/bg/placeholderInstructionScreen.png");
  },
  create: function(){
    var startScreen = game.add.image(0, 0, "instructionScreen");
    startScreen.width = screenWidthX;
    startScreen.height = screenWidthY;
  },
  update: function(){
    game.input.mouse.onMouseUp = function (e){
      game.state.start("StartGame");
    };
  }
};

creditScreen.prototype = {
  preload: function() {
    game.load.image("creditScreen", "assets/bg/CreditsScreen.png");
  },
  create: function(){
    var startScreen = game.add.image(0, 0, "creditScreen");
    startScreen.width = screenWidthX;
    startScreen.height = screenWidthY;
  },
  update: function(){
    game.input.mouse.onMouseUp = function (e){
      game.state.start("StartGame");
    };
  }
};

playGame.prototype = {
  preload: function() {
    //  audio
    game.load.audio('mountain', 'assets/audio/music/pImp-gasm.mp3');
    game.load.audio('nuuuu', 'assets/audio/vox/nuuuu.mp3');
    game.load.audio('i_made_it', 'assets/audio/vox/i_made_it.mp3');
    game.load.audio('impaled', 'assets/audio/vox/impaled.mp3');
    game.load.audio('impossible', 'assets/audio/vox/impossible.mp3');
    game.load.audio('impressive', 'assets/audio/vox/impressive.mp3');
    game.load.audio('impudent', 'assets/audio/vox/impudent.mp3');
    game.load.audio('whoohoo', 'assets/audio/vox/whoohoo.mp3');
    game.load.audio('whoop', 'assets/audio/vox/whoop.mp3');
    game.load.audio('yes', 'assets/audio/vox/yes.mp3');
    game.load.audio('bump1', 'assets/audio/sfx/bump1.mp3');
    game.load.audio('bump2', 'assets/audio/sfx/bump2.mp3');
    game.load.audio('bump3', 'assets/audio/sfx/bump3.mp3');
    game.load.audio('bump4', 'assets/audio/sfx/bump4.mp3');
    game.load.audio('impWin', 'assets/audio/sfx/impWin.mp3');
    game.load.audio('impWin2', 'assets/audio/sfx/impWin2.mp3');
    game.load.audio('click', 'assets/audio/sfx/click.mp3');
    game.load.audio('crash', 'assets/audio/sfx/crash.mp3');


    // images
    game.load.image("background", "assets/bg/background.png");
    game.load.image("coneHor", "assets/sprites/spriteConeHorizontal.png");
    game.load.image("coneVert", "assets/sprites/spriteConeVertical.png");
    game.load.image("pentagram", "assets/sprites/pentagram.png");
    game.load.image("impress", "assets/sprites/impress.png");

    // spritesheets
    game.load.spritesheet('imp1', 'assets/sprites/sprite_imp_death_1.png', 676, 764, 4);
    game.load.spritesheet('imp2', 'assets/sprites/sprite_imp_death_2.png', 616, 669, 5);
    game.load.spritesheet('sheep', 'assets/sprites/sheep.png', 324, 473, 2);
    game.load.spritesheet('spider', 'assets/sprites/spider.png', 422, 490, 3);

    // scripts
    game.load.script('filter', 'assets/scripts/lib/Fire.js');
    game.load.script('gray', 'assets/scripts/lib/Gray.js');
  },
  create: function(){

    // Pretty
    var bgFlames = game.add.image(0, 0, "background");
    bgFlames.width = screenWidthX;
    bgFlames.height = screenWidthY;
    bgImage = game.add.image(0, 0, "background");
    bgImage.width = screenWidthX;
    bgImage.height = screenWidthY;

    filter = game.add.filter('Fire', screenWidthX, screenWidthY);
    filter.alpha = 0.0001;

    bgFlames.alpha = 0.1;


    // slowly reduce this value as the game gets closer to completion
    bgImage.alpha = 0.99;
    bgFlames.filters = [filter];


    // Init Physics system
    game.world.setBounds(-400, -400, 1600, 1200);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = physicsBaseRestitution;


    // Sounds good
    songMountain = game.add.audio('mountain');
    nuuuu = game.add.audio('nuuuu');
    i_made_it = game.add.audio('i_made_it');
    impaled = game.add.audio('impaled');
    impossible = game.add.audio('impossible');
    impressive = game.add.audio('impressive');
    impudent = game.add.audio('impudent');
    whoohoo = game.add.audio('whoohoo');
    yes = game.add.audio('yes');
    whoop = game.add.audio('whoop');
    bump1 = game.add.audio('bump1');
    bump2 = game.add.audio('bump2');
    bump3 = game.add.audio('bump3');
    bump4 = game.add.audio('bump4');
    impWin = game.add.audio('impWin');
    impWin2 = game.add.audio('impWin2');
    click = game.add.audio('click');
    crash = game.add.audio('crash');

    songMountain.play();


    // Create some objects, apply physics to entire Group
    coneGroup = game.physics.p2.createCollisionGroup();
    impGroup = game.add.physicsGroup(Phaser.Physics.P2JS);
    impGroup.z = 100;
    impCollisionGroup = game.physics.p2.createCollisionGroup();

    for (var i = 0; i < gameStartingImpCount; ++i){
      spawnImp(i === (gameStartingImpCount - 1));
    }


    setupDropoff();
    setupLevel();
    increaseGameSpeed();
  },
  update: function(){
    updateTimer();

    for (var i=0; i<impGroup.length; i++){
      pentImp = impGroup.children[i];
      if (pentImp.x < pentagram.x + pentagram.width &&
   pentImp.x + pentImp.width > pentagram.x &&
   pentImp.y < pentagram.y + pentagram.height &&
   pentImp.height + pentImp.y > pentagram.y){
     triggerSacrifice(pentImp);
   }
    }


    handleClickCircle();
    filter.update();
    if (clickLine.x !== 0){
      updateClickLine(clickNearestImp.x, clickNearestImp.y, game.input.x, game.input.y );
    }
  },
  render: function() {
    game.debug.geom(clickLine, '#ff0000');
    game.debug.geom(clickCircle,'#cfffff', false);

    for (var i=particles.length-1; i>0; i--){
      particle = particles[i];
      game.debug.geom(particle,'#af111c', true);
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.radius > 1){
        particle.radius -= 0.1;
        particle.vx *= 0.985;
        particle.vy *= 0.985;
      } else {
        particles.splice(i,1);
      }
    }

    for (var i=stars.length-1; i>0; i--){
      star = stars[i];
      game.debug.geom(star,'#FFD700', true);
      star.x += star.vx;
      star.y += star.vy;
      if (!star.shrink){
        star.radius += 0.35;
        star.vx *= 0.985;
        star.vy *= 0.985;
        if (star.radius > 18){
          star.shrink = true;
        }
      } else {
        star.radius -= 0.3;
        if (star.radius <1){
          stars.splice(i,1);
        }
      }
    }

  }
};


winGame.prototype = {
  preload: function() {
    game.load.image("winScreen", "assets/bg/WinScreen.png");
  },
  create: function(){
    var startScreen = game.add.image(0, 0, "winScreen");
    startScreen.width = screenWidthX;
    startScreen.height = screenWidthY;
  },
  update: function(){ }
};


loseGame.prototype = {
  preload: function() {
    game.load.image("loseScreen", "assets/bg/LoseScreen.png");
  },
  create: function(){
    var startScreen = game.add.image(0, 0, "loseScreen");
    startScreen.width = screenWidthX;
    startScreen.height = screenWidthY;
  },
  update: function(){ }
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
  // debugger;
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
  if (body && body.health) {
    body.health -= impBumpDamage;
    // bodyB.health -= impBumpDamage;
  } else if (bodyB && bodyB.health){
    bodyB.health -= impBumpDamage;
  } else if (this.body && this.body.health){
    this.body.health-= impBumpDamage;
  }
  playBump(); // boiiing
  playOuch(); // sometimes says ouch


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
    clickNearestImp.turnToTarget = e;
    clickCircle.setTo(e.x, e.y, 2);
    click.play();
  };
}

function addBlobs(e, num){
  var blob;
  for (var i=0; i<num; i++){
    blob = new Phaser.Circle(e.x + Math.floor((Math.random() * 40) - 20),e.y + Math.floor((Math.random() * 40) - 20), Math.floor((Math.random() * 20) + 10));
    blob.vx = (blob.x-e.x) /10;//  (Math.random() * 4) - 2;
    blob.vy = (blob.y-e.y) /10; // (Math.random() * 4) - 2;
    particles.push(blob);
  }
}

function addStars(e, num){
  var blob;
  for (var i=0; i<num; i++){
    blob = new Phaser.Circle(e.x + Math.floor((Math.random() * 40) - 20),e.y + Math.floor((Math.random() * 40) - 20), Math.floor((Math.random() * 20) + 10));
    blob.vx = (blob.x-e.x) /6;//  (Math.random() * 4) - 2;
    blob.vy = (blob.y-e.y) /6; // (Math.random() * 4) - 2;
    stars.push(blob);
  }
}




function setupDropoff() {

  // Add the image
  var coneLine1 = game.add.sprite(200, 140, 'coneHor');
  var coneLine2 = game.add.sprite(200, 320, 'coneHor');
  var coneLine3 = game.add.sprite(20, 230, 'coneVert');
  pentagram = game.add.sprite(55, 167, 'pentagram');
  impress = game.add.sprite(60, 10, 'impress');
  impress.scale.setTo(0.7, 0.7);
  impress.visible = false;



  //  Enable if for physics. This creates a default rectangular body.
  game.physics.p2.enable( [ coneLine1, coneLine2, coneLine3 ]);

  // Immovable object
  coneLine1.body.static = true;
  coneLine2.body.static = true;
  coneLine3.body.static = true;

}

function updateClickLine(x1, y1, x2, y2){
  clickLine.start.x = x1;
  clickLine.start.y = y1;
  clickLine.end.x =  x2;
  clickLine.end.y =y2;
}


function accelerateToObject(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = impBaseThrust; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
    obj1.body.force.y = Math.sin(angle) * speed;
}


function turnToFace(obj1, obj2) {

  var point1 = new Phaser.Point(obj1.x, obj1.y);
  var point2 = new Phaser.Point(obj2.x, obj2.y);
  var targetAngle = point1.angle(point2) + game.math.degToRad(90);
  var difference = targetAngle - obj1.body.rotation;

  if (difference > game.math.PI)
  {
      difference = ((2 * game.math) - difference);
  }
  if (difference < -game.math)
  {
      difference = ((2 * game.math) + difference);
  }

  // Move the character's rotation a set amount per unit time
  var delta = (difference < 0) ? -rotationChangePerSecond : rotationChangePerSecond;
  var rotateDiff = delta * timeSinceLastTick;
  obj1.body.rotation += rotateDiff;

}


function handleClickCircle(){
  if (clickCircle.radius >= 35){
    clickCircle.setTo(0, 0, 0);
  } else if (clickCircle.radius > 0){
    clickCircle.radius += 2;
  }
}


function playBump(point){
  var result = Math.floor((Math.random() * 4) + 1);
  if (result ===1){
    bump1.play();
  } else if (result ===2){
    bump2.play();
  } else if (result ===3){
    bump3.play();
  } else if (result === 4){
    bump4.play();
  }
}

function playOuch(point, gender){
  var result = Math.floor((Math.random() * 6) + 1);
  if (result ===1){
    impudent.play();
  } else if (result ===2){
    nuuuu.play();
  } else if (result ===3){
    whoop.play();
  }
}


function spawnImp(schedule) {

  // Do we want to run a random check
  //  if schedule is false then it is initial spawns
  var canSpawn = false;
  if(!schedule) {
    canSpawn = true;
  } else {
    var spawnRndChecker = game.rnd.integerInRange(1, 6);
    if(spawnRndChecker < 3) {
      canSpawn = true;
    }
  }


  if(canSpawn) {
    var imp = new Imp(game, impGroup, impCollisionGroup, impGroup.length, coneGroup);
    game.add.existing(imp);
    impGroup.add(imp);
  }


  if(schedule) {
    game.time.events.add(gameImpSpawnTime, function(){
      spawnImp(true);
    }, this);
  }
}


function triggerSacrifice(imp) {
  addStars({x:imp.x, y:imp.y}, Math.floor((Math.random() * 8) + 6));
  if (Math.floor((Math.random() * 2)) == true){
    i_made_it.play();
  } else {
    yes.play();
  }
  if (Math.floor((Math.random() * 2)) == true){
    impWin.play();
  } else {
    impWin2.play();
  }
   Math.floor((Math.random() * 2));
  bgImage.alpha -= 1/gameWinCount;
  if (bgImage.alpha <0.1){
    // win condition triggered;
    impress.visible = true;
    game.time.events.add(2000, function(){
      game.state.start("WinGame");
    }, this);
  }

  imp.destroy();
}

function impDeath(){
  impDeaths ++;

  if (impDeaths >= gameLoseCount){
    // game lose condition
    game.state.start("LoseGame");
  }
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


function increaseGameSpeed() {
  gameSpeedMultiplier += 0.01;

  // Increase spawn rate of imps
  gameImpSpawnTime -= 180 * gameSpeedMultiplier;
  if(gameImpSpawnTime < minimumImpSpawnTime) {
    gameImpSpawnTime = minimumImpSpawnTime;
  }

  // Scale up speeds
  impBaseThrust *= (gameSpeedMultiplier * 1.18);
  impMaxVelocity *= gameImpSpawnTime;
  if(impBaseThrust > maxThrustScaled) {
    impBaseThrust = maxThrustScaled;
  }
  if(impMaxVelocity > maxVelocityScaled) {
    impMaxVelocity = maxVelocityScaled;
  }


  // Schedule the increase constantly
  game.time.events.add(gameSpeedIncreaseTimer, function(){
    increaseGameSpeed();
  }, this);
}
