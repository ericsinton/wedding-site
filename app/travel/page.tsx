'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { getCode } from '../lib/useAuth'
import Nav from '../components/Nav'

const FRIDAY_MAP_SRC = 'https://www.google.com/maps/d/u/0/embed?mid=1h0vzOwyPCAB3iBBagAq9cJJQeIAD-ps&ehbc=2E312F&noprof=1'
const GENERAL_MAP_SRC = 'https://www.google.com/maps/d/u/0/embed?mid=1TMnpb2kmV2ig4jKmu5vL5ZAgJiiOeN4&ehbc=2E312F&noprof=1'

type TransitItem = {
  q: string
  a: React.ReactNode
}

const getTransitItems = (invitedFriday: boolean): TransitItem[] => [
  {
    q: 'Flying to the Area',
    a: <>
      For our guests who are flying into town for our wedding, we recommend flying into Boston Logan airport (BOS). It is likely the most convenient and inexpensive airport to fly into. The venue is about an hour south of the airport, but the South Shore traffic can get pretty bad (welcome to Boston…). Another airport option is TF Green in Providence (PVD), which is much smaller but also about an hour from the venue.
      <br /><br />
      Once you get here, renting a car is a great option to get around, especially if you want to explore more of the area, but the venue itself is also accessible by public transportation (see below).
    </>,
  },
  {
    q: 'Driving to the Venue',
    a: <>
      The wedding and reception are located at the Lakehouse in Halifax, MA. The address is 550 Monponsett St, Halifax, MA 02338. There is plenty of on-site parking.
      <br /><br />
      The wedding is about an hour from both the Boston and Providence areas, but the traffic can get pretty bad, so we recommend using GPS to figure out the best route when you're on your way.
    </>,
  },
  {
    q: 'Traveling by Public Transit',
    a: <>
      The wedding is a 5-minute drive from the nearby Halifax MBTA Commuter Rail stop, which is about a 45 minute ride from South Station in Boston. The hotels mentioned above are just south of the venue near the Kingston MBTA Commuter Rail stop. Both of these stations are on the Kingston Line. For the full schedule and to plan your trip, check out the{' '}
      <a href="https://www.mbta.com/schedules/CR-Kingston/timetable" target="_blank" rel="noopener noreferrer">Kingston Line schedule</a>. We recommend checking return train times before you arrive so you can plan your evening accordingly.
      <br /><br />
      The segments between the train stations and venue/hotel are not walkable. Please let us know if you will be taking public transportation so we can help coordinate your transportation to and from the train station and the venue.
      {invitedFriday && <>
        <br /><br />
        The Friday night dinner is also accessible by public transit. The venue is about a one mile walk from the train station. From South Station, take the Fall River/New Bedford Line to the Middleborough MBTA Commuter Rail stop (
        <a href="https://www.mbta.com/schedules/CR-NewBedford/timetable" target="_blank" rel="noopener noreferrer">here&apos;s the train schedule</a>
        {' '}to plan your trip).
      </>}
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
  const [invitedFriday, setInvitedFriday] = useState(false)

  useEffect(() => {
    const code = getCode()
    if (!code) {
      router.push('/')
      return
    }
    setAuthed(true)
    supabase
      .from('guest_parties').select('invited_friday').eq('code', code).single()
      .then(({ data }) => setInvitedFriday(!!data?.invited_friday))
  }, [router])

  if (!authed) return null

  const transitItems = getTransitItems(invitedFriday)

  return (
    <>
      <Nav />
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">Travel & Hotels</p>
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
            src={invitedFriday ? FRIDAY_MAP_SRC : GENERAL_MAP_SRC}
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
