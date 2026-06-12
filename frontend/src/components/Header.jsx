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
      </div>
    </header>
  )
}

export default Header
