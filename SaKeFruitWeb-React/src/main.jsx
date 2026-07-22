import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Use env variable or a temporary dummy ID if not set yet
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id-for-testing';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
