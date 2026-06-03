'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { getCode } from '../lib/useAuth'

type Party = {
  id: string
  code: string
  party_name: string
  max_guests: number
  rsvp_submitted_at: string | null
}

type GuestForm = {
  id: string
  name: string | null
  is_primary: boolean
  isPreFilled: boolean
  attending: boolean | null
  meal_choice: string
  dietary_restrictions: string
}

export default function RSVPPage() {
  const router = useRouter()
  const [step, setStep] = useState<'loading' | 'form' | 'confirmed'>('loading')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [party, setParty] = useState<Party | null>(null)
  const [guests, setGuests] = useState<GuestForm[]>([])

  useEffect(() => { loadParty() }, [])

  const loadParty = async () => {
    const code = getCode()
    if (!code) { router.push('/'); return }

    const { data: partyData, error: partyError } = await supabase
      .from('guest_parties').select('*').eq('code', code).single()

    if (partyError || !partyData) { router.push('/'); return }

    const { data: existingGuests } = await supabase
      .from('guests').select('*').eq('party_id', partyData.id)
      .order('is_primary', { ascending: false })

    setParty(partyData)
setGuests((existingGuests || []).map(g => ({
  id: g.id,
  name: g.name,
  is_primary: g.is_primary,
  isPreFilled: !!g.name,
  attending: g.attending,
  meal_choice: g.meal_choice || '',
  dietary_restrictions: g.dietary_restrictions || '',
})))
    setStep('form')
  }

  const updateGuest = (index: number, field: keyof GuestForm, value: string | boolean | null) => {
    setGuests(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g))
  }

  const handleSubmit = async () => {
    if (!party) return
    setLoading(true)
    setError('')

    if (guests[0].attending === null) {
      setError('Please let us know if you can attend.')
      setLoading(false)
      return
    }

    for (let i = 0; i < guests.length; i++) {
      const g = guests[i]
      if (g.attending && !g.meal_choice) {
        setError(`Please select a meal for ${g.name || `guest ${i + 1}`}.`)
        setLoading(false)
        return
      }
    }

    for (const guest of guests) {
      await supabase.from('guests').update({
        name: guest.name,
        attending: guest.attending,
        meal_choice: guest.meal_choice || null,
        dietary_restrictions: guest.dietary_restrictions || null,
      }).eq('id', guest.id)
    }

    await supabase.from('guest_parties')
      .update({ rsvp_submitted_at: new Date().toISOString() })
      .eq('id', party.id)

    setStep('confirmed')
    setLoading(false)
  }

  if (step === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--warm-white)' }}>
      <p style={{ color: 'var(--muted)', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px' }}>Loading...</p>
    </div>
  )

  return (
    <>
      <nav>
        <Link href="/our-story">Our Story</Link>
        <Link href="/travel">Travel</Link>
        <span className="nav-monogram">E & K</span>
        <Link href="/registry">Registry</Link>
        <Link href="/rsvp" style={{ color: 'var(--gold)' }}>RSVP</Link>
      </nav>

      <div className="rsvp-page">
        {step === 'form' && party && (
          <>
            <p className="rsvp-eyebrow">RSVP</p>
            <h1 className="rsvp-heading">{party.party_name}</h1>
            <p className="rsvp-subheading">
              {party.max_guests === 1
                ? 'You have 1 seat reserved'
                : `You have ${party.max_guests} seats reserved`}
            </p>
            <div className="rsvp-card">
              {guests.map((guest, i) => (
                <div key={guest.id} className="guest-slot">
{guest.isPreFilled ? (
  <p style={{
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '20px',
    fontWeight: 400,
    color: 'var(--bark)',
    marginBottom: '1rem'
  }}>
    {guest.name}
  </p>
) : (
  <input
    className="rsvp-input"
    placeholder="Your plus one's name"
    value={guest.name || ''}
    onChange={e => updateGuest(i, 'name', e.target.value)}
  />
)}
                    />
                  )}
                  <div className="attending-toggle">
                    <button
                      className={`toggle-btn ${guest.attending === true ? 'active-yes' : ''}`}
                      onClick={() => updateGuest(i, 'attending', true)}
                    >
                      Attending
                    </button>
                    <button
                      className={`toggle-btn ${guest.attending === false ? 'active-no' : ''}`}
                      onClick={() => updateGuest(i, 'attending', false)}
                    >
                      Unable to attend
                    </button>
                  </div>
                  {guest.attending && (
                    <>
                      <select
                        className="rsvp-select"
                        value={guest.meal_choice}
                        onChange={e => updateGuest(i, 'meal_choice', e.target.value)}
                      >
                        <option value="">Select a meal</option>
                        <option value="beef">Beef</option>
                        <option value="chicken">Chicken</option>
                        <option value="vegetarian">Vegetarian</option>
                      </select>
                      <input
                        className="rsvp-input"
                        placeholder="Dietary restrictions (optional)"
                        value={guest.dietary_restrictions}
                        onChange={e => updateGuest(i, 'dietary_restrictions', e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))}
              {error && <p className="rsvp-error" style={{ marginTop: '1rem' }}>{error}</p>}
              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit RSVP'}
              </button>
              <p style={{
                fontSize: '12px',
                color: 'var(--muted)',
                textAlign: 'center',
                marginTop: '1rem',
                fontStyle: 'italic',
                fontFamily: 'Cormorant Garamond, serif',
              }}>
                You can always resubmit before the RSVP deadline.
              </p>
            </div>
          </>
        )}

        {step === 'confirmed' && (
          <div className="confirmed-wrap">
            <div className="confirmed-icon">✦</div>
            <h1 className="confirmed-heading">Thank you!</h1>
            <p className="confirmed-body">
              Your RSVP has been received. We can&apos;t wait to celebrate with you
              at The Lakehouse on April 3rd, 2027.
            </p>
            <Link href="/home" className="btn-primary">Back to home</Link>
          </div>
        )}
      </div>
    </>
  )
}