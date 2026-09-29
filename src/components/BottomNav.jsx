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
      <NavLink to="/scan" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <ScanIcon />
        <span>Scan</span>
      </NavLink>
      <NavLink to="/reorder" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <ReorderIcon />
        <span>Reorder</span>
      </NavLink>
      <NavLink to="/insights" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <InsightsIcon />
        <span>Insights</span>
      </NavLink>
    </nav>
  )
}
