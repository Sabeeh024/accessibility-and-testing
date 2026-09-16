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

4. **Correction (see [B3](b3-e2e-smoke-test.md)): the apparent
   jsdom-vs-browser discrepancy originally logged here did not hold up.**
   The original claim was that a real browser reported this
   `<input type="number">` as role `textbox` rather than `spinbutton`,
   based on reading the accessibility tree through the Claude Browser MCP
   tool. In B3, the exact same element was queried with
   `getByRole('spinbutton', ...)` through Playwright driving real
   Chromium via CDP — the more authoritative check, since it's the
   browser's actual accessibility tree, not a second tool's snapshot of
   it — and it matched without issue. So the original finding was most
   likely a quirk of that specific MCP tool's own accessibility-snapshot
   abstraction, not a genuine jsdom-vs-Chromium disagreement. Left here
   rather than silently deleted, because getting caught out by a claim
   that doesn't survive a second, better check is itself the "verify,
   don't assume" lesson this whole project keeps returning to — including
   when the thing being re-checked is this project's own earlier NOTES.

## Next questions this raises

**Now that the jsdom-vs-browser role discrepancy didn't hold up, is
there still a real gap between jsdom and browser accessibility trees
worth watching for, or was this specific worry a false alarm?** Only one
element type (a number input) was checked, and only re-checked with one
better tool. A genuine jsdom/Chromium divergence might still exist
elsewhere (custom ARIA widgets seem more likely candidates than native
form controls) — this doesn't rule that out, it just rules out this
particular example.

**How does this connect back to Track A's "automated tools are a floor,
not a ceiling" habit?** ([NOTES/05](05-accessibility-practices.md)) — the
underlying caution still holds even though this specific example didn't:
any single tool's accessibility snapshot (jsdom's, or a given MCP
browser's) is a proxy, and proxies can be wrong in either direction — not
strict enough, or, as happened here, wrongly flagging a problem that
isn't real.

**What's the right amount of `userEvent` realism to rely on?** The
"types 99, gets clamped to 5" test relies on `userEvent.type` firing one
keystroke's `onChange` at a time, matching real typing — worth keeping in
mind as a reason to prefer `userEvent` over `fireEvent` for anything
input-related, since `fireEvent.change` would only fire once with the
final value and wouldn't have caught intermediate-state bugs the same
way. → could be its own explicit comparison in a later Track B topic if
it comes up again.
