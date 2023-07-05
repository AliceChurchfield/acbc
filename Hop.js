/**
 * Hop.js
 * 
 * @file
 *   Sets up a "hopping up and down" action and provides animation for it
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Hop.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.Hop = class Hop extends ACBC.Component
{
  
};


ACBC.Hopping = false;
ACBC.VelX = 0;
ACBC.VelY = 0;
ACBC.HopVelY = -100;  // in units / s -- N.B. -Y is up
ACBC.HopGravity = 100;  // in units / s^2
ACBC.HopGroundY = null;  // null until it's used the first time
ACBC.HopPreSquishDuration = 0.2;  // in s
ACBC.HopPreSquishScaleX = 1.05;
ACBC.HopPreSquishScaleY = 0.95;
ACBC.HopPostSquishDuration = 0.1; // in s
ACBC.HopPostSquishScaleX = 1.02;
ACBC.HopPostSquishScaleY = 0.98;


ACBC.DrawCharacterWithHop = function(args, next)
{
  return next(args);
}


ACBC.HookFunction("DrawCharacter", 0, ACBC.DrawCharacterWithHop);


console.log(" * Hop.js loaded.");
