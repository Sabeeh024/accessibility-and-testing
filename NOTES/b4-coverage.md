# B4 — Coverage & what it means

Closes out Track B. Continues on [B3](b3-e2e-smoke-test.md)
(`topic/b3-e2e-smoke-test`). Mostly conceptual and tooling, per the
original scoping — one concrete demonstration rather than a survey.

```bash
git switch topic/b4-coverage
npm run test:coverage
```

## What was built

- `@vitest/coverage-v8` wired into `vite.config.js`, with `e2e/**`
  excluded from Vitest's own test discovery (Vitest was picking up the
  Playwright spec by default glob matching and failing on it — a real,
  common gotcha the moment a project has both Vitest and Playwright specs
  in the same repo, fixed with one `exclude` entry).
- `discount.js`: a pure function with a subtle, realistic bug (`SAVE20`
  applies 2% off instead of 20% — a typo'd decimal).
- Two test files against it: a "coverage theater" suite that exercises
  every branch without asserting anything real, and a real suite that
  asserts actual return values.

## Findings, verified not assumed

1. **100% coverage, real bug, ships anyway — measured, not just
   claimed.** The coverage-theater suite (calls `applyDiscount` for every
   code, asserts `expect(true).toBe(true)`) was run through
   `vitest run --coverage` and produced **100% statements / 100%
   branches / 100% functions / 100% lines** on `discount.js`, while the
   `SAVE20` bug was still live and completely unverified.

2. **The real suite catches the bug immediately.** Three assertions
   (`toBe(90)`, `toBe(80)`, `toBe(100)`) were added, actually checking
   return values. Run against the same buggy code: one test failed,
   `AssertionError: expected 98 to be 80` — pointing straight at the bug.

3. **The coverage number didn't move when the real protection appeared.**
   After fixing the bug (`0.02` → `0.2`) and re-running coverage against
   the *real* suite, `discount.js` still reported exactly **100%** across
   every metric — identical to the theater suite's number. Coverage
   percentage is a measure of **which lines executed**, not **whether
   anything meaningful was checked about what they returned**. A single
   number can't distinguish "thoroughly verified" from "merely run once,"
   and this demonstration is the concrete version of that claim rather
   than just asserting it.

4. **The theater test is kept, not deleted** (`it.skip`, same convention
   as [B2](b2-mocking-integration.md)'s hand-mock example) — it's a
   working artifact of the failure mode, not just a description of it.

## Brief mentions (per the "keep scope practical" decision)

These come up often enough to name, without earning a full topic:

- **Mutation testing** (e.g. Stryker) is the tool that actually measures
  what coverage can't: it deliberately introduces bugs like this
  project's `SAVE20` typo into your code and checks whether your suite
  fails. A "mutation score" close to 100% is a much stronger signal than
  a coverage number close to 100% — but it's slow to run and heavier to
  set up, which is exactly why it didn't get a full topic here.
- **Snapshot testing** (`toMatchSnapshot()`) trades assertion-writing for
  diffing entire output against a saved baseline. Useful for catching
  unintended change in something large and structural (rendered HTML, a
  big JSON payload); a common trap is committing snapshots nobody reads
  and reflexively updating them (`--update`) whenever a test fails,
  which turns the snapshot into exactly the kind of theater this topic
  just demonstrated with coverage.
- **CI flake handling**: per [the accessibility-track
  habits list](05-accessibility-practices.md), the practical rule is
  quarantine + ticket + timebox, not "ignore" or "immediately delete." A
  flaky test silently trained to be ignored is worse than no test, since
  it still shows green and still consumes CI time.

## Where this leaves Track B

This is the end of the testing track for this project — B1 (unit +
component), B2 (mocking + integration), B3 (E2E smoke test), and B4
(coverage) are all built, tested for real, and documented. Both tracks
(Accessibility and Testing) are now complete per the original curriculum
scope.
