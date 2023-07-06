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
  static SpeedYRange = new ACBC.Range(550, 700);
  static HopArea = new ACBC.Range(-50, 50);
  static SquishAspectRatio = 2; // X / Y
  static PostSquishFactor = 1;
  static ExitDuration = 20;
  static get MaxHopEnergy()
  { return ACBC.Hop.ComputeEnergy(ACBC.Hop.SpeedYRange.Max); }
  
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
  HoppingTowardExit;
  /** @type {number} */
  HopsRemaining;
  /** @type {number} */
  CurrentChainSize;
  /** @type {number} */
  CurrentVelY;
  /** @type {number} */
  HopDestinationX;
  /** @type {ACBC.Tx} */
  Tx;
  /** @type {ACBC.Body} */
  Body;

  ExitHops = [];

  constructor(owner)
  {
    super(owner);
    this.Reset();
  }

  get CurrentEnergy() { return ACBC.Hop.ComputeEnergy(this.CurrentVelY); }
  get CurrentHopDuration() { return this.ComputeHopDuration(this.CurrentVelY); }
  get HopDurationRange()
  { return ACBC.Hop.SpeedYRange.Apply(this.ComputeHopDuration, this); }

  Initialize()
  {
    this.Tx = this.Owner.Tx;
    this.Body = this.Owner.Body;
    this.Owner.Connect(ACBC.Events.Landed, this.OnLanded.bind(this));
  }

  /**
   * @param {ACBC.BodyEvent} _bodyEvent 
   */
  OnLanded(_bodyEvent)
  {
    --this.HopsRemaining;

    if (this.HopsRemaining > 0)
      this.PreSquish();
    else
      this.PostSquish();
  }

  /**
   * Calculates and stores the speed of the current hop, based on random
   * variance and where we are in the current hop chain
   * @returns {void}
   */
  NextVelY()
  {
    // let hopDelta = this.CurrentChainSize - this.HopsRemaining;
    // if (hopDelta > 0)
    // {
    //   /** @todo Consider generalizing this formula */
    //   let denominator = 2 * (this.CurrentChainSize - 1);
    //   let numerator = denominator - hopDelta;
    //   scalar = numerator / denominator;
    // }

    this.CurrentVelY = -ACBC.Hop.SpeedYRange.Random();
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

  /**
   * @param {number} velY 
   * @returns {number}
   */
  ComputeHopDuration(velY)
  {
    return -2 * velY / this.Body.Gravity;
  }

  ComputeHopCountRangeForDuration(duration)
  {
    let range = this.HopDurationRange;
    let min = ACBC.Hop.ExitDuration / range.Max;
    let max = ACBC.Hop.ExitDuration / range.Min;

    return new ACBC.Range(Math.floor(min), Math.floor(max));
  }

  BeginHopping(count = 1)
  {
    this.CurrentChainSize = this.HopsRemaining = count;
    this.HoppingTowardExit = false;

    if (this.Hopping) return;

    this.Hopping = true;
    this.PreSquish();
  }

  PreSquish()
  {
    this.NextVelY();

    let squishFactor = this.ComputeSquish(this.CurrentEnergy);
    let squishScaleX = 1 + squishFactor;
    let squishScaleY = 1 - squishFactor / ACBC.Hop.SquishAspectRatio;
    let duration = this.SquishDurationScale * squishFactor;
    let curve = ACBC.Curve.Pulse(2);
    let seq = this.Owner.Plans.Sequence();
    let grp = seq.Group();
    grp.Property(this.Tx, "ScaleX", squishScaleX, duration, curve, true);
    grp.Property(this.Tx, "ScaleY", squishScaleY, duration, curve, true);
    seq.Call(this.BeginRising.bind(this));
  }

  BeginRising()
  {
    // If we have just one more hop left, hop back to the origin
    // Otherwise, pick a point at random within the hop area and hop to it
    let end = this.HopsRemaining > 1 ? ACBC.Hop.HopArea.Random() : 0;
    let duration = this.CurrentHopDuration;
    let curve = ACBC.Curve.Linear;
    this.Owner.Plans.Property(this.Tx, "PosX", end, duration, curve);
    this.Body.SetVelY(this.CurrentVelY);
  }

  PostSquish()
  {
    let squishFactor = this.ComputeSquish(this.CurrentEnergy) *
      ACBC.Hop.PostSquishFactor;
    let squishScaleX = 1 + squishFactor;
    let squishScaleY = 1 - squishFactor / ACBC.Hop.SquishAspectRatio;
    let duration = this.SquishDurationScale * squishFactor;
    let curve = ACBC.Curve.Pulse(2);
    let seq = this.Owner.Plans.Sequence();
    let grp = seq.Group();
    grp.Property(this.Tx, "ScaleX", squishScaleX, duration, curve, true);
    grp.Property(this.Tx, "ScaleY", squishScaleY, duration, curve, true);
    seq.Call(this.EndHopping.bind(this));
  }

  EndHopping()
  {
    this.Hopping = false;
  }

  BeginHoppingTowardExit()
  {
    /**
     * @todo
     * Rewrite this whole system with Plan-based Y movement :|
     */
  }

  Reset()
  {
    this.Squishiness = 0.1;
    this.SquishDurationScale = 3;

    this.Hopping = false;
    this.HopsRemaining = 0;
    this.CurrentChainSize = 0;
  }
};


console.log(" * Hop.js loaded.");