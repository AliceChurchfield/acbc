/**
 * Component.js
 * 
 * @file
 *   Defines the base building block of functionality that composes an ACBCA.
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Component.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.Component = class Component
{
  /** @type {ACBC.Acbca} */
  Owner;

  /**
   * @param {ACBC.Acbca} owner 
   */
  constructor(owner)
  {
    this.Owner = owner;
  }

  /**
   * @virtual
   */
  Initialize() {}
  /**
   * @virtual
   * @param {number} _dt 
   */
  Update(_dt) {}
  /**
   * @virtual
   */
  Reset() {}
};


console.log(" * Component.js loaded.");
