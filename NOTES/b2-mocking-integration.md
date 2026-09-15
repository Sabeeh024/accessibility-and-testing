# B2 — Mocking & integration testing

Continues on [B1](b1-unit-component-testing.md) (`topic/b1-unit-component-testing`).
Builds one real example rather than a taxonomy of mocking styles: a
`UserProfile` component that fetches data over the network, tested two
different ways, to show concretely — not just claim — why mocking at the
network boundary beats hand-mocking a module.

```bash
git switch topic/b2-mocking-integration
npm test
```

## The setup

- `src/api/userApi.js`: a thin `fetch` wrapper, `fetchUser(id)`.
- `src/UserProfile.jsx`: loading/error/success states, rendering the
  fetched user's name.
- **MSW** (`msw/node`) configured globally in `src/test/setup.js` via
  `server.listen()`/`resetHandlers()`/`close()`, so any test can add a
  handler with `server.use(...)`.

The component was written with a realistic bug: it reads `user.fullName`,
but the API (per the MSW handler modeling the real contract) actually
returns `full_name`.

## Two tests, two outcomes — verified, not assumed

**`UserProfile.badmock.test.jsx`** — hand-mocks the module directly:

```js
vi.mock('./api/userApi')
fetchUser.mockResolvedValue({ fullName: 'Ada Lovelace' })
```

Run against the buggy component: **passed.** Of course it did — the mock
was written with the same wrong assumption (`fullName`) the component's
bug already makes. The test isn't checking the component against
reality; it's checking the component against the test author's own
mistake, restated twice.

**`UserProfile.test.jsx`** — mocks the actual HTTP response instead:

```js
http.get('/api/users/:id', () =>
  HttpResponse.json({ id: '1', full_name: 'Ada Lovelace' }),
)
```

Run against the same buggy component: **failed**, with the actual
rendered output (`<p />`, empty) shown in the diff. This is the real bug,
caught by the only one of the two tests that used a shape modeling the
real contract instead of the component author's assumption.

**The fix** was one line — `user.fullName` → `user.full_name` — and the
network-mocked test then passed.

## The second half of the lesson, also verified

After fixing the bug, the hand-mocked test was re-run (not deleted first)
to see what would happen: it now **fails**, but for an unrelated reason —
its mock still returns `fullName`, which the now-fixed component no
longer reads. The hand-mock's shape was never validated against
anything real, so it drifted the moment the actual code changed,
independent of whether the code became more or less correct. It's now
kept in the suite as `it.skip`, with a comment explaining exactly this,
rather than deleted — the failure itself is the teaching material.

**The general lesson, stated plainly:** a module mock only ever tests
your code against your own assumptions about a dependency. A
network-boundary mock (MSW, or any tool that intercepts at the HTTP/fetch
layer rather than the module layer) tests your code against a shape that
at least has to be deliberately kept in sync with the real API contract
— and, more importantly, can be shared with or generated from the actual
API's schema/fixtures, which a hand-written `mockResolvedValue` object
never is.

## Also covered in the same build

- **Integration test, not unit test**: `UserProfile.test.jsx` doesn't
  mock `fetchUser` at all — it exercises the real component, the real
  `fetchUser` function, and a mocked network layer together, which is
  the actual boundary of "integration" being tested here (component +
  data-fetching logic, stopping at the network).
- **Error-path coverage**: a second test mocks a 500 response and asserts
  the `role="alert"` error state renders — free to add once MSW handlers
  exist, and it's the same `role="alert"` pattern from
  [A3](03-forms-content-visual.md), reused independently on the testing
  side.
- **Browser smoke test confirms the error path for real**: with no
  backend running at all, loading the app in a real browser hit exactly
  the error state (`alert "Couldn't load user."`) — consistent with what
  the MSW-mocked 500 test predicted, without anything special configured
  for the manual check.

## Next questions this raises

**Should hand-written module mocks ever be used at all, then?** Not
never — they're still the right tool for mocking something that isn't a
network boundary (a clock, `Math.random`, a browser API). The lesson here
is specifically about data-fetching/API boundaries, where a real contract
exists to drift away from.

**How would this scale to an app with many endpoints?** A single
`setupServer()` with per-test `server.use()` overrides works fine for
one component; a larger app usually wants shared default handlers (a
`handlers.js` with the "normal" response for every endpoint) with
individual tests only overriding the one case they're testing. Worth
revisiting if Track B ever needs a second integration example.

**Does this connect to [B1](b1-unit-component-testing.md)'s jsdom-vs-browser
finding?** Same shape of lesson, different layer: B1 found that an
automated *rendering* proxy (jsdom) can disagree with a real browser;
this topic found that a hand-written *data* proxy (a module mock) can
disagree with a real API. Both are the same underlying caution — a test
double is only as trustworthy as how closely it's forced to track the
real thing it's standing in for.
