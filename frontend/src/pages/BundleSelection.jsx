import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, ArrowLeft, ArrowRight, Check, Star,
  Utensils, Camera, Music, Mic, Clipboard, Video, Zap,
} from 'lucide-react'
import { useEvent } from '../context/EventContext'
import StepBar from '../components/StepBar'

// ── Category → icon map ────────────────────────────────────────
function CategoryIcon({ category, className }) {
  const cat = (category ?? '').toLowerCase()
  let Icon = Check
  if (cat.includes('cater') || cat.includes('food') || cat.includes('dining')) Icon = Utensils
  else if (cat.includes('photo'))                                                Icon = Camera
  else if (cat.includes('music') || cat.includes('dj'))                         Icon = Music
  else if (cat.includes('entertain') || cat.includes('band') || cat.includes('perform')) Icon = Mic
  else if (cat.includes('decor') || cat.includes('floral') || cat.includes('flower'))   Icon = Sparkles
  else if (cat.includes('plan') || cat.includes('coord'))                        Icon = Clipboard
  else if (cat.includes('video') || cat.includes('media') || cat.includes('film'))      Icon = Video
  else if (cat.includes('sound') || cat.includes('audio') || cat.includes('light'))     Icon = Zap
  return <Icon className={className} />
}

// ── Tier config ────────────────────────────────────────────────
const TIER = {
  economical: {
    name: 'Essential',
    color: 'text-stone-200',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    cardCls: 'border-white/[0.07] hover:border-white/[0.14]',
    btnCls: 'border border-white/[0.1] bg-[#1c1510] text-stone-300 hover:bg-[#241b11] hover:text-white',
    budget: (fits) => fits
      ? ['Within your budget', 'text-emerald-400']
      : ['Slightly over budget', 'text-amber-400'],
    featured: false,
  },
  quality: {
    name: 'Premium',
    color: 'text-orange-400',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    cardCls: 'border-transparent',
    btnCls: 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-400 hover:to-pink-500 shadow-[0_0_20px_-4px_rgba(249,115,22,0.45)]',
    budget: (fits) => fits
      ? ['Within your budget', 'text-emerald-400']
      : ['Slightly over budget', 'text-orange-400'],
    featured: true,
  },
  budget: {
    name: 'Luxe',
    color: 'text-purple-300',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    cardCls: 'border-white/[0.07] hover:border-white/[0.14]',
    btnCls: 'border border-white/[0.1] bg-[#1c1510] text-stone-300 hover:bg-[#241b11] hover:text-white',
    budget: (fits) => fits
      ? ['Within your budget', 'text-emerald-400']
      : ['Over budget · full service', 'text-stone-500'],
    featured: false,
  },
}

// ── Chip ───────────────────────────────────────────────────────
function Chip({ label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-stone-300 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500/70" />
      {label}
    </span>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function BundleSelection() {
  const navigate = useNavigate()
  const { planResult, setSelectedBundle } = useEvent()

  useEffect(() => {
    if (!planResult) navigate('/create', { replace: true })
  }, [planResult, navigate])

  if (!planResult) return null

  const { summary, extractedInput, result } = planResult
  const bundles = result?.bundles ?? []

  function handleSelect(bundle) {
    setSelectedBundle(bundle)
    navigate('/customize')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0a12] text-white">

      {/* ── Ambient glow blobs ──────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-orange-600/[0.06] blur-[130px]" />
        <div className="absolute top-1/2 -right-48 h-[600px] w-[600px] rounded-full bg-purple-700/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-orange-500/[0.04] blur-[100px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────────── */}
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

        {/* ── Step bar ─────────────────────────────────────── */}
        <div className="mb-10">
          <StepBar current={2} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 space-y-5"
        >
          {/* ── Header ──────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-[2.5rem] font-normal leading-tight text-white">
                Your event bundles
              </h1>
              <p className="mt-2 text-sm text-stone-500">
                Select the package that fits your vision to continue.
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2 text-sm text-stone-400 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Revise brief
            </button>
          </div>

          {/* ── Param chips ─────────────────────────────────── */}
          {extractedInput && (
            <div className="flex flex-wrap gap-2">
              {extractedInput.eventType && <Chip label={extractedInput.eventType} />}
              {extractedInput.guests && <Chip label={`${extractedInput.guests} guests`} />}
              {extractedInput.budget && (
                <Chip label={`₪${Number(extractedInput.budget).toLocaleString()} budget`} />
              )}
            </div>
          )}

          {/* ── AI Insight Banner ───────────────────────────── */}
          {summary && (
            <div
              className="rounded-2xl p-[1px]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(249,115,22,0.45) 0%, rgba(236,72,153,0.2) 55%, rgba(249,115,22,0.1) 100%)',
              }}
            >
              <div className="rounded-2xl bg-[#0c0b1a]/95 p-5 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-orange-500/20">
                    <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                  </div>
                  <p className="text-sm leading-relaxed text-stone-300">{summary}</p>
                </div>
                <div className="mt-4 flex items-center gap-4 pl-10">
                  <button
                    onClick={() => navigate('/create')}
                    className="text-xs font-medium text-orange-400 transition hover:text-orange-300"
                  >
                    Refine for my budget
                  </button>
                  <span className="text-stone-700">·</span>
                  <button className="text-xs text-stone-500 transition hover:text-stone-300">
                    Read full analysis
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Bundle cards ────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-3">
          {bundles.map((bundle, i) => {
            const cfg = TIER[bundle.label] ?? TIER.economical
            const [budgetText, budgetCls] = cfg.budget(bundle.fitsBudget)

            return (
              <motion.div
                key={bundle.label}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="relative"
              >
                {/* Gradient border wrapper for featured card */}
                <div
                  className={`rounded-2xl transition-all duration-200 ${cfg.featured ? 'p-[1px] shadow-[0_0_52px_-4px_rgba(249,115,22,0.38)]' : ''}`}
                  style={cfg.featured ? {
                    background: 'linear-gradient(145deg, rgba(249,115,22,0.7) 0%, rgba(236,72,153,0.5) 50%, rgba(249,115,22,0.25) 100%)',
                  } : undefined}
                >
                  <div className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#0e0d16] transition-all duration-200 ${cfg.featured ? 'border-transparent' : cfg.cardCls}`}>

                    {/* Recommended badge */}
                    {cfg.featured && (
                      <div className="absolute top-3.5 left-1/2 z-10 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-600 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-[0_0_16px_-2px_rgba(249,115,22,0.6)]">
                          Recommended
                        </span>
                      </div>
                    )}

                    {/* Card image */}
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={cfg.image}
                        alt={cfg.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d16] via-[#0e0d16]/20 to-transparent" />
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">

                      {/* Tier label + rating */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold tracking-tight ${cfg.color}`}>
                          ✦ {cfg.name}
                        </span>
                        {bundle.averageRating != null && (
                          <span className="flex items-center gap-1 text-xs text-stone-600">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {Number(bundle.averageRating).toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="mt-3.5">
                        <p className="font-serif leading-none text-white">
                          <span className="text-xl font-semibold text-stone-300">₪</span>
                          <span className="text-[2.6rem] font-bold">{Number(bundle.totalPrice).toLocaleString()}</span>
                        </p>
                        <p className={`mt-1.5 text-[11px] font-medium ${budgetCls}`}>{budgetText}</p>
                      </div>

                      {/* Services list */}
                      <div className="mt-4 flex-1 border-t border-white/[0.06] pt-4">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-stone-600">
                          {bundle.items.length} Services Included
                        </p>
                        <ul className="space-y-2.5">
                          {bundle.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-sm">
                              <CategoryIcon
                                category={item.category}
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400/60"
                              />
                              <span>
                                <span className="text-stone-200">{item.name}</span>
                                <span className="ml-1.5 text-[11px] text-stone-600">
                                  {item.category}
                                </span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA button */}
                      <button
                        onClick={() => handleSelect(bundle)}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${cfg.btnCls}`}
                      >
                        Select this bundle
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
