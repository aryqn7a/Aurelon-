import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
const STATUS = ['Pending', 'Approved', 'Rejected']
const KV = ({ k, v }) => (v ? <><b>{k}</b><span>{v}</span></> : null)
function Detail({ a, onDone }) {
  const [status, setStatus] = useState(a.status), [notes, setNotes] = useState(a.admin_notes || ''), [msg, setMsg] = useState('')
  const save = async (e) => {
    e.preventDefault(); setMsg('')
    const { error } = await supabase.from('applications').update({ status, admin_notes: notes.trim() || null }).eq('id', a.id)
    if (error) setMsg(error.message); else onDone()
  }
  const del = async () => {
    if (!confirm('Delete this application permanently?')) return
    const { error } = await supabase.from('applications').delete().eq('id', a.id)
    if (error) setMsg(error.message); else onDone()
  }
  return (<div><button className="btn ghost sm" onClick={onDone}>Back to list</button>
    <h2 style={{ marginTop: 16 }}>{a.applicant_name || a.discord}</h2>
    <div className="kv"><KV k="Received" v={new Date(a.created_at).toLocaleString()} /><KV k="Name" v={a.applicant_name} /><KV k="Discord" v={a.discord} /><KV k="Specialties" v={a.skills} /><KV k="Portfolio links" v={a.portfolio_links} />
      <KV k="Experience" v={a.experience} /><KV k="Rates" v={a.rates} /><KV k="Availability" v={a.availability} /><KV k="Previous work" v={a.extra_links} /><KV k="Additional" v={a.additional} /></div>
    <form onSubmit={save}>
      <label>Decision<select value={status} onChange={(e) => setStatus(e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label>Private notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength="5000" /></label>
      {msg && <p className="err" role="alert">{msg}</p>}
      <div className="row"><button className="btn">Save</button><button type="button" className="btn ghost" onClick={del}>Delete application</button></div></form></div>)
}
export default function Applications() {
  const [list, setList] = useState(null), [sel, setSel] = useState(null), [flt, setFlt] = useState('All'), [msg, setMsg] = useState('')
  const load = () => supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(200).then(({ data, error }) => { if (error) setMsg(error.message); else setList(data) })
  useEffect(() => { load() }, [])
  if (sel) return <Detail a={sel} onDone={() => { setSel(null); load() }} />
  const rows = (list || []).filter((a) => flt === 'All' || a.status === flt)
  return (<div><div className="row" style={{ justifyContent: 'space-between' }}><h2>Developer applications</h2>
    <select value={flt} onChange={(e) => setFlt(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by status">{['All', ...STATUS].map((s) => <option key={s}>{s}</option>)}</select></div>
    {msg && <p className="err" role="alert">{msg}</p>}
    {list === null ? <p className="muted">Loading...</p> : rows.length === 0 ? <p className="muted">No applications to show.</p> :
      <div style={{ overflowX: 'auto' }}><table><thead><tr><th>Received</th><th>Name</th><th>Discord</th><th>Skills</th><th>Status</th><th></th></tr></thead><tbody>
        {rows.map((a) => <tr key={a.id}><td>{new Date(a.created_at).toLocaleDateString()}</td><td>{a.applicant_name || "-"}</td><td>{a.discord}</td><td>{a.skills.slice(0, 60)}</td><td>{a.status}</td>
          <td><button className="chip" onClick={() => setSel(a)}>Open</button></td></tr>)}</tbody></table></div>}</div>)
}
