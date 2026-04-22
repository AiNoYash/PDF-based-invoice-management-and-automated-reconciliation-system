import React from 'react';
import '../App.css';

// SVGs
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon-wrapper">
            <BarChartIcon />
          </div>
          ReconFlow
        </div>
        <div className="nav-center">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </div>
        <div className="nav-right">
          <Link to="/auth"><button className="btn-login">Log In</button></Link>
          <Link to="/dashboard">
            <button className="btn-primary">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="hero">

        {/* Left Side: Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div> Automate Your Financial Reconciliation
          </div>

          <h1 className="hero-title">
            Smart Invoice Processing for <span className="text-green">Growing Businesses</span>
          </h1>

          <p className="hero-subtitle">
            Extract invoice data automatically, match with bank statements instantly, and reduce manual reconciliation effort by up to 90%. Built for SMEs who value accuracy and efficiency.
          </p>

          <div className="hero-cta">
            <Link to="/dashboard">
              <button className="btn-primary">
                Get Started Free <ArrowRightIcon />
              </button>
            </Link>
            <button className="btn-secondary">Watch Demo</button>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <CheckCircleIcon /> No credit card required
            </div>
            <div className="trust-item">
              <CheckCircleIcon /> Free 14-day trial
            </div>
          </div>
        </div>

        {/* Right Side: Visual Mockup */}
        <div className="hero-mockup-wrapper">

          {/* Floating Bank Sync Toast */}
          <div className="floating-toast">
            <div className="toast-icon">
              <CreditCardIcon />
            </div>
            <div className="toast-details">
              <h4>Bank Synced</h4>
              <p>2 min ago</p>
            </div>
          </div>

          {/* Main Card */}
          <div className="mockup-card">
            <div className="window-controls">
              <div className="control-dot dot-red"></div>
              <div className="control-dot dot-yellow"></div>
              <div className="control-dot dot-green"></div>
            </div>

            <div className="mockup-header">
              <h3>Reconciliation Overview</h3>
              <p>April 2026</p>
            </div>

            <div className="mockup-stats-grid">
              <div className="mini-stat-card stat-matched">
                <div className="m-val">847</div>
                <div className="m-label">Matched</div>
              </div>
              <div className="mini-stat-card stat-partial">
                <div className="m-val">23</div>
                <div className="m-label">Partial</div>
              </div>
              <div className="mini-stat-card stat-unmatched">
                <div className="m-val">12</div>
                <div className="m-label">Unmatched</div>
              </div>
            </div>

            <div className="mockup-list">
              <div className="mockup-list-item">
                <div className="item-left">
                  <div className="item-icon">
                    <FileIcon />
                  </div>
                  <div className="item-details">
                    <h4>Tech Solutions Ltd</h4>
                    <p>Invoice #INV-2024000</p>
                  </div>
                </div>
                <div className="item-right">
                  <div className="item-amount">$4,250.00</div>
                  <div className="item-status">Matched</div>
                </div>
              </div>

              <div className="mockup-list-item">
                <div className="item-left">
                  <div className="item-icon">
                    <FileIcon />
                  </div>
                  <div className="item-details">
                    <h4>Office Supplies Co</h4>
                    <p>Invoice #INV-2024001</p>
                  </div>
                </div>
                <div className="item-right">
                  <div className="item-amount">$892.50</div>
                  <div className="item-status">Matched</div>
                </div>
              </div>

              <div className="mockup-list-item">
                <div className="item-left">
                  <div className="item-icon">
                    <FileIcon />
                  </div>
                  <div className="item-details">
                    <h4>Cloud Services Inc</h4>
                    <p>Invoice #INV-2024002</p>
                  </div>
                </div>
                <div className="item-right">
                  <div className="item-amount">$1,500.00</div>
                  <div className="item-status">Partial Match</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}

export default LandingPage;
