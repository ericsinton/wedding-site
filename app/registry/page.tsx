'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCode, getIsFamily } from '../lib/useAuth'
import Nav from '../components/Nav'

export default function Registry() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [isFamily, setIsFamily] = useState(false)

  useEffect(() => {
    const code = getCode()
    if (!code) {
      router.push('/')
    } else {
      setIsFamily(getIsFamily())
      setAuthed(true)
    }
  }, [router])

  if (!authed) return null

  if (isFamily) {
    return (
      <>
        <Nav />
        <div className="rsvp-page">
          <p className="rsvp-eyebrow">Registry</p>
          <div className="rsvp-card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '15px', lineHeight: '1.9', color: 'var(--muted)', fontWeight: 300 }}>
              Over the next few years, we will have to relocate apartments at least once.
              In lieu of wrapped gifts, we would be incredibly grateful for contributions
              toward the beginning of our new life together and making a new place home.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">Registry</p>
        <div className="rsvp-card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', lineHeight: '1.9', color: 'var(--muted)', fontWeight: 300, marginBottom: '1.5rem' }}>
            Your presence at our wedding is the greatest gift we could ask for.
            If you would like to do something in our honor, we kindly ask that you consider
            making a donation to the Wildland Firefighter Foundation — an organization that
            supports wildland firefighters and their families.
          </p>
          <a
            href="https://wffoundation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Donate to WFF Foundation
          </a>
        </div>
      </div>
    </>
  )
}
