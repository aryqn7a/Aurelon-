import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { configured } from './lib/supabase'
const Setup = () => (
  <div className="wrap">
    <h1>Setup needed</h1>
    <p className="muted">The site is not connected to its database yet. In your hosting dashboard (Vercel: Settings, then Environment Variables) add
      <b> VITE_SUPABASE_URL</b> and <b>VITE_SUPABASE_ANON_KEY</b>, then redeploy.</p>
  </div>
)
createRoot(document.getElementById('root')).render(configured ? <App /> : <Setup />)
