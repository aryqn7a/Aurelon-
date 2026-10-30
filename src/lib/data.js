export const SERVICES = [
  { t: 'Roblox Game Development', d: 'Complete Roblox experiences, from first prototype to a live game with players.', k: ['Game design', 'Core loops', 'Live updates'] },
  { t: 'Environment and Level Design', d: 'Maps, terrain and levels built for atmosphere, flow and performance.', k: ['Maps', 'Terrain', 'Level layout'] },
  { t: '3D Modeling and Asset Creation', d: 'Game-ready props, characters and weapons that match your art direction.', k: ['Props', 'Characters', 'Weapons'] },
  { t: 'Lua Scripting and Game Systems', d: 'Clean Luau code for combat, progression, economies and data saving.', k: ['Combat', 'Data saving', 'Economy'] },
  { t: 'VFX Development', d: 'Ability, impact and ambient effects that make every action feel good.', k: ['Abilities', 'Impacts', 'Ambience'] },
  { t: 'Animation', d: 'Character animation, rigging and cutscene-ready motion.', k: ['Characters', 'Rigging', 'Cutscenes'] },
  { t: 'UI/UX Design', d: 'Menus, HUDs and icons that stay clear on phones, consoles and desktop.', k: ['Menus', 'HUD', 'Icons'] },
  { t: 'GFX and Branding', d: 'Game icons, thumbnails and brand art that earn the click.', k: ['Thumbnails', 'Game icons', 'Brand kits'] },
  { t: 'Complete Game Development', d: 'A managed team that takes your idea from concept to launch and beyond.', k: ['Full pipeline', 'Milestones', 'Post-launch'] },
]
export const CATEGORIES = ['Building', 'Modeling', 'Scripting', 'VFX', 'Animation', 'UI/UX', 'GFX', 'Full Game Development']
export const STEPS = [
  ['Discovery', 'We learn your goals, audience and constraints.'],
  ['Scope and quote', 'You receive a written scope, timeline and price to approve.'],
  ['Production', 'We assign and manage the right specialists for your project.'],
  ['Review', 'You follow milestones and give feedback. We revise.'],
  ['Launch', 'Final delivery and support to get your game live.'],
]
export const PRINCIPLES = [
  ['One accountable team', 'You deal with Aurelon only. We manage every specialist behind your project.'],
  ['The right specialists', 'We choose people whose skills fit the work, not whoever happens to be free.'],
  ['Milestones, not guesswork', 'A written scope, agreed milestones and updates you can follow.'],
  ['Built for Roblox', 'Our work is made for the platform: its performance limits, its players and its rules.'],
]
export const BUDGETS = ['Under $100', '$100 - $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000 or more', 'Not sure yet']
export const safeUrl = (u) => { try { const x = new URL(u); return ['http:', 'https:'].includes(x.protocol) ? x.href : null } catch { return null } }
export const embed = (u) => {
  const s = safeUrl(u); if (!s) return null
  const m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/)
  if (m) return { yt: m[1] }
  return /\.(mp4|webm)(\?.*)?$/i.test(s) ? { file: s } : { link: s }
}
export const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
export const socialLinks = (t) => (t || '').split('\n').map((x) => x.trim()).filter((x) => safeUrl(x)).map(safeUrl)
export const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
