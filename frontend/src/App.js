import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Ocr from "./pages/Ocr";
import "./App.css";

// Clerk imports
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import BackgroundBounce from "./components/BackgroundBounce";

/* ===========================
   Theme Dock (uses window.__theme from index.js)
   =========================== */
function ThemeDock() {
  const getTheme = () =>
    (typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme")) ||
    "light";

  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const onChange = (e) => setTheme(e.detail?.theme || getTheme());
    window.addEventListener("themechange", onChange);
    setTheme(getTheme());
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  const set = useCallback((t) => {
    if (window.__theme?.set) window.__theme.set(t);
    setTheme(t);
  }, []);

  const cycle = useCallback(() => {
    const next = window.__theme?.cycle ? window.__theme.cycle() : "light";
    setTheme(next);
  }, []);

  return (
    <div className="theme-dock fade-in" role="toolbar" aria-label="Theme">
      <button
        type="button"
        className="theme-btn"
        aria-pressed={theme === "light"}
        onClick={() => set("light")}
        title="Light (Glassy)"
      >
        Light
      </button>
      <button
        type="button"
        className="theme-btn"
        aria-pressed={theme === "dark"}
        onClick={() => set("dark")}
        title="Soft Dark"
      >
        Dark
      </button>
      <button
        type="button"
        className="theme-btn"
        aria-pressed={theme === "hc"}
        onClick={() => set("hc")}
        title="High Contrast"
      >
        HC
      </button>
      <button
        type="button"
        className="theme-btn"
        aria-pressed="false"
        onClick={cycle}
        title="Cycle theme (Light → Dark → HC)"
      >
        ⟳
      </button>
    </div>
  );
}

const App = () => {
  return (
    <ClerkProvider publishableKey="pk_live_Y2xlcmsub2NyLXNvbC5jb20k">
      <Router>
        {/* Decorative background — behind everything */}
        <BackgroundBounce />

        {/* Theme dock */}
        <ThemeDock />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/extractor"
            element={
              <>
                <SignedIn>
                  <Ocr />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
