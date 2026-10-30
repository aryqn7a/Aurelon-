import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { safeUrl } from '../lib/data'
const STATUS = ['New', 'Reviewing', 'Quoted', 'In Progress', 'Completed', 'Rejected']
const PAY = ['Unpaid', 'Deposit Paid', 'Partially Paid', 'Paid', 'Refunded']
const num = (v) => (v === '' || v == null || !Number.isFinite(Number(v)) ? null : Number(v))
const fmt = (v) => (v == null ? '-' : (Math.round(v * 100) / 100).toLocaleString())
const KV = ({ k, v }) => (v ? <><b>{k}</b><span>{v}</span></> : null)
function Detail({ q, onDone }) {
  const [f, setF] = useState({ status: q.status, assigned_to: q.assigned_to || '', proposed_budget: q.proposed_budget ?? '', agreed_amount: q.agreed_amount ?? '',
    commission_pct: q.commission_pct ?? 30, expenses: q.expenses ?? 0, milestones: q.milestones || '', payment_status: q.payment_status,
    admin_notes: q.admin_notes || '', roblox_game_url: q.roblox_game_url || '' })
  const [msg, setMsg] = useState('')
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const agreed = num(f.agreed_amount), pct = num(f.commission_pct) ?? 30, exp = num(f.expenses) ?? 0
  const commission = agreed == null ? null : (agreed * pct) / 100
  const dev = agreed == null ? null : agreed - commission - exp
  const save = async (e) => {
    e.preventDefault(); setMsg('')
    const g = f.roblox_game_url.trim()
    if (g && !safeUrl(g)) return setMsg('The Roblox game link must start with http:// or https://')
    if (pct < 0 || pct > 100) return setMsg('Commission must be between 0 and 100.')
    const { error } = await supabase.from('inquiries').update({ status: f.status, assigned_to: f.assigned_to.trim() || null, proposed_budget: num(f.proposed_budget),
      agreed_amount: agreed, commission_pct: pct, expenses: exp, developer_allocation: dev, milestones: f.milestones.trim() || null, payment_status: f.payment_status,
      admin_notes: f.admin_notes.trim() || null, roblox_game_url: g || null }).eq('id', q.id)
    if (error) setMsg(error.message); else onDone()
  }
  const del = async () => {
    if (!confirm('Delete this inquiry permanently?')) return
    const { error } = await supabase.from('inquiries').delete().eq('id', q.id)
    if (error) setMsg(error.message); else onDone()
  }
  return (<div><button className="btn ghost sm" onClick={onDone}>Back to list</button>
    <h2 style={{ marginTop: 16 }}>{q.project_title}</h2>
    <div className="kv"><KV k="Received" v={new Date(q.created_at).toLocaleString()} /><KV k="Client / studio" v={q.client_name} /><KV k="Discord" v={q.discord} /><KV k="Email" v={q.email} />
      <KV k="Description" v={q.description} /><KV k="Services" v={(q.services || []).join(', ')} /><KV k="Client budget" v={q.budget ? `${q.budget} ${q.currency || ''}` : ''} />
      <KV k="Deadline" v={q.deadline} /><KV k="Reference links" v={q.reference_links} /><KV k="Additional" v={q.additional} /></div>
    <h3>Internal tracking (private)</h3>
    <form onSubmit={save}>
      <label>Status<select value={f.status} onChange={(e) => set('status', e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label>Assigned developer or team (internal only)<input value={f.assigned_to} onChange={(e) => set('assigned_to', e.target.value)} maxLength="300" /></label>
      <label>Roblox game or place link for this project<input value={f.roblox_game_url} onChange={(e) => set('roblox_game_url', e.target.value)} placeholder="https://www.roblox.com/games/..." /></label>
      <div className="row">
        <label>Proposed budget<input type="number" min="0" step="0.01" value={f.proposed_budget} onChange={(e) => set('proposed_budget', e.target.value)} /></label>
        <label>Agreed amount<input type="number" min="0" step="0.01" value={f.agreed_amount} onChange={(e) => set('agreed_amount', e.target.value)} /></label>
        <label>Commission %<input type="number" min="0" max="100" step="0.1" value={f.commission_pct} onChange={(e) => set('commission_pct', e.target.value)} /></label>
        <label>Other expenses<input type="number" min="0" step="0.01" value={f.expenses} onChange={(e) => set('expenses', e.target.value)} /></label></div>
      <div className="calc">Agency commission: <b>{fmt(commission)}</b> &nbsp;|&nbsp; Developer allocation (after commission and expenses): <b>{fmt(dev)}</b> {q.currency || ''}
        <div className="muted">Internal tracking only. Nothing is charged automatically.</div></div>
      <label>Payment status<select value={f.payment_status} onChange={(e) => set('payment_status', e.target.value)}>{PAY.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label>Milestones (one per line, e.g. "Map blockout - due 10 Nov - paid")<textarea value={f.milestones} onChange={(e) => set('milestones', e.target.value)} maxLength="3000" /></label>
      <label>Private notes<textarea value={f.admin_notes} onChange={(e) => set('admin_notes', e.target.value)} maxLength="5000" /></label>
      {msg && <p className="err" role="alert">{msg}</p>}
      <div className="row"><button className="btn">Save changes</button><button type="button" className="btn ghost" onClick={del}>Delete inquiry</button></div></form></div>)
}
export default function Inquiries() {
  const [list, setList] = useState(null), [sel, setSel] = useState(null), [flt, setFlt] = useState('All'), [msg, setMsg] = useState('')
  const load = () => supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(200).then(({ data, error }) => { if (error) setMsg(error.message); else setList(data) })
  useEffect(() => { load() }, [])
  if (sel) return <Detail q={sel} onDone={() => { setSel(null); load() }} />
  const rows = (list || []).filter((q) => flt === 'All' || q.status === flt)
  return (<div><div className="row" style={{ justifyContent: 'space-between' }}><h2>Client inquiries</h2>
    <select value={flt} onChange={(e) => setFlt(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by status">{['All', ...STATUS].map((s) => <option key={s}>{s}</option>)}</select></div>
    {msg && <p className="err" role="alert">{msg}</p>}
    {list === null ? <p className="muted">Loading...</p> : rows.length === 0 ? <p className="muted">No inquiries to show.</p> :
      <div style={{ overflowX: 'auto' }}><table><thead><tr><th>Received</th><th>Client</th><th>Project</th><th>Status</th><th>Payment</th><th></th></tr></thead><tbody>
        {rows.map((q) => <tr key={q.id}><td>{new Date(q.created_at).toLocaleDateString()}</td><td>{q.client_name}</td><td>{q.project_title}</td><td>{q.status}</td><td>{q.payment_status}</td>
          <td><button className="chip" onClick={() => setSel(q)}>Open</button></td></tr>)}</tbody></table></div>}</div>)
}
