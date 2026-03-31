import { CATEGORY_COLORS, CATEGORY_LABELS } from '../config/calculator'
import { formatCalories } from '../lib/format'
import type { IngredientCategory } from '../types'

type SegmentedBarProps = {
  totals: Record<IngredientCategory, number>
}

export function SegmentedBar({ totals }: SegmentedBarProps) {
  const entries = (Object.keys(totals) as IngredientCategory[])
    .map((key) => ({
      key,
      label: CATEGORY_LABELS[key],
      value: totals[key],
      color: CATEGORY_COLORS[key],
    }))
    .filter((entry) => entry.value > 0)

  const grandTotal = entries.reduce((sum, entry) => sum + entry.value, 0)

  if (grandTotal === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-5 text-sm text-stone-500">
        Enable toppings to see a calorie category breakdown.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        aria-label="Calorie breakdown by category"
        className="flex h-4 overflow-hidden rounded-full border border-stone-200 bg-stone-100"
        role="img"
      >
        {entries.map((entry) => (
          <div
            key={entry.key}
            style={{
              backgroundColor: entry.color,
              width: `${(entry.value / grandTotal) * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="grid gap-2">
        {entries.map((entry) => (
          <div
            className="rounded-2xl bg-white px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgba(214,211,209,0.9)]"
            key={entry.key}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 font-medium text-stone-700">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="truncate">{entry.label}</span>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-stone-900">
                {formatCalories(entry.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
