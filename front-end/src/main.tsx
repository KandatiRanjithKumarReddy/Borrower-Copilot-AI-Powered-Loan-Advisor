import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { getStoredTheme, applyTheme } from './utils/theme'

// Ensure theme class is synchronized with stored preference immediately
applyTheme(getStoredTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
