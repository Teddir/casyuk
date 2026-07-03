import { Check, X } from 'lucide-react';
import { NeoButton } from '../components/NeoButton';

export function Pricing() {
  return (
    <div className="pattern-grid-faded hero-mask" style={{ padding: '160px 0 120px' }}>
      <div className="container">

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="neo-box" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '50px', fontWeight: '700', marginBottom: '24px', backgroundColor: 'var(--accent-purple)', fontSize: '0.9rem', boxShadow: '3px 3px 0px var(--border-color)' }}>
            Transparent Pricing
          </div>
          <h1 style={{ fontSize: '4rem', marginBottom: '16px', letterSpacing: '-0.05em' }}>Simple Pricing for Power Users</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Pay once, use it forever. No hidden fees or recurring subscriptions.</p>
        </div>

        <div className="flex-col-mobile" style={{ display: 'flex', justifyContent: 'center', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>

          {/* Free Tier */}
          <div className="neo-box" style={{ flex: 1, padding: '40px', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Free Edition</h2>
            <p style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '32px' }}>For basic battery monitoring.</p>

            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '32px' }}>
              $0
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={20} color="var(--accent-green)" strokeWidth={3} /> <span style={{ fontWeight: 500 }}>System Notifications</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={20} color="var(--accent-green)" strokeWidth={3} /> <span style={{ fontWeight: 500 }}>Basic Battery Monitoring</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><X size={20} color="var(--accent-red)" strokeWidth={3} /> <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Chroma-Key Video Overlays</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><X size={20} color="var(--accent-red)" strokeWidth={3} /> <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Smart 80% Limit Enforcer</span></div>
            </div>

            <NeoButton variant="secondary" style={{ width: '100%' }}>Download Free</NeoButton>
          </div>

          {/* Pro Tier */}
          <div className="neo-box" style={{ flex: 1, padding: '40px', backgroundColor: 'var(--accent-green)', color: '#000', display: 'flex', flexDirection: 'column', transform: 'scale(1.05)', zIndex: 10 }}>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 800, alignSelf: 'flex-start', marginBottom: '16px' }}>MOST POPULAR</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Pro License</h2>
            <p style={{ fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: '32px' }}>Unlock the full emotional experience.</p>

            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
              $19 <span style={{ fontSize: '1.2rem', color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>/ lifetime</span>
            </div>
            <p style={{ fontWeight: 600, marginBottom: '32px', fontSize: '0.9rem' }}>Includes 1 year of updates.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={20} strokeWidth={3} /> <span style={{ fontWeight: 600 }}>Everything in Free</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={20} strokeWidth={3} /> <span style={{ fontWeight: 600 }}>Chroma-Key Video Overlays</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={20} strokeWidth={3} /> <span style={{ fontWeight: 600 }}>Custom Audio Alerts</span></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}><Check size={20} strokeWidth={3} /> <span style={{ fontWeight: 600 }}>Smart 80% Limit Enforcer</span></div>
            </div>

            <NeoButton style={{ width: '100%', backgroundColor: '#000', color: 'var(--accent-green)' }}>Get Pro License</NeoButton>
          </div>

        </div>
      </div>
    </div>
  );
}
