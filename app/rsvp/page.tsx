'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { getCode, getTheme } from '../lib/useAuth'
import Nav from '../components/Nav'

type Party = {
  id: string
  code: string
  party_name: string
  max_guests: number
  invited_friday: boolean
  invited_sunday: boolean
  rsvp_submitted_at: string | null
}

type GuestForm = {
  id: string
  name: string
  is_primary: boolean
  isPreFilled: boolean
  attending: boolean | null
  attending_friday: boolean | null
  attending_sunday: boolean | null
  meal_choice: string
  dietary_restrictions: string
}

function PlusOneInput({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <input
      ref={inputRef}
      className="rsvp-input"
      placeholder="Your plus one's name"
      defaultValue={value}
      onBlur={e => onChange(e.target.value)}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default function RSVPPage() {
  const router = useRouter()
  const [step, setStep] = useState<'loading' | 'closed' | 'form' | 'confirmed'>('loading')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [party, setParty] = useState<Party | null>(null)
  const [guests, setGuests] = useState<GuestForm[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [mealOptions, setMealOptions] = useState<{ value: string, label: string }[]>([
    { value: 'beef', label: 'Beef' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'vegetarian', label: 'Vegetarian' },
  ])

  useEffect(() => { loadParty() }, [])

  const loadParty = async () => {
    const code = getCode()
    if (!code) { router.push('/'); return }

    const { data: rsvpOpenData } = await supabase
      .from('site_settings').select('value').eq('key', 'rsvp_open').single()
    if (rsvpOpenData?.value !== 'true') { setStep('closed'); return }

    const { data: partyData, error: partyError } = await supabase
      .from('guest_parties').select('*').eq('code', code).single()

    if (partyError || !partyData) { router.push('/'); return }

    const { data: existingGuests } = await supabase
      .from('guests').select('*').eq('party_id', partyData.id)
      .order('is_primary', { ascending: false })

    setParty(partyData)
    setGuests((existingGuests || []).map(g => ({
      id: g.id,
      name: g.name || '',
      is_primary: g.is_primary,
      isPreFilled: g.name !== null && g.name !== '',
      attending: g.attending,
      attending_friday: g.attending_friday,
      attending_sunday: g.attending_sunday,
      meal_choice: g.meal_choice || '',
      dietary_restrictions: g.dietary_restrictions || '',
    })))

    const { data: mealOptsData } = await supabase
      .from('site_settings').select('value').eq('key', 'meal_options').single()
    if (mealOptsData?.value) setMealOptions(JSON.parse(mealOptsData.value))

    const { data: settingData } = await supabase
      .from('site_settings').select('value').eq('key', 'rsvp_deadline').single()
    if (settingData?.value) {
      const dl = new Date(settingData.value)
      dl.setHours(23, 59, 59, 999)
      if (new Date() > dl) setIsLocked(true)
    }

    setStep('form')
  }

  const updateGuest = (index: number, field: keyof GuestForm, value: string | boolean | null) => {
    setGuests(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g))
  }

  const handleSubmit = async () => {
    if (!party) return
    setLoading(true)
    setError('')

    // Validate Friday if invited
    if (party.invited_friday) {
      for (let i = 0; i < guests.length; i++) {
        if (guests[i].attending_friday === null) {
          setError(`Please respond to the Friday dinner for ${guests[i].name || `guest ${i + 1}`}.`)
          setLoading(false)
          return
        }
      }
    }

    // Validate Saturday
    for (let i = 0; i < guests.length; i++) {
      if (guests[i].attending === null) {
        setError(`Please respond to the Saturday wedding for ${guests[i].name || `guest ${i + 1}`}.`)
        setLoading(false)
        return
      }
    }

    // Validate meal choice if attending Saturday
    for (let i = 0; i < guests.length; i++) {
      if (guests[i].attending && !guests[i].meal_choice) {
        setError(`Please select a meal for ${guests[i].name || `guest ${i + 1}`}.`)
        setLoading(false)
        return
      }
    }

    // Validate Sunday
    if (party.invited_sunday) {
      for (let i = 0; i < guests.length; i++) {
        if (guests[i].attending_sunday === null) {
          setError(`Please respond to the Sunday breakfast for ${guests[i].name || `guest ${i + 1}`}.`)
          setLoading(false)
          return
        }
      }
    }

    for (const guest of guests) {
      await supabase.from('guests').update({
        name: guest.name || null,
        attending: guest.attending,
        attending_friday: party.invited_friday ? guest.attending_friday : null,
        attending_sunday: party.invited_sunday ? guest.attending_sunday : null,
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
      <Nav />
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
            {isLocked && (
              <div style={{
                background: 'rgba(196, 151, 58, 0.08)',
                border: '0.5px solid var(--gold)',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                maxWidth: '560px',
                width: '100%',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: 'var(--bark)', fontWeight: 300 }}>
                  The RSVP deadline has passed. Your responses are shown below.
                  Please contact us directly if you need to make any changes.
                </p>
              </div>
            )}
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
                    isLocked
                      ? <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 400, color: 'var(--bark)', marginBottom: '1rem' }}>{guest.name || '(unnamed)'}</p>
                      : <PlusOneInput value={guest.name} onChange={v => updateGuest(i, 'name', v)} />
                  )}

                  {party.invited_friday && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <p className="guest-slot-label">Friday Dinner — April 2</p>
                      {isLocked ? (
                        <p style={{ fontSize: '14px', color: 'var(--charcoal)', fontWeight: 300 }}>
                          {guest.attending_friday === true ? 'Attending' : guest.attending_friday === false ? 'Unable to attend' : '—'}
                        </p>
                      ) : (
                        <div className="attending-toggle">
                          <button
                            className={`toggle-btn ${guest.attending_friday === true ? 'active-yes' : ''}`}
                            onClick={() => updateGuest(i, 'attending_friday', true)}
                          >
                            Attending
                          </button>
                          <button
                            className={`toggle-btn ${guest.attending_friday === false ? 'active-no' : ''}`}
                            onClick={() => updateGuest(i, 'attending_friday', false)}
                          >
                            Unable to attend
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginBottom: '1.25rem' }}>
                    <p className="guest-slot-label">Saturday Wedding — April 3</p>
                    {isLocked ? (
                      <>
                        <p style={{ fontSize: '14px', color: 'var(--charcoal)', fontWeight: 300 }}>
                          {guest.attending === true ? 'Attending' : guest.attending === false ? 'Unable to attend' : '—'}
                        </p>
                        {guest.meal_choice && (
                          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '0.4rem', fontWeight: 300 }}>
                            {mealOptions.find(o => o.value === guest.meal_choice)?.label ?? (guest.meal_choice.charAt(0).toUpperCase() + guest.meal_choice.slice(1))}
                            {guest.dietary_restrictions && ` · ${guest.dietary_restrictions}`}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
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
                              style={{ marginTop: '0.75rem' }}
                            >
                              <option value="">Select a meal</option>
                              {mealOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <input
                              className="rsvp-input"
                              placeholder="Dietary restrictions (optional)"
                              value={guest.dietary_restrictions}
                              onChange={e => updateGuest(i, 'dietary_restrictions', e.target.value)}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {party.invited_sunday && (
                    <div>
                      <p className="guest-slot-label">Sunday Breakfast — April 4</p>
                      {isLocked ? (
                        <p style={{ fontSize: '14px', color: 'var(--charcoal)', fontWeight: 300 }}>
                          {guest.attending_sunday === true ? 'Attending' : guest.attending_sunday === false ? 'Unable to attend' : '—'}
                        </p>
                      ) : (
                        <div className="attending-toggle">
                          <button
                            className={`toggle-btn ${guest.attending_sunday === true ? 'active-yes' : ''}`}
                            onClick={() => updateGuest(i, 'attending_sunday', true)}
                          >
                            Attending
                          </button>
                          <button
                            className={`toggle-btn ${guest.attending_sunday === false ? 'active-no' : ''}`}
                            onClick={() => updateGuest(i, 'attending_sunday', false)}
                          >
                            Unable to attend
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!isLocked && (
                <>
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
                </>
              )}
            </div>
          </>
        )}

        {step === 'closed' && (
          <div className="confirmed-wrap">
            <div className="confirmed-icon">✦</div>
            <h1 className="confirmed-heading">RSVP Coming Soon</h1>
            <p className="confirmed-body">
              We&apos;ll be opening RSVPs shortly. Check back here once you receive your formal invitation.
            </p>
            <Link href="/home" className="btn-primary">Back to Home</Link>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="confirmed-wrap">
            <div className="confirmed-icon">✦</div>
            <h1 className="confirmed-heading">Thank you!</h1>
            <p className="confirmed-body">
              Your RSVP has been received. We can&apos;t wait to celebrate with you
              at The Lakehouse on April 3rd, 2027.
            </p>
            <Link href={getTheme() === 'retro' ? '/home-retro' : '/home'} className="btn-primary">Back to home</Link>
          </div>
        )}
      </div>
    </>
  )
}