import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link, Outlet } from 'react-router-dom'
import { SettingsProvider, useSettings } from './lib/settings.jsx'
import { safeUrl, socialLinks, host } from './lib/data'
import Home from './pages/Home.jsx'
import Portfolio from './pages/Portfolio.jsx'
import { Services, About, Contact } from './pages/Static.jsx'
import { Hire, Join } from './pages/Forms.jsx'
import AdminApp from './admin/AdminApp.jsx'
const NAV = [['/portfolio', 'Portfolio'], ['/services', 'Services'], ['/about', 'About Us'], ['/join', 'Join Our Team'], ['/contact', 'Contact']]
function Layout() {
  const s = useSettings(), logo = safeUrl(s.logo_url)
  useEffect(() => { document.title = `${s.corp_name} | Roblox Development` }, [s.corp_name])
  return (<>
    <header className="nav"><Link to="/" className="brand">{logo ? <img src={logo} alt="" /> : <span className="mark" />}{s.corp_name}</Link>
      <nav>{NAV.map(([p, l]) => <NavLink key={p} to={p}>{l}</NavLink>)}<Link className="btn sm" to="/hire">Hire Our Team</Link></nav></header>
    <main><Outlet /></main>
    <footer><span>&copy; {new Date().getFullYear()} {s.corp_name}. All project inquiries are handled by our team.</span>
      <span className="social">{socialLinks(s.socials).map((u) => <a key={u} href={u} target="_blank" rel="noopener noreferrer">{host(u)}</a>)}</span></footer>
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
      <Route path="*" element={<div className="wrap"><h1>Page not found</h1><Link className="btn" to="/">Back to home</Link></div>} />
    </Route></Routes></SettingsProvider></BrowserRouter>)
}
