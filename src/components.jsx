import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { SERVICES, STEPS, reduced } from './lib/data'
// Headline that reveals word by word (the reveal is armed and triggered in App.jsx).
export const Split = ({ text, as: T = 'h2', className = '' }) => (
  <T className={'split ' + className} data-split>{text.split(' ').map((w, i) => <span key={i}><span className="sw"><span style={{ '--i': i }}>{w}</span></span>{' '}</span>)}</T>)
export function Cube({ size, left, top, z, d, core }) {
  return (<div className={'cube' + (core ? ' core' : '')} style={{ '--s': size + 'px', '--z': z, '--d': d + 's', left, top }}>
    <div className="cube-in">{['f', 'b', 'l', 'r', 't', 'u'].map((f) => <i key={f} className={f} />)}</div></div>)
}
export function Steps() {
  return <ol className="proc">{STEPS.map(([t, d], i) => <li key={t}><span className="num">0{i + 1}</span><b>{t}</b>{d}</li>)}</ol>
}
export function ProjectCard({ p }) {
  const ref = useRef(null)
  const move = (e) => { // subtle 3D tilt on hover (mouse only)
    const el = ref.current
    if (!el || reduced() || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1100px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`
  }
  const leave = () => { if (ref.current) ref.current.style.transform = '' }
  return (<Link ref={ref} className="card pcard" to={`/portfolio?p=${p.id}`} onPointerMove={move} onPointerLeave={leave}>
    <div className="im">{p.cover_url ? <img src={p.cover_url} alt={p.title} loading="lazy" /> : <div className="ph" />}</div>
    <div className="pc-body"><div className="tags">{p.categories.map((c) => <span className="tag" key={c}>{c}</span>)}</div><h3>{p.title}</h3><span className="view">View project</span></div></Link>)
}
export function ServiceRows() {
  return (<div className="caps">{SERVICES.map((s, i) => (
    <Link className="cap" to="/services" key={s.t}><span className="n">{String(i + 1).padStart(2, '0')}</span><h3>{s.t}</h3><p>{s.d}</p><span className="chev" aria-hidden="true" /></Link>))}</div>)
}
