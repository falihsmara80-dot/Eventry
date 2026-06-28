import { createContext, useContext, useState } from 'react'

const EventContext = createContext(null)

export function EventProvider({ children }) {
  const [planResult, setPlanResult] = useState(null)
  const [selectedBundle, setSelectedBundle] = useState(null)
  const [customizedBundle, setCustomizedBundle] = useState(null)
  const [logistics, setLogistics] = useState(null)

  return (
    <EventContext.Provider value={{
      planResult, setPlanResult,
      selectedBundle, setSelectedBundle,
      customizedBundle, setCustomizedBundle,
      logistics, setLogistics,
    }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error('useEvent must be used within EventProvider')
  return ctx
}
