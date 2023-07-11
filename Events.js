/**
 * Events.js
 * 
 * @file
 *   A full list of ACBC Event names
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Events.js outside of acbc.js");
  window.ACBC = {};
}


/** @enum {string} */
ACBC.Events =
{
  MainUpdate: "MainUpdate",
  PhysicsUpdate: "PhysicsUpdate",
  LeftGround: "LeftGround",
  Landed: "Landed",
  HopUp: "HopUp",
  HopDown: "HopDown",
};


console.log(" * Events.js loaded.");
