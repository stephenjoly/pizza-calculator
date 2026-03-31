type RangeFieldProps = {
  id: string
  label: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  hideLabel?: boolean
}

export function RangeField({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  hideLabel = false,
}: RangeFieldProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        {hideLabel ? (
          <span className="sr-only" id={`${id}-label`}>
            {label}
          </span>
        ) : (
          <label
            className="text-[0.9rem] font-semibold tracking-tight text-stone-900 sm:text-[0.96rem]"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.84rem] font-bold text-stone-900 shadow-[inset_0_0_0_2px_rgba(41,37,36,0.12)]">
          {value}
        </span>
      </div>
      <input
        aria-label={label}
        aria-labelledby={hideLabel ? `${id}-label` : undefined}
        className="range-input"
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </div>
  )
}
