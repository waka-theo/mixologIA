import { getCachedApiResponse, cacheApiResponse } from './supabase';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function cachedFetch(endpoint: string, params: string = ''): Promise<any> {
  const cached = await getCachedApiResponse(endpoint, params);
  if (cached) {
    return cached;
  }

  const url = params ? `${BASE_URL}${endpoint}${params}` : `${BASE_URL}${endpoint}`;
  const data = await fetchWithRetry(url);

  await cacheApiResponse(endpoint, params, data);
  return data;
}

export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strGlass?: string;
  strInstructions?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
}

export async function searchByName(query: string): Promise<Cocktail[]> {
  const data = await cachedFetch('/search.php', `?s=${encodeURIComponent(query)}`);
  return data.drinks || [];
}

export async function getRandomCocktail(): Promise<Cocktail> {
  const url = `${BASE_URL}/random.php`;
  const data = await fetchWithRetry(url);
  return data.drinks[0];
}

export async function filterByIngredient(ingredient: string): Promise<Cocktail[]> {
  const data = await cachedFetch('/filter.php', `?i=${encodeURIComponent(ingredient)}`);
  return data.drinks || [];
}

export async function getCocktailDetails(id: string): Promise<Cocktail> {
  const data = await cachedFetch('/lookup.php', `?i=${id}`);
  return data.drinks[0];
}

const ADDITIONAL_INGREDIENTS = [
  'Rum', 'White Rum', 'Dark Rum', 'Light Rum', 'Spiced Rum', 'Gold Rum', 'Aged Rum',
  'Rhum Agricole', 'Cachaca', 'Overproof Rum', 'Navy Rum',
  'Vodka', 'Vanilla Vodka', 'Citrus Vodka', 'Pepper Vodka', 'Flavored Vodka',
  'Gin', 'London Dry Gin', 'Plymouth Gin', 'Old Tom Gin', 'Sloe Gin', 'Navy Strength Gin',
  'Tequila', 'Silver Tequila', 'Gold Tequila', 'Reposado Tequila', 'Anejo Tequila', 'Blanco Tequila',
  'Mezcal', 'Sotol', 'Raicilla',
  'Whiskey', 'Whisky', 'Bourbon', 'Rye Whiskey', 'Tennessee Whiskey', 'Scotch', 'Irish Whiskey',
  'Canadian Whisky', 'Japanese Whisky', 'Single Malt Scotch', 'Blended Scotch',
  'Brandy', 'Cognac', 'Armagnac', 'Pisco', 'Calvados', 'Applejack', 'Cherry Brandy',
  'Apricot Brandy', 'Peach Brandy', 'Blackberry Brandy',
  'Liqueur', 'Triple Sec', 'Cointreau', 'Grand Marnier', 'Curacao', 'Blue Curacao',
  'Orange Liqueur', 'Coffee Liqueur', 'Kahlua', 'Tia Maria',
  'Amaretto', 'Disaronno', 'Frangelico', 'Sambuca', 'Anisette', 'Ouzo', 'Pastis', 'Pernod',
  'Chartreuse', 'Green Chartreuse', 'Yellow Chartreuse',
  'Benedictine', 'Drambuie', 'Galliano', 'Jagermeister', 'Fernet Branca',
  'Campari', 'Aperol', 'Cynar', 'Averna', 'Montenegro',
  'Chambord', 'Creme de Cassis', 'Creme de Mure', 'Creme de Framboise',
  'Creme de Menthe', 'White Creme de Menthe', 'Green Creme de Menthe',
  'Creme de Cacao', 'White Creme de Cacao', 'Dark Creme de Cacao',
  'Creme de Violette', 'Creme de Peche', 'Creme de Banane',
  'Midori', 'Midori Melon Liqueur', 'Melon Liqueur',
  'Baileys', 'Baileys Irish Cream', 'Irish Cream', 'Cream Liqueur',
  'Absinthe', 'Pastis', 'Herbsaint',
  'Vermouth', 'Sweet Vermouth', 'Dry Vermouth', 'Blanc Vermouth', 'Red Vermouth',
  'Lillet', 'Lillet Blanc', 'Lillet Rouge', 'Cocchi Americano',
  'Sherry', 'Fino Sherry', 'Amontillado Sherry', 'Oloroso Sherry', 'Pedro Ximenez',
  'Port', 'Ruby Port', 'Tawny Port', 'White Port',
  'Madeira', 'Marsala',
  'Champagne', 'Prosecco', 'Cava', 'Sparkling Wine', 'Cremant',
  'Wine', 'Red Wine', 'White Wine', 'Rose Wine', 'Dry White Wine', 'Sweet White Wine',
  'Beer', 'Lager', 'Ale', 'Stout', 'IPA', 'Pilsner', 'Wheat Beer',
  'Cider', 'Apple Cider', 'Hard Cider', 'Pear Cider',
  'Sake', 'Shochu', 'Soju',
  'Bitters', 'Angostura Bitters', 'Orange Bitters', 'Peychaud Bitters',
  'Aromatic Bitters', 'Chocolate Bitters', 'Celery Bitters', 'Grapefruit Bitters',
  'Lemon Bitters', 'Lavender Bitters', 'Cherry Bitters',
  'Lime Juice', 'Lemon Juice', 'Orange Juice', 'Grapefruit Juice',
  'Pineapple Juice', 'Cranberry Juice', 'Apple Juice', 'Grape Juice',
  'Tomato Juice', 'Passion Fruit Juice', 'Guava Juice', 'Mango Juice',
  'Papaya Juice', 'Coconut Juice', 'Pomegranate Juice', 'Blood Orange Juice',
  'Lime', 'Lemon', 'Orange', 'Grapefruit', 'Blood Orange',
  'Tangerine', 'Clementine', 'Kumquat',
  'Simple Syrup', 'Sugar Syrup', 'Rich Simple Syrup', 'Demerara Syrup',
  'Honey', 'Honey Syrup', 'Agave Syrup', 'Agave Nectar',
  'Maple Syrup', 'Grenadine', 'Orgeat', 'Falernum', 'Velvet Falernum',
  'Ginger Syrup', 'Vanilla Syrup', 'Cinnamon Syrup', 'Mint Syrup',
  'Lavender Syrup', 'Rose Syrup', 'Elderflower Syrup',
  'Club Soda', 'Soda Water', 'Sparkling Water', 'Tonic Water',
  'Ginger Ale', 'Ginger Beer', 'Cola', 'Coca Cola', 'Pepsi',
  'Sprite', 'Seven Up', '7-Up', 'Lemon-Lime Soda',
  'Cream Soda', 'Root Beer', 'Birch Beer',
  'Coffee', 'Espresso', 'Cold Brew Coffee', 'Instant Coffee',
  'Tea', 'Black Tea', 'Green Tea', 'Iced Tea', 'Chai Tea',
  'Milk', 'Whole Milk', 'Skim Milk', 'Almond Milk', 'Coconut Milk',
  'Oat Milk', 'Soy Milk', 'Condensed Milk', 'Evaporated Milk',
  'Cream', 'Heavy Cream', 'Light Cream', 'Half and Half', 'Whipped Cream',
  'Coconut Cream', 'Sour Cream', 'Creme Fraiche',
  'Yogurt', 'Greek Yogurt', 'Kefir',
  'Egg', 'Egg White', 'Egg Yolk', 'Whole Egg',
  'Butter', 'Clarified Butter', 'Ghee',
  'Sugar', 'White Sugar', 'Brown Sugar', 'Powdered Sugar', 'Superfine Sugar',
  'Raw Sugar', 'Turbinado Sugar', 'Demerara Sugar', 'Muscovado Sugar',
  'Salt', 'Sea Salt', 'Kosher Salt', 'Himalayan Salt', 'Celery Salt',
  'Pepper', 'Black Pepper', 'White Pepper', 'Cayenne Pepper',
  'Chili Pepper', 'Jalapeno', 'Habanero', 'Serrano Pepper',
  'Tabasco', 'Hot Sauce', 'Sriracha', 'Worcestershire Sauce',
  'Soy Sauce', 'Fish Sauce', 'Oyster Sauce',
  'Vinegar', 'White Vinegar', 'Apple Cider Vinegar', 'Balsamic Vinegar',
  'Red Wine Vinegar', 'Rice Vinegar', 'Sherry Vinegar',
  'Mint', 'Fresh Mint', 'Spearmint', 'Peppermint', 'Mint Leaves',
  'Basil', 'Thai Basil', 'Holy Basil',
  'Rosemary', 'Thyme', 'Sage', 'Oregano', 'Cilantro', 'Parsley',
  'Dill', 'Tarragon', 'Chives', 'Lemongrass', 'Kaffir Lime Leaves',
  'Bay Leaf', 'Marjoram', 'Savory',
  'Vanilla', 'Vanilla Extract', 'Vanilla Bean', 'Vanilla Paste',
  'Cinnamon', 'Cinnamon Stick', 'Ground Cinnamon',
  'Nutmeg', 'Ground Nutmeg', 'Whole Nutmeg',
  'Clove', 'Ground Cloves', 'Whole Cloves',
  'Allspice', 'Cardamom', 'Star Anise', 'Fennel Seed',
  'Coriander', 'Cumin', 'Caraway', 'Anise Seed',
  'Ginger', 'Fresh Ginger', 'Ground Ginger', 'Candied Ginger',
  'Turmeric', 'Paprika', 'Smoked Paprika',
  'Chocolate', 'Dark Chocolate', 'Milk Chocolate', 'White Chocolate',
  'Cocoa Powder', 'Chocolate Syrup', 'Chocolate Sauce',
  'Strawberry', 'Raspberry', 'Blueberry', 'Blackberry',
  'Cranberry', 'Cherry', 'Sour Cherry', 'Maraschino Cherry',
  'Peach', 'Nectarine', 'Apricot', 'Plum',
  'Apple', 'Pear', 'Grape', 'Watermelon', 'Cantaloupe', 'Honeydew',
  'Pineapple', 'Mango', 'Papaya', 'Guava', 'Passion Fruit',
  'Lychee', 'Dragon Fruit', 'Star Fruit', 'Kiwi',
  'Banana', 'Plantain', 'Coconut', 'Fresh Coconut',
  'Avocado', 'Fig', 'Date', 'Prune', 'Raisin',
  'Olive', 'Green Olive', 'Black Olive', 'Kalamata Olive',
  'Pickle', 'Pickled Onion', 'Pickled Jalapeno',
  'Cucumber', 'Celery', 'Carrot', 'Tomato', 'Bell Pepper',
  'Onion', 'Red Onion', 'Shallot', 'Garlic', 'Scallion',
  'Horseradish', 'Wasabi', 'Ginger Root',
  'Beet', 'Radish', 'Turnip', 'Parsnip',
  'Fennel', 'Artichoke', 'Asparagus',
  'Ice', 'Crushed Ice', 'Ice Cubes', 'Pebble Ice', 'Block Ice',
  'Water', 'Still Water', 'Mineral Water', 'Spring Water',
  'Coconut Water', 'Aloe Vera Water', 'Cactus Water',
  'Activated Charcoal', 'Edible Gold', 'Edible Silver',
  'Rose Water', 'Orange Blossom Water', 'Hibiscus',
  'Elderflower', 'Elderflower Cordial', 'St. Germain',
  'Violet', 'Lavender', 'Chamomile', 'Jasmine',
  'Matcha', 'Hojicha', 'Sencha',
  'Tamarind', 'Tamarind Paste', 'Tamarind Syrup',
  'Pomegranate', 'Pomegranate Molasses', 'Pomegranate Seeds',
  'Yuzu', 'Yuzu Juice', 'Sudachi', 'Kabosu',
  'Umeboshi', 'Shiso', 'Bonito Flakes',
  'Miso', 'Seaweed', 'Nori', 'Kombu', 'Wakame',
  'Peanut Butter', 'Almond Butter', 'Tahini',
  'Nutella', 'Marshmallow', 'Marshmallow Fluff',
  'Caramel', 'Caramel Sauce', 'Butterscotch',
  'Toffee', 'Dulce de Leche',
  'Jam', 'Jelly', 'Marmalade', 'Preserves',
  'Strawberry Jam', 'Raspberry Jam', 'Apricot Jam',
  'Peanut', 'Almond', 'Cashew', 'Walnut', 'Pecan',
  'Hazelnut', 'Pistachio', 'Macadamia', 'Brazil Nut',
  'Pine Nut', 'Chestnut', 'Pumpkin Seed', 'Sunflower Seed',
  'Sesame Seed', 'Flax Seed', 'Chia Seed', 'Hemp Seed',
  'Oats', 'Rolled Oats', 'Steel Cut Oats', 'Oat Flour',
  'Wheat', 'Flour', 'Cornmeal', 'Polenta',
  'Rice', 'Jasmine Rice', 'Basmati Rice', 'Arborio Rice',
  'Graham Cracker', 'Cookie', 'Biscuit', 'Wafer',
  'Cake', 'Sponge Cake', 'Angel Food Cake',
  'Brownie', 'Blondie', 'Fudge',
  'Popsicle', 'Ice Cream', 'Sorbet', 'Gelato', 'Sherbet'
];

export async function getIngredientsList(): Promise<{ strIngredient1: string }[]> {
  const data = await cachedFetch('/list.php', '?i=list');
  const apiIngredients = data.drinks || [];

  const apiIngredientNames = new Set(apiIngredients.map((d: any) => d.strIngredient1));

  const additionalIngredientObjects = ADDITIONAL_INGREDIENTS
    .filter(ing => !apiIngredientNames.has(ing))
    .map(ing => ({ strIngredient1: ing }));

  const allIngredients = [...apiIngredients, ...additionalIngredientObjects];

  allIngredients.sort((a, b) => a.strIngredient1.localeCompare(b.strIngredient1));

  return allIngredients;
}

export async function getCategoriesList(): Promise<{ strCategory: string }[]> {
  const data = await cachedFetch('/list.php', '?c=list');
  return data.drinks || [];
}

export async function filterByMultipleIngredients(ingredients: string[]): Promise<Cocktail[]> {
  if (ingredients.length === 0) return [];

  const allCocktails = new Map<string, { cocktail: Cocktail; matchCount: number }>();

  for (const ingredient of ingredients) {
    const cocktails = await filterByIngredient(ingredient);
    for (const cocktail of cocktails) {
      if (allCocktails.has(cocktail.idDrink)) {
        allCocktails.get(cocktail.idDrink)!.matchCount++;
      } else {
        allCocktails.set(cocktail.idDrink, { cocktail, matchCount: 1 });
      }
    }
  }

  const results = await Promise.all(
    Array.from(allCocktails.values()).map(async ({ cocktail, matchCount }) => {
      const details = await getCocktailDetails(cocktail.idDrink);
      const totalIngredients = getIngredients(details).length;
      const matchPercentage = Math.round((matchCount / totalIngredients) * 100);

      return {
        ...details,
        matchCount,
        matchPercentage,
        missingIngredients: totalIngredients - matchCount
      };
    })
  );

  return results.sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
}

export function getIngredients(cocktail: Cocktail): Array<{ ingredient: string; measure: string }> {
  const ingredients: Array<{ ingredient: string; measure: string }> = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}` as keyof Cocktail];
    const measure = cocktail[`strMeasure${i}` as keyof Cocktail];

    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || ''
      });
    }
  }

  return ingredients;
}
