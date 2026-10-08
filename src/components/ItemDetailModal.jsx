import { useState } from 'react'
import { OTHER_CATEGORY_VALUE, useInventory } from '../context/InventoryContext.jsx'

function formatExpiration(expirationDate) {
  if (!expirationDate) return 'Not set'
  const [year, month, day] = expirationDate.split('-')
  return `${month}/${day}/${year}`
}

export default function ItemDetailModal({ item, onClose, onSave }) {
  const { categories, resolveCategory } = useInventory()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [notes, setNotes] = useState(item.notes || '')
  const [category, setCategory] = useState(item.category)
  const [otherCategory, setOtherCategory] = useState('')
  const [quantity, setQuantity] = useState(String(item.quantity))
  const [unit, setUnit] = useState(item.unit)
  const [minQuantity, setMinQuantity] = useState(String(item.minQuantity))
  const [expirationDate, setExpirationDate] = useState(item.expirationDate || '')

  const isLow = item.quantity < item.minQuantity
  const isOther = category === OTHER_CATEGORY_VALUE
  const canSave =
    name.trim() !== '' &&
    unit.trim() !== '' &&
    quantity !== '' &&
    minQuantity !== '' &&
    (!isOther || otherCategory.trim() !== '')

  function startEditing() {
    setName(item.name)
    setNotes(item.notes || '')
    setCategory(item.category)
    setOtherCategory('')
    setQuantity(String(item.quantity))
    setUnit(item.unit)
    setMinQuantity(String(item.minQuantity))
    setExpirationDate(item.expirationDate || '')
    setIsEditing(true)
  }

  function handleSave(event) {
    event.preventDefault()
    if (!canSave) return
    onSave({
      name: name.trim(),
      notes: notes.trim(),
      category: isOther ? resolveCategory(otherCategory) : category,
      quantity: Number(quantity),
      unit: unit.trim(),
      minQuantity: Number(minQuantity),
      expirationDate: expirationDate || null,
    })
    setIsEditing(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{isEditing ? 'Edit Item' : item.name}</div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {isEditing ? (
          <form className="field-list" onSubmit={handleSave}>
            <div className="field-group">
              <label className="field-label" htmlFor="edit-item-name">
                Item name
                <span className="required-mark" aria-hidden="true">
                  {' '}*
                </span>
              </label>
              <input
                id="edit-item-name"
                className="field-input"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="edit-item-category">
                Category
                <span className="required-mark" aria-hidden="true">
                  {' '}*
                </span>
              </label>
              <select
                id="edit-item-category"
                required
                className="field-input"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value={OTHER_CATEGORY_VALUE}>Other</option>
              </select>
              {isOther && (
                <input
                  className="field-input"
                  type="text"
                  value={otherCategory}
                  onChange={(event) => setOtherCategory(event.target.value)}
                  placeholder="New category name"
                  aria-label="New category name"
                  required
                />
              )}
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label" htmlFor="edit-item-quantity">
                  Count
                  <span className="required-mark" aria-hidden="true">
                    {' '}*
                  </span>
                </label>
                <input
                  id="edit-item-quantity"
                  className="field-input"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="edit-item-unit">
                  Unit
                  <span className="required-mark" aria-hidden="true">
                    {' '}*
                  </span>
                </label>
                <input
                  id="edit-item-unit"
                  className="field-input"
                  type="text"
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="edit-item-min">
                Minimum quantity
                <span className="required-mark" aria-hidden="true">
                  {' '}*
                </span>
              </label>
              <input
                id="edit-item-min"
                className="field-input"
                type="number"
                min="0"
                value={minQuantity}
                onChange={(event) => setMinQuantity(event.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="edit-item-expiration">
                Expiration date (if applicable)
              </label>
              <input
                id="edit-item-expiration"
                className="field-input"
                type="date"
                value={expirationDate}
                onChange={(event) => setExpirationDate(event.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="edit-item-notes">
                Notes
              </label>
              <textarea
                id="edit-item-notes"
                className="field-input field-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional notes"
                rows={2}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="cta-button" disabled={!canSave}>
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-badge-row">
              <span className="detail-category-pill">{item.category}</span>
              <span
                className="item-badge"
                style={{
                  color: isLow ? 'var(--color-danger)' : 'var(--color-success)',
                  background: isLow ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                }}
              >
                {isLow ? 'LOW' : 'OK'}
              </span>
            </div>

            <div className="field-list">
              <div className="field-row">
                <div className="field-group">
                  <div className="field-label">Count</div>
                  <div className="detail-value">
                    {item.quantity} {item.unit}
                  </div>
                </div>
                <div className="field-group">
                  <div className="field-label">Minimum quantity</div>
                  <div className="detail-value">{item.minQuantity}</div>
                </div>
              </div>

              <div className="field-group">
                <div className="field-label">Expiration date</div>
                <div className="detail-value">{formatExpiration(item.expirationDate)}</div>
              </div>

              <div className="field-group">
                <div className="field-label">Notes</div>
                <div className="detail-value">{item.notes || 'No notes added'}</div>
              </div>
            </div>

            <button type="button" className="cta-button modal-submit" onClick={startEditing}>
              Edit Item
            </button>
          </>
        )}
      </div>
    </div>
  )
}
