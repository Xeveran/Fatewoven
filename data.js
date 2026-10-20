/*
 * Bundled gift reference for Fatewoven Gift Strategist.
 * Main source: public Game8-derived gift preference export, cross-checked against
 * the guide links listed in index.html. Entries labelled supplemental are from
 * separately published community reports and should be verified in-game.
 * Only Loved and Really liked reactions are used by the optimizer.
 */
window.GIFT_DATA = {
  sourceUrl: "https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690",
  // Additional named gifts spotted in supplemental community guides. These are
  // trackable inventory items even though this snapshot has no reliable tier
  // mapping for them, so the optimizer will not recommend them without a match.
  catalogExtras: ["Ahm Lu Cloth", "Decorative Arrows", "Imitation Medal", "Pegasus Panorama", "Red Hair Clip"],
  // Recruitment Renown requirements used by the route priority presets.
  // 0 = joins automatically on that route; a missing key means no requirement
  // is listed for that route in the referenced recruitment guide.
  routeRenown: {
    cai: {
      "Cai": 0, "Peter": 0, "Catania": 10, "Diego": 10, "Io": 10,
      "Loretta": 7, "Ninae": 6, "Noctula": 4, "Nydine": 6, "Peppe": 9,
      "Seteth": 6, "Sofia": 9, "Yang Jie": 3, "Fianna": 8, "Goliath": 7,
      "Jester": 10, "Lilian": 8, "Ludia": 9, "Lysander": 8, "Mu": 9,
      "Olympia": 8, "Sirocco": 9, "Ursula": 10, "Dadao": 7, "Dante": 10,
      "Esmeralda": 7, "Halvin": 5, "Majide": 5, "Mikaela": 5, "Nezha": 6,
      "Simon": 8, "Zarcone": 8, "Benditz": 9, "Jasmine": 8, "Kiroc": 8,
      "Alexandra": 7, "Nuzzuo": 6, "Inyoni": 8, "Guzran": 2
    },
    dietrich: {
      "Dietrich": 0, "Fabio": 0, "Esmeralda": 0, "Mikaela": 0,
      "Buccar": 8, "Catania": 8, "Dadao": 10, "Dante": 8, "Diego": 9,
      "Fianna": 7, "Goliath": 6, "Guzran": 8, "Halvin": 9, "Io": 3,
      "Jester": 6, "Lilian": 8, "Loretta": 9, "Ludia": 9, "Lysander": 6,
      "Majide": 8, "Nezha": 10, "Ninae": 8, "Noctula": 6, "Nydine": 5,
      "Peppe": 8, "Peter": 9, "Sha Lan": 10, "Simon": 7, "Sofia": 9,
      "Tialla": 9, "Ultand": 5, "Ursula": 7, "Zarcone": 7, "Benditz": 7,
      "Mu": 7, "Olympia": 6, "Sirocco": 9, "Jasmine": 9, "Kiroc": 4,
      "Alexandra": 8, "Inyoni": 8, "Nuzzuo": 9, "Gaitz": 10, "Yang Jie": 2
    },
    theodora: {
      "Bonaventure": 0, "Theodora": 0, "Tobias": 0, "Lilian": 0, "Lysander": 0,
      "Buccar": 8, "Catania": 7, "Dadao": 5, "Dante": 6, "Diego": 8,
      "Esmeralda": 9, "Fianna": 9, "Goliath": 9, "Guzran": 8, "Halvin": 7,
      "Io": 10, "Jester": 9, "Loretta": 5, "Ludia": 7, "Majide": 8,
      "Mikaela": 8, "Mu": 9, "Nezha": 6, "Ninae": 6, "Noctula": 3,
      "Nydine": 5, "Olympia": 9, "Peppe": 7, "Peter": 7, "Seteth": 6,
      "Simon": 7, "Sirocco": 5, "Tialla": 10, "Ultand": 6, "Ursula": 9,
      "Yang Jie": 9, "Zarcone": 4, "Benditz": 8, "Jasmine": 8, "Kiroc": 10,
      "Alexandra": 6, "Inyoni": 9, "Nuzzuo": 6, "Sofia": 2
    },
    leda: {
      "Buccar": 0, "Leda": 0, "Mu": 0, "Sirocco": 0, "Olympia": 0,
      "Dadao": 5, "Dante": 10, "Diego": 8, "Esmeralda": 6, "Fabio": 9,
      "Goliath": 10, "Guzran": 3, "Halvin": 7, "Io": 6, "Jester": 10,
      "Lilian": 7, "Loretta": 5, "Ludia": 7, "Lysander": 7, "Majide": 9,
      "Mikaela": 6, "Nezha": 9, "Ninae": 8, "Noctula": 8, "Nydine": 10,
      "Peter": 10, "Seteth": 10, "Sha Lan": 8, "Simon": 6, "Sofia": 7,
      "Tialla": 8, "Ultand": 8, "Yang Jie": 8, "Zarcone": 5, "Benditz": 7,
      "Fianna": 5, "Kiroc": 4, "Jasmine": 4, "Alexandra": 10,
      "Nuzzuo": 9, "Inyoni": 7, "Catania": 2
    }
  },
  characters: [
    { name: "Alexandra", loved: ["Eastern Earrings", "Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Alecto Garum", "Dagda Beard Grass", "Garum", "Gaudy Bangle", "Herbal Recipe Guide", "Home-Recipe Book", "Horse-Grooming Kit", "Kitten Figurine", "Mane Ornament", "Pastry Cookbook", "Smooth Garum", "Strong Seasonings", "Sturdy Rucksack", "Training Bracelet", "Village Recipes", "Wing Fletching"] },
    { name: "Benditz", loved: ["Eastern Black Silk", "Eastern Earrings", "Eastern Tea Leaves", "Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Coffee Pastries", "Common Coffee", "Eastern Love Story", "Gaudy Bangle", "Orgus Coffee", "Select Coffee", "Southern Coffee", "Wing Fletching"] },
    { name: "Bonaventure", loved: ["Crimson Ghosh", "Strategy Manuscript", "Volcano Ghosh"], reallyLiked: ["Ceremonial Spear", "Eastern Black Silk", "Jade Ghosh", "Pastry Cookbook", "Rare Spices", "Secret Ghosh", "Strong Seasonings", "Sun Ghosh", "Tales of the Arena", "The Works of Dante", "Thick Foreign Tome", "Village Recipes"] },
    { name: "Buccar", loved: ["Crimson Ghosh", "Dual Fish Knives"], reallyLiked: ["Arrowhead Gem", "Light Shosh", "Mature Ghosh", "Mature Shosh", "Niiza Garum", "Outdoor Cooking Set", "Rare Spices", "Rustic Ghosh", "Village Recipes", "Volcano Ghosh", "Young Ghosh", "Young Shosh"] },
    { name: "Cai", loved: [], reallyLiked: ["Arrowhead Gem", "Crimson Ghosh", "Sharp Fishhook"] },
    { name: "Catania", loved: ["Eastern Black Silk", "Eastern Earrings", "Eastern Tea Leaves", "Tales of Adventure"], reallyLiked: ["Coffee Pastries", "Common Coffee", "Dagda Beard Grass", "Gaudy Bangle", "Horse-Grooming Kit", "Kitten Figurine", "Magic-Trick Set", "Orgus Coffee", "Pack of Pastels", "Select Coffee", "Southern Coffee"] },
    { name: "Dadao", loved: ["Poems of the Greats", "Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Coffee Pastries", "Fragrant Pastries", "Ginji Cervi", "Honey Milk", "Honey Pastries", "Huge Fish Eyeball", "Jamel Milk", "Mature Dried Cervi", "Mellow Pastries", "Pastry Cookbook", "Potted Vegetables", "Saraminian Sweets", "Simple Pastries", "Strong Cervi", "Weak Cervi", "Yarc Milk"] },
    { name: "Dante", loved: [], reallyLiked: ["Arrowhead Gem", "Common Coffee", "Crimson Ghosh", "Magic-Trick Set", "Pack of Pastels", "Select Coffee", "The Works of Dante"] },
    { name: "Dietrich", loved: [], reallyLiked: ["Arrowhead Gem", "Board-Game Tactics", "Crimson Ghosh", "Ginji Cervi", "Honey Milk", "Honey Pastries", "Joint-Relief Gloves", "Kitten Figurine", "Pastry Cookbook", "Protection Figurine", "Pure-White Cervi", "Spirit Board Game", "Training Pillar", "Training Weights"] },
    { name: "Diego", loved: ["Arrowhead Gem"], reallyLiked: ["Crimson Ghosh", "Joint-Relief Gloves", "Protection Figurine", "Training Pillar", "Training Weights"] },
    { name: "Esmeralda", loved: ["Eastern Earrings", "Tales of Adventure"], reallyLiked: ["Alecto Garum", "Coffee Pastries", "Dagda Beard Grass", "Eastern Tea Leaves", "Flexible Fishing Rod", "Fragrant Pastries", "Garum", "Gaudy Bangle", "Herbal Recipe Guide", "Home-Recipe Book", "Horse-Grooming Kit", "Huge Fish Eyeball", "Kitten Figurine", "Mellow Pastries", "Pastry Cookbook", "Saraminian Sweets", "Sharp Fishhook", "Simple Pastries", "Smooth Garum", "Strong Seasonings", "Training Bracelet", "Village Recipes"] },
    { name: "Fabio", loved: ["Tales of Adventure", "Volcano Ghosh"], reallyLiked: ["Aromatic Shosh", "Brined Fish Guts"] , note: "Only the visible portion of the preference export was available; verify this list before using it as definitive." },
    { name: "Fianna", loved: ["Arrowhead Gem", "Blue-Rose Bouquet", "Volcano Ghosh"], reallyLiked: ["Common Coffee", "Crimson Ghosh", "Joint-Relief Gloves", "Rare Spices", "Select Coffee", "Skin Balm", "Southern Coffee"] },
    { name: "Gaitz", loved: [], reallyLiked: ["Arrowhead Gem", "Common Coffee", "Crimson Ghosh", "Horse-Grooming Kit", "Joint-Relief Gloves", "Orgus Coffee", "Training Pillar", "Training Weights"] },
    { name: "Goliath", loved: ["Strategy Manuscript", "Volcano Ghosh"], reallyLiked: ["Aromatic Shosh", "Eastern Tea Leaves", "Jade Ghosh", "Light Shosh", "Mature Ghosh", "Mature Shosh", "Rustic Ghosh", "Secret Ghosh", "Southern Ghosh", "Sturdy Rucksack", "Sun Ghosh", "Training Bracelet", "Wing Fletching", "Young Ghosh"] },
    { name: "Guzran", loved: ["Strategy Manuscript", "Tales of Adventure", "Volcano Ghosh"], reallyLiked: ["Aromatic Shosh", "Common Coffee", "Eastern Tea Leaves", "Huge Fish Eyeball", "Jade Ghosh", "Light Shosh", "Mature Ghosh", "Mature Shosh", "Orgus Coffee", "Rustic Ghosh", "Secret Ghosh", "Select Coffee", "Southern Coffee", "Southern Ghosh", "Strong Seasonings", "Sun Ghosh", "Wing Fletching", "Young Ghosh", "Young Shosh"] },
    { name: "Halvin", loved: ["Eastern Black Silk", "Eastern Earrings", "Garum"], reallyLiked: ["Crimson Ghosh", "Eastern Tea Leaves", "Exquisite Ring", "Gaudy Bangle", "Jade Panther Figure", "Magic-Trick Set", "Potted Vegetables", "Simple Pastries", "Skin Balm", "Village Recipes"], note: "Garum is marked Loved in the later Game8-derived export; older English snapshots differ." },
    { name: "Inyoni", loved: ["Strategy Manuscript", "Tales of Adventure", "Arrowhead Gem", "Shield Portrait"], reallyLiked: ["Crimson Ghosh", "Eastern Tea Leaves", "Protection Figurine", "Flexible Fishing Rod", "Bow Repair Kit", "Eastern Board Game", "Joint-Relief Gloves"] },
    { name: "Io", loved: [], reallyLiked: ["Arrowhead Gem", "Board-Game Tactics", "Common Coffee", "Crimson Ghosh", "Horse-Grooming Kit", "Joint-Relief Gloves", "Kitten Figurine", "Mane Ornament", "Protection Figurine", "Spirit Board Game", "Sturdy Rucksack", "Training Pillar", "Training Weights"] },
    { name: "Jasmine", loved: [], reallyLiked: ["Arrowhead Gem", "Crimson Ghosh", "Dual Fish Knives", "Honey Pastries", "Jamel Milk", "Joint-Relief Gloves", "Kitten Figurine", "Magic-Trick Set", "Niiza Garum", "Outdoor Cooking Set", "Pack of Pastels", "Pastry Cookbook", "Protection Figurine", "Pure-White Cervi", "Rare Spices", "Sturdy Rucksack", "Training Pillar", "Training Weights"] },
    { name: "Jester", loved: ["Arrowhead Gem"], reallyLiked: ["Board-Game Tactics", "Crimson Ghosh", "Dual Fish Knives", "Joint-Relief Gloves", "Spirit Board Game"] },
    { name: "Kiroc", loved: ["Arrowhead Gem", "Crimson Ghosh", "Volcano Ghosh"], reallyLiked: ["Arrowhead Gem", "Common Coffee", "Joint-Relief Gloves", "Light Shosh", "Mature Ghosh", "Mature Shosh", "Rustic Ghosh", "Select Coffee", "Sharp Fishhook", "Southern Coffee", "Training Pillar", "Training Weights", "Young Ghosh"] },
    { name: "Leda", loved: ["Eastern Black Silk", "Eastern Earrings", "Tales of Adventure", "Volcano Ghosh", "Crimson Ghosh", "Flower Painting", "Portrait of Yu Phas", "Arrowhead Gem"], reallyLiked: [], source: "Supplemental community gift guide", note: "Cross-reference entry. Verify any uncertain item markers in the linked source." },
    { name: "Lilian", loved: ["Eastern Earrings", "Eastern Tea Leaves", "Poems of the Greats", "Strategy Manuscript", "Tales of Adventure"], reallyLiked: [], source: "Supplemental community gift guide", note: "The source marks Tales of Adventure with uncertainty." },
    { name: "Loretta", loved: [], reallyLiked: ["Arrowhead Gem", "Crimson Ghosh", "Honey Milk", "Honey Pastries", "Joint-Relief Gloves", "Mellow Pastries", "Pastry Cookbook", "Pure-White Cervi", "Training Pillar", "Training Weights"] },
    { name: "Ludia", loved: ["Eastern Black Silk", "Eastern Earrings", "Eastern Love Story", "Eastern Tea Leaves", "Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Coffee Pastries", "Common Coffee", "Everyday Scenes", "Gaudy Bangle", "Herbal Recipe Guide", "Home-Recipe Book", "Magic-Trick Set", "Orgus Coffee", "Pastry Cookbook", "Select Coffee", "Sharp Fishhook", "Skin Balm", "Southern Coffee", "Sturdy Rucksack", "Trader's Handbook", "Training Bracelet", "Village Recipes"] },
    { name: "Lysander", loved: [], reallyLiked: ["Dagda Beard Grass", "Eastern Tea Leaves", "Horse-Grooming Kit", "Mane Ornament", "Wing Fletching"] },
    { name: "Majide", loved: ["Arrowhead Gem", "Crimson Ghosh", "Dual Fish Knives"], reallyLiked: ["Crimson Ghosh", "Dual Fish Knives", "Joint-Relief Gloves", "Light Shosh", "Mature Ghosh", "Mature Shosh", "Rustic Ghosh", "Training Pillar", "Training Weights", "Volcano Ghosh", "Young Ghosh", "Young Shosh"] },
    { name: "Mikaela", loved: ["Rugged Blade", "Strategy Manuscript", "Tales of Adventure", "Volcano Ghosh"], reallyLiked: ["Ghosh", "Coffee", "Training Weights", "Training Pillar", "Arrowhead Gem", "Tome from Away", "Home-Recipe Book", "Flower Painting"], source: "Supplemental community gift guide", note: "The supplemental guide groups some gift families (for example, Coffee and Ghosh); confirm exact in-game item names." },
    { name: "Mu", loved: [], reallyLiked: ["Arrowhead Gem", "Candy Crystals", "Honey Pastries", "Jamel Milk", "Outdoor Cooking Set", "Pickled Vegetables", "Pure-White Cervi", "Weak Cervi", "Yarc Milk"] },
    { name: "Nezha", loved: ["Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Eastern Tea Leaves", "Pickled Bulbs", "Sturdy Rucksack", "Training Bracelet", "Wing Fletching"] },
    { name: "Ninae", loved: ["Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Arrowhead Gem", "Crimson Ghosh", "Eastern Black Silk", "Eastern Tea Leaves"] },
    { name: "Noctula", loved: ["Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Eastern Tea Leaves", "Protection Figurine", "Sturdy Rucksack", "Training Bracelet", "Wing Fletching"] },
    { name: "Nuzzuo", loved: ["Arrowhead Gem", "Dual Fish Knives"], reallyLiked: ["Common Coffee", "Crimson Ghosh", "Joint-Relief Gloves", "Kitten Figurine", "Niiza Garum", "Outdoor Cooking Set", "Pickled Vegetables", "Protection Figurine", "Select Coffee", "Sturdy Rucksack", "Training Bracelet", "Training Pillar", "Training Weights"] },
    { name: "Nydine", loved: ["Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Eastern Love Story", "Eastern Tea Leaves", "Kitten Figurine", "Sturdy Rucksack", "Training Bracelet", "Training Weights", "Wing Fletching"] },
    { name: "Olympia", loved: ["Eastern Earrings", "Eastern Tea Leaves", "Orgus Coffee", "Tales of Adventure"], reallyLiked: ["Coffee Pastries", "Common Coffee", "Gaudy Bangle", "Select Coffee", "Skin Balm", "Southern Coffee"] },
    { name: "Peppe", loved: ["Arrowhead Gem"], reallyLiked: ["Board-Game Tactics", "Common Coffee", "Crimson Ghosh", "Joint-Relief Gloves", "Kitten Figurine", "Magic-Trick Set", "Outdoor Cooking Set", "Pack of Pastels", "Pastry Cookbook", "Protection Figurine", "Sharp Fishhook", "Spirit Board Game", "Sturdy Rucksack", "The Works of Dante", "Training Pillar", "Training Weights"] },
    { name: "Peter", loved: [], reallyLiked: ["Ginji Cervi", "Mature Dried Cervi", "Pure-White Cervi", "Strong Cervi", "Weak Cervi"], source: "Supplemental community report", note: "Reported as really liking Cervi drinks broadly; this list expands only named variants represented in the item catalogue." },
    { name: "Seteth", loved: ["Poems of the Greats", "Strategy Manuscript", "Tales of Adventure"], reallyLiked: ["Common Coffee", "Eastern Tea Leaves", "Flexible Fishing Rod", "Herbal Recipe Guide", "Home-Recipe Book", "Huge Fish Eyeball", "Orgus Coffee", "Pastry Cookbook", "Select Coffee", "Sharp Fishhook", "Southern Coffee", "Sturdy Rucksack", "Trader's Handbook", "Village Recipes"] },
    { name: "Sha Lan", loved: ["Special “Medicine”"], reallyLiked: ["Common Coffee", "Energizing Ghosh", "Niiza Garum", "Outdoor Cooking Set", "Pastry Cookbook", "Select Coffee"] },
    { name: "Simon", loved: [], reallyLiked: ["Crimson Ghosh", "Dual Fish Knives", "Protection Figurine"] },
    { name: "Sirocco", loved: [], reallyLiked: ["Full Sewing Kit"], source: "Supplemental community report", note: "The supplemental report identifies Full Sewing Kit as a really-liked gift; other preferences are not included here." },
    { name: "Sofia", loved: ["Blue-Rose Bouquet", "Dual Fish Knives", "Volcano Ghosh"], reallyLiked: ["Arrowhead Gem", "Common Coffee", "Crimson Ghosh", "Ginji Cervi", "Honey Milk", "Honey Pastries", "Jamel Milk", "Kitten Figurine", "Magic-Trick Set", "Niiza Garum", "Outdoor Cooking Set", "Pack of Pastels", "Pastry Cookbook", "Pickled Vegetables", "Protection Figurine", "Pure-White Cervi", "Sharp Fishhook", "Yarc Milk"] },
    { name: "Theodora", loved: [], reallyLiked: ["Dagda Beard Grass", "Eastern Black Silk", "Eastern Tea Leaves", "Horse-Grooming Kit"] },
    { name: "Tialla", loved: ["Eastern Board Game", "Ebony Game Board", "History of a Master", "Morfis Almanac", "Portrait of Yu Phas", "School Scandal", "Tome from Away"], reallyLiked: ["Alecto Garum", "Board-Game Tactics", "Eastern Love Story", "Eastern Tea Leaves", "Everyday Scenes", "Garum", "Ginji Cervi", "Herbal Recipe Guide", "Home-Recipe Book", "Jamel Milk", "Mature Dried Cervi", "Pastry Cookbook", "Pickled Bulbs", "Smooth Garum", "Solomon Coffee", "Spirit Board Game", "Strategy Manuscript", "Strong Cervi", "Strong Seasonings", "Tales of Adventure", "Tales of the Arena", "The Knight's Suitors", "Trader's Handbook", "Village Recipes", "Weak Cervi", "Yarc Milk"] },
    { name: "Tobias", loved: [], reallyLiked: ["Smooth Garum"], source: "Supplemental community report", note: "The comment also mentions Ghosh varieties without enumerating exact item names/tier details." },
    { name: "Ursula", loved: [], reallyLiked: ["Arrowhead Gem", "Common Coffee", "Crimson Ghosh", "Eastern Love Story", "Kitten Figurine", "Mane Ornament", "Pack of Pastels"] },
    { name: "Yang Jie", loved: ["Eastern Tea Leaves", "Poems of the Greats", "Strategy Manuscript", "Tales of Adventure", "Volcano Ghosh"], reallyLiked: ["Aromatic Shosh", "Coffee Pastries", "Common Coffee", "Flexible Fishing Rod", "Herbal Recipe Guide", "Home-Recipe Book", "Huge Fish Eyeball", "Jade Ghosh", "Kitten Figurine", "Light Shosh", "Mature Ghosh", "Mature Shosh", "Orgus Coffee", "Pastry Cookbook", "Rustic Ghosh", "Secret Ghosh", "Select Coffee", "Sharp Fishhook", "Southern Coffee", "Southern Ghosh", "Sun Ghosh", "The Works of Dante", "Trader's Handbook", "Village Recipes", "Young Ghosh"] },
    { name: "Zarcone", loved: ["Eastern Tea Leaves"], reallyLiked: ["Eastern Earrings", "Gaudy Bangle", "Pickled Bulbs", "Potted Vegetables", "Strategy Manuscript", "Tales of Adventure", "Wing Fletching"] }
  ],
  /* Characters known in the game, but without a preference pair in this snapshot. */
  charactersWithoutPreferences: ["Eshmel", "Hong Hua", "Nathan", "Talimun", "Anatolia", "Orchel", "Centurio", "Aswan", "Tahonia", "Troy", "Ultand", "Bertrand"]
};
