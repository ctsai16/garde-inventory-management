import { useInventory } from '../context/InventoryContext.jsx'

function formatTimestamp(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Account() {
  const { countHistory } = useInventory()
  const entries = [...countHistory].reverse()

  return (
    <>
      <div className="inv-title">Account</div>

      <div className="section-label">Inventory count history</div>
      {entries.length === 0 ? (
        <div className="empty-state">No counts yet. Tap Start Inventory Count on the home screen.</div>
      ) : (
        <div className="history-list">
          {entries.map((entry) => {
            const correct = entry.results.filter((result) => result.status === 'correct').length
            const flagged = entry.results.filter((result) => result.status === 'incorrect')
            return (
              <div className="history-card" key={entry.id}>
                <div className="history-time">{formatTimestamp(entry.date)}</div>
                <div className="history-summary">
                  {correct} of {entry.results.length} correct
                </div>
                {flagged.map((result) => (
                  <div className="history-flag" key={result.itemId}>
                    {result.name}: {result.recorded} {result.unit} on record
                    {result.actual !== null ? `, counted ${result.actual}` : ', no count entered'}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      <button type="button" className="secondary-button signout-button" disabled>
        Sign out
      </button>
      <div className="signout-note">Available once login is added.</div>
    </>
  )
}
