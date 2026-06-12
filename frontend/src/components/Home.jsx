import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const MotionLink = motion.create(Link)

const PARTICLES = [
  { top: '12%', left: '8%', size: 'h-2 w-2', color: 'bg-blue-400/40' },
  { top: '22%', left: '85%', size: 'h-1.5 w-1.5', color: 'bg-fuchsia-400/40' },
  { top: '68%', left: '92%', size: 'h-2.5 w-2.5', color: 'bg-amber-300/30' },
  { top: '78%', left: '15%', size: 'h-2 w-2', color: 'bg-emerald-300/30' },
  { top: '40%', left: '50%', size: 'h-1.5 w-1.5', color: 'bg-cyan-300/30' },
  { top: '8%', left: '45%', size: 'h-1 w-1', color: 'bg-pink-300/40' },
  { top: '90%', left: '55%', size: 'h-1.5 w-1.5', color: 'bg-blue-300/30' },
  { top: '55%', left: '5%', size: 'h-1 w-1', color: 'bg-violet-300/40' },
]

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background flair: glowing blurred orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-900/30 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-900/20 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-indigo-800/20 blur-[120px]" />
      </div>

      {/* Background flair: scattered confetti particles */}
      <div className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${p.size} ${p.color}`}
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </div>

      {/* Top navigation */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Home
          </Link>
          <button
            type="button"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Log In
          </button>
        </nav>
      </header>

      {/* Hero section */}
      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:py-28">
        {/* Left column: copy & actions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
            Crafting unforgettable events. Simplified.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Seamless planning, coordination, and execution at your fingertips.
            Evntry guides you every step.
          </p>

          <div className="mt-8">
            <MotionLink
              to="/plan"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              Plan Now
              <ArrowRight className="h-5 w-5" />
            </MotionLink>
          </div>
        </motion.div>

        {/* Right column: logo */}
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <img src="/logo.png" alt="Evntry icon" className="w-full max-w-xs sm:max-w-sm" />
          <h2 className="mt-6 text-6xl font-extrabold tracking-wide text-white">
            Eventry
          </h2>
        </motion.div>
      </main>
    </div>
  )
}

export default Home
