/**
 * Transform.js
 * 
 * @file
 *   Defines the Transform pseudo-component for an ACBC character
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Transform.js outside of acbc.js");
  window.ACBC = {};
}


if (ACBC.Classes === undefined) ACBC.Classes = {};


ACBC.Classes.Tx = class
{
  PosX = 0;   // Relative to wherever vanilla BC would otherwise put you
  PosY = 0;   // Relative to wherever vanilla BC would otherwise put you
  ScaleX = 1; // Relative to whatever scale you'd otherwise have
  ScaleY = 1; // Relative to whatever scale you'd otherwise have
};


if (ACBC.Tx === undefined) ACBC.Tx = new ACBC.Classes.Tx();


ACBC.DrawCharacterTx = function(args, next)
{
  /** @type {Character} */
  let C = args[0];

  if (C?.ACBC)
  {
    let canvas = args[5];
    if (canvas)
      canvas.ACBC = C.ACBC;
  }

  return next(args);
};


/**
 * Modifies an image's position and scale based on any ACBC Tx data it may have
 * @param {Array} args - The arguments to pass to next
 * @param {(args: Array) => void} next - The next function in the hook chain
 * @returns {boolean} - Whether the image was complete or not
 */
ACBC.DrawImageExTx = function(args, next)
{
  let opts = args[3];
  /** @type {ACBC.Classes.Tx} */
  let activeTx = opts?.Canvas?.ACBC?.Tx;

  if (activeTx)
  {
    opts.Width = opts.Width || opts.SourcePos?.[2] || args[0].width;
    opts.Height = opts.Height || opts.SourcePos?.[3] || args[0].height;

    args[1] += activeTx.PosX;
    args[2] += activeTx.PosY;
    opts.Width *= activeTx.ScaleX;
    opts.Height *= activeTx.ScaleY;
    args[3] = opts;
  }

  return next(args);
};


ACBC.HookFunction("DrawImageEx", 0, ACBC.DrawImageExTx);
ACBC.HookFunction("DrawCharacter", 0, ACBC.DrawCharacterTx);


console.log(" * Transform.js loaded.");
