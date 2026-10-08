import { useNavigate } from 'react-router-dom'

export default function Scan() {
  const navigate = useNavigate()

  return (
    <>
      <div className="inv-title">Scan</div>
      <div className="scan-actions">
        <button type="button" className="scan-option scan-option-secondary" disabled>
          Scan Invoice
          <span className="scan-option-sub">Coming soon</span>
        </button>
        <button
          type="button"
          className="scan-option scan-option-primary"
          onClick={() => navigate('/inventory', { state: { openAddItem: true } })}
        >
          Add Items Manually
        </button>
      </div>
    </>
  )
}
