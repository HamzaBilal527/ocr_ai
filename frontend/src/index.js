import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/* ===========================
   Theme Bootstrap (Light default, Soft Dark, High-Contrast)
   =========================== */

const THEME_KEY = 'ocrx:theme'; // values: 'light' | 'dark' | 'hc'

function applyTheme(theme) {
  const rootEl = document.documentElement;
  const normalized = (theme === 'dark' || theme === 'hc') ? theme : 'light';

  rootEl.setAttribute('data-theme', normalized);
  // Help native form controls pick correct colors
  rootEl.style.colorScheme = normalized === 'dark' ? 'dark' : 'light';

  try { localStorage.setItem(THEME_KEY, normalized); } catch {}
  // Notify listeners (optional)
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: normalized } }));
}

function initTheme() {
  let theme = 'light'; // default: Light Glass
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) theme = saved;
    // If OS is in forced-colors (Windows High Contrast), prefer 'hc' on first load
    else if (window.matchMedia && window.matchMedia('(forced-colors: active)').matches) {
      theme = 'hc';
    }
  } catch {}
  applyTheme(theme);

  // Keep tabs/windows in sync
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY && e.newValue) applyTheme(e.newValue);
  });

  // Expose a tiny API for your App.js toggles (no dependency, optional)
  window.__theme = {
    get: () => document.documentElement.getAttribute('data-theme') || 'light',
    set: (t) => applyTheme(t),
    cycle: () => {
      const order = ['light', 'dark', 'hc'];
      const curr = document.documentElement.getAttribute('data-theme') || 'light';
      const next = order[(order.indexOf(curr) + 1) % order.length];
      applyTheme(next);
      return next;
    }
  };
}

initTheme();
/* ===========================
   React Mount
   =========================== */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
