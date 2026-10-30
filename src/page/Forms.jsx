import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICES, BUDGETS, safeUrl } from '../lib/data'
import { usePageMeta } from '../lib/meta'
import { useSettings } from '../lib/settings.jsx'
import { Split } from '../components.jsx'
function useSubmit(table) {
  const [st, setSt] = useState({})
  return [st, async (e, build) => {
    e.preventDefault()
    const f = new FormData(e.target)
    if (f.get('website')) return setSt({ ok: true }) // honeypot: bots fill this hidden field
    setSt({ busy: true })
    const { error } = await supabase.from(table).insert(build(f))
    setSt(error ? { err: /Too many/.test(error.message) ? 'Too many submissions from your network. Please try again in an hour.' : 'We could not send this. Please check the fields and try again, or contact us on Discord.' } : { ok: true })
  }]
}
const n = (f, k) => (f.get(k) || '').toString().trim() || null
const Hp = () => <input className="hp" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
const Msg = ({ st }) => <div aria-live="polite">{st.err && <p className="err" role="alert">{st.err}</p>}</div>
const Done = ({ title, children }) => (<div className="wrap sec" style={{ paddingTop: 72 }}><div className="ok">
  <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><rect x="1" y="1" width="54" height="54" fill="none" stroke="#2fd3ff" strokeWidth="2" /><path className="tick" d="M15 29 L24 38 L41 19" pathLength="1" fill="none" stroke="#2fd3ff" strokeWidth="3" /></svg>
  <h2>{title}</h2>{children}</div></div>)
export function Hire() {
  const s = useSettings(), [st, submit] = useSubmit('inquiries'), [sp] = useSearchParams(), pre = sp.get('service'), d = safeUrl(s.discord_invite)
  usePageMeta(`Start a Project | ${s.corp_name}`, 'Tell Aurelon Corporation about your Roblox project and receive a plan, timeline and quote.')
  if (st.ok) return (<Done title="Project inquiry received"><p>Thank you. Our team will review your project and contact you on Discord or by email.</p>
    {d && <p><a className="btn go" href={d} target="_blank" rel="noopener noreferrer">Open our Discord ticket system</a></p>}<p><Link className="btn ghost sm" to="/">Back to home</Link></p></Done>)
  return (<div className="wrap sec" style={{ paddingTop: 72 }}>
    <p className="kicker">Start a project</p><Split as="h1" text="Tell us what you want to build." className="big" />
    <div className="formgrid" style={{ marginTop: 56 }}>
      <aside><h3>What happens next</h3><ol className="next"><li><b>We review</b>Our team reads your requirements.</li><li><b>We reply</b>You receive a plan, timeline and quote.</li><li><b>We build</b>Once agreed, we assign and manage the team.</li></ol>
        <p className="muted">All communication goes through Aurelon. You will not need to contact developers directly.</p></aside>
      <form onSubmit={(e) => submit(e, (f) => ({ client_name: n(f, 'client_name'), discord: n(f, 'discord'), email: n(f, 'email'), project_title: n(f, 'project_title'),
        description: n(f, 'description'), services: f.getAll('services'), budget: n(f, 'budget'), currency: 'USD', deadline: n(f, 'deadline'),
        reference_links: n(f, 'reference_links'), roblox_game_url: n(f, 'roblox_game_url'), additional: n(f, 'additional') }))}>
        <Hp />
        <label>Your name or studio name<input name="client_name" required maxLength="120" /></label>
        <div className="two"><label>Discord username<input name="discord" required minLength="2" maxLength="64" /></label>
          <label>Email (optional)<input name="email" type="email" maxLength="200" /></label></div>
        <label>Project name<input name="project_title" required maxLength="150" /></label>
        <fieldset><legend>Services needed</legend><div className="checks">{SERVICES.map((x) => <label key={x.t}><input type="checkbox" name="services" value={x.t} defaultChecked={x.t === pre} />{x.t}</label>)}</div></fieldset>
        <label>Project description<textarea name="description" required minLength="10" maxLength="5000" /></label>
        <div className="two"><label>Budget range (USD)<select name="budget" defaultValue="Not sure yet">{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select></label>
          <label>Expected deadline<input name="deadline" type="date" /></label></div>
        <label>Roblox game link (optional)<input name="roblox_game_url" type="url" maxLength="500" placeholder="https://www.roblox.com/games/..." /></label>
        <label>Reference links (optional)<textarea name="reference_links" maxLength="2000" /></label>
        <label>Additional requirements (optional)<textarea name="additional" maxLength="3000" /></label>
        <Msg st={st} /><button className="btn go" disabled={st.busy}>{st.busy ? 'Sending...' : 'Send inquiry'}</button></form></div></div>)
}
export function Join() {
  const s = useSettings(), [st, submit] = useSubmit('applications')
  usePageMeta(`Join Our Team | ${s.corp_name}`, 'Apply to join the specialist team behind Aurelon Corporation projects.')
  if (st.ok) return <Done title="Application received"><p>Thank you. We review applications privately and will contact you if there is a fit.</p><p><Link className="btn ghost sm" to="/">Back to home</Link></p></Done>
  return (<div className="wrap sec" style={{ paddingTop: 72 }}>
    <p className="kicker">Join our team</p><Split as="h1" text="Build with Aurelon." className="big" />
    <div className="formgrid" style={{ marginTop: 56 }}>
      <aside><h3>For developers</h3><p className="muted">We work with Roblox specialists on projects we manage: scripters, builders, modelers, VFX artists, animators and UI/UX designers.</p>
        <p className="muted">Your application is stored privately and reviewed by our team. It is never published.</p></aside>
      <form onSubmit={(e) => submit(e, (f) => ({ applicant_name: n(f, 'applicant_name'), discord: n(f, 'discord'), skills: n(f, 'skills'), experience: n(f, 'experience'),
        portfolio_links: n(f, 'portfolio_links'), extra_links: n(f, 'extra_links'), additional: n(f, 'additional'), rates: n(f, 'rates'), availability: n(f, 'availability') }))}>
        <Hp />
        <div className="two"><label>Your name<input name="applicant_name" required maxLength="120" /></label>
          <label>Discord username<input name="discord" required minLength="2" maxLength="64" /></label></div>
        <label>Development specialties<textarea name="skills" required maxLength="1000" /></label>
        <label>Experience<textarea name="experience" required maxLength="3000" /></label>
        <label>Portfolio links<textarea name="portfolio_links" required maxLength="2000" /></label>
        <label>Previous work (optional)<textarea name="extra_links" maxLength="2000" /></label>
        <div className="two"><label>Expected rates (optional)<input name="rates" maxLength="300" /></label>
          <label>Availability (optional)<input name="availability" maxLength="300" placeholder="Hours per week and timezone" /></label></div>
        <label>Additional information (optional)<textarea name="additional" maxLength="3000" /></label>
        <Msg st={st} /><button className="btn go" disabled={st.busy}>{st.busy ? 'Sending...' : 'Send application'}</button></form></div></div>)
}
