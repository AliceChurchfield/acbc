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


ACBC.Events =
{
  MainUpdate: "MainUpdate",
  PhysicsUpdate: "PhysicsUpdate",
  LeftGround: "LeftGround",
  Landed: "Landed",
};


console.log(" * Events.js loaded.");
