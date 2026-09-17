import { NavLink } from 'react-router-dom'
import { HomeIcon, InventoryIcon, ScanIcon, ReorderIcon, InsightsIcon } from './Icons.jsx'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <HomeIcon />
        <span>Home</span>
      </NavLink>
      <NavLink to="/inventory" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <InventoryIcon />
        <span>Inventory</span>
      </NavLink>
      <span className="nav-item" aria-disabled="true">
        <ScanIcon />
        <span>Scan</span>
      </span>
      <span className="nav-item" aria-disabled="true">
        <ReorderIcon />
        <span>Reorder</span>
      </span>
      <span className="nav-item" aria-disabled="true">
        <InsightsIcon />
        <span>Insights</span>
      </span>
    </nav>
  )
}
