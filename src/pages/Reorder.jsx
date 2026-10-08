import { useInventory } from '../context/InventoryContext.jsx'

export default function Reorder() {
  const { stats } = useInventory()
  const { lowStockItems } = stats

  return (
    <>
      <div className="inv-title">Reorder</div>

      {lowStockItems.length === 0 ? (
        <div className="empty-state">Nothing to reorder. All items are stocked.</div>
      ) : (
        <div className="category-card">
          {lowStockItems.map((item) => (
            <div className="item-row" key={item.id}>
              <div className="item-bar" style={{ background: 'var(--color-danger)' }} />
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">
                  {item.quantity} {item.unit} &middot; min {item.minQuantity}
                </div>
              </div>
              <div className="item-badge" style={{ color: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
                NEED {item.minQuantity - item.quantity}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
