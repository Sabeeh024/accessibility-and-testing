# 04 — Screen reader smoke test

Closes out the accessibility track by walking the whole tag picker
(built up across [01](01-semantic-html-vs-aria.md)–[03](03-forms-content-visual.md),
on `topic/03-forms-content-visual`) as one flow and checking what actually
gets exposed to assistive tech, not just what the JSX looks like it should
expose.

```bash
git switch topic/04-screen-reader-smoke-test
npm run dev
```

## An honest limitation, stated up front

This environment has no real screen reader (NVDA, JAWS, VoiceOver) to
drive. What was actually done instead: a full accessibility-tree audit —
reading the same role/name/state data a screen reader consumes, via the
browser's own accessibility tree — at every step of the task (load, tab
in, filter, select, add, remove, favorite-toggle). That is a genuine and
useful check; it is **not** the same thing as a real AT pass, and it
cannot catch AT-specific rendering or timing quirks (see below). Anyone
picking this branch up should still run it through NVDA+Firefox or
VoiceOver+Safari before calling this widget done — this topic verifies
what's structurally correct, not what a specific screen reader actually
says out loud.

## Findings, verified not assumed

1. **Real gap found: tag add/remove had no live-region announcement.**
   Before this topic, removing a tag only moved focus to the next
   button (fixed in [02](02-focus-and-keyboard-navigation.md)) — a
   screen reader user would hear the next control's label, but nothing
   ever told them a tag was actually removed, or that adding one
   succeeded. Confirmed by reading the accessibility tree before the fix:
   no `status`/`alert` node existed for this at all.

   **Fix:** an `aria-live="polite"` `role="status"` region, visually
   hidden, updated with "`{tag} added.`" / "`{tag} removed.`" on each
   action. Re-checked via `read_page` that the status node's accessible
   name updates correctly after both actions, and that it starts empty
   on page load (so nothing is announced on first render).

2. **Full-tree pass at each step found nothing else missing.** Every
   control's accessible name, role, and relevant state (`aria-expanded`,
   `aria-pressed`, `aria-invalid`, `aria-describedby`) was already
   correct from topics 01–03 — this pass didn't find new structural
   bugs, which is itself worth recording: three topics of "verify, don't
   assume" checking paid off before this one even started.

## What this pass could NOT verify (and why that matters)

- **Timing and interruption behavior of `aria-live="polite"`.** Different
  screen readers queue and debounce live-region updates differently —
  a rapid add-then-remove might get coalesced, dropped, or read in an
  unexpected order by a specific AT. The accessibility tree shows the
  final state, not the announcement timeline.
- **`aria-activedescendant` support.** This is a known area of
  inconsistent AT/browser support historically (NVDA+Firefox in
  particular has had rough edges with activedescendant-based virtual
  focus). The tree shows the attribute is wired correctly; it doesn't
  prove every AT combination announces the active option the same way.
- **Actual spoken wording.** "Status: react removed." vs "react removed"
  vs some other phrasing entirely depends on the specific screen
  reader's live-region announcement template, not on anything this app
  controls.

## Next questions this raises

**Given the two gotchas above are both about `aria-live` /
`aria-activedescendant` behavior, is a virtual-focus (activedescendant)
combobox still the right call, or would real DOM focus movement between
options be more reliably announced across AT?** This was already flagged
as an open question in topic 01 — this pass reinforces it rather than
resolving it, since resolving it needs a real screen reader, not another
tree read.

**How much of the "verify, don't assume" checking done across topics
01–04 could be captured as a permanent, automated regression test instead
of a one-time manual pass?** This is the natural bridge into Track B —
several specific things checked by hand here (the live region's text
after an action, `aria-pressed` flipping, focus landing on the right
button after removal) are exactly the kind of assertion Testing Library
queries are built for.
