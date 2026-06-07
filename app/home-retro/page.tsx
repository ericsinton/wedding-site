'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCode } from '../lib/useAuth'

export default function HomeRetro() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [visitor] = useState(() => Math.floor(Math.random() * 9000) + 1000)
  const [time, setTime] = useState('')

  useEffect(() => {
    const code = getCode()
    if (!code) {
      router.push('/')
    } else {
      setAuthed(true)
    }
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [router])

  if (!authed) return null

  return (
    <>
      <style>{`
        body {
          background-color: #008080 !important;
          background-image: none !important;
          font-family: 'MS Sans Serif', Arial, sans-serif !important;
        }

        .win98-desktop {
          min-height: 100vh;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .win98-window {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          box-shadow: 2px 2px 0 #000;
          width: 100%;
          max-width: 700px;
          margin-bottom: 16px;
        }

        .win98-titlebar {
          background: linear-gradient(to right, #000080, #1084d0);
          color: white;
          padding: 4px 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: bold;
          user-select: none;
        }

        .win98-titlebar-buttons {
          display: flex;
          gap: 2px;
        }

        .win98-titlebar-btn {
          width: 16px;
          height: 14px;
          background: #c0c0c0;
          border: 1px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: black;
          font-family: Arial, sans-serif;
        }

        .win98-menubar {
          background: #c0c0c0;
          padding: 2px 4px;
          font-size: 12px;
          display: flex;
          gap: 2px;
          border-bottom: 1px solid #808080;
        }

        .win98-menuitem {
          padding: 2px 8px;
          cursor: pointer;
          text-decoration: none;
          color: black;
          font-size: 12px;
        }

        .win98-menuitem:hover {
          background: #000080;
          color: white;
        }

        .win98-content {
          padding: 16px;
        }

        .win98-inset {
          border: 2px solid;
          border-color: #808080 #ffffff #ffffff #808080;
          background: white;
          padding: 12px;
          margin-bottom: 12px;
        }

        .win98-btn {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          padding: 4px 16px;
          font-size: 12px;
          font-family: 'MS Sans Serif', Arial, sans-serif;
          cursor: pointer;
          margin-right: 8px;
          text-decoration: none;
          color: black;
          display: inline-block;
        }

        .win98-btn:hover {
          border-color: #808080 #ffffff #ffffff #808080;
        }

        .win98-heading {
          font-size: 18px;
          font-weight: bold;
          color: #000080;
          text-align: center;
          margin-bottom: 8px;
          font-family: 'Times New Roman', serif;
        }

        .win98-subheading {
          font-size: 13px;
          text-align: center;
          margin-bottom: 12px;
          color: #000000;
        }

        .win98-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }

        .win98-table td {
          padding: 4px 8px;
          border: 1px solid #808080;
        }

        .win98-table tr:nth-child(odd) { background: #ffffff; }
        .win98-table tr:nth-child(even) { background: #efefef; }

        .win98-statusbar {
          background: #c0c0c0;
          border-top: 1px solid #808080;
          padding: 2px 8px;
          font-size: 11px;
          display: flex;
          justify-content: space-between;
        }

        .win98-statusbar-panel {
          border: 1px solid;
          border-color: #808080 #ffffff #ffffff #808080;
          padding: 1px 8px;
        }

        .win98-marquee-wrap {
          background: #000080;
          color: #ffff00;
          padding: 4px;
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
        }

        .win98-marquee-inner {
          display: inline-block;
          animation: marqueeScroll 22s linear infinite;
        }

        .win98-divider {
          border: none;
          border-top: 1px solid #808080;
          border-bottom: 1px solid #ffffff;
          margin: 8px 0;
        }

        .win98-counter {
          text-align: center;
          font-size: 11px;
          color: #000080;
          margin-top: 8px;
          font-weight: bold;
        }

        .win98-taskbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #c0c0c0;
          border-top: 2px solid #ffffff;
          padding: 2px 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 100;
        }

        .win98-start-btn {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #808080 #808080 #ffffff;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .win98-taskbar-window {
          background: #c0c0c0;
          border: 2px solid;
          border-color: #808080 #ffffff #ffffff #808080;
          padding: 2px 12px;
          font-size: 11px;
          min-width: 120px;
        }

        .win98-clock {
          margin-left: auto;
          border: 1px solid;
          border-color: #808080 #ffffff #ffffff #808080;
          padding: 2px 8px;
          font-size: 11px;
        }

        .win98-under-construction {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #ff0000;
          font-weight: bold;
          justify-content: center;
          margin: 8px 0;
        }

        /* Emoticon animations */
        .emo {
          display: inline-block;
          font-style: normal;
          font-weight: bold;
          color: #ff6600;
        }

        .emo-bounce {
          display: inline-block;
          animation: bounce 0.6s infinite alternate;
          font-weight: bold;
          color: #ff6600;
        }

        .emo-spin {
          display: inline-block;
          animation: spin 2s linear infinite;
          font-weight: bold;
          color: #000080;
        }

        .emo-flash {
          display: inline-block;
          animation: flash 0.8s step-end infinite;
          font-weight: bold;
          color: #ff0000;
        }

        .emo-wave {
          display: inline-block;
          animation: wave 1s ease-in-out infinite alternate;
          font-weight: bold;
          color: #008000;
        }

        .emo-shake {
          display: inline-block;
          animation: shake 0.4s linear infinite;
          font-weight: bold;
          color: #800080;
        }

        @keyframes marqueeScroll {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }

        @keyframes bounce {
          from { transform: translateY(0px); }
          to { transform: translateY(-6px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes flash {
          50% { opacity: 0; }
        }

        @keyframes wave {
          from { transform: rotate(-15deg); }
          to { transform: rotate(15deg); }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="win98-desktop" style={{ paddingBottom: '40px' }}>

        <div className="win98-window">
          <div className="win98-titlebar">
            <span>[ Eric & Kate&apos;s Wedding Website ] - Microsoft Internet Explorer</span>
            <div className="win98-titlebar-buttons">
              <div className="win98-titlebar-btn">_</div>
              <div className="win98-titlebar-btn">[]</div>
              <div className="win98-titlebar-btn">X</div>
            </div>
          </div>
          <div className="win98-menubar">
            <span className="win98-menuitem">File</span>
            <span className="win98-menuitem">Edit</span>
            <span className="win98-menuitem">View</span>
            <span className="win98-menuitem">Favorites</span>
            <span className="win98-menuitem">Help</span>
          </div>
          <div className="win98-marquee-wrap">
            <span className="win98-marquee-inner">
              <span className="emo">:-)</span> WELCOME TO ERIC AND KATE&apos;S WEDDING WEBSITE <span className="emo">:-)</span> — April 3, 2027 — The Lakehouse, Halifax MA — YOU ARE INVITED!! <span className="emo">:-D</span>
            </span>
          </div>
          <div className="win98-content">

            <div style={{ textAlign: 'center', fontSize: '28px', marginBottom: '4px', letterSpacing: '8px' }}>
              <span className="emo-bounce">:-)</span>
              <span className="emo-wave" style={{ marginLeft: '8px' }}>&lt;3</span>
              <span className="emo-bounce" style={{ marginLeft: '8px', animationDelay: '0.3s' }}>:-)</span>
            </div>

            <div className="win98-heading">
              ~ Eric Sinton & Kate Lamberti ~<br />
              are getting MARRIED!!!
            </div>
            <div className="win98-subheading">
              Saturday, April 3rd, 2027 · The Lakehouse · Halifax, Massachusetts
            </div>

            <div className="win98-under-construction">
              <span className="emo-flash">[!!!]</span>
              THIS SITE IS UNDER CONSTRUCTION — PLEASE PARDON OUR DUST!!
              <span className="emo-flash">[!!!]</span>
            </div>

            <hr className="win98-divider" />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <Link href="/rsvp" className="win98-btn">[RSVP] RSVP Here!!</Link>
              <Link href="/our-story" className="win98-btn">[&lt;3] Our Story</Link>
              <Link href="/travel" className="win98-btn">[&gt;&gt;] Travel Info</Link>
              <Link href="/registry" className="win98-btn">[$] Registry</Link>
              <Link href="/faq" className="win98-btn">[?] FAQ</Link>
            </div>

            <hr className="win98-divider" />

            <div className="win98-inset">
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                [i] Wedding Details
              </div>
              <table className="win98-table">
                <tbody>
                  <tr>
                    <td><b>Date</b></td>
                    <td>Saturday, April 3, 2027</td>
                  </tr>
                  <tr>
                    <td><b>Ceremony Time</b></td>
                    <td>4:00 PM (Please arrive after 3:30)</td>
                  </tr>
                  <tr>
                    <td><b>Venue</b></td>
                    <td>The Lakehouse, Halifax MA</td>
                  </tr>
                  <tr>
                    <td><b>Dress Code</b></td>
                    <td>Garden Formal (Black tie optional)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="win98-inset">
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                [*] A Note From The Couple
              </div>
              <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
                We are SO excited to celebrate our special day with you!! <span className="emo-bounce" style={{ fontSize: '11px' }}>:-D</span>
                Please use this website to RSVP and find all the info you need.
                Don&apos;t forget to sign our guestbook!! <span className="emo" style={{ color: '#008000' }}>^_^</span>
              </p>
            </div>

            <div className="win98-counter">
              <span className="emo-spin" style={{ fontSize: '10px', marginRight: '6px' }}>*</span>
              You are visitor #{String(visitor).padStart(6, '0')}
              <span className="emo-spin" style={{ fontSize: '10px', marginLeft: '6px' }}>*</span>
            </div>

            <hr className="win98-divider" />

            <div style={{ textAlign: 'center', fontSize: '11px', color: '#808080' }}>
              (c) 2027 Eric & Kate · Made with <span className="emo-shake" style={{ fontSize: '10px' }}>&lt;3</span> and Microsoft FrontPage 98
            </div>
          </div>
          <div className="win98-statusbar">
            <div className="win98-statusbar-panel">[OK] Done</div>
            <div className="win98-statusbar-panel">[www] Internet zone</div>
          </div>
        </div>

        <div className="win98-window" style={{ maxWidth: '700px' }}>
          <div className="win98-titlebar">
            <span>[~] Guestbook - Notepad</span>
            <div className="win98-titlebar-buttons">
              <div className="win98-titlebar-btn">_</div>
              <div className="win98-titlebar-btn">[]</div>
              <div className="win98-titlebar-btn">X</div>
            </div>
          </div>
          <div className="win98-content">
            <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
              <div><b>CoolDude1998:</b> congrats you two!! can&apos;t wait for the big day!! <span className="emo-bounce" style={{ fontSize: '11px' }}>:-D</span></div>
              <div><b>WeddingFan2027:</b> omg SO exciting!! see u there!! <span className="emo" style={{ color: '#ff6600' }}>:*)</span></div>
              <div><b>xX_BestMan_Xx:</b> open bar better be good lol jk love u guys <span className="emo-wave" style={{ fontSize: '11px' }}>O:)</span></div>
              <div><b>YourGreatUncle:</b> what is a website. how do I print this <span className="emo">:-/</span></div>
            </div>
          </div>
        </div>

      </div>

      <div className="win98-taskbar">
        <button className="win98-start-btn">[&gt;&gt;] Start</button>
        <div className="win98-taskbar-window">[ie] Wedding Website</div>
        <div className="win98-taskbar-window">[~] Guestbook</div>
        <div className="win98-clock">{time}</div>
      </div>
    </>
  )
}