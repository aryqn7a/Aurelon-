import { createClient } from '@supabase/supabase-js'
// Only the public anon key is used here. Access is enforced by Row Level Security in the database.
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
