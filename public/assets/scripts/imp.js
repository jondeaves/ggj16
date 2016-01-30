var Imp = function (game, objectGroup, collisionGroup, index) {


    var impScale = game.rnd.realInRange(impScaleLimits[0], impScaleLimits[1]);
    var impRotation = game.rnd.integerInRange(0, 360);
    var impSprite = game.rnd.integerInRange(1, 2);
    var frames = game.cache.getFrameData('imp'+impSprite).getFrames();

    // Init Object
    Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, "imp"+impSprite);
    game.physics.p2.enable(this, false);
    objectGroup.add(this);


    // Setup Object
    this.scale.setTo(impScale, impScale);
    this.body.setCircle((frames[0].width * impScale) / 3.3);
    this.body.damping = (impBaseDamping * impScale);
    this.body.rotation = (180/Math.PI) * impRotation;
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
  var isOutside = (this.x+this.width < 0) || (this.y+this.height < 0) ||  (this.x > game.width) || (this.y > game.height);
  if(isOutside) {
    turnToTargetLocal = { x: game.width / 2, y: game.height / 2};
    // console.log(turnToTargetLocal);
  }


  // Got somewhere to go? Or are you just driftwood?
  if(this.turnToTarget !== null) {
    // console.log(this.turnToTarget);
    accelerateToObject(this, turnToTargetLocal, impBaseThrust);
    var distance = getDistance(this, turnToTargetLocal);
    if(distance < turnToTargetOffset) {
      this.turnToTarget = null;
    }

    // var targetAngle = this.game.math.angleBetween(this.x, this.y, turnToTargetLocal.x, turnToTargetLocal.y);
    // console.log(targetAngle * (180/Math.PI));
    // this.body.rotation = (180/Math.PI) * targetAngle;
  } else {
      this.body.thrust(impBaseThrust);
  }
};
