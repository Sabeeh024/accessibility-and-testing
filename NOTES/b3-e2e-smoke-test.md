# B3 — E2E smoke test

Continues on [B2](b2-mocking-integration.md) (`topic/b2-mocking-integration`).
Deliberately scoped down to **one** happy-path flow in a real browser —
this is a smoke test, not a flake-hunting or cross-browser exercise.

```bash
git switch topic/b3-e2e-smoke-test
npm run test:e2e
```

## What was built

- **Playwright**, configured with a `webServer` block that starts
  `npm run dev` automatically and waits for it before running tests —
  so `npm run test:e2e` is a single command, no manual server juggling.
- One spec: load the app, increase the `QuantityStepper` twice, decrease
  once, assert the value at each step. Real browser (Chromium), real
  clicks, real rendered state — no mocking at all, unlike B1/B2.

## Findings, verified not assumed

1. **The happy path actually works end-to-end.** Not a given — B1 and B2
   both tested `QuantityStepper` and `UserProfile` in isolation
   (component tests, jsdom), which proves the component's own logic is
   correct but says nothing about whether the built app, served by the
   real dev server and rendered in a real browser, actually wires
   together. This test is the first check of the whole stack at once,
   and it passed on the first real run.

2. **This test corrected a wrong finding from [B1](b1-unit-component-testing.md).**
   B1 logged what looked like a real jsdom-vs-browser discrepancy: a
   component test asserted `getByRole('spinbutton', ...)` under jsdom and
   passed, while reading the same element's role through the Claude
   Browser MCP tool reported `textbox` instead. This E2E test queries the
   identical element with `getByRole('spinbutton', ...)` through
   Playwright, which reads Chromium's real accessibility tree via CDP —
   and it matched cleanly. Since Playwright's accessibility-tree access is
   more direct and authoritative than a second tool's own snapshot
   abstraction, this means the original finding almost certainly wasn't a
   real jsdom/browser disagreement — it was most likely an artifact of
   how that specific MCP tool computed or reported the role. B1's NOTES
   were corrected in place rather than quietly left wrong. Worth stating
   plainly: **this is the exact "verify, don't assume" discipline this
   whole project has been built around, applied to this project's own
   earlier conclusions** — a claim that was itself the result of manual
   checking still needed a second, better check before it could be
   trusted.

3. **Configuring `webServer` once removes an entire category of flaky
   setup.** Before this, a manual dev-server-then-run-tests dance was
   needed for every browser check across every topic in this project.
   Playwright's `webServer` config (start command + ready URL) makes the
   E2E suite self-contained — worth noting since "the server wasn't
   running" is a common source of confusing E2E failures that have
   nothing to do with the code being tested.

## Next questions this raises

**Where's the line between this E2E test and B2's integration test?**
`UserProfile.test.jsx` (B2) is arguably already testing close to the same
altitude — a component plus its real data-fetching logic, mocked only at
the network. The genuine difference E2E adds here is the real browser
and the real dev server in the loop, not a fundamentally different
"layer" of the app. Worth keeping in mind before reaching for Playwright
by default — B2's approach is cheaper and already covers a lot of the
same ground for anything that doesn't specifically need a real browser.

**Should `UserProfile` get an E2E test too?** It was deliberately left
out of this topic's scope (no backend exists to hit, and mocking network
requests inside Playwright is a reasonable next step but adds real
complexity) — the one happy-path flow here was chosen specifically
because `QuantityStepper` needs nothing beyond the browser itself.

**What would make this suite flaky if it grew?** Not investigated here
by design (per the "smoke test, not flake-hunting" scope) — but worth
flagging for whoever adds the next E2E test: timing-dependent assertions,
shared state between tests, and tests that depend on a specific starting
DOM state are the usual first sources of flakiness once a suite grows
past one test.
