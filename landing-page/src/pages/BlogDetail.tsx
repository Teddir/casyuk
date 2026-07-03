import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BlogDetail() {
  return (
    <div className="pattern-grid-faded hero-mask" style={{ padding: '160px 0 120px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>

        <div style={{ marginBottom: '40px' }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '24px', textDecoration: 'none' }}>
            <ArrowLeft size={18} /> Back to Blog
          </Link>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
            <span style={{ color: 'var(--accent-red)' }}>Deep Dive</span>
            <span style={{ color: 'var(--text-muted)' }}>July 14, 2026</span>
          </div>

          <h1 style={{ fontSize: '4rem', marginBottom: '32px', letterSpacing: '-0.05em', lineHeight: 1.1 }}>
            Why standard battery alerts are destroying your laptop.
          </h1>
        </div>

        <div className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '1.2rem', lineHeight: 1.8, fontWeight: 500, color: 'var(--text-main)' }}>

            <p className="lead" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' }}>
              We tend to ignore small, gray notifications in the corner of our screens. That behavioral blindspot is costing power users hundreds of dollars in battery replacements.
            </p>

            <p>
              Lithium-ion batteries are chemical engines. They don't like being completely empty, and they absolutely hate being stuffed full to 100% and left on the charger while running heavy workloads.
            </p>

            <h2 style={{ fontSize: '2rem', marginTop: '24px', marginBottom: '8px', color: 'var(--text-main)' }}>The Psychology of Ignoring</h2>

            <p>
              When Apple or Microsoft designed their operating systems, they wanted alerts to be "unobtrusive". A tiny little chime, a small gray box sliding in from the right. It's polite.
            </p>

            <div style={{ padding: '24px', borderLeft: '4px solid var(--accent-red)', backgroundColor: 'var(--primary-color)', fontStyle: 'italic', margin: '16px 0' }}>
              "Polite notifications are easily dismissed when you are in a state of deep flow."
            </div>

            <p>
              But when your battery hits 10% and you're compiling a huge project or rendering a video, you don't need "polite". You need an intervention. If you miss that notification, your laptop dies. You lose your state, your flow is broken, and your battery undergoes a deep discharge cycle—the worst possible thing for its chemical health.
            </p>

            <h2 style={{ fontSize: '2rem', marginTop: '24px', marginBottom: '8px', color: 'var(--text-main)' }}>The CasYuk Solution</h2>

            <p>
              This is why we built CasYuk. By utilizing hardware-level SMC access, we can stop the charge at exactly 80%. But more importantly, when it's time to unplug, we don't send a gray box. We overlay a transparent, chroma-keyed video of a screaming cat directly onto your screen.
            </p>

            <p>
              It hijacks your visual cortex. You cannot ignore it. And that is exactly the point.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
