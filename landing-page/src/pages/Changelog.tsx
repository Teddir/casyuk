export function Changelog() {
  return (
    <div className="pattern-diagonal-faded hero-mask" style={{ padding: '180px 0 120px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Changelog</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: '0 auto' }}>New updates and improvements to CasYuk.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {/* Version 0.0.15 */}
          <div style={{ display: 'flex', gap: '32px' }} className="flex-col-mobile">
            <div style={{ minWidth: '150px', paddingTop: '8px' }}>
              <div className="neo-box" style={{ padding: '8px 12px', display: 'inline-block', backgroundColor: 'var(--accent-yellow)', fontWeight: 800 }}>v0.0.15</div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px' }}>July 2026</p>
            </div>
            <div className="neo-box" style={{ flex: 1, padding: '32px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Windows Native Polling Fixes & Pro Verification</h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 500, margin: 0 }}>
                <li><span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>Added:</span> <code>CREATE_NO_WINDOW</code> flag for Windows WMI polling to eliminate annoying CMD popups.</li>
                <li><span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>Added:</span> Secure License verification logic via Lemon Squeezy API.</li>
                <li><span style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>Improved:</span> Refactored cross-platform Rust targets so macOS-specific dependencies no longer break Linux builds.</li>
              </ul>
            </div>
          </div>

          {/* Version 0.0.14 */}
          <div style={{ display: 'flex', gap: '32px' }} className="flex-col-mobile">
            <div style={{ minWidth: '150px', paddingTop: '8px' }}>
              <div className="neo-box" style={{ padding: '8px 12px', display: 'inline-block', backgroundColor: '#eee', fontWeight: 800 }}>v0.0.14</div>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px' }}>June 2026</p>
            </div>
            <div className="neo-box" style={{ flex: 1, padding: '32px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Self-Healing Media & Performance Optimization</h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: 500, margin: 0 }}>
                <li><span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>Added:</span> Fallback mechanisms for deleted custom media files.</li>
                <li><span style={{ color: 'var(--accent-blue)', fontWeight: 800 }}>Improved:</span> Downscaled video canvas rendering to drastically reduce CPU overhead during panic alerts.</li>
                <li><span style={{ color: 'var(--accent-red)', fontWeight: 800 }}>Fixed:</span> Resolved infinite notification looping on macOS.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
