'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <>
      <nav>
        <Link href="/our-story">Our Story</Link>
        <Link href="/travel">Travel</Link>
        <span className="nav-monogram">E & K</span>
        <Link href="/registry">Registry</Link>
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
          <span className="detail-sub">Doors open at 3:30</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Location</span>
          <span className="detail-value">The Lakehouse</span>
          <span className="detail-sub">Halifax, MA</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Dress Code</span>
          <span className="detail-value">Garden Formal</span>
          <span className="detail-sub">Black tie optional</span>
        </div>
      </section>

      <section className="message-section">
        <p className="section-body">
          After years of adventures, laughter, and building a life together, we&apos;re ready
          to celebrate with the people who mean the most to us. Use this site to RSVP,
          find travel info, and learn a little more about our story.
        </p>
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