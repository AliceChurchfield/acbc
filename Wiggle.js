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
 * The type of the DrawCharacter function
 * @callback DrawCharacterFunction
 * @param {Character} C - Character to draw
 * @param {number} X - Position of the character on the X axis
 * @param {number} Y - Position of the character on the Y axis
 * @param {number} Zoom - Zoom factor
 * @param {boolean} [IsHeightResizeAllowed=true] - Whether or not the settings allow for the height modifier to be applied
 * @param {CanvasRenderingContext2D} [DrawCanvas] - The canvas to draw to; If undefined `MainCanvas` is used
 * @returns {void} - Nothing
 */

/**
 * Draws the character with their position modified as necessary by wiggling
 * @param {DrawCharacterFunction} next - The next function in the hook chain
 * @param {Character} C - Character to draw
 * @param {number} X - Position of the character on the X axis
 * @param {number} Y - Position of the character on the Y axis
 * @param {number} Zoom - Zoom factor
 * @param {boolean} [IsHeightResizeAllowed=true] - Whether or not the settings allow for the height modifier to be applied
 * @param {CanvasRenderingContext2D} [DrawCanvas] - The canvas to draw to; If undefined `MainCanvas` is used
 * @returns {void} - Nothing
 */
ACBC.WiggleCharacter = function(next, C, X, Y, Zoom, IsHeightResizeAllowed, DrawCanvas)
{
  if (!C?.ACBC?.Wiggling)
    return next(C, X, Y, Zoom, IsHeightResizeAllowed, DrawCanvas);
  
  X += 100;
  return next(C, X, Y, Zoom, IsHeightResizeAllowed, DrawCanvas);
}

ACBC.ModApi.hookFunction("DrawCharacter", 0, (args, next) =>
{
  return ACBC.WiggleCharacter(next, ...args);
});


console.log(" * Wiggle.js loaded.");
