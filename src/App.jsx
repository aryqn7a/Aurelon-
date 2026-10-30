import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { SettingsProvider, useSettings } from './lib/settings.jsx'
import { safeUrl, socialLinks, host, reduced } from './lib/data'
import Home from './pages/Home.jsx'
import Portfolio from './pages/Portfolio.jsx'
import { Services, About, Contact } from './pages/Static.jsx'
import { Hire, Join } from './pages/Forms.jsx'
import AdminApp from './admin/AdminApp.jsx'
const NAV = [['/portfolio', 'Portfolio'], ['/services', 'Services'], ['/about', 'About'], ['/join', 'Join Our Team'], ['/contact', 'Contact']]
const MARK = 'M60 14 L108 106 L84 106 L60 60 L36 106 L12 106 Z'
// Short intro sequence, shown once per browser session. Click or press Escape to skip. Skipped for reduced motion.
function Intro() {
  const skip = (() => { try { return reduced() || !!sessionStorage.getItem('aur_intro') } catch { return true } })()
  const [st, setSt] = useState(skip ? 'gone' : 'in')
  useEffect(() => {
    if (skip) return
    const root = document.documentElement
    root.classList.add('intro-on'); try { sessionStorage.setItem('aur_intro', '1') } catch {}
    const t = [setTimeout(() => setSt('out'), 1700), setTimeout(() => setSt('gone'), 2600), setTimeout(() => root.classList.remove('intro-on'), 3600)]
    const k = (e) => e.key === 'Escape' && setSt('gone')
    addEventListener('keydown', k)
    return () => { t.forEach(clearTimeout); removeEventListener('keydown', k); root.classList.remove('intro-on') }
  }, [])
  if (st === 'gone') return null
  return (<div className={'intro' + (st === 'out' ? ' out' : '')} onClick={() => setSt('gone')} aria-hidden="true">
    <div className="intro-in"><svg viewBox="0 0 120 120"><path className="idraw" d={MARK} pathLength="1" fill="none" stroke="#2fd3ff" strokeWidth="3" /><path className="ifill" d={MARK} fill="#2fd3ff" /></svg>
      <div className="wm">{'AURELON'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${0.5 + i * 0.06}s` }}>{c}</span>)}</div>
      <div className="bar"><i /></div></div></div>)
}
// Scroll progress, header state, parallax variable, and reveal-on-scroll for headings, cards and rows.
function useMotion() {
  useEffect(() => {
    const top = document.querySelector('.top'), bar = document.querySelector('.progress'), root = document.documentElement
    const onScroll = () => {
      top && top.classList.toggle('scrolled', scrollY > 10)
      const h = root.scrollHeight - innerHeight
      if (bar) bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`
      root.style.setProperty('--sy', Math.min(scrollY, 900))
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll()
    let io, mo
    const main = document.querySelector('main')
    if (main && 'IntersectionObserver' in window && !reduced()) {
      io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target) } }), { threshold: 0.12 })
      const tag = () => {
        main.querySelectorAll('.card, .proc li, .cap, .pr, .svc-row, .cta-panel, .ok, .tabs, .formgrid>*, .about-grid>*, .empty').forEach((el) => {
          if (el.dataset.rv) return
          el.dataset.rv = '1'; el.style.setProperty('--d', `${Math.min([...el.parentNode.children].indexOf(el), 5) * 80}ms`); el.classList.add('rv'); io.observe(el)
        })
        main.querySelectorAll('[data-split], .proc').forEach((el) => { if (!el.dataset.rv) { el.dataset.rv = '1'; el.classList.add('armed'); io.observe(el) } })
      }
      tag(); mo = new MutationObserver(tag); mo.observe(main, { childList: true, subtree: true })
    }
    return () => { removeEventListener('scroll', onScroll); io && io.disconnect(); mo && mo.disconnect() }
  }, [])
}
function Brand({ s, logo }) { return <span className="brand">{logo ? <img src={logo} alt="" /> : <span className="mark" />}{s.corp_name}</span> }
function Layout() {
  const s = useSettings(), logo = safeUrl(s.logo_url), soc = socialLinks(s.socials), d = safeUrl(s.discord_invite)
  const { pathname } = useLocation(), [open, setOpen] = useState(false)
  useMotion()
  useEffect(() => { window.scrollTo(0, 0); setOpen(false) }, [pathname])
  return (<>
    <Intro />
    <div className="top"><header className={'nav' + (open ? ' open' : '')}><Link to="/" aria-label={`${s.corp_name} home`}><Brand s={s} logo={logo} /></Link>
      <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}><i /><i /></button>
      <nav>{NAV.map(([p, l]) => <NavLink key={p} to={p}>{l}</NavLink>)}<Link className="btn sm" to="/hire">Start a Project</Link></nav></header>
      <div className="progress" aria-hidden="true" /></div>
    <main><div className="page" key={pathname}><Outlet /></div></main>
    <footer className="foot"><div className="wrap foot-in">
      <div><Brand s={s} logo={logo} /><p>{s.tagline}</p></div>
      <div className="flinks"><b>Explore</b>{NAV.slice(0, 3).map(([p, l]) => <Link key={p} to={p}>{l}</Link>)}</div>
      <div className="flinks"><b>Work with us</b><Link to="/hire">Start a Project</Link><Link to="/join">Join Our Team</Link><Link to="/contact">Contact</Link>
        {d && <a href={d} target="_blank" rel="noopener noreferrer">Discord</a>}{soc.map((u) => <a key={u} href={u} target="_blank" rel="noopener noreferrer">{host(u)}</a>)}</div></div>
      <div className="mega" aria-hidden="true">AURELON</div>
      <div className="wrap copy">&copy; {new Date().getFullYear()} {s.corp_name}. All project inquiries are handled by our team.</div></footer>
  </>)
}
export default function App() {
  return (<BrowserRouter><SettingsProvider><Routes>
    <Route path="/admin/*" element={<AdminApp />} />
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} /><Route path="/portfolio" element={<Portfolio />} />
      <Route path="/services" element={<Services />} /><Route path="/about" element={<About />} />
      <Route path="/hire" element={<Hire />} /><Route path="/join" element={<Join />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<div className="wrap sec"><h1>Page not found</h1><Link className="btn" to="/">Back to home</Link></div>} />
    </Route></Routes></SettingsProvider></BrowserRouter>)
}
