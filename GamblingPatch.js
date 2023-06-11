/**
 * GamblingPatch.js
 * 
 * @file
 *   Patches in new behavior to enhance Gambling.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running GamblingPatch.js outside of acbc.js");
  window.ACBC = {};
}


GamblingStripTied = function(gstCarachter, gstLevel) {
	var r = false;
	if (gstLevel == 1) {
		InventoryRemove(gstCarachter, "Necklace");
		InventoryRemove(gstCarachter, "RightAnklet");
		InventoryRemove(gstCarachter, "LeftAnklet");
		InventoryRemove(gstCarachter, "HairAccessory3");
	} else if (gstLevel == 2) {
		InventoryRemove(gstCarachter, "Hat");
		InventoryRemove(gstCarachter, "Shoes");
		InventoryRemove(gstCarachter, "Gloves");
	} else if (gstLevel == 3) {
		InventoryRemove(gstCarachter, "Cloth");
		InventoryRemove(gstCarachter, "ClothLower");
	} else if (gstLevel == 4) {
		InventoryWearRandom(gstCarachter, "ItemLegs");
		InventoryWearRandom(gstCarachter, "ItemFeet");
	} else if (gstLevel == 5) {
		InventoryWearRandom(gstCarachter, "ItemArms");
	} else if (gstLevel == 6) {
		InventoryWearRandom(gstCarachter, "ItemMouth3");
		r = true;
	}
	return r;

};


GamblingLoad = function() {

	// Default load
	if (GamblingFirstSub == null) {
		GamblingFirstSub =  CharacterLoadNPC("NPC_Gambling_FirstSub");
		GamblingSecondSub = CharacterLoadNPC("NPC_Gambling_SecondSub");
		GamblingFirstSub.AllowItem = false;
		GamblingSecondSub.AllowItem = false;
		GamblingAppearanceFirst = GamblingFirstSub.Appearance.slice();
		GamblingAppearanceSecond = GamblingSecondSub.Appearance.slice();
	}

	GamblingAppearancePlayer = Player.Appearance.slice();
	GamblingIllegalChange = false;

	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "Gambling") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		CharacterNaked(GamblingFirstSub);
		InventoryWearRandom(GamblingFirstSub, "ItemLegs");
		InventoryWearRandom(GamblingFirstSub, "ItemFeet");
		InventoryWearRandom(GamblingFirstSub, "ItemArms");
		InventoryWearRandom(GamblingFirstSub, "ItemMouth");
		InventoryWear(GamblingFirstSub, "LeatherBlindfold", "ItemHead");
		GamblingFirstSub.AllowItem = true;
		GamblingFirstSub.Stage = "MaidRescue";
		CharacterNaked(GamblingSecondSub);
		InventoryWearRandom(GamblingSecondSub, "ItemLegs");
		InventoryWearRandom(GamblingSecondSub, "ItemFeet");
		InventoryWearRandom(GamblingSecondSub, "ItemArms");
		InventoryWearRandom(GamblingSecondSub, "ItemMouth");
		InventoryWear(GamblingSecondSub, "LeatherBlindfold", "ItemHead");
		GamblingSecondSub.AllowItem = true;
		GamblingSecondSub.Stage = "MaidRescue";
	}
};


GamblingToothpickController = function(ToothpickState) {
	if (ToothpickState == "new") {
		GamblingToothpickCount = 15;
		GamblingFirstSub.Stage = "200";
	}

	else if (ToothpickState == "give_up") {
		GamblingFirstSub.Stage = "203";
	}

	else if (ToothpickState == "win") {
		ReputationProgress("Gambling", 1);
		GamblingFirstSub.AllowItem = true;
	}

	else if (ToothpickState == "lost") {
		var difficulty = Math.floor(Math.random() * 5) + 2;
		InventoryWearRandom(Player, "ItemArms", difficulty);
		InventoryWearRandom(Player, "ItemMouth", difficulty);
		InventoryWearRandom(Player, "ItemLegs", difficulty);
		InventoryWearRandom(Player, "ItemFeet", difficulty);
	}

	else {
		GamblingToothpickCount -= parseInt(ToothpickState);

		// has player lost?
		if (GamblingToothpickCount <= 0) {
			GamblingFirstSub.Stage = "202";
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ToothpickLost");
		}

		// NPC
		if (GamblingToothpickCount > 0) {
			var npc_choice = GamblingToothpickNPCChoice();
			GamblingFirstSub.Stage = "201";
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "Toothpick" + npc_choice.toString());
			GamblingToothpickCount -= npc_choice;
			GamblingFirstSub.Stage = "200";

			// has NPC lost?
			if (GamblingToothpickCount <= 0) {
				GamblingFirstSub.Stage = "201";
			}
		}
	}
};


console.log(" * GamblingPatch.js loaded.");
