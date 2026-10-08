import { useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'
import ItemDetailModal from '../components/ItemDetailModal.jsx'
import ItemBrowser from '../components/ItemBrowser.jsx'

function getNeedBadge(item) {
  return { label: `NEED ${item.minQuantity - item.quantity}`, tone: 'danger' }
}

export default function Reorder() {
  const { items, stats, updateItem } = useInventory()
  const [selectedItemId, setSelectedItemId] = useState(null)

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  )

  return (
    <>
      <div className="inv-title">Reorder</div>

      <ItemBrowser
        items={stats.lowStockItems}
        emptyMessage="Nothing to reorder. All items are stocked."
        getBadge={getNeedBadge}
        onItemClick={(item) => setSelectedItemId(item.id)}
      />

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItemId(null)}
          onSave={(updates) => updateItem(selectedItem.id, updates)}
        />
      )}
    </>
  )
}
