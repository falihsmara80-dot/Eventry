import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function AuthModal({ onSuccess, onClose }) {
  const [tab, setTab] = useState('login')
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function set(field) {
    return (e) => { setForm((f) => ({ ...f, [field]: e.target.value })); setError('') }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (tab === 'register') {
      if (!form.name.trim()) { setError('Please enter your name.'); return }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    }

    setLoading(true)
    // Simulate network delay — replace with real API call when ready
    setTimeout(() => { setLoading(false); onSuccess() }, 800)
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        {/* Panel */}
        <motion.div
          key="panel"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-[0_0_80px_-10px_rgba(249,115,22,0.2)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Brand mark */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-[0_0_16px_-2px_rgba(249,115,22,0.55)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Eventry</span>
          </div>

          {/* Tab switcher */}
          <div className="mb-7 flex rounded-xl border border-white/8 bg-white/[0.04] p-1">
            {['login', 'register'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition ${
                  tab === t
                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-[0_0_16px_-4px_rgba(249,115,22,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — register only */}
            <AnimatePresence initial={false}>
              {tab === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Field icon={<User className="h-4 w-4" />} placeholder="Full name" type="text" value={form.name} onChange={set('name')} />
                </motion.div>
              )}
            </AnimatePresence>

            <Field icon={<Mail className="h-4 w-4" />} placeholder="Email address" type="email" value={form.email} onChange={set('email')} />

            <div className="relative">
              <Field
                icon={<Lock className="h-4 w-4" />}
                placeholder="Password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {tab === 'register' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Field icon={<Lock className="h-4 w-4" />} placeholder="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(249,115,22,0.55)] transition hover:shadow-[0_0_32px_-2px_rgba(236,72,153,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : tab === 'login' ? 'Sign In & Continue' : 'Create Account & Continue'}
            </button>
          </form>

          {tab === 'login' && (
            <p className="mt-5 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <button onClick={() => setTab('register')} className="text-orange-400 hover:text-orange-300 font-medium">
                Register free
              </button>
            </p>
          )}
          {tab === 'register' && (
            <p className="mt-5 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button onClick={() => setTab('login')} className="text-orange-400 hover:text-orange-300 font-medium">
                Sign in
              </button>
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function Field({ icon, placeholder, type, value, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-3 transition focus-within:border-orange-500/50 focus-within:bg-white/[0.06]">
      <span className="flex-shrink-0 text-slate-500">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
      />
    </div>
  )
}
