import { describe, expect, it } from 'vitest'
import { createDefaultToppingSelection } from '../config/calculator'
import { calculateDough } from './dough'

describe('calculateDough', () => {
  const selectedToppings = createDefaultToppingSelection()

  it('matches the regular reference output for 16 inch, 6 pizzas, regular thickness', () => {
    const result = calculateDough({
      recipeType: 'regular',
      pizzaSize: 16,
      pizzaCount: 6,
      thickness: 'regular',
      selectedToppings,
    })

    expect(result.doughBallSize).toBe(480)
    expect(result.ingredients.map((ingredient) => ingredient.grams)).toEqual([
      1705,
      1057,
      6.8,
      43,
      34,
      56,
    ])
  })

  it('matches the regular reference output for 10 inch, 1 pizza, regular thickness', () => {
    const result = calculateDough({
      recipeType: 'regular',
      pizzaSize: 10,
      pizzaCount: 1,
      thickness: 'regular',
      selectedToppings,
    })

    expect(result.doughBallSize).toBe(187)
    expect(result.ingredients.map((ingredient) => ingredient.grams)).toEqual([
      111,
      69,
      0.4,
      3,
      2,
      4,
    ])
  })

  it('matches the gluten-free reference output for 10 inch, 1 pizza, regular thickness', () => {
    const result = calculateDough({
      recipeType: 'glutenFree',
      pizzaSize: 10,
      pizzaCount: 1,
      thickness: 'regular',
      selectedToppings,
    })

    expect(result.doughBallSize).toBe(220)
    expect(result.ingredients.map((ingredient) => ingredient.grams)).toEqual([
      130,
      104,
      0.5,
      3,
      3,
      4,
    ])
  })

  it('builds the sourdough variant with starter instead of commercial yeast', () => {
    const result = calculateDough({
      recipeType: 'sourdough',
      pizzaSize: 10,
      pizzaCount: 1,
      thickness: 'regular',
      selectedToppings,
    })

    expect(result.doughBallSize).toBe(188)
    expect(result.ingredients.map((ingredient) => ingredient.name)).toEqual([
      'Bread Flour',
      'Water',
      'Sourdough Starter',
      'Salt',
      'Olive Oil',
    ])
    expect(result.ingredients.map((ingredient) => ingredient.grams)).toEqual([
      88,
      56,
      19.5,
      2,
      2,
    ])
  })
})
