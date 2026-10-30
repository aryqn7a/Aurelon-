import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { ServiceGrid, Steps, ProjectCard } from '../components.jsx'
export default function Home() {
  const s = useSettings(), [f, setF] = useState([])
  useEffect(() => {
    supabase.from('projects').select('*').eq('status', 'published').eq('featured', true).order('sort_order').limit(3)
      .then(({ data }) => setF(data || []))
  }, [])
  return (<>
    <section className="hero">
      <svg viewBox="0 0 124 124" aria-hidden="true"><polygon points="8,100 8,88 20,88 20,76 32,76 32,64 44,64 44,52 56,52 56,40 68,40 68,52 80,52 80,64 92,64 92,76 104,76 104,88 116,88 116,100" fill="none" stroke="#3dd6f5" strokeWidth="1.2" /></svg>
      <h1>{s.tagline}</h1>
      <p className="lead">{s.intro}</p>
      <div className="row"><Link className="btn" to="/hire">Hire Our Team</Link><Link className="btn ghost" to="/portfolio">Explore Our Work</Link></div>
    </section>
    <section className="wrap"><h2>Featured work</h2>
      {f.length ? <div className="grid">{f.map((p) => <ProjectCard key={p.id} p={p} />)}</div> : <p className="muted">New projects are being added. Check back soon.</p>}
    </section>
    <section className="band"><div className="wrap"><h2>What we build</h2><ServiceGrid /></div></section>
    <section className="wrap"><h2>How it works</h2><Steps />
      <p style={{ marginTop: 40 }}><Link className="btn" to="/hire">Start your project</Link></p></section>
  </>)
}
