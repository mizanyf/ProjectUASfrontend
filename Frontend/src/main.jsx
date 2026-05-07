import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider }    from './context/AppContext.jsx'
import { ToastProvider }  from './context/ToastContext.jsx'
import { SystemProvider } from './context/SystemContext.jsx'
import { AdminProvider }  from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SystemProvider>
      <AdminProvider>
        <AppProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AppProvider>
      </AdminProvider>
    </SystemProvider>
  </StrictMode>,
)
