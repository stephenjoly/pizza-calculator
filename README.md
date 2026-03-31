# Pizza Dough + Calorie Calculator

This project exists to answer a practical question that a lot of home pizza makers run into: "How much dough do I need for the pizzas I want to make, and what does that recipe actually add up to once I start topping it?"

The calculator combines dough sizing with calorie estimates in one place. Instead of bouncing between a dough calculator, ingredient notes, and nutrition lookups, you can set your pizza size, dough style, batch count, and toppings and see the numbers immediately.

## Why This Exists

- Dough calculators are useful, but they usually stop at dough weight.
- Nutrition calculators are useful, but they usually do not think in pizzas, dough balls, or servings per pie.
- This app bridges both so you can plan a pizza night, prep a batch, or compare recipes without spreadsheet work.

## What You Can Do With It

- Choose a dough style such as classic, sourdough, or gluten free.
- Set pizza diameter, batch size, and thickness.
- See scaled dough ingredient weights for the full batch.
- Add toppings and adjust servings per pizza.
- See calorie totals for dough, toppings, and per-slice estimates.
- Open the built-in sources view to inspect the USDA calorie references used by default.

## How To Use The Calculator

1. Pick the dough recipe that matches what you want to make.
2. Set the pizza size and number of pizzas.
3. Adjust thickness to match the style you are aiming for.
4. Review the dough ingredient weights for your batch.
5. Turn toppings on only for what you plan to use.
6. Adjust topping servings per pizza if your usual style is lighter or heavier.
7. Use the calorie panel to compare totals and estimate calories per slice.

## What The Numbers Mean

- Dough weights are scaled from recipe configuration in [src/config/calculator.ts](src/config/calculator.ts).
- Water and salt are treated as zero-calorie ingredients.
- Topping servings are per pizza, then multiplied across the batch.
- Per-slice calories depend on the current pizza count, selected toppings, and slice count.
- Default calorie references are meant to be inspectable, not hidden. The Sources page links to USDA FoodData Central records or USDA search pages.

## Use It Online

This app can be published as a static site on GitHub Pages. The Pages build is configured separately so the existing server deployment path still works.

If GitHub Pages is enabled for this repository, the published site will be available at:

`https://stephenjoly.github.io/pizza-calculator/`

## Run It Locally

```bash
npm install
npm run dev
```

## Test And Build

```bash
npm run test
npm run build
```

For a GitHub Pages-style production build with the repository base path:

```bash
VITE_BASE_PATH=/pizza-calculator/ npm run build
```

## Deployments

- GitHub Pages: `.github/workflows/deploy-pages.yml`
- Existing server deploy: `deploy-wizard` and `.github/workflows/deploy-staging.yml`

The Pages deployment does not replace your server deployment. It adds a second static hosting target.

## Customize It

Most of the product behavior lives in [src/config/calculator.ts](src/config/calculator.ts). That file controls:

- Dough formulas and baker's percentages
- Thickness presets
- Ingredient calorie values
- Topping defaults and calorie data
- Slice defaults
- Instruction copy
- Source metadata and outbound links

Core implementation files:

- [src/App.tsx](src/App.tsx): calculator UI and page navigation
- [src/lib/dough.ts](src/lib/dough.ts): dough scaling logic
- [src/lib/calories.ts](src/lib/calories.ts): calorie calculations
- [src/lib/dough.test.ts](src/lib/dough.test.ts): dough behavior checks
