'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'
import Nav from '../components/Nav'

type TransitItem = {
  q: string
  a: React.ReactNode
}

const transitItems: TransitItem[] = [
  {
    q: 'Flying',
    a: <>
      <strong>We recommend flying into Boston Logan International Airport (BOS)</strong>, which is approximately 30 miles from the venue — about a 45-minute drive depending on traffic. Logan is the closest major airport and offers the most flight options.
      <br /><br />
      Two alternative airports are also within reasonable driving distance:
      <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '1.9' }}>
        <li><strong>T.F. Green Airport (PVD)</strong> — Providence, RI, approximately 60 miles south of the venue (~1 hour drive)</li>
        <li><strong>Bradley International Airport (BDL)</strong> — Windsor Locks, CT, approximately 120 miles west (~2 hour drive)</li>
      </ul>
    </>,
  },
  {
    q: 'Driving',
    a: <>
      The Lakehouse is approximately <strong>45 minutes from downtown Boston</strong> without traffic.
      <br /><br />
      <strong>From Boston / North of the venue:</strong>
      <ol style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: '2' }}>
        <li>Take <strong>I-93 South</strong> out of Boston</li>
        <li>At Exit 7 (the Braintree Split), merge onto <strong>Route 3 South</strong></li>
        <li>Take Route 3 South to <strong>Exit 22 (MA-14, Pembroke / Duxbury)</strong></li>
        <li>Head west on <strong>MA-14</strong> toward Pembroke, then follow signs south toward Halifax</li>
        <li>Continue to <strong>Route 58 South</strong> through Halifax center</li>
        <li>Turn right onto <strong>Monponsett St</strong> — The Lakehouse will be on your right at <strong>550 Monponsett St</strong></li>
      </ol>
      <br />
      There is free on-site parking at The Lakehouse. We recommend using Google Maps or Waze for real-time directions as you get closer.
    </>,
  },
  {
    q: 'Train (MBTA Commuter Rail)',
    a: <>
      Halifax is served by the <strong>MBTA Kingston Line</strong>, which departs from <strong>South Station</strong> in Boston. The ride is approximately <strong>45–50 minutes</strong>, and Halifax is the second-to-last stop on the line. There are around 12 outbound trips on weekdays and 9 round trips on weekends.
      <br /><br />
      Halifax station is located at <strong>6 Garden Rd, Halifax, MA</strong> — about 2 miles from The Lakehouse. You will need a rideshare (Uber or Lyft) from the station to the venue, which is a short 5-minute ride.
      <br /><br />
      For the full schedule and to plan your trip, visit the{' '}
      <a href="https://www.mbta.com/schedules/CR-Kingston/timetable" target="_blank" rel="noopener noreferrer">
        MBTA Kingston Line timetable
      </a>. We recommend checking return train times before you arrive so you can plan your evening accordingly.
    </>,
  },
  {
    q: 'Where to Stay',
    a: <>
      There are many hotels in the neighboring town of Plymouth. There is a group of hotels right next to each other that many of us will be staying in that includes the{' '}
      <a href="https://www.cambriaplymouth.com" target="_blank" rel="noopener noreferrer">Cambria Hotel</a>, the{' '}
      <a href="https://www.hilton.com/en/hotels/pymhshx-hampton-suites-plymouth" target="_blank" rel="noopener noreferrer">Hampton Inn and Suites</a>, and the{' '}
      <a href="https://www.marriott.com/en-us/hotels/ewbpf-fairfield-inn-and-suites-plymouth/overview/" target="_blank" rel="noopener noreferrer">Fairfield by Marriott Inn and Suites</a> in Plymouth.
    </>,
  },
]

export default function Travel() {
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
      <Nav />
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">Travel & Hotels</p>
        <h1 className="rsvp-heading">Getting Here</h1>
        <p className="rsvp-subheading">We are so grateful that you are coming from all over to celebrate our big day! Below is some information for getting to the venue, whether driving, flying, or taking public transportation.</p>

        <div className="faq-list" style={{ marginTop: '1rem', marginBottom: '3rem' }}>
          {transitItems.map((item, i) => (
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
                <div className="faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>

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

      <footer>
        <p className="footer-monogram">E & K</p>
        <p className="footer-date">April 3, 2027</p>
      </footer>
    </>
  )
}
