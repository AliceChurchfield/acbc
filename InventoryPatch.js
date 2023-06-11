/**
 * InventoryPatch.js
 * 
 * @file
 *   Patches in new behavior to enhance Inventory.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running InventoryPatch.js outside of acbc.js");
  window.ACBC = {};
}


InventoryWearRandom = function(C, GroupName, Difficulty, Refresh = true, MustOwn = false, Extend = true, AllowedAssets = null, IgnoreRequirements = false)
{
  ACBC.WearRandomFave(C, GroupName, Difficulty, null, Refresh);
};


console.log(" * InventoryPatch.js loaded.");
