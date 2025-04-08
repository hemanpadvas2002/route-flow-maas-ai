
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Extend the Window interface to include deferredPrompt
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

// Register a beforeinstallprompt listener to enable PWA install
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  window.deferredPrompt = e;
});

createRoot(document.getElementById("root")!).render(<App />);
