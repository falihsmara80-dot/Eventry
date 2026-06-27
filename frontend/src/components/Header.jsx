import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="border-b border-slate-800/80">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="BundleAI" className="h-8 w-auto" />
          <span className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
            Home
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link to="/plan" className="text-slate-400 transition-colors hover:text-white">
            Quick plan
          </Link>
          <Link
            to="/plan-ai"
            className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-indigo-200 transition-colors hover:bg-indigo-500/20 hover:text-white"
          >
            Plan with AI
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
