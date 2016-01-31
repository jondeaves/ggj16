// World
var physicsBaseRestitution = 5;           // Bounce strength
var worldBoundsOffset = 50;            // An offset to stop imp return to centre until totally off screen
var screenWidthX = 800;
var screenWidthY = 480;
var gameStartingImpCount = 2;
var gameImpSpawnTime = 2500;
var gameSpeedMultiplier = 1;
var gameSpeedIncreaseTimer = 2000;

var minimumImpSpawnTime = 300;
var maxThrustScaled = 500;
var maxVelocityScaled = 15;
var gameLoseCount = 20;  // number of imp fatalities until game fail
var gameWinCount = 40;  // number of imp fatalities until game fail

// Imps
var rotationChangePerSecond = 0.0025;
var impBaseThrust = 50;                         // Acceleration
var impBaseDamping = 6;                   // Deceleration
var impScaleLimits = [0.08, 0.12];             // Negative value will mess up collision box
var turnToTargetOffset = 30;                   // Distance before removing turn to target
var impMaxVelocity = 5;

var impStartHealth = 110;                   // This divided by impTTL defines how much health is lost per second
var impTTL = 30;                              // How long imp lives for
var impBumpDamage = 15;               // Amount of dmanage from collision

var impDeathSequenceLength = 1000;      // Milliseconds death lasts
var impDeathSpinSpeed = 8;
var impDeathSpinSpeedIncrement = 0.075;   // Speed increase by this much each time
var impDeathScaleSpeed = 0.001;





 var gameWinOpacityIncrease = 0.025;
