import { useEffect, useState } from 'react'
import { fetchUser } from './api/userApi'

function UserProfile({ userId }) {
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)

  useEffect(() => {
    setStatus('loading')
    fetchUser(userId)
      .then((data) => {
        setUser(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [userId])

  if (status === 'loading') return <p>Loading user…</p>
  if (status === 'error') return <p role="alert">Couldn't load user.</p>

  return <p>{user.full_name}</p>
}

export default UserProfile
