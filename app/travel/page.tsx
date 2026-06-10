'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'
import Nav from '../components/Nav'

export default function Travel() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const code = getCode()
    if (!code) {
      router.push('/')
    } else {
      setAuthed(true)
    }
  }, [router])

  if (!authed) return null

  return (
    <>
      <Nav />
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">Travel & Hotels</p>
        <h1 className="rsvp-heading">Coming Soon</h1>
        <p className="rsvp-subheading">Check back here for more information.</p>
      </div>
    </>
  )
}
