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
ACBC.WiggleDuration = 2500;  // in ms
ACBC.WiggleAmplitude = 10;
ACBC.WiggleCount = 6;
ACBC.WiggleFrequency = 3; // in Hz


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
  if (!C?.Acbca) return;

  ACBC.Wiggling = true;
  ACBC.WiggleTimer = 0;

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

  if (C?.Acbca?.Wiggling)
  {
    ACBC.WiggleTimer += TimerRunInterval;

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
  let n = ACBC.WiggleCount;  // number of wiggles to do
  let i = 2 * t - 1;
  let envelope = 1 - i * i * i;
  let wave = Math.sin(2 * Math.PI * n * t);
  return envelope * wave * ACBC.WiggleAmplitude;
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
  if (!C.Acbca) C.Acbca = {};

  C.Acbca.Wiggling = false;
};


ACBC.HookFunction("DrawCharacter", 0, ACBC.DrawCharacterWithWiggle);


console.log(" * Wiggle.js loaded.");
