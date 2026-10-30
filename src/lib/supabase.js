import { createClient } from '@supabase/supabase-js'
const env = import.meta.env
const url = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// False when the environment variables were not set at build time.
export const configured = Boolean(url && key)
// Only the public anon key is used here. Access is enforced by Row Level Security in the database.
export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder-key')
