import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { emit } from '@tauri-apps/api/event';
import { Settings } from 'lucide-react';

export function SettingsPanel() {
  const [lowThreshold, setLowThreshold] = useState(20);
  const [criticalThreshold, setCriticalThreshold] = useState(5);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    async function initStore() {
      const s = await load('settings.json');
      setStore(s);
      
      const savedLow = await s.get<{ value: number }>('low_threshold');
      const savedCrit = await s.get<{ value: number }>('critical_threshold');
      
      if (savedLow) setLowThreshold(savedLow.value);
      if (savedCrit) setCriticalThreshold(savedCrit.value);
    }
    initStore();
  }, []);

  const handleLowChange = async (val: number) => {
    setLowThreshold(val);
    if (store) {
      await store.set('low_threshold', { value: val });
      await store.save();
    }
  };

  const handleCriticalChange = async (val: number) => {
    setCriticalThreshold(val);
    if (store) {
      await store.set('critical_threshold', { value: val });
      await store.save();
    }
  };

  return (
    <div className="settings-panel">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={28} /> App Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Configure notification thresholds and application behavior.</p>
      </div>
      
      <div className="widgets-row">
        <div className="widget-card">
          <div className="widget-header">
            <h3>Notification Thresholds</h3>
          </div>
          <div className="widget-content">
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Low Battery Alert</span>
                <span className="badge warning" style={{ fontSize: '1rem' }}>{lowThreshold}%</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                Triggers when battery drops below this percentage.
              </p>
              <input 
                type="range" min="5" max="50" 
                value={lowThreshold} 
                onChange={(e) => handleLowChange(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent-orange)' }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Critical Battery Alert</span>
                <span className="badge critical" style={{ fontSize: '1rem', background: 'var(--accent-red)' }}>{criticalThreshold}%</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                Triggers urgent window popup. Must be lower than Low Alert.
              </p>
              <input 
                type="range" min="1" max={Math.min(lowThreshold - 1, 30)} 
                value={criticalThreshold} 
                onChange={(e) => handleCriticalChange(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent-red)' }}
              />
            </div>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Developer / Debugging</h3>
          </div>
          <div className="widget-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Use these tools to manually trigger the pop-ups and test your chroma-key video settings.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={() => emit('test-alert-event', { percentage: lowThreshold, is_critical: false })} 
                className="text-btn" style={{ background: 'var(--accent-orange)' }}>
                Test Low Battery Popup
              </button>
              
              <button onClick={() => emit('test-alert-event', { percentage: criticalThreshold, is_critical: true })} 
                className="text-btn" style={{ background: 'var(--accent-red)' }}>
                Test Critical Battery Popup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

