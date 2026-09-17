import { Link } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext.jsx'
import {
  WarningTriangleIcon,
  ClockIcon,
  DollarIcon,
  ExpiringIcon,
  ArrowRightIcon,
  CameraIconSmall,
  ChecklistIconSmall,
  InvoiceIconSmall,
} from '../components/Icons.jsx'

function healthMessage(healthPercent, lowStockCount) {
  const level = healthPercent >= 80 ? 'Good' : healthPercent >= 50 ? 'Fair' : 'Needs attention'
  const itemWord = lowStockCount === 1 ? 'item needs' : 'items need'
  return `${level} — ${lowStockCount} ${itemWord} attention before service`
}

export default function Dashboard() {
  const { stats } = useInventory()
  const { lowStockCount, inventoryValue, healthPercent } = stats
  const ringDegrees = Math.round((healthPercent / 100) * 360)

  return (
    <>
      <div className="dash-header">
        <div>
          <div className="dash-eyebrow">Bincho BBQ &amp; Bar</div>
          <div className="dash-greeting">Good afternoon, Jordan</div>
        </div>
        <div className="dash-avatar">J</div>
      </div>

      <div className="health-card">
        <div
          className="health-ring"
          style={{
            background: `conic-gradient(#7FBF9E 0deg ${ringDegrees}deg, rgba(255,255,255,0.18) ${ringDegrees}deg 360deg)`,
          }}
        >
          <div className="health-ring-inner">{healthPercent}%</div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="health-title">Inventory Health</div>
          <div className="health-subtitle">{healthMessage(healthPercent, lowStockCount)}</div>
        </div>
      </div>

      <div className="stats-grid">
        <Link to="/inventory" className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
            <WarningTriangleIcon />
          </div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            {lowStockCount}
          </div>
          <div className="stat-label">Low-stock items</div>
        </Link>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <ClockIcon />
          </div>
          <div className="stat-value">2</div>
          <div className="stat-label">Running out soon</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-icon-green-bg)', color: 'var(--color-primary)' }}>
            <DollarIcon />
          </div>
          <div className="stat-value">${inventoryValue.toLocaleString()}</div>
          <div className="stat-label">Est. inventory value</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <ExpiringIcon />
          </div>
          <div className="stat-value">1</div>
          <div className="stat-label">Expiring soon</div>
        </div>
      </div>

      <button type="button" className="cta-button">
        <ArrowRightIcon />
        Start Inventory Count
      </button>

      <div className="section-label">Quick actions</div>
      <div className="quick-actions-grid">
        <button type="button" className="quick-action">
          <div className="quick-action-icon" style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>
            <CameraIconSmall />
          </div>
          <span className="quick-action-label">AI Camera Scan</span>
        </button>
        <button type="button" className="quick-action">
          <div className="quick-action-icon" style={{ background: 'var(--color-icon-green-bg)', color: 'var(--color-primary)' }}>
            <ChecklistIconSmall />
          </div>
          <span className="quick-action-label">Smart Reorder</span>
        </button>
        <button type="button" className="quick-action">
          <div className="quick-action-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <InvoiceIconSmall />
          </div>
          <span className="quick-action-label">Scan Invoice</span>
        </button>
      </div>
    </>
  )
}
