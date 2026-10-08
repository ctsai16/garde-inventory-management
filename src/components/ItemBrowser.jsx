import { useMemo, useState } from 'react'
import { useInventory } from '../context/InventoryContext.jsx'
import { SearchIcon, FilterIcon } from './Icons.jsx'

const DEFAULT_CHIP_ORDER = ['Meat', 'Produce', 'Alcohol', 'Beverages', 'Dry Goods', 'Condiments']

const TONES = {
  danger: { color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
  success: { color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
}

export default function ItemBrowser({ items, emptyMessage, getBadge, onItemClick }) {
  const { categories } = useInventory()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const chips = useMemo(() => {
    const present = new Set(items.map((item) => item.category))
    const order = [...DEFAULT_CHIP_ORDER, ...categories.filter((category) => !DEFAULT_CHIP_ORDER.includes(category))]
    return ['All', ...order.filter((chip) => present.has(chip))]
  }, [items, categories])

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesSearch = term === '' || item.name.toLowerCase().includes(term)
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [items, search, activeCategory])

  const groupedSections = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: filteredItems.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0)
  }, [filteredItems, categories])

  return (
    <>
      <div className="search-bar">
        <SearchIcon />
        <label htmlFor="inv-search" className="sr-only">
          Search items
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
        <div className="empty-state">{items.length === 0 ? emptyMessage : 'No items match your search.'}</div>
      )}

      {groupedSections.map((group) => (
        <div className="category-group" key={group.category}>
          <div className="category-heading">{group.category}</div>
          <div className="category-card">
            {group.items.map((item) => {
              const badge = getBadge(item)
              const tone = TONES[badge.tone]
              const clickProps = onItemClick
                ? {
                    className: 'item-row item-row-clickable',
                    role: 'button',
                    tabIndex: 0,
                    onClick: () => onItemClick(item),
                    onKeyDown: (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onItemClick(item)
                      }
                    },
                  }
                : { className: 'item-row' }
              return (
                <div key={item.id} {...clickProps}>
                  <div className="item-bar" style={{ background: tone.color }} />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-meta">
                      {item.quantity} {item.unit} &middot; min {item.minQuantity}
                    </div>
                  </div>
                  <div className="item-badge" style={{ color: tone.color, background: tone.bg }}>
                    {badge.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </>
  )
}
