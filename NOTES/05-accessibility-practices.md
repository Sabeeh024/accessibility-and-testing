# 05 — Practices worth keeping, without a dedicated topic

Closes out the accessibility track (see [01](01-semantic-html-vs-aria.md)–
[04](04-screen-reader-smoke-test.md)). This isn't a new build — it's the
list of things that came up repeatedly across those four topics and are
common enough on real projects to be worth doing as a reflex, without
needing a full lesson or a dedicated branch the way 01–04 got.

Deliberately excluded from this list as full topics (and from the
curriculum as a whole): a dedicated automated-tooling comparison, and
other advanced/niche topics (property-based testing, visual regression
testing, contract testing, i18n/RTL, PDF accessibility, load testing,
newer/rarer WCAG criteria like target-size or reflow-at-400%). Not
because they're unimportant — because most apps don't lean on them day
to day, and if a project ever does need them, there's normally time to
learn and apply them then. The five habits below are different: they
come up on nearly every project, in ordinary feature work, not just
"accessibility work." The WCAG framework and the accessibility-tree/ARIA
model get a brief conceptual mention further down — not a full topic,
just enough theory to name what 01–04 were already doing in practice.

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

## Concepts worth naming (theory, kept brief on purpose)

Everything in 01–04 applied these correctly without ever explaining them.
A short conceptual grounding, not a lab, not a deep dive:

- **WCAG** is the actual standard behind "accessible." It's organized
  around four principles — **P**erceivable, **O**perable,
  **U**nderstandable, **R**obust (POUR) — broken into numbered success
  criteria (e.g. **1.4.3** is the contrast rule found in
  [03](03-forms-content-visual.md); **4.1.3** is the live-region rule
  from [04](04-screen-reader-smoke-test.md)). It has three conformance
  levels, **A / AA / AAA**; almost every real organization targets
  **AA** — AAA is rarely required and not always achievable for every
  kind of content. Knowing this mapping exists is enough to look up the
  right criterion later; memorizing the numbers isn't the point.

- **The accessibility tree** is a second tree the browser builds
  alongside the DOM — from the DOM plus ARIA plus computed styles — and
  it's what screen readers and other assistive tech actually query, not
  the DOM or the visual page. This is exactly what `read_page` was
  showing throughout this track: role, accessible name, and state for
  each node, which is the real interface a screen reader user's
  experience is built from.

- **ARIA's first rule: don't use ARIA if a native element already does
  the job.** [Topic 01](01-semantic-html-vs-aria.md) demonstrated this in
  practice (native `<datalist>` needed zero ARIA; the custom combobox
  needed a page of it) without ever stating the rule itself. ARIA can
  only change what's *announced* — it changes no browser behavior at
  all, which is why the custom combobox still needed hand-written
  keyboard handling even after every `role`/`aria-*` attribute was
  correct.

- **Accessible name computation has a real priority order**, roughly:
  `aria-labelledby` > `aria-label` > native labeling (a `<label>`, or an
  image's `alt`) > visible text content > `title`. The first one present
  wins; the rest are ignored. This is why, for example, an icon button
  needs exactly one of these, not several competing ones — and it's the
  mechanism behind every `aria-label` used across this track.

## Where this leaves Track A

This is the end of the accessibility track for this project. From here,
the conversation moves to Track B (Testing) — a deliberately separate,
unrelated track per the original scoping decision, not "testing the
accessibility widget."
