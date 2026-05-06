import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { SystemProvider } from './context/SystemContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SystemProvider>
      <AppProvider>
        <AdminProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AdminProvider>
      </AppProvider>
    </SystemProvider>
  </StrictMode>,
)
