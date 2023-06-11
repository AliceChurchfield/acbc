/**
 * PokerFix.js
 * 
 * @file
 *   Fixes some of the faulty behavior from Poker.js
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running PokerFix.js outside of acbc.js");
  window.ACBC = {};
}



/**
 * Gets a possible image for a poker player P
 * @param {PokerPlayer} P
 * @returns {void} - Nothing
 */
function PokerGetImage(P) {

	// Skip if there's no player
	if ((P.Type == "None") || (P.Name == "None")) return;
	let Progress = PokerGetProgress(P);

	// For a regular Bondage Club character, we can add or remove restraints
	if (P.Type == "Character")
  {
		if ((Progress > 40) && (P.Cloth != null) && (InventoryGet(P.Character, "Cloth") == null)) WearItem(P.Character, P.Cloth, false);
		if ((Progress > 40) && (P.ClothLower != null) && (InventoryGet(P.Character, "ClothLower") == null)) WearItem(P.Character, P.ClothLower, false);
		if ((Progress > 40) && (P.ClothAccessory != null) && (InventoryGet(P.Character, "ClothAccessory") == null)) WearItem(P.Character, P.ClothAccessory, false);
		if ((Progress <= 40) && (InventoryGet(P.Character, "Cloth") != null)) InventoryRemove(P.Character, "Cloth");
		if ((Progress <= 40) && (InventoryGet(P.Character, "ClothLower") != null)) InventoryRemove(P.Character, "ClothLower");
		if ((Progress <= 40) && (InventoryGet(P.Character, "ClothAccessory") != null)) InventoryRemove(P.Character, "ClothAccessory");
		if ((Progress > 30) && (InventoryGet(P.Character, "ItemLegs") != null)) InventoryRemove(P.Character, 'ItemLegs');
		if ((Progress <= 30) && (InventoryGet(P.Character, "ItemLegs") == null)) InventoryWearRandom(P.Character, 'ItemLegs');
		if ((Progress > 20) && (InventoryGet(P.Character, "ItemMouth") != null)) InventoryRemove(P.Character, 'ItemMouth');
		if ((Progress <= 20) && (InventoryGet(P.Character, "ItemMouth") == null)) InventoryWearRandom(P.Character, 'ItemMouth');
		if ((Progress > 10) && (P.Panties != null) && (InventoryGet(P.Character, "Panties") == null)) WearItem(P.Character, P.Panties, false);
		if ((Progress > 10) && (P.Bra != null) && (InventoryGet(P.Character, "Bra") == null)) WearItem(P.Character, P.Bra, false);
		if ((Progress <= 10) && (InventoryGet(P.Character, "Panties") != null)) InventoryRemove(P.Character, "Panties");
		if ((Progress <= 10) && (InventoryGet(P.Character, "Bra") != null)) InventoryRemove(P.Character, "Bra");
		if ((Progress > 0) && (InventoryGet(P.Character, "ItemArms") != null)) InventoryRemove(P.Character, 'ItemArms');
		if ((Progress <= 0) && (InventoryGet(P.Character, "ItemArms") == null)) InventoryWearRandom(P.Character, 'ItemArms');
		CharacterRefresh(P.Character);
	}

	// For set images, a single opponent can have a large image, else we find a valid image from the game progress
	if ((P.Type == "Set") && (P.Data != null)) {

		// First try to get an alternate version of the image
		let Images = [];
		if ((P.Alternate == null) && (P.Data != null) && (P.Data.cache.Alternate != null))
			P.Alternate = Math.floor(Math.random() * parseInt(P.Data.cache.Alternate)) + 1;
		if (P.Alternate != null) {
			if ((PokerPlayerCount == 2) && (PokerMode != "")) {
				let X = 0;
				while (P.Data.cache[X] != null) {
					if (P.Data.cache[X].substr(8, 19) == "OpponentLarge-Alt" + P.Alternate.toString() + "=") {
						let From = P.Data.cache[X].substr(0, 3);
						let To = P.Data.cache[X].substr(4, 3);
						if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
							if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
								Images.push(P.Data.cache[X].substr(27, 100));
					}
					X++;
				}
			}
			if (Images.length == 0) {
				let X = 0;
				while (P.Data.cache[X] != null) {
					if (P.Data.cache[X].substr(8, 14) == "Opponent-Alt" + P.Alternate.toString() + "=") {
						let From = P.Data.cache[X].substr(0, 3);
						let To = P.Data.cache[X].substr(4, 3);
						if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
							if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
								Images.push(P.Data.cache[X].substr(22, 100));
					}
					X++;
				}
			}
		}

		// Sets the non alternative images
		if ((PokerPlayerCount == 2) && (PokerMode != "")) {
			let X = 0;
			while (P.Data.cache[X] != null) {
				if (P.Data.cache[X].substr(8, 14) == "OpponentLarge=") {
					let From = P.Data.cache[X].substr(0, 3);
					let To = P.Data.cache[X].substr(4, 3);
					if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
						if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
							Images.push(P.Data.cache[X].substr(22, 100));
				}
				X++;
			}
		}
		if (Images.length == 0) {
			let X = 0;
			while (P.Data.cache[X] != null) {
				if (P.Data.cache[X].substr(8, 9) == "Opponent=") {
					let From = P.Data.cache[X].substr(0, 3);
					let To = P.Data.cache[X].substr(4, 3);
					if (!isNaN(parseInt(From)) && !isNaN(parseInt(To)))
						if ((Progress >= parseInt(From)) && (Progress <= parseInt(To)))
							Images.push(P.Data.cache[X].substr(17, 100));
				}
				X++;
			}
		}

		// If an image was found
		if (Images.length > 0)
			P.Image = "Screens/Room/Poker/" + CommonRandomItemFromList("", Images);

	}

};


console.log(" * PokerFix.js loaded.");
