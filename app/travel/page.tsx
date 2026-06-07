import Link from 'next/link'

export default function Travel() {
  return (
    <>
      <nav>
        <Link href="/our-story">Our Story</Link>
        <Link href="/travel">Travel</Link>
        <Link href="/home" className="nav-monogram">E & K</Link>
        <Link href="/registry">Registry</Link>
        <Link href="/rsvp" style={{ color: 'var(--gold)' }}>RSVP</Link>
      </nav>
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">Travel & Hotels</p>
        <h1 className="rsvp-heading">Coming Soon</h1>
        <p className="rsvp-subheading">Check back here for more information.</p>
      </div>
    </>
  )
}