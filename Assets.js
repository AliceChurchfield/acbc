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
ACBC.Assets.ItemDevices.WoodenBox =
{
  Fixed: true,
  Previous: {},
};
ACBC.Assets.ItemDevices.Pole =
{
  Fixed: true,
  Previous: {},
};


ACBC.DrawCharacterAssetMods = function(args, next)
{
  /** @type {Character} */
  let C = args[0];

  if (!C.ACBC?.Tx) return next(args);

  /** @type {Map<any, Map<string, any>>} */
  let resetData = new Map;
  /**
   * @todo See if I need to care whether I do this
   * unconditionally, every frame
   */
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
      let left = asset.DrawingLeft ?? asset.Group.DrawingLeft;
      let top = asset.DrawingTop ?? asset.Group.DrawingTop;
      left -= C.ACBC.Tx.PosX;
      top -= C.ACBC.Tx.PosY;

      /**
       * @todo If necessary, generalize this to check for any differences in
       * a more robust way that will allow for more properties
       */
      if (assetData.Previous.DrawingLeft !== left ||
          assetData.Previous.DrawingTop !== top)
      {
        assetData.Previous =
        {
          DrawingLeft: left,
          DrawingTop: top,
        };
        /** @type {Map<string, any>} */
        let properties = new Map;
        resetData.set(asset, properties);
        properties.set("DrawingLeft", asset.DrawingLeft);
        properties.set("DrawingTop", asset.DrawingTop);
        asset.DrawingLeft = left;
        asset.DrawingTop = top;
      }
    }
  }

  if (resetData.size > 0)
    CharacterRefresh(C, false);

  let returnVal = next(args);

  resetData.forEach((propertyMap, asset) =>
    propertyMap.forEach((propertyValue, propertyName) =>
      asset[propertyName] = propertyValue));

  return returnVal;
};


ACBC.HookFunction("DrawCharacter", 0, ACBC.DrawCharacterAssetMods);


console.log(" * Assets.js loaded.");
