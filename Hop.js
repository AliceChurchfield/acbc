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
  static SpeedBase = 100;
  static SpeedVariance = 30;
  static SquishAspectRatio = 2; // X / Y
  static PostSquishFactor = 1;
  static get MaxHopSpeed()
  { return ACBC.Hop.SpeedBase + ACBC.Hop.SpeedVariance; }
  static get MaxHopEnergy()
  { return ACBC.Hop.ComputeEnergy(ACBC.Hop.MaxHopSpeed); }
  
  /**
   * Calculates and returns the amount of energy to produce the given speed
   * @param {number} speed 
   * @returns {number}
   */
  static ComputeEnergy(speed)
  {
    return (speed * speed) / 2;
  }

  /**
   * @type {number}
   * Amount to squish at or above MaxHopEnergy
   */
  Squishiness;
  /**
   * @type {number}
   * How long in seconds it would take to complete a squish of factor 1
   */
  SquishDurationScale;

  /** @type {boolean} */
  Hopping;
  /** @type {boolean} */
  Grounded;
  /** @type {number?} */
  GroundY;
  /** @type {number} */
  HopsRemaining;
  /** @type {number} */
  CurrentChainSize;
  /** @type {number} */
  CurrentHopSpeed;

  constructor(owner)
  {
    super(owner);
    this.Reset();
  }

  get CurrentEnergy() { return ACBC.Hop.ComputeEnergy(this.CurrentHopSpeed); }

  LateUpdate()
  {
    if (!this.Grounded && this.Owner.Tx.PosY >= this.GroundY)
      this.Land();
  }

  /**
   * Calculates and stores the speed of the current hop, based on random
   * variance and where we are in the current hop chain
   * @returns {void}
   */
  ComputeHopSpeed()
  {
    let speed = ACBC.RandomVariance(ACBC.Hop.SpeedBase, ACBC.Hop.SpeedVariance);
    let scalar = 1;

    let hopDelta = this.CurrentChainSize - this.HopsRemaining;
    if (hopDelta > 0)
    {
      /** @todo Consider generalizing this formula */
      let denominator = 2 * (this.CurrentChainSize - 1);
      let numerator = denominator - hopDelta;
      scalar = numerator / denominator;
    }

    this.CurrentHopSpeed = speed * scalar;
  }

  /**
   * Calculates and returns the squish factor resulting from the given energy
   * @param {number} energy 
   * @returns {number}
   */
  ComputeSquish(energy)
  {
    /** @todo Consider an asymptotic function for energy vs. squish amount */
    return this.Squishiness * energy / ACBC.Hop.MaxHopEnergy;
  }

  Hop(count = 1)
  {
    this.CurrentChainSize = this.HopsRemaining = count;

    if (this.Hopping) return;

    this.Hopping = true;
    this.GroundY = this.Owner.Tx.PosY;
    this.PreSquish();
  }

  PreSquish()
  {
    this.ComputeHopSpeed();

    let squishFactor = this.ComputeSquish(this.CurrentEnergy);
    let squishScaleX = 1 + squishFactor;
    let squishScaleY = 1 - squishFactor / ACBC.Hop.SquishAspectRatio;
    let duration = this.SquishDurationScale * squishFactor;
    let seq = this.Owner.Plans.Sequence();
    let grp = seq.Group();
    grp.Property(this.Owner.Tx, "ScaleX", squishScaleX,
      duration, new ACBC.Curve(ACBC.Curve.Pulse, 2), true);
    grp.Property(this.Owner.Tx, "ScaleY", squishScaleY,
      duration, new ACBC.Curve(ACBC.Curve.Pulse, 2), true);
    seq.Call(this.BeginRising);
  }

  BeginRising()
  {
    this.Grounded = false;
    this.Owner.Body.SetVelY(this.CurrentHopSpeed);
  }

  Land()
  {
    this.Owner.Body.SetVelY(0);
    this.Grounded = true;
    --this.HopsRemaining;

    if (this.HopsRemaining > 0)
    {
      this.PreSquish();
    }
    else
    {
      this.PostSquish();
    }
  }

  PostSquish()
  {
    let squishFactor = this.ComputeSquish(this.CurrentEnergy) *
      ACBC.Hop.PostSquishFactor;
    let squishScaleX = 1 + squishFactor;
    let squishScaleY = 1 - squishFactor / ACBC.Hop.SquishAspectRatio;
    let duration = this.SquishDurationScale * squishFactor;
    let seq = this.Owner.Plans.Sequence();
    let grp = seq.Group();
    grp.Property(this.Owner.Tx, "ScaleX", squishScaleX,
      duration, new ACBC.Curve(ACBC.Curve.Pulse, 2), true);
    grp.Property(this.Owner.Tx, "ScaleY", squishScaleY,
      duration, new ACBC.Curve(ACBC.Curve.Pulse, 2), true);
    seq.Call(this.EndHopping);
  }

  EndHopping()
  {
    this.Hopping = false;
  }

  Reset()
  {
    this.Squishiness = 0.1;
    this.SquishDurationScale = 3;

    this.Hopping = false;
    this.Grounded = true;
    this.GroundY = null;
    this.HopsRemaining = 0;
    this.CurrentChainSize = 0;
  }
};


console.log(" * Hop.js loaded.");
