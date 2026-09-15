import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from './test/server'
import UserProfile from './UserProfile'

// Mocking at the network boundary instead of hand-mocking the api module:
// the response shape here is what the real API actually returns
// (snake_case), not whatever the component author assumed it returns.
// See NOTES/b2-mocking-integration.md for why this test — not the
// module-mock version in UserProfile.badmock.test.jsx — is the one that
// caught a real bug.

describe('UserProfile (network-mocked — real contract)', () => {
  it('renders the user name after loading', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return HttpResponse.json({ id: '1', full_name: 'Ada Lovelace' })
      }),
    )

    render(<UserProfile userId="1" />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    })
  })

  it('shows an error message when the request fails', async () => {
    server.use(
      http.get('/api/users/:id', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    render(<UserProfile userId="1" />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        "Couldn't load user.",
      )
    })
  })
})
