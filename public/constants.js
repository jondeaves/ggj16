// World
var physicsBaseRestitution = 3;           // Bounce strength
var worldBoundsOffset = 100;            // An offset to stop imp return to centre until totally off screen


// Imps
var rotationChangePerSecond = 0.0025;
var impBaseThrust = 50;                         // Acceleration
var impBaseDamping = 6;                   // Deceleration
var impScaleLimits = [0.08, 0.12];             // Negative value will mess up collision box
var turnToTargetOffset = 30;                   // Distance before removing turn to target
