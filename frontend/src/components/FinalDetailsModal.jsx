import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CalendarDays,
  Clock,
  MapPin,
  NotebookPen,
  CreditCard,
  Loader2,
  AlertCircle,
} from 'lucide-react'

function FinalDetailsModal({ open, onClose, onConfirm, submitting, error }) {
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [touched, setTouched] = useState(false)

  const missingDate = touched && !eventDate.trim()
  const missingTime = touched && !eventTime.trim()
  const missingLocation = touched && !location.trim()

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)

    if (!eventDate.trim() || !eventTime.trim() || !location.trim()) return

    onConfirm({ eventDate, eventTime, location: location.trim(), notes: notes.trim() })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={submitting ? undefined : onClose}
          />

          <motion.div
            className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-start justify-between border-b border-slate-800 p-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Final Details</h2>
                <p className="mt-1 text-sm text-slate-400">
                  A few last things before we lock in your suppliers.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close"
                className="rounded-full border border-slate-800 bg-slate-950/60 p-1.5 text-slate-500 transition-colors hover:border-slate-700 hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                {/* Date & time */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`mt-2 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500 ${
                        missingDate ? 'border-red-500/60' : 'border-slate-700'
                      }`}
                    />
                    {missingDate && (
                      <p className="mt-1 text-xs text-red-400">Date is required.</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Clock className="h-4 w-4 text-slate-500" />
                      Event Time
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className={`mt-2 w-full rounded-lg border bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500 ${
                        missingTime ? 'border-red-500/60' : 'border-slate-700'
                      }`}
                    />
                    {missingTime && (
                      <p className="mt-1 text-xs text-red-400">Time is required.</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    Event Location / Venue Address
                  </label>
                  <textarea
                    rows={2}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="123 Main St, Suite 4 — or your home address"
                    className={`mt-2 w-full resize-none rounded-lg border bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500 ${
                      missingLocation ? 'border-red-500/60' : 'border-slate-700'
                    }`}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Even if you booked a venue through us, let us know the room number or
                    address if it&apos;s at your own place.
                  </p>
                  {missingLocation && (
                    <p className="mt-1 text-xs text-red-400">Location is required.</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <NotebookPen className="h-4 w-4 text-slate-500" />
                    Special Instructions &amp; Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any dietary restrictions, parking instructions, or specific requests for the suppliers?"
                    className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Any dietary restrictions, parking instructions, or specific requests for the
                    suppliers?
                  </p>
                </div>

                {error && (
                  <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-800 p-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Confirm &amp; Pay
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default FinalDetailsModal
