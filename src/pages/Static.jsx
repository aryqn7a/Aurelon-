import { Link } from 'react-router-dom'
import { ServiceGrid, Steps } from '../components.jsx'
import { useSettings } from '../lib/settings.jsx'
import { safeUrl, socialLinks, host } from '../lib/data'
export const Services = () => (<div className="wrap"><h2>Services</h2><p className="muted" style={{ maxWidth: '60ch' }}>Every project is scoped, staffed and managed by our corporation. You work with one team, from quote to delivery.</p><ServiceGrid /></div>)
export const About = () => (<div className="wrap"><h2>About us</h2>
  <p style={{ maxWidth: '65ch' }}>We are a Roblox development corporation. Our mission is to help creators and studios build better Roblox games without having to find, vet and manage developers themselves.</p>
  <p style={{ maxWidth: '65ch' }}>We handle requirements, team selection, milestones and quality review. You deal with one point of contact, and we stay accountable for the result.</p>
  <h3 style={{ marginTop: 40 }}>How we work</h3><Steps />
  <p style={{ marginTop: 40 }}><Link className="btn" to="/hire">Hire Our Team</Link></p></div>)
export function Contact() {
  const s = useSettings(), d = safeUrl(s.discord_invite)
  return (<div className="wrap"><h2>Contact</h2>
    <p className="muted">For project work, please use our inquiry form so we can review your requirements.</p>
    <div className="row" style={{ margin: '20px 0' }}><Link className="btn" to="/hire">Send a project inquiry</Link>{d && <a className="btn ghost" href={d} target="_blank" rel="noopener noreferrer">Join our Discord</a>}</div>
    {socialLinks(s.socials).length > 0 && <p className="row">Follow us: {socialLinks(s.socials).map((u) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)' }}>{host(u)}</a>)}</p>}
    {s.contact_email && <p>Email: <a href={`mailto:${s.contact_email}`} style={{ color: 'var(--acc)' }}>{s.contact_email}</a></p>}</div>)
}
