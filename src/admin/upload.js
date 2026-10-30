import { supabase } from '../lib/supabase'
const TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }
// Uploads one image to the public "portfolio" bucket and returns its public URL.
// The bucket and database policies also enforce: admin only, PNG/JPG/WebP, 5 MB.
export async function upload(file) {
  const ext = TYPES[file.type]
  if (!ext) throw new Error('Only PNG, JPG or WebP images are allowed.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be 5 MB or smaller.')
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('portfolio').upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl
}
