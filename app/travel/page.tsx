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
        <h1 className="rsvp-heading">Getting Here</h1>
        <p className="rsvp-subheading">Everything you need to find your way.</p>
        <div className="travel-map-wrap">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1THMp9_s2-fiBwwkirhTK_jtUxIC5Lvw"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  )
}
