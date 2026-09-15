# 02 — Focus & keyboard navigation

Continues on the custom combobox from [01](01-semantic-html-vs-aria.md)
(`widget/custom`), extended into a small form: the tag combobox, an "Add"
button, and a list of selected tags each with its own "Remove" button —
enough surface area to test tab order and focus management across multiple
controls, not just inside one widget.

```bash
git switch topic/02-focus-keyboard-nav
npm run dev
```

## What was tested

A full keyboard-only pass with no mouse: `Tab`/`Shift+Tab` through every
control, checking (a) the order matches visual/reading order, (b) focus is
always visibly indicated, and (c) no action strands focus somewhere
unreachable.

## Findings, verified not assumed

1. **Tab order is correct out of the box.** Combobox → Add → each Remove
   button in list order. No `tabindex` overrides were needed — plain
   source-order DOM already gets this right, which is the recurring lesson
   from this whole track: correct semantics/order often costs nothing.

2. **Focus-visible works without any custom CSS.** No component here sets
   `outline: none`, so the browser's default focus ring shows on every
   control. Worth stating explicitly because "silently remove the outline"
   is one of the most common real-world regressions — it never got a
   chance to happen here because nothing touched `outline`.

3. **Real bug found: focus was lost to `<body>` after removing a tag.**
   The "Remove" button removes itself from the DOM when its tag is
   deleted; the browser has nowhere to send focus when the focused element
   disappears, so it falls back to `<body>`. For a keyboard user this
   means every deletion silently resets their position to the top of the
   page. Confirmed via `document.activeElement` before/after a real click
   on a Remove button — not inferred from reading the code.

   **Fix:** track refs to each Remove button and the Add button; on
   removal, explicitly move focus to the next tag's Remove button, or the
   previous one if the removed tag was last, or to Add if the list is now
   empty. All three cases (remove from middle, remove last-remaining,
   empty the list) were re-tested individually after the fix.

4. **Minor quirk, not a bug:** tabbing into the empty combobox immediately
   opens the full 10-option dropdown (the `onFocus` handler doesn't check
   whether there's a reason to open). Not wrong, but worth a second look —
   a sighted keyboard user gets an unrequested wall of options the instant
   they tab in, before typing anything.

5. **Tooling caveat, not a widget bug:** in this session's browser
   automation, dispatching a synthetic `Enter` or `Space` key on a
   focused native `<button>` did **not** trigger its `click` handler,
   confirmed with a `click` listener that never fired. A real click did.
   This is almost certainly a gap in how the automation tool injects
   keyboard events (they don't route through the browser's native
   button-activation behavior), not a claim that native buttons fail
   Enter/Space in real browsers — but it's a hard reminder that this kind
   of check needs a real keyboard or a real screen reader eventually, not
   just automated key-dispatch. → topic A4.

## Next questions this raises

**Is "move focus to the next item" always the right call after a delete?**
It's the common pattern (seen in most tag/chip UIs), but for a long list,
jumping focus down instead of up, or announcing what happened via a live
region, might serve users better. → worth a live-region follow-up if this
track goes deeper into dynamic content later.

**How much of this can be caught by automated tests instead of manual
keyboard passes?** The focus-loss bug here is exactly the kind of thing a
Testing-Library test (`fireEvent.click`, then assert
`document.activeElement`) could catch permanently, cheaper than a manual
recheck every time the component changes. → Track B, once B1/B2 exist.

**Did the automation tool's Enter/Space gap mask other keyboard-only
bugs in this pass?** Everything checked here used clicks as the
ground truth specifically because keydown-triggered clicks were
unreliable in this environment — but that means genuine Enter/Space
handling on custom (non-native) interactive elements wasn't fully
verified this round. → confirm with a real screen reader in A4.
