import { Routes, Route } from 'react-router-dom'
import { EventProvider } from './context/EventContext'
import Home from './pages/Home'
import EventPrompt from './pages/EventPrompt'
import BundleSelection from './pages/BundleSelection'
import BundleCustomization from './pages/BundleCustomization'
import EventDetails from './pages/EventDetails'
import PaymentCheckout from './pages/PaymentCheckout'

function App() {
  return (
    <EventProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<EventPrompt />} />
        <Route path="/results" element={<BundleSelection />} />
        <Route path="/customize" element={<BundleCustomization />} />
        <Route path="/logistics" element={<EventDetails />} />
        <Route path="/payment" element={<PaymentCheckout />} />
      </Routes>
    </EventProvider>
  )
}

export default App
