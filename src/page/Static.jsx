import { Link } from 'react-router-dom'
import { Split, Steps } from '../components.jsx'
import { useSettings } from '../lib/settings.jsx'
import { SERVICES, PRINCIPLES, safeUrl, socialLinks, host } from '../lib/data'
import { usePageMeta } from '../lib/meta'
export function Services() {
  const s = useSettings()
  usePageMeta(`Services | ${s.corp_name}`, 'Roblox game development, environments, 3D modeling, Lua scripting, VFX, animation, UI/UX, GFX and complete game development from Aurelon Corporation.')
  return (<div className="wrap sec" style={{ paddingTop: 72 }}>
    <p className="kicker">Services</p><Split as="h1" text="What we do." className="big" />
    <p className="muted" style={{ maxWidth: '56ch', margin: '24px 0 56px' }}>Every project is scoped, staffed and managed by Aurelon. You work with one team from the first quote to final delivery.</p>
    <div className="svcs">{SERVICES.map((x, i) => (
      <div className="svc-row" key={x.t}><div className="svc-n">{String(i + 1).padStart(2, '0')}</div><h2>{x.t}</h2>
        <div><p>{x.d}</p><div className="tags">{x.k.map((k) => <span className="tag" key={k}>{k}</span>)}</div>
          <p style={{ marginTop: 24 }}><Link className="btn ghost sm go" to={`/hire?service=${encodeURIComponent(x.t)}`}>Request a Quote</Link></p></div></div>))}</div></div>)
}
export function About() {
  const s = useSettings()
  usePageMeta(`About | ${s.corp_name}`, 'Aurelon Corporation is a Roblox development corporation. Learn about our mission, workflow and quality standards.')
  return (<div className="wrap sec" style={{ paddingTop: 72 }}>
    <p className="kicker">About Aurelon</p><Split as="h1" text="Our mission." className="big" />
    <div className="about-grid" style={{ marginTop: 48 }}>
      <p className="prose" style={{ fontSize: '1.25rem', color: 'var(--text)' }}>To help creators and studios build better Roblox games without having to find, vet and manage specialists themselves.</p>
      <div className="prose"><p>Aurelon is a development corporation. We take on projects, scope them clearly, and deliver them with a managed team of specialists. You deal with us, and we stay accountable for the result.</p>
        <p>We handle requirements, team selection, milestones and quality review, so your attention stays on your game.</p></div></div>
    <div style={{ height: 96 }} /><p className="kicker">Workflow</p><Split text="How a project runs." className="big" /><div style={{ height: 48 }} /><Steps />
    <div style={{ height: 96 }} /><p className="kicker">Standards</p><Split text="How we work." className="big" /><div style={{ height: 40 }} />
    <div className="prin">{PRINCIPLES.map(([t, d]) => <div className="pr" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
    <p style={{ marginTop: 64 }}><Link className="btn go" to="/hire">Start a Project</Link></p></div>)
}
export function Contact() {
  const s = useSettings(), d = safeUrl(s.discord_invite), soc = socialLinks(s.socials)
  usePageMeta(`Contact | ${s.corp_name}`, 'Contact Aurelon Corporation about your Roblox project.')
  return (<div className="wrap sec" style={{ paddingTop: 72 }}>
    <p className="kicker">Contact</p><Split as="h1" text="Talk to Aurelon." className="big" />
    <div className="about-grid" style={{ marginTop: 48 }}>
      <p className="prose" style={{ fontSize: '1.15rem' }}>For project work, please use our project form so we can review your requirements properly. All communication goes through Aurelon.</p>
      <div className="contact-list">
        <Link className="cap2" to="/hire"><b>Start a project</b><span>Tell us what you want to build</span></Link>
        <Link className="cap2" to="/join"><b>Join our team</b><span>Developers can apply here</span></Link>
        {d && <a className="cap2" href={d} target="_blank" rel="noopener noreferrer"><b>Discord</b><span>Join our community and ticket system</span></a>}
        {s.contact_email && <a className="cap2" href={`mailto:${s.contact_email}`}><b>Email</b><span>{s.contact_email}</span></a>}
        {soc.map((u) => <a className="cap2" key={u} href={u} target="_blank" rel="noopener noreferrer"><b>{host(u)}</b><span>Follow us</span></a>)}</div></div></div>)
}
