import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
      .catch(err => {
        console.error('Service worker cleanup failed:', err);
      });
  });
}

if ('caches' in window) {
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('driveease-')).map(key => caches.delete(key))))
    .catch(err => {
      console.error('Cache cleanup failed:', err);
    });
}
