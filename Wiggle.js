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

/**
 * Draws the character with their position modified as necessary by wiggling
 * @param {Array} args - The arguments to pass to next
 * @param {(args: Array) => void} next - The next function in the hook chain
 * @returns {void} - Nothing
 */
ACBC.WiggleCharacter = function(args, next)
{
  /** @type {Character} */
  let C = args[0];
  /** @type {number} */
  let X = args[1];
  /** @type {number} */
  let Y = args[2];
  /** @type {number} */
  let Zoom = args[3];
  /** @type {boolean} */
  let IsHeightResizeAllowed = args[4];
  /** @type {CanvasRenderingContext2D} */
  let DrawCanvas = args[5];
  return next(args);
}

ACBC.ModApi.hookFunction("DrawCharacter", 0, (args, next) =>
{
  return ACBC.WiggleCharacter(args, next);
});


console.log(" * Wiggle.js loaded.");
