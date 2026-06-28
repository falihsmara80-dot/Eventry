import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calendar, Clock, MapPin, Users, FileText,
  ArrowRight, ArrowLeft,
} from 'lucide-react'
import StepBar from '../components/StepBar'
import { useEvent } from '../context/EventContext'

// ── Helpers ────────────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-')
  return `${d}/${m}/${y}`
}

// ── Sub-components ─────────────────────────────────────────────
function FormField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-stone-500">
        <Icon className="h-3 w-3 text-orange-400/80" />
        {label}
      </label>
      {children}
    </div>
  )
}

function LineInput(props) {
  return (
    <input
      {...props}
      className="w-full border-b border-white/[0.1] bg-transparent py-3 text-sm text-white outline-none placeholder:text-stone-600 transition-colors duration-200 hover:border-white/20 focus:border-orange-500/60 [color-scheme:dark]"
    />
  )
}

// ── Glass overlay card ─────────────────────────────────────────
function GlassCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/20 bg-black/60 p-3.5 backdrop-blur-md">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-orange-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">{label}</span>
      </div>
      <p className="truncate text-sm font-semibold text-white">{value || '—'}</p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function EventDetails() {
  const navigate = useNavigate()
  const { customizedBundle, setLogistics } = useEvent()

  const [form, setForm] = useState({
    eventName: '', date: '', time: '', location: '', guests: '', notes: '',
  })

  useEffect(() => {
    if (!customizedBundle) navigate('/customize', { replace: true })
  }, [customizedBundle, navigate])

  if (!customizedBundle) return null

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const isValid = () => form.eventName.trim() && form.date && form.time && form.location.trim()

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid()) return
    setLogistics(form)
    navigate('/payment')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0a12] text-white">

      {/* ── Ambient blobs ──────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-orange-600/[0.06] blur-[130px]" />
        <div className="absolute top-1/2 -right-48 h-[600px] w-[600px] rounded-full bg-purple-700/[0.07] blur-[120px]" />
        <div className="absolute bottom-10 left-1/3   h-[400px] w-[400px] rounded-full bg-pink-600/[0.04]   blur-[110px]" />
        {/* 4-point star accent */}
        <span className="absolute bottom-10 right-10 select-none text-[180px] leading-none text-white/[0.025]">
          ✦
        </span>
      </div>

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="relative z-20 border-b border-white/[0.06] bg-[#0b0a12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 text-sm font-bold shadow-[0_0_14px_-2px_rgba(249,115,22,0.6)]">
              E
            </div>
            <span className="text-base font-bold tracking-tight">Eventry</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Event date pill */}
            <div className="hidden items-center gap-2.5 rounded-full border border-orange-500/30 bg-white/[0.04] px-4 py-2 shadow-[0_0_18px_-4px_rgba(249,115,22,0.35)] backdrop-blur-sm sm:flex">
              <Calendar className="h-3.5 w-3.5 text-orange-400" />
              <div className="text-left text-[11px] leading-tight">
                <p className="font-medium text-stone-500">Event</p>
                <p className="font-semibold text-white">{fmtDate(form.date) ?? '— / — / ——'}</p>
              </div>
            </div>
            <button className="rounded-xl border border-white/[0.12] px-4 py-2 text-sm text-stone-300 transition hover:border-white/25 hover:text-white">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-10">

        {/* ── Step bar ───────────────────────────────────── */}
        <div className="mb-10">
          <StepBar current={4} />
        </div>

        {/* ── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-[2.4rem] font-normal leading-tight text-white">
              Event details
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Lock in the hard facts before we move to checkout.
            </p>
          </div>
          <button
            onClick={() => navigate('/customize')}
            className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-stone-400 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* ── 2-column grid ──────────────────────────── */}
          <div className="grid gap-8 md:grid-cols-2">

            {/* ── LEFT: Visual summary card ──────────── */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="hidden md:block"
            >
              {/* Gradient border glow wrapper */}
              <div className="h-full rounded-3xl bg-gradient-to-b from-orange-400 to-pink-500 p-[2px] shadow-[0_0_40px_-4px_rgba(249,115,22,0.35)]">
                <div className="relative h-full min-h-[500px] overflow-hidden rounded-[22px]">
                  <img
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop"
                    alt="Event venue"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

                  {/* Glass info boxes */}
                  <div className="absolute bottom-0 left-0 right-0 space-y-3 p-4">
                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <GlassCard icon={Calendar} label="Date *" value={fmtDate(form.date)} />
                      <GlassCard icon={Clock}    label="Time"   value={form.time} />
                    </div>
                    <GlassCard icon={MapPin} label="Address" value={form.location} />
                    <GlassCard icon={Users}  label="Guests"  value={form.guests} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Form ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-8 backdrop-blur-sm"
            >
              <div className="space-y-8">

                <FormField label="Event name *" icon={FileText}>
                  <LineInput
                    type="text"
                    value={form.eventName}
                    onChange={set('eventName')}
                    placeholder="e.g. Acme Corp Annual Launch"
                    required
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-5">
                  <FormField label="Date *" icon={Calendar}>
                    <LineInput
                      type="date"
                      value={form.date}
                      onChange={set('date')}
                      required
                    />
                  </FormField>
                  <FormField label="Time *" icon={Clock}>
                    <LineInput
                      type="time"
                      value={form.time}
                      onChange={set('time')}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Location / Venue address *" icon={MapPin}>
                  <LineInput
                    type="text"
                    value={form.location}
                    onChange={set('location')}
                    placeholder="e.g. Rothschild Blvd 22, Tel Aviv"
                    required
                  />
                </FormField>

                <FormField label="Expected guests" icon={Users}>
                  <LineInput
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={set('guests')}
                    placeholder="e.g. 200"
                  />
                </FormField>

                <FormField label="Special notes or requests" icon={FileText}>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={set('notes')}
                    placeholder="Dietary requirements, setup preferences, access times…"
                    className="w-full resize-none rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-stone-600 transition-colors duration-200 hover:border-white/20 focus:border-orange-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-orange-500/15"
                  />
                </FormField>

              </div>
            </motion.div>
          </div>

          {/* ── CTA ────────────────────────────────────── */}
          <motion.button
            type="submit"
            disabled={!isValid()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={isValid() ? { scale: 1.006 } : {}}
            whileTap={{ scale: 0.998 }}
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-[size:200%] py-4 text-base font-semibold text-white shadow-[0_0_32px_-6px_rgba(249,115,22,0.5)] transition-all duration-300 hover:bg-right hover:shadow-[0_0_44px_-4px_rgba(236,72,153,0.55)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Proceed to Checkout
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </form>
      </main>
    </div>
  )
}
