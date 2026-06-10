'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'

export default function Home() {
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
      <nav>
        <Link href="/our-story">Our Story</Link>
        <Link href="/travel">Travel</Link>
        <Link href="/home" className="nav-monogram">E & K</Link>
        <Link href="/registry">Registry</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/rsvp" style={{ color: 'var(--gold)' }}>RSVP</Link>
      </nav>

      <section className="hero">
        <div className="hero-texture" />
        <p className="hero-date-line" style={{ fontSize: '14px', letterSpacing: '0.3em' }}>April 3, 2027</p>
        <div>
          <div className="hero-names">Eric</div>
          <span className="hero-ampersand">&amp;</span>
          <div className="hero-names">Kate</div>
        </div>
        <div className="hero-divider">
          <div className="hero-divider-line" />
          <div className="hero-divider-diamond" />
          <div className="hero-divider-line" />
        </div>
        <div className="hero-cta-wrap">
          <Link href="/rsvp" className="btn-primary">RSVP Now</Link>
          <Link href="/our-story" className="btn-secondary">Our Story</Link>
        </div>
      </section>

      <section className="details-strip">
        <div className="detail-item">
          <span className="detail-label">Date</span>
          <span className="detail-value">April 3, 2027</span>
          <span className="detail-sub">Saturday</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Ceremony</span>
          <span className="detail-value">4:00 PM</span>
          <span className="detail-sub">Please arrive after 3:30</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Location</span>
          <span className="detail-value">The Lakehouse</span>
          <span className="detail-sub">Halifax, MA</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Dress Code</span>
          <span className="detail-value">Dressy Casual</span>
          <span className="detail-sub">Please dress comfortably</span>
        </div>
      </section>

      <section className="message-section">
        <Link href="/rsvp" className="btn-primary">RSVP</Link>
        <div style={{ marginTop: '4rem' }}>
          <div className="photo-grid">
            <div className="photo-block" />
            <div className="photo-block tall" />
            <div className="photo-block" />
            <div className="photo-block" />
            <div className="photo-block" />
          </div>
          <p className="photo-label">Photos coming soon</p>
        </div>
      </section>

      <footer>
        <p className="footer-monogram">E & K</p>
        <p className="footer-date">April 3, 2027</p>
      </footer>
    </>
  )
}