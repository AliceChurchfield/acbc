/**
 * Assets.js
 * 
 * @file
 *   Data defining modifications to existing assets
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running Assets.js outside of acbc.js");
  window.ACBC = {};
}


ACBC.Assets = {};
ACBC.Assets.ItemDevices = {};
let WoodenBox =
{
  Fixed: true,
};
ACBC.Assets.ItemDevices.WoodenBox = WoodenBox;
let Pole =
{
  Fixed: true,
};
ACBC.Assets.ItemDevices.Pole = Pole;


if (ACBC.Classes === undefined) ACBC.Classes = {};
ACBC.Classes.DataResetter = class
{
  ResetPair = class
  {
    /** @type {string} */
    Key;
    /** @type {*} */
    ResetValue;

    /**
     * @param {string} key 
     * @param {*} resetValue 
     */
    constructor(key, resetValue)
    {
      this.Key = key;
      this.ResetValue = resetValue;
    }
  };

  ResetData = class
  {
    /** @type {object} */
    TargetObject;
    /** @type {ACBC.Classes.DataResetter.ResetPair[]} */
    Pairs = [];

    /**
     * @param {object} targetObject 
     */
    constructor(targetObject)
    {
      this.TargetObject = targetObject;
    }

    /**
     * @param {string} key 
     * @returns {void}
     */
    Add(key)
    {
      this.Pairs.push(
        new ACBC.Classes.DataResetter.ResetPair(
          key, this.TargetObject[key]));
    }

    /**
     * @param {ACBC.Classes.DataResetter.ResetPair} pair 
     * @returns {void}
     */
    ApplyPair(pair) { this.TargetObject[pair.Key] = pair.ResetValue; }

    Reset()
    {
      for (const pair of this.Pairs)
        this.ApplyPair(pair);
    }
  };

  /** @type {ACBC.Classes.DataResetter.ResetData[]} */
  Data = [];

  /**
   * @param {object} targetObject 
   * @returns {ACBC.Classes.DataResetter.ResetData}
   */
  Add(targetObject)
  {
    let resetData = new this.ResetData(targetObject);
    this.Data.push(resetData);
    return resetData;
  }

  Reset()
  {
    for (const data of this.Data)
      data.Reset();
  }
};


ACBC.DrawCharacterAssetMods = function(args, next)
{
  let resetter = new ACBC.Classes.DataResetter();
  /** @type {Character} */
  let C = args[0];
  if (C?.ACBC && C.ACBC.Tx.IsActive())
  {
    for (const item of C.Appearance.filter(i => i.Asset.Group.Name === "ItemDevices"))
    {
      let asset = item.Asset;
      let groupName = asset.Group.Name;
      let groupData = C.ACBC.Assets[groupName];
      if (!groupData) continue;

      let assetName = asset.Name;
      let assetData = groupData[assetName];
      if (!assetData) continue;

      if (assetData.Fixed)
      {
        let data = resetter.Add(asset);
        data.Add("DrawingLeft", asset.DrawingLeft);
        data.Add("DrawingTop", asset.DrawingTop);
        asset.DrawingLeft = -C.ACBC.Tx.PosX;
        asset.DrawingTop = -C.ACBC.Tx.PosY;
      }
    }
  }

  let returnVal = next(args);

  resetter.Reset();

  return returnVal;
};


ACBC.HookFunction("DrawCharacter", 0, ACBC.DrawCharacterAssetMods);


console.log(" * Assets.js loaded.");
