import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'

// Force service worker registration for Android Chrome
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Nouvelle version disponible! Recharger?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log("App prête pour une utilisation hors-ligne (PWA)")
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
