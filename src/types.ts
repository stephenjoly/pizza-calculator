export type RecipeType = 'regular' | 'glutenFree' | 'sourdough'

export type ThicknessKey = 'thin' | 'regular' | 'thick'

export type IngredientCategory = 'dough' | 'sauce' | 'cheese' | 'topping'

export type DoughIngredientKey =
  | 'flour'
  | 'water'
  | 'starter'
  | 'yeast'
  | 'salt'
  | 'sugar'
  | 'oliveOil'

export type ToppingSelectionState = {
  enabled: boolean
  quantity: number
}

export type ToppingSelection = Record<string, ToppingSelectionState>

export type CalculatorInput = {
  recipeType: RecipeType
  pizzaSize: number
  pizzaCount: number
  thickness: ThicknessKey
  selectedToppings: ToppingSelection
}

export type IngredientConfig = {
  name: string
  caloriesPerGram: number
  category: IngredientCategory
  source: CalorieSource
}

export type CalorieSource = {
  label: string
  url: string
  notes: string
}

export type RecipeFormulaConfig = {
  label: string
  description: string
  flourName: string
  basePizzaSize: number
  baseQuantity: number
  baseThickness: number
  baseFlourAmount: number
  starterPct?: number
  starterHydrationPct?: number
  waterPct: number
  yeastPct: number
  saltPct: number
  sugarPct: number
  oilPct: number
  doughFactor: number
}

export type RecipeOption = {
  key: RecipeType
  label: string
  description: string
}

export type ThicknessOption = {
  key: ThicknessKey
  label: string
  value: number
  description: string
}

export type ToppingConfig = {
  id: string
  name: string
  category: Exclude<IngredientCategory, 'dough'>
  referenceGrams: number
  caloriesPerGram: number
  defaultQuantity: number
  source: CalorieSource
}

export type DoughIngredientResult = {
  key: DoughIngredientKey
  name: string
  grams: number
  caloriesPerGram: number
  category: IngredientCategory
}

export type DoughCalculationResult = {
  recipeType: RecipeType
  recipeLabel: string
  pizzaSize: number
  pizzaCount: number
  thickness: ThicknessKey
  thicknessLabel: string
  doughBallSize: number
  ingredients: DoughIngredientResult[]
}

export type CalorieLineItem = {
  id: string
  name: string
  category: IngredientCategory
  grams: number
  quantity?: number
  calories: number
}

export type CalorieCalculationResult = {
  doughCalories: CalorieLineItem[]
  toppingCalories: CalorieLineItem[]
  categoryTotals: Record<IngredientCategory, number>
  totalCaloriesBatch: number
  caloriesPerPizza: number
  caloriesPerSlice: number
}
