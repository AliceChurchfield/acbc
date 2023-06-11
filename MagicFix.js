/**
 * MagicFix.js
 * 
 * @file
 *   Fixes some of the faulty behavior from Magic.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running MagicFix.js outside of acbc.js");
  window.ACBC = {};
}


/**
 * Copies restraints from one character to another
 * @param {Character} FromC - The source for all restraints
 * @param {Character} ToC - The target of all restraints
 * @returns {void} - Nothing
 */
MagicRestrainCopyTransfer = function(FromC, ToC) {
	// Removes any previous appearance asset From second character
	MagicRestrainRemove(ToC);

  // From the From character's appearance array...
  FromC.Appearance
  // ...get just the items whose group name is in the list...
    .filter(i => MagicRestraintList.includes(i.Asset?.Group.Name))
  // ...and add them to the To character's appearance array
    .forEach(i => ToC.Appearance.push(i));

	// Removes any previous appearance asset From first
	MagicRestrainRemove(FromC);

	// Refreshes the second character and saves it if it's the player
	CharacterRefresh(ToC);
	CharacterRefresh(FromC);
	if (ToC.ID == 0) ServerPlayerAppearanceSync();
}


console.log(" * MagicFix.js loaded.");
