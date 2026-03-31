import {
  TOPPING_CONFIG,
  getDefaultSlicesForSize,
  getScaledToppingGrams,
} from '../config/calculator'
import type {
  CalorieCalculationResult,
  CalorieLineItem,
  DoughCalculationResult,
  IngredientCategory,
  ToppingSelection,
} from '../types'

type CalorieInput = {
  doughResult: DoughCalculationResult
  pizzaCount: number
  slicesPerPizza?: number
  selectedToppings: ToppingSelection
}

function createCategoryTotals(): Record<IngredientCategory, number> {
  return {
    dough: 0,
    sauce: 0,
    cheese: 0,
    topping: 0,
  }
}

export function calculateCalories({
  doughResult,
  pizzaCount,
  slicesPerPizza = getDefaultSlicesForSize(doughResult.pizzaSize),
  selectedToppings,
}: CalorieInput): CalorieCalculationResult {
  const doughCalories: CalorieLineItem[] = doughResult.ingredients.map(
    (ingredient) => ({
      id: ingredient.key,
      name: ingredient.name,
      category: ingredient.category,
      grams: ingredient.grams,
      calories: ingredient.grams * ingredient.caloriesPerGram,
    }),
  )

  const toppingCalories: CalorieLineItem[] = TOPPING_CONFIG.flatMap((topping) => {
    const selection = selectedToppings[topping.id]

    if (!selection?.enabled) {
      return []
    }

    const quantity = Math.max(1, selection.quantity)
    const gramsPerPizza = getScaledToppingGrams(topping, doughResult.pizzaSize)
    const grams = gramsPerPizza * quantity * pizzaCount

    return [
      {
        id: topping.id,
        name: topping.name,
        category: topping.category,
        grams,
        quantity,
        calories: grams * topping.caloriesPerGram,
      },
    ]
  })

  const categoryTotals = createCategoryTotals()

  for (const item of [...doughCalories, ...toppingCalories]) {
    categoryTotals[item.category] += item.calories
  }

  const totalCaloriesBatch = Object.values(categoryTotals).reduce(
    (sum, value) => sum + value,
    0,
  )

  return {
    doughCalories,
    toppingCalories,
    categoryTotals,
    totalCaloriesBatch,
    caloriesPerPizza: totalCaloriesBatch / pizzaCount,
    caloriesPerSlice: totalCaloriesBatch / (pizzaCount * slicesPerPizza),
  }
}
