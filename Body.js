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
   * Gravity in units / s^2. Applied to VelY every frame in PhysicsUpdate
   */
  Gravity;
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
  }

  PhysicsUpdate(dt)
  {
    if (!this.Awake) return;

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
    this.VelY += this.Gravity * dt;
    posY += this.VelY * halfDt;

    this.Tx.PosX = ACBC.Clamp(posX, ACBC.Body.PosXMin, ACBC.Body.PosXMax);
    this.Tx.PosY = ACBC.Clamp(posY, ACBC.Body.PosYMin, ACBC.Body.PosYMax);
  }

  Sleep()
  {
    this.Awake = false;
    this.SleepTimer = 0;
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
    this.Gravity = 100;
    this.Awake = false;
    this.SleepTimer = 0;
  }
};


console.log(" * Body.js loaded.");
