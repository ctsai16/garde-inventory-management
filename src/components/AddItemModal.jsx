import { useState } from 'react'

const CATEGORIES = ['Alcohol', 'Meat', 'Beverages', 'Dry Goods', 'Produce']

export default function AddItemModal({ onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [minQuantity, setMinQuantity] = useState('')
  const [expirationDate, setExpirationDate] = useState('')

  const canSubmit = name.trim() !== '' && unit.trim() !== '' && quantity !== '' && minQuantity !== ''

  function handleSubmit(event) {
    event.preventDefault()
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      quantity: Number(quantity),
      unit: unit.trim(),
      minQuantity: Number(minQuantity),
      expirationDate: expirationDate || null,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Add Item</div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form className="field-list" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="item-name">
              Item name
            </label>
            <input
              id="item-name"
              className="field-input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Soju"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="item-description">
              Description
            </label>
            <textarea
              id="item-description"
              className="field-input field-textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional notes"
              rows={2}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="item-category">
              Category
            </label>
            <select
              id="item-category"
              className="field-input"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <div className="field-group">
              <label className="field-label" htmlFor="item-quantity">
                Count
              </label>
              <input
                id="item-quantity"
                className="field-input"
                type="number"
                min="0"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="item-unit">
                Unit
              </label>
              <input
                id="item-unit"
                className="field-input"
                type="text"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="e.g. lbs"
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="item-min">
              Minimum quantity
            </label>
            <input
              id="item-min"
              className="field-input"
              type="number"
              min="0"
              value={minQuantity}
              onChange={(event) => setMinQuantity(event.target.value)}
              placeholder="0"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="item-expiration">
              Expiration date
            </label>
            <input
              id="item-expiration"
              className="field-input"
              type="date"
              value={expirationDate}
              onChange={(event) => setExpirationDate(event.target.value)}
            />
          </div>

          <button type="submit" className="cta-button modal-submit" disabled={!canSubmit}>
            Add Item
          </button>
        </form>
      </div>
    </div>
  )
}
