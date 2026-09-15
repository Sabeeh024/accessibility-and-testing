import { useRef, useState } from 'react'
import './App.css'
import TagPicker from './TagPicker'

function App() {
  const [tags, setTags] = useState(['react', 'testing'])
  const [favorites, setFavorites] = useState(new Set())
  const [announcement, setAnnouncement] = useState('')
  const addButtonRef = useRef(null)
  const removeButtonRefs = useRef(new Map())

  function addTag(tag) {
    if (tags.includes(tag)) return
    setTags((prev) => [...prev, tag])
    setAnnouncement(`${tag} added.`)
  }

  function toggleFavorite(tag) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  function removeTag(tag) {
    const index = tags.indexOf(tag)
    setTags((prev) => prev.filter((t) => t !== tag))
    setAnnouncement(`${tag} removed.`)

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
      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
      <TagPicker onAdd={addTag} addButtonRef={addButtonRef} />
      <ul className="selected-tags">
        {tags.map((tag) => {
          const isFavorite = favorites.has(tag)
          return (
            <li key={tag}>
              {/* decorative — the tag's own text already conveys "this is a tag" */}
              <svg
                className="tag-bullet"
                viewBox="0 0 8 8"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="4" cy="4" r="4" fill="currentColor" />
              </svg>
              {tag}
              <button
                type="button"
                className="icon-button"
                aria-pressed={isFavorite}
                aria-label={
                  isFavorite ? `Unfavorite ${tag}` : `Favorite ${tag}`
                }
                onClick={() => toggleFavorite(tag)}
              >
                {isFavorite ? '★' : '☆'}
              </button>
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
          )
        })}
      </ul>
    </main>
  )
}

export default App
