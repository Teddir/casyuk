import { Mail } from 'lucide-react';

export function Contact() {
  return (
    <div className="pattern-stripes-faded hero-mask" style={{ padding: '180px 0 120px', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Contact Us</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Get in touch directly via email.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a href="mailto:teddir.ads@gmail.com" className="neo-box" style={{ padding: '40px', width: '100%', backgroundColor: 'var(--card-bg)', textAlign: 'center', color: 'var(--text-main)', textDecoration: 'none', display: 'block' }}>
            <Mail size={48} style={{ marginBottom: '24px', color: 'var(--accent-red)' }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Email Support</h2>
            <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0 }}>teddir.ads@gmail.com</p>
          </a>
        </div>

      </div>
    </div>
  );
}
