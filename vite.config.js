import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// The Vercel-Supabase integration creates NEXT_PUBLIC_* variables, so expose those (public values only) as well as VITE_*.
export default defineConfig({ plugins: [react()], envPrefix: ['VITE_', 'NEXT_PUBLIC_'] })
