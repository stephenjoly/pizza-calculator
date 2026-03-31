type InstructionsPanelProps = {
  title: string
  steps: string[]
}

export function InstructionsPanel({
  title,
  steps,
}: InstructionsPanelProps) {
  return (
    <section className="rounded-[1.2rem] border border-stone-900 bg-white px-4 py-4 shadow-[4px_4px_0_0_rgba(68,64,60,0.16)] sm:px-4">
      <h3 className="font-display text-[1rem] font-bold tracking-tight text-stone-900 sm:text-[1.35rem]">
        {title}
      </h3>
      <ol className="mt-3.5 space-y-2 pl-5 text-[0.88rem] leading-6 text-stone-700 marker:font-bold marker:text-stone-900">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  )
}
