import { useState } from 'react'
import { ThemeProvider } from './theme/ThemeContext'
import Navbar from './components/Navbar'
import MapView from './views/MapView'
import Dashboard from './views/Dashboard'

export default function App() {
  const [view, setView] = useState('map') // 'map' | 'dashboard'

  return (
    <ThemeProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-agro-bg text-agro-text">
        <Navbar view={view} onChange={setView} />
        <main className="relative min-h-0 flex-1">
          {view === 'map' ? <MapView /> : <Dashboard />}
        </main>
      </div>
    </ThemeProvider>
  )
}
