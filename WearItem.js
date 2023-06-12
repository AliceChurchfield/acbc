/**
 * WearItem.js
 * 
 * @file
 *   Defines the handy WearItem function.
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running WearItem.js outside of acbc.js");
  window.ACBC = {};
}


/**
 * Options to use when calling WearItem on a target character who's already
 * wearing something in the given item's slot.
 *  - Replace: Replace whatever's there
 *  - InheritColor: Same as replace, but use the old item's color
 *  - Fail: Give up and return early
 * @readonly
 * @enum {"Replace"|"InheritColor"|"Fail"}
 */
var WearItemReplaceOption =
{
  Replace: "Replace",
  InheritColor: "InheritColor",
  Fail: "Fail",
};

/**
 * Pushes the given item onto the appearance of the given character, subject to
 * the given replacement option and validation flag.
 * @param {Character} C
 * The character to receive the item
 * @param {Item} item
 * What do to when the target character already has something in that slot
 * @param {boolean} validate
 * The item to apply
 * @param {WearItemReplaceOption} replaceOption
 * Whether we should care if the target character has the item blocked / limited
 * @param {boolean} refresh
 * Whether we should call CharacterRefresh at the end of it all
 * @returns {void}
 * Nothing
 */
WearItem = function(C, item, validate = true,
  replaceOption = WearItemReplaceOption.Replace, refresh = true)
{
  let blocked = InventoryBlockedOrLimited(C, item, item.Property?.Type);
  if (validate && blocked) return;

  let index = C.Appearance.findIndex(
    e => e.Asset.Group.Name === item.Asset.Group.Name);
  let oldItem = C.Appearance[index];

  if (oldItem)
  {
    if (replaceOption === WearItemReplaceOption.Fail) return;

    if (replaceOption === WearItemReplaceOption.InheritColor)
      item.Color = oldItem.Color;
    
    C.Appearance.splice(index, 1);
  }
  
  ExtendedItemInit(C, item, false);
  C.Appearance.push(item);

  if (refresh)
    CharacterRefresh(C);
};

console.log(" * WearItem.js loaded.");
