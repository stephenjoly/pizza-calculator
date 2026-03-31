import { describe, expect, it } from 'vitest'
import { createDefaultToppingSelection } from '../config/calculator'
import { calculateCalories } from './calories'
import { calculateDough } from './dough'

describe('calculateCalories', () => {
  it('keeps water and salt at zero calories', () => {
    const doughResult = calculateDough({
      recipeType: 'regular',
      pizzaSize: 16,
      pizzaCount: 6,
      thickness: 'regular',
      selectedToppings: createDefaultToppingSelection(),
    })

    const result = calculateCalories({
      doughResult,
      pizzaCount: 6,
      selectedToppings: createDefaultToppingSelection(),
    })

    expect(result.doughCalories.find((item) => item.name === 'Water')?.calories).toBe(0)
    expect(result.doughCalories.find((item) => item.name === 'Salt')?.calories).toBe(0)
  })

  it('adds toppings linearly by quantity and pizza count', () => {
    const selectedToppings = createDefaultToppingSelection()
    selectedToppings.pepperoni = { enabled: true, quantity: 2 }

    const doughResult = calculateDough({
      recipeType: 'regular',
      pizzaSize: 10,
      pizzaCount: 3,
      thickness: 'regular',
      selectedToppings,
    })

    const result = calculateCalories({
      doughResult,
      pizzaCount: 3,
      selectedToppings,
      slicesPerPizza: 6,
    })

    const pepperoni = result.toppingCalories.find((item) => item.id === 'pepperoni')

    expect(pepperoni?.grams).toBe(96)
    expect(pepperoni?.quantity).toBe(2)
    expect(pepperoni?.calories).toBeCloseTo(445.44)
  })

  it('computes total, per-pizza, and per-slice calories consistently', () => {
    const selectedToppings = createDefaultToppingSelection()
    selectedToppings.mozzarella = { enabled: true, quantity: 1 }
    selectedToppings.sauce = { enabled: true, quantity: 1 }

    const doughResult = calculateDough({
      recipeType: 'regular',
      pizzaSize: 12,
      pizzaCount: 2,
      thickness: 'regular',
      selectedToppings,
    })

    const result = calculateCalories({
      doughResult,
      pizzaCount: 2,
      selectedToppings,
      slicesPerPizza: 6,
    })

    const categorySum = Object.values(result.categoryTotals).reduce(
      (sum, value) => sum + value,
      0,
    )

    expect(result.totalCaloriesBatch).toBeCloseTo(categorySum)
    expect(result.caloriesPerPizza).toBeCloseTo(result.totalCaloriesBatch / 2)
    expect(result.caloriesPerSlice).toBeCloseTo(result.totalCaloriesBatch / 12)
  })
})
