'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'
import Nav from '../components/Nav'

const photos = [
  { src: '/story-1.jpeg', alt: 'Eric and Kate' },
  { src: '/story-2.jpeg', alt: 'Eric and Kate' },
  { src: '/story-3.jpeg', alt: 'Eric and Kate' },
  { src: '/story-4.jpeg', alt: 'Eric and Kate' },
  { src: '/story-5.jpeg', alt: 'Eric and Kate' },
  { src: '/story-6.jpeg', alt: 'Eric and Kate' },
]

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
        <div className="story-grid">
          {photos.map((photo, i) => (
            <div key={i} className="story-grid-item">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 600px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                priority={i < 3}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
