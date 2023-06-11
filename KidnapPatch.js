/**
 * KidnapPatch.js
 * 
 * @file
 *   Patches in new behavior to enhance Kidnap.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running KidnapPatch.js outside of acbc.js");
  window.ACBC = {};
}


KidnapDrawMove = function(C, Header, X, Side) {
	DrawText(TextGet(Header), X, 50, "White", "Gray");
	for (let M = 0; M < C.KidnapCard.length; M++)
  {
    let card = C.KidnapCard[M];
    let effectiveColors =
    [
      "#FCC", // Brute Force
      "#CFC", // Domination
      "#CCF", // Sneakiness
      "#FFF", // Meditation
    ];
    let ineffectiveColors =
    [
      "#866", // Brute Force
      "#686", // Domination
      "#668", // Sneakiness
      "#FFF", // Meditation
    ];
    let effective = KidnapMoveEffective(C, C.KidnapCard[M].Move);
		let Color = (effective ? effectiveColors : ineffectiveColors)[card.Move];
		let Value = KidnapMoveEffective(C, C.KidnapCard[M].Move) ? C.KidnapCard[M].Value : Math.round(C.KidnapCard[M].Value / 2);
		let Text = TextGet(KidnapMoveType[C.KidnapCard[M].Move]);
		if (Value != null) Text = Text + " - " + Value.toString();
		DrawButton(X - 240, (M * 100) + 100, 480, 80, "", Color);
		DrawText(Text, X + ((Value != null) ? ((Side == "Left") ? -60 : 60) : 0), (M * 100) + 140, "Black", "Silver");
		if (Value != null) DrawImage("Screens/MiniGame/Kidnap/" + Side + KidnapRPS[C.KidnapCard[M].Move] + ".png", X + ((Side == "Left") ? 115 : -220), (M * 100) + 100);
	}
};


KidnapClick = function() {

	// If we must end the fight
	if (KidnapMode == "End") { CommonDynamicFunction(KidnapReturnFunction); return; }

	// When the user wants to skip the result or upper hand selection from the AI
	if ((KidnapMode == "Intro") || (KidnapMode == "SuddenDeath") || (KidnapMode == "ShowMove") || ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID == 0))) {
		KidnapSetMode("SelectMove");
		return;
	}

	// When the user selects a regular move
	if (KidnapMode == "SelectMove") {
		for (let M = 0; M < Player.KidnapCard.length; M++)
			if ((MouseX >= 10) && (MouseX <= 490) && (MouseY >= 100 + (M * 100)) && (MouseY <= 180 + (M * 100)))
				KidnapSelectMove(M);
		return;
	}

	// When the user selects a upper hand move
	if ((KidnapMode == "UpperHand") && (KidnapUpperHandVictim.ID > 0)) {
		for (let M = 0; M <= KidnapUpperHandMoveType.length - 1; M++)
			if ((MouseX >= 50) && (MouseX <= 450) && (MouseY >= 100 + (M * 100)) && (MouseY <= 170 + (M * 100)))
				KidnapSelectMoveUpperHand(M);
		return;
	}

	// If we must cancel out and don't select any item
	if ((MouseX >= 1750) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 90))
		KidnapSetMode("SelectMove");

	// If the user clicks on one of the items to be applied to the opponent
	if ((KidnapMode == "SelectItem") && (MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000)) {

		// For each items in the player/opponent inventory
		var X = 1000;
		var Y = 125;
		for (let I = 0; I < DialogInventory.length; I++) {

			// If the item at position is clicked, we add the item to the opponent
			if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
        let assetName = DialogInventory[I].Asset.Name;
				let groupName = DialogInventory[I].Asset.Group.Name;
				let dataPair = ACBC.Kidnapping.Favorite(assetName, groupName);
				let color = KidnapOpponent.Appearance.find(
					i => i.Asset.Name === assetName)?.Color || dataPair.Color;
				InventoryWear(KidnapOpponent, assetName, groupName, color,
					null, null, null, false);
				let type = dataPair.Type;
				if (type)
					TypedItemSetOptionByName(KidnapOpponent, groupName, type, true);
				CharacterRefresh(KidnapOpponent);
				KidnapSetMode("SelectMove");
				break;
			}

			// Change the X and Y position to get the next square
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}

		}

	}

};


console.log(" * KidnapPatch.js loaded.");
