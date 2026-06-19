import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router' // without ./ means from node_modules
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
// ! = this value definitely exists (it will not be null)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
/*
  Strictmode runs useEffects twice to catch bugs

  In production strictmode doesn't do anything
*/
