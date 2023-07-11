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
  static ExitDuration = 20;
  static ExitPosX = 500;
  
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
  /** @type {ACBC.Range} */
  HopHeightRange;
  /** @type {number} */
  XVarianceFraction;
  /** @type {number} */
  DelayChance;
  /** @type {ACBC.Range} */
  DelayRange;
  /** @type {ACBC.Range} */
  XHopArea;
  /** @type {number} */
  SquishAspectRatio;
  /** @type {number} */
  PostSquishFactor;
  /** @type {ACBC.PlanSequence} */
  Sequence;

  /** @type {ACBC.Tx} */
  Tx;
  /** @type {ACBC.Body} */
  Body;

  constructor(owner)
  {
    super(owner);
    this.Reset();
  }

  get MaxSpeedY()
  { return this.ComputeSpeedForHeight(this.HopHeightRange.Max); }
  get MaxEnergy()
  { return ACBC.Hop.ComputeEnergy(this.MaxSpeedY); }
  get MaxHopDuration()
  { return this.ComputeDurationForSpeed(this.MaxSpeedY); }

  Initialize()
  {
    this.Tx = this.Owner.Tx;
    this.Body = this.Owner.Body;
  }

  BeginHoppingTowardExit()
  {
    if (this.Sequence)
      this.Sequence.Cancel();
    this.Sequence = this.Owner.Plans.Sequence();
    let currPosX = this.Tx.PosX;
    let destPosX = ACBC.Hop.ExitPosX;
    let duration = ACBC.Hop.ExitDuration;
    this.NextHopGivenDestinationAndDuration(currPosX, destPosX, duration);
  }

  /**
   * Recursively calls itself to add enough hops to fill the given duration
   * @param {number} currPosX Where we'll be when this hop starts
   * @param {number} destPosX Where we're ultimately hopping to
   * @param {number} remainingDuration How much time is still left for hops
   * @returns {void}
   */
  NextHopGivenDestinationAndDuration(currPosX, destPosX, remainingDuration)
  {
    if (remainingDuration <= this.MaxHopDuration)
    {
      let height = this.ComputeHeightForDuration(remainingDuration);
      this.AddHop(destPosX, height, remainingDuration, 0, true);
      return;
    }

    let height = this.HopHeightRange.Random();
    let duration = this.ComputeDurationForHeight(height);
    remainingDuration -= duration;
    let remainingDistance = Math.abs(destPosX - currPosX);
    let baseSpeedX = remainingDistance / remainingDuration;
    let variance = baseSpeedX * this.XVarianceFraction;
    let speedX = ACBC.RandomVariance(baseSpeedX, variance);
    let posX = currPosX + speedX * duration;
    let posY = -height;
    let delay = Math.random() < this.DelayChance ? this.DelayRange.Random() : 0;
    let nextHopDuration = this.AddHop(posX, posY, duration, delay, false);
    remainingDuration -= nextHopDuration;

    this.NextHopGivenDestinationAndDuration(posX, destPosX, remainingDuration);
  }

  /**
   * @param {number} posX The destination PosX to hop to
   * @param {number} posY The height of the hop
   * @param {number} duration The duration of the hop (not including squish)
   * @param {number} delay Any delay to use after this hop and before the next
   * @param {boolean} final Whether this is the final hop in the sequence
   * @returns {number} How long this hop will take, including squish and delay
   */
  AddHop(posX, posY, duration, delay = 0, final = false)
  {
    let speedY = this.ComputeSpeedForHeight(posY);
    let energy = ACBC.Hop.ComputeEnergy(speedY);
    let squishFactor = this.ComputeSquishFactor(energy);
    let preScaleX = 1 + squishFactor;
    let preScaleY = 1 - squishFactor / this.SquishAspectRatio;
    let preDur = this.SquishDurationScale * squishFactor;
    let squishCurve = ACBC.Curve.Pulse(2);
    let eventData = new ACBC.EventData;
    let postScaleX = 1 + squishFactor;
    let postScaleY = 1 - squishFactor / this.SquishAspectRatio;
    let postDur = this.SquishDurationScale * squishFactor;

    if (final)
      duration -= (preDur + postDur);
    
    let preGrp = this.Sequence.Group();
    preGrp.Property(this.Tx, "ScaleX", preScaleX, preDur, squishCurve, true);
    preGrp.Property(this.Tx, "ScaleY", preScaleY, preDur, squishCurve, true);
    this.Sequence.Dispatch(this.Owner, ACBC.Events.HopUp, eventData);
    let hopGrp = this.Sequence.Group();
    hopGrp.Property(this.Tx, "PosX", posX, duration, ACBC.Curve.Linear);
    hopGrp.Property(this.Tx, "PosY", posY, duration, ACBC.Curve.Parabola, true);
    this.Sequence.Dispatch(this.Owner, ACBC.Events.HopDown, eventData);
    
    if (delay <= 0 && !final)
    return preDur + duration;
    
    squishFactor *= ACBC.Hop.PostSquishFactor;
    let postGrp = this.Sequence.Group();
    postGrp.Property(this.Tx, "ScaleX", postScaleX, postDur, squishCurve, true);
    postGrp.Property(this.Tx, "ScaleY", postScaleY, postDur, squishCurve, true);
    
    if (delay > 0)
      this.Sequence.Delay(delay);
    
    if (final)
      this.Sequence.Call(this.EndHopping.bind(this));
    
    return preDur + duration + postDur + delay;
  }

  EndHopping()
  {
    this.Hopping = false;
  }

  /**
   * @param {number} speed 
   * @returns {number}
   */
  ComputeDurationForSpeed(speed)
  {
    return 2 * speed / this.Body.Gravity;
  }

  ComputeSpeedForHeight(height)
  {
    return Math.sqrt(Math.abs(2 * this.Body.Gravity * height));
  }

  ComputeHeightForDuration(duration)
  {
    let tf = duration;  // t final
    let a = this.Body.Gravity;
    let vi = -a * tf / 2;
    let tm = duration / 2; // t middle
    return 1/2 * a * tm * tm + vi * tm;
  }

  ComputeDurationForHeight(height)
  {
    let speed = this.ComputeSpeedForHeight(height);
    return this.ComputeDurationForSpeed(speed);
  }

  /**
   * Calculates and returns the squish factor resulting from the given energy
   * @param {number} energy 
   * @returns {number}
   */
  ComputeSquishFactor(energy)
  {
    /** @todo Consider an asymptotic function for energy vs. squish amount */
    return this.Squishiness * energy / this.MaxEnergy;
  }

  Reset()
  {
    this.Squishiness = 0.1;
    this.SquishDurationScale = 3;
    this.Hopping = false;
    this.HopHeightRange = new ACBC.Range(80, 120);
    this.XVarianceFraction = 0.3;
    this.DelayChance = 0.2;
    this.DelayRange = new ACBC.Range(0.2, 0.5);
    this.XHopArea = new ACBC.Range(-20, 20);
    this.SquishAspectRatio = 2;
    this.PostSquishFactor = 0.9;
  }
};


console.log(" * Hop.js loaded.");
