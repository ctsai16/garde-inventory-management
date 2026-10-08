import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext.jsx'
import { PlusIcon } from '../components/Icons.jsx'
import AddItemModal from '../components/AddItemModal.jsx'
import ItemDetailModal from '../components/ItemDetailModal.jsx'
import ItemBrowser from '../components/ItemBrowser.jsx'

function getStockBadge(item) {
  const isLow = item.quantity < item.minQuantity
  return { label: isLow ? 'LOW' : 'OK', tone: isLow ? 'danger' : 'success' }
}

export default function Inventory() {
  const { items, addItem, updateItem } = useInventory()
  const location = useLocation()
  const navigate = useNavigate()
  const [isAddModalOpen, setIsAddModalOpen] = useState(Boolean(location.state?.openAddItem))
  const [selectedItemId, setSelectedItemId] = useState(null)

  useEffect(() => {
    if (location.state?.openAddItem) navigate(location.pathname, { replace: true, state: null })
  }, [location, navigate])

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  )

  return (
    <>
      <div className="inv-header">
        <div className="inv-title">Inventory</div>
        <button type="button" className="add-item-btn" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon />
          Add Item
        </button>
      </div>

      <ItemBrowser
        items={items}
        emptyMessage="No items yet. Add your first item to get started."
        getBadge={getStockBadge}
        onItemClick={(item) => setSelectedItemId(item.id)}
      />

      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(item) => {
            addItem(item)
            setIsAddModalOpen(false)
          }}
        />
      )}

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
