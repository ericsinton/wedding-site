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
      The wedding and reception are located at the Lakehouse in Halifax, MA. The address is 550 Monponsett St, Halifax, MA 02338. There is plenty of on-site parking.
      <br /><br />
      The wedding is about an hour from both the Boston and Providence areas, but the traffic can get pretty bad, so we recommend using GPS to figure out the best route when you're on your way.
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
      <br /><br />
      If you are coming from out of town and want to connect with us about staying with one of our nearby friends or family, or otherwise have any questions about where to stay, please contact Eric or Kate directly by email (<a href="mailto:ericsinton@gmail.com">ericsinton@gmail.com</a> or <a href="mailto:k8lamberti@gmail.com">k8lamberti@gmail.com</a>).
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
