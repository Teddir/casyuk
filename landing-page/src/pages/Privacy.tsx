export function Privacy() {
  return (
    <div style={{ padding: '160px 0 120px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        <div style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Privacy Policy</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Last updated: July 2026</p>
        </div>

        <div className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>1. Data Collection</h2>
              <p>CasYuk is a local-first application. We do not collect, transmit, or store your battery telemetry data on any external servers. All hardware readings (SMC, WMI, Sysfs) are processed locally on your machine.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>2. Media Files</h2>
              <p>Any custom media (green-screen videos, audio files) you upload into CasYuk remains in your local application data directory. We do not have access to your uploaded media.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>3. Pro License Verification</h2>
              <p>If you purchase a Pro License, we verify the license key via Lemon Squeezy API. This process transmits your license key and a hardware identifier to prevent piracy. No personal information beyond the transaction email is linked to this process.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>4. Analytics</h2>
              <p>The CasYuk desktop application does not contain tracking pixels, crash reporters (like Sentry), or analytics sdks. If it crashes, it crashes in privacy.</p>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
