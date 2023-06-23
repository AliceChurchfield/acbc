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


let ResetPair = class
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


let ResetData = class
{
  /** @type {object} */
  ResetTargetObject;
  /** @type {ResetPair[]} */
  Pairs = [];

  /**
   * @param {object} resetTargetObject 
   */
  constructor(resetTargetObject)
  {
    this.ResetTargetObject = resetTargetObject;
  }

  /**
   * @param {string} key 
   * @param {*} resetValue 
   * @returns {void}
   */
  Add(key, resetValue)
  {
    this.Pairs.push(new ResetPair(key, resetValue));
  }

  /**
   * @param {ResetPair} pair 
   * @returns {void}
   */
  ApplyPair(pair) { this.ResetTargetObject[pair.Key] = pair.ResetValue; }

  Reset()
  {
    for (const pair of this.Pairs)
      this.ApplyPair(pair);
  }
};


ACBC.DrawCharacterAssetMods = function(args, next)
{
  /** @type {ResetData[]} */
  let resetData = [];
  /** @type {Character} */
  let C = args[0];
  if (C?.ACBC && C.ACBC.Tx.IsActive())
  {
    for (const item of C.Appearance)
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
        let data = new ResetData(asset);
        data.Add("DrawingLeft", asset.DrawingLeft);
        data.Add("DrawingTop", asset.DrawingTop);
        asset.DrawingLeft = -C.ACBC.Tx.PosX;
        asset.DrawingTop = -C.ACBC.Tx.PosY;
      }
    }
  }

  let returnVal = next(args);

  for (const data of resetData)
    data.Reset();

  return returnVal;
};


ACBC.HookFunction("DrawCharacter", 0, ACBC.DrawCharacterAssetMods);


console.log(" * Assets.js loaded.");
