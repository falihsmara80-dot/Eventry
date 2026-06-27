import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Wand2,
  Loader2,
  AlertCircle,
  Info,
  Bot,
  Eye,
} from 'lucide-react'
import Header from './Header'
import BundleComparison from './BundleComparison'
import { API_BASE_URL } from '../lib/api'
import { EXAMPLE_RESULT } from '../lib/exampleBundles'

const PLACEHOLDER =
  "e.g. I'm planning a wedding for about 120 guests with a $25,000 budget. " +
  'We definitely need a venue, full catering, a photographer, and some live music. ' +
  'Decor and a soft drinks bar would be lovely too.'

const EXAMPLES = [
  "Birthday party for 30 kids, budget around $1,500. Need a venue, catering, decor and entertainment.",
  'Corporate launch event, 200 guests, $40k budget. Catering, A/V, staffing and photography.',
  'Baby shower for 25 guests, $800 budget — decor, favors, light catering and beverages.',
]

function AgentPlanner() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hint, setHint] = useState(null)
  const [summary, setSummary] = useState(null)
  const [result, setResult] = useState(null)
  const [previewing, setPreviewing] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError(null)
    setHint(null)
    setSummary(null)
    setResult(null)
    setPreviewing(false)

    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to plan your event')
      }

      if (data.needsMoreInfo) {
        setHint(data.hint)
      } else {
        setSummary(data.summary)
        setResult(data.result)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function showPreview() {
    setError(null)
    setHint(null)
    setSummary(null)
    setResult(EXAMPLE_RESULT)
    setPreviewing(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        {/* Page header */}
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-serif text-4xl text-slate-100">Plan with AI</h1>
            <p className="mt-1 text-slate-400">
              Describe your event in your own words. Our agent reads it, runs the bundle
              algorithm, and lays out three tailored options.
            </p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-3xl border border-slate-700/50 bg-slate-900 p-5">
            <label htmlFor="event-paragraph" className="text-sm font-medium text-slate-400">
              Tell us about your event
            </label>
            <textarea
              id="event-paragraph"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={5}
              className="mt-3 w-full resize-y rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-indigo-500"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setMessage(ex)}
                  className="rounded-full border border-slate-700/70 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-indigo-500/40 hover:text-indigo-200"
                >
                  {ex.length > 48 ? `${ex.slice(0, 48)}…` : ex}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] transition-all hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Planning your event…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Plan with AI
                </>
              )}
            </button>
            <button
              type="button"
              onClick={showPreview}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/40 px-5 py-4 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              <Eye className="h-4 w-4" />
              See an example
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Needs more info */}
        {hint && (
          <div className="flex items-start gap-3 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-200">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">A little more detail, please</p>
              <p className="mt-1 text-sm text-amber-200/90">{hint}</p>
            </div>
          </div>
        )}

        {/* Agent summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 p-5"
          >
            <Wand2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-300" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                The agent&apos;s read
              </p>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-200">{summary}</p>
            </div>
          </motion.div>
        )}

        {/* Preview banner */}
        {previewing && (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-800/30 px-4 py-2.5 text-xs text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            Sample data — shown to preview the layout. Live results come from the algorithm.
          </div>
        )}

        {/* Results */}
        {result && <BundleComparison result={result} />}
      </main>
    </div>
  )
}

export default AgentPlanner
