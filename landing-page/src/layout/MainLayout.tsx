import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Code, Moon, Sun, Menu, X } from 'lucide-react';
import { NeoButton } from '../components/NeoButton';

export function MainLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="announcement-bar">
          <span>🚀 LAUNCH PROMO: Get CasYuk for just $5 (50% OFF!)</span>
          <Link to="/pricing" className="announcement-link">Claim Now</Link>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="announcement-close"
            aria-label="Close Announcement"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className={`navbar-wrapper ${showAnnouncement ? 'with-announcement' : ''}`}>
        <nav className="navbar-pill">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
            <img src="/casyuk-logo.png" alt="CasYuk Logo" style={{ width: '36px', height: '36px' }} />
            <span style={{ color: 'var(--text-main)', textDecoration: 'none' }}>CasYuk</span>
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="hide-on-mobile" style={{ display: 'flex', gap: '20px' }}>
              <Link to="/#features" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Features</Link>
              <Link to="/#showcase" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Showcase</Link>
              <Link to="/pricing" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Pricing</Link>
              <Link to="/changelog" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Changelog</Link>
              <Link to="/roadmap" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Roadmap</Link>
              <Link to="/blog" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Blog</Link>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  background: 'none',
                  border: '2px solid var(--border-color)',
                  borderRadius: '50px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--card-bg)'
                }}
                title="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="hide-on-mobile">
                <NeoButton href="https://github.com/Teddir/casyuk" target="_blank" rel="noreferrer" variant="secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', borderRadius: '50px' }}>
                  <Code size={18} /> <span>GitHub</span>
                </NeoButton>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  background: 'var(--card-bg)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '50px',
                  width: '40px',
                  height: '40px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '70px',
            left: '0',
            right: '0',
            background: 'var(--card-bg)',
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '4px 4px 0px var(--border-color)',
            zIndex: 999
          }}>
            <Link to="/#features" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--text-main)' }}>Features</Link>
            <Link to="/#showcase" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--text-main)' }}>Showcase</Link>
            <Link to="/pricing" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--text-main)' }}>Pricing</Link>
            <Link to="/changelog" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--text-main)' }}>Changelog</Link>
            <Link to="/roadmap" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--text-main)' }}>Roadmap</Link>
            <Link to="/blog" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--text-main)' }}>Blog</Link>
            <a href="https://github.com/Teddir/casyuk" target="_blank" rel="noreferrer" style={{ fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={20} /> GitHub
            </a>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="modern-footer" style={{ borderTop: '3px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '60px' }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '1.5rem', marginBottom: '20px' }}>
                <img src="/casyuk-logo.png" alt="CasYuk Logo" style={{ width: '32px', height: '32px' }} />
                CasYuk
              </div>
              <p style={{ fontWeight: 500, color: 'var(--text-muted)', marginBottom: '24px' }}>
                Emotional battery management for the modern power user.
              </p>
            </div>

            {/* Product */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 600 }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>Product</h4>
              <Link to="/#features">Features</Link>
              <Link to="/#showcase">Showcase</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/changelog">Changelog</Link>
              <Link to="/roadmap">Roadmap</Link>
            </div>

            {/* Resources */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 600 }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>Resources</h4>
              <a href="https://github.com/Teddir/casyuk" target="_blank" rel="noreferrer">GitHub</a>
              <Link to="/blog">Blog</Link>
              <Link to="/documentation">Documentation</Link>
              <Link to="/contact">Contact</Link>
            </div>

            {/* Legal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 600 }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>Legal</h4>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>

          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <div>© {new Date().getFullYear()} CasYuk Inc. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="mailto:teddir.ads@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                teddir.ads@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
