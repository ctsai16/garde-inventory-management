import { createContext, useContext, useMemo, useState } from 'react'

const InventoryContext = createContext(null)

const initialItems = [
  { id: 1, name: 'Soju', quantity: 12, unit: 'bottles', minQuantity: 24, category: 'Alcohol', unitPrice: 8 },
  { id: 2, name: 'Pork Belly', quantity: 8, unit: 'lbs', minQuantity: 20, category: 'Meat', unitPrice: 6 },
  { id: 3, name: 'Kimchi', quantity: 18, unit: 'containers', minQuantity: 10, category: 'Produce', unitPrice: 12 },
  { id: 4, name: 'Coca-Cola', quantity: 14, unit: 'cans', minQuantity: 48, category: 'Beverages', unitPrice: 1.5 },
  { id: 5, name: 'Rice', quantity: 35, unit: 'lbs', minQuantity: 20, category: 'Dry Goods', unitPrice: 1.2 },
]

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
