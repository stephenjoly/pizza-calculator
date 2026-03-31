import { useEffect, useState } from 'react'
import { IngredientTable, CalorieTable } from './components/IngredientTable'
import { InstructionsPanel } from './components/InstructionsPanel'
import { RangeField } from './components/RangeField'
import { SegmentedBar } from './components/SegmentedBar'
import {
  CALORIE_SOURCE_REFERENCE,
  CATEGORY_LABELS,
  DEFAULT_INPUT,
  INSTRUCTION_COPY,
  RECIPE_CONFIG,
  RECIPE_OPTIONS,
  TOPPING_CONFIG,
  createDefaultToppingSelection,
  getDefaultSlicesForSize,
  getScaledToppingGrams,
  getThicknessOption,
} from './config/calculator'
import { calculateCalories } from './lib/calories'
import { calculateDough } from './lib/dough'
import { formatCalories, formatGrams } from './lib/format'
import type { CalculatorInput, RecipeType, ThicknessKey } from './types'

type Page = 'calculator' | 'sources'

const APP_BASE_PATH = import.meta.env.BASE_URL

function getPageFromLocation(location: Location): Page {
  const hashPage = location.hash.replace(/^#\/?/, '')

  if (hashPage === 'sources') {
    return 'sources'
  }

  const pathname = location.pathname.replace(/\/+$/, '') || '/'

  return pathname.endsWith('/sources') ? 'sources' : 'calculator'
}

function getPageUrl(page: Page): string {
  return page === 'sources' ? `${APP_BASE_PATH}#sources` : APP_BASE_PATH
}

function App() {
  const [page, setPage] = useState<Page>(() =>
    getPageFromLocation(window.location),
  )
  const [recipeType, setRecipeType] = useState<RecipeType>(DEFAULT_INPUT.recipeType)
  const [pizzaSize, setPizzaSize] = useState(DEFAULT_INPUT.pizzaSize)
  const [pizzaCount, setPizzaCount] = useState(DEFAULT_INPUT.pizzaCount)
  const [thickness, setThickness] = useState<ThicknessKey>(DEFAULT_INPUT.thickness)
  const [slicesPerPizza, setSlicesPerPizza] = useState(() =>
    getDefaultSlicesForSize(DEFAULT_INPUT.pizzaSize),
  )
  const [showInstructions, setShowInstructions] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState(
    createDefaultToppingSelection,
  )

  useEffect(() => {
    function handleLocationChange() {
      setPage(getPageFromLocation(window.location))
    }

    window.addEventListener('hashchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  useEffect(() => {
    document.title =
      page === 'sources' ? 'Calorie Sources | Dough Guy Calculator' : 'Dough Guy Calculator'
  }, [page])

  useEffect(() => {
    setSlicesPerPizza(getDefaultSlicesForSize(pizzaSize))
  }, [pizzaSize])

  const input: CalculatorInput = {
    recipeType,
    pizzaSize,
    pizzaCount,
    thickness,
    selectedToppings,
  }

  const doughResult = calculateDough(input)
  const calorieResult = calculateCalories({
    doughResult,
    pizzaCount,
    selectedToppings,
    slicesPerPizza,
  })
  const enabledToppings = TOPPING_CONFIG.filter(
    (topping) => selectedToppings[topping.id]?.enabled,
  )
  const allCalorieItems = [
    ...calorieResult.doughCalories,
    ...calorieResult.toppingCalories,
  ]
  const instructions = INSTRUCTION_COPY[recipeType]
  const thicknessOption = getThicknessOption(thickness)
  const selectedRecipe = RECIPE_CONFIG[recipeType]

  function navigateTo(nextPage: Page) {
    const nextUrl = getPageUrl(nextPage)

    if (`${window.location.pathname}${window.location.hash}` !== nextUrl) {
      window.history.pushState({}, '', nextUrl)
    }

    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleTopping(toppingId: string) {
    setSelectedToppings((current) => ({
      ...current,
      [toppingId]: {
        ...current[toppingId],
        enabled: !current[toppingId].enabled,
      },
    }))
  }

  function updateToppingQuantity(toppingId: string, quantity: number) {
    const safeQuantity = Number.isFinite(quantity)
      ? Math.max(1, Math.min(12, Math.round(quantity)))
      : 1

    setSelectedToppings((current) => ({
      ...current,
      [toppingId]: {
        ...current[toppingId],
        quantity: safeQuantity,
      },
    }))
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffe470_0%,_#f3d22a_44%,_#efc914_100%)]">
      <nav className="border-b border-stone-900/10 bg-[#fff6cf]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[74rem] items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
          <button
            className="text-left"
            onClick={() => navigateTo('calculator')}
            type="button"
          >
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-amber-900">
              Pizza Dough + Calories
            </p>
            <h1 className="font-display text-[0.98rem] font-bold uppercase tracking-tight text-stone-950 sm:text-[1.35rem]">
              Dough Guy Calculator
            </h1>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-current={page === 'calculator' ? 'page' : undefined}
                className={`rounded-full px-3 py-1.5 text-[0.84rem] font-semibold transition ${
                page === 'calculator'
                  ? 'border border-orange-700 bg-orange-500 text-white'
                  : 'border border-stone-300 bg-white/90 text-stone-700 hover:border-stone-950 hover:text-stone-950'
              }`}
              onClick={() => navigateTo('calculator')}
              type="button"
            >
              Calculator
            </button>
            <button
              aria-current={page === 'sources' ? 'page' : undefined}
                className={`rounded-full px-3 py-1.5 text-[0.84rem] font-semibold transition ${
                page === 'sources'
                  ? 'border border-orange-700 bg-orange-500 text-white'
                  : 'border border-stone-300 bg-white/90 text-stone-700 hover:border-stone-950 hover:text-stone-950'
              }`}
              onClick={() => navigateTo('sources')}
              type="button"
            >
              Sources
            </button>
          </div>
        </div>
      </nav>

      {page === 'sources' ? (
        <section className="px-4 py-4 sm:px-5 lg:px-6">
          <div className="mx-auto max-w-[60rem] rounded-[1.5rem] border border-stone-900/15 bg-[#fff9df] p-4 shadow-[0_10px_0_0_rgba(120,53,15,0.1)] sm:p-5">
            <header className="border-b border-stone-200/80 pb-4">
              <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-amber-900">
                USDA References
              </p>
              <h2 className="mt-3 font-display text-lg font-bold tracking-tight text-stone-950 sm:text-[1.55rem]">
                Calorie Sources
              </h2>
              <p className="mt-3 max-w-3xl text-[0.92rem] leading-6 text-stone-700">
                The default calorie values in this app are meant to be inspectable.
                Each ingredient points to a USDA FoodData Central record or a USDA
                search term for the generic food.
              </p>
            </header>

            <div className="mt-5 space-y-3">
              {CALORIE_SOURCE_REFERENCE.map((entry) => (
                <article
                  className="rounded-[1.2rem] border border-stone-200 bg-white px-4 py-3.5 shadow-[inset_0_0_0_1px_rgba(214,211,209,0.9)]"
                  key={`${entry.name}-${entry.source.url}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-3xl">
                      <h3 className="text-[0.95rem] font-bold text-stone-900">
                        {entry.name}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {entry.source.notes}
                      </p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
                        {entry.source.label}
                      </p>
                    </div>
                    <a
                      className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-[0.84rem] font-semibold text-amber-900 transition hover:bg-amber-200"
                      href={entry.source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open source
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-4 sm:px-5 lg:px-6">
          <div className="mx-auto flex max-w-[74rem] flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
            <div className="w-full max-w-[45rem]">
              <section className="rounded-[1.5rem] border border-stone-900/15 bg-[#fff9df] p-4 shadow-[0_10px_0_0_rgba(120,53,15,0.1)] sm:p-5">
                <header className="flex flex-col gap-4 border-b border-stone-200/80 pb-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-amber-900">
                        Dough Builder
                      </p>
                      <p className="mt-2.5 max-w-[36rem] text-[0.88rem] leading-6 text-stone-700">
                        Build the dough first, then add toppings underneath. The
                        calorie panel stays separate so the recipe controls remain
                        easy to scan.
                      </p>
                    </div>

                    <div className="w-full rounded-[1rem] border border-stone-900 bg-white px-3.5 py-2.5 shadow-[4px_4px_0_0_rgba(68,64,60,0.16)] lg:max-w-[17rem]">
                      <label
                        className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone-500"
                        htmlFor="recipe-type"
                      >
                        Dough Recipe
                      </label>
                      <p className="mt-1 text-[0.8rem] leading-5 text-stone-500">
                        {selectedRecipe.description}
                      </p>
                      <select
                        className="mt-3 w-full rounded-xl border border-stone-300 bg-[#fffef8] px-3 py-2 text-sm font-medium text-stone-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                        id="recipe-type"
                        onChange={(event) =>
                          setRecipeType(event.target.value as RecipeType)
                        }
                        value={recipeType}
                      >
                        {RECIPE_OPTIONS.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                      <div className="rounded-[1rem] bg-[#fffef8] p-3 shadow-[inset_0_0_0_1px_rgba(214,211,209,0.9)]">
                        <RangeField
                          id="pizza-size"
                          label="Pizza Size (inches)"
                          max={20}
                          min={10}
                          onChange={setPizzaSize}
                          value={pizzaSize}
                        />
                      </div>
                      <div className="rounded-[1rem] bg-[#fffef8] p-3 shadow-[inset_0_0_0_1px_rgba(214,211,209,0.9)]">
                        <RangeField
                          id="pizza-count"
                          label="Number of Pizzas"
                          max={10}
                          min={1}
                          onChange={setPizzaCount}
                          value={pizzaCount}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                      <div className="rounded-[1rem] bg-white p-3 shadow-[inset_0_0_0_1px_rgba(214,211,209,0.9)]">
                        <label
                          className="text-[0.9rem] font-semibold tracking-tight text-stone-900 sm:text-[0.96rem]"
                          htmlFor="pizza-thickness"
                        >
                          Pizza Thickness
                        </label>
                        <p className="mt-1 text-[0.8rem] leading-5 text-stone-500">
                          {thicknessOption.description}
                        </p>
                        <select
                          className="mt-3 w-full rounded-xl border border-stone-300 bg-[#fffef8] px-3 py-2 text-sm font-medium text-stone-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-200"
                          id="pizza-thickness"
                          onChange={(event) =>
                            setThickness(event.target.value as ThicknessKey)
                          }
                          value={thickness}
                        >
                          {['thin', 'regular', 'thick'].map((key) => {
                            const option = getThicknessOption(key as ThicknessKey)

                            return (
                              <option key={option.key} value={option.key}>
                                {option.label}
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      <div className="rounded-[1rem] bg-white p-3 shadow-[inset_0_0_0_1px_rgba(214,211,209,0.9)]">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <label
                              className="text-[0.9rem] font-semibold tracking-tight text-stone-900 sm:text-[0.96rem]"
                              htmlFor="slice-count"
                            >
                              Slices per Pizza
                            </label>
                            <p className="mt-1 text-[0.8rem] leading-5 text-stone-500">
                              Override the default slice count for calorie-per-slice.
                            </p>
                          </div>
                        </div>
                        <RangeField
                          id="slice-count"
                          label="Slices per Pizza"
                          hideLabel
                          max={12}
                          min={4}
                          onChange={setSlicesPerPizza}
                          value={slicesPerPizza}
                        />
                      </div>
                    </div>
                  </div>
                </header>

                <section className="mt-4 space-y-4" id="recipe-panel">
                  <article className="rounded-[1.15rem] border border-stone-900 bg-white px-3.5 py-3.5 shadow-[4px_4px_0_0_rgba(68,64,60,0.15)] sm:px-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-[0.98rem] font-bold tracking-tight text-stone-950 sm:text-[1.35rem]">
                          Dough Results
                        </h2>
                        <p className="mt-1 text-[0.84rem] text-stone-500">
                          Main recipe panel for dough ball size and ingredient
                          weights.
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-100 px-3 py-1.5 text-right shadow-[inset_0_0_0_1px_rgba(251,191,36,0.4)]">
                        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-amber-900">
                          Dough Ball Size
                        </div>
                        <div className="mt-1 text-[1.2rem] font-bold text-stone-950">
                          {formatGrams(doughResult.doughBallSize)} g
                        </div>
                      </div>
                    </div>

                    <dl className="mt-4 flex flex-wrap gap-2">
                      <div className="min-w-[8rem] flex-1 rounded-[0.95rem] bg-stone-50 px-3 py-2.5">
                        <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Pizza Size
                        </dt>
                        <dd className="mt-1 text-[1.15rem] font-bold text-stone-900">
                          {pizzaSize} inches
                        </dd>
                      </div>
                      <div className="min-w-[8rem] flex-1 rounded-[0.95rem] bg-stone-50 px-3 py-2.5">
                        <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Number of Pizzas
                        </dt>
                        <dd className="mt-1 text-[1.15rem] font-bold text-stone-900">
                          {pizzaCount}
                        </dd>
                      </div>
                      <div className="min-w-[8rem] flex-1 rounded-[0.95rem] bg-stone-50 px-3 py-2.5">
                        <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Recipe Type
                        </dt>
                        <dd className="mt-1 text-[1.15rem] font-bold text-stone-900">
                          {doughResult.recipeLabel}
                        </dd>
                      </div>
                      <div className="min-w-[8rem] flex-1 rounded-[0.95rem] bg-stone-50 px-3 py-2.5">
                        <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
                          Thickness
                        </dt>
                        <dd className="mt-1 text-[1.15rem] font-bold text-stone-900">
                          {doughResult.thicknessLabel}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4">
                      <IngredientTable ingredients={doughResult.ingredients} />
                    </div>
                  </article>

                  <section className="rounded-[1.15rem] border border-stone-900 bg-white px-3.5 py-3.5 shadow-[4px_4px_0_0_rgba(68,64,60,0.15)] sm:px-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h2 className="font-display text-[0.98rem] font-bold tracking-tight text-stone-950 sm:text-[1.35rem]">
                          Optional Toppings
                        </h2>
                        <p className="mt-1 max-w-2xl text-[0.84rem] leading-6 text-stone-500">
                          Add toppings beneath the dough recipe. The side panel
                          updates immediately.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm font-medium text-stone-600">
                        {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>)
                          .filter((category) => category !== 'dough')
                          .map((category) => (
                            <span
                              className="rounded-full bg-stone-100 px-3 py-1"
                              key={category}
                            >
                              {CATEGORY_LABELS[category]}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      {TOPPING_CONFIG.map((topping) => {
                        const selection = selectedToppings[topping.id]
                        const servingGrams = getScaledToppingGrams(topping, pizzaSize)
                        const caloriesPerServing =
                          servingGrams * topping.caloriesPerGram

                        return (
                          <div
                            className="rounded-[0.95rem] border border-stone-200 bg-[#fffef8] p-2.5 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.08)]"
                            key={topping.id}
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <label className="flex items-start gap-3" htmlFor={topping.id}>
                                <input
                                  checked={selection.enabled}
                                  className="mt-1 h-5 w-5 rounded border-stone-400 text-orange-500 focus:ring-orange-400"
                                  id={topping.id}
                                  onChange={() => toggleTopping(topping.id)}
                                  type="checkbox"
                                />
                                <div>
                                  <div className="text-[0.9rem] font-bold text-stone-900">
                                    {topping.name}
                                  </div>
                                  <div className="text-sm text-stone-500">
                                    {CATEGORY_LABELS[topping.category]}
                                  </div>
                                </div>
                              </label>

                              <div className="flex flex-col gap-3 text-sm text-stone-600 sm:flex-row">
                                <div className="rounded-xl bg-stone-50 px-3 py-2">
                                  Serving size: {formatGrams(servingGrams)} g
                                </div>
                                <div className="rounded-xl bg-stone-50 px-3 py-2">
                                  Calories per serving:{' '}
                                  {formatCalories(caloriesPerServing)}
                                </div>
                                <label className="block min-w-[11rem]" htmlFor={`${topping.id}-quantity`}>
                                  <span className="mb-2 block font-medium text-stone-700">
                                    Servings per pizza
                                  </span>
                                  <input
                                    aria-label={`${topping.name} servings per pizza`}
                                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-base font-medium text-stone-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
                                    disabled={!selection.enabled}
                                    id={`${topping.id}-quantity`}
                                    min={1}
                                    onChange={(event) =>
                                      updateToppingQuantity(
                                        topping.id,
                                        Number(event.target.value),
                                      )
                                    }
                                    type="number"
                                    value={selection.quantity}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <p className="mt-5 text-sm leading-6 text-stone-500">
                      Serving sizes scale by pizza area from a 16-inch reference
                      pie, so smaller pizzas use lighter topping amounts and
                      larger pies scale up automatically.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      Source references live on a separate page in the top
                      navigation instead of inside the calculator.
                    </p>
                  </section>

                  <section>
                    <button
                      aria-controls="instructions-panel"
                      aria-expanded={showInstructions}
                      className="rounded-2xl border border-orange-700 bg-orange-500 px-4 py-2 text-[0.88rem] font-bold text-white shadow-[4px_4px_0_0_rgba(120,53,15,0.18)] transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
                      onClick={() => setShowInstructions((current) => !current)}
                      type="button"
                    >
                      {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                    </button>

                    {showInstructions ? (
                      <div className="mt-5" id="instructions-panel">
                        <InstructionsPanel
                          steps={instructions.steps}
                          title={instructions.title}
                        />
                      </div>
                    ) : null}
                  </section>
                </section>
              </section>
            </div>

            <aside className="w-full lg:w-[14.5rem] xl:w-[15rem]">
              <article className="rounded-[1.15rem] border border-stone-900 bg-white px-3.5 py-3.5 shadow-[4px_4px_0_0_rgba(68,64,60,0.15)] sm:px-4 lg:sticky lg:top-[4.5rem]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-[0.98rem] font-bold tracking-tight text-stone-950 sm:text-[1.3rem]">
                      Calories
                    </h2>
                    <p className="mt-1 text-[0.82rem] text-stone-500">
                      Side panel for batch, per-pizza, and topping totals.
                    </p>
                  </div>
                  <div className="rounded-xl bg-lime-100 px-3 py-2 text-right shadow-[inset_0_0_0_1px_rgba(132,204,22,0.35)]">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-lime-900">
                      Batch Total
                    </div>
                    <div className="mt-1 text-[1.15rem] font-bold text-stone-950">
                      {formatCalories(calorieResult.totalCaloriesBatch)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="rounded-[0.95rem] bg-stone-50 px-3 py-2.5">
                    <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Calories per Pizza
                    </div>
                    <div className="mt-1 text-[1.15rem] font-bold text-stone-900">
                      {formatCalories(calorieResult.caloriesPerPizza)}
                    </div>
                  </div>
                  <div className="rounded-[0.95rem] bg-stone-50 px-3 py-2.5">
                    <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
                      Calories per Slice
                    </div>
                    <div className="mt-1 text-[1.15rem] font-bold text-stone-900">
                      {formatCalories(calorieResult.caloriesPerSlice)}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[0.98rem] font-semibold text-stone-900">
                      By category
                    </h3>
                    <span className="text-[0.82rem] text-stone-500">
                      {slicesPerPizza} slices
                    </span>
                  </div>
                  <SegmentedBar totals={calorieResult.categoryTotals} />
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[0.98rem] font-semibold text-stone-900">
                      Calories per ingredient
                    </h3>
                    <span className="text-[0.82rem] text-stone-500">
                      {enabledToppings.length} topping
                      {enabledToppings.length === 1 ? '' : 's'} enabled
                    </span>
                  </div>
                  <CalorieTable items={allCalorieItems} />
                </div>
              </article>
            </aside>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
