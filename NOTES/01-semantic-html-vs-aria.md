# 01 — Semantic HTML vs ARIA-heavy divs

Same widget — a tag-picker combobox — built two ways. Each lives on its own
git branch off `master` (the pristine scaffold).

| | branch |
|---|---|
| Native-first (input + datalist) | `widget/native` |
| Custom (div/ul + full ARIA) | `widget/custom` |

```bash
git switch widget/native      # or widget/custom
npm run dev
```

---

## Native-first (`widget/native`)

A single `<input list="tag-options">` wired to a `<datalist>` of options.
That's the entire implementation — no state, no keyboard handlers, no ARIA
attributes written by hand.

**Good when:** the widget is "pick one value from a list, optionally by
typing to filter" and you don't need custom rendering per option (icons,
descriptions, multi-line content). The browser owns focus, keyboard
handling, filtering-as-you-type, and screen reader announcement for free.

**Costs:**
- Styling the suggestion popup is not possible — it's rendered by the OS/
  browser chrome, not the page. You cannot theme it, add descriptions, or
  match it to a design system.
- No `onSelect`-style event that fires distinctly from `onChange` — you get
  the same input event whether the user typed the text or picked a
  suggestion.
- Filtering behavior (substring vs prefix, case sensitivity) is entirely
  browser-dependent and not something you control.

## Custom (`widget/custom`)

A `role="combobox"` input controlling a `role="listbox"` of `role="option"`
elements, with `aria-activedescendant` for virtual focus and hand-written
keyboard handling.

**Good when:** you need custom option rendering, custom filtering logic,
or the widget needs to look and behave identically across browsers/OSes.

**Costs, verified not assumed:** the pre-ARIA baseline commit
(`Custom tag picker: mouse-only div list`) was tested keyboard-only before
any ARIA was added, and here's what was actually broken, confirmed in the
browser rather than assumed from reading the code:

- Arrow Down/Up did nothing — focus stayed in the text input, no option was
  ever highlighted.
- The options weren't exposed as anything meaningful to the accessibility
  tree — `read_page` reported them as plain `generic` nodes, not `option`
  or `listbox`. A screen reader user would have no idea the list existed.
- No Enter-to-select and no Escape-to-close — the only way to pick a tag
  was a mouse click.

After adding `role="combobox"`/`role="listbox"`/`role="option"`,
`aria-activedescendant`, and keyboard handlers for Arrow Up/Down, Home/End,
Enter, and Escape, all of the above were re-tested and confirmed fixed —
including a real bug caught in the process: the active-option highlight
had no visible effect because `App.jsx` was silently missing its
`import './App.css'` (a leftover from trimming the Vite boilerplate, not
an ARIA issue). That's a good reminder that a missing highlight during
manual testing isn't automatically an ARIA/state bug — check the CSS is
even loaded before chasing the "real" problem.

## Next questions this raises

**Where's the actual line for "just use native"?** The native widget above
covers "select one value, no custom rendering." The moment you need option
descriptions, icons, or multi-select, native form controls stop being
sufficient and you're into `widget/custom` territory — but that line is a
judgment call, not a hard rule. Worth revisiting once a widget with a real
need for custom rendering comes up.

**Does `aria-activedescendant` vs real focus movement matter to a screen
reader user in practice?** This build used the activedescendant pattern
(focus stays on the input; the "active" option is only ever referenced,
never focused). A real screen reader pass, not just accessibility-tree
inspection, would confirm whether announcements actually keep up with fast
arrow-key navigation. → topic A4 (screen reader smoke test).

**How would automated tooling have caught what manual testing found?** The
missing keyboard support and missing roles in the pre-ARIA baseline are
exactly the kind of thing axe/lint rules catch differently (or don't catch
at all — axe can't detect "arrow keys do nothing"). Worth a direct
comparison once more widgets exist. → later accessibility topic, and
separately, Track B's testing topics for how much of this could be
regression-tested at all.
