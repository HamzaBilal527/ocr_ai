import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import ocrimg from "../5264470.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate("/extractor");
    }
  };

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="landing-wrapper">
      <header className="landing-header" role="banner">
        <div className="logo" aria-label="OCR Extractor">
          OCR Extractor
        </div>

        <nav aria-label="Primary" role="navigation">
          <ul>
            <li>
              <a href="#about">What is OCR?</a>
            </li>
            <li>
              <a href="#usecases">Use Cases</a>
            </li>

            {/* Auth Area */}
            <li>
              <SignedOut>
                <SignInButton mode="modal">
                  <button type="button">Get Started</button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <button
                  type="button"
                  onClick={handleGetStarted}
                  style={{ marginLeft: "10px" }}
                >
                  Get Started
                </button>

                {/* Profile dropdown */}
                <div className="profile-container" ref={menuRef}>
                  <button
                    type="button"
                    className="profile-trigger"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={open}
                    aria-controls="user-menu"
                  >
                    <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="profile-pic"
                    />
                    <span className="username">
                      {user?.fullName || user?.username}
                    </span>
                    <span className="chev" aria-hidden="true">
                      ▾
                    </span>
                  </button>

                  {open && (
                    <div
                      id="user-menu"
                      className="dropdown-menu"
                      role="menu"
                      aria-label="User menu"
                    >
                      <SignOutButton>
                        <button type="button" className="dropdown-item" role="menuitem">
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  )}
                </div>
              </SignedIn>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <h1>Turn Images into Actionable Text</h1>
          <p>
            Extract text from scanned documents, handwritten notes, receipts, and
            screenshots with our simple OCR tool.
          </p>

          <SignedOut>
            <SignInButton mode="modal">
              <button type="button" className="primary-btn">
                Try It Now
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button type="button" className="primary-btn" onClick={handleGetStarted}>
              Try It Now
            </button>
          </SignedIn>
        </div>

        <div className="hero-image" aria-hidden="true">
          <img src={ocrimg} alt="" />
        </div>
      </section>

      <section className="about-section" id="about">
        <h2>What is OCR?</h2>
        <p>
          Optical Character Recognition (OCR) is a technology that converts text
          within images or scanned documents into machine-readable text. It
          allows you to digitize printed or handwritten content — enabling easier
          editing, searching, and data storage.
        </p>
      </section>

      <section className="usecase-section" id="usecases">
        <h2>Where Can You Use OCR?</h2>
        <ul>
          <li>📄 Convert scanned PDFs into editable documents</li>
          <li>🛒 Extract receipts for expense tracking</li>
          <li>📝 Digitize handwritten notes for easier sharing</li>
          <li>📷 Read text from screenshots or social media images</li>
          <li>🌐 Translate foreign signs or printed materials</li>
        </ul>
      </section>

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} OCR Extractor</p>
      </footer>
    </div>
  );
};

export default LandingPage;
