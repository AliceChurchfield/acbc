/**
 * KidnapFix.js
 * 
 * @file
 *   Fixes some of the faulty behavior from Kidnap.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running KidnapFix.js outside of acbc.js");
  window.ACBC = {};
}


KidnapUpperHandMoveAvailable = function(MoveType, DoMove) {

	// Mercy is always available
	let MoveName = KidnapUpperHandMoveType[MoveType];
	if (MoveName == "Mercy") return true;

	// If we need to check to strip the opponent
	if ((MoveName == "Cloth") && (InventoryGet(KidnapUpperHandVictim, "Cloth") != null)) {
		if (DoMove) {
			let excludeAccessoryNames =
			[
				"Glitter",
				"FacePaint",
				"Kissmark",
			];
			InventoryRemove(KidnapUpperHandVictim, "Cloth");
			InventoryRemove(KidnapUpperHandVictim, "ClothLower");
			let accessory = InventoryGet(KidnapUpperHandVictim, "ClothAccessory");
			if (!excludeAccessoryNames.includes(accessory?.Asset.Name))
				InventoryRemove(KidnapUpperHandVictim, "ClothAccessory");
		}
		return true;
	}

	// If we need to check to apply a restrain
	if (((MoveName == "ItemFeet") || (MoveName == "ItemMouth")) && (InventoryGet(KidnapUpperHandVictim, MoveName) == null)) {
		if (DoMove) InventoryWearRandom(KidnapUpperHandVictim, MoveName, (KidnapUpperHandVictim.ID == 0) ? KidnapDifficulty : 0);
		return true;
	}

	// If we need to check to dress back
	let C = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponent : Player;
	let Cloth = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentCloth : KidnapPlayerCloth;
	let ClothAccessory = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentClothAccessory : KidnapPlayerClothAccessory;
	let ClothLower = (KidnapUpperHandVictim.ID == 0) ? KidnapOpponentClothLower : KidnapPlayerClothLower;
	if ((MoveName == "UndoCloth") && (InventoryGet(C, "Cloth") == null) && (Cloth != null)) {
		if (DoMove)
		{
			KidnapDressBack(C, Cloth, ClothAccessory, ClothLower);
		}
		return true;
	}

	// If we need to check to remove the restrain
	if ((MoveName == "UndoItemFeet") || (MoveName == "UndoItemMouth")) {
		const groupName = /** @type {AssetGroupName} */(MoveName.replace("Undo", ""));
		let I = InventoryGet(C, groupName);
		if ((I != null) && ((C.ID != 0) || !InventoryItemHasEffect(I, "Lock", true))) {
			if (DoMove) InventoryRemove(C, groupName);
			return true;
		}
	}

	// Invalid move
	return false;

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


KidnapShowMove = function() {
	DrawTextWrap(TextGet(KidnapDialog + "Action"), 10, 150, 580, 200, "white");
	DrawTextWrap(CharacterNickname(Player) + ": " + SpeechGarble(Player, TextGet(KidnapDialog + "Player")), 10, 350, 580, 200, "white");
	DrawTextWrap(KidnapOpponent.Name + ": " + SpeechGarble(KidnapOpponent, TextGet(KidnapDialog + "Opponent")), 10, 550, 580, 200, "white");
	DrawTextWrap(KidnapResultPlayer, 1410, 150, 580, 200, "white");
	DrawTextWrap(KidnapResultOpponent, 1410, 350, 580, 200, "white");
	DrawTextWrap(KidnapResultUpperHand, 1410, 550, 580, 200, "white");
	DrawText(TextGet(KidnapMoveType[KidnapPlayerMove]) + ((KidnapPlayerDamage != null) ? " - " + KidnapPlayerDamage.toString() : ""), 750, 25, "white", "gray");
	DrawText(TextGet(KidnapMoveType[KidnapOpponentMove]) + ((KidnapOpponentDamage != null) ? " - " + KidnapOpponentDamage.toString() : ""), 1250, 25, "white", "gray");
};


KidnapSelectMove = function(CardIndex) {

	// Gets both moves effectiveness
	var OpponentCardIndex = KidnapAIMove();
	var PlayerMove = Player.KidnapCard[CardIndex].Move;
	var OpponentMove = KidnapOpponent.KidnapCard[OpponentCardIndex].Move;
	var PM = KidnapMoveMap[PlayerMove][OpponentMove];
	var OM = KidnapMoveMap[OpponentMove][PlayerMove];
	KidnapDialog = "Player" + KidnapMoveType[PlayerMove] + "Opponent" + KidnapMoveType[OpponentMove];

	// Keep the move to show it later
	KidnapPlayerMove = PlayerMove;
	KidnapOpponentMove = OpponentMove;

	// Gets the damage done by both sides
	KidnapPlayerDamage = Player.KidnapCard[CardIndex].Value;
	if (!KidnapMoveEffective(Player, PlayerMove)) KidnapPlayerDamage = Math.round(KidnapPlayerDamage / 2);
	KidnapOpponentDamage = KidnapOpponent.KidnapCard[OpponentCardIndex].Value;
	if (!KidnapMoveEffective(KidnapOpponent, OpponentMove)) KidnapOpponentDamage = Math.round(KidnapOpponentDamage / 2);

	// If the move is effective, we lower the willpower and show it as text
	if (PM >= 1) {
		let Damage = KidnapPlayerDamage;
		if (PlayerMove == OpponentMove) Damage = Damage - KidnapOpponentDamage;
		if (Damage < 0) Damage = 0;
		KidnapOpponent.KidnapWillpower = parseInt(KidnapOpponent.KidnapWillpower) - Damage;
		KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultOpponent = KidnapOpponent.Name + " " + TextGet("NoLost");
	if (OM >= 1) {
		let Damage = KidnapOpponentDamage;
		if (PlayerMove == OpponentMove) Damage = Damage - KidnapPlayerDamage;
		if (Damage < 0) Damage = 0;
		Player.KidnapWillpower = parseInt(Player.KidnapWillpower) - Damage;
		KidnapResultPlayer = CharacterNickname(Player) + " " + TextGet("Lost") + " " + Damage.toString() + " " + TextGet("Willpower");
	} else KidnapResultPlayer = CharacterNickname(Player) + " " + TextGet("NoLost");

	// Builds the "Upperhand" text
	KidnapResultUpperHand = "";
	KidnapUpperHandVictim = null;
	if ((PM >= 2) && (PlayerMove != 3) && (OpponentMove != 3)) { KidnapUpperHandVictim = KidnapOpponent; KidnapResultUpperHand = CharacterNickname(Player) + " " + TextGet("UpperHand"); }
	if ((OM >= 2) && (PlayerMove != 3) && (OpponentMove != 3)) { KidnapUpperHandVictim = Player; KidnapResultUpperHand = KidnapOpponent.Name + " " + TextGet("UpperHand"); }

	// Cannot go below zero
	if (Player.KidnapWillpower < 0) Player.KidnapWillpower = 0;
	if (KidnapOpponent.KidnapWillpower < 0) KidnapOpponent.KidnapWillpower = 0;

	// Removes the card from the deck
	Player.KidnapCard.splice(CardIndex, 1);
	KidnapOpponent.KidnapCard.splice(OpponentCardIndex, 1);

	// When someone meditates, it resets her stats to max
	if (PlayerMove == 3) KidnapBuildCards(Player);
	if (OpponentMove == 3) KidnapBuildCards(KidnapOpponent);

	// Shows the move dialog
	KidnapSetMode("ShowMove");

};


KidnapRun = function() {

	// Draw the kidnap elements
	var X = 500;
	if (KidnapMode == "SelectItem") X = 0;
	DrawCharacter(Player, X, 0, 1);
	DrawCharacter(KidnapOpponent, X + 500, 0, 1);
	DrawProgressBar(X + 100, 960, 300, 35, Math.round(Player.KidnapWillpower / Player.KidnapMaxWillpower * 100));
	DrawProgressBar(X + 600, 960, 300, 35, Math.round(KidnapOpponent.KidnapWillpower / KidnapOpponent.KidnapMaxWillpower * 100));
	DrawText(Player.KidnapWillpower.toString(), X + 250, 979, "black", "white");
	DrawText(KidnapOpponent.KidnapWillpower.toString(), X + 750, 979, "black", "white");
	if (KidnapMode == "Intro") KidnapTitle(CharacterNickname(Player) + " vs " + KidnapOpponent.Name);
	if (KidnapMode == "SuddenDeath") KidnapTitle(TextGet("SuddenDeath"));
	if (KidnapMode == "End") KidnapTitle(((KidnapVictory) ? CharacterNickname(Player) : KidnapOpponent.Name) + " " + TextGet("Wins"));
	if (KidnapMode == "SelectMove") { KidnapDrawMove(Player, "SelectMove", 250, "Left"); KidnapDrawMove(KidnapOpponent, "OpponentMove", 1750, "Right"); }
	if (KidnapMode == "UpperHand") KidnapDrawMoveUpperHand();
	if (KidnapMode == "ShowMove") KidnapShowMove();
	if (KidnapMode == "SelectItem") KidnapShowItem();

	// If the time is over, we go to the next step
	if (CommonTime() >= KidnapTimer) {
		if (KidnapMode == "SelectMove") { KidnapSelectMove(Player.KidnapCard.length - 1); return; }
		if (KidnapMode == "End") { CommonDynamicFunction(KidnapReturnFunction); return; }
		if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || (KidnapMode == "UpperHand") || (KidnapMode == "SelectItem")) KidnapSetMode("SelectMove");
	} else KidnapShowTimer();

};


console.log(" * KidnapFix.js loaded.");
