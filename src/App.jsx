import { useRef, useState } from 'react'
import './App.css'
import TagPicker from './TagPicker'

function App() {
  const [tags, setTags] = useState(['react', 'testing'])
  const addButtonRef = useRef(null)
  const removeButtonRefs = useRef(new Map())

  function addTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev : [...prev, tag]))
  }

  function removeTag(tag) {
    const index = tags.indexOf(tag)
    setTags((prev) => prev.filter((t) => t !== tag))

    // Move focus to the next tag's remove button, or the previous one, or
    // back to Add if the list is now empty — never leave focus to fall
    // through to <body> when the focused button unmounts.
    const remaining = tags.filter((t) => t !== tag)
    const next = remaining[index] ?? remaining[index - 1]
    requestAnimationFrame(() => {
      if (next) {
        removeButtonRefs.current.get(next)?.focus()
      } else {
        addButtonRef.current?.focus()
      }
    })
  }

  return (
    <main>
      <h1>Tag picker — custom</h1>
      <TagPicker onAdd={addTag} addButtonRef={addButtonRef} />
      <ul className="selected-tags">
        {tags.map((tag) => (
          <li key={tag}>
            {tag}
            <button
              type="button"
              ref={(el) => {
                if (el) removeButtonRefs.current.set(tag, el)
                else removeButtonRefs.current.delete(tag)
              }}
              onClick={() => removeTag(tag)}
            >
              Remove {tag}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
