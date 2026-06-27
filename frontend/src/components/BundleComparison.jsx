import { motion } from 'framer-motion'
import {
  Star,
  CheckCircle2,
  XCircle,
  Crown,
  Leaf,
  Wallet,
  MapPin,
} from 'lucide-react'
import { categoryStyle } from '../lib/categoryStyles'

// Per-tier visual identity. Labels come straight from the algorithm output.
const TIER_META = {
  economical: {
    title: 'Economical',
    blurb: 'Smart value',
    icon: Leaf,
    accent: 'text-emerald-300',
    ring: 'border-emerald-500/40 ring-emerald-500/30',
    glow: 'shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)]',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  quality: {
    title: 'Quality',
    blurb: 'Best experience',
    icon: Crown,
    accent: 'text-amber-300',
    ring: 'border-amber-500/40 ring-amber-500/30',
    glow: 'shadow-[0_0_30px_-10px_rgba(245,158,11,0.5)]',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  budget: {
    title: 'Budget',
    blurb: 'Lowest spend',
    icon: Wallet,
    accent: 'text-sky-300',
    ring: 'border-sky-500/40 ring-sky-500/30',
    glow: 'shadow-[0_0_30px_-10px_rgba(56,189,248,0.5)]',
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  },
}

const TIER_ORDER = ['economical', 'quality', 'budget']

const usd = (n) => `$${Number(n ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function Stars({ rating }) {
  // averageRating can be null when no supplier in the bundle is rated.
  if (rating == null) {
    return <span className="text-sm text-slate-500">No ratings</span>
  }
  const value = Number(rating)
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-slate-300">{value.toFixed(1)}</span>
    </span>
  )
}

function FitsBudgetBadge({ fits }) {
  return fits ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Fits budget
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300">
      <XCircle className="h-3.5 w-3.5" />
      Over budget
    </span>
  )
}

function ItemRow({ item }) {
  const meta = categoryStyle(item.category)
  const Icon = meta.icon
  return (
    <li className="flex items-start gap-3 border-t border-slate-800/80 py-2.5 first:border-t-0">
      <span className={`mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border ${meta.color}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">{item.name}</p>
        <p className="text-xs text-slate-500">
          {item.quantity} {item.unit}
          {item.quantity === 1 ? '' : 's'} · {usd(item.unitPrice)} each
        </p>
        {item.supplier && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="h-3 w-3" />
            {item.supplier.name}
            {item.supplier.location ? ` · ${item.supplier.location}` : ''}
            {item.supplier.rating != null && (
              <span className="inline-flex items-center gap-0.5 text-amber-400/80">
                <Star className="h-3 w-3 fill-amber-400/80 text-amber-400/80" />
                {Number(item.supplier.rating).toFixed(1)}
              </span>
            )}
          </p>
        )}
      </div>
      <span className="flex-shrink-0 text-sm font-semibold text-white">{usd(item.totalPrice)}</span>
    </li>
  )
}

function BundleCard({ bundle, highlight }) {
  const meta = TIER_META[bundle.label] ?? TIER_META.economical
  const TierIcon = meta.icon

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className={`flex flex-col rounded-3xl border bg-slate-900/60 p-5 ${
        highlight ? `${meta.ring} ring-1 ${meta.glow}` : 'border-slate-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${meta.badge}`}>
            <TierIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className={`text-lg font-semibold ${meta.accent}`}>{meta.title}</h3>
            <p className="text-xs text-slate-500">{meta.blurb}</p>
          </div>
        </div>
        {highlight && (
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.badge}`}>
            Pick
          </span>
        )}
      </div>

      {/* Headline stats */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
          <p className="text-2xl font-bold text-white">{usd(bundle.totalPrice)}</p>
        </div>
        <Stars rating={bundle.averageRating} />
      </div>

      <div className="mt-3">
        <FitsBudgetBadge fits={bundle.fitsBudget} />
      </div>

      {/* Items */}
      <ul className="mt-4 flex-1">
        {(bundle.items ?? []).map((item, i) => (
          <ItemRow key={`${item.name}-${i}`} item={item} />
        ))}
      </ul>
    </motion.div>
  )
}

/**
 * Renders the three algorithm bundles side by side.
 *
 * @param {{ result: { eventType, guests, budget, bundles: Array } }} props
 */
function BundleComparison({ result }) {
  if (!result || !Array.isArray(result.bundles) || result.bundles.length === 0) {
    return null
  }

  // Order tiers consistently; "quality" is highlighted as the showcase pick.
  const bundles = [...result.bundles].sort(
    (a, b) => TIER_ORDER.indexOf(a.label) - TIER_ORDER.indexOf(b.label)
  )

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 lg:grid-cols-3"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {bundles.map((bundle) => (
        <BundleCard key={bundle.label} bundle={bundle} highlight={bundle.label === 'quality'} />
      ))}
    </motion.div>
  )
}

export default BundleComparison
