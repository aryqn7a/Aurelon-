import { Link } from 'react-router-dom'
import { SERVICES, STEPS } from './lib/data'
export function ServiceGrid() {
  return (<div className="grid">{SERVICES.map((s) => (
    <div className="card pad" key={s.t}><h3>{s.t}</h3><p>{s.d}</p>
      <Link className="btn ghost sm" to={`/hire?service=${encodeURIComponent(s.t)}`}>Request a Quote</Link></div>))}</div>)
}
export function Steps() {
  return <ol className="steps">{STEPS.map(([t, d]) => <li key={t}><b>{t}</b>{d}</li>)}</ol>
}
export function ProjectCard({ p }) {
  return (<Link className="card" to={`/portfolio?p=${p.id}`}>
    {p.cover_url ? <img src={p.cover_url} alt={p.title} loading="lazy" /> : <div className="ph" />}
    <div className="in"><h3>{p.title}</h3><div className="tags">{p.categories.map((c) => <span className="tag" key={c}>{c}</span>)}</div></div></Link>)
}
