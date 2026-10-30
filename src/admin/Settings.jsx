import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { safeUrl } from '../lib/data'
import { upload } from './upload.js'
const KEYS = ['corp_name', 'tagline', 'intro', 'discord_invite', 'contact_email', 'socials', 'logo_url', 'favicon_url']
function Categories() {
  const [list, setList] = useState([]), [name, setName] = useState(''), [msg, setMsg] = useState('')
  const load = () => supabase.from('categories').select('*').order('sort_order').then(({ data, error }) => { if (error) setMsg(error.message); else setList(data) })
  useEffect(() => { load() }, [])
  const add = async (e) => {
    e.preventDefault(); const n = name.trim(); if (!n) return
    const { error } = await supabase.from('categories').insert({ name: n, sort_order: list.length + 1 })
    setMsg(error ? error.message : ''); setName(''); load()
  }
  const del = async (c) => { if (!confirm(`Remove category "${c.name}"? Existing projects keep their tag.`)) return; const { error } = await supabase.from('categories').delete().eq('name', c.name); setMsg(error ? error.message : ''); load() }
  const move = async (i, d) => {
    const a = [...list], j = i + d; if (j < 0 || j >= a.length) return
    ;[a[i], a[j]] = [a[j], a[i]]
    await Promise.all(a.map((c, k) => supabase.from('categories').update({ sort_order: k + 1 }).eq('name', c.name))); load()
  }
  return (<div style={{ marginTop: 48 }}><h2>Portfolio categories</h2>
    {msg && <p className="err" role="alert">{msg}</p>}
    <div className="row" style={{ marginBottom: 16 }}>{list.map((c, i) => <span className="tag" key={c.name}>{c.name}{' '}
      <button className="chip" onClick={() => move(i, -1)} aria-label={`Move ${c.name} earlier`}>&lt;</button><button className="chip" onClick={() => move(i, 1)} aria-label={`Move ${c.name} later`}>&gt;</button>
      <button className="chip" onClick={() => del(c)} aria-label={`Remove ${c.name}`}>x</button></span>)}</div>
    <form onSubmit={add} style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}><label>New category<input value={name} onChange={(e) => setName(e.target.value)} maxLength="60" /></label><button className="btn">Add</button></form></div>)
}
export default function Settings() {
  const [v, setV] = useState(null), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => {
    supabase.from('settings').select('key,value').then(({ data }) => setV({ ...Object.fromEntries(KEYS.map((k) => [k, ''])), ...Object.fromEntries((data || []).map((r) => [r.key, r.value])) }))
  }, [])
  if (!v) return <p className="muted">Loading...</p>
  const set = (k, x) => setV((s) => ({ ...s, [k]: x }))
  const pick = async (e, k) => {
    const file = e.target.files[0]; if (!file) return
    setMsg(''); setBusy(true)
    try { set(k, await upload(file)) } catch (x) { setMsg(x.message) }
    setBusy(false); e.target.value = ''
  }
  const save = async (e) => {
    e.preventDefault(); setMsg('')
    if (!v.corp_name.trim()) return setMsg('The corporation name is required.')
    for (const k of ['discord_invite', 'logo_url', 'favicon_url']) if (v[k].trim() && !safeUrl(v[k].trim())) return setMsg(`${k} must start with http:// or https://`)
    const soc = v.socials.split('\n').map((s) => s.trim()).filter(Boolean)
    if (soc.some((s) => !safeUrl(s))) return setMsg('Every social link must start with http:// or https://')
    const rows = KEYS.map((k) => ({ key: k, value: k === 'socials' ? soc.join('\n') : v[k].trim() }))
    const { error } = await supabase.from('settings').upsert(rows)
    setMsg(error ? error.message : 'Saved. Reload the public website to see the changes.')
  }
  return (<div><h2>General settings</h2>
    <form onSubmit={save}>
      <label>Corporation name<input value={v.corp_name} onChange={(e) => set('corp_name', e.target.value)} maxLength="100" /></label>
      <label>Tagline (home page headline)<input value={v.tagline} onChange={(e) => set('tagline', e.target.value)} maxLength="150" placeholder="Your Vision. Our Developers. One Studio." /></label>
      <label>Home page introduction<textarea value={v.intro} onChange={(e) => set('intro', e.target.value)} maxLength="600" /></label>
      <label>Discord invite link<input value={v.discord_invite} onChange={(e) => set('discord_invite', e.target.value)} placeholder="https://discord.gg/..." /></label>
      <label>Official contact email<input type="email" value={v.contact_email} onChange={(e) => set('contact_email', e.target.value)} maxLength="200" /></label>
      <label>Social media links, one per line<textarea value={v.socials} onChange={(e) => set('socials', e.target.value)} /></label>
      <label>Logo (PNG, JPG or WebP, max 5 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => pick(e, 'logo_url')} /></label>
      {v.logo_url && <img src={v.logo_url} alt="Logo preview" style={{ height: 48, width: 'auto' }} />}
      <label>Favicon (square PNG or WebP)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => pick(e, 'favicon_url')} /></label>
      {v.favicon_url && <img src={v.favicon_url} alt="Favicon preview" style={{ height: 32, width: 32 }} />}
      {msg && <p className={msg.startsWith('Saved') ? 'muted' : 'err'} role="status">{msg}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Uploading...' : 'Save settings'}</button></form>
    <Categories /></div>)
}
