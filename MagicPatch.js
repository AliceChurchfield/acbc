/**
 * MagicPatch.js
 * 
 * @file
 *   Patches in new behavior to enhance Magic.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running MagicPatch.js outside of acbc.js");
  window.ACBC = {};
}


MagicLoad = function() {
	// Default load
	if (MagicPerformer == null) {
		MagicPerformer = CharacterLoadNPC("NPC_Magic_Performer");
		MagicAssistant = CharacterLoadNPC("NPC_Magic_Assistant");
		ACBC.ActionRole("Command", MagicPerformer, true);
		let exclude = ["Command"];
		if (Player.ACBC.CurrentRole?.Name !== "Command")
			exclude.push(Player.ACBC.CurrentRole.Name);
		ACBC.RandomRole(MagicAssistant, exclude);
		MagicPlayerAppearance = Player.Appearance.slice();
		MagicAssistantDress();
		CharacterSetActivePose(MagicAssistant, "LegsClosed", true);
		MagicPerformerAppearance = MagicPerformer.Appearance.slice();
		MagicAssistantAppearance = MagicAssistant.Appearance.slice();
		MagicPerformer.AllowItem = false;
		MagicAssistant.AllowItem = false;
		MagicShowState = 1;
	}
}


MagicAssistantDress = function() {
	ACBC.ActionRole(MagicAssistant.ActionRole || "Medical", MagicAssistant,
	  true, false);
	MagicShowState = 3;
}


MagicTrickBoxTiedLight = function() {
	InventoryWear(Player, "NylonRope", "ItemFeet");
	TypedItemSetOptionByName(Player, "ItemFeet", "AnklesKnees");
	InventoryWear(Player, "NylonRope", "ItemLegs");
	TypedItemSetOptionByName(Player, "ItemLegs", "Knees");
	InventoryWear(Player, "NylonRope", "ItemArms");
	TypedItemSetOptionByName(Player, "ItemArms", "BoxTie");
	InventoryWear(Player, "ClothGag", "ItemMouth", "#FFF");
	TypedItemSetOptionByName(Player, "ItemMouth", "Cleave");
	InventoryWear(Player, "WoodenBox", "ItemDevices");
	MagicPerformer.Stage = "131";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "131");
}


MagicTrickBoxTiedHeavy = function() {
	InventoryWear(Player, "HempRope", "ItemFeet");
	TypedItemSetOptionByName(Player, "ItemFeet", "FullBinding");
	InventoryWear(Player, "HempRope", "ItemLegs");
	TypedItemSetOptionByName(Player, "ItemLegs", "Mermaid");
	InventoryWear(Player, "HempRope", "ItemArms");
	TypedItemSetOptionByName(Player, "ItemArms", "WristElbowHarnessTie");
	InventoryWear(Player, "ScarfGag", "ItemMouth", "#D2D2D2");
	TypedItemSetOptionByName(Player, "ItemMouth", "OTN");
	InventoryWear(Player, "WoodenBox", "ItemDevices");
	MagicPerformer.Stage = "151";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "151");
}


MagicTrickBoxWaterCell = function() {
	InventoryWear(Player, "HempRope", "ItemFeet");
	InventoryGet(Player, "ItemFeet").Property = { Type: "Suspension", SetPose: ["LegsClosed", "Suspension"], Difficulty: 6, OverrideHeight: { Height: -150, Priority: 41, HeightRatioProportion: 0 }, };
	InventoryWear(Player, "HempRope", "ItemLegs");
	TypedItemSetOptionByName(Player, "ItemLegs", "Mermaid");
	InventoryWear(Player, "HempRope", "ItemArms");
	TypedItemSetOptionByName(Player, "ItemArms", "BoxTie");
	InventoryWear(Player, "WaterCell", "ItemDevices");
	MagicPerformer.Stage = "171";
	MagicPerformer.CurrentDialog = DialogFind(MagicPerformer, "171");
}


MagicSongGwendoyn = function() {
	InventoryWear(Player, "HempRope", "ItemFeet");
	TypedItemSetOptionByName(Player, "ItemFeet", "FullBinding");
	InventoryWear(Player, "HempRope", "ItemLegs");
	TypedItemSetOptionByName(Player, "ItemLegs", "Mermaid");
	InventoryWear(Player, "LeatherArmbinder", "ItemArms");
	TypedItemSetOptionByName(Player, "ItemArms", "Strap");
	InventoryWear(Player, "ClothGag", "ItemMouth");
	TypedItemSetOptionByName(Player, "ItemMouth", "OTN", "#FFF");
	InventoryWear(MagicAssistant, "HempRope", "ItemFeet");
	TypedItemSetOptionByName(MagicAssistant, "ItemFeet", "FullBinding");
	InventoryWear(MagicAssistant, "HempRope", "ItemLegs");
	TypedItemSetOptionByName(MagicAssistant, "ItemLegs", "Mermaid");
	InventoryWear(MagicAssistant, "LeatherArmbinder", "ItemArms");
	TypedItemSetOptionByName(MagicAssistant, "ItemArms", "WrapStrap");
	InventoryWear(MagicAssistant, "ClothBlindfold", "ItemHead", "#FFF");
	MagicShowState = 4;
}


console.log(" * MagicPatch.js loaded.");
