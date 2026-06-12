import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

function Success() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-white">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Payment successful
        </h1>
        <p className="max-w-md text-slate-400">
          Thanks for booking with BundleAI! Your suppliers will be in touch
          shortly to confirm the details of your event.
        </p>
      </div>
      <Link
        to="/plan"
        className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
      >
        <ArrowLeft className="h-5 w-5" />
        Plan another event
      </Link>
    </div>
  )
}

export default Success
