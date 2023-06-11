/**
 * acbc-main.js
 * 
 * @file
 *   Most of the content of ACBC.
 *   TODO:
 *     move all of this into other files
 * @author   Alice Churchfield
 */



if (!window.ACBC)
{
  console.warn("Running acbc-main.js outside of acbc.js");
  window.ACBC = {};
}

ACBC.Private =
{
  BoopSneezeEnabled: true,
  BoopSneezeCooldownDuration: 5 * 60 * 1000, // in ms
  BoopSneezeLast: null,
  BoopSneezing: false,
  PublishBoopSneezeCooldown: false,
  IgnoreBoopSneezeCooldown: false,
  Language: "English",
  SignReadyColor: "#396",
  TextReadyColor: "#FF0",
  SignWaitingColor: "#934",
  TextWaitingColor: "#FFF",
  SignColorIndex: 4,
  TextColorIndex: 8,
  CachedCooldown: 0,
  RopeSpellStart: "Honkus ponkus! Let",
  RopeSpellEnd: "be wrapped in rope!",
  HornyVoidRoomTag: "[hornyvoid]",
  VoidVictims: new Map(),
  HornyVoidEnabled: false,
  NpcWardrobeSettings:
  {
    AllowFullWardrobeAccess: true,
    BlockBodyCosplay: false,
    ItemsAffectExpressions: true,
  },

  SpankReactionStrings:
  [
    "♥ oh ♥",
    "♥ ah~ ♥",
    "♥ Mmh~! ♥",
  ],
};

ACBC.Roles =
{
  Infantry:
  {
    Name: "Infantry",
    Colors:
    {
      ArmorTop: null,
      Glitter: "#000",
      ArmorBottom: null,
      Pantyhose: null,
      Swimsuit: "#0A0A0A",
      Knees: "#040404",
      Socks: "#080808",
      Garter: "#222",
      Shoes: ["#111", "#444", "#9F1A3A", "#70182D", "#111"],
      Bandana: "#B9133B",
      Gloves: "#111",
      Glasses: ["#111", "#000"],
      Earrings: null,
      Lipstick: ["#111", "Default"],
      Belt: ["#FF003D", "#999", "Default"],
    },
  },
  Elite:
  {
    Name: "Elite",
    Colors:
    {
      ArmorTop: "#F8C",
      Glitter: "#FF33A7",
      ArmorBottom: "#F8C",
      Pantyhose: "#333",
      Swimsuit: "#F8C",
      Knees: "#AD5E8B",
      Socks: "#080808",
      Garter: "#222",
      Shoes: ['#111', '#444', '#F8C', '#F8C', '#111'],
      Bandana: "#0A0A0A",
      Gloves: "#000",
      Glasses: ["#111", "#FF0091"],
      Earrings: null,
      Lipstick: ["#111", "Default"],
      Belt: ["#0A0A0A", "#999", "Default"],
    }
  },
  Command:
  {
    Name: "Command",
    Colors:
    {
      ArmorTop: "#800",
      Glitter: "#000",
      ArmorBottom: "#800",
      Pantyhose: "#333",
      Swimsuit: "#A00",
      Knees: "#600",
      Socks: "#080808",
      Garter: "#222",
      Shoes: ['#111', '#444', '#700', '#700', '#111'],
      Bandana: "#0A0A0A",
      Gloves: "#000",
      Glasses: ["#111", "#000"],
      Earrings: null,
      Lipstick: ["#800", "Default"],
      Belt: ["#0A0A0A", "#999", "Default"],
    },
  },
  Engineering:
  {
    Name: "Engineering",
    Colors:
    {
      ArmorTop: "#998300",
      Glitter: "#000",
      ArmorBottom: "#998300",
      Pantyhose: "#333",
      Swimsuit: "#EECE14",
      Knees: "#A28C0F",
      Socks: "#080808",
      Garter: "#222",
      Shoes: ['#111', '#444', '#EECE14', '#EECE14', '#111'],
      Bandana: "#0A0A0A",
      Gloves: "#000",
      Glasses: ["#111", "#FFD900"],
      Earrings: "#FFD900",
      Lipstick: ["#111", "Default"],
      Belt: ["#0A0A0A", "#999", "Default"],
    },
  },
  Stealth:
  {
    Name: "Stealth",
    Colors:
    {
      ArmorTop: "#485",
      Glitter: "#000",
      ArmorBottom: "#485",
      Pantyhose: "#000",
      Swimsuit: "#485",
      Knees: "#295334",
      Socks: "#080808",
      Garter: "#222",
      Shoes: ['#111', '#444', '#000', '#000', '#111'],
      Bandana: "#0A0A0A",
      Gloves: "#000",
      Glasses: ["#111", "#000"],
      Earrings: null,
      Lipstick: ["#111", "Default"],
      Belt: ["#0A0A0A", "#999", "Default"],
    },
  },
  Science:
  {
    Name: "Science",
    Colors:
    {
      ArmorTop: "#08C",
      Glitter: "#000",
      ArmorBottom: "#08C",
      Pantyhose: "#333",
      Swimsuit: "#06ABFF",
      Knees: "#006DA5",
      Socks: "#080808",
      Garter: "#222",
      Shoes: ['#111', '#444', '#06ABFF', '#06ABFF', '#111'],
      Bandana: "#06ABFF",
      Gloves: "#000",
      Glasses: ["#111", "#00A5FF"],
      Earrings: null,
      Lipstick: ["#111", "Default"],
      Belt: ["#0A0A0A", "#999", "Default"],
    },
  },
  Medical:
  {
    Name: "Medical",
    Colors:
    {
      ArmorTop: "#800",
      Glitter: "#000",
      ArmorBottom: "#800",
      Pantyhose: "#333",
      Swimsuit: "#EEE",
      Knees: "#AAA",
      Socks: "#080808",
      Garter: "#F00",
      Shoes: ['#111', '#444', '#800', '#EEE', '#111'],
      Bandana: "#D4D4D4",
      Gloves: "#000",
      Glasses: ["#111", "#000"],
      Earrings: null,
      Lipstick: ["#800", "Default"],
      Belt: ["#0A0A0A", "#999", "Default"],
    },
  },
};

ACBC.Kidnapping =
{
  Assets: {},
  Favorite: function(assetName, groupName)
  {
    groupName = this.Private.TrimName(groupName);
    let asset = this.Private.Get(assetName);
    let color = asset?.GetRandomColor();
    let group = asset?.Get(groupName);
    let dataSet = group?.GetRandom();
    let pair =
    {
      Color: dataSet?.GetRandomColor() || color,
      Type: dataSet?.GetRandomType(),
    };

    return pair;
  },
  SetUpAsset: function(assetName)
  {
    return this.Private.Asset(assetName);
  },
  Private:
  {
    AssetData: class
    {
      constructor()
      {
        this.Colors = [];
        this.Groups = {};
      }
  
      Get(groupName)
      {
        return this.Groups[groupName];
      }
  
      New(groupName)
      {
        return this.Groups[groupName] = new ACBC.Kidnapping.Private.GroupData();
      }

      Group(groupName)
      {
        groupName = ACBC.Kidnapping.Private.TrimName(groupName);
        return this.Get(groupName) || this.New(groupName);
      }

      AddColors(...colors)
      {
        this.Colors.push(...colors);
        return this;
      }

      GetRandomColor()
      {
        return ACBC.Private.GetRandomFromArray(this.Colors);
      }
    },
    GroupData: class
    {
      constructor()
      {
        this.DataSets = []; // array of ACBC.Kidnapping.Private.DataSet
      }
  
      New()
      {
        let newSet = new ACBC.Kidnapping.Private.DataSet();
        this.DataSets.push(newSet);
        return newSet;
      }
  
      Current()
      {
        return this.DataSets[this.DataSets.length - 1] || this.New();
      }
  
      AddColors(...colors)
      {
        this.Current().Colors.push(...colors); return this;
      }
  
      AddTypes(...types)
      {
        this.Current().Types.push(...types); return this;
      }

      GetRandom()
      {
        return ACBC.Private.GetRandomFromArray(this.DataSets);
      }
    },
    DataSet: class
    {
      constructor()
      {
        this.Colors = [];
        this.Types = [];
      }

      GetRandomColor()
      {
        return ACBC.Private.GetRandomFromArray(this.Colors);
      }

      GetRandomType()
      {
        return ACBC.Private.GetRandomFromArray(this.Types);
      }
    },
    Get: function(assetName)
    {
      return ACBC.Kidnapping.Assets[assetName];
    },
    New: function(assetName)
    {
      return ACBC.Kidnapping.Assets[assetName] = new this.AssetData();
    },
    Asset: function(assetName)
    {
      return this.Get(assetName) || this.New(assetName);
    },
    TrimName: function(name)
    {
      for (let i = name.length - 1; i >= 0; --i)
      {
        let c = name.charAt(i);
        if (c < "0" || "9" < c)
          return name.substring(0, i + 1);
      }

      return "";
    },
  },
};

ACBC.Private.MakeoverPrefs =
{
  HairFront:
  [
    "1b",
    "3b",
    "3b",
    "6b",
    "6b",
    "6b",
    "7b",
    "9b",
    "9b",
    "9b",
    "13b",
    "13b",
    "14b",
    "14b",
    "17b",
    "20",
    "20",
    "21",
    "21",
    "21",
    "22b",
    "23b",
    "23b",
    "25",
    "25",
    "25",
    "25",
    "26",
    "26",
    "26",
    "27",
    "27",
    "28",
    "28",
    "28",
    "29",
    "29",
    "29",
  ],
  HairBack:
  [
    "1b",   // 1b
    "4b",   // 3b
    "4b",   // 3b
    "16",   // 7
    "16",   // 7
    "17",   // 8
    "17",   // 8
    "17",   // 8
    "17",   // 8
    "18b",  // 9b
    "19b",  // 10b
    "20b",  // 11b
    "20b",  // 11b
    "20b",  // 11b
    "5b",   // 12b
    "5b",   // 12b
    "11",   // 14
    "23",   // 18
    "23",   // 18
    "24",   // 19
    "24",   // 19
    "47",   // 42
    "47",   // 42
    "47",   // 42
    "48",   // 43
    "49",   // 44
    "49",   // 44
    "50",   // 45
    "50",   // 45
    "50",   // 45
    "52",   // 47
    "52",   // 47
    "52",   // 47
    "52",   // 47
    "53",   // 48
    "53",   // 48
    "54",   // 49
    "54",   // 49
    "54",   // 49
    "54",   // 49
    "54",   // 49
    "55",   // 50
    "55",   // 50
    "55",   // 50
    "55",   // 50
    "56",   // 51
  ],
  Eyes:
  [
    "1",
    "3",
    "5",
    "5",
    "7",
    "7",
    "9",
    "9",
    "10",
    "10",
    "10",
    "11",
    "11",
  ],
};

if (ACBC.Private.PetSignIntervalId)
{
  let id = ACBC.Private.PetSignIntervalId;
  console.log(`Clearing old interval (ID ${id})`);
  clearInterval(ACBC.Private.PetSignIntervalId);
}
ACBC.Private.PetSignIntervalId = 0;

if (!Player.HornyVoidWhitelist)
{
  let whitelist = new Map();

  whitelist.set(65983, true); // Natalya
  whitelist.set(15229, true); // Skye
  whitelist.set(1943, true);  // Wendy
  whitelist.set(37740, true); // Bunny
  whitelist.set(92824, true); // Freya
  whitelist.set(51396, true); // Mmmphhmmf
  whitelist.set(1642, true);  // Aiko
  whitelist.set(73377, true); // Stacey
  whitelist.set(47279, true); // Anna Corona

  Player.HornyVoidWhitelist = whitelist;
}


ACBC.Private.Initialize = function()
{
  console.log("Initializing ACBC....");

  ACBC.Private.KidnappingFavoritesSetup();
  ACBC.Private.ActionRoleSetup();
  ACBC.Private.FbcEmoteTriggerSetup();
};


ACBC.Private.KidnappingFavoritesSetup = function()
{
  let ballGag = ACBC.Kidnapping.SetUpAsset("BallGag");
  ballGag.Group("ItemMouth").AddTypes("Tight");

  let chains = ACBC.Kidnapping.SetUpAsset("Chains")
    .AddColors("#CCC");
  chains.Group("ItemArms").AddTypes("BoxTie", "WristElbowHarnessTie");
  chains.Group("ItemFeet").AddTypes("Strict");
  chains.Group("ItemLegs").AddTypes("Strict");

  let clothGag = ACBC.Kidnapping.SetUpAsset("ClothGag")
    .AddColors("#FFF", "#CCE", "#EB8", "#EE8");
  clothGag.Group("ItemMouth").AddTypes("OTN", "Cleave", null);

  let ductTape = ACBC.Kidnapping.SetUpAsset("DuctTape")
    .AddColors("#222", "#CCC");
  ductTape.Group("ItemMouth").AddTypes(null, "Cover");

  let hempRope = ACBC.Kidnapping.SetUpAsset("HempRope")
    .AddColors(null, "#FFF");
  hempRope.Group("ItemArms").AddTypes("BoxTie", "WristElbowHarnessTie");
  hempRope.Group("ItemFeet").AddTypes("FullBinding");
  hempRope.Group("ItemLegs").AddTypes(null, "Mermaid");

  let leatherArmbinder = ACBC.Kidnapping.SetUpAsset("LeatherArmbinder");
  leatherArmbinder.Group("ItemArms").AddTypes("Strap", "WrapStrap");

  let nylonRope = ACBC.Kidnapping.SetUpAsset("NylonRope");
  nylonRope.Group("ItemArms").AddTypes("BoxTie", "WristElbowHarnessTie");
  nylonRope.Group("ItemFeet").AddTypes("AnklesKnees");
  nylonRope.Group("ItemLegs").AddTypes(null, "KneesThighs");

  let ribbons = ACBC.Kidnapping.SetUpAsset("Ribbons");
  ribbons.Group("ItemMouth").AddTypes(null, "Bow");
  ribbons.Group("ItemLegs").AddTypes("Cross");

  let scarfGag = ACBC.Kidnapping.SetUpAsset("ScarfGag")
    .AddColors("#D2D2D2");
  scarfGag.Group("ItemMouth").AddTypes("OTN", null);

  let slb = ACBC.Kidnapping.SetUpAsset("SturdyLeatherBelts")
    .AddColors(["#111", "#999", "#111", "#999", "#111", "#999"]);
  slb.Group("ItemArms").AddTypes("Three");
  slb.Group("ItemFeet").AddTypes("Two");
  slb.Group("ItemLegs").AddTypes(null, "Two");

  let tls = ACBC.Kidnapping.SetUpAsset("ThinLeatherStraps")
    .AddColors(["#444", "#999", "Default"]);
  tls.Group("ItemArms").AddTypes("Boxtie", "WristElbowHarness");

  let zipties = ACBC.Kidnapping.SetUpAsset("Zipties");
  zipties.Group("ItemArms").AddTypes("ZipFull", "ZipWristFull");
  zipties.Group("ItemFeet").AddTypes("ZipFeetFull", "ZipFeetMedium");
  zipties.Group("ItemLegs").AddTypes("ZipLegFull", "ZipLegMedium");
};


ACBC.Private.ActionRoleSetup = function()
{
  let topAsset = AssetGet(AssetFemale3DCG, "Cloth", "MistressTop");
  if (!topAsset.HideItemExclude.includes("BraSwimsuit2"))
    topAsset.HideItemExclude.push("BraSwimsuit2");
};


// Takes a (character | name string | member number) and returns an array of
//   matching characters from the Character array.
ACBC.FindAll = function(C)
{
  // If we get nothing, we give nothing
  if (!C)
    return [];

  // If C is an object, we assume it's a character already,
  //   and we return it in a one-element array.
  if (typeof C === "object")
    return [C];

  // If it's a string, we assume it's a name
  if (typeof C === "string")
  {
    // If you're in a chat room, we need to search through the
    //   ChatRoomData.Character array, but we still need to return matches
    //   from the main Character array.
    if (ServerPlayerIsInChatRoom())
    {
      // Start by trying to find matches via nickname. If that gets no results,
      //   then check names. This way, if there is one person in a room whose
      //   nickname is the identifier, and another whose name is the identifier,
      //   this function will favor the nickname and it won't be considered an
      //   ambiguous situation.
      let matches = Character.filter((e) =>
      {
        // Include only characters with the right name AND whose member number
        //   is found in ChatRoomData.Character
        return CharacterNickname(e) === C &&
          ChatRoomData.Character.some(f => f.MemberNumber === e.MemberNumber);
      });

      if (matches.length > 0)
        return matches;

      matches = Character.filter((e) =>
      {
        return e.Name === C &&
          ChatRoomData.Character.some(f => f.MemberNumber === e.MemberNumber);
      });
      
      return matches;
    }

    // If you aren't in a chat room, then you must be looking for an NPC. We
    //   check Character instead of ChatRoomData.Character. NPCs have unique
    //   names, so there will be at most only one match.
    return [Character.find(e => e.IsNpc() && CharacterNickname(e) === C)];
  }
  
  // If it's a number, we assume it's a member number. These are unique, so
  //   there will be at most only one match.
  return [Character.find(e => e.MemberNumber === C)];
};


// Takes a (character | name string | member number) and returns a single
//   matching character (or null). If there is more than one match, and
//   random is non-falsy, then it chooses one match at random; otherwise,
//   it returns the 0th item in the matches array.
ACBC.Find = function(C, random)
{
  if (!C)
    return Player;

  if (Array.isArray(C))
  {
    if (C.length === 0) return null;

    if (random)
      return ACBC.Private.GetRandomFromArray(matches);

    return C[0];
  }
  
  if (typeof C === "string" || typeof C === "number")
  {
    let matches = ACBC.FindAll(C);

    if (C.length === 0) return null;

    if (random)
      return ACBC.Private.GetRandomFromArray(matches);
    
    return matches[0];
  }

  return C;
};


ACBC.Private.GetRandomFromArray = function(array)
{
  let index = Math.floor(Math.random() * array.length);
  return array[index];
};


ACBC.FindAllByDescription = function(description, C, returnCustomData = true)
{
  if (C)
  {
    C = ACBC.Find(C, false);

    if (!C) return;
  }
  else
  {
    C = Player;
  }

  let results = C.Appearance.filter(i => i.Asset.Description === description);

  if (!returnCustomData)
    return results;
  
  return results.map(i => ({ GroupName: i.Asset.Group.Name, ...i, }));
};


ACBC.RemoveByDescription = function(description, C)
{
  if (C)
  {
    C = ACBC.Find(C, false);

    if (!C) return;
  }
  else
  {
    C = Player;
  }
  
  let matches = C.Appearance.filter(i => i.Asset.Description === description);

  if (matches.length === 0) return;

  for (const match of matches)
    InventoryRemove(C, match.Asset.Group.Name, false);
    
  CharacterRefresh(C);
  ChatRoomCharacterUpdate(C);
};


ACBC.Log = function(item, publish)
{
  console.log(item);

  if (!publish) return;

  ACBC.SendEmote(`*${item}`);
};


ACBC.Private.AddToHornyVoidWhitelist = function(C, publish)
{
  let c;
  let matches = ACBC.FindAll(C);

  if (matches.length === 1)
  {
    c = matches[0];
  }
  else if (matches.length > 1)
  {
    let message = "The Void detects more than one member named " +
      `${C} in this room. Please specify by member number.`;
    ACBC.Log(message, publish);
    return;
  }
  
  if (!c)
  {
    let messageEnd;

    switch (typeof C)
    {
    case "string":
      messageEnd = `no member named ${C}`;
      break;
    case "number":
      messageEnd = `nobody with member number ${C}`;
      break;
    default:
      messageEnd = "no such member";
    }

    let message = `The Void knows of ${messageEnd} in this room.`;
    ACBC.Log(message, publish);
    return;
  }

  let number = c.MemberNumber;
  let name = CharacterNickname(c);

  if (Player.HornyVoidWhitelist.has(number))
  {
    let message = `The Void already has its eye on ${name}.`;
    ACBC.Log(message, publish);
    return;
  }

  Player.HornyVoidWhitelist.set(c.MemberNumber, true);
  let message = `The Void takes notice of ${name}.`;
  ACBC.Log(message);
};


ACBC.Private.RemoveFromHornyVoidWhitelist = function(C, publish)
{
  let c;
  let matches = ACBC.FindAll(C);

  if (matches.length === 1)
  {
    c = matches[0];
  }
  else if (matches.length > 1)
  {
    let message = "The Void detects more than one member named " +
      `${C} in this room. Please specify by member number.`;
    ACBC.Log(message, publish);
    return;
  }
  
  if (!c)
  {
    let messageEnd;

    switch (typeof C)
    {
    case "string":
      messageEnd = `no member named ${C}`;
      break;
    case "number":
      messageEnd = `nobody with member number ${C}`;
      break;
    default:
      messageEnd = "no such member";
    }

    let message = `The Void knows of ${messageEnd} in this room.`;
    ACBC.Log(message, publish);
    return;
  }

  let number = c.MemberNumber;
  let name = CharacterNickname(c);

  if (!Player.HornyVoidWhitelist.has(number))
  {
    let message = `The Void hadn't noticed ${name} anyway.`;
    ACBC.Log(message, publish);
    return;
  }

  Player.HornyVoidWhitelist.delete(C.MemberNumber);
  let message = `The Void loses interest in ${name}.`;
  ACBC.Log(message);
};


ACBC.Private.IsOnHornyVoidWhitelist = function(C, publish)
{
  let c;
  let matches = ACBC.FindAll(C);

  if (matches.length === 1)
  {
    c = matches[0];
  }
  else if (matches.length > 1)
  {
    let message = "The Void detects more than one member named " +
      `${C} in this room. Please specify by member number.`;
    ACBC.Log(message, publish);
    return false;
  }
  
  if (!c)
  {
    let messageEnd;

    switch (typeof C)
    {
    case "string":
      messageEnd = `no member named ${C}`;
      break;
    case "number":
      messageEnd = `nobody with member number ${C}`;
      break;
    default:
      messageEnd = "no such member";
    }

    let message = `The Void knows of ${messageEnd} in this room.`;
    ACBC.Log(message, publish);
    return false;
  }

  let number = c.MemberNumber;
  let name = CharacterNickname(c);
  let found = Player.HornyVoidWhitelist.has(number);
  let message = found ?
    `The Void is closely watching ${name}.` : `The Void doesn't seem interested in ${name}.`;
  ACBC.Log(message, publish);
  return found;
};


ACBC.Private.IsItemAllowed = function(C, itemName, groupName, itemType, isVoid)
{
  if (C.ID === 0 || "IsNpc" in C && C.IsNpc()) return true;
  if (InventoryIsPermissionBlocked(C, itemName, groupName, itemType)) return false;
  if (!InventoryIsPermissionLimited(C, itemName, groupName, itemType)) return true;

  if (isVoid)
  {
    // Currently, you cannot be a lover of the Void....
    if (C.ItemPermission > 3) return false;
    return ACBC.Private.HasWhitelistedVoid(C);
  }

  if (C.IsLoverOfPlayer() || C.IsOwnedByPlayer()) return true;
  if (C.ItemPermission > 3) return false;
  return C.WhiteList.includes(Player.MemberNumber);
};


ACBC.Private.HasWhitelistedVoid = function(C)
{
  // TODO: Make it so that players can add the Void to their whitelist
  return true;
}


// Attempts to put the specified item on the specified character.
//   Returns whether it worked.
ACBC.Private.ApplyItem = function(C, itemData, idNumber, overwrite)
{
  if (!ACBC.Private.IsItemAllowed(C, itemData.AssetName, itemData.AssetGroup,
    itemData.OptionName, idNumber < 0)) return false;

  if (!overwrite && InventoryGet(C, itemData.AssetGroup) != null) return false;

  const asset = AssetGet(C.AssetFamily, itemData.AssetGroup, itemData.AssetName);
  if (!asset) return;
  CharacterAppearanceSetItem(C, itemData.AssetGroup, asset,
    ((itemData.Color == null || itemData.Color == "Default") && asset.DefaultColor != null) ?
    asset.DefaultColor : itemData.Color, itemData.Difficulty, idNumber, false);
  let wornItem = InventoryGet(C, itemData.AssetGroup);
  if (itemData.Craft)
    InventoryWearCraft(wornItem, itemData.Craft);
  if (itemData.OptionName)
    TypedItemSetOptionByName(C, itemData.AssetGroup, itemData.OptionName);
  InventoryExpressionTrigger(C, wornItem);

  return true;
};


ACBC.Wear = function(C, itemSet, idNumber)
{
  C = ACBC.Find(C);

  if (Array.isArray(itemSet))
    for (const itemData of itemSet)
      ACBC.Private.ApplyItem(C, itemData, idNumber);
  else
    ACBC.Private.ApplyItem(C, itemSet, idNumber);

  if (Array.isArray(itemSet))
    ChatRoomCharacterUpdate(C);
  else
    ChatRoomCharacterItemUpdate(C, itemSet.AssetGroup);

  CharacterRefresh(C, true);
};


ACBC.Private.BindingHelper = function(C, name, difficulty, color)
{

};


ACBC.Sleep = function(duration)
{
  return new Promise((resolve) => setTimeout(resolve, duration));
};


ACBC.WaitFor = async function(func)
{
  while (!func()) await ACBC.Sleep(100);
}


ACBC.SurprisedEyes = async function(C)
{
  let d = 800;
  if (CurrentScreen !== "ChatRoom")
    d = 150;

  ACBC.SetEyes(C, "Closed");
  await ACBC.Sleep(d);
  ACBC.SetEyes(C, "Horny");
  await ACBC.Sleep(d);
  ACBC.SetEyes(C, "Dazed");
  await ACBC.Sleep(d);
  ACBC.SetEyes(C, null);
  await ACBC.Sleep(d);
  ACBC.SetEyes(C, "Surprised");
};


ACBC.SurprisedEyebrows = async function(C)
{
  let d = 800 * 1.8;
  if (CurrentScreen !== "ChatRoom")
    d = 150 * 1.8;

  CharacterSetFacialExpression(C, "Eyebrows", "Lowered");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(C, "Eyebrows", null);
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(C, "Eyebrows", "Raised");
};


ACBC.SurprisedMouth = async function(C)
{
  let d = 800;
  if (CurrentScreen !== "ChatRoom")
    d = 150;
  
  CharacterSetFacialExpression(C, "Mouth", null);
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(C, "Mouth", "Smirk");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(C, "Mouth", "Sad");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(C, "Mouth", "HalfOpen");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(C, "Mouth", "Open");
}


ACBC.HornyMouth = async function()
{
  ServerSend("ChatRoomChat", { Content: ` opens her mouth, ready for a gag.`, Type: "Emote" });
  
  let d = 200;

  CharacterSetFacialExpression(Player, "Mouth", null);
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(Player, "Mouth", "Smirk");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(Player, "Mouth", "Sad");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(Player, "Mouth", "HalfOpen");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(Player, "Mouth", "Open");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(Player, "Mouth", "Moan");
  await ACBC.Sleep(d);
  CharacterSetFacialExpression(Player, "Mouth", "Ahegao");
}


ACBC.SetEyes = function(C, expression)
{
  CharacterSetFacialExpression(C, "Eyes1", expression);
  CharacterSetFacialExpression(C, "Eyes2", expression);
}


ACBC.SurprisedFace = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;
  
  ACBC.SurprisedEyes(C);
  ACBC.SurprisedEyebrows(C);
  ACBC.SurprisedMouth(C);
}


ACBC.CloseLegs = function(C)
{
  C = ACBC.Find(C);
  if (!C) return;

  CharacterSetActivePose(C, "LegsClosed", true);
};


ACBC.OpenWardrobe = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (C.IsNpc())
  {
    let settings = ACBC.Private.NpcWardrobeSettings;

    if (!C.OnlineSharedSettings)
      C.OnlineSharedSettings = {};
    
    C.OnlineSharedSettings = Object.assign(C.OnlineSharedSettings, settings);
  }

  CharacterAppearanceLoadCharacter(C);

  let inputChat = document.getElementById("InputChat");
  if (inputChat)
    inputChat.style.display = "none";
  
  let textAreaChatLog = document.getElementById("TextAreaChatLog");
  if (textAreaChatLog)
    textAreaChatLog.style.display = "none";
};


ACBC.RopeBinding = async function(C, difficulty, color, hack = true, boxtie = false, hasty = false)
{
  C = ACBC.Find(C);

  if (!C) return;
  
  if (!difficulty)
    difficulty = 0;

  if (!color)
    color = "#fff";

  let name = CharacterNickname(C);
  let id = Player.MemberNumber;
  let ropeCraft =
  {
    Description: "Animated by some unseen power",
    Item: "HempRope",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Rope",
    Private: false,
    Property: "Secure",
    Type: "",
  };
  let stuffingCraft =
  {
    Color: "#282828",
    Description: "Seemingly too large to fit",
    Item: "ClothStuffing",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Stuffing",
    Private: false,
    Property: "Large",
    Type: "",
  };
  let clothCraft =
  {
    Color: "#FFF",
    Description: "Tight and unforgiving",
    Item: "ClothGag",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Gag",
    Private: false,
    Property: "Secure",
    Type: "",
  };
  let scarfCraft =
  {
    Color: "#D2D2D2",
    Description: "Thick, stretchy, soft, and tightly tied",
    Item: "ScarfGag",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Scarf",
    Private: false,
    Property: "Comfy",
    Type: "",
  };

  if (hack)
  {
    ropeCraft = null;
    stuffingCraft = null;
    clothCraft = null;
    scarfCraft = null;
  }
  
  if (!hasty)
    ACBC.SendEmote("*Magical bindings suddenly materialize and wrap " +
      `themselves around ${name}'s body, tying her up helplessly!`);

  let d = 700;
  if (!ServerPlayerIsInChatRoom())
  {
    d = 250;
    if (!hasty)
      ACBC.SurprisedFace(C);
  }

  // Feet
  InventoryWear(C, "HempRope", "ItemFeet", color, difficulty, id, ropeCraft);
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemFeet");
    await ACBC.Sleep(d);
  }
  TypedItemSetOptionByName(C, "ItemFeet", "FullBinding");
  ChatRoomCharacterItemUpdate(C, "ItemFeet");
  if (!hasty)
  {
    await ACBC.Sleep(d);
  }

  // Thighs
  InventoryWear(C, "HempRope", "ItemLegs", color, difficulty, id, ropeCraft);
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemLegs");
    await ACBC.Sleep(d);
  }
  TypedItemSetOptionByName(C, "ItemLegs", "Mermaid");
  ChatRoomCharacterItemUpdate(C, "ItemLegs");
  if (!hasty)
  {
    await ACBC.Sleep(d);
  }

  // Arms
  InventoryWear(C, "HempRope", "ItemArms", color, difficulty, id, ropeCraft);
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemArms");
    await ACBC.Sleep(d);
  }

  if (boxtie)
    TypedItemSetOptionByName(C, "ItemArms", "BoxTie");
  else
    TypedItemSetOptionByName(C, "ItemArms", "WristElbowHarnessTie");
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemArms");
    await ACBC.Sleep(d);
  }
  
  // Mouth 1
  InventoryWear(C, "ClothStuffing", "ItemMouth", "#282828", difficulty, id, stuffingCraft);
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemMouth");
    await ACBC.Sleep(d);
  }
  // Mouth 2
  InventoryWear(C, "ClothGag", "ItemMouth2", "#FFF", difficulty, id, clothCraft);
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemMouth2");
    await ACBC.Sleep(d);
  }
  TypedItemSetOptionByName(C, "ItemMouth2", "Cleave");
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemMouth2");
    await ACBC.Sleep(d);
  }
  // Mouth 3
  InventoryWear(C, "ScarfGag", "ItemMouth3", "#D2D2D2", difficulty, id, scarfCraft);
  if (!hasty)
  {
    ChatRoomCharacterItemUpdate(C, "ItemMouth3");
    await ACBC.Sleep(d);
  }
  TypedItemSetOptionByName(C, "ItemMouth3", "OTN");
  if (!hasty)
    ChatRoomCharacterItemUpdate(C, "ItemMouth3");
  
  if (!ServerPlayerIsInChatRoom())
  {
    CharacterSetFacialExpression(C, "Eyebrows", "Soft");
    CharacterSetFacialExpression(C, "Eyes1", "Closed");
    CharacterSetFacialExpression(C, "Eyes2", "Closed");
    CharacterSetFacialExpression(C, "Mouth", null);
  
    ChatRoomCharacterUpdate(C);
  }
  else if (hasty)
  {
    ChatRoomCharacterUpdate(C);
  }
};


ACBC.TapeBinding = function(C, difficulty, color)
{
  C = ACBC.Find(C);

  if (!C) return;

  let name = CharacterNickname(C);

  if (!difficulty)
    difficulty = 0;

  let id = Player.MemberNumber;
  let tapeCraft =
  {
    Description: "Extremely sticky and curiously durable",
    Item: "DuctTape",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Tape",
    Private: false,
    Property: "Secure",
    Type: "",
  };
  let stuffingCraft =
  {
    Color: "#282828",
    Description: "Seemingly too large to fit",
    Item: "ClothStuffing",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Stuffing",
    Private: false,
    Property: "Large",
    Type: "",
  };

  // Arms
  InventoryWear(C, "DuctTape", "ItemArms", color, difficulty, id, tapeCraft);

  // Thighs
  InventoryWear(C, "DuctTape", "ItemLegs", color, difficulty, id, tapeCraft);

  // Feet
  InventoryWear(C, "DuctTape", "ItemFeet", color, difficulty, id, tapeCraft);

  // Mouth 1
  InventoryWear(C, "ClothStuffing", "ItemMouth", "#282828", 10, id, stuffingCraft);
  // Mouth 2
  InventoryWear(C, "DuctTape", "ItemMouth2", "#282828", 30, id, tapeCraft);
  TypedItemSetOptionByName(C, "ItemMouth2", "Double", true);
  // Mouth 3
  InventoryWear(C, "DuctTape", "ItemMouth3", color, 30, id, tapeCraft);
  TypedItemSetOptionByName(C, "ItemMouth3", "Double", true);

  ChatRoomCharacterUpdate(C);

  ACBC.SendEmote("*Animated bands of duct tape snake themselves " +
    `around ${name}'s body, sealing her tightly!`);
};


ACBC.ChainBinding = async function(C, difficulty, color,
  strict = true, crotch = false, boxtie = false, hasty = false)
{
  C = ACBC.Find(C);

  if (!C) return;
  
  if (!difficulty)
    difficulty = 0;

  if (!color)
    color = "#CCC";

  let name = CharacterNickname(C);
  let id = Player.MemberNumber;
  let chainCraft =
  {
    Color: "#CCC",
    Description: "Cold and uncompromising",
    Item: "Chains",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Chain",
    Private: false,
    Property: "Secure",
  };
  let stuffingCraft =
  {
    Color: "#282828",
    Description: "Seemingly too large to fit",
    Item: "ClothStuffing",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Stuffing",
    Private: false,
    Property: "Large",
  };
  let clothCraft =
  {
    Color: "#FFF",
    Description: "Tight and unforgiving",
    Item: "ClothGag",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Gag",
    Private: false,
    Property: "Large",
  };
  let gagCraft =
  {
    Color: "#000",
    Description: "Thick and firm. Little sound gets through it",
    Item: "LewdGag",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Gag",
    Private: false,
    Property: "Large",
  };
  let ccCraft;
  if (crotch)
  {
    let ccCraft = {...chainCraft};
    ccCraft.Item = "CrotchChain";
    ccCraft.OverridePriority = 22;
  }

  if (!hasty)
    ACBC.SendEmote("*Living lengths of chain spring into the air and " +
    `entwine ${name}'s body, trapping her tightly!`);

  let d = 700;
  if (!ServerPlayerIsInChatRoom())
  {
    d = 250;
    if (!hasty)
      ACBC.SurprisedFace(C);
  }

  // Feet
  InventoryWear(C, "Chains", "ItemFeet", color, difficulty, id, chainCraft);
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }
  if (strict)
  {
    TypedItemSetOptionByName(C, "ItemFeet", "Strict", true);
    if (!hasty)
    {
      ChatRoomCharacterUpdate(C);
      await ACBC.Sleep(d);
    }
  }

  // Thighs
  InventoryWear(C, "Chains", "ItemLegs", color, difficulty, id, chainCraft);
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }
  if (strict)
  {
    TypedItemSetOptionByName(C, "ItemLegs", "Strict", true);
    if (!hasty)
    {
      ChatRoomCharacterUpdate(C);
      await ACBC.Sleep(d);
    }
  }

  // Crotch
  if (crotch)
  {
    InventoryWear(C, "CrotchChain", "ItemTorso2", color, difficulty, id, ccCraft);
    let crotchChain = InventoryGet(C, "ItemTorso2");
    if (!crotchChain.Property)
      crotchChain.Property = {};
    crotchChain.Property.OverridePriority = 22;
    if (!hasty)
    {
      ChatRoomCharacterUpdate(C);
      await ACBC.Sleep(d);
    }
  }

  // Arms
  InventoryWear(C, "Chains", "ItemArms", color, difficulty, id, chainCraft);
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }

  if (boxtie)
    TypedItemSetOptionByName(C, "ItemArms", "BoxTie");
  else
    TypedItemSetOptionByName(C, "ItemArms", "WristElbowHarnessTie");
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }

  // Mouth 1
  InventoryWear(C, "ClothStuffing", "ItemMouth",
    "#333", difficulty, id, stuffingCraft);
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }
  // Mouth 2
  InventoryWear(C, "ClothGag", "ItemMouth2",
    "#FFF", difficulty, id, clothCraft);
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }
  TypedItemSetOptionByName(C, "ItemMouth2", "Cleave");
  if (!hasty)
  {
    ChatRoomCharacterUpdate(C);
    await ACBC.Sleep(d);
  }
  // Mouth 3
  InventoryWear(C, "LewdGag", "ItemMouth3",
    "#000", difficulty, id, gagCraft);
  
  if (!ServerPlayerIsInChatRoom())
  {
    CharacterSetFacialExpression(C, "Eyebrows", "Soft");
    CharacterSetFacialExpression(C, "Eyes1", "Closed");
    CharacterSetFacialExpression(C, "Eyes2", "Closed");
    CharacterSetFacialExpression(C, "Mouth", null);
  }

  ChatRoomCharacterUpdate(C);
  CharacterRefresh(C);
};


ACBC.Free = function(...Cs)
{
  if (Cs.length === 0)
    Cs = [Player];

  let names = [];

  for (const c of Cs)
  {
    let name = ACBC.Private.FreeHelper(c);
    if (name)
      names.push(name);
  }

  if (names.length === 0) return;

  let beginningStr = "The bindings on";
  let middleStr = "";
  let endingStr = "relax their tight grip and fall away harmlessly.";

  if (names.length === 1)
  {
    middleStr = `${names[0]}'s body`;
  }
  else if (names.length === 2)
  {
    middleStr = `${names[0]} and ${names[1]}'s bodies`;
  }
  else
  {
    for (let i = 0; i < names.length - 1; ++i)
    {
      middleStr += `${names[i]}, `;
    }

    middleStr += `${names[names.length - 1]}'s bodies`;
  }

  let emoteStr = `*${beginningStr} ${middleStr} ${endingStr}`;

  ACBC.SendEmote(emoteStr);
};


ACBC.Private.FreeHelper = function(C)
{
  C = ACBC.Find(C);

  if (!C) return undefined;

  InventoryRemove(C, "ItemArms", false);
  InventoryRemove(C, "ItemHands", false);
  InventoryRemove(C, "ItemLegs", false);
  InventoryRemove(C, "ItemFeet", false);
  InventoryRemove(C, "ItemBoots", false);
  InventoryRemove(C, "ItemHead", false);
  InventoryRemove(C, "ItemHood", false);
  InventoryRemove(C, "ItemMouth", false);
  InventoryRemove(C, "ItemMouth2", false);
  InventoryRemove(C, "ItemMouth3", false);
  InventoryRemove(C, "ItemPelvis", false);
  InventoryRemove(C, "ItemDevices", false);

  ChatRoomCharacterUpdate(C);
  CharacterRefresh(C);

  return CharacterNickname(C);
}


ACBC.FreeArms = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  let name = CharacterNickname(C);

  InventoryRemove(C, "ItemArms");
  ChatRoomCharacterItemUpdate(C, "ItemArms");

  ACBC.SendEmote(`*The bindings on ${name}'s arms limply fall off of them.`);
};


ACBC.FreeMouth = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  let name = CharacterNickname(C);

  InventoryRemove(C, "ItemMouth");
  InventoryRemove(C, "ItemMouth2");
  InventoryRemove(C, "ItemMouth3");

  ChatRoomCharacterUpdate(C);

  ACBC.SendEmote(`*${name}'s gag retreats from their mouth.`);
};


ACBC.Naked = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  let newAppearance = C.Appearance.filter(i =>
      !i.Asset.Group.AllowNone ||
      i.Asset.Group.Category !== "Appearance" ||
      (
        C.IsOnline() &&
        C.OnlineSharedSettings.BlockBodyCosplay &&
        i.Asset != null &&
        i.Asset.Group != null &&
        i.Asset.Group.BodyCosplay
      ) ||
      (
        i.Asset.Description === "Glitter" &&
        i.Property.Type === null
      )
    );
  C.Appearance = newAppearance;

	// Loads the new character canvas
	CharacterLoadCanvas(C);
	CharacterRefresh(C);
};


ACBC.FilterAppearanceByDescriptions = function(descriptions, C,
  returnCustomData = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  let results = C.Appearance.filter(i => descriptions.includes(i.Asset.Description));

  if (!returnCustomData)
    return results;

  return results.map(i =>
    ({ AssetName: i.Asset.Name, GroupName: i.Asset.Group.Name, ...i, }));
};


ACBC.BlackLeotard = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  InventoryWear(C, "CropTop", "Cloth", ["#080808", "#080808"]); // set Cloth
  InventoryWear(C, "Glitter", "ClothAccessory", ["#FFF", "#FFF"]); // set ClothAccessory
  TypedItemSetOptionByName(C, "ClothAccessory", "StarsLeft", true); // set Glitter to be StarsLeft
  // leave Necklace
  InventoryRemove(C, "Suit"); // remove Suit
  InventoryRemove(C, "ClothLower"); // remove ClothLower
  InventoryRemove(C, "SuitLower"); // remove SuitLower
  InventoryWear(C, "BunnySuit", "Bra", "#080808"); // set Bra
  InventoryWear(C, "Corset4", "Corset", "#808080"); // set Corset
  InventoryRemove(C, "Panties"); // remove Panties
  InventoryWear(C, "Socks5", "Socks", "#080808"); // set Socks
  // leave RightAnklet
  // leave LeftAnklet
  // leave Garters
  InventoryWear(C, "Sneakers1", "Shoes", ["#CCC", "#CCC", "#CCC"]); // set Shoes
  InventoryWear(C, "Bandana", "Hat", ["#CCC", "#CCC"]); // set Hat
  // leave HairAccessory1
  // leave HairAccessory2
  // leave HairAccessory3
  // leave Gloves
  InventoryWear(C, "BowBand", "Bracelet", "#CCC"); // set Bracelet
  // leave Glasses
  // leave TailStraps
  // leave Wings

  // leave Mask if it's glitter, otherwise remove it
  let mask = InventoryGet(C, "Mask");
  if (mask && mask.Asset.Name !== "Glitter")
  {
    InventoryRemove(C, "Mask");
  }

  // set mouth to be full lips, and apply lipstick
  // TODO: this

  ChatRoomCharacterUpdate(C);
};


ACBC.YellowLeotard = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  InventoryRemove(C, "Suit"); // remove Suit
  InventoryRemove(C, "ClothLower"); // remove ClothLower
  InventoryRemove(C, "Panties"); // remove Panties
  InventoryRemove(C, "Glasses"); // remove Glasses

  InventoryWear(C, "LeatherChoker", "ItemNeck"); // wear a nice collar :)
  InventoryWear(C, "CropTop", "Cloth", ["#B29D23", "#B29D23"]); // set Cloth
  InventoryWear(C, "BunnySuit", "Bra", "#94831F"); // set Bra
  InventoryWear(C, "Pantyhose1", "Socks", "#242329"); // set Socks
  InventoryWear(C, "Heels3", "Shoes", "#9A881E"); // set Shoes
  InventoryWear(C, "Corset4", "Corset", "#000000"); // set Corset
  // InventoryWear(C, "Bandana", "Hat", ["#D4BB26", "#D4BB26"]); // set Hat
  InventoryWear(C, "BowBand", "Bracelet", "#222"); // set Bracelet
  InventoryWear(C, "Glitter", "ClothAccessory", ["#FFD900", "#FFD900"]); // set ClothAccessory
  TypedItemSetOptionByName(C, "ClothAccessory", "StarsLeft", true); // set Glitter to be StarsLeft
  InventoryWear(C, "Pantyhose1", "SuitLower", "#242329"); // set SuitLower
  InventoryWear(C, "HairFlower1", "HairAccessory3", "#A69221"); // set HairAccessory3
  InventoryWear(C, "GarterBelt2", "Garters"); // set Garters
  
  // leave Necklace
  // leave RightAnklet
  // leave LeftAnklet
  // leave HairAccessory1
  // leave HairAccessory2
  // leave Gloves
  // leave TailStraps
  // leave Wings

  // leave Mask if it's glitter, otherwise remove it
  let mask = InventoryGet(C, "Mask");
  if (mask && mask.Asset.Name !== "Glitter")
  {
    InventoryRemove(C, "Mask");
  }

  // set mouth to be full lips, and apply lipstick
  // TODO: this

  ChatRoomCharacterUpdate(C);
};


ACBC.ActionRole = function(roleName, C, includeArmor = false, makeover = true)
{
  C = ACBC.Find(C);
  if (!C) return;

  let oldGlasses = InventoryGet(C, "Glasses");
  let oldCloth = InventoryGet(C, "Cloth");
  let oldClothLower = InventoryGet(C, "ClothLower");

  ACBC.Naked(C);

  let role = ACBC.Roles[roleName];
  if (!role)
    role = ACBC.Roles.Infantry;

  let colors = role.Colors;

  InventoryWear(C, "Glitter", "ClothAccessory", colors.Glitter,
    null, null, null, false);
  InventoryWear(C, "Pantyhose1", "SuitLower", colors.Pantyhose,
    null, null, null, false);
  InventoryWear(C, "Swimsuit2", "Bra", colors.Swimsuit,
    null, null, null, false);
  InventoryWear(C, "Socks3", "Socks", colors.Knees,
    null, null, null, false);
  InventoryWear(C, "Socks2", "SocksRight", colors.Socks,
    null, null, null, false);
  InventoryWear(C, "Socks2", "SocksLeft", colors.Socks,
    null, null, null, false);
  InventoryWear(C, "GarterBelt2", "Garters", colors.Garter,
    null, null, null, false);
  InventoryWear(C, "FuturisticHeels2", "Shoes", colors.Shoes,
    null, null, null, false);
  InventoryWear(C, "Bandana", "Hat", colors.Bandana,
    null, null, null, false);
  InventoryWear(C, "HaremGlove", "Gloves", colors.Gloves,
    null, null, null, false);
  InventoryWear(C, "JewelrySet", "Jewelry", colors.Earrings,
    null, null, null, false);
  
  TypedItemSetOptionByName(C, "ClothAccessory", "StarsBoth", true);
  ModularItemSetOptionByName(C, "Jewelry", "e3a3n0f0", true);
  CharacterAppearanceSetColorForGroup(C, colors.Lipstick, "Mouth");

  if (oldGlasses)
  {
    let replacements =
    {
      Glasses1: "Glasses2",
      Glasses2: "Glasses2",
      Glasses3: "Glasses4",
      Glasses4: "Glasses4",
      Glasses5: "Glasses6",
      Glasses6: "Glasses6",
      SunGlasses1: "GradientSunglasses",
      SunGlasses2: "GradientSunglasses",
      SunGlassesClear: "GradientSunglasses",
      EyePatch1: "EyePatch1",
      CatGlasses: "CatGlasses",
      VGlasses: "GradientSunglasses",
      GradientSunglasses: "GradientSunglasses",
    };
    let newGlassesName = replacements[oldGlasses.Asset.Name];

    InventoryWear(C, newGlassesName, "Glasses", colors.Glasses,
      null, null, null, false);
    
    if (oldGlasses.Property?.Type)
      TypedItemSetOptionByName(C, "Glasses", oldGlasses.Property.Type, true);
  }

  if (includeArmor || oldCloth?.Name === "MistressTop" ||
    oldClothLower?.Name === "MistressBottom")
  {
    ACBC.ActionArmor(C, role.Colors, true);
  }

  if (!InventoryGet(C, "ItemNeck"))
  {
    InventoryWear(C, "LeatherChoker", "ItemNeck",
    null, 0, C.MemberNumber,
    {
      Color: "Default",
      Description: "For the neck. Looks good with everything",
      Item: "LeatherChoker",
      Lock: "",
      MemberName: CharacterNickname(C),
      MemberNumber: C.MemberNumber,
      Name: "Neck Belt",
      OverridePriority: null,
      Private: false,
      Property: "Malleable",
      Type: null,
    }, false);
  }

  let belt = InventoryWear(C, "ThinLeatherStraps", "ItemTorso",
    colors.Belt, 0, C.MemberNumber,
    {
      Color: colors.Belt.join(),
      Description: "For the waist. Looks good on a leotard",
      Item: "ThinLeatherStraps",
      Lock: "",
      MemberName: CharacterNickname(C),
      MemberNumber: C.MemberNumber,
      Name: "Belt",
      OverridePriority: 24,
      Private: false,
      Property: "Malleable",
      Type: "Waist",
    }, false);
  belt.Property.OverridePriority = 24;
  
  if (makeover && C.IsNpc())
    ACBC.NpcMakeover(C, false);

  CharacterRefresh(C, true);
  ChatRoomCharacterUpdate(C);

  C.ActionRole = role;
};


ACBC.ActionArmor = function(C, colors, internal = false)
{
  C = ACBC.Find(C);
  if (!C) return;

  colors = colors || C.ActionRole?.Colors;
  if (!colors) return;

  InventoryWear(C, "MistressTop", "Cloth", colors.ArmorTop,
    null, null, null, false);
  InventoryWear(C, "Glitter", "ClothAccessory", colors.Glitter,
    null, null, null, false);
  InventoryWear(C, "MistressBottom", "ClothLower", colors.ArmorBottom,
    null, null, null, false);

  TypedItemSetOptionByName(C, "ClothAccessory", "StarsBoth", true);

  if (internal) return;

  CharacterRefresh(C);
  ChatRoomCharacterUpdate(C);
};


ACBC.RandomRole = function(C, exclude, includeArmor = false, makeover = true)
{
  let roleNames = Object.keys(ACBC.Roles);

  if (typeof exclude === "string")
    roleNames = roleNames.filter(n => n !== exclude);
  else if (Array.isArray(exclude))
    roleNames = roleNames.filter(n => !exclude.includes(n));

  let roleName = ACBC.Private.GetRandomFromArray(roleNames);
  ACBC.ActionRole(roleName, C, includeArmor, makeover);
}


ACBC.NpcBody = function(C, refresh = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (!(C == Player || C.IsNpc()))
  {
    console.warn("Shame on you for trying to change another player's body!");
    return;
  }

  let upper = "BodyUpper";
  let lower = "BodyLower";
  let size = "XLarge";

  let upperAsset = AssetGet(AssetFemale3DCG, upper, size);
  let upperColor = CharacterAppearanceGetCurrentValue(C, upper, "Color");
  let lowerAsset = AssetGet(AssetFemale3DCG, lower, size);
  let lowerColor = CharacterAppearanceGetCurrentValue(C, lower, "Color");

  CharacterAppearanceSetItem(C, upper, upperAsset, upperColor,
    null, null, false);
  CharacterAppearanceSetItem(C, lower, lowerAsset, lowerColor,
    null, null, refresh);
};


ACBC.NpcHair = function(C, refresh = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (!(C == Player || C.IsNpc()))
  {
    console.warn("Shame on you for trying to change another player's hair!");
    return;
  }

  let front = "HairFront";
  let back = "HairBack";
  let frontName = front +
    ACBC.Private.GetRandomFromArray(ACBC.Private.MakeoverPrefs.HairFront);
  let backName = back +
    ACBC.Private.GetRandomFromArray(ACBC.Private.MakeoverPrefs.HairBack);
  let frontColor = CharacterAppearanceGetCurrentValue(C, front, "Color");
  let backColor = CharacterAppearanceGetCurrentValue(C, back, "Color");

  InventoryWear(C, frontName, front, frontColor, null, null, null, false);
  InventoryWear(C, backName, back, backColor, null, null, null, refresh);
};


ACBC.NpcEyebrows = function(C, refresh = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (!(C == Player || C.IsNpc()))
  {
    console.warn("Shame on you for trying to change another player's eyebrows!");
    return;
  }

  let hairColor = CharacterAppearanceGetCurrentValue(C, "HairFront", "Color");
  if (hairColor === "Default")
    hairColor = "#111";
  
  let rStr, gStr, bStr;
  if (hairColor.length === 4)
  {
    rStr = hairColor.substring(1, 2);
    rStr += rStr;
    gStr = hairColor.substring(2, 3);
    gStr += gStr;
    bStr = hairColor.substring(3);
    bStr += bStr;
  }
  else
  {
    rStr = hairColor.substring(1, 3);
    gStr = hairColor.substring(3, 5);
    bStr = hairColor.substring(5);
  }
  
  let r = parseInt(rStr, 16) / 4;
  let g = parseInt(gStr, 16) / 4;
  let b = parseInt(bStr, 16) / 4;
  rStr = Math.trunc(r).toString(16).padStart(2, "0");
  gStr = Math.trunc(g).toString(16).padStart(2, "0");
  bStr = Math.trunc(b).toString(16).padStart(2, "0");
  let eyebrowColor = `#${rStr}${gStr}${bStr}`;
  let colorArray = [eyebrowColor, eyebrowColor];
  
  if (InventoryGet(C, "Eyebrows").Asset.Name === "Eyebrows1")
    InventoryWear(C, "Eyebrows2", "Eyebrows", colorArray,
      null, null, null, refresh);
  else
    CharacterAppearanceSetColorForGroup(C, colorArray, "Eyebrows");
}


ACBC.NpcLips = function(C, refresh = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (!(C == Player || C.IsNpc()))
  {
    console.warn("Shame on you for trying to change another player's lips!");
    return;
  }

  InventoryWear(C, "Full", "Mouth", ["#711", "Default"],
    null, null, null, refresh);
}


ACBC.NpcEyes = function(C, refresh = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (!(C == Player || C.IsNpc()))
  {
    console.warn("Shame on you for trying to change another player's eyes!");
    return;
  }

  let assetName = "Eyes" +
    ACBC.Private.GetRandomFromArray(ACBC.Private.MakeoverPrefs.Eyes);
  let aColor = CharacterAppearanceGetCurrentValue(C, "Eyes", "Color");
  let bColor = CharacterAppearanceGetCurrentValue(C, "Eyes2", "Color");

  InventoryWear(C, assetName, "Eyes", aColor, null, null, null, false);
  InventoryWear(C, assetName, "Eyes2", bColor, null, null, null, refresh);
}


ACBC.NpcMakeover = function(C, refresh = true)
{
  C = ACBC.Find(C);

  if (!C) return;

  if (!(C == Player || C.IsNpc()))
  {
    console.warn("Shame on you for trying to meddle like that!");
    return;
  }

  ACBC.NpcBody(C, false);
  ACBC.NpcHair(C, false);
  ACBC.NpcEyebrows(C, false);
  ACBC.NpcLips(C, false);
  ACBC.NpcEyes(C, refresh);
}


ACBC.CheckBody = function(C)
{
  C = ACBC.Find(C);

  if (!C) return;

  let upper = InventoryGet(C, "BodyUpper").Asset.Name;
  let lower = InventoryGet(C, "BodyLower").Asset.Name;

  console.log(`${CharacterNickname(C)} | Upper: ${upper} | Lower: ${lower}`);
};


ACBC.CheckDoubleStars = function(Ca, Cb)
{
  Ca = ACBC.Find(Ca);
  if (!Ca) return;

  Cb = ACBC.Find(Cb);
  if (!Cb) return;

  if (Ca === Cb) return;

  // Filter down A's faves to include just the ones where...
    // given that A fave, there is some item in B's faves where...
      // given that B fave's properties, every one of them...
        // matches the properties of the A fave
  let perf = Ca.FavoriteItems.filter(
    aFave => Cb.FavoriteItems.some(
      bFave => Object.keys(aFave).every(
        key => aFave[key] === bFave[key])));
  // The result of this is an array that consists only of the perfect matches

  // For every item in the perfect matches, combine its group and name to make
  //   a unique key out of it. We'll use this so we don't have duplicates later
  let nearKeys = perf.map(match => `${match.Group}${match.Name}`);

  // Filter down A's faves to include just the ones where:
    // given that A fave, there is at least one item in B's faves where:
      // given that B fave, the group and name match the A fave
  let near = Ca.FavoriteItems.filter(
    ai => Cb.FavoriteItems.some(
      bi => ai.Group === bi.Group && ai.Name === bi.Name))
    // Then take the filtered list of matches and generate an array as follows:
    .flatMap(
    match =>
    {
      // Create a unique key like the ones we made from the perfect matches
      let nearKey = `${match.Group}${match.Name}`;
      // If this key is already in the list we made before, don't add anything
      if (nearKeys.includes(nearKey))
        return [];
      // Otherwise, push that key into the list and then add the match
      nearKeys.push(nearKey);
      return match;
    });
  // The result of this is an array that contains only the near matches: the
  //   items where both characters have the item itself starred for that group,
  //   but they didn't both star the same "type" (i.e. cleave, OTM, OTN, etc.)
  
  // Finally, build a big ol string out of the
  //   results and print it to the console
  let outputStr = `${CharacterNickname(Ca)} and ${CharacterNickname(Cb)}\n`;
  outputStr += `  Perfect Matches: ${perf.length}\n`;

  for (const match of perf)
  {
    let typeStr = match.Type ? ` as ${match.Type}` : "";
    outputStr += `   ♥ ${match.Name} on ${match.Group}${typeStr}\n`;
  }

  outputStr += `  Near Matches: ${near.length}\n`;

  for (const match of near)
    outputStr += `   • ${match.Name} on ${match.Group}\n`;
  
  outputStr += `  Total: ${perf.length + near.length}`;

  console.log(outputStr);
};


ACBC.TransferBinds = function(FromC, ToC)
{

};


ACBC.TransferClothes = function(FromC, ToC)
{

};


ACBC.SwapBinds = function(Ca, Cb)
{

};


ACBC.SwapClothes = function(Ca, Cb)
{

};


ACBC.WearRandomFave = function(C, groupName, difficulty,
  memberNumber, refresh = true)
{
  C = ACBC.Find(C);
  if (!C) return;

	if (InventoryLocked(C, groupName, true)) return;

	let group = AssetGroupGet(C.AssetFamily, groupName);
  if (!group) return;
	if (InventoryGroupIsBlocked(C, groupName)) return;

  let filteredFavorites = C.FavoriteItems.filter(
    fave => fave.Group === groupName);

  if (filteredFavorites.length <= 0) return;

  let assetNames = [];
  filteredFavorites.forEach(
    fave =>
    {
      if (!assetNames.includes(fave.Name))
        assetNames.push(fave.Name);
    });
  
  let selectedName = ACBC.Private.GetRandomFromArray(assetNames);
  let options = filteredFavorites.filter(
    fave => fave.Name === selectedName);
  let selectedOption = ACBC.Private.GetRandomFromArray(options);
  let crafts = C.Crafting.filter(
    craft =>
    {
      if (craft.Item !== selectedName) return false;
      if (!craft.Type) return true;

      let asset = AssetGet(C.AssetFamily, groupName, selectedName);
      return asset.AllowType.includes(craft.Type);
    });
  crafts.push(null);
  let selectedCraft = ACBC.Private.GetRandomFromArray(crafts);

  let color = selectedCraft?.Color.split(",") ||
    ACBC.Kidnapping.Favorite(selectedName, groupName);
  let item = InventoryWear(C, selectedName, groupName, color,
    difficulty, memberNumber, selectedCraft, false);
  
  if (selectedCraft?.OverridePriority)
  {
    if (!item.Property)
      item.Property = {};
    item.Property.OverridePriority = selectedCraft.OverridePriority;
  }

  if (selectedOption.Type)
  {
    switch (item.Asset.Archetype)
    {
      case ExtendedArchetype.TYPED:
        TypedItemSetOptionByName(C, groupName, selectedOption.Type);
        break;
      // Modular items are not currently supported
      // case ExtendedArchetype.MODULAR:
      //   ModularItemSetOptionByName(C, groupName, selectedOption.Type);
      //   break;
    }
  }

  if (refresh)
  {
    CharacterRefresh(C, true);
    ChatRoomCharacterUpdate(C);
  }
};


/*

To do:
- rope w/ cloth gag
- tape
- chain w/ 

 */


ACBC.Private.ChatRoomMessageHandler = function(data)
{
  ACBC.Private.CheckBoopSneeze(data);
  ACBC.Private.CheckPetPostAdd(data);
  ACBC.Private.CheckPetPostRemove(data);
  ACBC.Private.CheckSpank(data);
  ACBC.Private.CheckMagic(data);
  ACBC.Private.CheckVoidOut(data);
  ACBC.Private.CheckVoidIn(data);
  ACBC.Private.CheckClearVoidList(data);
  ACBC.Private.CheckAddRemoveList(data);
};
ACBC.Private.ChatRoomMessageHandler.ACBC = true;

{
  let listeners = ServerSocket.listeners("ChatRoomMessage")
    .filter(l => l.ACBC);
  
  for (const l of listeners)
    ServerSocket.off("ChatRoomMessage", l);
}

ServerSocket.on("ChatRoomMessage", ACBC.Private.ChatRoomMessageHandler);


ACBC.Private.AccountBeepHandler = function(data)
{
  ACBC.Private.CheckVoidBeep(data);
};
ACBC.Private.AccountBeepHandler.ACBC = true;

{
  let listeners = ServerSocket.listeners("AccountBeep")
    .filter(l => l.ACBC);
  
  for (const l of listeners)
    ServerSocket.off("AccountBeep", l);
}

ServerSocket.on("AccountBeep", ACBC.Private.AccountBeepHandler);


ACBC.Private.CheckBoopSneeze = function(data)
{
  if (data.Type !== "Activity") return;

  let dict = data.Dictionary;
  if (!dict) return;
  let fgData = dict.find(d => d.FocusGroupName === "ItemNose");
  if (!fgData) return;
  let anData = dict.find(d => d.ActivityName === "Pet");
  if (!anData) return;
  let targetData = dict.find(d => d.Tag === "TargetCharacter");
  if (!targetData || targetData.MemberNumber !== Player.MemberNumber) return;

  ACBC.AttemptBoopSneeze();
};


ACBC.Private.CheckPetPostAdd = function(data)
{
  if (data.Content !== "ActionUse" || data.Type !== "Action") return;

  let dict = data.Dictionary;
  let naData = dict.find(d => d.Tag === "NextAsset");
  if (!naData || naData.AssetName !== "PetPost") return;
  let dcData = dict.find(d => d.Tag === "DestinationCharacter");
  if (!dcData || dcData.MemberNumber !== Player.MemberNumber) return;

  ACBC.PetPostSetup();
}


ACBC.Private.CheckPetPostRemove = function(data)
{
  if (data.Content !== "ActionRemove" || data.Type !== "Action") return;

  let dict = data.Dictionary;
  let naData = dict.find(d => d.Tag === "PrevAsset");
  if (!naData || naData.AssetName !== "PetPost") return;
  let dcData = dict.find(d => d.Tag === "DestinationCharacter");
  if (!dcData || dcData.MemberNumber !== Player.MemberNumber) return;

  ACBC.PetPostRemoval();
}


ACBC.Private.CheckSpank = function(data)
{
  if (data.Type !== "Activity") return;

  let dict = data.Dictionary;
  if (!dict) return;
  let scData = dict.find(d => d.Tag === "SourceCharacter");
  if (!scData || scData.MemberNumber === Player.MemberNumber) return;
  let fgData = dict.find(d => d.FocusGroupName === "ItemButt");
  if (!fgData) return;
  let anData = dict.find(d => d.ActivityName === "Spank");
  if (!anData) return;
  let targetData = dict.find(d => d.Tag === "TargetCharacter");
  if (!targetData || targetData.MemberNumber !== Player.MemberNumber) return;

  ACBC.SpankReact();
}


ACBC.Private.CheckMagic = function(data)
{
  if (data.Type !== "Chat") return;
  if (data.Sender !== Player.MemberNumber) return;

  let gagLevel = SpeechGetTotalGagLevel(Player);
  if (Math.floor(Math.random() * gagLevel)) return;

  let t = data.Content;

  if (!t.startsWith(ACBC.Private.RopeSpellStart)) return;
  if (!t.endsWith(ACBC.Private.RopeSpellEnd)) return;

  let start = new RegExp(ACBC.Private.RopeSpellStart, "i");
  let end = new RegExp(ACBC.Private.RopeSpellEnd, "i");
  let middle = t.replace(start, "").replace(end, "").trim();

  let id = parseInt(middle, 10);
  let target = ChatRoomData.Character.find(c => c.MemberNumber === id);

  if (!target)
  {
    let matches = ChatRoomData.Character.filter(
      c => c.Nickname === middle || !c.Nickname && c.Name === middle);
    
    if (matches.length === 0) return;

    let index = Math.floor(Math.random() * matches.length);
    target = matches[index];
  }

  target = Character.find(c => c.MemberNumber === target.MemberNumber);

  if (!target) return;

  let difficulty = SkillGetWithRatio("Bondage");
  
  ACBC.RopeBinding(target, difficulty);
}


ACBC.Private.CheckVoidOut = function(data)
{
  if (data.Type !== "Action") return;
  if (data.Content !== "ServerDisconnect") return;

  let tag = ACBC.Private.HornyVoidRoomTag;
  let nameIncludesTag = ChatRoomData.Name.toLowerCase().includes(tag);
  let descriptionIncludesTag = ChatRoomData.Description.toLowerCase().includes(tag);
  if (!nameIncludesTag && !descriptionIncludesTag) return;
  
  let id = data.Dictionary.find(e => e.Tag === "SourceCharacter").MemberNumber;
  if (Player.HornyVoidWhitelist.has(id))
    ACBC.Private.VoidVictims.set(id, true);
}


ACBC.Private.CheckVoidIn = function(data)
{
  if (!ACBC.Private.HornyVoidEnabled) return;
  if (data.Type !== "Action") return;
  if (data.Content !== "ServerEnter") return;
  
  let tag = ACBC.Private.HornyVoidRoomTag;
  let nameIncludesTag = ChatRoomData.Name.toLowerCase().includes(tag);
  let descriptionIncludesTag = ChatRoomData.Description.toLowerCase().includes(tag);
  if (!nameIncludesTag && !descriptionIncludesTag) return;

  let id = data.Dictionary.find(e => e.Tag === "SourceCharacter").MemberNumber;
  if (!ACBC.Private.VoidVictims.get(id)) return;
  
  ACBC.Private.VoidVictims.delete(id);
  let victim = ACBC.FindAll(id);
  console.log(victim);
  let set = Math.random() > 0.5 ?
    ACBC.HornyVoidSets.Rope : ACBC.HornyVoidSets.Tentacles;
  ACBC.Wear(victim, set, -1);
}


ACBC.Private.CheckClearVoidList = function(data)
{
  if (data.Type !== "Action") return;
  if (data.Content !== "ServerEnter") return;

  let id = data.Dictionary.find(e => e.Tag === "SourceCharacter").MemberNumber;
  if (id !== Player.MemberNumber) return;

  ACBC.Private.VoidVictims = new Map();
}


ACBC.Private.CheckAddRemoveList = function(data)
{
  if (data.Type !== "Chat") return;
  if (data.Sender !== Player.MemberNumber) return;

  if (data.Content.startsWith("!hvadd"))
  {
    let rest = data.Content.replace("!hvadd ", "");
    let identifier = parseInt(rest, 10);

    if (!identifier)
      identifier = rest;
    
    ACBC.Private.AddToHornyVoidWhitelist(identifier, true);
  }
  else if (data.Content.startsWith("!hvremove"))
  {
    let rest = data.Content.replace("!hvremove ", "");
    let identifier = parseInt(rest, 10);

    if (!identifier)
      identifier = rest;

    ACBC.Private.RemoveFromHornyVoidWhitelist(identifier, true);
  }
}


ACBC.Private.CheckVoidBeep = function(data)
{
  
}


ACBC.AttemptBoopSneeze = function()
{
  if (!ACBC.Private.BoopSneezeEnabled) return;

  if (ACBC.Private.BoopSneezing)
  {
    // TODO: add feedback here
    return;
  }
  
  if (!ACBC.BoopSneezeReady())
  {
    if (ACBC.Private.PublishBoopSneezeCooldown)
    {
      let cooldown = ACBC.GetCooldownString();
      
      if (ACBC.Private.Language === "Spanish")
      {
        ACBC.SendEmote(`*Aún debe esperar ${cooldown} ` +
          `antes de que vuelva a funcionar.`);
      }
      else
      {
        ACBC.SendEmote(`*You still need to wait ${cooldown} ` +
          `before that will work again.`);
      }
    }

    return;
  }

  ACBC.BoopSneeze();
};


ACBC.BoopSneezeReady = function()
{
  if (ACBC.Private.IgnoreBoopSneezeCooldown) return true;

  let now = Date.now();
  let last = ACBC.Private.BoopSneezeLast;

  return last === null || now - last >= ACBC.Private.BoopSneezeCooldownDuration;
};


ACBC.GetBoopSneezeRemainingCooldown = function()
{
  let cooldownProgress = Date.now() - ACBC.Private.BoopSneezeLast;
  let remainingCooldown =
    ACBC.Private.BoopSneezeCooldownDuration - cooldownProgress;
  
  return Math.max(Math.floor(remainingCooldown / 1000), 0);
}


ACBC.GetCooldownString = function()
{
  let s = ACBC.GetBoopSneezeRemainingCooldown();
  let m = Math.floor(s / 60);
  s = s % 60;
  let mString = m > 0 ? m.toString() : "";
  let sString = s >= 10 ? s.toString() : `0${s}`;

  return `${mString}:${sString}`;
}


ACBC.BoopSneeze = async function()
{
  ACBC.Private.BoopSneezing = true;

  let windup1 = ACBC.SneezeWindupString(3, 4, 1, 2, 3, 4);
  let windup2 = ACBC.SneezeWindupString(5, 7, 2, 4, 5, 7);
  let windup3 = ACBC.SneezeWindupString(8, 10, 4, 6, 7, 9);
  let release = ACBC.SneezeReleaseString(3, 6, 12, 20, 5, 8);

  let beginMessage = ACBC.Private.Language === "Spanish" ?
    "comienza a estornudar." : "begins to sneeze.";

  ACBC.SendEmote(beginMessage);
  await ACBC.Sleep(350);
  ACBC.SendChat(windup1);
  await ACBC.Sleep(1500);
  ACBC.SendChat(windup2);
  await ACBC.Sleep(1500);
  ACBC.SendChat(windup3);
  await ACBC.Sleep(1500);
  ACBC.SendChat(release);
  ActivityOrgasmStart(Player);
  ACBC.Private.BoopSneezeLast = Date.now();
  ACBC.Private.BoopSneezing = false;
};


ACBC.SneezeWindupString = function(aMin, aMax, hMin, hMax, dotMin, dotMax)
{
  let output = "";

  let aCount = Math.round((aMax - aMin) * Math.random() + aMin);
  let hCount = Math.round((hMax - hMin) * Math.random() + hMin);
  let dotCount = Math.round((dotMax - dotMin) * Math.random() + dotMin);
  const decay = 0.5;
  const initMatchChance = 0.75;
  let matchChance = initMatchChance;
  let upper = true;

  for (let i = 0; i < aCount; ++i)
  {
    if (Math.random() < matchChance)
    {
      matchChance *= decay;
    }
    else
    {
      matchChance = initMatchChance;
      upper = !upper;
    }

    let letter = "a";
    if (upper) letter = letter.toUpperCase();

    output += letter;
  }

  for (let i = 0; i < hCount; ++i)
  {
    if (Math.random() < matchChance)
    {
      matchChance *= decay;
    }
    else
    {
      matchChance = initMatchChance;
      upper = !upper;
    }

    let letter = "h";
    if (upper) letter = letter.toUpperCase();

    output += letter;
  }

  for (let i = 0; i < dotCount; ++i)
    output += ".";
  
  return output;
}


ACBC.SneezeReleaseString = function(hMin, hMax, oMin, oMax, tMin, tMax)
{
  let output = "C";

  let hCount = Math.round((hMax - hMin) * Math.random() + hMin);
  let oCount = Math.round((oMax - oMin) * Math.random() + oMin);
  let tCount = Math.round((tMax - tMin) * Math.random() + tMin);
  let upperChance = 1;
  const decay = 0.9;

  for (let i = 0; i < hCount; ++i)
  {
    let letter = "h";

    if (Math.random() < upperChance)
      letter = letter.toUpperCase();
    
    upperChance *= decay;

    output += letter;
  }

  for (let i = 0; i < oCount; ++i)
  {
    let letter = ACBC.Private.Language === "Spanish" ? "ú" : "o";

    if (Math.random() < upperChance)
      letter = letter.toUpperCase();
    
    upperChance *= decay;

    output += letter;
  }

  for (let i = 0; i < tCount; ++i)
    output += "~";
  
  return output;
}


ACBC.PetPostSetup = async function()
{
  await ACBC.Sleep(200);

  if (ACBC.Private.PetSignIntervalId)
  {
    console.warn("Trying to run PetPostSetup, but the setInterval id " +
    "is already present.");
    return;
  }

  console.log("Adding pet post updater");
  
  ACBC.Private.PetSignIntervalId =
    setInterval(ACBC.PetPostUpdate, 1000);
}


ACBC.PetPostRemoval = function()
{
  if (!ACBC.Private.PetSignIntervalId)
  {
    console.warn("Trying to run PetPostRemoval, but the setInterval id " +
    "is not present.");
    return;
  }
  
  console.log("Removing pet post updater");

  clearInterval(ACBC.Private.PetSignIntervalId);
  ACBC.Private.PetSignIntervalId = 0;
}


ACBC.PetPostUpdate = function()
{
  let post = InventoryGet(Player, "ItemNeckRestraints");
  if (!post)
  {
    console.log("There's no post! Interval id " +
      ACBC.Private.PetSignIntervalId);
    ACBC.PetPostRemoval();
    return;
  }

  let properties = post.Property ? structuredClone(post.Property) : {};

  let text1 = properties.Text?.toUpperCase();
  let text2 = properties.Text2?.toUpperCase();
  if (text1 !== "SNEEZE" || text2 !== "READY") return;
  
  let s = ACBC.GetBoopSneezeRemainingCooldown();

  if (s === ACBC.Private.CachedCooldown) return;

  let cooldown = ACBC.GetCooldownString();
  
  // console.log(`Updating pet post text with cooldown of ${cooldown}`);

  let colors = [...post.Color];
  
  if (s > 0)
  {
    properties.Text3 = `in ${cooldown}`;
    colors[ACBC.Private.SignColorIndex] = ACBC.Private.SignWaitingColor;
    colors[ACBC.Private.TextColorIndex] = ACBC.Private.TextWaitingColor;
  }
  else
  {
    properties.Text3 = "";
    colors[ACBC.Private.SignColorIndex] = ACBC.Private.SignReadyColor;
    colors[ACBC.Private.TextColorIndex] = ACBC.Private.TextReadyColor;
  }
  
  post.Property = properties;
  post.Color = colors;
  
  CharacterRefresh(Player, true, true);
  ChatRoomCharacterItemUpdate(Player, "ItemNeckRestraints");

  ACBC.Private.CachedCooldown = s;
}


ACBC.SpankReact = async function()
{
  await ACBC.Sleep(100);

  let index = Math.floor(1 / Math.random()) %
    ACBC.Private.SpankReactionStrings.length;
  let str = ACBC.Private.SpankReactionStrings[index];
  ACBC.SendChat(str);
}


ACBC.SendChat = function(msg)
{
  ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
}


ACBC.SendEmote = function(msg)
{
  ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });
}


////////////////////////// FBC EVENTS AND TRIGGERS //////////////////////////


ACBC.Private.RemoveCuddleTrigger = function()
{
  let index = bce_ActivityTriggers.findIndex(t => t.Event === "Cuddle");

  if (index < 0) return;

  bce_ActivityTriggers.splice(index, 1);
}


ACBC.Private.RemoveStretchTrigger = function()
{
  let index = bce_ActivityTriggers.findIndex(t => t.Event === "Stretch");

  if (index < 0) return;

  bce_ActivityTriggers.splice(index, 1);
}


ACBC.Private.AddActivityTrigger = function(trigger)
{
  let index = bce_ActivityTriggers.findIndex(t => t.Event === trigger.Event);
  
  if (index >= 0)
    bce_ActivityTriggers[index] = trigger;
  else
    bce_ActivityTriggers.push(trigger);
}


ACBC.Private.AddAllTriggers = function()
{
  console.log("Adding event expression triggers...");

  bce_EventExpressions.HoldBreath =
  {
    Type: "HoldBreath",
    Duration: 6800,
    Priority: 500,
    Expression:
    {
      Mouth:
      [
        { Expression: null, Duration: 200 },
        { Expression: "Smirk", Duration: 200 },
        { Expression: "Sad", Duration: 200 },
        { Expression: "HalfOpen", Duration: 200 },
        { Expression: "Open", Duration: 500 },
        { Expression: "Pout", Duration: 5000 },
        { Expression: "HalfOpen", Duration: 500 },
      ],
      Eyes:
      [
        { Skip: true, Duration: 1000 },
        { Expression: "Surprised", Duration: 300 },
        { Expression: "Closed", Duration: 200 },
        { Expression: "Daydream", Duration: 4800 },
        { Expression: "Shy", Duration: 500 },
      ],
      Eyes2:
      [
        { Skip: true, Duration: 1000 },
        { Expression: "Surprised", Duration: 300 },
        { Expression: "Closed", Duration: 200 },
        { Expression: "Daydream", Duration: 4800 },
        { Expression: "Shy", Duration: 500 },
      ],
      Eyebrows:
      [
        { Expression: "Lowered", Duration: 400 },
        { Expression: null, Duration: 400 },
        { Expression: "Raised", Duration: 500 },
        { Expression: "Lowered", Duration: 1000 },
        { Expression: "Harsh", Duration: 1500 },
        { Expression: "Angry", Duration: 2500 },
        { Expression: "Soft", Duration: 500 },
      ],
    },
  };

  let holdBreathTrigger =
  {
    Event: "HoldBreath",
    Type: "Emote",
    Matchers:
    [
      {
        Tester: /^holds her breath/u,
      },
    ],
  };


  bce_EventExpressions.EyeRoll =
  {
    Type: "EyeRoll",
    Duration: 3630,
    Priority: 700,
    Expression:
    {
      Mouth:
      [
        { Expression: null, Duration: 3630 },
      ],
      Eyes:
      [
        { Expression: "Closed", Duration: 300 },
        { Expression: "Horny", Duration: 200 },
        { Expression: "Sad", Duration: 180 },
        { Expression: "Lewd", Duration: 150 },
        { Expression: "VeryLewd", Duration: 2500 },
        { Expression: "Sad", Duration: 300 },
      ],
      Eyes2:
      [
        { Expression: "Closed", Duration: 300 },
        { Expression: "Horny", Duration: 200 },
        { Expression: "Sad", Duration: 180 },
        { Expression: "Lewd", Duration: 150 },
        { Expression: "VeryLewd", Duration: 2500 },
        { Expression: "Sad", Duration: 300 },
      ],
      Eyebrows:
      [
        { Expression: "Lowered", Duration: 450 },
        { Expression: null, Duration: 280 },
        { Expression: "Raised", Duration: 2750 },
        { Expression: null, Duration: 150 },
      ],
    },
  };

  let rollEyesTrigger =
  {
    Event: "EyeRoll",
    Type: "Emote",
    Matchers:
    [
      {
        Tester: /^rolls her eyes/u,
      },
    ],
  };


  bce_EventExpressions.BoopSneeze =
  {
    Type: "BoopSneeze",
    Duration: 4850,
    Priority: 1000,
    Expression:
    {
      Mouth:
      [
        { Expression: null, Duration: 150 },
        { Expression: "Frown", Duration: 200 },
        { Expression: "Sad", Duration: 500 },
        { Expression: "Frown", Duration: 1000 },
        { Expression: "Sad", Duration: 300 },
        { Expression: "HalfOpen", Duration: 400 },
        { Expression: "Frown", Duration: 800 },
        { Expression: "Sad", Duration: 200 },
        { Expression: "HalfOpen", Duration: 300 },
        { Expression: "Pained", Duration: 800 },
        { Expression: "Angry", Duration: 200 },
      ],
      Eyes:
      [
        { Expression: "Dazed", Duration: 350 },
        { Expression: "Horny", Duration: 500 },
        { Expression: "Sad", Duration: 1000 },
        { Expression: "Horny", Duration: 700 },
        { Expression: "Sad", Duration: 800 },
        { Expression: "Horny", Duration: 200 },
        { Expression: "Closed", Duration: 300 },
        { Expression: "Daydream", Duration: 1000 },
      ],
      Eyes2:
      [
        { Expression: "Dazed", Duration: 350 },
        { Expression: "Horny", Duration: 500 },
        { Expression: "Sad", Duration: 1000 },
        { Expression: "Horny", Duration: 700 },
        { Expression: "Sad", Duration: 800 },
        { Expression: "Horny", Duration: 200 },
        { Expression: "Closed", Duration: 300 },
        { Expression: "Daydream", Duration: 1000 },
      ],
      Eyebrows:
      [
        { Expression: null, Duration: 350 },
        { Expression: "Lowered", Duration: 500 },
        { Expression: null, Duration: 1000 },
        { Expression: "Lowered", Duration: 300 },
        { Expression: "Harsh", Duration: 400 },
        { Expression: "Lowered", Duration: 800 },
        { Expression: "Harsh", Duration: 200 },
        { Expression: "Angry", Duration: 1100 },
        { Expression: "Soft", Duration: 200 },
      ],
    },
  };

  let boopSneezeTrigger =
  {
    Event: "BoopSneeze",
    Type: "Emote",
    Matchers:
    [
      {
        Tester: /^begins to sneeze/u,
      },
      {
        Tester: /^comienza a estornudar/u,
      },
    ],
  };

  /*
    Blush Expressions
    ["Low", "Medium", "High", "VeryHigh", "Extreme", "ShortBreath"]

    "Fluids" Expressions (ew that sounds gross)
    ["DroolLow", "DroolMedium", "DroolHigh", "DroolSides", "DroolMessy", "DroolTearsLow", "DroolTearsMedium",
    "DroolTearsHigh", "DroolTearsMessy", "DroolTearsSides", "TearsHigh", "TearsMedium", "TearsLow"]

    Emoticon Expressions
    ["Afk", "Whisper", "Sleep", "Hearts", "Tear", "Hearing", "Confusion", "Exclamation", "Annoyed", "Read",
    "RaisedHand", "Spectator", "ThumbsDown", "ThumbsUp", "LoveRope", "LoveGag", "LoveLock", "Wardrobe", "Gaming"]

    Eyebrows Expressions
    ["Raised", "Lowered", "OneRaised", "Harsh", "Angry", "Soft"]

    Eyes Expressions
    ["Closed", "Dazed", "Shy", "Sad", "Horny", "Lewd", "VeryLewd", "Heart", "HeartPink", "LewdHeart",
    "LewdHeartPink", "Dizzy", "Daydream", "ShylyHappy", "Angry", "Surprised", "Scared"]

    Mouth Expressions
    ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy",
    "Devious", "Laughing", "Grin", "Smirk", "Pout"]
  */

  ACBC.Private.AddActivityTrigger(holdBreathTrigger);
  ACBC.Private.AddActivityTrigger(boopSneezeTrigger);
  ACBC.Private.AddActivityTrigger(rollEyesTrigger);
}


ACBC.Private.FbcEmoteTriggerSetup = async function()
{
  console.log("Waiting for bce_EventExpressions to be loaded...");
  await ACBC.WaitFor(
    () => !!window.Player?.Name && !!window.bce_EventExpressions);

  ACBC.Private.AddAllTriggers();
  ACBC.Private.RemoveCuddleTrigger();
  ACBC.Private.RemoveStretchTrigger();
}


ACBC.HornyVoidOutfits = {};
ACBC.HornyVoidOutfits.Tentacles =
"NobwRAcghgtgpmAXGAEgBgJwEY1gDRgDiATgPYCuADkqnAJYDmAFgC75gDCpANqcTQBE4AMyjlu" +
"bAL55w0eDQAaAGSjEGCAiQrVkAIVIATAJ4BVSpTj8CXXv2QB1JnRYJps2AmTLV69lqo0+sZKpAD" +
"uluw2fDSOzq4ykB40KFB0xABiZAB2LABMAOx+ZAHIKWmZpDmRPNHIAMS5aI2NYG6J8qWpxLpQAM" +
"YA1gAshZrFOqhdPQPVtjQNTQutCXKeYACiRnAAzgCsRdo0G9sztWB1AMyX51BQS+4d65u7+yWP2" +
"7kndmdX17dtKzQAEpwBjiVQvcYAWQoLCYnyQwDOzUWAF1/klkBA6OZuNtzhCaFiccdrDUvkJROI" +
"pMsMWAAArkLZbIxKRisLAE5AMplGeHICliCR3dqrXTcRlw0YHPTiraSzhkwQiQXU+6rdLiugGLa" +
"csAa8hanWk2b85VU4UA5BrGCkFh0XqVXXW232x3G04C83oh5HABGZFCWw5UtefoDRoVJrAnqF3t" +
"WMbYIfGKSy2r50bNsZpDwTupQcCgBnTubjNCUBdhlhs3FUujg3G4uoAki4YBA4NN3eTM4n6WQLM" +
"QWLzEOA1sJhB22IhESFpiiCLP+nADLph2AAPKhLKWOmF3idsCLyFwGC+ywQciniKIAAcOx2gzQk" +
"lLyAAanQz/nVCw6XRLL06CyBgI38cYWxPIlKFxLZf3/QDgOLHt2DpftLCHJBwEXZdV0OAAPXpZT" +
"oAA3OBdwMfd+nYI8TzPYgLyvOwADY0BvG80AIaEDFWddx3YJscjgLItmcYcAFosAIMcJ16KdETW" +
"Bh1CLBdSDnAgAGUWCgFwgW2KQXzAXRyCyLIjDUg1e1AwJiFuLsETOFiHJvMA0WzVYuGILY4BYQZ" +
"dXczzeyiOxETqNjQtwFy1UCKBU2imyiDGZItL5YKOFStL2DqNL0vnPtSAHdCRzAAAVIwLCQLJxG" +
"4Z9XMCMIelTXVdGs3p6y85Kziy1LnP0whuGcFwrHi6UwEhKAtko2zpzOAQOAAQTQfIOAymb5sW7" +
"qauQDh+yKvLfN4WF2rqNAOGO46MtOk6loikUaF6/qIiTGgOH2phZt6FqmT4XlJuC9I/v+jL/oBn" +
"KULytDh3AEqyuQDTVC2cthD0jawDU7coCXDzgyG141KYUgSUjWoUq6ghMpJjquuuy0UZU/og11N" +
"TaYjQK7LJq79KKwTNIIgnLOQcCYFm4gYGZxUpqOtBJcljK2Kl3BSbl6WQdQwcIeK0rPAqht1K8u" +
"lSE8uypn6NZuF9MIdvIXo4RczhrMRjCbrfUgtQAAk5nI+mg9hjwY6nZr6lrvZo89L1opA7wfdiM" +
"y2XpiGxO1HWQZCVYKjMHV5arIuQd3ua9x7+dbcsEJ++zFZlsuFbLnKtqge3Cup19nYMN2uc9gmf" +
"dov2A40Ebg7o0Prwjx8CCEGO48oBOshoZOwdVpV09aDnW55kCEoLk90jgNqS4luXy73yu9+V2eC" +
"shjXysqnWf31zwZxBLZnpvosbZruus7ARvXZztuIw789aX9vaHuf9+4MXDveYe0dY7xzoInMAM9" +
"8priEAvTOjtirLzztjMCrZDIsACmLYKit5ZnFllLc6VdrB2ynO/T+zdv4ryDr7AB3dGGdwHnYIe" +
"UdR7QInrAqeScCCg0QfPUgGcl4ewYfnMAAtoTkFhPiHeRDnKUNrtQtBtCW4SMwSAruQDWEhzAbe" +
"CBXDtg8MntPQRKckEdlEYvFEQA=";
ACBC.HornyVoidOutfits.Rope =
"NobwRAcghgtgpmAXGAEgBgJwBY1gDRgDiATgPYCuADkqnAJYDmAFgC75gDCpANqcTQBE4AMyjlu" +
"bAL55w0eDQAyUYgwQESFasgBCpACYBPAKqVKcfgS69+yAOpM6LBNNmwEyCHxhRu7DVRpdQwVSAH" +
"dzdis+QRExCTAXSDcaFCg6YgAxMgA7FgAmAFY/MgDkVPSs0lzInmjEYDAAYgBRAEE2trAAXUS5d" +
"1Q04m0oAGMAawLcdRKtAfTh8ZrrGNFxKRkk+WQAJTgGcWVizRoAWQoWJiW6hsa8gTu77t7kjzpT" +
"bjgAZwBGI9LIN6UD6fK42MBCVbxZ5bMAABXIn0+BgUjFYv2mx2Q8MRBlBKzi61cMO03ARlwx/xJ" +
"ZLxyAhBISGz6NGaMFILDoIyqf1mLLZHK5llqYLpawZRP6zQMcAARmRQj9ucypbKwiDBctabFRdD" +
"+iL4hTZqlsno1ZwhfjtYyXuCtfqiDMUnAoHoaTbIYTNv0UHAYJRtqQzIrkABJJwwDJwOBsdXXJp" +
"oePdAiwshmYgsXGIcAAFQMgeQGXE3G0dGNJYY7AAylHYaRPu4Ggo9p8OLw6y6ugQBHRhMIOWsM3" +
"lpJxiFBhGxM56aAA1Uh0PQAAn9gYIJx90vMTOQM7n7FXMHXxAg5H3EUQAFpvp2viNiG92VyQ77a" +
"586NLuAZ5+zmCw8POpSx5ydJFP1IediB9UgADc1DhFNzHTGJOVxSQdUdX0lxg/xZlDH1GwYU0oh" +
"sG541wDtYIDeCM2zXN+lXYhvB3AgqxYGs6yQBsmxbWs4HbTtu17EZ+yQLAhw4EcxyQcVp1nBcMN" +
"3NcN2tbcXRXBTD2PA8kAvK9PhvO86AfMBgyfRFX3fT9UR/P8o0AqBgJYUDwNZaD2GTCi0wzG0kI" +
"SVCyh9P0KKDIyw1aeiCPNeo4wTMi3NTBCJxzPMwFsW9PhYZpuGlMJUmIbIvk+LM6Bg5oezgEZxw" +
"aElSEWJMcgQMjmNY+swAWMYMqy0IswoEZLjIrsez7CQMwAZlE8TxykrcZMXQLVJPQ8lJk+T5qPe" +
"atMvG1dNvSh72yGhjMoZ8zI/L9WF/f9bPsxyIJc2r3PirzSGQ3zOF4C4KxYcgBuycsDX2sMznIC" +
"4aWI6LLHGyTJymud5w+r7ex+5aD03MBlKRjcNNPbTNr0naDL2/M6G4bhPk/Jg4HnVkgaYedOV9D" +
"4nHfc6bKAk7rucmDYsoxCnp8q0YS4i5CCgX77UxYKfUBi48hBqLSLuuKqLARL+gAeSzCB2BK4Qy" +
"oqlreHGKXySIEWUW/J5wdHCaodR6bBeNvdkcWxiwEdjG1vPDahC2/TDIrKhzAs79mYA1mQLAm7O" +
"bgjyeee/n+gyUk51NLCaET8hk9dPUPRRxtQj0YXRdTkMAfOJhhtlxoSMTYcrchlHlPnQv0YWmE0" +
"bm5HMZsbHvdx3bmQADxGOBibgXJ5ygACXw+bIRjLEPLrZiOOdc6OHqEbyUPjpUvm+GW/uQSUvn3" +
"s0NVBkjSJeo+fhP4uwGvyuL+il7vXQ2axf+HCYFhEfILocKz5yxrlzGOCUaI0FVtBYgsIoC5CKq" +
"afqAkhKIA2pA8wt49BwGTAZW88U8gbW1rrdiw42Q9Tkj0S2EkJwN2mnJDuik25LXoepD2PdrzbX" +
"7o+Q6pk3wnUsgvMODll5QSjvdTyG9eZb0mrQN+Zgcp5UREFL+XViCfFII/MG5FFaQxVikZQCiEH" +
"8UGvFAhpVyrELEqQpg5Cxp12oc7WS783at36O3V2alVqaU9jpPu+N9omRfLwoOZ1rKhzskvJyIj" +
"V5iNjnzaRr8ApyP0flJRYYVFqJPoRYhVdNEgPitRJKXZYBVBUuCIxgkhpIGGgQQh5jIqWJYGQwK" +
"FDa5UOkY3Oh7iVoOJbp4rGXt2G+wJkZAJx1glWQuoI9mUSFbc01JvSQXQgA==";

/*
AssetName
AssetGroup
OptionName
Color
Difficulty
Craft

  let ropeCraft =
  {
    Description: "Animated by some unseen power",
    Item: "HempRope",
    Lock: "",
    MemberName: "Unknown",
    MemberNumber: 0,
    Name: "Magical Rope",
    Private: false,
    Property: "Secure",
    Type: "",
  };
*/

ACBC.HornyVoidSets = {};
ACBC.HornyVoidSets.Craft = {};
ACBC.HornyVoidSets.Craft.HempRope =
{ Name: 'Void Rope', MemberName: 'VOID', MemberNumber: -1,
  Description: 'Impossibly tight, yet easy to remove', Property: 'Decoy' };
ACBC.HornyVoidSets.Craft.ClothStuffing =
{ Name: 'Void Stuffing', MemberName: 'VOID', MemberNumber: -1,
  Description: 'Fills the mouth completely', Property: 'Large' };
ACBC.HornyVoidSets.Craft.ClothGag =
{ Name: 'Void Cloth', MemberName: 'VOID', MemberNumber: -1,
  Description: 'Strict as can be, yet easy to remove', Property: 'Decoy' };
ACBC.HornyVoidSets.Craft.LewdGag =
{ Name: 'Void Gag', MemberName: 'VOID', MemberNumber: -1,
  Description: 'Muffles completely, yet is easy to remove', Property: 'Decoy' };
ACBC.HornyVoidSets.Craft.Tentacles =
{ Name: 'Void Tentacles', MemberName: 'VOID', MemberNumber: -1,
  Description: 'Strong, smooth, and surprisingly easy to remove', Property: 'Decoy' };

ACBC.HornyVoidSets.Rope =
[
  { AssetName: "HempRope", AssetGroup: "ItemArms", Color: "#000", Difficulty: 0,
    OptionName: "WristElbowHarnessTie", Craft: ACBC.HornyVoidSets.Craft.HempRope },
  { AssetName: "HempRope", AssetGroup: "ItemLegs", Color: "#000", Difficulty: 0,
    OptionName: "Mermaid", Craft: ACBC.HornyVoidSets.Craft.HempRope },
  { AssetName: "HempRope", AssetGroup: "ItemFeet", Color: "#000", Difficulty: 0,
    OptionName: "FullBinding", Craft: ACBC.HornyVoidSets.Craft.HempRope },
  { AssetName: "HempRope", AssetGroup: "ItemPelvis", Color: "#000", Difficulty: 0,
    OptionName: "OverPanties", Craft: ACBC.HornyVoidSets.Craft.HempRope },
  { AssetName: "HempRope", AssetGroup: "ItemTorso", Color: "#000", Difficulty: 0,
    OptionName: "Harness", Craft: ACBC.HornyVoidSets.Craft.HempRope },
  { AssetName: "HempRope", AssetGroup: "ItemTorso2", Color: "#000", Difficulty: 0,
    OptionName: "Diamond", Craft: ACBC.HornyVoidSets.Craft.HempRope },
  { AssetName: "ClothStuffing", AssetGroup: "ItemMouth", Color: "#000", Difficulty: -50,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.ClothStuffing },
  { AssetName: "ClothGag", AssetGroup: "ItemMouth2", Color: "#000", Difficulty: 0,
    OptionName: "OTN", Craft: ACBC.HornyVoidSets.Craft.ClothGag },
  { AssetName: "LewdGag", AssetGroup: "ItemMouth3", Color: "#000", Difficulty: 0,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.LewdGag },
];

ACBC.HornyVoidSets.Tentacles =
[
  { AssetName: "Tentacles", AssetGroup: "ItemArms", Color: ["#000", "#800", "#000"], Difficulty: -20,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.Tentacles },
  { AssetName: "Tentacles", AssetGroup: "ItemLegs", Color: ["#000", "#800", "#000"], Difficulty: -20,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.Tentacles },
  { AssetName: "Tentacles", AssetGroup: "ItemFeet", Color: ["#000", "#800", "#000"], Difficulty: -20,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.Tentacles },
  { AssetName: "Tentacles", AssetGroup: "ItemMouth", Color: ["#000", "#800", "#000"], Difficulty: -20,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.Tentacles },
  { AssetName: "Tentacles", AssetGroup: "ItemButt", Color: ["#000", "#800", "#000"], Difficulty: -20,
    OptionName: null, Craft: ACBC.HornyVoidSets.Craft.Tentacles },
];


//////////////////////////
ACBC.Private.Initialize();

console.log(" * acbc-main.js loaded.");
