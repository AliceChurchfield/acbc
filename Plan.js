/**
 * Plan.js
 * 
 * @file
 *   Establishes the "plan" system of interpolating values
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Plan.js outside of acbc.js");
  window.ACBC = {};
}


/** @abstract */
ACBC.Plan = class Plan
{
  /** @enum {string} */
  static State =
  {
    Running: "Running",
    Completed: "Completed",
  };

  Name = "Base Plan";
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
   * Updates the plan, nudging it one step closer to completion
   * @virtual
   * @param {number} dt - Delta time in seconds
   * @returns {ACBC.Plan.State} - The state of the plan following the update
   */
  Update(dt) { return ACBC.Plan.State.Completed; }
  /**
   * A chance for a plan to do something just before it's canceled
   * @virtual
   * @returns {void} - Nothing
   */
  OnCanceled() {}

  /**
   * Terminates the plan prematurely
   * @returns {void} - Nothing
   */
  Cancel()
  {
    this.OnCanceled();
    this.Active = false;
  }
};


/** @abstract */
ACBC.PlanSet = class PlanSet extends ACBC.Plan
{
  Name = "Set";
  /** @type {ACBC.Plan[]} */
  Plans = [];
  get Count() { return this.Plans.length; }
  get Empty() { return this.Plans.length === 0; }

  /**
   * Adds a plan to this set's container of plans
   * @param {ACBC.Plan} plan - The plan to add to the set
   * @returns {ACBC.Plan} - The plan that was added (for chaining purposes)
   */
  Add(plan)
  {
    this.Plans.push(plan);
    return plan;
  }

  /**
   * Processes the plans in this set
   * @param {number} dt - Delta time in seconds
   * @param {boolean} blocking
   * Whether this set should update all of its plans or just the first one
   * that's active. True for sequences, false for groups.
   * @returns {ACBC.Plan.State} - The state of this set following this update
   */
  ProcessPlans(dt, blocking)
  {
    for (let i = 0; i < this.Count; ++i)
    {
      let plan = this.Plans[i];

      /**
       * @todo
       * I don't know how we'd get into this situation, where we have inactive
       * plans in the set. Look into whether this is even necessary.
       */
      if (!plan.Active)
      {
        this.Plans.splice(i, 1);
        --i;

        continue;
      }

      let state = plan.Update(dt);

      if (state !== ACBC.Plan.State.Completed)
      {
        if (blocking)
          return ACBC.Plan.State.Running;
      }
      else
      {
        plan.Completed = true;
        plan.Active = false;
        this.Plans.splice(i, 1);
        --i;

        /**
         * @todo
         * Is this continue instruction necessary? This is always going to be
         * the end of the loop body, right? Did I do this just in case I wanted
         * to expand this loop later or something? Look into whether I should
         * remove this.
         */
        continue;
      }
    }

    return this.Empty ? ACBC.Plan.State.Completed : ACBC.Plan.State.Running;
  }

  /**
   * Makes a new PlanGroup and adds it to this set
   * @returns {ACBC.PlanGroup} The group that was made (for chaining)
   */
  Group()
  { return this.Add(new ACBC.PlanGroup()); }
  /**
   * Makes a new PlanSequence and adds it to this set
   * @returns {ACBC.PlanSequence} The sequence that was made (for chaining)
   */
  Sequence()
  { return this.Add(new ACBC.PlanSequence()); }
  /**
   * Makes a new PlanDelay and adds it to this set
   * @param {number} duration The delay duration
   * @returns {ACBC.PlanSet} This set (for chaining)
   */
  Delay(duration)
  {
    this.Add(new ACBC.PlanDelay(duration));
    return this;
  }
  /**
   * Makes a new PlanCall and adds it to this set
   * @param {PlanCallback} callback The function to call
   * @param {boolean} live @see PlanCallback for explanation
   * @param  {any[] | LiveArg[]} args Any arguments to pass to the callback
   * @returns {ACBC.PlanSet} This set (for chaining)
   */
  Call(callback, live = false, ...args)
  {
    this.Add(new ACBC.PlanCall(callback, live, ...args));
    return this;
  }
  /**
   * Makes a new PlanProperty and adds it to this set
   * @param {object} target The object whose property should be affected
   * @param {string} propertyName The property to affect
   * @param {number | string} end The value the property should have at the end
   * @param {number} duration How long the plan should take
   * @param {ACBC.Curve} curve An easing curve. Quad.InOut by default
   * @param {boolean} cycling Whether this property should end where it starts
   * @param {()=>any} postSetter A function that gets called after Set
   * @param {...*} args Any arguments to pass into the PostSetter
   * @returns {ACBC.PlanSet} This set (for chaining)
   */
  Property(target, propertyName, end, duration,
    curve = new ACBC.Curve, cycling = false, postSetter = null, ...args)
  {
    this.Add(new ACBC.PlanProperty(target, propertyName, end, duration,
      curve, cycling, postSetter, ...args));
    return this;
  }
};

/** @extends ACBC.PlanSet */
ACBC.PlanGroup = class PlanGroup extends ACBC.PlanSet
{
  Name = "Group";
  /** @override */
  Update(dt) { return this.ProcessPlans(dt, false); }
};

/** @extends ACBC.PlanSet */
ACBC.PlanSequence = class PlanSequence extends ACBC.PlanSet
{
  Name = "Sequence";
  /** @override */
  Update(dt) { return this.ProcessPlans(dt, true); }
};

/** @extends ACBC.Plan */
ACBC.PlanDelay = class PlanDelay extends ACBC.Plan
{
  Name = "Delay";
  /**
   * @param {number} duration
   * How long to wait before moving on to the next plan in the set
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
      ACBC.Plan.State.Running : ACBC.Plan.State.Completed;
  }
};

/**
 * @callback PlanCallback
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
/** @extends ACBC.Plan */
ACBC.PlanCall = class PlanCall extends ACBC.Plan
{
  Name = "Call";
  /** @type {PlanCallback} */
  Callback = null;
  Live = false;
  /** @type {any[] | LiveArg[]} */
  Args = [];

  /**
   * @param {PlanCallback} callback
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

    return ACBC.Plan.State.Completed;
  }
};

/** @extends ACBC.Plan */
ACBC.PlanProperty = class PlanProperty extends ACBC.Plan
{
  Name = "Property";
  /** @type {object} */
  Target;
  /** @type {string} */
  PropertyName;
  /** @type {number | string} */
  Start;
  /** @type {number | string} */
  End;
  /** @type {ACBC.Curve} */
  Curve;
  /** @type {boolean} */
  Cycling;
  /** @type {()=>any} */
  PostSetter;
  /** @type {any[]} */
  PostSetterArgs;

  /** @todo Consider allowing for "live args" as with the PlanCall class */
  /**
   * @param {object} target 
   * @param {string} propertyName 
   * @param {number | string} end 
   * @param {number} duration 
   * @param {ACBC.Curve} curve 
   * @param {boolean} cycling 
   * @param {()=>any} postSetter
   * @param {...*} args
   */
  constructor(target, propertyName, end, duration,
    curve = new ACBC.Curve, cycling = false, postSetter = null, ...args)
  {
    super();
    this.Target = target;
    this.PropertyName = propertyName;
    this.End = end;
    this.Remaining = this.Duration = duration;
    this.Curve = curve;
    this.Cycling = cycling;
    this.PostSetter = postSetter;
    this.PostSetterArgs = args;
  }

  /**
   * Grabs the current value of the target property and stores it in Start
   * @returns {void} Nothing
   */
  Initialize()
  {
    /** @todo Look into whether this is necessary or if it's bad */
    if (!this.Target)
    {
      this.Active = false;
      return;
    }

    this.Start = this.Target[this.PropertyName];
  }

  /**
   * Updates the target property with its new value as computed in Update
   * @param {number | string} value The value to set
   * @returns {void} Nothing
   */
  Set(value)
  {
    /** @todo Look into whether this is necessary or if it's bad */
    if (!this.Target)
    {
      this.Active = false;
      return;
    }

    this.Target[this.PropertyName] = value;

    if (typeof this.PostSetter === "function")
      this.PostSetter(...this.PostSetterArgs);
  }

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
      this.Set(this.Cycling ? this.Start : this.End);
    else
      this.Set(this.Curve.Go(this.Start, this.End, t));
    
    return this.Remaining > 0 ?
      ACBC.Plan.State.Running : ACBC.Plan.State.Completed;
  }
};

/** @extends ACBC.PlanProperty */
ACBC.PlanArousal = class PlanArousal extends ACBC.PlanProperty
{
  /** @todo Implement this */
};


console.log(" * Plan.js loaded.");
