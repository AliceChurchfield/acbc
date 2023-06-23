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
  OriginX = 0.5;  // How far across the character is the pivot point
  OriginY = 0.98; // How far down the character is the pivot point
  PosX = 0;   // Relative to wherever vanilla BC would otherwise put you
  PosY = 0;   // Relative to wherever vanilla BC would otherwise put you
  ScaleX = 1; // Relative to whatever scale you'd otherwise have
  ScaleY = 1; // Relative to whatever scale you'd otherwise have

  IsActive()
  {
    return this.PosX !== 0 || this.PosY !== 0 ||
           this.ScaleX !== 1 || this.ScaleY !== 1;
  }
};


if (ACBC.Tx === undefined) ACBC.Tx = new ACBC.Classes.Tx();
ACBC.ActiveTx = null;


ACBC.DrawCharacterTx = function(args, next)
{
  /** @type {Character} */
  let C = args[0];

  ACBC.ActiveTx = C?.ACBC?.Tx;
  let returnVal = next(args);
  ACBC.ActiveTx = null;

  return returnVal;
};


/**
 * Modifies an image's position and scale based on any ACBC Tx data it may have
 * @param {Array} args - The arguments to pass to next
 * @param {(args: Array) => void} next - The next function in the hook chain
 * @returns {boolean} - Whether the image was complete or not
 */
ACBC.DrawImageExTx = function(args, next)
{
  let opts = args[3] || {};
  /** @type {ACBC.Classes.Tx} */
  let activeTx = ACBC.ActiveTx;

  if (activeTx)
  {
    opts.Width = opts.Width || opts.SourcePos?.[2] || args[0].width;
    opts.Height = opts.Height || opts.SourcePos?.[3] || args[0].height;

    let originalWidth = opts.Width;
    let originalHeight = opts.Height;
    opts.Width *= activeTx.ScaleX;
    opts.Height *= activeTx.ScaleY;
    let dW = opts.Width - originalWidth;
    let dH = opts.Height - originalHeight;
    args[1] += activeTx.PosX - dW * activeTx.OriginX;
    args[2] += activeTx.PosY - dH * activeTx.OriginY;
    args[3] = opts;
  }

  return next(args);
};


ACBC.HookFunction("DrawImageEx", -100, ACBC.DrawImageExTx);
ACBC.HookFunction("DrawCharacter", -100, ACBC.DrawCharacterTx);


console.log(" * Transform.js loaded.");
