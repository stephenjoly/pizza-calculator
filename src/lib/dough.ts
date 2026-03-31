import {
  DOUGH_INGREDIENT_CONFIG,
  RECIPE_CONFIG,
  getThicknessOption,
} from '../config/calculator'
import type {
  CalculatorInput,
  DoughCalculationResult,
  DoughIngredientResult,
  DoughIngredientKey,
} from '../types'

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(digits))
}

function buildIngredient(
  key: DoughIngredientKey,
  name: string,
  grams: number,
): DoughIngredientResult {
  return {
    key,
    name,
    grams,
    caloriesPerGram: DOUGH_INGREDIENT_CONFIG[key].caloriesPerGram,
    category: DOUGH_INGREDIENT_CONFIG[key].category,
  }
}

function appendIngredient(
  ingredients: DoughIngredientResult[],
  key: DoughIngredientKey,
  name: string,
  grams: number,
) {
  if (grams <= 0) {
    return
  }

  ingredients.push(buildIngredient(key, name, grams))
}

export function calculateDough(input: CalculatorInput): DoughCalculationResult {
  const recipe = RECIPE_CONFIG[input.recipeType]
  const thickness = getThicknessOption(input.thickness)

  const sizeScaleFactor = (input.pizzaSize / recipe.basePizzaSize) ** 2
  const quantityScaleFactor = input.pizzaCount / recipe.baseQuantity
  const thicknessScaleFactor = thickness.value / recipe.baseThickness

  const flourAmountRaw =
    recipe.baseFlourAmount *
    sizeScaleFactor *
    quantityScaleFactor *
    thicknessScaleFactor

  const starterHydrationPct = recipe.starterHydrationPct ?? 1
  const starter = roundTo(flourAmountRaw * (recipe.starterPct ?? 0), 1)
  const starterFlourContribution = starter / (1 + starterHydrationPct)
  const starterWaterContribution = starter - starterFlourContribution
  const directFlourAmount = Math.round(flourAmountRaw - starterFlourContribution)
  const water = Math.round(flourAmountRaw * recipe.waterPct - starterWaterContribution)
  const yeast = roundTo(flourAmountRaw * recipe.yeastPct, 1)
  const salt = Math.round(flourAmountRaw * recipe.saltPct)
  const sugar = Math.round(flourAmountRaw * recipe.sugarPct)
  const oliveOil = Math.round(flourAmountRaw * recipe.oilPct)

  const totalDoughWeight = flourAmountRaw * recipe.doughFactor
  const doughBallSize = Math.round(totalDoughWeight / input.pizzaCount)
  const ingredients: DoughIngredientResult[] = []

  appendIngredient(ingredients, 'flour', recipe.flourName, directFlourAmount)
  appendIngredient(ingredients, 'water', 'Water', water)
  appendIngredient(ingredients, 'starter', 'Sourdough Starter', starter)
  appendIngredient(ingredients, 'yeast', 'Yeast', yeast)
  appendIngredient(ingredients, 'salt', 'Salt', salt)
  appendIngredient(ingredients, 'sugar', 'Sugar', sugar)
  appendIngredient(ingredients, 'oliveOil', 'Olive Oil', oliveOil)

  return {
    recipeType: input.recipeType,
    recipeLabel: recipe.label,
    pizzaSize: input.pizzaSize,
    pizzaCount: input.pizzaCount,
    thickness: input.thickness,
    thicknessLabel: thickness.label,
    doughBallSize,
    ingredients,
  }
}
