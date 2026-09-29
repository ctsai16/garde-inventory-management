import { createContext, useContext, useMemo, useState } from 'react'

const InventoryContext = createContext(null)

const initialItems = []

export function InventoryProvider({ children }) {
  const [items] = useState(initialItems)

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

  const value = useMemo(() => ({ items, stats }), [items, stats])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
