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
        <Image
          src="/our-story.jpeg"
          alt="Eric and Kate"
          width={480}
          height={640}
          style={{ width: '100%', maxWidth: '480px', height: 'auto', display: 'block' }}
          priority
        />
      </div>
    </>
  )
}
