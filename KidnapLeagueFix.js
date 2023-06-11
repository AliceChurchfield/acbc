/**
 * KidnapLeagueFix.js
 * 
 * @file
 *   Fixes some of the faulty behavior from KidnapLeague.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running KidnapLeagueFix.js outside of acbc.js");
  window.ACBC = {};
}


KidnapLeagueClick = function() {
	if (!DailyJobSubSearchIsActive() && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && MouseIn(1000, 0, 500, 1000)) {
		ManagementClubSlaveDialog(KidnapLeagueTrainer);
		CharacterSetCurrent(KidnapLeagueTrainer);
	}
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) {
		if (Player.CanChangeOwnClothes() && (InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null))
    {
      KidnapDressBack(Player, KidnapPlayerCloth,
        KidnapPlayerClothAccessory, KidnapPlayerClothLower);
		}
		CommonSetScreen("Room", "MainHall");
	}
	DailyJobSubSearchClick();
};


KidnapLeagueResetTrainer = function() {
	KidnapLeagueTrainer.AllowItem = false;
	CharacterRelease(Player);
	CharacterRelease(KidnapLeagueTrainer);
	if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null))
  {
    KidnapDressBack(Player, KidnapPlayerCloth,
      KidnapPlayerClothAccessory, KidnapPlayerClothLower);
	}
	if ((InventoryGet(KidnapLeagueTrainer, "Cloth") == null) && (KidnapOpponentCloth != null))
  {
    KidnapDressBack(KidnapLeagueTrainer, KidnapOpponentCloth,
      KidnapOpponentClothAccessory, KidnapOpponentClothLower);
	}
};


KidnapLeagueRandomEnd = function() {
	if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null))
  {
    KidnapDressBack(Player, KidnapPlayerCloth,
      KidnapPlayerClothAccessory, KidnapPlayerClothLower);
	}
	if ((InventoryGet(KidnapLeagueRandomKidnapper, "Cloth") == null) && (KidnapOpponentCloth != null))
  {
    KidnapDressBack(KidnapLeagueRandomKidnapper, KidnapOpponentCloth,
      KidnapOpponentClothAccessory, KidnapOpponentClothLower);
	}
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
};


KidnapLeagueRandomActivityLaunch = function() {

	// After 4 activities, there's more and more chances that the player will be released
	KidnapLeagueRandomActivityCount++;
	if (Math.random() * KidnapLeagueRandomActivityCount >= 4) {
		KidnapLeagueRandomActivityCount = 0;
		if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) {
      KidnapDressBack(Player, KidnapPlayerCloth,
        KidnapPlayerClothAccessory, KidnapPlayerClothLower);
		}
		if ((!InventoryCharacterHasOwnerOnlyRestraint(Player)) && (!InventoryCharacterHasLoverOnlyRestraint(Player)) && (!InventoryCharacterHasFamilyOnlyRestraint(Player))){
			CharacterRelease(Player);
			KidnapLeagueRandomActivityStart("End");
			KidnapLeagueVisitRoom = ((Math.random() >= 0.5) && KidnapLeagueCanTransferToRoom());
		} else KidnapLeagueRandomActivityStart("EndNoRelease");
		return;
	}

	// Finds an activity to do on the player
	while (true) {

		// Picks an activity at random
		KidnapLeagueRandomActivity = CommonRandomItemFromList(KidnapLeagueRandomActivity, KidnapLeagueRandomActivityList);

		// Add or remove an item
		if ((KidnapLeagueRandomActivity == "AddGag") && (InventoryGet(Player, "ItemMouth") == null)) { InventoryWearRandom(Player, "ItemMouth", KidnapLeagueRandomKidnapperDifficulty); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "RemoveGag") && (InventoryGet(Player, "ItemMouth") != null) && !InventoryOwnerOnlyItem(InventoryGet(Player, "ItemMouth")) && !InventoryLoverOnlyItem(InventoryGet(Player, "ItemMouth")) && !InventoryFamilyOnlyItem(InventoryGet(Player, "ItemMouth"))){
			InventoryRemove(Player, "ItemMouth"); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "AddFeet") && (InventoryGet(Player, "ItemFeet") == null) && !Player.IsKneeling()) { InventoryWearRandom(Player, "ItemFeet", KidnapLeagueRandomKidnapperDifficulty); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "RemoveFeet") && (InventoryGet(Player, "ItemFeet") != null) && !InventoryOwnerOnlyItem(InventoryGet(Player, "ItemFeet")) && !InventoryLoverOnlyItem(InventoryGet(Player, "ItemFeet")) && !InventoryFamilyOnlyItem(InventoryGet(Player, "ItemFeet"))) {
			InventoryRemove(Player, "ItemFeet"); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "AddLegs") && (InventoryGet(Player, "ItemLegs") == null) && !Player.IsKneeling()) { InventoryWearRandom(Player, "ItemLegs", KidnapLeagueRandomKidnapperDifficulty); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "RemoveLegs") && (InventoryGet(Player, "ItemLegs") != null) && !InventoryOwnerOnlyItem(InventoryGet(Player, "ItemLegs")) && !InventoryLoverOnlyItem(InventoryGet(Player, "ItemLegs")) && !InventoryFamilyOnlyItem(InventoryGet(Player, "ItemLegs"))) {
			InventoryRemove(Player, "ItemLegs"); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }

		// Physical activities
		if ((KidnapLeagueRandomActivity == "Kiss") && (InventoryGet(Player, "ItemMouth") == null)) { KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "Spank") || (KidnapLeagueRandomActivity == "Fondle") || (KidnapLeagueRandomActivity == "Tickle")) { KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }

	}
};


KidnapDressBack = function(C, Cloth, ClothAccessory, ClothLower)
{
  InventoryWear(C, Cloth.Asset.Name, "Cloth", Cloth.Color,
    null, null, null, true);
  InventoryGet(C, "Cloth").Property = Cloth.Property;
  if (ClothAccessory != null)
  {
    InventoryWear(C, ClothAccessory.Asset.Name, "ClothAccessory",
      ClothAccessory.Color, null, null, null, true);
    InventoryGet(C, "ClothAccessory").Property = ClothAccessory.Property;
  }
  if (ClothLower != null)
  {
    InventoryWear(C, ClothLower.Asset.Name, "ClothLower", ClothLower.Color,
      null, null, null, true);
    InventoryGet(C, "ClothLower").Property = ClothLower.Property;
  }
  CharacterRefresh(C, true);
};


console.log(" * KidnapLeagueFix.js loaded.");
