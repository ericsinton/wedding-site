'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabase'
import { saveCode, getCode } from './lib/useAuth'

export default function Gate() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const existing = getCode()
    if (existing) {
      router.push('/home')
    } else {
      setChecking(false)
    }
  }, [router])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    const { data, error: dbError } = await supabase
      .from('guest_parties')
      .select('id')
      .eq('code', code.toUpperCase().trim())
      .single()

    if (dbError || !data) {
      setError("We couldn't find that code. Please check your save-the-date and try again.")
      setLoading(false)
      return
    }

    saveCode(code.toUpperCase().trim())
    router.push('/home')
  }

  if (checking) return null

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="nav-monogram" style={{ marginBottom: '1.5rem' }}>E & K</p>
        <h1 className="login-title">You&apos;re invited</h1>
        <p className="login-sub" style={{ marginBottom: '1.5rem' }}>
          Enter the code from your save-the-date to access our wedding site.
        </p>
        {error && <p className="rsvp-error">{error}</p>}
        <input
          className="rsvp-input"
          placeholder="Enter your code"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ textTransform: 'uppercase' }}
        />
        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={handleSubmit}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
      </div>
    </div>
  )
}