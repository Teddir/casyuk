import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';
import { openUrl } from '@tauri-apps/plugin-opener';
import { CheckCircle2, Loader2, Key } from 'lucide-react';

interface LicenseModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LicenseModal({ onSuccess, onCancel }: LicenseModalProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setError('Please enter a valid license key.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call Rust backend to validate with Lemon Squeezy API
      const isValid = await invoke<boolean>('validate_license', { 
        key: licenseKey.trim(),
        instanceName: "CasYuk Desktop App"
      });

      if (isValid) {
        // Save to store
        const store = await load('settings.json');
        await store.set('is_pro_activated', { value: true });
        await store.save();
        
        // Track activation success
        invoke('plugin:aptabase|track_event', {
          name: 'pro_activated',
          props: {}
        }).catch(console.error);
        
        onSuccess();
      } else {
        setError('License key is invalid.');
      }
    } catch (e: any) {
      console.error(e);
      setError(typeof e === 'string' ? e : 'Failed to validate license.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="neo-card" style={{
        width: '400px',
        maxWidth: '90%',
        padding: '2rem',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: 'var(--accent-purple)', margin: '0 auto 1rem',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            <Key size={30} color="var(--text-main)" />
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Upgrade to CasYuk Pro</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Unlock the full Video Bank, custom media uploads, and charging control limits.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>License Key</label>
          <input 
            type="text" 
            placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              background: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}
          />
          {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', margin: '0.5rem 0 0 0', fontWeight: 'bold' }}>{error}</p>}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="text-btn" 
            onClick={onCancel}
            style={{ flex: 1, background: 'var(--primary-color)', padding: '0.8rem' }}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="text-btn" 
            onClick={handleActivate}
            style={{ flex: 1, background: 'var(--accent-green)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.8rem' }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> Activate</>}
          </button>
        </div>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have a license key? <a href="#" onClick={(e) => { e.preventDefault(); openUrl('https://casyuk.lemonsqueezy.com/buy/casyuk-pro'); }} style={{ color: 'var(--border-color)', textDecoration: 'underline', fontWeight: 'bold' }}>Get CasYuk Pro</a>
        </div>
      </div>
    </div>
  );
}
