/**
 * Curve.js
 * 
 * @file
 *   Provides easing curves for the Ease system
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Curve.js outside of acbc.js");
  window.ACBC = {};
}


/**
 * @callback CurveFunction
 * @param {number} t
 * @param {...number} args
 * @returns {number}
 */
ACBC.Curve = class
{
  /** @type {CurveFunction} */
  Function;
  /** @type {number[]} */
  Parameters = [];

  /**
   * @param {CurveFunction} func 
   * @param  {...number} args 
   */
  constructor(func = ACBC.Curve.Quad.InOut, ...args)
  {
    this.Function = func;
    this.Parameters = args;
  }

  /**
   * 
   * @param {number | string} start 
   * @param {number | string} end 
   * @param {number} t 
   */
  Go(start, end, t)
  {
    return ACBC.Lerp(start, end, this.Function(t, ...this.Parameters));
  }

  static Linear(t) { return t; }

  static Pulse(t, exponent)
  {
    let y0 = x => Math.pow(4 * x, exponent) / 2;
    let y1 = x => 1 - y0(1 / 2 - x);
    let y2 = x => 1 - y0(x - 1 / 2);
    let y3 = x => y0(1 - x);
    if (t < 1 / 4) return y0(t);
    if (t < 2 / 4) return y1(t);
    if (t < 3 / 4) return y2(t);
    return y3(t);
  }

  static Quad = class
  {
    static In(t) { return t * t; }
    static Out(t) { return t * (2 - t); }
    static InOut(t)
    { 
      return t < 0.5 ? 2 * t * t : (-2 * t * t) + (4 * t) - 1;
    }
  };

  static Power = class
  {
    static In(t, exponent) { return Math.pow(t, exponent); }
    static Out(t, exponent) { return Math.pow(t, exponent); }
    static InOut(t, exponent)
    {
      if (t < 0.5)
        return this.In(2 * t, exponent) / 2;
      else
        return (this.Out(2 * t - 1, exponent) + 1) / 2;
    }
  };

  static Warp = class
  {
    /** @constant */
    static Quantum = 7.9579e-12;

    static In(t, scale)
    {
      return t > 1 - this.Quantum ? -Infinity : scale * (1 + 1 / (t * t - 1));
    }
    static Out(t, scale)
    {
      return t < this.Quantum ? Infinity : 1 - this.In(t - 1, scale);
    }
    static InOut(t, scale)
    {
      return t < 0.5 ?
        this.In(2 * t, scale) / 2 : (this.Out(2 * t - 1, scale) + 1) / 2;
    }
  };

  /** @todo Plot this in Desmos to see whether it's actually good */
  static Elastic = class
  {
    /** @constant */
    static PowerCoefficient = 0.0009765625; // for default exponent of 10
    
    static In(t, period = 0.3, exponent = 10)
    {
      if (period === 0) return 1;

      let valueAtX = Math.pow(2, exponent * (t - 1)) *
        Math.cos(2 * Math.PI * (t - 1) / period);
      let verticalShift = this.PowerCoefficient *
        Math.cos(2 * Math.PI / period);
      let verticalScale = 1 - verticalShift;

      return (valueAtX - verticalShift) / verticalScale;
    }

    static Out(t, period = 0.3, exponent = 10)
    {
      if (period === 0) return 1;

      let verticalScale =
        1 - this.PowerCoefficient * Math.cos(2 * Math.PI / period);
      
      return (1 - Math.pow(2, -exponent * t) *
        Math.cos(2 * Math.PI * t / period)) / verticalScale;
    }

    static InOut(t, period = 0.3, exponent = 10)
    {
      if (t < 0.5)
        return this.In(2 * t, period, exponent) / 2
      else
        return (this.Out(2 * t - 1, period, exponent) + 1) / 2;
    }
  };

  static Back = class
  {
    static In(t, scale = 2)
    {
      return t * t * ((scale + 1) * t - scale);
    }

    static Out(t, scale = 2)
    {
      t -= 1;
      return t * t * ((scale + 1) * t + scale) + 1;
    }

    static InOut(t, scale = 2)
    {
      return t < 0.5 ?
        this.In(2 * t, scale) / 2 : (this.Out(2 * t - 1, scale) + 1) / 2
    }
  };

  static Bounce = class
  {
    static #S(x)
    {
      let p = 3 * Math.pow(2, x);
      return (p - 1) / p;
    }

    static #B(t, n)
    {
      let p = Math.pow(2, n);
      let p2 = Math.pow(2, 2 * n);
      let tTerm = t - (p - 1) / p;
      return 9 * tTerm * tTerm + (p2 - 1) / p2;
    }

    static In(t)
    {
      return 1 - this.Out(1 - t);
    }

    static Out(t)
    {
      if (t < this.#S(-1)) return this.#B(t, 0);
      if (t < this.#S(0)) return this.#B(t, 1);
      if (t < this.#S(1)) return this.#B(t, 2);
      if (t < this.#S(2)) return this.#B(t, 3);
      if (t < this.#S(3)) return this.#B(t, 4);
      if (t < this.#S(4)) return this.#B(t, 5);
      if (t < this.#S(5)) return this.#B(t, 6);
      return this.#B(t, 7);
    }

    static InOut(t)
    {
      return t < 0.5 ?
        this.In(2 * t) / 2 : (this.Out(2 * t - 1) + 1) / 2;
    }
  };
};


console.log(" * Curve.js loaded.");
