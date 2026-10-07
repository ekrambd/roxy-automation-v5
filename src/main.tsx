import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Invalidate and clear previous local storage caches when Firebase project changes
const currentProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'default';
const storedProjectId = localStorage.getItem('active_firebase_project_id');
if (storedProjectId !== currentProjectId) {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('noor_') || key.startsWith('ecom_') || key === 'stock_catalog_initialized') {
      localStorage.removeItem(key);
    }
  });
  localStorage.setItem('active_firebase_project_id', currentProjectId);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
