/**
 * acbc-util.js
 * 
 * @file
 *   Utility functions and properties
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running acbc-util.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.HookFunction = function(functionName, priority, hook)
{
  if (hook.Unhook)
    hook.Unhook();
  hook.Unhook = ACBC.ModApi.hookFunction(functionName, priority, hook);
};


console.log(" * acbc-util.js loaded.");
