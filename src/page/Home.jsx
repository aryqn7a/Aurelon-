import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICES, PRINCIPLES, reduced } from '../lib/data'
import { usePageMeta } from '../lib/meta'
import { useSettings } from '../lib/settings.jsx'
import { Split, Cube, Steps, ProjectCard, ServiceRows } from '../components.jsx'
const LINES = ['BUILDING', 'WORLDS.', 'CREATING', 'POSSIBILITIES.']
export default function Home() {
  const s = useSettings(), [f, setF] = useState(null), hero = useRef(null), raf = useRef(0)
  usePageMeta(`${s.corp_name} | Roblox Development Corporation`, 'Aurelon Corporation builds Roblox games end to end: environments, 3D, scripting, VFX, animation, UI/UX and GFX, managed from concept to launch.')
  useEffect(() => {
    supabase.from('projects').select('*').eq('status', 'published').eq('featured', true).order('sort_order').limit(3).then(({ data }) => setF(data || []))
  }, [])
  const move = (e) => { // mouse parallax for the hero artwork
    const el = hero.current
    if (!el || reduced() || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width - 0.5) * 2, y = ((e.clientY - r.top) / r.height - 0.5) * 2
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => { el.style.setProperty('--mx', x.toFixed(3)); el.style.setProperty('--my', y.toFixed(3)) })
  }
  return (<>
    <section className="hero" ref={hero} onPointerMove={move}>
      <div className="hero-bg" aria-hidden="true">
        <div className="glow" /><div className="floor"><i /></div>
        <div className="cubes">
          <Cube core size={150} left="36%" top="26%" z={26} d={0} /><Cube size={80} left="6%" top="60%" z={44} d={-6} />
          <Cube size={104} left="66%" top="58%" z={34} d={-14} /><Cube size={62} left="70%" top="6%" z={58} d={-10} />
          <Cube size={34} left="20%" top="8%" z={68} d={-3} /><Cube size={40} left="90%" top="40%" z={50} d={-9} />
        </div>
      </div>
      <div className="wrap hero-grid"><div>
        <p className="kicker">Aurelon Corporation. Roblox development.</p>
        <h1 aria-label="BUILDING WORLDS. CREATING POSSIBILITIES.">{LINES.map((l, i) => <span className="hl" key={l}><span style={{ '--d': `${i * 110}ms` }}>{l}</span> </span>)}</h1>
        <p className="lead">{s.intro}</p>
        <div className="row"><Link className="btn go" to="/portfolio">Explore Our Work</Link><Link className="btn ghost go" to="/hire">Start a Project</Link></div>
      </div></div>
      <a className="cue" href="#about" aria-label="Scroll to About"><i /></a>
    </section>
    <div className="marquee" aria-hidden="true"><div className="mq">{[...SERVICES, ...SERVICES].map((x, i) => <span key={i}>{x.t}</span>)}</div></div>
    <section className="sec" id="about"><div className="wrap about-grid">
      <div><p className="kicker">About Aurelon</p><Split text="A game development corporation built for Roblox." className="big" /></div>
      <div className="prose"><p>Aurelon Corporation takes Roblox projects from idea to launch. We listen to what you want to build, scope it clearly, and assemble the specialists the project needs.</p>
        <p>You work with one team. We manage the people, the milestones and the quality, so you can focus on your game and your players.</p>
        <Link className="btn ghost go" to="/about">About us</Link></div></div></section>
    <section className="sec band"><div className="wrap"><div className="sec-head"><div><p className="kicker">Expertise</p><Split text="What we build." className="big" /></div><Link className="btn ghost go" to="/services">All services</Link></div><ServiceRows /></div></section>
    <section className="sec"><div className="wrap"><div className="sec-head"><div><p className="kicker">Selected work</p><Split text="Featured projects." className="big" /></div><Link className="btn ghost go" to="/portfolio">View portfolio</Link></div>
      {f === null ? null : f.length ? <div className="pgrid feat">{f.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
        : <div className="empty"><h3>Our portfolio is being curated.</h3><p>Completed projects will appear here. Start a project with us and yours could be next.</p></div>}</div></section>
    <section className="sec band"><div className="wrap"><p className="kicker">Process</p><Split text="How we deliver." className="big" /><div style={{ height: 56 }} /><Steps /></div></section>
    <section className="sec"><div className="wrap"><p className="kicker">Why Aurelon</p><Split text="One team. Clear process." className="big" /><div style={{ height: 40 }} />
      <div className="prin">{PRINCIPLES.map(([t, d]) => <div className="pr" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
    <section className="sec" style={{ paddingTop: 0 }}><div className="wrap"><div className="cta-panel"><Split text="Let's build something worth playing." className="big" />
      <p className="muted" style={{ maxWidth: '48ch' }}>Tell us about your project. We reply with a plan, a timeline and a quote.</p>
      <div className="row" style={{ marginTop: 28 }}><Link className="btn go" to="/hire">Start a Project</Link><Link className="btn ghost go" to="/services">See our services</Link></div></div></div></section>
  </>)
}
