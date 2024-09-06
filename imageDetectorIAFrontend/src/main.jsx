import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="359552224056-nq1bsja606549iseofk9056q5pe169ns.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>

  </StrictMode>,
)
