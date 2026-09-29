function formatExpiration(expirationDate) {
  if (!expirationDate) return 'Not set'
  const [year, month, day] = expirationDate.split('-')
  return `${month}/${day}/${year}`
}

export default function ItemDetailModal({ item, onClose }) {
  const isLow = item.quantity < item.minQuantity

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{item.name}</div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="detail-badge-row">
          <span className="detail-category-pill">{item.category}</span>
          <span
            className="item-badge"
            style={{
              color: isLow ? 'var(--color-danger)' : 'var(--color-success)',
              background: isLow ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
            }}
          >
            {isLow ? 'LOW' : 'OK'}
          </span>
        </div>

        <div className="detail-row">
          <div className="field-label">Description</div>
          <div className="detail-value">{item.description || 'No description added'}</div>
        </div>

        <div className="field-row">
          <div className="detail-row">
            <div className="field-label">Count</div>
            <div className="detail-value">
              {item.quantity} {item.unit}
            </div>
          </div>
          <div className="detail-row">
            <div className="field-label">Minimum quantity</div>
            <div className="detail-value">{item.minQuantity}</div>
          </div>
        </div>

        <div className="detail-row">
          <div className="field-label">Expiration date</div>
          <div className="detail-value">{formatExpiration(item.expirationDate)}</div>
        </div>
      </div>
    </div>
  )
}
