import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ArrowRight, ArrowLeft, Tag, Star, Check, RotateCcw } from 'lucide-react'
import StepBar from '../components/StepBar'
import { useEvent } from '../context/EventContext'

// ── Tier display ───────────────────────────────────────────────
const TIER_META = {
  economical: { label: 'Essential', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  quality:    { label: 'Premium',   cls: 'bg-orange-500/10  text-orange-300  border-orange-500/20'  },
  budget:     { label: 'Luxe',      cls: 'bg-purple-500/10  text-purple-300  border-purple-500/20'  },
}

// ── Category → background image ────────────────────────────────
const CATEGORY_IMG = {
  Catering:      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=900&auto=format&fit=crop',
  Decor:         'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop',
  Entertainment: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=900&auto=format&fit=crop',
  Photography:   'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=900&auto=format&fit=crop',
  Music:         'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=900&auto=format&fit=crop',
  Media:         'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=900&auto=format&fit=crop',
  Planning:      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=900&auto=format&fit=crop',
}
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop'

// ── Main component ─────────────────────────────────────────────
export default function BundleCustomization() {
  const navigate = useNavigate()
  const { selectedBundle, setCustomizedBundle } = useEvent()
  const [removed, setRemoved] = useState(new Set())

  useEffect(() => {
    if (!selectedBundle) navigate('/results', { replace: true })
  }, [selectedBundle, navigate])

  if (!selectedBundle) return null

  const items        = selectedBundle.items ?? []
  const activeItems  = items.filter((_, i) => !removed.has(i))
  const total        = activeItems.reduce((s, it) => s + Number(it.totalPrice ?? 0), 0)
  const originalTotal= items.reduce((s, it) => s + Number(it.totalPrice ?? 0), 0)
  const savings      = originalTotal - total

  const tier = TIER_META[selectedBundle.label] ?? TIER_META.economical

  function toggle(i) {
    setRemoved(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function handleConfirm() {
    setCustomizedBundle({ ...selectedBundle, items: activeItems, totalPrice: total })
    navigate('/logistics')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0a12] text-white">

      {/* ── Ambient blobs ──────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-orange-600/[0.06] blur-[130px]" />
        <div className="absolute top-1/2 -right-48 h-[600px] w-[600px] rounded-full bg-purple-700/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3  h-[400px] w-[400px] rounded-full bg-orange-500/[0.04] blur-[100px]" />
      </div>

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="relative z-20 border-b border-white/[0.06] bg-[#0b0a12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
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

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">

        {/* ── Step bar ───────────────────────────────────── */}
        <div className="mb-10">
          <StepBar current={3} />
        </div>

        {/* ── Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-[2.4rem] font-normal leading-tight text-white">
                  Customize your bundle
                </h1>
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tier.cls}`}>
                  {tier.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                Remove any items you don&apos;t need. Your total updates in real time.
              </p>
            </div>
            <button
              onClick={() => navigate('/results')}
              className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-stone-400 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        </motion.div>

        {/* ── Item cards ─────────────────────────────────── */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const isRemoved = removed.has(i)
              const img = CATEGORY_IMG[item.category] ?? FALLBACK_IMG

              return (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: isRemoved ? 0.38 : 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Gradient border wrapper — only when active */}
                  <div
                    className="rounded-2xl p-[1px] transition-all duration-300"
                    style={{
                      background: isRemoved
                        ? 'rgba(255,255,255,0.05)'
                        : 'linear-gradient(135deg, rgba(249,115,22,0.55) 0%, rgba(236,72,153,0.3) 55%, rgba(249,115,22,0.15) 100%)',
                    }}
                  >
                    <div className="flex overflow-hidden rounded-2xl bg-[#13100d]">

                      {/* ── Left: image + info ──────────── */}
                      <div className="relative w-[55%] min-h-[148px]">
                        <img
                          src={img}
                          alt={item.category}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end gap-1 p-4">
                          <span className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.12] bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-stone-300 backdrop-blur-sm">
                            <Tag className="h-2.5 w-2.5" />
                            {item.category}
                          </span>
                          <p className={`text-sm font-bold leading-snug text-white ${isRemoved ? 'line-through opacity-50' : ''}`}>
                            {item.name}
                          </p>
                          {item.supplier?.name && (
                            <p className="flex items-center gap-1 text-[11px] text-stone-400">
                              {item.supplier.name}
                              {item.supplier.rating != null && (
                                <>
                                  <Star className="ml-1 h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                  <span className="text-amber-400">{Number(item.supplier.rating).toFixed(1)}</span>
                                </>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Active checkmark indicator */}
                        {!isRemoved && (
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]">
                            <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                          </div>
                        )}
                      </div>

                      {/* ── Right: price + action ───────── */}
                      <div className="flex flex-1 flex-col items-end justify-between border-l border-white/[0.06] p-5">
                        <p className={`font-serif text-2xl font-normal leading-none ${isRemoved ? 'text-stone-600 line-through' : 'text-white'}`}>
                          ₪{Number(item.totalPrice ?? 0).toLocaleString()}
                        </p>

                        <button
                          onClick={() => toggle(i)}
                          title={isRemoved ? 'Add back' : 'Remove item'}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                            isRemoved
                              ? 'border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                              : 'border-white/[0.1] bg-white/[0.04] text-stone-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400'
                          }`}
                        >
                          {isRemoved
                            ? <RotateCcw className="h-3.5 w-3.5" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ── Summary box ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500">Items kept</span>
            <span className="font-medium text-white">
              {activeItems.length} / {items.length}
            </span>
          </div>

          {savings > 0 && (
            <div className="mt-2.5 flex items-center justify-between text-sm">
              <span className="text-stone-500">You saved</span>
              <span className="font-semibold text-emerald-400">
                −₪{savings.toLocaleString()}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
            <span className="font-semibold text-stone-200">New total</span>
            <span className="font-serif text-3xl font-normal text-white">
              ₪{total.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* ── CTA ────────────────────────────────────────── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          onClick={handleConfirm}
          disabled={activeItems.length === 0}
          whileHover={activeItems.length > 0 ? { scale: 1.01 } : {}}
          whileTap={{ scale: 0.99 }}
          className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-[size:200%] py-4 text-base font-semibold text-white shadow-[0_0_32px_-6px_rgba(249,115,22,0.5)] transition-all duration-300 hover:shadow-[0_0_44px_-4px_rgba(236,72,153,0.55)] hover:bg-right disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm Bundle
          <ArrowRight className="h-5 w-5" />
        </motion.button>

      </main>
    </div>
  )
}
