import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

import App from './App'
import { buildTheme } from './theme'

import 'leaflet/dist/leaflet.css'
import './styles/leaflet.css'   // фиксы/переопределения для leaflet

function getSavedTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme-mode')
  if (saved === 'light' || saved === 'dark') return saved

  // системная тема как fallback
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

function Root() {
  const [mode, setMode] = useState<'light' | 'dark'>(getSavedTheme())

  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  const theme = useMemo(() => buildTheme(mode), [mode])

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App mode={mode} setMode={setMode} />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<Root />)
} else {
  console.error('Root element not found!')
}