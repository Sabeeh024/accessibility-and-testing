import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchUser } from './api/userApi'
import UserProfile from './UserProfile'

// This test demonstrates the exact failure mode described in
// NOTES/b2-mocking-integration.md: mocking the module directly means the
// mock's shape is whatever the person writing the test *assumes* the API
// returns — here, the same wrong assumption the component's bug already
// makes. The test passes; the bug ships anyway.

vi.mock('./api/userApi')

afterEach(() => {
  vi.resetAllMocks()
})

describe('UserProfile (hand-mocked module — false confidence)', () => {
  // Skipped, not deleted: this test passed while UserProfile.jsx had a
  // real bug (reading `fullName` when the API actually returns
  // `full_name`), then started failing for an unrelated reason the
  // moment that bug was fixed elsewhere — because this mock's shape was
  // never validated against the real API, only against the component's
  // own (buggy) assumption. Both results are captured in
  // NOTES/b2-mocking-integration.md. Left in place, skipped, as a
  // readable example of exactly the failure mode it demonstrates.
  it.skip('renders the user name after loading', async () => {
    fetchUser.mockResolvedValue({ fullName: 'Ada Lovelace' })

    render(<UserProfile userId="1" />)

    await waitFor(() => {
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    })
  })
})
