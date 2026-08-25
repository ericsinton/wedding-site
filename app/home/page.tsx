'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'
import Nav from '../components/Nav'

const photos = [
  { src: '/story-1.jpeg', objectPosition: 'center 30%' },
  { src: '/story-2.jpeg', objectPosition: 'center 45%' },
  { src: '/story-3.jpeg', objectPosition: 'center 25%' },
  { src: '/story-4.jpeg', objectPosition: 'center 75%' },
  { src: '/story-5.jpeg', objectPosition: 'center 40%' },
  { src: '/story-6.jpeg', objectPosition: '35% 55%' },
]

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
      <Nav />

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
            {photos.map((photo, i) => (
              <div key={i} className="photo-block">
                <Image
                  src={photo.src}
                  alt="Eric and Kate"
                  fill
                  sizes="(max-width: 600px) 50vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: photo.objectPosition }}
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p className="footer-monogram">E & K</p>
        <p className="footer-date">April 3, 2027</p>
      </footer>
    </>
  )
}