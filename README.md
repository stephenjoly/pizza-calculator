# Pizza Dough + Calorie Calculator

A responsive single-page calculator built with React, TypeScript, Vite, and Tailwind CSS. It recreates the dough-sizing behavior of the Dough Guy reference calculator and adds real-time calorie tracking for dough ingredients and optional toppings.

## Run locally

```bash
npm install
npm run dev
```

## Test and build

```bash
npm run test
npm run build
```

## Editable config

Most of the product tuning lives in [src/config/calculator.ts](/Users/stephenjoly/Documents/Coding/pizza-calculator/src/config/calculator.ts):

- Dough formulas and baker's percentages
- Thickness presets
- Ingredient calorie values
- Topping defaults and calorie data
- Slice defaults
- Instruction copy
- Calorie source metadata and links

## Project structure

- [src/lib/dough.ts](/Users/stephenjoly/Documents/Coding/pizza-calculator/src/lib/dough.ts): dough scaling and dough-ball math
- [src/lib/calories.ts](/Users/stephenjoly/Documents/Coding/pizza-calculator/src/lib/calories.ts): calorie totals and category breakdowns
- [src/App.tsx](/Users/stephenjoly/Documents/Coding/pizza-calculator/src/App.tsx): responsive calculator UI
- [src/lib/dough.test.ts](/Users/stephenjoly/Documents/Coding/pizza-calculator/src/lib/dough.test.ts): parity checks against the reference output

## Notes

- Water and salt are treated as zero-calorie ingredients.
- Topping quantities are servings per pizza; batch totals scale with the pizza count.
- Calorie values are practical estimates and can be adjusted in config.
- The current defaults in [src/config/calculator.ts](/Users/stephenjoly/Documents/Coding/pizza-calculator/src/config/calculator.ts) point to USDA FoodData Central item pages or USDA search links for the generic ingredient.
