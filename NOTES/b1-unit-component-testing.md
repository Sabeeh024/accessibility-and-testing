# B1 — Unit & component testing

Starts Track B (Testing), deliberately independent of Track A — fresh,
simple example code, not the tag-picker widget. Unit tests a pure
function; component tests a small standalone `QuantityStepper`.

```bash
git switch topic/b1-unit-component-testing
npm test        # run once
npm run test:watch
```

## What was built

- **Vitest** configured via `vite.config.js`'s `test` block (jsdom
  environment, a setup file for jest-dom matchers).
- **`formatCurrency.js`**: a pure function, unit tested directly — no
  rendering, no DOM, just input → output.
- **`QuantityStepper.jsx`**: a small stateful component (± buttons, a
  number input, a max-reached message), tested with React Testing
  Library and `userEvent`.

## Findings, verified not assumed

1. **Unit tests actually catch regressions — checked, not assumed.**
   After the real suite passed, `cents / 100` was deliberately changed to
   `cents / 10` to confirm the tests fail on a real bug rather than
   always passing regardless of the implementation. 4 of 6 tests failed
   with the wrong output shown in the diff, exactly as expected; reverted
   immediately after.

2. **Real, common setup bug found: missing test cleanup between tests.**
   The first run of the component suite failed with "multiple elements
   found" and a stale value from an earlier test — because nothing was
   calling `cleanup()` between tests, so each test's rendered DOM stayed
   mounted for the next one. React Testing Library's automatic cleanup
   only registers itself under certain test-runner detection conditions;
   under this Vitest config it didn't fire, and the fix was one explicit
   `afterEach(() => cleanup())` in the setup file. Re-ran after the fix:
   all 6 tests passed cleanly. This is very likely the single most common
   "why are my RTL tests flaky/wrong" mistake in real projects — it's
   silent until you have more than one test touching the same query.

3. **Query priority was followed deliberately**: every query in
   `QuantityStepper.test.jsx` is `getByRole`, matching how a keyboard or
   screen reader user would actually locate these controls, and
   `getByTestId` was never reached for. If a component genuinely needs a
   test ID to be queryable, that's usually a sign the markup itself isn't
   exposing an accessible name or role — the same lesson as Track A,
   arrived at independently from the testing side rather than the a11y
   side.

4. **Real jsdom-vs-browser discrepancy found.** The test suite queries
   the quantity field with `getByRole('spinbutton', ...)`, and it passes
   under jsdom. But rendering the same component in an actual browser and
   reading its live accessibility tree reported the same
   `<input type="number">` as role **`textbox`**, not `spinbutton`.
   Confirmed by checking twice, not a one-off. This wasn't chased down to
   a root cause (jsdom's accessibility-tree emulation vs. this specific
   browser's implementation of the HTML-AAM role mapping could each be
   read as "wrong" here), but the practical lesson is what matters:
   **a passing jsdom-based role query is not proof of what a real screen
   reader sees** — the same caveat Track A's screen-reader-smoke-test
   topic already landed on from the manual-testing side. Two different
   tracks, two independent paths, same conclusion.

## Next questions this raises

**Should component tests ever assert on ARIA roles that jsdom and real
browsers disagree on?** The test still passed and still gives real
regression protection (it did catch the deliberately-introduced bug just
as reliably) — but if jsdom's role computation for a given element type
is known to diverge from browsers, is `getByRole` here giving false
confidence about accessibility specifically, even while giving genuine
confidence about behavior? Worth revisiting once more component tests
exist across a range of element types.

**How does this connect back to Track A's "automated tools are a floor,
not a ceiling" habit?** ([NOTES/05](05-accessibility-practices.md)) —
this finding extends that same caution to component-testing tools
specifically, not just axe/Lighthouse-style scanners: jsdom is also an
automated proxy for a real browser/AT, with its own gaps.

**What's the right amount of `userEvent` realism to rely on?** The
"types 99, gets clamped to 5" test relies on `userEvent.type` firing one
keystroke's `onChange` at a time, matching real typing — worth keeping in
mind as a reason to prefer `userEvent` over `fireEvent` for anything
input-related, since `fireEvent.change` would only fire once with the
final value and wouldn't have caught intermediate-state bugs the same
way. → could be its own explicit comparison in a later Track B topic if
it comes up again.
