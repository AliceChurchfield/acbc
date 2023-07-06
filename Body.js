/**
 * Body.js
 * 
 * @file
 *   Defines a movable body (like a rigid body) for use with a physics system
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Body.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.BodyEvent = class BodyEvent extends ACBC.EventData
{
  /**
   * @todo
   * Maybe fill in here the landing velocity, the penetration depth ( ͡° ͜ʖ ͡°),
   * etc.
   */
};


ACBC.Body = class Body extends ACBC.Component
{
  static PosXMin = -1000;
  static PosXMax = 1000;
  static PosYMin = -1000;
  static PosYMax = 1000;
  static SleepTimeout = 1;

  /**
   * @type {ACBC.Tx}
   * The transform of this body. Its Pos values are what this body modifies
   */
  Tx;
  /**
   * @type {number}
   * H velocity in units / s. Applied to Tx.PosX every frame in PhysicsUpdate
   */
  VelX;
  /**
   * @type {number}
   * V velocity in units / s. Applied to Tx.PosY every frame in PhysicsUpdate
   */
  VelY;
  /**
   * @type {number}
   * Gravity in units / s^2. Applied to VelY in PhysicsUpdate if not grounded
   */
  Gravity;
  /**
   * @type {boolean}
   * Whether this body should be pulled by gravity
   */
  Grounded;
  /**
   * @type {number}
   * The Y position at which this body is considered on the ground
   */
  GroundY;
  /**
   * @type {boolean}
   * Whether physics should move this body around
   */
  Awake;
  /**
   * @type {number}
   * Resets when this body moves. If it reaches SleepTimeout, the body sleeps
   */
  SleepTimer;

  constructor(owner)
  {
    super(owner);
    this.Reset();
  }

  Initialize()
  {
    this.Tx = this.Owner.Tx;
    this.Owner.Connect(ACBC.Events.PhysicsUpdate,
      this.OnPhysicsUpdate.bind(this));
  }

  /**
   * @param {ACBC.UpdateEvent} updateEvent 
   * @returns {void}
   */
  OnPhysicsUpdate(updateEvent)
  {
    if (!this.Awake) return;

    let dt = updateEvent.Dt;

    if (this.VelX === 0 && this.VelY === 0)
    {
      this.SleepTimer += dt;

      if (this.SleepTimer >= ACBC.Body.SleepTimeout)
        this.Sleep();
    }

    let posX = this.Tx.PosX;
    let posY = this.Tx.PosY;

    posX += this.VelX * dt;

    let halfDt = dt / 2;
    posY += this.VelY * halfDt;

    let newGrounded = posY >= this.GroundY;
    if (!newGrounded)
      this.VelY += this.Gravity * dt;
    
    posY += this.VelY * halfDt;

    this.Tx.PosX = ACBC.Clamp(posX, ACBC.Body.PosXMin, ACBC.Body.PosXMax);
    this.Tx.PosY = ACBC.Clamp(posY, ACBC.Body.PosYMin, ACBC.Body.PosYMax);

    if (newGrounded !== this.Grounded)
    {
      this.Grounded = newGrounded;

      if (newGrounded)
        this.Land();
      else
        this.LeaveGround();
    }
  }

  LeaveGround()
  {
    let bodyEvent = new ACBC.BodyEvent();
    this.Owner.Dispatch("LeftGround", bodyEvent);
  }

  Land()
  {
    this.Tx.PosY = this.GroundY;
    this.VelY = 0;

    let bodyEvent = new ACBC.BodyEvent();
    this.Owner.Dispatch("Landed", bodyEvent);
  }

  Sleep()
  {
    this.Awake = false;
    this.SleepTimer = 0;
  }

  Stop()
  {
    this.VelX = this.VelY = 0;
    this.Sleep();
  }

  Wake()
  {
    this.Awake = true;
    this.SleepTimer = 0;
  }

  SetVelX(value)
  {
    if (value === this.VelX) return;

    this.VelX = value;
    this.Wake();
  }

  SetVelY(value)
  {
    if (value === this.VelY) return;

    this.VelY = value;
    this.Wake();
  }

  Reset()
  {
    this.VelX = 0;
    this.VelY = 0;
    this.Gravity = 2500;
    this.Grounded = true;
    this.GroundY = 0;
    this.Awake = false;
    this.SleepTimer = 0;
  }
};


console.log(" * Body.js loaded.");
