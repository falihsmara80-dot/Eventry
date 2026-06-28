import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Calendar, Star, Shield } from 'lucide-react'
import AuthModal from '../components/AuthModal'

const STATS = [
  { icon: Calendar, value: '500+',  label: 'Events Planned' },
  { icon: Star,     value: '4.9/5', label: 'Customer Rating' },
  { icon: Shield,   value: '100%',  label: 'Satisfaction' },
]

const IMAGES = {
  tall:     'https://i.pinimg.com/736x/22/d6/e3/22d6e31f959e30ae8d3d560719c210a4.jpg',
  ballroom: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop',
  wedding:  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
  party:    'https://i.pinimg.com/736x/34/73/d0/3473d0c213356986d8c7031c4b987ad9.jpg',
}

export default function Home() {
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0b12] text-white">

      {/* ── Ambient glow blobs ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-orange-600/[0.07] blur-[140px]" />
        <div className="absolute top-1/4 -right-48 h-[600px] w-[600px] rounded-full bg-purple-700/[0.09] blur-[130px]" />
        <div className="absolute bottom-10 left-1/3 h-[450px] w-[450px] rounded-full bg-orange-500/[0.05] blur-[110px]" />
        {/* Particle dots */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full"
            style={{
              left: `${(i * 37 + 11) % 95}%`,
              top:  `${(i * 53 + 7)  % 85}%`,
              background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#a855f7' : '#ec4899',
              opacity: 0.25 + (i % 4) * 0.08,
            }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: (i * 0.4) % 3 }}
          />
        ))}
      </div>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-14">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-[0_0_22px_-2px_rgba(249,115,22,0.65)]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-[1.35rem] font-bold tracking-tight">Eventry</span>
        </div>

        <nav className="flex items-center gap-2">
          <button className="hidden px-4 py-2 text-sm font-medium text-slate-400 transition hover:text-white sm:block">
            Login
          </button>
          <button className="hidden rounded-lg border border-slate-700/70 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white sm:block">
            Sign Up
          </button>
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-6 pt-10 pb-4 md:grid-cols-2 md:gap-6 md:px-14 lg:pt-14">

        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <h1 className="text-[3.1rem] font-extrabold leading-[1.08] tracking-tight lg:text-[3.6rem]">
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">
              Effortlessly
            </span>{' '}
            plan your
            <br />perfect events
          </h1>

          <p className="mt-6 max-w-[440px] text-[0.95rem] leading-[1.75] text-gray-400">
            Make event planning easy with our comprehensive platform. From start to finish,
            we streamline the process and offer dedicated support to make your event a success.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-4px_rgba(249,115,22,0.6)] transition-shadow hover:shadow-[0_0_40px_-2px_rgba(236,72,153,0.65)]"
            >
              Plan an Event <ArrowRight className="h-4 w-4" />
            </motion.button>

          </div>

          {/* Curved glow accent lines */}
          <div className="relative mt-12 h-10 w-full overflow-visible">
            <svg
              viewBox="0 0 540 44"
              className="absolute -left-6 w-[125%] opacity-70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-10 32 C60 4, 160 44, 280 22 S420 2, 550 28"
                stroke="url(#g1)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M-10 40 C80 16, 200 50, 300 32 S440 10, 550 36"
                stroke="url(#g2)"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#f97316" stopOpacity="0" />
                  <stop offset="25%"  stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="65%"  stopColor="#ec4899" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#a855f7" stopOpacity="0" />
                  <stop offset="35%"  stopColor="#ec4899" stopOpacity="0.5" />
                  <stop offset="75%"  stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Right — image mosaic */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="grid h-[490px] grid-cols-[2fr_3fr] grid-rows-[3fr_2fr] gap-3"
        >
          {/* Tall vertical — spans both rows */}
          <div className="row-span-2 overflow-hidden rounded-2xl">
            <img
              src={IMAGES.tall}
              alt="Woman dancing"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>

          {/* Celebration GIF — top right */}
          <div className="relative w-full h-[250px] md:h-full min-h-[250px] rounded-2xl overflow-hidden col-span-1 row-span-1 shadow-lg bg-gray-900 border border-white/10">
            <img
              src={IMAGES.ballroom}
              alt="Elegant ballroom reception"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* Bottom two small photos */}
          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={IMAGES.wedding}
                alt="Wedding ceremony"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img
                src={IMAGES.party}
                alt="Friends celebrating with balloons"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ROW ──────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-6 py-10 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm sm:grid-cols-3"
        >
          {STATS.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                <Icon className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Auth modal — shown when user clicks Plan an Event */}
      {showAuth && (
        <AuthModal
          onSuccess={() => { setShowAuth(false); navigate('/create') }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  )
}
