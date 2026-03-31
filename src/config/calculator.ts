import type {
  CalorieSource,
  DoughIngredientKey,
  IngredientCategory,
  IngredientConfig,
  RecipeOption,
  RecipeFormulaConfig,
  RecipeType,
  ThicknessKey,
  ThicknessOption,
  ToppingConfig,
  ToppingSelection,
} from '../types'

const USDA_SEARCH_BASE_URL = 'https://fdc.nal.usda.gov/fdc-app.html#/food-search?query='

function usdaDetailsUrl(fdcId: number): string {
  return `https://fdc.nal.usda.gov/fdc-app.html#/food-details/${fdcId}/nutrients`
}

function usdaSearchUrl(query: string): string {
  return `${USDA_SEARCH_BASE_URL}${encodeURIComponent(query)}`
}

const CALORIE_SOURCES = {
  flour: {
    label: 'USDA FoodData Central',
    url: usdaDetailsUrl(168896),
    notes: 'Wheat flour, white, bread, enriched. FDC ID 168896. 361 kcal per 100 g.',
  },
  water: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('water, bottled, generic'),
    notes: 'Water contributes 0 kcal per 100 g in USDA generic water entries.',
  },
  starter: {
    label: 'Estimated from USDA FoodData Central',
    url: usdaSearchUrl('sourdough starter 100 hydration'),
    notes:
      '100% hydration sourdough starter estimated as equal parts bread flour and water, about 181 kcal per 100 g.',
  },
  yeast: {
    label: 'USDA FoodData Central',
    url: usdaDetailsUrl(175043),
    notes: "Leavening agents, yeast, baker's, active dry. FDC ID 175043. 325 kcal per 100 g.",
  },
  salt: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('salt, table'),
    notes: 'Table salt contributes 0 kcal per 100 g.',
  },
  sugar: {
    label: 'USDA FoodData Central',
    url: usdaDetailsUrl(746784),
    notes: 'Sugars, granulated. FDC ID 746784. 385 kcal per 100 g.',
  },
  oliveOil: {
    label: 'USDA FoodData Central',
    url: usdaDetailsUrl(171413),
    notes: 'Oil, olive, salad or cooking. FDC ID 171413. 884 kcal per 100 g.',
  },
  mozzarella: {
    label: 'USDA FoodData Central',
    url: usdaDetailsUrl(171244),
    notes: 'Cheese, mozzarella, low moisture, part-skim. FDC ID 171244. 295 kcal per 100 g.',
  },
  pepperoni: {
    label: 'USDA FoodData Central',
    url: usdaDetailsUrl(2162793),
    notes: 'Pepperoni branded entry used as a representative topping reference. FDC ID 2162793. 464 kcal per 100 g.',
  },
  sausage: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('sausage, italian, pork, cooked'),
    notes: 'USDA generic search term for Italian pork sausage, cooked. Using 344 kcal per 100 g.',
  },
  mushrooms: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('mushrooms, white, raw'),
    notes: 'USDA generic white mushroom entry. Using 22 kcal per 100 g.',
  },
  onions: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('onions, raw'),
    notes: 'USDA generic raw onion entry. Using 40 kcal per 100 g.',
  },
  olives: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('olives, ripe, canned'),
    notes: 'USDA generic canned ripe olive entry. Using 116 kcal per 100 g.',
  },
  sauce: {
    label: 'USDA FoodData Central',
    url: usdaSearchUrl('sauce, pizza, canned, ready-to-serve'),
    notes: 'USDA pizza sauce canned ready-to-serve entry. Using 54 kcal per 100 g.',
  },
} satisfies Record<string, CalorieSource>

export const THICKNESS_OPTIONS: ThicknessOption[] = [
  {
    key: 'thin',
    label: 'Thin',
    value: 1.8,
    description: 'Lighter dough ball and a crisper bake.',
  },
  {
    key: 'regular',
    label: 'Regular',
    value: 2.11,
    description: 'Balanced chew and structure.',
  },
  {
    key: 'thick',
    label: 'Thick',
    value: 2.75,
    description: 'Heavier dough ball with more lift.',
  },
]

export const RECIPE_CONFIG: Record<RecipeType, RecipeFormulaConfig> = {
  regular: {
    label: 'Regular',
    description: 'Classic yeasted dough with balanced chew and everyday handling.',
    flourName: 'Bread Flour',
    basePizzaSize: 16,
    baseQuantity: 6,
    baseThickness: 2.11,
    baseFlourAmount: 1509.797685 * (480 / 425),
    waterPct: 0.62,
    yeastPct: 0.004,
    saltPct: 0.025,
    sugarPct: 0.02,
    oilPct: 0.033,
    doughFactor: 2550 / 1509.797685,
  },
  glutenFree: {
    label: 'Gluten Free',
    description: 'Higher-hydration dough for gluten-free flour blends and a softer mix.',
    flourName: 'Gluten-Free Flour',
    basePizzaSize: 16,
    baseQuantity: 6,
    baseThickness: 2.11,
    baseFlourAmount: 333 * 6,
    waterPct: 0.8,
    yeastPct: 0.004,
    saltPct: 0.025,
    sugarPct: 0.02,
    oilPct: 0.033,
    doughFactor: 2550 / 1509.797685,
  },
  sourdough: {
    label: 'Sourdough',
    description: 'Naturally leavened dough with starter, longer fermentation, and extra flavor.',
    flourName: 'Bread Flour',
    basePizzaSize: 16,
    baseQuantity: 6,
    baseThickness: 2.11,
    baseFlourAmount: (480 * 6) / 1.925,
    starterPct: 0.2,
    starterHydrationPct: 1,
    waterPct: 0.68,
    yeastPct: 0,
    saltPct: 0.025,
    sugarPct: 0,
    oilPct: 0.02,
    doughFactor: 1.925,
  },
}

export const RECIPE_OPTIONS: RecipeOption[] = (
  Object.entries(RECIPE_CONFIG) as Array<[RecipeType, RecipeFormulaConfig]>
).map(([key, recipe]) => ({
  key,
  label: recipe.label,
  description: recipe.description,
}))

// Calorie values are sourced from USDA FoodData Central entries or USDA search
// terms that map to generic foods. Adjust them here if you want to align the
// calculator with a specific brand or house recipe.
export const DOUGH_INGREDIENT_CONFIG: Record<DoughIngredientKey, IngredientConfig> =
  {
    flour: {
      name: 'Flour',
      caloriesPerGram: 3.61,
      category: 'dough',
      source: CALORIE_SOURCES.flour,
    },
    water: {
      name: 'Water',
      caloriesPerGram: 0,
      category: 'dough',
      source: CALORIE_SOURCES.water,
    },
    starter: {
      name: 'Sourdough Starter',
      caloriesPerGram: 1.805,
      category: 'dough',
      source: CALORIE_SOURCES.starter,
    },
    yeast: {
      name: 'Yeast',
      caloriesPerGram: 3.25,
      category: 'dough',
      source: CALORIE_SOURCES.yeast,
    },
    salt: {
      name: 'Salt',
      caloriesPerGram: 0,
      category: 'dough',
      source: CALORIE_SOURCES.salt,
    },
    sugar: {
      name: 'Sugar',
      caloriesPerGram: 3.85,
      category: 'dough',
      source: CALORIE_SOURCES.sugar,
    },
    oliveOil: {
      name: 'Olive Oil',
      caloriesPerGram: 8.84,
      category: 'dough',
      source: CALORIE_SOURCES.oliveOil,
    },
  }

export const TOPPING_CONFIG: ToppingConfig[] = [
  {
    id: 'mozzarella',
    name: 'Mozzarella',
    category: 'cheese',
    referenceGrams: 130,
    caloriesPerGram: 2.95,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.mozzarella,
  },
  {
    id: 'pepperoni',
    name: 'Pepperoni',
    category: 'topping',
    referenceGrams: 42,
    caloriesPerGram: 4.64,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.pepperoni,
  },
  {
    id: 'sausage',
    name: 'Sausage',
    category: 'topping',
    referenceGrams: 84,
    caloriesPerGram: 3.44,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.sausage,
  },
  {
    id: 'mushrooms',
    name: 'Mushrooms',
    category: 'topping',
    referenceGrams: 60,
    caloriesPerGram: 0.22,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.mushrooms,
  },
  {
    id: 'onions',
    name: 'Onions',
    category: 'topping',
    referenceGrams: 45,
    caloriesPerGram: 0.4,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.onions,
  },
  {
    id: 'olives',
    name: 'Olives',
    category: 'topping',
    referenceGrams: 30,
    caloriesPerGram: 1.16,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.olives,
  },
  {
    id: 'extraCheese',
    name: 'Extra Cheese',
    category: 'cheese',
    referenceGrams: 85,
    caloriesPerGram: 2.95,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.mozzarella,
  },
  {
    id: 'sauce',
    name: 'Sauce',
    category: 'sauce',
    referenceGrams: 90,
    caloriesPerGram: 0.54,
    defaultQuantity: 1,
    source: CALORIE_SOURCES.sauce,
  },
]

const TOPPING_REFERENCE_PIZZA_SIZE = 16

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  dough: 'Dough',
  sauce: 'Sauce',
  cheese: 'Cheese',
  topping: 'Toppings',
}

export const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  dough: '#f97316',
  sauce: '#ef4444',
  cheese: '#facc15',
  topping: '#65a30d',
}

export const SLICE_DEFAULTS = [
  { min: 10, max: 12, slices: 6 },
  { min: 13, max: 16, slices: 8 },
  { min: 17, max: 20, slices: 10 },
] as const

export const INSTRUCTION_COPY: Record<
  RecipeType,
  { title: string; steps: string[] }
> = {
  regular: {
    title: 'Dough Making Instructions',
    steps: [
      'Cool water to <60°F.',
      'Mix the water and active dry yeast.',
      'Add flour and Olive Oil and mix for 2 minutes.',
      'Keep mixing on low, then add Sugar and Salt.',
      'Mix for 10 more minutes.',
      'Cover the dough with plastic wrap and rest for 1-3 hours.',
      'Divide the dough into portions.',
      'Shape into balls, sealing the seam.',
      'Put the dough in a lightly oiled container.',
      'Cover tightly and refrigerate for 2–4 days. 3 days is ideal.',
      'Let the dough come to room temperature before using.',
    ],
  },
  glutenFree: {
    title: 'Gluten-Free Dough Method',
    steps: [
      'Combine cold water and yeast in the bowl first.',
      'Add the gluten-free flour blend and olive oil, then mix briefly.',
      'Add sugar and salt while mixing on low speed.',
      'Continue mixing until the dough is fully combined and smooth.',
      'Chill the bowl for a short rest to help the dough firm up.',
      'Lightly oil your hands before handling the dough.',
      'Portion the dough and shape it into rough balls.',
      'Move the dough balls into lightly oiled containers.',
      'Cover and refrigerate for up to 48 hours.',
      'For same-day dough, leave it out a few hours before baking.',
      'Keep the dough covered while it comes to room temperature before shaping.',
    ],
  },
  sourdough: {
    title: 'Sourdough Pizza Dough Method',
    steps: [
      'Feed your starter in advance and use it when it is active and close to peak rise.',
      'Mix the flour and water until no dry spots remain, then rest the dough briefly.',
      'Add the sourdough starter, salt, and olive oil and mix until evenly combined.',
      'Knead or fold until the dough smooths out and starts to hold tension.',
      'Cover and let the dough bulk ferment until it shows noticeable aeration.',
      'Divide into portions and shape into tight dough balls.',
      'Move the dough balls into lightly oiled containers and cover tightly.',
      'Cold ferment for 24-72 hours for deeper flavor and better extensibility.',
      'Let the dough warm up at room temperature before stretching.',
      'Handle gently to preserve the gas structure before topping and baking.',
    ],
  },
}

export const DEFAULT_INPUT = {
  recipeType: 'regular' as RecipeType,
  pizzaSize: 16,
  pizzaCount: 6,
  thickness: 'regular' as ThicknessKey,
}

export function createDefaultToppingSelection(): ToppingSelection {
  return Object.fromEntries(
    TOPPING_CONFIG.map((topping) => [
      topping.id,
      {
        enabled: false,
        quantity: topping.defaultQuantity,
      },
    ]),
  )
}

export function getThicknessOption(thickness: ThicknessKey): ThicknessOption {
  return (
    THICKNESS_OPTIONS.find((option) => option.key === thickness) ??
    THICKNESS_OPTIONS[1]
  )
}

export function getDefaultSlicesForSize(pizzaSize: number): number {
  return (
    SLICE_DEFAULTS.find(
      (sliceRange) => pizzaSize >= sliceRange.min && pizzaSize <= sliceRange.max,
    )?.slices ?? 8
  )
}

export function getScaledToppingGrams(
  topping: ToppingConfig,
  pizzaSize: number,
): number {
  const areaScaleFactor = (pizzaSize / TOPPING_REFERENCE_PIZZA_SIZE) ** 2

  return Math.max(1, Math.round(topping.referenceGrams * areaScaleFactor))
}

export const CALORIE_SOURCE_REFERENCE = [
  {
    name: 'Bread Flour',
    source: CALORIE_SOURCES.flour,
  },
  {
    name: 'Water',
    source: CALORIE_SOURCES.water,
  },
  {
    name: 'Sourdough Starter',
    source: CALORIE_SOURCES.starter,
  },
  {
    name: 'Yeast',
    source: CALORIE_SOURCES.yeast,
  },
  {
    name: 'Salt',
    source: CALORIE_SOURCES.salt,
  },
  {
    name: 'Sugar',
    source: CALORIE_SOURCES.sugar,
  },
  {
    name: 'Olive Oil',
    source: CALORIE_SOURCES.oliveOil,
  },
  ...TOPPING_CONFIG.map((topping) => ({
    name: topping.name,
    source: topping.source,
  })),
]
