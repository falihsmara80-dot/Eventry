import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FinalDetailsModal from './FinalDetailsModal'
import { API_BASE_URL } from '../lib/api'
import {
  Sparkles,
  Users,
  Wallet,
  PiggyBank,
  CreditCard,
  AlertCircle,
  MapPin,
  Trash2,
} from 'lucide-react'
import { CATEGORY_STYLES } from '../lib/categoryStyles'

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2, ease: 'easeIn' } },
}

function SummaryStat({ label, value, icon: Icon, tone }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span
        className={`text-xl font-semibold ${tone === 'negative' ? 'text-red-400' : 'text-white'}`}
      >
        {value}
      </span>
    </div>
  )
}

function ItemCard({ item, onRemove }) {
  const meta = CATEGORY_STYLES[item.category] ?? CATEGORY_STYLES.Other
  const Icon = meta.icon

  return (
    <motion.div
      layout
      variants={cardVariants}
      exit="exit"
      whileHover={{ scale: 1.03, boxShadow: '0 0 30px -8px rgba(99, 102, 241, 0.5)' }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        className="absolute right-3 top-3 z-10 rounded-full border border-slate-800 bg-slate-950/60 p-1.5 text-slate-500 transition-colors duration-150 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex items-center justify-between gap-2 pr-6">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.color}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {item.category}
        </span>
        <span className="text-xs text-slate-500">
          {item.quantity} {item.unit}
          {item.quantity === 1 ? '' : 's'}
        </span>
      </div>
      <p className="pr-4 font-medium leading-snug text-white">{item.name}</p>
      <div className="flex items-baseline justify-between border-t border-slate-800 pt-3 text-sm">
        <span className="text-slate-400">
          ${item.unitPrice.toFixed(2)} / {item.unit}
        </span>
        <span className="text-lg font-semibold text-white">
          ${item.totalPrice.toFixed(2)}
        </span>
      </div>
      {item.supplier && (
        <div className="mt-auto flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
          <div className="space-y-0.5">
            <p className="font-medium text-slate-300">{item.supplier.name}</p>
            <p className="text-slate-500">{item.supplier.location}</p>
            <p className="text-slate-600">via {item.supplier.matchedProduct}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
        />
      ))}
    </div>
  )
}

function ErrorState({ error }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p>{error}</p>
    </div>
  )
}

function BundlePreview({ bundle, loading, error }) {
  const [items, setItems] = useState([])
  const [loadedBundle, setLoadedBundle] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Sync local item state whenever a new bundle arrives, tagging each item
  // with a stable id so removals and exit animations key correctly.
  if (bundle && bundle !== loadedBundle) {
    setItems(bundle.items.map((item, i) => ({ ...item, _id: `${i}-${item.name}` })))
    setLoadedBundle(bundle)
    setCheckoutError(null)
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!bundle) return null

  const { eventType, guests, budget } = bundle

  const totalEstimatedPrice = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const remainingBudget = budget - totalEstimatedPrice

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item._id !== id))
  }

  async function handleCheckout(finalDetails) {
    setCheckoutLoading(true)
    setCheckoutError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          totalEstimatedPrice,
          items,
          finalDetails,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start checkout')
      }

      // eslint-disable-next-line react-hooks/immutability -- browser navigation on user action
      window.location.href = data.url
    } catch (err) {
      setCheckoutError(err.message)
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-2 gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:grid-cols-4">
        <SummaryStat label="Event" value={eventType} icon={Sparkles} />
        <SummaryStat label="Guests" value={guests} icon={Users} />
        <SummaryStat
          label="Estimated Total"
          value={`$${totalEstimatedPrice.toFixed(2)}`}
          icon={Wallet}
        />
        <SummaryStat
          label="Remaining Budget"
          value={`$${remainingBudget.toFixed(2)}`}
          icon={PiggyBank}
          tone={remainingBudget < 0 ? 'negative' : 'positive'}
        />
      </div>

      {/* Items grid */}
      {items.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} onRemove={() => removeItem(item._id)} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
          <Sparkles className="h-8 w-8" />
          <p className="font-medium text-slate-400">All items removed.</p>
          <p className="text-sm">Generate a new bundle to start over.</p>
        </div>
      )}

      {/* Checkout */}
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-white">Ready to bring it to life?</p>
          <p className="text-sm text-slate-400">
            You&apos;ll be redirected to Stripe to complete your purchase securely.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCheckoutError(null)
            setIsDetailsOpen(true)
          }}
          disabled={items.length === 0}
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CreditCard className="h-5 w-5" />
          Proceed to Checkout
        </button>
      </div>

      <FinalDetailsModal
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onConfirm={handleCheckout}
        submitting={checkoutLoading}
        error={checkoutError}
      />
    </div>
  )
}

export default BundlePreview
