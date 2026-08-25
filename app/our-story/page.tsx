'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'
import Nav from '../components/Nav'

export default function OurStory() {
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
      <div className="rsvp-page">
        <p className="rsvp-eyebrow">Our Story</p>
        <div className="story-text">
          <p>
            We first met in August 2016 during our freshman orientation at Tufts University. That Fall, a physics class in which we both earned a passing grade certainly solidified our friendship. We spent the next 4 years misadventuring and growing closer around the Greater Boston Area. Kate dragged Eric into random volunteer work. Eric drove Kate around in his 2-door Toyota Yaris. We began watching Family Guy weekly, a habit we continue today.
          </p>
          <p>
            Eric and Kate both worked as wildland firefighters, first on different crews and in different locations, but eventually together in 2024 in Klamath Falls, Oregon. Within weeks of reconnecting, we knew with fast certainty that our nearly 8-year journey as best friends had grown into a lifetime partnership.
          </p>
          <p>
            If you are reading this, you hold a special place in our hearts. From many different chapters of our lives, you helped shape us into the individuals and couple we are today. Now, we are so excited to celebrate with you the start of our blessed and beautiful life together!
          </p>
        </div>
        <div className="story-hero-photo">
          <Image
            src="/story-hero.jpg"
            alt="Eric and Kate"
            fill
            sizes="(max-width: 600px) 100vw, 760px"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
            priority
          />
        </div>
      </div>
    </>
  )
}
