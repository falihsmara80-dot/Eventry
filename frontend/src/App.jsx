import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import EventForm from './components/EventForm'
import BundlePreview from './components/BundlePreview'
import Success from './components/Success'
import Cancel from './components/Cancel'
import { API_BASE_URL } from './lib/api'

function PlanPage() {
  const [bundle, setBundle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate({ eventType, guests, budget }) {
    setLoading(true)
    setError(null)
    setBundle(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/bundle/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, guests, budget }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate bundle')
      }

      setBundle(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <EventForm onGenerate={handleGenerate} loading={loading} hasBundle={Boolean(bundle)} />
        <BundlePreview bundle={bundle} loading={loading} error={error} />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/success" element={<Success />} />
      <Route path="/cancel" element={<Cancel />} />
    </Routes>
  )
}

export default App
