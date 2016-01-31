var Imp = function (game, objectGroup, collisionGroup, index, coneGroup) {

    var impScale = game.rnd.realInRange(impScaleLimits[0], impScaleLimits[1]);
    // var impRotation = game.rnd.integerInRange(0, 360);
    var impRotation = 0;
    var impSprite = game.rnd.integerInRange(1, 2);
    var impSpriteKey = 'imp';
    var frames = game.cache.getFrameData(impSpriteKey+impSprite).getFrames();
    var impSpawn = getSpawnLocation();

    // Init Object
    // Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, "imp"+impSprite);
    Phaser.Sprite.call(this, game, impSpawn.position.x, impSpawn.position.y, impSpriteKey+impSprite);
    game.physics.p2.enable(this, false);
    objectGroup.add(this);

    // Setup Object
    this.deathSpinSpeed = impDeathSpinSpeed;
    this.scale.setTo(impScale, impScale);
    this.body.setCircle((frames[0].width * impScale) / 3.3);
    this.body.damping = (impBaseDamping * impScale);
    this.body.rotation = impSpawn.rotation;
    this.body.health = impStartHealth;
    // this.body.rotation = (180/Math.PI) * impRotation;
    this.id='imp_'+index;
    // setting anchor forwards creates a swinging effect on rotation
    this.anchor.y = 0.33


    // Set-up Collisions
    // this.body.setCollisionGroup(collisionGroup);
    // this.body.collideWorldBounds = false;
    // this.body.collides([collisionGroup, coneGroup]);
    // this.body.onBeginContact.add(objectCollision, this);


    // Animate
    var deathFrame = (impSprite === 1) ? 3 : 4;
    this.animations.add('walk', [0, 1, 2]);
    this.animations.add('death', [deathFrame]);
    this.animations.play('walk', 10, true);


    game.time.events.add(1000, function(){
        updateImpHealth(this);
    }, this);

};
Imp.prototype = Object.create(Phaser.Sprite.prototype);
Imp.prototype.constructor = Imp;
Imp.prototype.turnToTarget = null;
Imp.prototype.isDying = false;
Imp.prototype.update = function() {

  // Bring back into the world if this has escaped
  var turnToTargetLocal = this.turnToTarget;
  var isOutside =
    (this.x+this.width < 0 - worldBoundsOffset) || // off to left
    (this.y+this.height < 0 - worldBoundsOffset) || // off to top
    (this.x > game.width + worldBoundsOffset) || // off to right
    (this.y > game.height + worldBoundsOffset); // off to left

  if(isOutside) {
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


  // Limit max speed
  constrainVelocity(this, impMaxVelocity);


  // Health check
  if(this.body.health <= 0 && !this.isDying) {
    this.isDying = true;
    impaled.play();
    this.animations.play('death', 10, true);

    game.time.events.add(impDeathSequenceLength, function(){
      this.destroy();
      this.isDying = false;
    }, this);

  }


  if(this.isDying) {
    this.body.rotation += game.math.degToRad(this.deathSpinSpeed);
    var newScaleX = this.scale.x - impDeathScaleSpeed;
    var newScaleY = this.scale.y - impDeathScaleSpeed;

    this.scale.setTo(newScaleX, newScaleY);
    this.deathSpinSpeed += impDeathSpinSpeedIncrement;
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


function updateImpHealth(imp) {

  if(imp.body !== null) {
    var healthLossPerSecond = impStartHealth / impTTL;
    imp.body.health -= healthLossPerSecond;

    // Keep the loop going every second
    if(imp.body.health > 0) {
      game.time.events.add(1000, function(){
        updateImpHealth(imp);
      }, this);
    }
  }
}


/*
 * @source http://www.html5gamedevs.com/topic/4723-p2-physics-limit-the-speed-of-a-sprite/
 */
 function constrainVelocity(sprite, maxVelocity) {
   var body = sprite.body;
   var angle, currVelocitySqr, vx, vy;

   vx = body.data.velocity[0];
   vy = body.data.velocity[1];

   currVelocitySqr = vx * vx + vy * vy;

   if (currVelocitySqr > maxVelocity * maxVelocity) {
     angle = Math.atan2(vy, vx);

     vx = Math.cos(angle) * maxVelocity;
     vy = Math.sin(angle) * maxVelocity;

     body.data.velocity[0] = vx;
     body.data.velocity[1] = vy;
   }

 }
