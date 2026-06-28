import { Fragment } from 'react'
import { Check } from 'lucide-react'

const STEPS = ['Describe', 'Choose', 'Customize', 'Details', 'Payment']

export default function StepBar({ current }) {
  return (
    <div className="flex w-full items-center">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done   = step < current
        const active = step === current

        return (
          <Fragment key={label}>
            {i > 0 && (
              <div className={`mx-2 h-[1px] flex-1 transition-colors ${done ? 'bg-orange-500/25' : 'bg-white/[0.06]'}`} />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                active
                  ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-[0_0_14px_rgba(249,115,22,0.5)]'
                  : done
                  ? 'border border-orange-500/20 bg-white/[0.04] text-orange-400'
                  : 'border border-white/[0.08] bg-white/[0.02] text-stone-600'
              }`}>
                {done ? <Check className="h-3.5 w-3.5" /> : step}
              </span>
              <span className={`text-[10px] transition-colors ${
                active ? 'font-semibold text-white' : done ? 'text-stone-500' : 'text-stone-700'
              }`}>
                {label}
              </span>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
