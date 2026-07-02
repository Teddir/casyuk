import { Lock } from 'lucide-react';

interface Props {
  onUpgradeClick: () => void;
  featureName?: string;
  variant?: 'card' | 'badge';
}

export function ProGateOverlay({ onUpgradeClick, featureName = "Pro Feature", variant = 'card' }: Props) {
  if (variant === 'badge') {
    return (
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(246, 246, 249, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        padding: '1rem',
        animation: 'popIn 0.3s ease-out'
      }}>
        <div className="neo-card" style={{
          background: 'var(--card-bg)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.8rem',
          border: '2px solid var(--border-color)',
          boxShadow: '4px 4px 0px var(--border-color)',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--accent-red)', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <Lock size={12} color="#000" />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Locked Feature</h4>
          </div>
          <button
            className="text-btn"
            onClick={onUpgradeClick}
            style={{ background: 'var(--accent-green)', padding: '0.5rem 1.5rem', fontSize: '0.9rem', width: '100%' }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(246, 246, 249, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '8px',
      padding: '2rem'
    }}>
      <div className="neo-card" style={{
        background: 'var(--card-bg)',
        padding: '1.5rem',
        textAlign: 'center',
        maxWidth: '400px',
        animation: 'popIn 0.3s ease-out'
      }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'var(--accent-red)', margin: '0 auto 1rem',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <Lock size={24} color="#000" />
        </div>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{featureName}</h3>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Unlock this feature and much more with CasYuk Pro.
        </p>
        <button
          className="text-btn"
          onClick={onUpgradeClick}
          style={{ background: 'var(--accent-green)', padding: '0.8rem 1.5rem', fontSize: '1rem', width: '100%' }}
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  );
}
