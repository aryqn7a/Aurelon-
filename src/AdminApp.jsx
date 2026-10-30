import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Projects from './Projects.jsx'
import Inquiries from './Inquiries.jsx'
import Applications from './Applications.jsx'
import Settings from './Settings.jsx'
const IDLE_MS = 30 * 60 * 1000
const TABS = [['dash', 'Dashboard'], ['proj', 'Portfolio'], ['inq', 'Inquiries'], ['app', 'Applications'], ['set', 'Settings']]
function Dashboard({ go }) {
  const [c, setC] = useState(null)
  useEffect(() => {
    const q = (t, f) => { const r = supabase.from(t).select('*', { count: 'exact', head: true }); return f ? f(r) : r }
    Promise.all([q('projects'), q('projects', (r) => r.eq('status', 'published')), q('projects', (r) => r.eq('status', 'draft')),
      q('inquiries', (r) => r.eq('status', 'New')), q('applications', (r) => r.eq('status', 'Pending'))]).then((r) => setC(r.map((x) => x.count ?? 0)))
  }, [])
  const L = [['Total projects', 'proj'], ['Published', 'proj'], ['Drafts', 'proj'], ['New inquiries', 'inq'], ['Pending applications', 'app']]
  return (<div><h2>Dashboard</h2><div className="stats">{L.map(([l, t], i) =>
    <button className="card pad" style={{ textAlign: 'left', color: 'inherit', font: 'inherit', cursor: 'pointer' }} key={l} onClick={() => go(t)}><b>{c ? c[i] : '-'}</b>{l}</button>)}</div></div>)
}
export default function AdminApp() {
  const [st, setSt] = useState('loading'), [tab, setTab] = useState('dash'), [err, setErr] = useState('')
  useEffect(() => { // keep the admin area out of search engines
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m)
    document.title = 'Admin'; return () => m.remove()
  }, [])
  const check = async (session) => {
    if (!session) return setSt('out')
    const { data } = await supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
    if (data) setSt('in')
    else { await supabase.auth.signOut(); setErr('This account is not authorised for the admin panel.'); setSt('out') }
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data: l } = supabase.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') setSt('out') })
    return () => l.subscription.unsubscribe()
  }, [])
  useEffect(() => { // sign out after 30 minutes without activity
    if (st !== 'in') return
    let t; const reset = () => { clearTimeout(t); t = setTimeout(() => supabase.auth.signOut(), IDLE_MS) }
    const ev = ['click', 'keydown', 'mousemove']; ev.forEach((e) => addEventListener(e, reset)); reset()
    return () => { clearTimeout(t); ev.forEach((e) => removeEventListener(e, reset)) }
  }, [st])
  const login = async (e) => {
    e.preventDefault(); setErr('')
    const f = new FormData(e.target)
    const { data, error } = await supabase.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') })
    if (error) setErr('Invalid email or password.'); else check(data.session)
  }
  if (st === 'loading') return <div className="adm"><p className="muted">Loading...</p></div>
  if (st === 'out') return (<div className="adm" style={{ maxWidth: 420 }}><h2>Admin login</h2>
    <form onSubmit={login}><label>Email<input name="email" type="email" required autoComplete="username" /></label>
      <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
      {err && <p className="err" role="alert">{err}</p>}<button className="btn">Log in</button></form>
    <p style={{ marginTop: 24 }}><Link to="/" className="muted">Back to website</Link></p></div>)
  return (<div className="adm"><div className="row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
    <div className="row">{TABS.map(([k, l]) => <button key={k} className={'chip' + (tab === k ? ' on' : '')} onClick={() => setTab(k)}>{l}</button>)}</div>
    <div className="row"><Link className="btn ghost sm" to="/">View website</Link><button className="btn ghost sm" onClick={() => supabase.auth.signOut()}>Log out</button></div></div>
    {tab === 'dash' && <Dashboard go={setTab} />}{tab === 'proj' && <Projects />}{tab === 'inq' && <Inquiries />}
    {tab === 'app' && <Applications />}{tab === 'set' && <Settings />}</div>)
}
