import { useId, useRef, useState } from 'react'

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

function TagPicker({ onAdd, addButtonRef }) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listId = useId()
  const inputRef = useRef(null)

  const filtered = TAGS.filter((tag) =>
    tag.toLowerCase().includes(value.toLowerCase()),
  )

  const optionId = (index) => `${listId}-option-${index}`

  function openList() {
    setOpen(true)
  }

  function closeList() {
    setOpen(false)
    setActiveIndex(-1)
  }

  function selectIndex(index) {
    const tag = filtered[index]
    if (!tag) return
    setValue(tag)
    closeList()
  }

  function handleAdd() {
    if (!value.trim()) return
    onAdd(value.trim())
    setValue('')
    closeList()
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) {
          openList()
          setActiveIndex(0)
        } else {
          setActiveIndex((i) => (i + 1 >= filtered.length ? 0 : i + 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) {
          openList()
          setActiveIndex(filtered.length - 1)
        } else {
          setActiveIndex((i) => (i - 1 < 0 ? filtered.length - 1 : i - 1))
        }
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActiveIndex(filtered.length - 1)
        }
        break
      case 'Enter':
        if (open && activeIndex >= 0) {
          e.preventDefault()
          selectIndex(activeIndex)
        }
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          closeList()
        }
        break
      default:
        break
    }
  }

  return (
    <div className="tag-picker">
      <label htmlFor="tag-input">Pick a tag</label>
      <input
        id="tag-input"
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          open && activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setActiveIndex(-1)
          openList()
        }}
        onFocus={openList}
        onBlur={closeList}
        onKeyDown={handleKeyDown}
      />
      <button type="button" ref={addButtonRef} onClick={handleAdd}>
        Add
      </button>
      {open && filtered.length > 0 && (
        <ul id={listId} role="listbox" className="tag-picker-list">
          {filtered.map((tag, index) => (
            <li
              key={tag}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              className={
                'tag-picker-option' +
                (index === activeIndex ? ' tag-picker-option--active' : '')
              }
              // onMouseDown (not onClick) fires before the input's onBlur closes the list
              onMouseDown={(e) => {
                e.preventDefault()
                selectIndex(index)
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagPicker
