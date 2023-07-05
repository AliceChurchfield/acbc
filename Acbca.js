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


/** @abstract */
ACBC.EventData = class EventData
{
  Handled;

  constructor()
  {
    this.Handled = false;
  }
};
/**
 * @callback EventHandler
 * @param {ACBC.EventData} eventData
 * @returns {void}
 */


ACBC.UpdateEvent = class UpdateEvent extends ACBC.EventData
{
  /** @type {number} */
  Dt;

  /**
   * @param {number} dt 
   */
  constructor(dt)
  {
    super();
    this.Dt = dt;
  }
};


ACBC.Acbca = class Acbca
{
  /** @type {Character} */
  C;
  /** @type {ACBC.Component[]} */
  Components = [];
  /** @type {ACBC.PlanGroup} */
  Plans;
  /** @type {Map<string, EventHandler[]>} */
  EventConnections = new Map;

  /**
   * @param {Character} c 
   */
  constructor(c)
  {
    this.C = c;
    c.Acbca = this;
    this.Plans = new ACBC.PlanGroup();
  }

  get Name() { return CharacterNickname(this.C); }

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
    return component;
  }

  Initialize()
  {
    for (const component of this.Components)
      component.Initialize();
  }

  /**
   * @param {UpdateEvent} updateEvent 
   */
  Update(updateEvent)
  {
    this.Dispatch(ACBC.Events.MainUpdate, updateEvent);
    this.Dispatch(ACBC.Events.PhysicsUpdate, updateEvent);
      
    this.Plans.Update(updateEvent);
  }

  /**
   * @param {string} eventName 
   * @param {EventHandler} handler ***`Remember to use proper binding!`***
   * @returns {void}
   */
  Connect(eventName, handler)
  {
    let handlers = this.EventConnections.get(eventName);

    if (handlers)
      handlers.push(handler);
    else
      this.EventConnections.set(eventName, [handler]);
  }

  /**
   * @param {string} eventName 
   * @param {EventHandler} handler ***`Remember to use proper binding!`***
   * @returns {void}
   */
  Disconnect(eventName, handler)
  {
    let handlers = this.EventConnections.get(eventName);

    if (!handlers)
    {
      /** @todo Full error reporting */
      let connectionStr = `${handler.name} from ${eventName} on ${this.Name}`;
      let err = `Tried to disconnect ${connectionStr}, ` +
        `but that event couldn't be found.`;
      console.error(err);
      return;
    }

    let handlerIndex = handlers.indexOf(handler); 
    
    if (handlerIndex < 0)
    {
      /** @todo Full error reporting */
      let connectionStr = `${handler.name} from ${eventName} on ${this.Name}`;
      let err = `Tried to disconnect ${connectionStr}, ` +
        `but that handler couldn't be found.`;
      console.error(err);
      return;
    }

    handlers.splice(handlerIndex, 1);
  }

  /**
   * @param {string} eventName 
   * @param {ACBC.EventData} eventData 
   */
  Dispatch(eventName, eventData)
  {
    let handlers = this.EventConnections.get(eventName);

    if (!handlers) return;
    
    for (const handler of handlers)
      handler(eventData);
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
  let updateEvent = new ACBC.UpdateEvent(dt);

  for (const character of ACBC.Characters)
    character.Acbca.Update(updateEvent);
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
