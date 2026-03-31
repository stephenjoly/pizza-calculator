import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('updates dough numbers immediately when the sliders and recipe selection change', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(/Main recipe panel for dough ball size/i)).toBeInTheDocument()
    expect(screen.getByText('1,705')).toBeInTheDocument()

    fireEvent.input(screen.getByLabelText(/Pizza Size \(inches\)/i), {
      target: { value: '10' },
    })
    fireEvent.input(screen.getByLabelText(/Number of Pizzas/i), {
      target: { value: '1' },
    })

    expect(screen.getByText('187 g')).toBeInTheDocument()
    expect(screen.getByText('111')).toBeInTheDocument()

    await user.selectOptions(
      screen.getByRole('combobox', { name: /dough recipe/i }),
      'glutenFree',
    )

    expect(screen.getByText('220 g')).toBeInTheDocument()
    expect(screen.getByText('130')).toBeInTheDocument()
    expect(screen.getAllByText(/Gluten Free/i).length).toBeGreaterThan(0)
  })

  it('expands instructions and swaps to sourdough guidance', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByText(/Dough Making Instructions/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show instructions/i }))
    expect(screen.getByText(/Dough Making Instructions/i)).toBeInTheDocument()

    await user.selectOptions(
      screen.getByRole('combobox', { name: /dough recipe/i }),
      'sourdough',
    )
    expect(screen.getByText(/Sourdough Pizza Dough Method/i)).toBeInTheDocument()
  })

  it('scales topping serving sizes with pizza size', () => {
    render(<App />)

    expect(screen.getByText(/Serving size: 130 g/i)).toBeInTheDocument()

    fireEvent.input(screen.getByLabelText(/Pizza Size \(inches\)/i), {
      target: { value: '10' },
    })

    expect(screen.getByText(/Serving size: 51 g/i)).toBeInTheDocument()
  })

  it('enables toppings and updates the calorie panel', async () => {
    const user = userEvent.setup()
    render(<App />)

    const caloriePanel = screen
      .getByRole('heading', { name: /^Calories$/i })
      .closest('article')

    expect(caloriePanel).not.toBeNull()
    expect(within(caloriePanel!).getAllByText('6,803').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('checkbox', { name: /mozzarella/i }))

    const mozzarellaQuantity = screen.getByLabelText(/Mozzarella servings per pizza/i)
    fireEvent.change(mozzarellaQuantity, { target: { value: '2' } })

    expect(within(caloriePanel!).getAllByText('11,405').length).toBeGreaterThan(0)
    expect(within(caloriePanel!).getByText(/^Mozzarella$/i)).toBeInTheDocument()
  })

  it('supports hash-based navigation for static hosting', async () => {
    const user = userEvent.setup()
    const originalUrl = `${window.location.pathname}${window.location.hash}`

    window.history.replaceState({}, '', '/#sources')

    render(<App />)

    expect(
      screen.getByRole('heading', { name: /calorie sources/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^calculator$/i }))

    expect(window.location.hash).toBe('')
    expect(
      screen.getByText(/Main recipe panel for dough ball size/i),
    ).toBeInTheDocument()

    window.history.replaceState({}, '', originalUrl || '/')
  })
})
