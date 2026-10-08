import { useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'

export default function InventoryCountModal({ onClose }) {
  const { items, saveCount } = useInventory()
  const [marks, setMarks] = useState({})
  const [actuals, setActuals] = useState({})
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)

  const checkedCount = items.filter((item) => marks[item.id]).length

  function mark(id, value) {
    setMarks((prev) => ({ ...prev, [id]: prev[id] === value ? undefined : value }))
    setError('')
  }

  function handleFinish() {
    if (checkedCount < items.length) {
      setError('Check every item to finish.')
      return
    }
    const results = items.map((item) => {
      const actualText = actuals[item.id]
      const hasActual = marks[item.id] === 'no' && actualText !== undefined && actualText !== ''
      return {
        itemId: item.id,
        name: item.name,
        unit: item.unit,
        recorded: item.quantity,
        status: marks[item.id] === 'yes' ? 'correct' : 'incorrect',
        actual: hasActual ? Number(actualText) : null,
      }
    })
    saveCount(results)
    setSummary({
      correct: results.filter((entry) => entry.status === 'correct').length,
      incorrect: results.filter((entry) => entry.status === 'incorrect').length,
      updated: results.filter((entry) => entry.actual !== null).length,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Inventory count</div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {summary ? (
          <>
            <div className="count-summary">
              <div className="count-summary-title">Count saved</div>
              <div className="count-summary-text">
                {summary.correct} correct, {summary.incorrect} need an update
                {summary.updated > 0 ? `. ${summary.updated} count${summary.updated === 1 ? '' : 's'} updated.` : '.'}
              </div>
            </div>
            <button type="button" className="cta-button modal-submit" onClick={onClose}>
              Done
            </button>
          </>
        ) : items.length === 0 ? (
          <div className="empty-state">No items to count yet. Add items first.</div>
        ) : (
          <>
            <div className="count-hint">Mark each item as correct or not. Enter the actual count for anything that's off.</div>
            <div className="count-progress">
              <div className="count-progress-fill" style={{ width: `${(checkedCount / items.length) * 100}%` }} />
            </div>
            <div className="count-progress-label">
              {checkedCount} of {items.length} checked
            </div>

            <div className="category-card count-list">
              {items.map((item) => (
                <div className="item-row" key={item.id}>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-meta">
                      {item.quantity} {item.unit} on record
                    </div>
                  </div>
                  {marks[item.id] === 'no' && (
                    <input
                      className="count-input"
                      type="number"
                      min="0"
                      placeholder="Actual"
                      aria-label={`Actual count for ${item.name}`}
                      value={actuals[item.id] ?? ''}
                      onChange={(event) => setActuals((prev) => ({ ...prev, [item.id]: event.target.value }))}
                    />
                  )}
                  <button
                    type="button"
                    className={`count-check no${marks[item.id] === 'no' ? ' on' : ''}`}
                    onClick={() => mark(item.id, 'no')}
                    aria-label={`Mark ${item.name} incorrect`}
                    aria-pressed={marks[item.id] === 'no'}
                  >
                    &#10005;
                  </button>
                  <button
                    type="button"
                    className={`count-check yes${marks[item.id] === 'yes' ? ' on' : ''}`}
                    onClick={() => mark(item.id, 'yes')}
                    aria-label={`Mark ${item.name} correct`}
                    aria-pressed={marks[item.id] === 'yes'}
                  >
                    &#10003;
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-actions count-actions">
              <button type="button" className="secondary-button" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="cta-button" onClick={handleFinish}>
                Finish count
              </button>
            </div>
            <div className="count-error">{error}</div>
          </>
        )}
      </div>
    </div>
  )
}
