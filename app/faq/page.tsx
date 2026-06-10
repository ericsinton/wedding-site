'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'

type FAQItem = {
  q: string
  a: React.ReactNode
}

const faqs: FAQItem[] = [
  {
    q: 'Where is the ceremony and reception?',
    a: <>
      Both the ceremony and reception are at The Lakehouse (550 Monponsett St, Halifax, MA 02338).{' '}
      <a href="https://maps.app.goo.gl/7mbewcW5gib5PSQW8" target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </a>
      . Once you arrive, you'll see signs directing you to where the ceremony will take place.
    </>,
  },
  {
    q: 'When should I arrive? What time does the reception end?',
    a: 'The ceremony starts at 4:00 PM. Please be seated a few minutes before 4:00 and do not arrive before 3:30. The reception ends at 10:00 PM.',
  },
  {
    q: 'How do I get there?',
    a: <>
      Please see our <Link href="/travel">Travel page</Link> for information on airports, driving directions, public transit options, and more.
    </>,
  },
  {
    q: 'Is there parking at The Lakehouse?',
    a: 'Yes, there is plenty of free parking on site.',
  },
  {
    q: 'Will the ceremony be indoors or outdoors?',
    a: 'Weather permitting, the ceremony will be outdoors. If it is raining or too cold, we will move the ceremony indoors. Cocktail hour will be both indoors and outdoors. Dinner and dancing are indoors. Please dress accordingly.',
  },
  {
    q: 'What is the weather like in Halifax in April?',
    a: 'Temperatures this time of year are typically between 36–59°F. We recommend checking your weather app for Halifax, MA as the day approaches.',
  },
  {
    q: 'Will there be other events on the wedding weekend?',
    a: 'All of our guests are invited to join us for breakfast Sunday morning after the wedding.',
  },
  {
    q: 'Are there accommodations near the venue?',
    a: <>
      Our <Link href="/travel">Travel page</Link> lists nearby hotels and accommodations.
    </>,
  },
  {
    q: 'When is the RSVP deadline and how do I RSVP?',
    a: <>
      Please RSVP by March 1st using the <Link href="/rsvp">RSVP page</Link> on this website. We are collecting RSVPs electronically.
    </>,
  },
  {
    q: 'What if I need to change my RSVP?',
    a: 'To make changes before the RSVP deadline, navigate back to the RSVP page — your current responses will be pre-filled. Update anything you'd like and click "Submit RSVP" again.',
  },
  {
    q: 'Can I bring a date?',
    a: 'Please check your invitation for a plus one. The names of guests invited to attend are listed on your invitation — unfortunately no additional guests can be accommodated.',
  },
  {
    q: 'What is the dress code?',
    a: 'The dress code is garden formal. Please wear something you feel comfortable in. Note that the outdoor ceremony takes place on grass, so please be mindful of your footwear.',
  },
  {
    q: 'Can I take photos during the ceremony?',
    a: 'We kindly ask that you refrain from taking any photos or videos during the ceremony. We encourage photo-taking during the cocktail hour and reception — we'd love to see your shots!',
  },
  {
    q: 'What if I have an allergy or dietary restriction?',
    a: 'There are entrée choices to accommodate allergies and dietary restrictions, and cocktail hour appetizers will be clearly marked. Please note any allergies or dietary restrictions in your RSVP.',
  },
  {
    q: 'Are children welcome?',
    a: 'Yes — please check with us if they are not listed on your invitation.',
  },
  {
    q: 'I still have a question. How can I reach you?',
    a: <>
      Please reach out to us at{' '}
      <a href="mailto:ericandkate27@gmail.com">ericandkate27@gmail.com</a>
      {' '}and we'll get back to you as soon as we can.
    </>,
  },
]

export default function FAQ() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        <Link href="/faq" style={{ color: 'var(--gold)' }}>FAQ</Link>
        <Link href="/rsvp">RSVP</Link>
      </nav>
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">FAQ</p>
        <h1 className="rsvp-heading">Frequently Asked Questions</h1>
        <p className="rsvp-subheading" style={{ marginBottom: '3rem' }}>
          Everything you need to know for the big day.
        </p>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="faq-question-text">{item.q}</span>
                <span className="faq-icon">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && (
                <p className="faq-answer">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer>
        <p className="footer-monogram">E & K</p>
        <p className="footer-date">April 3, 2027</p>
      </footer>
    </>
  )
}
