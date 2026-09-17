import { Routes, Route } from 'react-router-dom'
import { InventoryProvider } from './context/InventoryContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'

export default function App() {
  return (
    <InventoryProvider>
      <div className="app-shell">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </InventoryProvider>
  )
}
