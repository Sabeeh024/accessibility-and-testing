import { useState } from 'react'

function QuantityStepper({ min = 0, max = 10, initial = 1 }) {
  const [value, setValue] = useState(initial)

  const atMin = value <= min
  const atMax = value >= max

  return (
    <div className="quantity-stepper">
      <label htmlFor="quantity">Quantity</label>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={atMin}
        onClick={() => setValue((v) => Math.max(min, v - 1))}
      >
        −
      </button>
      <input
        id="quantity"
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number(e.target.value)
          if (Number.isNaN(next)) return
          setValue(Math.min(max, Math.max(min, next)))
        }}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={atMax}
        onClick={() => setValue((v) => Math.min(max, v + 1))}
      >
        +
      </button>
      {atMax && <p role="status">Maximum quantity reached.</p>}
    </div>
  )
}

export default QuantityStepper
