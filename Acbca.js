/**
 * Acbca.js
 * 
 * @file
 *   Defines the composition of an ACBC character, which may be constructed onto
 *   an existing vanilla BC character (including NPCs).
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Acbca.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.Acbca = class Acbca
{
  /** @type {Character} */
  C;
  /** @type {ACBC.Component[]} */
  Components = [];
  /** @type {ACBC.Component[]} */
  PhysicsUpdaters = [];
  /** @type {ACBC.Component[]} */
  LateUpdaters = [];
  /** @type {ACBC.PlanGroup} */
  Plans;

  /**
   * @param {Character} c 
   */
  constructor(c)
  {
    this.C = c;
    c.Acbca = this;
    this.Plans = new ACBC.PlanGroup();
  }

  /**
   * @param {typeof ACBC.Component} componentClass 
   * @param  {...any} args 
   * @returns {ACBC.Component}
   */
  Add(componentClass, ...args)
  {
    let component = new componentClass(this, ...args);
    this[componentClass.name] = component;
    this.Components.push(component);
    if (typeof component.PhysicsUpdate === "function")
      this.PhysicsUpdaters.push(component);
    if (typeof component.LateUpdate === "function")
      this.LateUpdaters.push(component);
    return component;
  }

  Initialize()
  {
    for (const component of this.Components)
      component.Initialize();
  }

  /**
   * @param {number} dt 
   */
  Update(dt)
  {
    for (const component of this.Components)
      component.Update(dt);
    for (const component of this.PhysicsUpdaters)
      component.PhysicsUpdate(dt);
      
    this.Plans.Update(dt);

    for (const component of this.LateUpdaters)
      component.LateUpdate(dt);
  }
};


/** @type {Character[]} */
ACBC.Characters = [];
/**
 * @param {Character} C 
 * @returns {ACBC.Acbca}
 */
ACBC.CharacterSetup = function(C)
{
  C = ACBC.Find(C);
  if (!C) return;
  if (C.Acbca) return;

  let acbca = new ACBC.Acbca(C);
  acbca.Add(ACBC.Tx);
  acbca.Add(ACBC.Body);
  acbca.Add(ACBC.Hop);
  acbca.Initialize();

  ACBC.Characters.push(C);

  return acbca;
};


/**
 * @param {number} dt 
 */
ACBC.CharacterUpdate = function(dt)
{
  for (const character of ACBC.Characters)
    character.Acbca.Update(dt);
};


/**
 * @param {Array} args - The arguments to pass to next
 * @param {(args: Array) => void} next - The next function in the hook chain
 * @returns {void} - Nothing
 */
ACBC.GameRunCharacterUpdate = function(args, next)
{
  ACBC.CharacterUpdate(ACBC.Dt());
  return next(args);
};


ACBC.HookFunction("GameRun", 0, ACBC.GameRunCharacterUpdate);


console.log(" * Acbca.js loaded.");
