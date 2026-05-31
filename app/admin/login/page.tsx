'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="nav-monogram" style={{ marginBottom: '1rem' }}>E & K</p>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-sub">For Eric & Kate only</p>
        {error && <p className="rsvp-error">{error}</p>}
        <label className="login-label">Email</label>
        <input
          className="rsvp-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <label className="login-label">Password</label>
        <input
          className="rsvp-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}