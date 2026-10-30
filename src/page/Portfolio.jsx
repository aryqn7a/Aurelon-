import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES, embed, safeUrl } from '../lib/data'
import { usePageMeta } from '../lib/meta'
import { useSettings } from '../lib/settings.jsx'
import { Split, ProjectCard } from '../components.jsx'
function ProjectView({ p, close }) {
  const imgs = [p.cover_url, ...(p.gallery || [])].filter(Boolean), [i, setI] = useState(0), v = p.video_url && embed(p.video_url)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && close(); addEventListener('keydown', k)
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.body.style.overflow = o }
  }, [close])
  return (<div className="modal" onClick={close}><div className="pv" role="dialog" aria-modal="true" aria-label={p.title} onClick={(e) => e.stopPropagation()}>
    <button className="btn ghost sm x" onClick={close}>Close</button>
    <div className="pv-media">
      {imgs[i] && <img src={imgs[i]} alt={p.title} />}
      {imgs.length > 1 && <div className="thumbs">{imgs.map((u, k) => <img key={k} src={u} alt="" className={k === i ? 'on' : ''} onClick={() => setI(k)} />)}</div>}
      {v?.yt && <iframe src={`https://www.youtube-nocookie.com/embed/${v.yt}`} title="Project video" allowFullScreen loading="lazy" />}
      {v?.file && <video src={v.file} controls preload="none" />}
    </div>
    <div className="pv-info">
      <h2>{p.title}</h2>
      {p.categories?.length > 0 && <><h4>Services provided</h4><div className="tags">{p.categories.map((c) => <span className="tag" key={c}>{c}</span>)}</div></>}
      <p style={{ whiteSpace: 'pre-wrap', marginTop: 24 }}>{p.description}</p>
      <div className="row">
        {safeUrl(p.roblox_url) && <a className="btn sm" href={safeUrl(p.roblox_url)} target="_blank" rel="noopener noreferrer">View on Roblox</a>}
        {v?.link && <a className="btn ghost sm" href={v.link} target="_blank" rel="noopener noreferrer">Watch video</a>}
        <Link className="btn ghost sm" to="/hire">Start a similar project</Link></div>
      {(p.links || []).filter(safeUrl).map((l) => <p key={l}><a href={safeUrl(l)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)', wordBreak: 'break-all' }}>{l}</a></p>)}
      {p.image_credits && <p className="muted" style={{ fontSize: '.9rem' }}>Image credits: {p.image_credits}</p>}
    </div></div></div>)
}
export default function Portfolio() {
  const s = useSettings(), [all, setAll] = useState(null), [cats, setCats] = useState(CATEGORIES), [cat, setCat] = useState('All'), [sp, setSp] = useSearchParams()
  usePageMeta(`Portfolio | ${s.corp_name}`, 'Selected Roblox projects by Aurelon Corporation: environments, 3D, scripting, VFX, animation, UI/UX and complete games.')
  useEffect(() => {
    supabase.from('projects').select('*').eq('status', 'published').order('sort_order').then(({ data }) => setAll(data || []))
    supabase.from('categories').select('name').order('sort_order').then(({ data }) => data?.length && setCats(data.map((c) => c.name)))
  }, [])
  const list = (all || []).filter((p) => cat === 'All' || p.categories.includes(cat)), open = (all || []).find((p) => p.id === sp.get('p'))
  return (<div className="wrap sec" style={{ paddingTop: 72 }}>
    <p className="kicker">Portfolio</p><Split as="h1" text="Our work." className="big" />
    <div className="tabs chips" style={{ marginTop: 40 }}>{['All', ...cats].map((c) => <button key={c} className={'chip' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
    {all === null ? <p className="muted">Loading projects...</p> : list.length ? <div className="pgrid">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      : <div className="empty"><h3>{all.length ? 'No projects in this category yet.' : 'Our portfolio is being curated.'}</h3><p>{all.length ? 'Try another category.' : 'Completed projects will appear here.'}</p></div>}
    {open && <ProjectView p={open} close={() => setSp({})} />}
  </div>)
}
