import { useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'
import { SearchIcon, FilterIcon, PlusIcon } from '../components/Icons.jsx'
import AddItemModal from '../components/AddItemModal.jsx'
import ItemDetailModal from '../components/ItemDetailModal.jsx'

const CATEGORY_ORDER = ['Alcohol', 'Meat', 'Beverages', 'Dry Goods', 'Produce', 'Condiments']
const CHIP_ORDER = ['All', 'Meat', 'Produce', 'Alcohol', 'Beverages', 'Dry Goods', 'Condiments']

export default function Inventory() {
  const { items, addItem, updateItem } = useInventory()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState(null)

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  )

  const chips = useMemo(() => {
    const present = new Set(items.map((item) => item.category))
    return CHIP_ORDER.filter((chip) => chip === 'All' || present.has(chip))
  }, [items])

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesSearch = term === '' || item.name.toLowerCase().includes(term)
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [items, search, activeCategory])

  const groupedSections = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: filteredItems.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0)
  }, [filteredItems])

  return (
    <>
      <div className="inv-header">
        <div className="inv-title">Inventory</div>
        <button type="button" className="add-item-btn" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon />
          Add Item
        </button>
      </div>

      <div className="search-bar">
        <SearchIcon />
        <label htmlFor="inv-search" className="sr-only">
          Search inventory
        </label>
        <input
          id="inv-search"
          type="text"
          placeholder="Search items..."
          className="search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FilterIcon />
      </div>

      <div className="chip-row">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className={`chip${activeCategory === chip ? ' active' : ''}`}
            onClick={() => setActiveCategory(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {groupedSections.length === 0 && (
        <div className="empty-state">
          {items.length === 0 ? 'No items yet. Add your first item to get started.' : 'No items match your search.'}
        </div>
      )}

      {groupedSections.map((group) => (
        <div className="category-group" key={group.category}>
          <div className="category-heading">{group.category}</div>
          <div className="category-card">
            {group.items.map((item) => {
              const isLow = item.quantity < item.minQuantity
              const barColor = isLow ? 'var(--color-danger)' : 'var(--color-success)'
              const badgeColor = isLow ? 'var(--color-danger)' : 'var(--color-success)'
              const badgeBg = isLow ? 'var(--color-danger-bg)' : 'var(--color-success-bg)'
              return (
                <div
                  className="item-row item-row-clickable"
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedItemId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedItemId(item.id)
                    }
                  }}
                >
                  <div className="item-bar" style={{ background: barColor }} />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-meta">
                      {item.quantity} {item.unit} &middot; min {item.minQuantity}
                    </div>
                  </div>
                  <div className="item-badge" style={{ color: badgeColor, background: badgeBg }}>
                    {isLow ? 'LOW' : 'OK'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

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
