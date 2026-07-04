export function Terms() {
  return (
    <div className="pattern-cross-faded hero-mask" style={{ padding: '180px 0 120px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        <div style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Terms of Service</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Last updated: July 2026</p>
        </div>

        <div className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
              <p>By downloading and using the CasYuk desktop application, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, do not use the software.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>2. Hardware Modification Warning</h2>
              <p>CasYuk interacts with low-level system APIs (such as SMC on macOS) to enforce charging limits. While heavily tested, you acknowledge that modifying hardware charging behaviors carries inherent risks. We are not liable for any battery degradation, hardware failure, or data loss resulting from the use of this software.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>3. Pro License</h2>
              <p>A Pro License grants you a non-transferable, non-exclusive right to use the premium features of CasYuk. Sharing license keys publicly will result in immediate revocation without refund.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>4. "Screaming Cat" Clause</h2>
              <p>You acknowledge that using highly disruptive custom media alerts in public places (libraries, cafes, offices) may annoy those around you. You are solely responsible for managing your volume levels.</p>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
