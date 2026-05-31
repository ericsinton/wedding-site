'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type Party = {
  id: string
  code: string
  party_name: string
  max_guests: number
  rsvp_submitted_at: string | null
}

type GuestForm = {
  name: string
  attending: boolean | null
  meal_choice: string
  dietary_restrictions: string
}

export default function RSVPPage() {
  const [step, setStep] = useState<'code' | 'form' | 'confirmed'>('code')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [party, setParty] = useState<Party | null>(null)
  const [guests, setGuests] = useState<GuestForm[]>([])

  const handleCodeSubmit = async () => {
    setError('')
    setLoading(true)

    const { data: partyData, error: partyError } = await supabase
      .from('guest_parties')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .single()

    if (partyError || !partyData) {
      setError("We couldn't find that code. Please check your save-the-date and try again.")
      setLoading(false)
      return
    }

    const { data: existingGuests } = await supabase
      .from('guests')
      .select('*')
      .eq('party_id', partyData.id)
      .order('is_primary', { ascending: false })

    const slots: GuestForm[] = []
    for (let i = 0; i < partyData.max_guests; i++) {
      const existing = existingGuests?.[i]
      slots.push({
        name: existing?.name || '',
        attending: existing?.attending ?? null,
        meal_choice: existing?.meal_choice || '',
        dietary_restrictions: existing?.dietary_restrictions || '',
      })
    }

    setParty(partyData)
    setGuests(slots)
    setStep('form')
    setLoading(false)
  }

  const updateGuest = (index: number, field: keyof GuestForm, value: string | boolean | null) => {
    setGuests(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g))
  }

  const handleSubmit = async () => {
    if (!party) return
    setLoading(true)
    setError('')

    if (!guests[0].name.trim()) {
      setError('Please enter your name.')
      setLoading(false)
      return
    }
    if (guests[0].attending === null) {
      setError('Please let us know if you can attend.')
      setLoading(false)
      return
    }
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i]
      if (g.name.trim() && g.attending && !g.meal_choice) {
        setError(`Please select a meal for ${g.name || `guest ${i + 1}`}.`)
        setLoading(false)
        return
      }
    }

    await supabase.from('guests').delete().eq('party_id', party.id)

    const guestsToInsert = guests
      .filter((g, i) => i === 0 || g.name.trim())
      .map((g, i) => ({
        party_id: party.id,
        name: g.name.trim() || null,
        is_primary: i === 0,
        attending: g.attending,
        meal_choice: g.meal_choice || null,
        dietary_restrictions: g.dietary_restrictions || null,
      }))

    const { error: insertError } = await supabase.from('guests').insert(guestsToInsert)

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    await supabase
      .from('guest_parties')
      .update({ rsvp_submitted_at: new Date().toISOString() })
      .eq('id', party.id)

    setStep('confirmed')
    setLoading(false)
  }

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

        {step === 'code' && (
          <>
            <p className="rsvp-eyebrow">RSVP</p>
            <h1 className="rsvp-heading">Find your invitation</h1>
            <p className="rsvp-subheading">Enter the code from your save-the-date</p>
            <div className="rsvp-card">
              {error && <p className="rsvp-error">{error}</p>}
              <input
                className="rsvp-input"
                placeholder="Enter your code"
                value={code}
                onChange={e => setCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCodeSubmit()}
              />
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleCodeSubmit}
                disabled={loading || !code.trim()}
              >
                {loading ? 'Looking up...' : 'Continue'}
              </button>
            </div>
          </>
        )}

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
                <div key={i} className="guest-slot">
                  <p className="guest-slot-label">
                    {i === 0 ? 'Your details' : `Guest ${i + 1}`}
                  </p>
                  <input
                    className="rsvp-input"
                    placeholder={i === 0 ? 'Your name' : 'Guest name (if attending)'}
                    value={guest.name}
                    onChange={e => updateGuest(i, 'name', e.target.value)}
                  />
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
            <Link href="/" className="btn-primary">Back to home</Link>
          </div>
        )}

      </div>
    </>
  )
}