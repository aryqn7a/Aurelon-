import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES, safeUrl } from '../lib/data'
import { upload } from './upload.js'
const blank = { title: '', description: '', categories: [], cover_url: '', gallery: [], video_url: '', roblox_url: '', links: [], credits: '', image_credits: '', featured: false, status: 'draft' }
function Editor({ init, cats, count, onDone }) {
  const [f, setF] = useState({ ...blank, ...init, video_url: init.video_url || '', roblox_url: init.roblox_url || '', credits: init.credits || '', image_credits: init.image_credits || '', cover_url: init.cover_url || '' })
  const [lt, setLt] = useState((init.links || []).join('\n')), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const pick = async (e, multi) => {
    setErr(''); setBusy(true)
    try { const urls = []; for (const file of e.target.files) urls.push(await upload(file)); multi ? set('gallery', [...f.gallery, ...urls]) : set('cover_url', urls[0]) }
    catch (x) { setErr(x.message) }
    setBusy(false); e.target.value = ''
  }
  const save = async (e) => {
    e.preventDefault(); setErr('')
    const video = f.video_url.trim(), links = lt.split('\n').map((s) => s.trim()).filter(Boolean)
    if (f.roblox_url.trim() && !safeUrl(f.roblox_url.trim())) return setErr('The Roblox link must start with http:// or https://')
    if (video && !safeUrl(video)) return setErr('The video link must start with http:// or https://')
    if (links.some((l) => !safeUrl(l))) return setErr('Every external link must start with http:// or https://')
    const row = { title: f.title.trim(), description: f.description.trim(), categories: f.categories, cover_url: f.cover_url || null, gallery: f.gallery,
      video_url: video || null, roblox_url: f.roblox_url.trim() || null, links, credits: f.credits.trim() || null, image_credits: f.image_credits.trim() || null, featured: f.featured, status: f.status }
    const { error } = f.id ? await supabase.from('projects').update(row).eq('id', f.id) : await supabase.from('projects').insert({ ...row, sort_order: count })
    if (error) setErr(error.message); else onDone()
  }
  const tog = (c) => set('categories', f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c])
  return (<form onSubmit={save}><h2>{f.id ? 'Edit project' : 'New project'}</h2>
    <label>Title<input value={f.title} onChange={(e) => set('title', e.target.value)} required maxLength="120" /></label>
    <label>Description<textarea value={f.description} onChange={(e) => set('description', e.target.value)} maxLength="5000" /></label>
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend className="muted" style={{ marginBottom: 8 }}>Categories</legend>
      <div className="checks">{cats.map((c) => <label key={c}><input type="checkbox" checked={f.categories.includes(c)} onChange={() => tog(c)} />{c}</label>)}</div></fieldset>
    <label>Cover image (PNG, JPG or WebP, max 5 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => pick(e, false)} /></label>
    {f.cover_url && <img className="thumb" style={{ width: 160 }} src={f.cover_url} alt="Cover" />}
    <label>Gallery images (you can select several)<input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => pick(e, true)} /></label>
    <div className="thumbs">{f.gallery.map((u) => <span key={u}><img src={u} alt="" className="on" /><br /><button type="button" className="chip" onClick={() => set('gallery', f.gallery.filter((x) => x !== u))}>Remove</button></span>)}</div>
    <label>Video link (YouTube or other)<input value={f.video_url} onChange={(e) => set('video_url', e.target.value)} /></label>
    <label>Roblox game link (optional)<input value={f.roblox_url} onChange={(e) => set('roblox_url', e.target.value)} placeholder="https://www.roblox.com/games/..." /></label>
    <label>External links, one per line<textarea value={lt} onChange={(e) => setLt(e.target.value)} /></label>
    <label>Contributor credits (optional)<input value={f.credits} onChange={(e) => set('credits', e.target.value)} maxLength="500" /></label>
    <label>Image credits (optional)<input value={f.image_credits} onChange={(e) => set('image_credits', e.target.value)} maxLength="500" /></label>
    <label className="checks"><input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} />Featured on the home page</label>
    <label>Status<select value={f.status} onChange={(e) => set('status', e.target.value)}><option value="draft">Draft (hidden)</option><option value="published">Published (public)</option></select></label>
    {err && <p className="err" role="alert">{err}</p>}
    <div className="row"><button className="btn" disabled={busy}>{busy ? 'Uploading...' : 'Save project'}</button><button type="button" className="btn ghost" onClick={onDone}>Cancel</button></div></form>)
}
export default function Projects() {
  const [list, setList] = useState([]), [ed, setEd] = useState(null), [cats, setCats] = useState(CATEGORIES), [msg, setMsg] = useState('')
  const load = () => supabase.from('projects').select('*').order('sort_order').then(({ data, error }) => { if (error) setMsg(error.message); else setList(data) })
  useEffect(() => { load(); supabase.from('categories').select('name').order('sort_order').then(({ data }) => data?.length && setCats(data.map((c) => c.name))) }, [])
  const patch = async (id, v) => { const { error } = await supabase.from('projects').update(v).eq('id', id); setMsg(error ? error.message : 'Saved.'); load() }
  const move = async (i, d) => {
    const a = [...list], j = i + d; if (j < 0 || j >= a.length) return
    ;[a[i], a[j]] = [a[j], a[i]]
    await Promise.all(a.map((p, k) => supabase.from('projects').update({ sort_order: k }).eq('id', p.id))); load()
  }
  const del = async (p) => { if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return; const { error } = await supabase.from('projects').delete().eq('id', p.id); setMsg(error ? error.message : 'Deleted.'); load() }
  if (ed) return <Editor init={ed} cats={cats} count={list.length} onDone={() => { setEd(null); load() }} />
  return (<div><div className="row" style={{ justifyContent: 'space-between' }}><h2>Portfolio projects</h2><button className="btn" onClick={() => setEd({})}>Add project</button></div>
    {msg && <p className="muted" role="status">{msg}</p>}
    {list.length === 0 ? <p className="muted">No projects yet. Add your first project.</p> :
      <div style={{ overflowX: 'auto' }}><table><thead><tr><th>Cover</th><th>Title</th><th>Status</th><th>Featured</th><th>Order</th><th>Actions</th></tr></thead><tbody>
        {list.map((p, i) => (<tr key={p.id}><td>{p.cover_url ? <img className="thumb" src={p.cover_url} alt="" /> : <span className="thumb" />}</td><td>{p.title}</td><td>{p.status}</td>
          <td><input type="checkbox" checked={p.featured} aria-label="Featured" onChange={(e) => patch(p.id, { featured: e.target.checked })} style={{ width: 'auto' }} /></td>
          <td><button className="chip" onClick={() => move(i, -1)} aria-label="Move up">Up</button> <button className="chip" onClick={() => move(i, 1)} aria-label="Move down">Down</button></td>
          <td><div className="row"><button className="chip" onClick={() => setEd(p)}>Edit</button>
            <button className="chip" onClick={() => patch(p.id, { status: p.status === 'published' ? 'draft' : 'published' })}>{p.status === 'published' ? 'Unpublish' : 'Publish'}</button>
            <button className="chip" onClick={() => del(p)}>Delete</button></div></td></tr>))}</tbody></table></div>}</div>)
}
