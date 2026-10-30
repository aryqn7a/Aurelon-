import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { safeUrl } from './data'
const D = { corp_name: 'Aurelon Corporation', tagline: 'Your Vision. Our Developers. One Studio.',
  intro: 'We are a Roblox development corporation. We take your project from first idea to launch with a managed team of specialist developers.',
  discord_invite: '', contact_email: '', socials: '', logo_url: '', favicon_url: '' }
const Ctx = createContext(D)
export const useSettings = () => useContext(Ctx)
export function SettingsProvider({ children }) {
  const [s, setS] = useState(D)
  useEffect(() => {
    supabase.from('settings').select('key,value').then(({ data }) => {
      if (data) setS({ ...D, ...Object.fromEntries(data.filter((r) => r.value).map((r) => [r.key, r.value])) })
    })
  }, [])
  useEffect(() => {
    const u = safeUrl(s.favicon_url)
    if (!u) return
    let l = document.querySelector('link[rel="icon"]')
    if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l) }
    l.href = u
  }, [s.favicon_url])
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>
}
