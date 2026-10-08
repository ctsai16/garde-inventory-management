import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const InventoryContext = createContext(null)

const STORAGE_KEY = 'garde-inventory-items'
const CATEGORIES_STORAGE_KEY = 'garde-inventory-custom-categories'

export const OTHER_CATEGORY_VALUE = '__other__'
export const DEFAULT_CATEGORIES = ['Alcohol', 'Meat', 'Beverages', 'Dry Goods', 'Produce', 'Condiments']

function loadList(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // storage unavailable or full; keep working in memory
  }
}

export function InventoryProvider({ children }) {
  const [items, setItems] = useState(() => loadList(STORAGE_KEY))
  const [customCategories, setCustomCategories] = useState(() => loadList(CATEGORIES_STORAGE_KEY))

  useEffect(() => saveList(STORAGE_KEY, items), [items])
  useEffect(() => saveList(CATEGORIES_STORAGE_KEY, customCategories), [customCategories])

  const categories = useMemo(() => {
    const all = [...DEFAULT_CATEGORIES, ...customCategories]
    items.forEach((item) => {
      if (!all.includes(item.category)) all.push(item.category)
    })
    return all
  }, [customCategories, items])

  const resolveCategory = useCallback(
    (name) => {
      const trimmed = name.trim()
      const existing = categories.find((category) => category.toLowerCase() === trimmed.toLowerCase())
      if (existing) return existing
      setCustomCategories((prev) => [...prev, trimmed])
      return trimmed
    },
    [categories],
  )

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const nextId = prev.reduce((max, existing) => Math.max(max, existing.id), 0) + 1
      return [...prev, { id: nextId, unitPrice: 0, ...item }]
    })
  }, [])

  const updateItem = useCallback((id, updates) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }, [])

  const stats = useMemo(() => {
    const lowStockItems = items.filter((item) => item.quantity < item.minQuantity)
    const inventoryValue = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const okCount = items.length - lowStockItems.length
    const healthPercent = items.length === 0 ? 100 : Math.round((okCount / items.length) * 100)

    return {
      lowStockCount: lowStockItems.length,
      lowStockItems,
      inventoryValue,
      healthPercent,
    }
  }, [items])

  const value = useMemo(
    () => ({ items, stats, categories, addItem, updateItem, resolveCategory }),
    [items, stats, categories, addItem, updateItem, resolveCategory],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
