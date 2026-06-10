'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type NavSettings = {
  our_story: boolean
  travel: boolean
  registry: boolean
  faq: boolean
  rsvp: boolean
}

export default function Nav() {
  const [settings, setSettings] = useState<NavSettings | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['rsvp_open', 'nav_visibility'])

      const navRow = data?.find(d => d.key === 'nav_visibility')
      const rsvpRow = data?.find(d => d.key === 'rsvp_open')
      const navVis = navRow?.value ? JSON.parse(navRow.value) : {}

      setSettings({
        our_story: navVis.our_story ?? true,
        travel: navVis.travel ?? true,
        registry: navVis.registry ?? true,
        faq: navVis.faq ?? true,
        rsvp: rsvpRow?.value === 'true',
      })
    }
    fetchSettings()
  }, [])

  return (
    <nav>
      {settings?.our_story && <Link href="/our-story">Our Story</Link>}
      {settings?.travel && <Link href="/travel">Travel</Link>}
      <Link href="/home" className="nav-monogram">E & K</Link>
      {settings?.registry && <Link href="/registry">Registry</Link>}
      {settings?.faq && <Link href="/faq">FAQ</Link>}
      {settings?.rsvp && <Link href="/rsvp" style={{ color: 'var(--gold)' }}>RSVP</Link>}
    </nav>
  )
}
