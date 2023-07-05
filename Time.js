/**
 * Time.js
 * 
 * @file
 *   Defines some time-based utilities
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Time.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.FixedDt = 1 / 60;
ACBC.UseFixedDt = true;
/**
 * Returns the amount of time, in seconds, that has elapsed since the previous
 * frame.
 * @returns {number} - Delta time in seconds
 */
ACBC.Dt = function()
{
  return ACBC.UseFixedDt ? ACBC.FixedDt : TimerRunInterval / 1000;
};


console.log(" * Time.js loaded.");
