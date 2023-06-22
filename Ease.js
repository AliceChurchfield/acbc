/**
 * Ease.js
 * 
 * @file
 *   Establishes the "ease" system of interpolating values
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Ease.js outside of acbc.js");
  window.ACBC = {};
}


/** @abstract */
ACBC.Ease = class
{
  /** @enum {string} */
  static State =
  {
    Running: "Running",
    Completed: "Completed",
  };

  Name = "Base Ease";
  Started = false;
  Completed = false;
  Active = true;
  Duration = -1;
  Remaining = -1;

  get Completion()
  {
    return this.Duration === 0 ? 1 : 1 - this.Remaining / this.Duration;
  }

  /**
   * Updates the ease, nudging it one step closer to completion
   * @virtual
   * @param {number} dt - Delta time in seconds
   * @returns {ACBC.Ease.State} - The state of the ease following the update
   */
  Update(dt) { return ACBC.Ease.State.Completed; }
  /**
   * A chance for an ease to do something just before it's canceled
   * @virtual
   * @returns {void} - Nothing
   */
  OnCanceled() {}

  /**
   * Terminates the action prematurely
   * @returns {void} - Nothing
   */
  Cancel()
  {
    this.OnCanceled();
    this.Active = false;
  }
};


/** @abstract */
ACBC.EaseSet = class extends ACBC.Ease
{
  Name = "Set";
  /** @type {ACBC.Ease[]} */
  Eases = [];
  get Count() { return this.Eases.length; }
  get Empty() { return this.Eases.length === 0; }

  /**
   * Adds an ease to this set's container of eases
   * @param {ACBC.Ease} ease - The ease to add to the set
   * @returns {ACBC.Ease} - The ease that was added (for chaining purposes)
   */
  Add(ease)
  {
    this.Eases.push(ease);
    return ease;
  }

  /**
   * Processes the eases in this set
   * @param {number} dt - Delta time in seconds
   * @param {boolean} blocking
   * Whether this set should update all of its eases or just the first one
   * that's active. True for sequences, false for groups.
   * @returns {ACBC.Ease.State} - The state of this set following this update
   */
  ProcessEases(dt, blocking)
  {
    for (let i = 0; i < this.Count; ++i)
    {
      let ease = this.Eases[i];

      if (!ease.Active)
      {
        this.Eases.splice(i, 1);
        --i;

        continue;
      }

      let state = ease.Update(dt);

      if (state !== ACBC.Ease.State.Completed)
      {
        if (blocking)
          return ACBC.Ease.State.Running;
      }
      else
      {
        ease.Completed = true;
        ease.Active = false;
        this.Eases.splice(i, 1);
        --i;

        continue;
      }
    }

    return this.Empty ? ACBC.Ease.State.Completed : ACBC.Ease.State.Running;
  }

  /**
   * Makes a new EaseGroup and adds it to this set
   * @returns {ACBC.EaseGroup} The group that was made
   */
  Group()
  { return this.Add(new ACBC.EaseGroup()); }
  /**
   * Makes a new EaseSequence and adds it to this set
   * @returns {ACBC.EaseSequence} The sequence that was made
   */
  Sequence()
  { return this.Add(new ACBC.EaseSequence()); }
  /**
   * Makes a new EaseDelay and adds it to this set
   * @param {number} duration The delay duration
   * @returns {ACBC.EaseDelay} The ease that was made
   */
  Delay(duration)
  { return this.Add(new ACBC.EaseDelay(duration)); }
  /**
   * Makes a new EaseCall and adds it to this set
   * @param {EaseCallback} callback The function to call
   * @param {boolean} live @see EaseCallback for explanation
   * @param  {any[] | LiveArg[]} args Any arguments to pass to the callback
   * @returns {ACBC.EaseCall} The ease that was made
   */
  Call(callback, live = false, ...args)
  { return this.Add(new ACBC.EaseCall(callback, live, ...args)); }
};


/** @extends ACBC.EaseSet */
ACBC.EaseGroup = class extends ACBC.EaseSet
{
  Name = "Group";
  /** @override */
  Update(dt) { return this.ProcessEases(dt, false); }
};

/** @extends ACBC.EaseSet */
ACBC.EaseSequence = class extends ACBC.EaseSet
{
  Name = "Sequence";
  /** @override */
  Update(dt) { return this.ProcessEases(dt, true); }
};

/** @extends ACBC.Ease */
ACBC.EaseDelay = class extends ACBC.Ease
{
  Name = "Delay";
  /**
   * @param {number} duration
   * How long to wait before moving on to the next ease in the set
   */
  constructor(duration)
  {
    super();
    this.Remaining = this.Duration = duration;
  }

  /** @override */
  Update(dt)
  {
    this.Started = true;
    this.Remaining -= dt;

    return this.Remaining > 0 ?
      ACBC.Ease.State.Running : ACBC.Ease.State.Completed;
  }
};


/**
 * @callback EaseCallback
 * @param {...*} args
 * @returns {void}
 */
/**
 * @typedef LiveArg
 * @prop {object} Object
 * The object containing the value specified by the given key
 * @prop {string} Key
 * The key to use to read the desired value from the given object
 */
/** @extends ACBC.Ease */
ACBC.EaseCall = class extends ACBC.Ease
{
  Name = "Call";
  /** @type {EaseCallback} */
  Callback = null;
  Live = false;
  /** @type {any[] | LiveArg[]} */
  Args = [];

  /**
   * @param {EaseCallback} callback
   * The function to call
   * @param {boolean} live
   * Whether the arguments should be cached as they are when the action is
   * created (false) or read at the moment the callback is finally called (true)
   * @param  {any[] | LiveArg[]} args
   * Any arguments that should be passed into the callback
   */
  constructor(callback, live = false, ...args)
  {
    super();
    this.Callback = callback;
    this.Live = live;
    this.Args = args;
  }

  Update(dt)
  {
    Started = true;
    Remaining = 0;

    if (this.Live)
      this.Args = this.Args.map(a => a.Object[a.Key]);
    
    /** @todo Decide whether any further checking needs to be done here */
    this.Callback(...this.Args);

    return ACBC.Ease.State.Completed;
  }
};

/** @extends ACBC.Ease */
ACBC.EaseNumber = class extends ACBC.Ease
{
  Name = "Number";
  Start = -1;
  End = -1;
  /** @type {ACBC.Curve} */
  Curve = null;

  /**
   * @param {number} end 
   * @param {number} duration 
   * @param {ACBC.Curve} curve 
   */
  constructor(end, duration, curve)
  {
    super();
    this.End = end;
    this.Remaining = this.Duration = duration;
    this.Curve = curve;
  }

  /**
   * Prepares the ease to be processed and updated
   * @returns {void} Nothing
   */
  Initialize() {}
  /**
   * Does something with a number
   * @param {number} value The value to set
   * @returns {void} Nothing
   */
  Set(value) {}

  /** @override */
  Update(dt)
  {
    if (!this.Started)
    {
      this.Initialize();
      this.Started = true;
    }

    this.Remaining -= dt;
    let t = ACBC.Clamp01(this.Completion);

    if (t === 0)
      this.Set(this.Start);
    else if (t === 1)
      this.Set(this.End);
    else
      this.Set(this.Curve.Go(this.Start, this.End, t));
    
    return this.Remaining > 0 ?
      ACBC.Ease.State.Running : ACBC.Ease.State.Completed;
  }
};

/** @extends ACBC.Ease */
ACBC.EaseNumberCycle = class extends ACBC.EaseNumber
{
  Name = "NumberCycle";
  Start = -1;
  End = -1;
  /** @type {ACBC.Curve} */
  Curve = null;

  /**
   * @param {number} end 
   * @param {number} duration 
   * @param {ACBC.Curve} curve 
   */
  constructor(end, duration, curve)
  {
    super();
    this.End = end;
    this.Remaining = this.Duration = duration;
    this.Curve = curve;
  }

  /**
   * Prepares the ease to be processed and updated
   * @returns {void} Nothing
   */
  Initialize() {}
  /**
   * Does something with a number
   * @param {number} value The value to set
   * @returns {void} Nothing
   */
  Set(value) {}

  /** @override */
  Update(dt)
  {
    if (!this.Started)
    {
      this.Initialize();
      this.Started = true;
    }

    this.Remaining -= dt;
    let t = ACBC.Clamp01(this.Completion);

    if (t === 0)
      this.Set(this.Start);
    else if (t === 1)
      this.Set(this.Start);
    else
      this.Set(this.Curve.Go(this.Start, this.End, t));
    
    return this.Remaining > 0 ?
      ACBC.Ease.State.Running : ACBC.Ease.State.Completed;
  }
};

/** @extends ACBC.Ease */
ACBC.EaseColor = class extends ACBC.Ease
{
  Name = "Color";
  Start = "";
  End = "";
  /** @type {ACBC.Curve} */
  Curve = null;

  /**
   * @param {string} end 
   * @param {number} duration 
   * @param {ACBC.Curve} curve 
   */
  constructor(end, duration, curve)
  {
    super();
    this.End = end;
    this.Remaining = this.Duration = duration;
    this.Curve = curve;
  }

  /**
   * Prepares the ease to be processed and updated
   * @returns {void} Nothing
   */
  Initialize() {}
  /**
   * Does something with a color
   * @param {string} color The color to set
   * @returns {void} Nothing
   */
  Set(color) {}

  /** @override */
  Update(dt)
  {
    if (!this.Started)
    {
      this.Initialize();
      this.Started = true;
    }

    this.Remaining -= dt;
    let t = ACBC.Clamp01(this.Completion);

    if (t === 0)
      this.Set(this.Start);
    else if (t === 1)
      this.Set(this.End);
    else
      this.Set(this.Curve.Go(this.Start, this.End, t));
    
    return this.Remaining > 0 ?
      ACBC.Ease.State.Running : ACBC.Ease.State.Completed;
  }
};

/** @extends ACBC.Ease */
ACBC.EaseArousal = class extends ACBC.Ease
{
  /** @todo Implement this */
};

/** @extends ACBC.EaseNumberCycle */
ACBC.SquishX = class extends ACBC.EaseNumberCycle
{
  constructor(end, duration, curve)
  {
    super();
    this.End = end;
    this.Duration = duration;
    this.Curve = curve;
  }

  /** @override */
  Initialize() { this.Start = ACBC.ScaleX; }
  /** @override */
  Set(scale) { ACBC.ScaleX = scale; }
};


console.log(" * Ease.js loaded.");
