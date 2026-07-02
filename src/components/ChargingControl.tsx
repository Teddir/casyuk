import { BatteryStatus } from '../types/battery';
import { Zap } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { ProGateOverlay } from './ProGateOverlay';

interface Props {
  battery: BatteryStatus | null;
  isPro?: boolean;
  onUpgradeClick?: () => void;
}

interface ChargingInfo {
  source_type: string;
  current_draw: string;
  adapter_wattage: string;
  time_to_full: string;
}

export function ChargingControl({ battery, isPro = false, onUpgradeClick }: Props) {
  const isCharging = battery?.state === 'charging' || battery?.state === 'full';
  const [info, setInfo] = useState<ChargingInfo | null>(null);
  
  const [limit80, setLimit80] = useState(false);
  const [smartDischarge, setSmartDischarge] = useState(false);
  
  useEffect(() => {
    async function fetchInfo() {
      try {
        const data = await invoke<ChargingInfo>('get_charging_control_info');
        setInfo(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchInfo();
    const interval = setInterval(fetchInfo, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleApply = async () => {
    try {
      await invoke('apply_charging_settings', { limit80, smartDischarge });
      alert("Settings applied successfully!");
    } catch (e: any) {
      alert("Failed to apply settings:\n" + e);
    }
  };

  return (
    <div className="settings-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={28} /> Power & Control</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Manage power delivery and extend battery lifespan.</p>
        </div>
      </div>

      <div className="widgets-row">

        <div className="widget-card">
          <div className="widget-header">
            <h3>Power Adapter Status</h3>
          </div>
          <div className="widget-content" style={{ padding: '1rem 0' }}>
            <div style={{ padding: '4px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Source Type</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{info?.source_type || (isCharging ? 'AC Power' : 'Internal Battery')}</div>
                </div>
                <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Current Draw</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{info?.current_draw || (isCharging ? 'Reading...' : '0.00 A')}</div>
                </div>
                <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Adapter Wattage</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{info?.adapter_wattage || (isCharging ? 'Reading...' : 'Not Connected')}</div>
                </div>
                <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Time to Full</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{info?.time_to_full || (isCharging && battery?.percentage !== 100 ? 'Calculating...' : 'N/A')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Advanced Power Management {!isPro && <span style={{ background: 'var(--accent-red)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '8px' }}>LOCKED</span>}</h3>
          </div>
          <div className="widget-content" style={{ padding: '1rem 0', position: 'relative', overflow: isPro ? 'auto' : 'hidden' }}>
            {!isPro && <ProGateOverlay onUpgradeClick={onUpgradeClick!} featureName="Advanced Power Management" variant="badge" />}
            
            <div style={{ padding: '4px', opacity: isPro ? 1 : 0.4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Limit Charge to 80%</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prolong battery lifespan (requires bclm)</span>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={limit80} onChange={(e) => isPro && setLimit80(e.target.checked)} disabled={!isPro} style={{ width: '24px', height: '24px', accentColor: 'var(--text-main)', cursor: isPro ? 'pointer' : 'default' }} />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Smart Discharge</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Use battery while plugged in</span>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={smartDischarge} onChange={(e) => isPro && setSmartDischarge(e.target.checked)} disabled={!isPro} style={{ width: '24px', height: '24px', accentColor: 'var(--text-main)', cursor: isPro ? 'pointer' : 'default' }} />
                </label>
              </div>

              <button className="text-btn" onClick={() => isPro && handleApply()} disabled={!isPro} style={{ width: '100%', marginTop: '1rem', padding: '1rem', cursor: isPro ? 'pointer' : 'default' }}>
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
