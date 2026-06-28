import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Loader2, AlertCircle, ArrowRight, Info,
  Mic, Paperclip, Shuffle, Pencil,
} from 'lucide-react'
import { useEvent } from '../context/EventContext'
import { API_BASE_URL } from '../lib/api'

// ── Real-time parser ───────────────────────────────────────────
function parseEventInfo(text) {
  const t = text.toLowerCase()
  const info = {}

  const typeMap = [
    ['wedding', 'Wedding'], ['birthday', 'Birthday Party'],
    ['corporate', 'Corporate Event'], ['baby shower', 'Baby Shower'],
    ['bar mitzvah', 'Bar Mitzvah'], ['bat mitzvah', 'Bat Mitzvah'],
    ['gala', 'Gala'], ['conference', 'Conference'], ['party', 'Party'],
  ]
  for (const [kw, label] of typeMap) {
    if (t.includes(kw)) { info.eventType = label; break }
  }

  const gm = text.match(/(\d[\d,]*)\s*(guests?|people|attendees|persons?)/i)
  if (gm) info.guests = `${gm[1].replace(/,/g, '')} Guests`

  const bm = text.match(/[₪$]\s*[\d,]+/i)
    || text.match(/[\d,]+\s*(?:nis|ils|shekel)/i)
    || text.match(/budget[^\d]*[\d,]+/i)
  if (bm) info.budget = bm[0].trim()

  const cities = [
    'tel aviv', 'haifa', 'jerusalem', 'eilat', 'herzliya',
    'raanana', 'netanya', 'beer sheva', 'rishon', 'petah tikva',
    'london', 'new york', 'paris', 'dubai', 'miami', 'chicago',
  ]
  const cityFound = cities.find(c => t.includes(c))
  if (cityFound) {
    info.location = cityFound.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  } else {
    const lm = text.match(/\b(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i)
    if (lm) info.location = lm[1].trim()
  }

  const styles = ['elegant', 'luxury', 'casual', 'rustic', 'modern', 'traditional', 'minimalist', 'vintage', 'boho', 'intimate']
  const sf = styles.find(s => t.includes(s))
  if (sf) info.style = sf[0].toUpperCase() + sf.slice(1)

  const foods = [['kosher', 'Kosher'], ['vegan', 'Vegan'], ['buffet', 'Buffet'], ['halal', 'Halal'], ['catering', 'Full Catering'], ['cocktail', 'Cocktail Style']]
  const ff = foods.find(([k]) => t.includes(k))
  if (ff) info.food = ff[1]

  const ents = [['dj', 'DJ'], ['live band', 'Live Band'], ['band', 'Band'], ['photographer', 'Photographer'], ['live music', 'Live Music'], ['videographer', 'Videographer']]
  const ef = ents.find(([k]) => t.includes(k))
  if (ef) info.entertainment = ef[1]

  const specials = [['outdoor', 'Outdoor Venue'], ['open bar', 'Open Bar'], ['photo booth', 'Photo Booth'], ['fireworks', 'Fireworks'], ['black tie', 'Black Tie']]
  const spf = specials.find(([k]) => t.includes(k))
  if (spf) info.special = spf[1]

  return info
}

function calcConfidence(info, hasText) {
  if (!hasText) return 0
  const weights = { eventType: 22, guests: 22, budget: 22, location: 14, style: 6, food: 8, entertainment: 4, special: 2 }
  return Math.min(98, Object.entries(weights).reduce((s, [k, w]) => s + (info[k] ? w : 0), 0))
}

// ── Confidence ring ────────────────────────────────────────────
function ConfidenceRing({ pct }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const stroke = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f97316'
  const msg =
    pct === 0 ? 'Start typing to calculate…' :
    pct < 50  ? 'Add more details for better results.' :
    pct < 80  ? 'Good start! A few more details would help.' :
                'Excellent — ready to generate!'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
          <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="55" cy="55" r={r} fill="none"
            stroke={stroke} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{pct}%</span>
        </div>
      </div>
      <p className="max-w-[180px] text-center text-xs leading-relaxed text-stone-500">{msg}</p>
    </div>
  )
}

// ── Constants ──────────────────────────────────────────────────
const STEPS = ['Describe', 'Choose', 'Customize', 'Details', 'Payment']

const DETECTED_FIELDS = [
  { key: 'eventType',     label: 'Event Type' },
  { key: 'guests',        label: 'Guests' },
  { key: 'budget',        label: 'Budget' },
  { key: 'location',      label: 'Location' },
  { key: 'style',         label: 'Style' },
  { key: 'food',          label: 'Food' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'special',       label: 'Special' },
]

const EXAMPLE_CARDS = [
  {
    title: 'Wedding', desc: '250 guests · ₪30,000',
    text: "I'm planning a wedding for around 250 guests in Haifa. My budget is around ₪30,000. I'd like elegant decorations, kosher catering, a DJ, and a photographer.",
  },
  {
    title: 'Birthday Party', desc: '35 guests · ₪4,000',
    text: "Birthday party for 35 guests in Tel Aviv, ₪4,000 budget. Need a fun venue, catering, balloon decor, and entertainment.",
  },
  {
    title: 'Corporate Event', desc: '100 guests · ₪20,000',
    text: "Corporate launch event for 100 guests in Tel Aviv, ₪20,000 budget. Need a conference venue, full catering, A/V equipment, and professional photography.",
  },
  {
    title: 'Baby Shower', desc: '25 guests · ₪2,500',
    text: "Baby shower for 25 guests, ₪2,500 budget. Looking for a cozy indoor venue with light catering, elegant pastel decor, and a photographer.",
  },
]

const LOADING_PHASES = [
  'Reading your description…',
  'Selecting the best products…',
  'Writing your pitch…',
]

const PLACEHOLDER = `A modern corporate gala for 300 guests in Tel Aviv, budget ₪80,000,\nplated kosher catering, a live band and a photographer…`

// ── Page ───────────────────────────────────────────────────────
export default function EventPrompt() {
  const navigate  = useNavigate()
  const { setPlanResult } = useEvent()

  const [message,      setMessage]      = useState('')
  const [loading,      setLoading]      = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [error,        setError]        = useState(null)
  const [hint,         setHint]         = useState(null)
  const [detected,     setDetected]     = useState({})
  const [confidence,   setConfidence]   = useState(0)
  const phaseTimer = useRef(null)

  useEffect(() => {
    const info = parseEventInfo(message)
    setDetected(info)
    setConfidence(calcConfidence(info, message.trim().length > 0))
  }, [message])

  useEffect(() => {
    if (loading) {
      setLoadingPhase(0)
      phaseTimer.current = setInterval(() => {
        setLoadingPhase(p => Math.min(p + 1, LOADING_PHASES.length - 1))
      }, 3000)
    } else {
      clearInterval(phaseTimer.current)
    }
    return () => clearInterval(phaseTimer.current)
  }, [loading])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    setHint(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })
      let data
      try { data = await res.json() } catch {
        throw new Error(`Server error (${res.status}) — make sure the backend is running on port 5005`)
      }
      if (!res.ok) throw new Error(data.error || 'Failed to plan your event')
      if (data.needsMoreInfo) {
        setHint(data.hint || 'Please add more detail — guest count, budget, or must-have services.')
      } else {
        setPlanResult(data)
        navigate('/results')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function randomExample() {
    const ex = EXAMPLE_CARDS[Math.floor(Math.random() * EXAMPLE_CARDS.length)]
    setMessage(ex.text)
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">

      {/* ── HERO (image behind nav) ──────────────────────────── */}
      <div className="relative h-[370px] w-full overflow-hidden">
        {/* Background image */}
        <img
          src="https://i.imgur.com/dQ2yEA3.jpeg"
          alt="Event venue"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 50%' }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent" />

        {/* Nav — overlaid on image */}
        <nav className="relative z-10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-[14px]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 text-sm font-bold shadow-[0_0_14px_-2px_rgba(249,115,22,0.6)]">
                E
              </div>
              <span className="text-base font-bold tracking-tight text-white">Eventry</span>
            </Link>

            <button className="text-sm text-stone-300 transition hover:text-white">Sign in</button>
          </div>
        </nav>

        {/* Hero text — centered in area below nav */}
        <div className="absolute bottom-0 left-0 right-0 top-[56px] z-10 flex flex-col justify-center px-8 md:px-14">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-400">
              AI Event Planner
            </p>
            <h1 className="max-w-2xl font-serif text-[2.6rem] font-normal leading-[1.15] text-white md:text-5xl">
              Let&apos;s plan something unforgettable
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-400">
              Describe your vision — our AI reads every detail and builds the perfect bundle around it.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── STEP TRACKER ────────────────────────────────────── */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-6 py-8">
        {STEPS.map((label, i) => {
          const active = i === 0
          return (
            <div key={label} className="flex items-center">
              {/* Connector line — before every step except the first */}
              {i > 0 && (
                <div className="h-[1px] w-12 bg-white/[0.07] sm:w-16" />
              )}
              {/* Step */}
              <div className="flex flex-col items-center gap-1.5">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-[0_0_15px_rgba(251,146,60,0.3)]'
                    : 'border border-gray-800 bg-transparent text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <span className={`text-[11px] font-medium ${active ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <form id="event-form" onSubmit={handleSubmit}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 py-8 md:px-8 lg:grid-cols-[1fr_320px]">

          {/* ── LEFT ──────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Textarea */}
            <div>
              <p className="mb-3 text-sm text-stone-400">Describe your event in as much detail as you can</p>
              <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.04] backdrop-blur-md transition-all duration-300 focus-within:border-orange-500/30 focus-within:ring-1 focus-within:ring-orange-500/20 focus-within:shadow-[0_0_40px_-8px_rgba(249,115,22,0.2)]">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={PLACEHOLDER}
                  rows={7}
                  className="w-full resize-none bg-transparent px-5 py-4 text-sm leading-relaxed text-stone-100 outline-none placeholder:text-stone-700"
                />
                <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-2.5">
                  <div className="flex gap-0.5">
                    <button type="button"
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 transition hover:bg-white/5 hover:text-stone-300"
                    >
                      <Paperclip className="h-3.5 w-3.5" /> Attach
                    </button>
                    <button type="button"
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 transition hover:bg-white/5 hover:text-stone-300"
                    >
                      <Mic className="h-3.5 w-3.5" /> Voice
                    </button>
                    <button type="button" onClick={randomExample}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 transition hover:bg-white/5 hover:text-stone-300"
                    >
                      <Shuffle className="h-3.5 w-3.5" /> Surprise me
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-700">{message.length} chars</span>
                </div>
              </div>
            </div>

            {/* Quick start */}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600">Quick Start</p>
              <div className="grid grid-cols-2 gap-3">
                {EXAMPLE_CARDS.map(card => (
                  <motion.button
                    key={card.title}
                    type="button"
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    onClick={() => setMessage(card.text)}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-orange-500/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-semibold text-orange-300">
                      {card.title[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-200">{card.title}</p>
                      <p className="mt-0.5 text-[11px] text-stone-600">{card.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {hint && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 p-4 text-amber-200"
                >
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">A little more detail, please</p>
                    <p className="mt-0.5 text-xs text-amber-200/70">{hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/8 p-4 text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading bar */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm"
                >
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-orange-400" />
                  <div className="flex-1">
                    <AnimatePresence mode="wait">
                      <motion.p key={loadingPhase}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
                        className="text-sm font-medium text-stone-200"
                      >
                        {LOADING_PHASES[loadingPhase]}
                      </motion.p>
                    </AnimatePresence>
                    <div className="mt-2 flex gap-1.5">
                      {LOADING_PHASES.map((_, i) => (
                        <div key={i} className={`h-0.5 rounded-full transition-all duration-500 ${i <= loadingPhase ? 'w-6 bg-orange-400' : 'w-4 bg-stone-800'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}
            className="flex flex-col gap-4 lg:sticky lg:top-[68px] lg:self-start"
          >
            {/* AI Confidence */}
            <div className="rounded-xl border border-white/[0.09] bg-white/[0.04] p-6 backdrop-blur-md">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600">AI Confidence</p>
              <ConfidenceRing pct={confidence} />
            </div>

            {/* AI Detected */}
            <div className="rounded-xl border border-white/[0.09] bg-white/[0.04] p-5 backdrop-blur-md">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600">AI detected</p>
              <div className="space-y-3">
                {DETECTED_FIELDS.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-stone-400">{label}</span>
                    <AnimatePresence mode="wait">
                      {detected[key] ? (
                        <motion.span
                          key={detected[key]}
                          initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="max-w-[140px] truncate text-right text-sm font-medium text-stone-200"
                        >
                          {detected[key]}
                        </motion.span>
                      ) : (
                        <span className="animate-pulse text-sm italic text-stone-700">Waiting...</span>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── GENERATE BUTTON ───────────────────────────── */}
        <div className="sticky bottom-0 z-40 border-t border-white/[0.05] bg-[#0b0b12]/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto max-w-[1280px]">
            <motion.button
              type="submit"
              disabled={loading || !message.trim()}
              whileHover={!loading && message.trim() ? { scale: 1.005 } : {}}
              whileTap={{ scale: 0.995 }}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-[size:200%] py-4 text-base font-semibold text-white shadow-[0_0_32px_-6px_rgba(249,115,22,0.55)] transition-all duration-300 hover:bg-right hover:shadow-[0_0_44px_-4px_rgba(236,72,153,0.55)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" />{LOADING_PHASES[loadingPhase]}</>
              ) : (
                <>✦ Generate my perfect bundle <ArrowRight className="h-4 w-4" /></>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  )
}
