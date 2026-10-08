import { Routes, Route } from 'react-router-dom'
import { InventoryProvider } from './context/InventoryContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import Scan from './pages/Scan.jsx'
import Reorder from './pages/Reorder.jsx'
import Insights from './pages/Insights.jsx'
import Account from './pages/Account.jsx'

export default function App() {
  return (
    <InventoryProvider>
      <div className="app-shell">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/reorder" element={<Reorder />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </InventoryProvider>
  )
}
