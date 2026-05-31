'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

type Guest = {
  id: string
  party_id: string
  name: string | null
  is_primary: boolean
  attending: boolean | null
  meal_choice: string | null
  dietary_restrictions: string | null
}

type Party = {
  id: string
  party_name: string
  code: string
  max_guests: number
  rsvp_submitted_at: string | null
  guests: Guest[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGuest, setEditingGuest] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Guest>>({})

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }

  const fetchData = async () => {
    const { data: partiesData } = await supabase
      .from('guest_parties')
      .select('*')
      .order('party_name')

    const { data: guestsData } = await supabase
      .from('guests')
      .select('*')

    if (partiesData) {
      const combined = partiesData.map(party => ({
        ...party,
        guests: guestsData?.filter(g => g.party_id === party.id) || []
      }))
      setParties(combined)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleDeletePartyRsvp = async (partyId: string) => {
    if (!confirm('Reset this RSVP? This will delete all guest responses for this party.')) return
    await supabase.from('guests').delete().eq('party_id', partyId)
    await supabase.from('guest_parties').update({ rsvp_submitted_at: null }).eq('id', partyId)
    fetchData()
  }

  const startEdit = (guest: Guest) => {
    setEditingGuest(guest.id)
    setEditForm({ ...guest })
  }

  const saveEdit = async () => {
    if (!editingGuest) return
    await supabase.from('guests').update({
      name: editForm.name,
      attending: editForm.attending,
      meal_choice: editForm.meal_choice,
      dietary_restrictions: editForm.dietary_restrictions,
    }).eq('id', editingGuest)
    setEditingGuest(null)
    fetchData()
  }

  // Stats
  const totalInvited = parties.reduce((sum, p) => sum + p.max_guests, 0)
  const totalResponded = parties.filter(p => p.rsvp_submitted_at).length
  const totalAttending = parties.flatMap(p => p.guests).filter(g => g.attending).length
  const totalDeclined = parties.flatMap(p => p.guests).filter(g => g.attending === false).length
  const mealCounts = {
    beef: parties.flatMap(p => p.guests).filter(g => g.meal_choice === 'beef').length,
    chicken: parties.flatMap(p => p.guests).filter(g => g.meal_choice === 'chicken').length,
    vegetarian: parties.flatMap(p => p.guests).filter(g => g.meal_choice === 'vegetarian').length,
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--cream)' }}>
      <p style={{ color: 'var(--muted)', fontFamily: 'Cormorant Garamond, serif', fontSize: '24px' }}>Loading...</p>
    </div>
  )

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Eric & Kate — Admin</h1>
        <button className="admin-btn" onClick={handleLogout}>Sign Out</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <p className="stat-label">Total Invited</p>
          <p className="stat-value">{totalInvited}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Parties Responded</p>
          <p className="stat-value">{totalResponded} / {parties.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Attending</p>
          <p className="stat-value">{totalAttending}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Declined</p>
          <p className="stat-value">{totalDeclined}</p>
        </div>
      </div>

      <div className="meal-tally">
        <p className="meal-tally-title">Meal Selections</p>
        <div className="meal-tally-row">
          <span>Beef</span>
          <span className="meal-tally-count">{mealCounts.beef}</span>
        </div>
        <div className="meal-tally-row">
          <span>Chicken</span>
          <span className="meal-tally-count">{mealCounts.chicken}</span>
        </div>
        <div className="meal-tally-row">
          <span>Vegetarian</span>
          <span className="meal-tally-count">{mealCounts.vegetarian}</span>
        </div>
      </div>

      <table className="party-table">
        <thead>
          <tr>
            <th>Party</th>
            <th>Status</th>
            <th>Guests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parties.map(party => (
            <tr key={party.id}>
              <td>
                <div style={{ fontWeight: 400 }}>{party.party_name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  Code: {party.code} · {party.max_guests} seat{party.max_guests !== 1 ? 's' : ''}
                </div>
              </td>
              <td>
                {party.rsvp_submitted_at ? (
                  <span className="badge badge-yes">Responded</span>
                ) : (
                  <span className="badge badge-pending">Pending</span>
                )}
              </td>
              <td>
                {party.guests.length === 0 ? (
                  <span style={{ color: 'var(--muted)', fontSize: '12px' }}>No response yet</span>
                ) : (
                  party.guests.map(guest => (
                    <div key={guest.id} className="guest-row">
                      {editingGuest === guest.id ? (
                        <>
                          <input
                            className="edit-input"
                            value={editForm.name || ''}
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Name"
                          />
                          <select
                            className="edit-select"
                            value={editForm.attending === null ? '' : String(editForm.attending)}
                            onChange={e => setEditForm(f => ({ ...f, attending: e.target.value === '' ? null : e.target.value === 'true' }))}
                          >
                            <option value="">Unknown</option>
                            <option value="true">Attending</option>
                            <option value="false">Declined</option>
                          </select>
                          <select
                            className="edit-select"
                            value={editForm.meal_choice || ''}
                            onChange={e => setEditForm(f => ({ ...f, meal_choice: e.target.value || null }))}
                          >
                            <option value="">No meal selected</option>
                            <option value="beef">Beef</option>
                            <option value="chicken">Chicken</option>
                            <option value="vegetarian">Vegetarian</option>
                          </select>
                          <input
                            className="edit-input"
                            value={editForm.dietary_restrictions || ''}
                            onChange={e => setEditForm(f => ({ ...f, dietary_restrictions: e.target.value || null }))}
                            placeholder="Dietary restrictions"
                          />
                          <div style={{ marginTop: '0.5rem' }}>
                            <button className="admin-btn" onClick={saveEdit}>Save</button>
                            <button className="admin-btn" onClick={() => setEditingGuest(null)}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="guest-name">
                            {guest.name || '—'}
                            {' '}
                            {guest.attending === true && <span className="badge badge-yes">Attending</span>}
                            {guest.attending === false && <span className="badge badge-no">Declined</span>}
                          </div>
                          {guest.meal_choice && (
                            <div className="guest-detail">
                              {guest.meal_choice.charAt(0).toUpperCase() + guest.meal_choice.slice(1)}
                              {guest.dietary_restrictions && ` · ${guest.dietary_restrictions}`}
                            </div>
                          )}
                          <button
                            className="admin-btn"
                            style={{ marginTop: '0.4rem' }}
                            onClick={() => startEdit(guest)}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </td>
              <td>
                {party.rsvp_submitted_at && (
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDeletePartyRsvp(party.id)}
                  >
                    Reset RSVP
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}