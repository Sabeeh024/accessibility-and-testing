# 03 — Forms, content & visual correctness

Continues on the tag picker from [02](02-focus-and-keyboard-navigation.md)
(`topic/02-focus-keyboard-nav`). This topic folds together three things
that turned out to be the same kind of check — "is this static thing
correct," not "does this widget behave correctly" — form validation,
image/icon alt text, and color contrast / not-color-alone.

```bash
git switch topic/03-forms-content-visual
npm run dev
```

## What was added

1. **Form validation on the "Add" button**: clicking Add with an empty
   input sets `aria-invalid="true"` and `aria-describedby` on the
   combobox, and renders the error as `role="alert"` with both an icon
   and text (not color alone).
2. **A decorative icon** (a bullet before each tag) marked
   `aria-hidden="true"` — it repeats information the tag's own text
   already gives, so it should contribute nothing to the accessible name.
3. **A meaningful icon-only button** (a favorite/star toggle per tag) with
   `aria-label` and `aria-pressed`, since its icon alone (★/☆) carries the
   only information about what it does and its current state.

## Findings, verified not assumed

1. **Error association works.** Confirmed via the accessibility tree
   (`read_page`) that the error surfaces as a distinct `alert` node, and
   via direct attribute inspection that `aria-invalid` and
   `aria-describedby` point at the right element — not assumed from
   reading the JSX.

2. **Decorative icons are correctly invisible to the tree.** The
   `listitem` for each tag reads as just `"react"` / `"testing"` — the
   bullet SVG contributes nothing, confirmed by checking every `<svg>` in
   the page has `aria-hidden="true"`.

3. **The icon-only favorite button is fully labeled and stateful,** not
   just decorated. `read_page` reports `"Favorite react"` /
   `"Unfavorite react"` depending on state, and `aria-pressed` flips
   between `false`/`true` on click — checked directly on the live DOM
   node, not assumed.

4. **Real contrast bug found and fixed.** The error text color
   (`#b3261e`) was picked and eyeballed against a white background
   (6.54:1 — comfortably passes WCAG AA's 4.5:1 for normal text), but
   this app also declares `color-scheme: light dark` and repaints on
   `prefers-color-scheme: dark`. Computed against the actual dark
   background (`#16171d`), the same color drops to **2.74:1 — a clear
   AA failure**, calculated directly rather than assumed to be "probably
   fine because it looked fine in light mode." Fixed by moving the color
   into a `--error` custom property with a lighter value (`#ff8a80`,
   6.44:1) under the dark-mode media query, then re-verified in the
   browser with color-scheme emulation set to dark.

   **The general lesson:** any color picked and contrast-checked in one
   theme needs the same check repeated in every other theme the page
   actually ships — nothing about "looks fine in light mode" tells you
   anything about dark mode contrast, they're unrelated color pairs.

5. **The favorite button's pressed state isn't color-alone either** — the
   glyph itself changes (☆ → ★) and a border appears, so state is
   conveyed by shape and text, not by a single color shift that a
   color-blind or low-vision user might miss.

## Next questions this raises

**Where else in this app might the same light/dark contrast gap exist?**
Only the error color was checked here because it was newly added — the
rest of the page's colors (from the original scaffold) were never
audited pair-by-pair. → worth a dedicated contrast sweep once axe/automated
tooling exists (later accessibility topic).

**Should "not color alone" checks be something automated tooling can
catch, or is this inherently manual?** Automated tools can catch
insufficient contrast ratios (that's a solved, computable problem — as
shown by the small ratio() script used here) but "is state conveyed by
more than color" is a judgment call about content, not something a
contrast checker alone verifies. → Track B, once component tests exist,
could at least assert the pressed-state markup doesn't rely on a CSS
class alone.

**Does the error message's `role="alert"` actually interrupt a screen
reader user mid-task, and is that the right level of interruption for a
"you forgot to type something" error?** `alert` is an assertive live
region — appropriate for blocking errors, but worth confirming with a
real screen reader rather than just the accessibility-tree check done
here. → topic A4.
