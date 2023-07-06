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
ACBC.Curve = class Curve
{
  /** @type {CurveFunction} */
  Function;
  /** @type {number[]} */
  Parameters = [];

  /**
   * @param {CurveFunction} func 
   * @param  {...number} parameters 
   */
  constructor(func = ACBC.Curve.#Functions.Quad.InOut, ...parameters)
  {
    this.Function = func;
    this.Parameters = parameters;
  }

  /**
   * @param {number | string} start 
   * @param {number | string} end 
   * @param {number} t 
   */
  Go(start, end, t)
  {
    return ACBC.Lerp(start, end, this.Function(t, ...this.Parameters));
  }

  // Factories
  static get Linear() { return ACBC.Curve.#Instances.Linear; }
  static Pulse(exponent = 2)
  {
    return ACBC.Curve.#Instances.Get(ACBC.Curve.#Functions.Pulse, exponent);
  }
  static get Parabola() { return ACBC.Curve.#Instances.Parabola; }
  static Quad = class Quad
  {
    static get In() { return ACBC.Curve.#Instances.Quad.In; }
    static get Out() { return ACBC.Curve.#Instances.Quad.Out; }
    static get InOut() { return ACBC.Curve.#Instances.Quad.InOut; }
  };
  static Power = class Power
  {
    static In(exponent = 3)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Power.In, exponent);
    }
    static Out(exponent = 3)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Power.Out, exponent);
    }
    static InOut(exponent = 3)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Power.InOut, exponent);
    }
  };
  static Warp = class Warp
  {
    static In(scale = 0.5)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Warp.In, scale);
    }
    static Out(scale = 0.5)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Warp.Out, scale);
    }
    static InOut(scale = 0.5)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Warp.InOut, scale);
    }
  }
  static Elastic = class Elastic
  {
    static In(period = 0.3, exponent = 10)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Elastic.In, period, exponent);
    }
    static Out(period = 0.3, exponent = 10)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Elastic.Out, period, exponent);
    }
    static InOut(period = 0.3, exponent = 10)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Elastic.InOut, period, exponent);
    }
  }
  static Back = class Back
  {
    static In(scale = 2)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Back.In, scale);
    }
    static Out(scale = 2)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Back.Out, scale);
    }
    static InOut(scale = 2)
    {
      return ACBC.Curve.#Instances.Get(
        ACBC.Curve.#Functions.Back.InOut, scale);
    }
  }
  static Bounce = class Bounce
  {
    static get In() { return ACBC.Curve.#Instances.Bounce.In; }
    static get Out() { return ACBC.Curve.#Instances.Bounce.Out; }
    static get InOut() { return ACBC.Curve.#Instances.Bounce.InOut; }
  }

  static #Instances = class Instances
  {
    static Linear = new ACBC.Curve(ACBC.Curve.#Functions.Linear);
    static Parabola = new ACBC.Curve(ACBC.Curve.#Functions.Parabola);
    static Quad = class Quad
    {
      static In = new ACBC.Curve(ACBC.Curve.#Functions.Quad.In);
      static Out = new ACBC.Curve(ACBC.Curve.#Functions.Quad.Out);
      static InOut = new ACBC.Curve(ACBC.Curve.#Functions.Quad.InOut);
    }
    static Bounce = class Bounce
    {
      static In = new ACBC.Curve(ACBC.Curve.#Functions.Bounce.In);
      static Out = new ACBC.Curve(ACBC.Curve.#Functions.Bounce.Out);
      static InOut = new ACBC.Curve(ACBC.Curve.#Functions.Bounce.InOut);
    }

    /** @type {Map<CurveFunction, Map<string, ACBC.Curve>>} */
    static Cache = new Map();

    /**
     * @param {CurveFunction} func 
     * @param {...number} parameters 
     * @returns {ACBC.Curve}
     */
    static Get(func, ...parameters)
    {
      let key = parameters.join();
      /** @type {ACBC.Curve} */
      let value;

      let funcMap = ACBC.Curve.#Instances.Cache.get(func);
      if (!funcMap)
        funcMap = new Map();
      else
        value = funcMap.get(key);

      if (!value)
      {
        value = new ACBC.Curve(func, ...parameters);
        funcMap.set(key, value);
      }

      return value;
    }
  }

  static #Functions = class Functions
  {
    static Linear(t) { return t; }

    static Parabola(t)
    {
      t = 1 - 2 * t;
      return 1 - t * t;
    }

    static Pulse(t, exponent = 2)
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
  
    /** @todo Consider researching and adding an ElasticPulse */
  
    static Quad = class Quad
    {
      static In(t) { return t * t; }
      static Out(t) { return t * (2 - t); }
      static InOut(t)
      { 
        return t < 0.5 ? 2 * t * t : (-2 * t * t) + (4 * t) - 1;
      }
    };
  
    static Power = class Power
    {
      static In(t, exponent = 3) { return Math.pow(t, exponent); }
      static Out(t, exponent = 3) { return 1 - Math.pow(1 - t, exponent); }
      static InOut(t, exponent = 3)
      {
        if (t < 0.5)
          return ACBC.Curve.Power.In(2 * t, exponent) / 2;
        else
          return (ACBC.Curve.Power.Out(2 * t - 1, exponent) + 1) / 2;
      }
    };
  
    static Warp = class Warp
    {
      /** @constant */
      static Quantum = 7.9579e-12;
  
      static In(t, scale = 0.5)
      {
        return t > 1 - ACBC.Curve.Warp.Quantum ?
          -Infinity : scale * (1 + 1 / (t * t - 1));
      }
      static Out(t, scale = 0.5)
      {
        return t < ACBC.Curve.Warp.Quantum ?
          Infinity : 1 - ACBC.Curve.Warp.In(t - 1, scale);
      }
      static InOut(t, scale = 0.5)
      {
        return t < 0.5 ?
          ACBC.Curve.Warp.In(2 * t, scale) / 2 :
          (ACBC.Curve.Warp.Out(2 * t - 1, scale) + 1) / 2;
      }
    };
  
    /** @todo Plot this in Desmos to see whether it's actually good */
    static Elastic = class Elastic
    {
      /** @constant */
      static PowerCoefficient = 0.0009765625; // for default exponent of 10
      
      static In(t, period = 0.3, exponent = 10)
      {
        if (period === 0) return 1;
  
        let valueAtX = Math.pow(2, exponent * (t - 1)) *
          Math.cos(2 * Math.PI * (t - 1) / period);
        let verticalShift = ACBC.Curve.Elastic.PowerCoefficient *
          Math.cos(2 * Math.PI / period);
        let verticalScale = 1 - verticalShift;
  
        return (valueAtX - verticalShift) / verticalScale;
      }
  
      static Out(t, period = 0.3, exponent = 10)
      {
        if (period === 0) return 1;
  
        let verticalScale = 1 - ACBC.Curve.Elastic.PowerCoefficient *
          Math.cos(2 * Math.PI / period);
        
        return (1 - Math.pow(2, -exponent * t) *
          Math.cos(2 * Math.PI * t / period)) / verticalScale;
      }
  
      static InOut(t, period = 0.3, exponent = 10)
      {
        if (t < 0.5)
          return ACBC.Curve.Elastic.In(2 * t, period, exponent) / 2
        else
          return (ACBC.Curve.Elastic.Out(2 * t - 1, period, exponent) + 1) / 2;
      }
    };
  
    static Back = class Back
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
          ACBC.Curve.Back.In(2 * t, scale) / 2 :
          (ACBC.Curve.Back.Out(2 * t - 1, scale) + 1) / 2
      }
    };

    /** @todo Look into whether this might be parameterized further */
  
    static Bounce = class Bounce
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
        return 1 - ACBC.Curve.Bounce.Out(1 - t);
      }
  
      static Out(t)
      {
        if (t < ACBC.Curve.Bounce.#S(-1)) return ACBC.Curve.Bounce.#B(t, 0);
        if (t < ACBC.Curve.Bounce.#S(0)) return ACBC.Curve.Bounce.#B(t, 1);
        if (t < ACBC.Curve.Bounce.#S(1)) return ACBC.Curve.Bounce.#B(t, 2);
        if (t < ACBC.Curve.Bounce.#S(2)) return ACBC.Curve.Bounce.#B(t, 3);
        if (t < ACBC.Curve.Bounce.#S(3)) return ACBC.Curve.Bounce.#B(t, 4);
        if (t < ACBC.Curve.Bounce.#S(4)) return ACBC.Curve.Bounce.#B(t, 5);
        if (t < ACBC.Curve.Bounce.#S(5)) return ACBC.Curve.Bounce.#B(t, 6);
        return ACBC.Curve.Bounce.#B(t, 7);
      }
  
      static InOut(t)
      {
        return t < 0.5 ?
          ACBC.Curve.Bounce.In(2 * t) / 2 :
          (ACBC.Curve.Bounce.Out(2 * t - 1) + 1) / 2;
      }
    };
  };
};


console.log(" * Curve.js loaded.");
