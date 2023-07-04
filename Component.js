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
   * @param {number} _dt 
   */
  Update(_dt) {}
};


console.log(" * Component.js loaded.");
