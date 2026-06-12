import { Link } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

function Cancel() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center text-white">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
        <XCircle className="h-10 w-10 text-red-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Checkout cancelled
        </h1>
        <p className="max-w-md text-slate-400">
          No worries — your bundle hasn&apos;t been charged. You can head
          back and adjust your event details or try checkout again.
        </p>
      </div>
      <Link
        to="/plan"
        className="flex items-center gap-2 rounded-2xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-500"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to BundleAI
      </Link>
    </div>
  )
}

export default Cancel
