# 05 — Practices worth keeping, without a dedicated topic

Closes out the accessibility track (see [01](01-semantic-html-vs-aria.md)–
[04](04-screen-reader-smoke-test.md)). This isn't a new build — it's the
list of things that came up repeatedly across those four topics and are
common enough on real projects to be worth doing as a reflex, without
needing a full lesson or a dedicated branch the way 01–04 got.

Deliberately excluded from this list (and from the curriculum as a
whole): the WCAG framework itself (POUR principles, conformance levels,
success-criterion numbering), a dedicated automated-tooling comparison,
and other advanced/niche topics (property-based testing, visual
regression testing, contract testing, i18n/RTL, PDF accessibility, load
testing, newer/rarer WCAG criteria like target-size or reflow-at-400%).
Not because they're unimportant — because most apps don't lean on them
day to day, and if a project ever does need them, there's normally time
to learn and apply them then. The five habits below are different: they
come up on nearly every project, in ordinary feature work, not just
"accessibility work."

## The five habits

1. **Check contrast in every color scheme you actually ship, not just the
   one you designed in.** This is not a hypothetical — it's the exact bug
   found in [03](03-forms-content-visual.md): a color picked and eyeballed
   in light mode passed at 6.54:1, then measured at 2.74:1 in dark mode
   because `prefers-color-scheme: dark` was already wired up and nobody
   re-checked. A color pair "looking fine" in one theme says nothing about
   any other theme it also ships in.

2. **Never let focus die when something is deleted, dismissed, or
   closed.** Found in [02](02-focus-and-keyboard-navigation.md): removing
   a focused element from the DOM without explicitly redirecting focus
   drops it to `<body>`, silently resetting a keyboard user's position to
   the top of the page. This is probably the single most common real-world
   keyboard-accessibility regression, and the fix is always the same
   shape — decide where focus goes *before* the element disappears.

3. **A clean axe/Lighthouse scan is a floor, not a finish line.**
   Automated tools reliably catch missing labels, contrast failures, and
   malformed ARIA — they cannot catch "arrow keys do nothing" or "this
   custom widget is keyboard-untestable." Treat 0 reported violations as
   "no obvious mistakes," never as "this is accessible." (Referenced but
   never resolved in [01](01-semantic-html-vs-aria.md) and
   [04](04-screen-reader-smoke-test.md) — this is that question's answer:
   automated tooling wasn't run this round at all, by design, per the
   scoping decision to keep this track to common practice rather than
   deep-diving tooling.)

4. **State conveyed by color alone will be missed by someone.** Also from
   [03](03-forms-content-visual.md) — the favorite-toggle button changes
   glyph (☆ → ★) and gains a border, not just a color, specifically so a
   color-blind or low-vision user isn't relying on a single hue shift to
   know the state changed. Cheap to do while building; expensive to
   retrofit later.

5. **Static correctness (labels, alt text, decorative-vs-meaningful
   icons) is a five-minute check per component, not a project.** Nothing
   in [03](03-forms-content-visual.md) took more than a few minutes to
   verify (`aria-hidden` on decorative icons, `aria-label` on icon-only
   buttons) — it only becomes expensive when it's skipped on enough
   components that fixing it later means auditing the whole app at once.

## Where this leaves Track A

This is the end of the accessibility track for this project. From here,
the conversation moves to Track B (Testing) — a deliberately separate,
unrelated track per the original scoping decision, not "testing the
accessibility widget."
