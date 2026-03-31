const wholeNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const oneDecimal = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

export function formatGrams(value: number): string {
  return Number.isInteger(value) ? wholeNumber.format(value) : oneDecimal.format(value)
}

export function formatCalories(value: number): string {
  return wholeNumber.format(Math.round(value))
}
