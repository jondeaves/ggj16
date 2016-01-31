// World
var physicsBaseRestitution = 3;           // Bounce strength
var worldBoundsOffset = 50;            // An offset to stop imp return to centre until totally off screen
var screenWidthX = 800;
var screenWidthY = 480;
var gameStartingImpCount = 2;
var gameImpSpawnTime = 2000;
var gameSpeedMultiplier = 1;
var gameSpeedIncreaseTimer = 2000;

var minimumImpSpawnTime = 800;
var maxThrustScaled = 500;
var maxVelocityScaled = 15;

// Imps
var rotationChangePerSecond = 0.0025;
var impBaseThrust = 50;                         // Acceleration
var impBaseDamping = 6;                   // Deceleration
var impScaleLimits = [0.08, 0.12];             // Negative value will mess up collision box
var turnToTargetOffset = 30;                   // Distance before removing turn to target
var impMaxVelocity = 5;

var impStartHealth = 100;                   // This divided by impTTL defines how much health is lost per second
var impTTL = 30;                              // How long imp lives for
var impBumpDamage = 10;               // Amount of dmanage from collision

var impDeathSequenceLength = 2400;      // Milliseconds death lasts
var impDeathSpinSpeed = 5;
var impDeathSpinSpeedIncrement = 0.04;   // Speed increase by this much each time
var impDeathScaleSpeed = 0.00028;
