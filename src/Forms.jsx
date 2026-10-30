import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICES, safeUrl } from '../lib/data'
import { useSettings } from '../lib/settings.jsx'
function useSubmit(table) {
  const [st, setSt] = useState({})
  return [st, async (e, build) => {
    e.preventDefault()
    const f = new FormData(e.target)
    if (f.get('website')) return setSt({ ok: true }) // honeypot: bots fill this hidden field
    setSt({ busy: true })
    const { error } = await supabase.from(table).insert(build(f))
    setSt(error ? { err: /Too many/.test(error.message) ? 'Too many submissions from your network. Please try again in an hour.' : 'We could not send this. Please check the fields and try again.' } : { ok: true })
  }]
}
const n = (f, k) => (f.get(k) || '').toString().trim() || null
const Hp = () => <input className="hp" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
const Msg = ({ st }) => st.err ? <p className="err" role="alert">{st.err}</p> : null
export function Hire() {
  const s = useSettings(), [st, submit] = useSubmit('inquiries'), [sp] = useSearchParams(), pre = sp.get('service'), d = safeUrl(s.discord_invite)
  if (st.ok) return (<div className="wrap"><div className="ok"><h2>Inquiry received</h2><p>Thank you. Our team will review your project and contact you on Discord{' '}or by email.</p>
    {d && <p><a className="btn" href={d} target="_blank" rel="noopener noreferrer">Open our Discord ticket system</a></p>}</div></div>)
  return (<div className="wrap"><h2>Hire our team</h2><p className="muted">Tell us about your project. We will reply with a plan and quote.</p>
    <form onSubmit={(e) => submit(e, (f) => ({ client_name: n(f, 'client_name'), discord: n(f, 'discord'), email: n(f, 'email'), project_title: n(f, 'project_title'),
      description: n(f, 'description'), services: f.getAll('services'), budget: n(f, 'budget'), currency: n(f, 'currency'), deadline: n(f, 'deadline'),
      reference_links: n(f, 'reference_links'), roblox_game_url: n(f, 'roblox_game_url'), additional: n(f, 'additional') }))}>
      <Hp />
      <label>Your name or studio name<input name="client_name" required maxLength="120" /></label>
      <label>Discord username<input name="discord" required minLength="2" maxLength="64" /></label>
      <label>Email (optional)<input name="email" type="email" maxLength="200" /></label>
      <label>Project title<input name="project_title" required maxLength="150" /></label>
      <label>Project description<textarea name="description" required minLength="10" maxLength="5000" /></label>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend className="muted" style={{ marginBottom: 8 }}>Services needed</legend>
        <div className="checks">{SERVICES.map((x) => <label key={x.t}><input type="checkbox" name="services" value={x.t} defaultChecked={x.t === pre} />{x.t}</label>)}</div></fieldset>
      <div className="row"><label style={{ flex: 1 }}>Budget<input name="budget" maxLength="50" placeholder="e.g. 200" /></label>
        <label>Currency<select name="currency">{['USD', 'INR', 'EUR', 'GBP', 'Robux'].map((c) => <option key={c}>{c}</option>)}</select></label></div>
      <label>Desired deadline<input name="deadline" type="date" /></label>
      <label>Roblox game link, if you already have one (optional)<input name="roblox_game_url" type="url" maxLength="500" placeholder="https://www.roblox.com/games/..." /></label>
      <label>Reference links<textarea name="reference_links" maxLength="2000" /></label>
      <label>Additional requirements<textarea name="additional" maxLength="3000" /></label>
      <Msg st={st} /><button className="btn" disabled={st.busy}>{st.busy ? 'Sending...' : 'Send inquiry'}</button></form></div>)
}
export function Join() {
  const [st, submit] = useSubmit('applications')
  if (st.ok) return <div className="wrap"><div className="ok"><h2>Application received</h2><p>Thank you. We review applications privately and will contact you if there is a fit.</p></div></div>
  return (<div className="wrap"><h2>Join our team</h2><p className="muted">Apply to work on projects we manage. Your details are private and are never published.</p>
    <form onSubmit={(e) => submit(e, (f) => ({ discord: n(f, 'discord'), skills: n(f, 'skills'), portfolio_links: n(f, 'portfolio_links'), experience: n(f, 'experience'),
      rates: n(f, 'rates'), availability: n(f, 'availability'), extra_links: n(f, 'extra_links') }))}>
      <Hp />
      <label>Discord username<input name="discord" required minLength="2" maxLength="64" /></label>
      <label>Skills and specialization<textarea name="skills" required maxLength="1000" /></label>
      <label>Portfolio links<textarea name="portfolio_links" required maxLength="2000" /></label>
      <label>Previous experience<textarea name="experience" required maxLength="3000" /></label>
      <label>Rates or expected compensation<input name="rates" maxLength="300" /></label>
      <label>Availability<input name="availability" maxLength="300" placeholder="Hours per week and timezone" /></label>
      <label>Supporting links (optional)<textarea name="extra_links" maxLength="2000" /></label>
      <Msg st={st} /><button className="btn" disabled={st.busy}>{st.busy ? 'Sending...' : 'Send application'}</button></form></div>)
}
