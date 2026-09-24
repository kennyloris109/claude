import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/big-shoulders-stencil/latin-800.css"
import "@fontsource/barlow-condensed/latin-500.css"
import "@fontsource/barlow-condensed/latin-600.css"
import "@fontsource/barlow-condensed/latin-700.css"
import "@fontsource/barlow/latin-400.css"
import "@fontsource/barlow/latin-500.css"
import "@fontsource/barlow/latin-600.css"
import stencilUrl from "@fontsource/big-shoulders-stencil/files/big-shoulders-stencil-latin-800-normal.woff2?url"
import './index.css'

// Preload the display face so the hero wordmark never flashes in a fallback.
const preload = Object.assign(document.createElement("link"), { rel: "preload", as: "font", type: "font/woff2", href: stencilUrl, crossOrigin: "anonymous" })
document.head.appendChild(preload)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
