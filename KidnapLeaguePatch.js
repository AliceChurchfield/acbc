/**
 * KidnapLeaguePatch.js
 * 
 * @file
 *   Patches in new behavior to enhance KidnapLeague.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running KidnapLeaguePatch.js outside of acbc.js");
  window.ACBC = {};
}


KidnapLeagueRandomIntro = function() {

	// Sets the kidnapping scene
	CommonSetScreen("Room", "KidnapLeague");
	KidnapLeagueBackground = "MainHall";
	KidnapLeagueRandomKidnapper = null;
	CharacterDelete("NPC_KidnapLeague_RandomKidnapper");
	KidnapLeagueRandomKidnapper = CharacterLoadNPC("NPC_KidnapLeague_RandomKidnapper");
	CharacterSetCurrent(KidnapLeagueRandomKidnapper);

	// A Mistress can pop if the player is a master kidnapper
	if ((ReputationGet("Kidnap") >= 100) && (Math.floor(Math.random() * 10) == 0)) {
		CharacterArchetypeClothes(KidnapLeagueRandomKidnapper, "Mistress");
		KidnapLeagueRandomKidnapperScenario = "6";
		KidnapLeagueRandomKidnapperDifficulty = 10;
		KidnapLeagueArchetype = "Mistress";
    ACBC.ActionRole("Command", KidnapLeagueRandomKidnapper, true);
	} else {
		KidnapLeagueRandomKidnapperScenario = (Math.floor(Math.random() * 6)).toString();
		KidnapLeagueRandomKidnapperDifficulty = Math.floor(Math.random() * 6);
		KidnapLeagueArchetype = "";
    ACBC.RandomRole(KidnapLeagueRandomKidnapper, "Command", true);
	}

	// If the player is already tied up, we skip the fight
	if (Player.CanInteract()) {
		KidnapLeagueRandomKidnapper.Stage = KidnapLeagueRandomKidnapperScenario.toString();
		KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Intro" + KidnapLeagueRandomKidnapperScenario);
	} else {
		KidnapLeagueRandomKidnapper.Stage = "202";
		KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Automatic" + KidnapLeagueRandomKidnapperScenario);
	}
};


console.log(" * KidnapLeaguePatch.js loaded.");
