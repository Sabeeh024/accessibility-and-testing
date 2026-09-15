import { useState } from 'react'

const TAGS = [
  'accessibility',
  'testing',
  'react',
  'vite',
  'javascript',
  'css',
  'html',
  'aria',
  'performance',
  'security',
]

function TagPicker() {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = TAGS.filter((tag) =>
    tag.toLowerCase().includes(value.toLowerCase()),
  )

  return (
    <div className="tag-picker">
      <label htmlFor="tag-input">Pick a tag</label>
      <input
        id="tag-input"
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className="tag-picker-list">
          {filtered.map((tag) => (
            <div
              key={tag}
              className="tag-picker-option"
              onClick={() => {
                setValue(tag)
                setOpen(false)
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagPicker
