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


ACBC.Unhook = {};


/**
 * Modifies an existing property of the ACBC namespace to make it (kinda) const
 * @param {string} propertyName The name of the property to modify
 * @returns {typeof ACBC} The ACBC object again (for chaining)
 */
ACBC.Const = function(propertyName)
{
  return Object.defineProperty(ACBC, propertyName,
    { writable: false, enumerable: true, configurable: true, });
};


/**
 * Adds a to a vanilla BC function via the ModSDK hook interface. Unhooks the
 * function first if ACBC has already hooked it, then stores the new hook's
 * unhook function in ACBC.Unhook.
 * @param {string} functionName The name of the function to hook
 * @param {number} priority Higher-numbered priority hooks are called first
 * @param {string} key The key to use to remove this hook
 * @param {*} hook The function to be called via the hook
 */
ACBC.HookFunction = function(functionName, priority, hook, key)
{
  key += functionName;
  if (typeof ACBC.Unhook[key] === "function")
    ACBC.Unhook[key]()
  ACBC.Unhook[key] = ACBC.ModApi.hookFunction(functionName, priority, hook);
};


console.log(" * acbc-util.js loaded.");
