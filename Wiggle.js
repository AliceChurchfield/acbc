/**
 * Wiggle.js
 * 
 * @file
 *   Adds a visible wiggle to a character who wiggles their body
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Wiggle.js outside of acbc.js");
  window.ACBC = {};
}



ACBC.Wiggling = false;
ACBC.WiggleTimer = 0;
ACBC.WiggleDuration = 2;  // in s
ACBC.WiggleAmplitude = 10;


/**
 * Makes a character begin wiggling
 * @param {Character|string} C
 *   The character to wiggle
 * @returns {void}
 *   Nothing
 */
ACBC.BeginWiggling = function(C)
{
  C = ACBC.Find(C);
  if (!C) return;
  if (!C.ACBC) C.ACBC = {};

  C.ACBC.Wiggling = true;
  C.ACBC.WiggleTimer = 0;

  setTimeout(ACBC.EndWiggling, ACBC.WiggleDuration, C);
};


/**
 * Draws the character with their position modified as necessary by wiggling
 * @param {Array} args - The arguments to pass to next
 * @param {(args: Array) => void} next - The next function in the hook chain
 * @returns {void} - Nothing
 */
ACBC.DrawCharacterWithWiggle = function(args, next)
{
  /** @type {Character} */
  let C = args[0];

  if (C?.ACBC?.Wiggling)
  {
    C.ACBC.WiggleTimer += TimerRunInterval / 1000;

    let t = ACBC.WiggleTimer / ACBC.WiggleDuration
    args[1] += ACBC.WiggleX(t);
  }

  return next(args);
};


/**
 * Calculates the X offset of a wiggling character
 * @param {number} t
 *   The timer value, normalized by its period
 * @returns {number}
 *   The correct offset
 */
ACBC.WiggleX = function(t)
{
  let n = 6;  // number of wiggles to do
  let leftL = t => 8 * t * t;
  let leftM = t => 1 - leftL(t - 0.5);
  let leftR = t => leftL(t - 1);
  let left = t < 1/4 ? leftL(t) : (t < 3/4 ? leftM(t) : leftR(t));
  let right = Math.sin(2 * Math.PI * n * t);
  return left * right * ACBC.WiggleAmplitude;
};


/**
 * Makes a character stop wiggling. Called automatically as a
 * setTimeout callback from BeginWiggling.
 * @param {Character} C
 *   The character to stop wiggling
 * @returns {void}
 *   Nothing
 */
ACBC.EndWiggling = function(C)
{
  C = ACBC.Find(C);
  if (!C) return;
  if (!C.ACBC) C.ACBC = {};

  C.ACBC.Wiggling = false;
};


ACBC.ModApi.hookFunction("DrawCharacter", 0, (args, next) =>
{
  return ACBC.DrawCharacterWithWiggle(args, next);
});


console.log(" * Wiggle.js loaded.");
