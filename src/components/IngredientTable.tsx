import { formatCalories, formatGrams } from '../lib/format'
import type { CalorieLineItem, DoughIngredientResult } from '../types'

type IngredientTableProps = {
  ingredients: DoughIngredientResult[]
}

export function IngredientTable({ ingredients }: IngredientTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed border-collapse overflow-hidden rounded-[1rem] border border-stone-300 bg-white">
        <colgroup>
          <col className="w-1/2" />
          <col className="w-1/2" />
        </colgroup>
        <thead>
          <tr className="bg-[#fff7ca] text-left">
            <th className="px-3 py-2 text-[0.74rem] font-bold uppercase tracking-[0.18em] text-stone-900">
              Ingredient
            </th>
            <th className="px-3 py-2 text-[0.74rem] font-bold uppercase tracking-[0.18em] text-stone-900">
              Amount (g)
            </th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr className="border-t border-stone-200" key={ingredient.key}>
              <td className="px-3 py-2.5 text-[0.88rem] text-stone-700">
                {ingredient.name}
              </td>
              <td className="px-3 py-2.5 text-[0.88rem] font-semibold text-stone-900">
                {formatGrams(ingredient.grams)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type CalorieTableProps = {
  items: CalorieLineItem[]
}

export function CalorieTable({ items }: CalorieTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed border-collapse overflow-hidden rounded-[1rem] border border-stone-300 bg-white">
        <colgroup>
          <col className="w-[58%]" />
          <col className="w-[42%]" />
        </colgroup>
        <thead>
          <tr className="bg-[#fff7ca] text-left">
            <th className="px-3 py-2 text-[0.74rem] font-bold uppercase tracking-[0.18em] text-stone-900">
              Item
            </th>
            <th className="px-3 py-2 text-[0.74rem] font-bold uppercase tracking-[0.18em] text-stone-900">
              Calories
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-t border-stone-200" key={item.id}>
              <td className="px-3 py-2.5 text-[0.88rem] text-stone-700">
                <div className="font-medium text-stone-900">{item.name}</div>
                <div className="text-[0.78rem] text-stone-500">
                  {formatGrams(item.grams)} g
                  {item.quantity ? ` total (${item.quantity} serving${item.quantity === 1 ? '' : 's'} per pizza)` : ''}
                </div>
              </td>
              <td className="px-3 py-2.5 text-[0.88rem] font-semibold text-stone-900">
                {formatCalories(item.calories)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
