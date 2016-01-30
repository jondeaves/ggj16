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
    this.body.setCircle((frames[0].width * impScale) / 2);
    this.body.damping = (impBaseDamping * impScale);
    this.body.rotation = (180/Math.PI) * impRotation;
    this.id='imp_'+index;


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
Imp.prototype.update = function() {

  this.body.thrust(impBaseThrust);

  // Bring back into the world if this has escaped
  var isOutside = (this.x+this.width < 0) || (this.y+this.height < 0) ||  (this.x > game.width) || (this.y > game.height);
  if(isOutside) {
    var targetAngle = this.game.math.angleBetween(this.x, this.y, game.width / 2, game.height / 2);
    this.body.rotation = (180/Math.PI) * targetAngle;
  }
};
