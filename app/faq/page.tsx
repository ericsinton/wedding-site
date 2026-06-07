import Link from 'next/link'

export default function FAQ() {
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
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">FAQ</p>
        <h1 className="rsvp-heading">Coming Soon</h1>
        <p className="rsvp-subheading">Check back here for more information.</p>
      </div>
    </>
  )
}