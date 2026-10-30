import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES, embed, safeUrl } from '../lib/data'
import { ProjectCard } from '../components.jsx'
function Modal({ p, close }) {
  const imgs = [p.cover_url, ...(p.gallery || [])].filter(Boolean), [i, setI] = useState(0), v = p.video_url && embed(p.video_url)
  useEffect(() => { const k = (e) => e.key === 'Escape' && close(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [close])
  return (<div className="modal" onClick={close}><div className="box" role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.stopPropagation()}>
    <button className="btn ghost sm" style={{ float: 'right' }} onClick={close}>Close</button>
    <h2>{p.title}</h2>
    {imgs[i] && <img src={imgs[i]} alt={p.title} />}
    {imgs.length > 1 && <div className="thumbs">{imgs.map((u, k) => <img key={k} src={u} alt="" className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>}
    <p style={{ whiteSpace: 'pre-wrap' }}>{p.description}</p>
    {v?.yt && <iframe src={`https://www.youtube-nocookie.com/embed/${v.yt}`} title="Project video" allowFullScreen loading="lazy" />}
    {v?.link && <p><a className="btn ghost sm" href={v.link} target="_blank" rel="noopener noreferrer">Watch video</a></p>}
    {safeUrl(p.roblox_url) && <p><a className="btn sm" href={safeUrl(p.roblox_url)} target="_blank" rel="noopener noreferrer">View on Roblox</a></p>}
    {(p.links || []).filter(safeUrl).map((l) => <p key={l}><a href={safeUrl(l)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)' }}>{l}</a></p>)}
    {p.credits && <p className="muted">Contributors: {p.credits}</p>}
    {p.image_credits && <p className="muted">Image credits: {p.image_credits}</p>}
  </div></div>)
}
export default function Portfolio() {
  const [all, setAll] = useState(null), [cats, setCats] = useState(CATEGORIES), [cat, setCat] = useState('All'), [sp, setSp] = useSearchParams()
  useEffect(() => {
    supabase.from('projects').select('*').eq('status', 'published').order('sort_order').then(({ data }) => setAll(data || []))
    supabase.from('categories').select('name').order('sort_order').then(({ data }) => data?.length && setCats(data.map((c) => c.name)))
  }, [])
  const list = (all || []).filter((p) => cat === 'All' || p.categories.includes(cat)), open = (all || []).find((p) => p.id === sp.get('p'))
  return (<div className="wrap"><h2>Our work</h2>
    <div className="chips">{['All', ...cats].map((c) => <button key={c} className={'chip' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
    {all === null ? <p className="muted">Loading projects...</p> : list.length ? <div className="grid">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div> : <p className="muted">No projects in this category yet.</p>}
    {open && <Modal p={open} close={() => setSp({})} />}
  </div>)
}
