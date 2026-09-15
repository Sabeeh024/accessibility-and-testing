// Reference implementation for NOTES/01-semantic-html-vs-aria.md — the
// native-first comparison point for the custom combobox in TagPicker.jsx.
// Not wired into App; kept here so both approaches live in one branch.

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

function TagPickerNative() {
  return (
    <div className="tag-picker">
      <label htmlFor="tag-input">Pick a tag</label>
      <input id="tag-input" type="text" list="tag-options" autoComplete="off" />
      <datalist id="tag-options">
        {TAGS.map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
    </div>
  )
}

export default TagPickerNative
