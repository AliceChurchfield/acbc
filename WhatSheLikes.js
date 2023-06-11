/**
 * WhatSheLikes.js
 * 
 * @file
 *   Defines a function to aid in interacting with NPC private room friends
 * @author   Alice Churchfield
 */



const ACBC_VERSION = document.currentScript?.dataset.version;
if (!ACBC_VERSION)
  console.warn("Running WhatSheLikes.js outside of acbc.js");

if (!window.ACBC) window.ACBC = {};

/**
 * Logs to the console a filtered list of the things the given NPC likes
 * @param {Character} C
 *   The NPC to check
 * @returns {void}
 *   Nothing
 */
ACBC.WhatSheLikes = function(C)
{
  C = ACBC.Find(C);
  if (!C?.Dialog) return;

  return C.Dialog.filter(
    d =>
    {
      let func = d.Function;
      if (!func) return false;

      let lpIndex = func.indexOf("(");
      let argsStr = func.substring(lpIndex + 1, func.length - 1);
      if (argsStr.length <= 0) return false;

      let args = argsStr.split(",");
      if (args.length > 1) return false;
      if (parseInt(args[0]) <= 0) return false;

      let funcName = func.substring(0, lpIndex);
      let allowedNames =
      [
        "PrivateNPCInteraction",
      ];
      if (!allowedNames.includes(funcName)) return false;

      return true;
    }
  );
};

console.log(" * WhatSheLikes.js loaded.");
