import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, Calendar, MapPin, Users,
  Lock, CheckCircle, ArrowLeft, Tag, Eye, EyeOff,
} from 'lucide-react'
import StepBar from '../components/StepBar'
import { useEvent } from '../context/EventContext'

// ── Input styles ───────────────────────────────────────────────
const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-600 transition-all duration-200 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/40 focus:bg-white/[0.07]'

// ── Small label ────────────────────────────────────────────────
function Label({ children }) {
  return (
    <label className="mb-2 block text-xs font-medium text-stone-400">{children}</label>
  )
}

// ── Glass panel ────────────────────────────────────────────────
function GlassPanel({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md ${className}`}>
      {children}
    </div>
  )
}

// ── Order item row ─────────────────────────────────────────────
function OrderItem({ category, name, supplier, price }) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-stone-400">
        <Tag className="h-2.5 w-2.5" />
        {category}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-200">{name}</p>
        {supplier && <p className="mt-0.5 truncate text-xs text-stone-600">{supplier}</p>}
      </div>
      <p className="shrink-0 text-sm font-semibold text-stone-200">
        ₪{Number(price ?? 0).toLocaleString()}
      </p>
    </div>
  )
}

// ── Event detail row ───────────────────────────────────────────
function DetailRow({ label, icon: Icon, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="flex items-center gap-1.5 text-stone-500">
        {Icon && <Icon className="h-3.5 w-3.5 text-stone-600" />}
        {label}
      </span>
      <span className="max-w-[55%] truncate text-right font-medium text-stone-300">{value || '—'}</span>
    </div>
  )
}

// ── Success screen ─────────────────────────────────────────────
function SuccessScreen({ onHome }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0a12]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />
        </div>
      </div>
      <main className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <div className="relative inline-flex">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 shadow-[0_0_40px_-6px_rgba(16,185,129,0.4)] flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-7"
        >
          <h1 className="font-serif text-4xl font-normal text-white">Booking confirmed!</h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            Your event has been locked in. Suppliers will reach out<br />to confirm details within 24 hours.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onHome}
            className="mt-9 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 px-10 py-3.5 font-semibold text-white shadow-[0_0_28px_-4px_rgba(249,115,22,0.5)] transition hover:shadow-[0_0_36px_-4px_rgba(236,72,153,0.55)]"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
export default function PaymentCheckout() {
  const navigate = useNavigate()
  const { customizedBundle, logistics } = useEvent()
  const [paid, setPaid]       = useState(false)
  const [showCvc, setShowCvc] = useState(false)

  useEffect(() => {
    if (!customizedBundle || !logistics) navigate('/logistics', { replace: true })
  }, [customizedBundle, logistics, navigate])

  if (!customizedBundle || !logistics) return null

  const total = Number(customizedBundle.totalPrice ?? 0)

  function handlePay(e) {
    e.preventDefault()
    setPaid(true)
  }

  if (paid) return <SuccessScreen onHome={() => navigate('/')} />

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0a12] text-white">

      {/* ── Ambient blobs ──────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-orange-700/[0.07] blur-[130px]" />
        <div className="absolute bottom-0 right-0    h-[500px] w-[500px] rounded-full bg-rose-700/[0.05]   blur-[120px]" />
        <div className="absolute top-1/2  left-1/3   h-[400px] w-[400px] rounded-full bg-amber-600/[0.04]  blur-[100px]" />
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
          <button className="rounded-xl border border-white/[0.12] px-4 py-2 text-sm text-stone-300 transition hover:border-white/25 hover:text-white">
            Sign In
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-10">

        {/* ── Step bar ───────────────────────────────────── */}
        <div className="mb-10">
          <StepBar current={5} />
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
              Complete your booking
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Review your order and enter payment details.
            </p>
          </div>
          <button
            onClick={() => navigate('/logistics')}
            className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-stone-400 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </motion.div>

        {/* ── 2-column grid ──────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-12">

          {/* ── LEFT: Payment form (7 cols) ───────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <GlassPanel>
              {/* Panel header */}
              <div className="mb-6 flex items-center gap-2.5">
                <CreditCard className="h-4.5 w-4.5 text-orange-400" />
                <h2 className="font-semibold text-stone-100">Payment details</h2>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-stone-400">
                  <Lock className="h-3 w-3 text-emerald-400" />
                  Secured by Stripe
                </span>
              </div>

              <form onSubmit={handlePay} className="space-y-5">

                {/* Cardholder */}
                <div>
                  <Label>Cardholder name</Label>
                  <input type="text" placeholder="Jane Smith" className={inputCls} required />
                </div>

                {/* Card number */}
                <div>
                  <Label>Card number</Label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className={inputCls}
                      required
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <span className="h-5 w-8 rounded bg-blue-600/60 text-[8px] font-bold text-white flex items-center justify-center">VISA</span>
                      <span className="h-5 w-8 rounded bg-red-500/50 text-[8px] font-bold text-white flex items-center justify-center">MC</span>
                    </div>
                  </div>
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry</Label>
                    <div className="relative">
                      <input type="text" placeholder="MM / YY" maxLength={7} className={inputCls} required />
                      <Calendar className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-600" />
                    </div>
                  </div>
                  <div>
                    <Label>CVC</Label>
                    <div className="relative">
                      <input
                        type={showCvc ? 'text' : 'password'}
                        placeholder="•••"
                        maxLength={4}
                        className={inputCls}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvc(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition"
                      >
                        {showCvc ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stripe placeholder */}
                <div className="rounded-lg border border-dashed border-white/[0.15] bg-white/[0.02] p-5 text-center text-sm text-stone-600">
                  Stripe Elements will mount here in production
                </div>

                {/* Pay button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.008 }}
                  whileTap={{ scale: 0.996 }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-[size:200%] py-4 text-base font-semibold text-white shadow-[0_0_32px_-6px_rgba(249,115,22,0.55)] transition-all duration-300 hover:bg-right hover:shadow-[0_0_44px_-4px_rgba(236,72,153,0.55)]"
                >
                  <Lock className="h-4 w-4" />
                  Pay ₪{total.toLocaleString()}
                  <span className="ml-1">→</span>
                </motion.button>
              </form>
            </GlassPanel>

            {/* Security footer pill */}
            <div className="mt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.03] px-5 py-2.5 backdrop-blur-sm">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span className="text-[11px] text-stone-500">Secure Payments</span>
                <span className="text-stone-700">|</span>
                <span className="text-[11px] font-semibold tracking-wide text-stone-400">stripe</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-4 w-6 rounded bg-blue-600/50 text-[7px] font-bold text-white flex items-center justify-center">VISA</span>
                  <span className="h-4 w-6 rounded bg-red-500/40 text-[7px] font-bold text-white flex items-center justify-center">MC</span>
                  <span className="h-4 w-6 rounded bg-sky-500/40 text-[7px] font-bold text-white flex items-center justify-center">AMEX</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Summary + Event details (5 cols) ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-col gap-5 lg:col-span-5"
          >

            {/* Order summary card */}
            <GlassPanel>
              <h2 className="mb-1 font-semibold text-stone-100">Order summary</h2>
              <div className="divide-y divide-white/[0.06]">
                {customizedBundle.items.map((item, i) => (
                  <OrderItem
                    key={i}
                    category={item.category}
                    name={item.name}
                    supplier={item.supplier?.name}
                    price={item.totalPrice}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <span className="text-sm text-stone-500">Total</span>
                <span className="font-serif text-2xl font-normal text-white">
                  ₪{total.toLocaleString()}
                </span>
              </div>
            </GlassPanel>

            {/* Event details card */}
            <GlassPanel>
              <h2 className="mb-1 font-semibold text-stone-100">Event details</h2>
              <div className="divide-y divide-white/[0.06]">
                <DetailRow label="Event"    value={logistics.eventName} />
                <DetailRow
                  label="Date"
                  icon={Calendar}
                  value={logistics.date ? `${logistics.date} at ${logistics.time}` : '—'}
                />
                <DetailRow
                  label="Location"
                  icon={MapPin}
                  value={logistics.location}
                />
                {logistics.guests && (
                  <DetailRow
                    label="Guests"
                    icon={Users}
                    value={logistics.guests}
                  />
                )}
              </div>
            </GlassPanel>

          </motion.div>
        </div>
      </main>
    </div>
  )
}
