/**
 * Math.js
 * 
 * @file
 *   Math utilities
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Math.js outside of acbc.js");
  window.ACBC = {};
}


/**
 * Clamps `n` to be between `min` and `max`
 * @param {number} n 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
ACBC.Clamp = function(n, min, max)
{
  return n < min ? min : n > max ? max : n;
}


/**
 * Clamps `n` to be between 0 and 1
 * @param {number} n 
 * @returns {number}
 */
ACBC.Clamp01 = function(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }

/**
 * @param {string[]} matches 
 * @returns {void}
 */
let ExpandHexMatches = function(matches)
{
  for (let i = 1; i < matches.length; ++i)
    matches[i] = matches[i] + matches[i];
};


/**
 * Linear interpolation from `start` to `end`
 * @param {number | string} start What you get when `t` equals zero
 * @param {number | string} end What you get when `t` equals one
 * @param {number} t The interpolant
 * @returns {number | string} The interpolated result
 */
ACBC.Lerp = function(start, end, t)
{
  if (typeof t !== "number" || typeof start !== typeof end)
  {
    console.warn(`Invalid lerp from ${start} to ${end} with t ${t}`);
    return start;
  }

  if (typeof start === "number")
    return start + t * (end - start);

  if (typeof start === "string")
  {
    let sixHexRe = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/gi;
    let threeHexRe = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/gi;

    let startMatches = [...start.matchAll(sixHexRe)];

    if (startMatches.length <= 0)
    {
      startMatches = [...start.matchAll(threeHexRe)];

      if (startMatches.length <= 0)
      {
        console.warn(`Invalid lerp from ${start} to ${end} with t ${t}`);
        return start;
      }

      ExpandHexMatches(startMatches);
    }

    let endMatches = [...end.matchAll(sixHexRe)];

    if (endMatches.length <= 0)
    {
      endMatches = [...end.matchAll(threeHexRe)];

      if (endMatches.length <= 0)
      {
        console.warn(`Invalid lerp from ${start} to ${end} with t ${t}`);
        return start;
      }

      ExpandHexMatches(endMatches);
    }

    let startR = parseInt(startMatches[1], 16);
    let startG = parseInt(startMatches[2], 16);
    let startB = parseInt(startMatches[3], 16);
    let endR = parseInt(endMatches[1], 16);
    let endG = parseInt(endMatches[2], 16);
    let endB = parseInt(endMatches[3], 16);
    let startHsl = ACBC.RgbToHsl(startR, startG, startB);
    let endHsl = ACBC.RgbToHsl(endR, endG, endB);

    if (endHsl[0] - startHsl[0] > 180)
      endHsl[0] -= 360;
    
    let resultH = ACBC.Lerp(startHsl[0], endHsl[0], t);
    let resultS = ACBC.Lerp(startHsl[1], endHsl[1], t);
    let resultL = ACBC.Lerp(startHsl[2], endHsl[2], t);
    let resultRgb = ACBC.HslToRgb(resultH, resultS, resultL);
    let rStr = `${Math.floor(resultRgb[0])}`;
    if (rStr.length < 2)
      rStr = "0" + rStr;
    let gStr = `${Math.floor(resultRgb[1])}`;
    if (gStr.length < 2)
      gStr = "0" + gStr;
    let bStr = `${Math.floor(resultRgb[2])}`;
    if (bStr.length < 2)
      bStr = "0" + bStr;
    
    return "#" + rStr + gStr + bStr;
  }
};


console.log(" * Math.js loaded.");