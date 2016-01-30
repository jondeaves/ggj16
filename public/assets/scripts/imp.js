var Imp = function (game, objectGroup, collisionGroup, index) {

    var impScale = game.rnd.realInRange(impScaleLimits[0], impScaleLimits[1]);
    // var impRotation = game.rnd.integerInRange(0, 360);
    var impRotation = 0;
    var impSprite = game.rnd.integerInRange(1, 2);
    var frames = game.cache.getFrameData('imp'+impSprite).getFrames();
    var impSpawn = getSpawnLocation();

    // Init Object
    // Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, "imp"+impSprite);
    Phaser.Sprite.call(this, game, impSpawn.position.x, impSpawn.position.y, "imp"+impSprite);
    game.physics.p2.enable(this, false);
    objectGroup.add(this);

    // Setup Object
    this.scale.setTo(impScale, impScale);
    this.body.setCircle((frames[0].width * impScale) / 3.3);
    this.body.damping = (impBaseDamping * impScale);
    this.body.rotation = impSpawn.rotation;
    // this.body.rotation = (180/Math.PI) * impRotation;
    this.id='imp_'+index;
    // setting anchor forwards creates a swinging effect on rotation
    this.anchor.y = 0.33


    // Set-up Collisions
    this.body.setCollisionGroup(collisionGroup);
    this.body.collideWorldBounds = false;
    this.body.collides([collisionGroup]);
    this.body.onBeginContact.add(objectCollision, this);


    // Animate
    this.animations.add('walk');
    this.animations.play('walk', 10, true);

};
Imp.prototype = Object.create(Phaser.Sprite.prototype);
Imp.prototype.constructor = Imp;
Imp.prototype.turnToTarget = null;
Imp.prototype.update = function() {

  // Bring back into the world if this has escaped
  var turnToTargetLocal = this.turnToTarget;
  var isOutside =
    (this.x+this.width < 0 - worldBoundsOffset) || // off to left
    (this.y+this.height < 0 - worldBoundsOffset) || // off to top
    (this.x > game.width + worldBoundsOffset) || // off to right
    (this.y > game.height + worldBoundsOffset); // off to left

  if(isOutside) {
    console.log('is outside');
    turnToTargetLocal = null;
    var point1 = new Phaser.Point(this.x, this.y);
    var point2 = new Phaser.Point(game.width / 2, game.height / 2);
    var targetAngle = point1.angle(point2) + game.math.degToRad(90);
    this.body.rotation = targetAngle;
    // turnToTargetLocal = { x: game.width / 2, y: game.height / 2};
  }


  // Got somewhere to go? Or are you just driftwood?
  if(turnToTargetLocal !== null) {
    accelerateToObject(this, turnToTargetLocal, impBaseThrust);
    turnToFace(this, turnToTargetLocal);
    var distanceFromTarget = getDistance(this, turnToTargetLocal);
    if(distanceFromTarget < turnToTargetOffset) {
      this.turnToTarget = null;
    }

  } else {
      this.body.thrust(impBaseThrust);
  }

};

function getSpawnLocation(){
    var theReturn = {
      position : {
        x: 0,
        y: 0
      },
      rotation: 0
    }
    var result = Math.floor((Math.random() * 3) + 1);
    if (result ===1){ // top wall
      theReturn.position.y = 10;
      theReturn.position.x = game.world.randomX;
      theReturn.rotation = (Math.random() * 2)+2;
    // } else if (result ===2){ // left wall
    //   theReturn.position.y = game.world.randomY;
    //   theReturn.position.x = 10;
    //   theReturn.rotation = (Math.random() * 2)+0.5;
    // }
  } else if (result ===2){ // bottom wall
      theReturn.position.y = screenWidthY -10;
      theReturn.position.x = game.world.randomX;
      theReturn.rotation = (Math.random() * 2)-1
    } else if (result ===3){ // right wall
      theReturn.position.y = game.world.randomY;
      theReturn.position.x = screenWidthX-10;
      theReturn.rotation = (Math.random() * 2.8)+2.5;
    }

    return theReturn;

}
