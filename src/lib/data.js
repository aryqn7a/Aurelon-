export const SERVICES = [
  { t: 'Map Building & Environments', d: 'Detailed worlds, interiors and terrain built for atmosphere and performance.' },
  { t: '3D Modeling & Assets', d: 'Props, weapons, characters and game-ready assets in your art style.' },
  { t: 'Scripting & Gameplay Systems', d: 'Clean Luau code: combat, shops, data saving, progression and live-ops tools.' },
  { t: 'VFX & Combat Effects', d: 'Impact, ability and ambient effects that make gameplay feel good.' },
  { t: 'Animation & Rigging', d: 'Character animation, rigs and cutscene-ready motion.' },
  { t: 'UI/UX Design', d: 'Menus, HUDs and icons that stay clear on phones, consoles and desktop.' },
  { t: 'GFX, Thumbnails & Icons', d: 'Game icons, thumbnails and promotional art that win clicks.' },
  { t: 'Full Game Development', d: 'A managed team that takes your game from concept to launch.' },
]
export const CATEGORIES = ['Building', 'Modeling', 'Scripting', 'VFX', 'Animation', 'UI/UX', 'GFX', 'Full Game Development']
export const STEPS = [
  ['Tell us your idea', 'Send an inquiry with your goals, budget and deadline.'],
  ['We scope it', 'We review your needs and reply with a clear plan and quote.'],
  ['We assign the team', 'We choose and manage the right developers for your project.'],
  ['We deliver', 'You get milestone updates and review everything before launch.'],
]
export const safeUrl = (u) => { try { const x = new URL(u); return ['http:', 'https:'].includes(x.protocol) ? x.href : null } catch { return null } }
export const embed = (u) => { const s = safeUrl(u); if (!s) return null; const m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/); return m ? { yt: m[1] } : { link: s } }
export const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
export const socialLinks = (t) => (t || '').split('\n').map((x) => x.trim()).filter((x) => safeUrl(x)).map(safeUrl)
