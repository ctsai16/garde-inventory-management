import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const InventoryContext = createContext(null)

const initialItems = []

export function InventoryProvider({ children }) {
  const [items, setItems] = useState(initialItems)

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const nextId = prev.reduce((max, existing) => Math.max(max, existing.id), 0) + 1
      return [...prev, { id: nextId, unitPrice: 0, ...item }]
    })
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

  const value = useMemo(() => ({ items, stats, addItem }), [items, stats, addItem])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
