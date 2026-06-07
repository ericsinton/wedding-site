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
  attending_friday: boolean | null
  attending_sunday: boolean | null
  meal_choice: string | null
  dietary_restrictions: string | null
}

type Party = {
  id: string
  party_name: string
  code: string
  max_guests: number
  invited_friday: boolean
  is_retro: boolean
  rsvp_submitted_at: string | null
  guests: Guest[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGuest, setEditingGuest] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Guest>>({})
  const [newParty, setNewParty] = useState({
    party_name: '',
    code: '',
    max_guests: '1',
    guest_names: [''],
    invited_friday: false,
  })
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => { checkAuth() }, [])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/admin/login'); return }
    fetchData()
  }

  const fetchData = async () => {
    const { data: partiesData } = await supabase
      .from('guest_parties').select('*').order('party_name')
    const { data: guestsData } = await supabase.from('guests').select('*')
    if (partiesData) {
      setParties(partiesData.map(party => ({
        ...party,
        guests: guestsData?.filter(g => g.party_id === party.id) || []
      })))
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const downloadCSV = () => {
    const rows = [
      ['Party Name', 'Code', 'Seats', 'Friday Invite', 'RSVP Submitted',
       'Guest Name', 'Attending Friday', 'Attending Saturday', 'Attending Sunday',
       'Meal Choice', 'Dietary Restrictions']
    ]
    for (const party of parties) {
      if (party.guests.length === 0) {
        rows.push([party.party_name, party.code, String(party.max_guests),
          party.invited_friday ? 'Yes' : 'No',
          party.rsvp_submitted_at ? new Date(party.rsvp_submitted_at).toLocaleDateString() : 'No response',
          '', '', '', '', '', ''])
      } else {
        for (const guest of party.guests) {
          rows.push([
            party.party_name, party.code, String(party.max_guests),
            party.invited_friday ? 'Yes' : 'No',
            party.rsvp_submitted_at ? new Date(party.rsvp_submitted_at).toLocaleDateString() : 'No response',
            guest.name || '(unnamed)',
            party.invited_friday ? (guest.attending_friday === true ? 'Attending' : guest.attending_friday === false ? 'Declined' : 'Pending') : 'N/A',
            guest.attending === true ? 'Attending' : guest.attending === false ? 'Declined' : 'Pending',
            guest.attending_sunday === true ? 'Attending' : guest.attending_sunday === false ? 'Declined' : 'Pending',
            guest.meal_choice || '—',
            guest.dietary_restrictions || '—',
          ])
        }
      }
    }
    const csv = rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ericandkate-rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateSeats = (seats: string) => {
    const n = parseInt(seats)
    const names = [...newParty.guest_names]
    while (names.length < n) names.push('')
    setNewParty(p => ({ ...p, max_guests: seats, guest_names: names.slice(0, n) }))
  }

  const handleAddParty = async () => {
    setAddError('')
    setAddSuccess('')
    setAdding(true)

    if (!newParty.party_name.trim()) { setAddError('Please enter a party name.'); setAdding(false); return }
    if (!newParty.code.trim()) { setAddError('Please enter a code.'); setAdding(false); return }
    if (!newParty.guest_names[0].trim()) { setAddError('Please enter the primary guest name.'); setAdding(false); return }

    const { data: partyData, error: partyError } = await supabase
      .from('guest_parties')
      .insert({
        party_name: newParty.party_name.trim(),
        code: newParty.code.toUpperCase().trim(),
        max_guests: parseInt(newParty.max_guests),
        invited_friday: newParty.invited_friday,
      })
      .select()
      .single()

    if (partyError) {
      setAddError(partyError.message.includes('unique') ? 'That code is already in use.' : 'Something went wrong.')
      setAdding(false)
      return
    }

    const guestsToInsert = newParty.guest_names.map((name, i) => ({
      party_id: partyData.id,
      name: name.trim() || null,
      is_primary: i === 0,
      attending: null,
      attending_friday: null,
      attending_sunday: null,
      meal_choice: null,
      dietary_restrictions: null,
    }))

    await supabase.from('guests').insert(guestsToInsert)

    setAddSuccess(`${newParty.party_name} added successfully.`)
    setNewParty({ party_name: '', code: '', max_guests: '1', guest_names: [''], invited_friday: false })
    setAdding(false)
    fetchData()
  }

  const toggleFridayInvite = async (partyId: string, current: boolean) => {
    await supabase.from('guest_parties').update({ invited_friday: !current }).eq('id', partyId)
    fetchData()
  }

  const toggleRetro = async (partyId: string, current: boolean) => {
    await supabase.from('guest_parties').update({ is_retro: !current }).eq('id', partyId)
    fetchData()
  }

  const handleDeletePartyRsvp = async (partyId: string, maxGuests: number) => {
    if (!confirm('Reset this RSVP? This will clear all responses but keep guest names.')) return
    const { data: allGuests } = await supabase
      .from('guests').select('id').eq('party_id', partyId)
      .order('created_at', { ascending: true })
    if (allGuests) {
      const toKeep = allGuests.slice(0, maxGuests).map(g => g.id)
      const toDelete = allGuests.slice(maxGuests).map(g => g.id)
      if (toDelete.length > 0) await supabase.from('guests').delete().in('id', toDelete)
      if (toKeep.length > 0) {
        await supabase.from('guests').update({
          attending: null, attending_friday: null, attending_sunday: null,
          meal_choice: null, dietary_restrictions: null,
        }).in('id', toKeep)
      }
    }
    await supabase.from('guest_parties').update({ rsvp_submitted_at: null }).eq('id', partyId)
    fetchData()
  }

  const handleDeleteParty = async (partyId: string, partyName: string) => {
    if (!confirm(`Completely remove ${partyName}? This cannot be undone.`)) return
    await supabase.from('guests').delete().eq('party_id', partyId)
    await supabase.from('guest_parties').delete().eq('id', partyId)
    fetchData()
  }

  const handleDeleteGuest = async (guestId: string, guestName: string | null) => {
    if (!confirm(`Remove ${guestName || 'this guest'}? This cannot be undone.`)) return
    await supabase.from('guests').delete().eq('id', guestId)
    fetchData()
  }

  const startEdit = (guest: Guest) => { setEditingGuest(guest.id); setEditForm({ ...guest }) }

  const saveEdit = async () => {
    if (!editingGuest) return
    await supabase.from('guests').update({
      name: editForm.name,
      attending: editForm.attending,
      attending_friday: editForm.attending_friday,
      attending_sunday: editForm.attending_sunday,
      meal_choice: editForm.meal_choice,
      dietary_restrictions: editForm.dietary_restrictions,
    }).eq('id', editingGuest)
    setEditingGuest(null)
    fetchData()
  }

  const totalInvited = parties.reduce((sum, p) => sum + p.max_guests, 0)
  const totalResponded = parties.filter(p => p.rsvp_submitted_at).length
  const totalAttending = parties.flatMap(p => p.guests).filter(g => g.attending).length
  const totalDeclined = parties.flatMap(p => p.guests).filter(g => g.attending === false).length
  const fridayAttending = parties.filter(p => p.invited_friday).flatMap(p => p.guests).filter(g => g.attending_friday).length
  const sundayAttending = parties.flatMap(p => p.guests).filter(g => g.attending_sunday).length
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="download-btn" onClick={downloadCSV}>Download CSV</button>
          <button className="admin-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card"><p className="stat-label">Total Invited</p><p className="stat-value">{totalInvited}</p></div>
        <div className="stat-card"><p className="stat-label">Parties Responded</p><p className="stat-value">{totalResponded} / {parties.length}</p></div>
        <div className="stat-card"><p className="stat-label">Saturday Attending</p><p className="stat-value">{totalAttending}</p></div>
        <div className="stat-card"><p className="stat-label">Friday Attending</p><p className="stat-value">{fridayAttending}</p></div>
        <div className="stat-card"><p className="stat-label">Sunday Attending</p><p className="stat-value">{sundayAttending}</p></div>
        <div className="stat-card"><p className="stat-label">Declined</p><p className="stat-value">{totalDeclined}</p></div>
      </div>

      <div className="meal-tally">
        <p className="meal-tally-title">Saturday Meal Selections</p>
        <div className="meal-tally-row"><span>Beef</span><span className="meal-tally-count">{mealCounts.beef}</span></div>
        <div className="meal-tally-row"><span>Chicken</span><span className="meal-tally-count">{mealCounts.chicken}</span></div>
        <div className="meal-tally-row"><span>Vegetarian</span><span className="meal-tally-count">{mealCounts.vegetarian}</span></div>
      </div>

      <div className="meal-tally" style={{ marginBottom: '2.5rem' }}>
        <p className="meal-tally-title">Add Guest Party</p>
        {addError && <p className="rsvp-error">{addError}</p>}
        {addSuccess && <p style={{ fontSize: '13px', color: 'var(--sage)', marginBottom: '1rem' }}>{addSuccess}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Party Name</label>
            <input className="edit-input" placeholder="Enter party name" value={newParty.party_name}
              onChange={e => setNewParty(p => ({ ...p, party_name: e.target.value }))} />
          </div>
          <div>
            <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Code</label>
            <input className="edit-input" placeholder="SMITH01" value={newParty.code}
              onChange={e => setNewParty(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
          </div>
          <div>
            <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Seats</label>
            <select className="edit-select" value={newParty.max_guests} onChange={e => updateSeats(e.target.value)} style={{ width: '80px' }}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="invited_friday"
            checked={newParty.invited_friday}
            onChange={e => setNewParty(p => ({ ...p, invited_friday: e.target.checked }))}
          />
          <label htmlFor="invited_friday" className="stat-label" style={{ margin: 0, cursor: 'pointer' }}>
            Invite to Friday dinner (April 2)
          </label>
        </div>
        {newParty.guest_names.map((name, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
              {i === 0 ? 'Primary Guest Name' : `Guest ${i + 1} Name (optional — leave blank if plus one is unknown)`}
            </label>
            <input
              className="edit-input"
              placeholder={i === 0 ? 'Full name' : 'Leave blank if unknown'}
              value={name}
              onChange={e => {
                const names = [...newParty.guest_names]
                names[i] = e.target.value
                setNewParty(p => ({ ...p, guest_names: names }))
              }}
            />
          </div>
        ))}
        <button className="btn-primary" onClick={handleAddParty} disabled={adding} style={{ marginTop: '0.5rem' }}>
          {adding ? 'Adding...' : 'Add Party'}
        </button>
      </div>

      <table className="party-table">
        <thead>
          <tr><th>Party</th><th>Status</th><th>Guests</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {parties.map(party => (
            <tr key={party.id}>
              <td>
                <div style={{ fontWeight: 400 }}>{party.party_name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                  Code: {party.code} · {party.max_guests} seat{party.max_guests !== 1 ? 's' : ''}
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={party.invited_friday}
                    onChange={() => toggleFridayInvite(party.id, party.invited_friday)}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Friday dinner invite</span>
                </div>
                <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={party.is_retro}
                    onChange={() => toggleRetro(party.id, party.is_retro)}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>🪟 Retro mode</span>
                </div>
              </td>
              <td>
                {party.rsvp_submitted_at
                  ? <span className="badge badge-yes">Responded</span>
                  : <span className="badge badge-pending">Pending</span>}
              </td>
              <td>
                {party.guests.length === 0
                  ? <span style={{ color: 'var(--muted)', fontSize: '12px' }}>No guests yet</span>
                  : party.guests.map(guest => (
                    <div key={guest.id} className="guest-row">
                      {editingGuest === guest.id ? (
                        <>
                          <input className="edit-input" value={editForm.name || ''} placeholder="Name"
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                          {party.invited_friday && (
                            <>
                              <label className="stat-label" style={{ display: 'block', marginBottom: '0.3rem' }}>Friday</label>
                              <select className="edit-select"
                                value={editForm.attending_friday === null || editForm.attending_friday === undefined ? '' : String(editForm.attending_friday)}
                                onChange={e => setEditForm(f => ({ ...f, attending_friday: e.target.value === '' ? null : e.target.value === 'true' }))}>
                                <option value="">Unknown</option>
                                <option value="true">Attending</option>
                                <option value="false">Declined</option>
                              </select>
                            </>
                          )}
                          <label className="stat-label" style={{ display: 'block', marginBottom: '0.3rem' }}>Saturday</label>
                          <select className="edit-select"
                            value={editForm.attending === null || editForm.attending === undefined ? '' : String(editForm.attending)}
                            onChange={e => setEditForm(f => ({ ...f, attending: e.target.value === '' ? null : e.target.value === 'true' }))}>
                            <option value="">Unknown</option>
                            <option value="true">Attending</option>
                            <option value="false">Declined</option>
                          </select>
                          <label className="stat-label" style={{ display: 'block', marginBottom: '0.3rem' }}>Sunday</label>
                          <select className="edit-select"
                            value={editForm.attending_sunday === null || editForm.attending_sunday === undefined ? '' : String(editForm.attending_sunday)}
                            onChange={e => setEditForm(f => ({ ...f, attending_sunday: e.target.value === '' ? null : e.target.value === 'true' }))}>
                            <option value="">Unknown</option>
                            <option value="true">Attending</option>
                            <option value="false">Declined</option>
                          </select>
                          <select className="edit-select" value={editForm.meal_choice || ''}
                            onChange={e => setEditForm(f => ({ ...f, meal_choice: e.target.value || null }))}>
                            <option value="">No meal selected</option>
                            <option value="beef">Beef</option>
                            <option value="chicken">Chicken</option>
                            <option value="vegetarian">Vegetarian</option>
                          </select>
                          <input className="edit-input" value={editForm.dietary_restrictions || ''} placeholder="Dietary restrictions"
                            onChange={e => setEditForm(f => ({ ...f, dietary_restrictions: e.target.value || null }))} />
                          <div style={{ marginTop: '0.5rem' }}>
                            <button className="admin-btn" onClick={saveEdit}>Save</button>
                            <button className="admin-btn" onClick={() => setEditingGuest(null)}>Cancel</button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="guest-name">
                            {guest.name || '(unnamed plus one)'}
                          </div>
                          <div className="guest-detail" style={{ marginTop: '0.25rem' }}>
                            {party.invited_friday && (
                              <span>Fri: {guest.attending_friday === true ? '✓' : guest.attending_friday === false ? '✗' : '—'} · </span>
                            )}
                            <span>Sat: {guest.attending === true ? '✓' : guest.attending === false ? '✗' : '—'} · </span>
                            <span>Sun: {guest.attending_sunday === true ? '✓' : guest.attending_sunday === false ? '✗' : '—'}</span>
                          </div>
                          {guest.meal_choice && (
                            <div className="guest-detail">
                              {guest.meal_choice.charAt(0).toUpperCase() + guest.meal_choice.slice(1)}
                              {guest.dietary_restrictions && ` · ${guest.dietary_restrictions}`}
                            </div>
                          )}
                          <button className="admin-btn" style={{ marginTop: '0.4rem' }} onClick={() => startEdit(guest)}>Edit</button>
                          <button className="admin-btn admin-btn-danger" style={{ marginTop: '0.4rem' }} onClick={() => handleDeleteGuest(guest.id, guest.name)}>Remove</button>
                        </>
                      )}
                    </div>
                  ))}
              </td>
              <td>
                {party.rsvp_submitted_at && (
                  <button className="admin-btn admin-btn-danger"
                    onClick={() => handleDeletePartyRsvp(party.id, party.max_guests)}
                    style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Reset RSVP
                  </button>
                )}
                <button className="admin-btn admin-btn-danger"
                  onClick={() => handleDeleteParty(party.id, party.party_name)}>
                  Remove Party
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}