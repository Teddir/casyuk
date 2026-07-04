import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export function Roadmap() {
  return (
    <div className="pattern-dense-dots-faded hero-mask" style={{ padding: '180px 0 120px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="neo-box" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '50px', fontWeight: '700', marginBottom: '24px', backgroundColor: 'var(--accent-red)', color: '#fff', fontSize: '0.9rem', boxShadow: '3px 3px 0px var(--border-color)' }}>
            The Master Plan
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Roadmap</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: '0 auto' }}>Where we are and where we're going.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Q3 2026 */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Q3 2026</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--accent-green)' }}><CheckCircle2 /> COMPLETED</span>
            </div>
            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--text-muted)" style={{ marginTop: '2px' }} /> Cross-platform Core (macOS, Win, Linux)
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--text-muted)" style={{ marginTop: '2px' }} /> Hardware-level SMC manipulation (80% lock)
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--text-muted)" style={{ marginTop: '2px' }} /> Chroma-Key transparent video overlay engine
              </li>
            </ul>
          </div>

          {/* Q4 2026 */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)', border: '4px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Q4 2026</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--accent-blue)' }}><Clock /> IN PROGRESS</span>
            </div>
            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--accent-blue)" style={{ marginTop: '2px' }} /> Launch Pro License with Lemon Squeezy integration
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--accent-blue)" style={{ marginTop: '2px' }} /> Native Windows Driver for Battery Locking (WMI expansion)
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--accent-blue)" style={{ marginTop: '2px' }} /> Official Community Media Library (download custom emotional alerts)
              </li>
            </ul>
          </div>

          {/* Q1 2027 */}
          <div className="neo-box" style={{ padding: '32px', backgroundColor: 'var(--card-bg)', opacity: 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Q1 2027</h2>
              <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>PLANNED</span>
            </div>
            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--text-muted)" style={{ marginTop: '2px' }} /> Desktop Companion App for iOS / Android sync
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontWeight: 600 }}>
                <ChevronRight color="var(--text-muted)" style={{ marginTop: '2px' }} /> Custom ML Model for Battery Degradation Prediction
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
