/**
 * MainHallPatch.js
 * 
 * @file
 *   Patches in new behavior to enhance MainHall.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running MainHallPatch.js outside of acbc.js");
  window.ACBC = {};
}


MainHallLoad = function() {

	// Loads the variables and dialog
	ChatSearchSafewordAppearance = null;
	//CharacterSetActivePose(Player, null);
	if (ChatSearchPreviousActivePose != null) {
		ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
		ChatSearchPreviousActivePose = null;
	}
	MainHallBackground = Player.VisualSettings && Player.VisualSettings.MainHallBackground ? Player.VisualSettings.MainHallBackground : "MainHall";
	MainHallStartEventTimer = null;
	MainHallNextEventTimer = null;
	if (!Player.ImmersionSettings.ReturnToChatRoom || (Player.LastChatRoom === "") || MainHallBeingPunished || (AsylumGGTSGetLevel(Player) >= 6))
		MainHallMaid = CharacterLoadNPC("NPC_MainHall_Maid");
	MainHallIsMaid = LogQuery("JoinedSorority", "Maid");
	MainHallIsHeadMaid = LogQuery("LeadSorority", "Maid");
	MainHallHasOwnerLock = InventoryCharacterHasOwnerOnlyRestraint(Player);
	MainHallHasLoverLock = InventoryCharacterHasLoverOnlyRestraint(Player);
	MainHallHasFamilyLock = InventoryCharacterHasFamilyOnlyRestraint(Player);
	for (let A = 0; A < Player.Appearance.length; A++)
		if (Player.Appearance[A].Asset.Name == "SlaveCollar")
			if (Player.Appearance[A].Property)
				MainHallHasSlaveCollar = true;
	CommonReadCSV("NoArravVar", "Room", "Management", "Dialog_NPC_Management_RandomGirl");
	CommonReadCSV("NoArravVar", "Room", "KidnapLeague", "Dialog_NPC_KidnapLeague_RandomKidnapper");
	CommonReadCSV("NoArravVar", "Room", "Private", "Dialog_NPC_Private_Custom");
	CommonReadCSV("NoArravVar", "Room", "AsylumEntrance", "Dialog_NPC_AsylumEntrance_KidnapNurse");
	CommonReadCSV("NoArravVar", "Room", "AsylumEntrance", "Dialog_NPC_AsylumEntrance_EscapedPatient");
	CommonReadCSV("NoArravVar", "Room", "Prison", "Dialog_NPC_Prison_Police");
	TextPrefetch("Character", "Appearance");
	TextPrefetch("Character", "InformationSheet");
	TextPrefetch("Character", "Text_Relog");
	TextPrefetch("Online", "ChatSearch");
}


console.log(" * MainHallPatch.js loaded.");
