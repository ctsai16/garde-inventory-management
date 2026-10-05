import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const InventoryContext = createContext(null)

const STORAGE_KEY = 'garde-inventory-items'

function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function InventoryProvider({ children }) {
  const [items, setItems] = useState(loadItems)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable or full; keep working in memory
    }
  }, [items])

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

  const value = useMemo(() => ({ items, stats, addItem, updateItem }), [items, stats, addItem, updateItem])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
