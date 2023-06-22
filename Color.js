/**
 * Color.js
 * 
 * @file
 *   Color utilities
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Color.js outside of acbc.js");
  window.ACBC = {};
}


/** @todo Research whether this should be replaced */
/**
 * Converts RGB values to an array of HSL values
 * @param {number | number[]} r 
 * @param {number?} g 
 * @param {number?} b 
 * @returns {number[]}
 */
ACBC.RgbToHsl = function(r, g, b)
{
  if (Array.isArray(r))
  {
    b = r[2];
    g = r[1];
    r = r[0];
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ?
    l === r ?
      (g - b) / s : l === g ?
        2 + (b - r) / s : 4 + (r - g) / s :
    0;
  
  return [60 * h < 0 ? 60 * h + 360 : 60 * h,
          100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
          (100 * (2 * l - s)) / 2];
};


/** @todo Research whether this should be replaced */
/**
 * Converts HSL values to an array of RGB values
 * @param {number | number[]} h 
 * @param {number?} s 
 * @param {number?} l 
 * @returns {number[]}
 */
ACBC.HslToRgb = function(h, s, l)
{
  if (Array.isArray(h))
  {
    l = h[2];
    s = h[1];
    h = h[0];
  }

  s /= 100;
  l /= 100;
  
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f =
    n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};


console.log(" * Color.js loaded.");
