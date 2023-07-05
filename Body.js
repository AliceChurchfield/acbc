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

    this.Tx.PosX += this.VelX * dt;

    let halfDt = dt / 2;
    this.Tx.PosY += this.VelY * halfDt;
    this.VelY += this.Gravity * dt;
    this.Tx.PosY += this.VelY * halfDt;
  }

  Reset()
  {
    this.VelX = 0;
    this.VelY = 0;
    this.Gravity = 100;
    this.Awake = false;
  }
};


console.log(" * Body.js loaded.");
