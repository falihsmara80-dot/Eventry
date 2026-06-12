import { useState } from 'react'
import {
  Cake,
  GlassWater,
  Briefcase,
  GraduationCap,
  Baby,
  TreePine,
  Users,
  DollarSign,
  Sparkles,
  Loader2,
  Wand2,
} from 'lucide-react'

const EVENT_TYPES = [
  { id: 'Birthday Party', label: 'Birthday', icon: Cake },
  { id: 'Wedding', label: 'Wedding', icon: GlassWater },
  { id: 'Corporate Event', label: 'Corporate', icon: Briefcase },
  { id: 'Graduation Party', label: 'Graduation', icon: GraduationCap },
  { id: 'Baby Shower', label: 'Baby Shower', icon: Baby },
  { id: 'Holiday Party', label: 'Holiday', icon: TreePine },
]

function EventForm({ onGenerate, loading, hasBundle }) {
  const [eventType, setEventType] = useState(EVENT_TYPES[0].id)
  const [guests, setGuests] = useState(20)
  const [budget, setBudget] = useState(1000)

  function handleSubmit(e) {
    e.preventDefault()
    onGenerate({ eventType, guests: Number(guests), budget: Number(budget) })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-4xl text-slate-100">Plan Your Event</h1>
        <p className="mt-2 text-slate-400">
          Tell us about your event and let AI build the perfect bundle.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1: Event type */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
            <h2 className="text-sm font-medium text-slate-400">1. Select Event Type</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {EVENT_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEventType(id)}
                  aria-pressed={eventType === id}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all duration-150 ${
                    eventType === id
                      ? 'border-amber-500/50 bg-slate-800/80 text-amber-300 ring-1 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Guests */}
          <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
            <h2 className="text-sm font-medium text-slate-400">2. Define Guests</h2>
            <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/60">
                <Users className="h-6 w-6 text-indigo-300" />
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bento-slider w-full"
                aria-label="Guests"
              />
              <input
                type="number"
                min="1"
                step="1"
                required
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Step 3: Budget */}
          <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900 p-6">
            <h2 className="text-sm font-medium text-slate-400">3. Set Budget (USD)</h2>
            <div className="mt-6 flex flex-1 flex-col justify-center gap-6">
              <div>
                <svg
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  className="h-8 w-full text-emerald-400/40"
                >
                  <polyline
                    points="0,25 15,20 30,22 45,10 60,15 75,5 90,8 100,2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-2 flex items-center justify-center gap-1.5 text-slate-500">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wide">Budget</span>
                </div>
              </div>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bento-slider w-full"
                aria-label="Budget"
              />
              <input
                type="number"
                min="1"
                step="1"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-center text-lg font-semibold text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Generate button */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] transition-all hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating your bundle...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Bundle
            </>
          )}
        </button>
      </form>

      {/* Next step placeholder */}
      {!hasBundle && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-indigo-500/30 bg-slate-800/30 p-12 text-center backdrop-blur-sm">
          <Wand2 className="h-8 w-8 text-indigo-300" />
          <p className="font-medium text-slate-200">The Next Step</p>
          <p className="max-w-md text-sm text-slate-400">
            Fill details above to reveal curated packages. Our AI is crafting your ideal bundle.
          </p>
        </div>
      )}
    </div>
  )
}

export default EventForm
