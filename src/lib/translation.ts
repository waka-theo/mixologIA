import { getTranslation, saveTranslation } from './supabase';

const INGREDIENT_DICTIONARY: Record<string, string> = {
  'Rum': 'Rhum',
  'White Rum': 'Rhum blanc',
  'Dark Rum': 'Rhum brun',
  'Light Rum': 'Rhum blanc',
  'Light rum': 'Rhum blanc',
  'Dark rum': 'Rhum brun',
  'White rum': 'Rhum blanc',
  'Spiced Rum': 'Rhum épicé',
  'Gold Rum': 'Rhum doré',
  'Aged Rum': 'Rhum vieux',
  'Rhum Agricole': 'Rhum agricole',
  'Cachaca': 'Cachaça',
  'Overproof Rum': 'Rhum overproof',
  'Navy Rum': 'Rhum navy',
  'Vodka': 'Vodka',
  'Vanilla Vodka': 'Vodka vanille',
  'Citrus Vodka': 'Vodka citron',
  'Pepper Vodka': 'Vodka poivre',
  'Flavored Vodka': 'Vodka aromatisée',
  'Gin': 'Gin',
  'London Dry Gin': 'London Dry Gin',
  'Plymouth Gin': 'Plymouth Gin',
  'Old Tom Gin': 'Old Tom Gin',
  'Sloe Gin': 'Sloe Gin',
  'Navy Strength Gin': 'Navy Strength Gin',
  'Tequila': 'Tequila',
  'Silver Tequila': 'Tequila silver',
  'Gold Tequila': 'Tequila gold',
  'Reposado Tequila': 'Tequila reposado',
  'Anejo Tequila': 'Tequila añejo',
  'Blanco Tequila': 'Tequila blanco',
  'Mezcal': 'Mezcal',
  'Sotol': 'Sotol',
  'Raicilla': 'Raicilla',
  'Whiskey': 'Whisky',
  'Whisky': 'Whisky',
  'Bourbon': 'Bourbon',
  'Rye Whiskey': 'Whisky de seigle',
  'Tennessee Whiskey': 'Whisky du Tennessee',
  'Scotch': 'Scotch',
  'Irish Whiskey': 'Whisky irlandais',
  'Canadian Whisky': 'Whisky canadien',
  'Japanese Whisky': 'Whisky japonais',
  'Single Malt Scotch': 'Single Malt Scotch',
  'Blended Scotch': 'Scotch blended',
  'Brandy': 'Cognac',
  'Cognac': 'Cognac',
  'Armagnac': 'Armagnac',
  'Pisco': 'Pisco',
  'Calvados': 'Calvados',
  'Applejack': 'Applejack',
  'Cherry Brandy': 'Brandy de cerise',
  'Apricot Brandy': 'Brandy d\'abricot',
  'Peach Brandy': 'Brandy de pêche',
  'Blackberry Brandy': 'Brandy de mûre',
  'Liqueur': 'Liqueur',
  'Triple Sec': 'Triple sec',
  'Triple sec': 'Triple sec',
  'Cointreau': 'Cointreau',
  'Grand Marnier': 'Grand Marnier',
  'Curacao': 'Curaçao',
  'Blue Curacao': 'Curaçao bleu',
  'Orange Liqueur': 'Liqueur d\'orange',
  'Coffee Liqueur': 'Liqueur de café',
  'Kahlua': 'Kahlua',
  'Tia Maria': 'Tia Maria',
  'Amaretto': 'Amaretto',
  'Disaronno': 'Disaronno',
  'Frangelico': 'Frangelico',
  'Sambuca': 'Sambuca',
  'Anisette': 'Anisette',
  'Ouzo': 'Ouzo',
  'Pastis': 'Pastis',
  'Pernod': 'Pernod',
  'Chartreuse': 'Chartreuse',
  'Green Chartreuse': 'Chartreuse verte',
  'Yellow Chartreuse': 'Chartreuse jaune',
  'Benedictine': 'Bénédictine',
  'Drambuie': 'Drambuie',
  'Galliano': 'Galliano',
  'Jagermeister': 'Jägermeister',
  'Fernet Branca': 'Fernet Branca',
  'Campari': 'Campari',
  'Aperol': 'Aperol',
  'Cynar': 'Cynar',
  'Averna': 'Averna',
  'Montenegro': 'Montenegro',
  'Chambord': 'Chambord',
  'Creme de Cassis': 'Crème de cassis',
  'Creme de cassis': 'Crème de cassis',
  'Creme de Mure': 'Crème de mûre',
  'Creme de Framboise': 'Crème de framboise',
  'Creme de Menthe': 'Crème de menthe',
  'Creme de menthe': 'Crème de menthe',
  'White Creme de Menthe': 'Crème de menthe blanche',
  'Green Creme de Menthe': 'Crème de menthe verte',
  'Creme de Cacao': 'Crème de cacao',
  'Creme de cacao': 'Crème de cacao',
  'White Creme de Cacao': 'Crème de cacao blanche',
  'Dark Creme de Cacao': 'Crème de cacao brune',
  'Creme de Violette': 'Crème de violette',
  'Creme de Peche': 'Crème de pêche',
  'Creme de Banane': 'Crème de banane',
  'Midori': 'Midori',
  'Midori Melon Liqueur': 'Liqueur de melon Midori',
  'Midori melon liqueur': 'Liqueur de melon Midori',
  'Melon Liqueur': 'Liqueur de melon',
  'Baileys': 'Baileys',
  'Baileys Irish Cream': 'Baileys',
  'Baileys irish cream': 'Baileys',
  'Irish Cream': 'Crème irlandaise',
  'Cream Liqueur': 'Liqueur de crème',
  'Absinthe': 'Absinthe',
  'Herbsaint': 'Herbsaint',
  'Vermouth': 'Vermouth',
  'Sweet Vermouth': 'Vermouth doux',
  'Sweet vermouth': 'Vermouth doux',
  'Dry Vermouth': 'Vermouth sec',
  'Dry vermouth': 'Vermouth sec',
  'Blanc Vermouth': 'Vermouth blanc',
  'Red Vermouth': 'Vermouth rouge',
  'Red vermouth': 'Vermouth rouge',
  'Lillet': 'Lillet',
  'Lillet Blanc': 'Lillet Blanc',
  'Lillet Rouge': 'Lillet Rouge',
  'Cocchi Americano': 'Cocchi Americano',
  'Sherry': 'Xérès',
  'Fino Sherry': 'Fino',
  'Amontillado Sherry': 'Amontillado',
  'Oloroso Sherry': 'Oloroso',
  'Pedro Ximenez': 'Pedro Ximenez',
  'Port': 'Porto',
  'Ruby Port': 'Porto Ruby',
  'Tawny Port': 'Porto Tawny',
  'White Port': 'Porto blanc',
  'Madeira': 'Madère',
  'Marsala': 'Marsala',
  'Champagne': 'Champagne',
  'Prosecco': 'Prosecco',
  'Cava': 'Cava',
  'Sparkling Wine': 'Vin pétillant',
  'Cremant': 'Crémant',
  'Wine': 'Vin',
  'Red Wine': 'Vin rouge',
  'Red wine': 'Vin rouge',
  'White Wine': 'Vin blanc',
  'White wine': 'Vin blanc',
  'Rose Wine': 'Vin rosé',
  'Dry White Wine': 'Vin blanc sec',
  'Sweet White Wine': 'Vin blanc doux',
  'Beer': 'Bière',
  'Lager': 'Lager',
  'Ale': 'Ale',
  'Stout': 'Stout',
  'IPA': 'IPA',
  'Pilsner': 'Pilsner',
  'Wheat Beer': 'Bière blanche',
  'Cider': 'Cidre',
  'Apple Cider': 'Cidre de pomme',
  'Hard Cider': 'Cidre fort',
  'Pear Cider': 'Poiré',
  'Sake': 'Saké',
  'Shochu': 'Shochu',
  'Soju': 'Soju',
  'Bitters': 'Amer',
  'Angostura Bitters': 'Amer Angostura',
  'Angostura bitters': 'Amer Angostura',
  'Orange Bitters': 'Amer d\'orange',
  'Orange bitters': 'Amer d\'orange',
  'Peychaud Bitters': 'Amer Peychaud',
  'Peychaud bitters': 'Amer Peychaud',
  'Aromatic Bitters': 'Amer aromatique',
  'Chocolate Bitters': 'Amer au chocolat',
  'Celery Bitters': 'Amer au céleri',
  'Grapefruit Bitters': 'Amer au pamplemousse',
  'Lemon Bitters': 'Amer au citron',
  'Lavender Bitters': 'Amer à la lavande',
  'Cherry Bitters': 'Amer à la cerise',
  'Lime Juice': 'Jus de citron vert',
  'Lime juice': 'Jus de citron vert',
  'Lemon Juice': 'Jus de citron',
  'Lemon juice': 'Jus de citron',
  'Orange Juice': 'Jus d\'orange',
  'Orange juice': 'Jus d\'orange',
  'Grapefruit Juice': 'Jus de pamplemousse',
  'Grapefruit juice': 'Jus de pamplemousse',
  'Pineapple Juice': 'Jus d\'ananas',
  'Pineapple juice': 'Jus d\'ananas',
  'Cranberry Juice': 'Jus de canneberge',
  'Cranberry juice': 'Jus de canneberge',
  'Apple Juice': 'Jus de pomme',
  'Apple juice': 'Jus de pomme',
  'Grape Juice': 'Jus de raisin',
  'Tomato Juice': 'Jus de tomate',
  'Tomato juice': 'Jus de tomate',
  'Passion Fruit Juice': 'Jus de fruit de la passion',
  'Guava Juice': 'Jus de goyave',
  'Mango Juice': 'Jus de mangue',
  'Papaya Juice': 'Jus de papaye',
  'Coconut Juice': 'Jus de coco',
  'Pomegranate Juice': 'Jus de grenade',
  'Blood Orange Juice': 'Jus d\'orange sanguine',
  'Lime': 'Citron vert',
  'Lemon': 'Citron',
  'Orange': 'Orange',
  'Grapefruit': 'Pamplemousse',
  'Blood Orange': 'Orange sanguine',
  'Tangerine': 'Mandarine',
  'Clementine': 'Clémentine',
  'Kumquat': 'Kumquat',
  'Simple Syrup': 'Sirop simple',
  'Simple syrup': 'Sirop simple',
  'Sugar Syrup': 'Sirop de sucre',
  'Sugar syrup': 'Sirop de sucre',
  'Rich Simple Syrup': 'Sirop simple riche',
  'Demerara Syrup': 'Sirop de demerara',
  'Honey': 'Miel',
  'Honey Syrup': 'Sirop de miel',
  'Agave Syrup': 'Sirop d\'agave',
  'Agave Nectar': 'Nectar d\'agave',
  'Maple Syrup': 'Sirop d\'érable',
  'Maple syrup': 'Sirop d\'érable',
  'Grenadine': 'Grenadine',
  'Orgeat': 'Orgeat',
  'Falernum': 'Falernum',
  'Velvet Falernum': 'Velvet Falernum',
  'Ginger Syrup': 'Sirop de gingembre',
  'Vanilla Syrup': 'Sirop de vanille',
  'Cinnamon Syrup': 'Sirop de cannelle',
  'Mint Syrup': 'Sirop de menthe',
  'Lavender Syrup': 'Sirop de lavande',
  'Rose Syrup': 'Sirop de rose',
  'Elderflower Syrup': 'Sirop de sureau',
  'Club Soda': 'Eau gazeuse',
  'Club soda': 'Eau gazeuse',
  'Soda Water': 'Eau gazeuse',
  'Soda water': 'Eau gazeuse',
  'Sparkling Water': 'Eau pétillante',
  'Tonic Water': 'Eau tonique',
  'Tonic water': 'Eau tonique',
  'Ginger Ale': 'Ginger ale',
  'Ginger ale': 'Ginger ale',
  'Ginger Beer': 'Bière au gingembre',
  'Ginger beer': 'Bière au gingembre',
  'Cola': 'Cola',
  'Coca Cola': 'Coca-Cola',
  'Pepsi': 'Pepsi',
  'Sprite': 'Sprite',
  'Seven Up': 'Seven Up',
  '7-Up': '7-Up',
  'Lemon-Lime Soda': 'Soda citron-citron vert',
  'Cream Soda': 'Soda à la crème',
  'Root Beer': 'Root beer',
  'Birch Beer': 'Birch beer',
  'Coffee': 'Café',
  'Espresso': 'Espresso',
  'Cold Brew Coffee': 'Café cold brew',
  'Instant Coffee': 'Café instantané',
  'Tea': 'Thé',
  'Black Tea': 'Thé noir',
  'Green Tea': 'Thé vert',
  'Iced Tea': 'Thé glacé',
  'Chai Tea': 'Thé chaï',
  'Milk': 'Lait',
  'Whole Milk': 'Lait entier',
  'Skim Milk': 'Lait écrémé',
  'Almond Milk': 'Lait d\'amande',
  'Coconut Milk': 'Lait de coco',
  'Coconut milk': 'Lait de coco',
  'Oat Milk': 'Lait d\'avoine',
  'Soy Milk': 'Lait de soja',
  'Condensed Milk': 'Lait concentré',
  'Evaporated Milk': 'Lait évaporé',
  'Cream': 'Crème',
  'Heavy Cream': 'Crème épaisse',
  'Heavy cream': 'Crème épaisse',
  'Light Cream': 'Crème légère',
  'Half and Half': 'Crème légère',
  'Half-and-half': 'Crème légère',
  'Whipped Cream': 'Crème fouettée',
  'Coconut Cream': 'Crème de coco',
  'Coconut cream': 'Crème de coco',
  'Sour Cream': 'Crème aigre',
  'Creme Fraiche': 'Crème fraîche',
  'Yogurt': 'Yaourt',
  'Greek Yogurt': 'Yaourt grec',
  'Kefir': 'Kéfir',
  'Egg': 'Œuf',
  'Egg White': 'Blanc d\'œuf',
  'Egg white': 'Blanc d\'œuf',
  'Egg Yolk': 'Jaune d\'œuf',
  'Egg yolk': 'Jaune d\'œuf',
  'Whole Egg': 'Œuf entier',
  'Ice': 'Glace',
  'Crushed Ice': 'Glace pilée',
  'Crushed ice': 'Glace pilée',
  'Ice Cubes': 'Glaçons',
  'Pebble Ice': 'Glace en perles',
  'Block Ice': 'Bloc de glace',
  'Water': 'Eau',
  'Still Water': 'Eau plate',
  'Mineral Water': 'Eau minérale',
  'Spring Water': 'Eau de source',
  'Coconut Water': 'Eau de coco',
  'Sugar': 'Sucre',
  'White Sugar': 'Sucre blanc',
  'Brown Sugar': 'Sucre brun',
  'Brown sugar': 'Sucre brun',
  'Powdered Sugar': 'Sucre glace',
  'Powdered sugar': 'Sucre glace',
  'Superfine Sugar': 'Sucre superfin',
  'Raw Sugar': 'Sucre brut',
  'Turbinado Sugar': 'Sucre turbinado',
  'Demerara Sugar': 'Sucre demerara',
  'Muscovado Sugar': 'Sucre muscovado',
  'Salt': 'Sel',
  'Sea Salt': 'Sel de mer',
  'Kosher Salt': 'Sel kasher',
  'Himalayan Salt': 'Sel de l\'Himalaya',
  'Celery Salt': 'Sel de céleri',
  'Pepper': 'Poivre',
  'Black Pepper': 'Poivre noir',
  'White Pepper': 'Poivre blanc',
  'Cayenne Pepper': 'Poivre de Cayenne',
  'Tabasco': 'Tabasco',
  'Hot Sauce': 'Sauce piquante',
  'Hot sauce': 'Sauce piquante',
  'Sriracha': 'Sriracha',
  'Worcestershire Sauce': 'Sauce Worcestershire',
  'Worcestershire sauce': 'Sauce Worcestershire',
  'Tabasco sauce': 'Sauce Tabasco',
  'Mint': 'Menthe',
  'Fresh Mint': 'Menthe fraîche',
  'Spearmint': 'Menthe verte',
  'Peppermint': 'Menthe poivrée',
  'Mint Leaves': 'Feuilles de menthe',
  'Basil': 'Basilic',
  'Rosemary': 'Romarin',
  'Thyme': 'Thym',
  'Sage': 'Sauge',
  'Oregano': 'Origan',
  'Cilantro': 'Coriandre',
  'Parsley': 'Persil',
  'Vanilla': 'Vanille',
  'Vanilla Extract': 'Extrait de vanille',
  'Vanilla Bean': 'Gousse de vanille',
  'Cinnamon': 'Cannelle',
  'Cinnamon Stick': 'Bâton de cannelle',
  'Ground Cinnamon': 'Cannelle moulue',
  'Nutmeg': 'Noix de muscade',
  'Ground Nutmeg': 'Noix de muscade moulue',
  'Clove': 'Clou de girofle',
  'Cardamom': 'Cardamome',
  'Ginger': 'Gingembre',
  'Fresh Ginger': 'Gingembre frais',
  'Ground Ginger': 'Gingembre moulu',
  'Chocolate': 'Chocolat',
  'Dark Chocolate': 'Chocolat noir',
  'Milk Chocolate': 'Chocolat au lait',
  'White Chocolate': 'Chocolat blanc',
  'Cocoa Powder': 'Poudre de cacao',
  'Chocolate Syrup': 'Sirop de chocolat',
  'Strawberry': 'Fraise',
  'Raspberry': 'Framboise',
  'Blueberry': 'Myrtille',
  'Blackberry': 'Mûre',
  'Cranberry': 'Canneberge',
  'Cherry': 'Cerise',
  'Sour Cherry': 'Cerise aigre',
  'Maraschino Cherry': 'Cerise marasquin',
  'Peach': 'Pêche',
  'Apricot': 'Abricot',
  'Plum': 'Prune',
  'Apple': 'Pomme',
  'Pear': 'Poire',
  'Grape': 'Raisin',
  'Watermelon': 'Pastèque',
  'Pineapple': 'Ananas',
  'Mango': 'Mangue',
  'Papaya': 'Papaye',
  'Guava': 'Goyave',
  'Passion Fruit': 'Fruit de la passion',
  'Passion fruit': 'Fruit de la passion',
  'Lychee': 'Litchi',
  'Kiwi': 'Kiwi',
  'Banana': 'Banane',
  'Coconut': 'Noix de coco',
  'Fresh Coconut': 'Noix de coco fraîche',
  'Avocado': 'Avocat',
  'Fig': 'Figue',
  'Date': 'Datte',
  'Olive': 'Olive',
  'Green Olive': 'Olive verte',
  'Black Olive': 'Olive noire',
  'Cucumber': 'Concombre',
  'Celery': 'Céleri',
  'Carrot': 'Carotte',
  'Tomato': 'Tomate',
  'Bell Pepper': 'Poivron',
  'Onion': 'Oignon',
  'Red Onion': 'Oignon rouge',
  'Shallot': 'Échalote',
  'Garlic': 'Ail',
  'Horseradish': 'Raifort',
  'Wasabi': 'Wasabi',
  'Ginger Root': 'Racine de gingembre',
  'Peanut': 'Cacahuète',
  'Almond': 'Amande',
  'Cashew': 'Noix de cajou',
  'Walnut': 'Noix',
  'Pecan': 'Noix de pécan',
  'Hazelnut': 'Noisette',
  'Pistachio': 'Pistache',
  'Peanut Butter': 'Beurre de cacahuète',
  'Almond Butter': 'Beurre d\'amande',
  'Tahini': 'Tahini',
  'Nutella': 'Nutella',
  'Marshmallow': 'Guimauve',
  'Caramel': 'Caramel',
  'Caramel Sauce': 'Sauce caramel',
  'Butterscotch': 'Butterscotch',
  'Jam': 'Confiture',
  'Jelly': 'Gelée',
  'Strawberry Jam': 'Confiture de fraises',
  'Raspberry Jam': 'Confiture de framboises',
  'Ice Cream': 'Glace',
  'Sorbet': 'Sorbet',
  'Gelato': 'Gelato'
};

const GLASS_DICTIONARY: Record<string, string> = {
  'Cocktail glass': 'Verre à cocktail',
  'Highball glass': 'Verre highball',
  'Old-fashioned glass': 'Verre old-fashioned',
  'Martini glass': 'Verre à martini',
  'Collins glass': 'Verre Collins',
  'Margarita glass': 'Verre à margarita',
  'Hurricane glass': 'Verre Hurricane',
  'Shot glass': 'Verre à shot',
  'Champagne flute': 'Flûte à champagne',
  'Wine glass': 'Verre à vin',
  'Beer mug': 'Chope à bière',
  'Pint glass': 'Verre à pinte',
  'Copper mug': 'Mug en cuivre',
  'Coffee mug': 'Tasse à café',
  'Irish coffee cup': 'Tasse à café irlandais',
  'Coupe glass': 'Coupe'
};

export function convertMeasurement(measure: string): string {
  let converted = measure;

  converted = converted.replace(/(\d+\.?\d*)\s*oz/gi, (match, num) => {
    const ml = Math.round(parseFloat(num) * 30);
    return `${ml} ml`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*cup/gi, (match, num) => {
    const cl = Math.round(parseFloat(num) * 24);
    return `${cl} cl`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*tsp/gi, (match, num) => {
    const ml = Math.round(parseFloat(num) * 5);
    return `${ml} ml`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*tbsp/gi, (match, num) => {
    const ml = Math.round(parseFloat(num) * 15);
    return `${ml} ml`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*shot/gi, (match, num) => {
    const ml = Math.round(parseFloat(num) * 45);
    return `${ml} ml`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*jigger/gi, (match, num) => {
    const ml = Math.round(parseFloat(num) * 45);
    return `${ml} ml`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*dash/gi, (match, num) => {
    const ml = parseFloat(num) * 0.6;
    return `${ml.toFixed(1)} ml`;
  });

  converted = converted.replace(/(\d+\.?\d*)\s*splash/gi, () => 'Une éclaboussure');

  return converted;
}

export async function translateIngredient(ingredient: string): Promise<string> {
  const normalized = ingredient.trim();

  const cached = await getTranslation(normalized);
  if (cached) return cached;

  const translation = INGREDIENT_DICTIONARY[normalized] || normalized;

  if (translation !== normalized) {
    await saveTranslation(normalized, translation);
  }

  return translation;
}

export async function translateGlass(glass: string): Promise<string> {
  const normalized = glass.trim();

  const cached = await getTranslation(normalized);
  if (cached) return cached;

  const translation = GLASS_DICTIONARY[normalized] || normalized;

  if (translation !== normalized) {
    await saveTranslation(normalized, translation);
  }

  return translation;
}

export async function translateInstructions(instructions: string): Promise<string> {
  const cached = await getTranslation(instructions);
  if (cached) return cached;

  const sentences = instructions.split(/\.\s+/);
  const translated = sentences.map(sentence => {
    let result = sentence;

    result = result.replace(/shake/gi, 'secouez');
    result = result.replace(/stir/gi, 'remuez');
    result = result.replace(/pour/gi, 'versez');
    result = result.replace(/mix/gi, 'mélangez');
    result = result.replace(/blend/gi, 'mixez');
    result = result.replace(/muddle/gi, 'écrasez');
    result = result.replace(/strain/gi, 'filtrez');
    result = result.replace(/garnish/gi, 'garnissez');
    result = result.replace(/serve/gi, 'servez');
    result = result.replace(/add/gi, 'ajoutez');
    result = result.replace(/fill/gi, 'remplissez');
    result = result.replace(/top/gi, 'complétez');
    result = result.replace(/squeeze/gi, 'pressez');
    result = result.replace(/rim/gi, 'bordez');
    result = result.replace(/float/gi, 'faites flotter');
    result = result.replace(/layer/gi, 'superposez');
    result = result.replace(/combine/gi, 'combinez');

    result = result.replace(/with ice/gi, 'avec de la glace');
    result = result.replace(/ice cubes/gi, 'glaçons');
    result = result.replace(/crushed ice/gi, 'glace pilée');
    result = result.replace(/into glass/gi, 'dans le verre');
    result = result.replace(/in glass/gi, 'dans le verre');
    result = result.replace(/over ice/gi, 'sur glace');

    return result;
  }).join('. ');

  await saveTranslation(instructions, translated);
  return translated;
}
