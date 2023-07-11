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


ACBC.Tx = class Tx extends ACBC.Component
{
  /** @todo Come up with a better way to have default values for classes */
  /**
   * @type {number}
   * How far across the character is the pivot point
   */
  OriginX;
  /**
   * @type {number}
   * How far down the character is the pivot point
   */
  OriginY;
  /**
   * @type {number}
   * H position relative to wherever you'd otherwise be. Positive is right
   */
  PosX;
  /**
   * @type {number}
   * V position relative to wherever you'd otherwise be. Positive is down
   */
  PosY;
  /**
   * @type {number}
   * Width relative to whatever scale you'd otherwise have
   */
  ScaleX;
  /**
   * @type {number}
   * Height relative to whatever scale you'd otherwise have
   */
  ScaleY;

  /**
   * @param {ACBC.Acbca} owner 
   */
  constructor(owner)
  {
    super(owner);
    this.Reset();
  }

  /**
   * Returns whether this Tx has changed at all from its defaults
   * @returns {boolean}
   */
  IsActive()
  {
    /** @todo Maybe make this compare these properties to the defaults? */
    return this.PosX !== 0 || this.PosY !== 0 ||
           this.ScaleX !== 1 || this.ScaleY !== 1;
  }

  Reset()
  {
    this.OriginX = 0.5;
    this.OriginY = 0.98;
    this.PosX = 0;
    this.PosY = 0;
    this.ScaleX = 1;
    this.ScaleY = 1;
  }
};


ACBC.ActiveTx = null;


ACBC.DrawCharacterTx = function(args, next)
{
  /** @type {Character} */
  let C = args[0];

  ACBC.ActiveTx = C?.Acbca?.Tx;
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
  /** @type {ACBC.Tx} */
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


ACBC.HookFunction("DrawCharacter", -100, ACBC.DrawCharacterTx, "Transform");
ACBC.HookFunction("DrawImageEx", -100, ACBC.DrawImageExTx, "Transform");


console.log(" * Transform.js loaded.");
