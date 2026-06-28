import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { emit } from '@tauri-apps/api/event';

export function SettingsPanel() {
  const [lowThreshold, setLowThreshold] = useState(20);
  const [criticalThreshold, setCriticalThreshold] = useState(5);
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    async function initStore() {
      // Pass required defaults in StoreOptions
      const s = await load('settings.json', { 
        autoSave: false,
        // @ts-ignore - The plugin types require defaults but we might not have all of them
        defaults: { lowThreshold: 20, criticalThreshold: 5 } 
      });
      setStore(s);
      
      const low = await s.get<number>('lowThreshold');
      if (low !== null && low !== undefined) setLowThreshold(low);
      
      const crit = await s.get<number>('criticalThreshold');
      if (crit !== null && crit !== undefined) setCriticalThreshold(crit);
    }
    initStore();
  }, []);

  const handleLowChange = async (val: number) => {
    setLowThreshold(val);
    if (store) {
      await store.set('lowThreshold', val);
      await store.save();
    }
  };

  const handleCriticalChange = async (val: number) => {
    setCriticalThreshold(val);
    if (store) {
      await store.set('criticalThreshold', val);
      await store.save();
    }
  };

  return (
    <div className="settings-panel">
      <h2>⚙️ Settings</h2>
      <p>Configure your CasYuk behavior here.</p>
      
      <div className="settings-group">
        <label>
          <span>Low Battery Alert Threshold: <strong>{lowThreshold}%</strong></span>
          <input 
            type="range" min="5" max="100" 
            value={lowThreshold} 
            onChange={(e) => handleLowChange(Number(e.target.value))} 
          />
        </label>
        
        <label>
          <span>Critical Battery Alert Threshold: <strong>{criticalThreshold}%</strong></span>
          <input 
            type="range" min="1" max="100" 
            value={criticalThreshold} 
            onChange={(e) => handleCriticalChange(Number(e.target.value))} 
          />
        </label>

        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span>Enable sound alerts (Coming in Sprint 4)</span>
        </label>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
        <h3 style={{ marginTop: 0 }}>Debug / Testing</h3>
        <p style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>
          *The Rule Engine in Rust only fires if your laptop is NOT charging. You can use these buttons to bypass it and test the UI directly.*
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => emit('test-alert-event', { percentage: 15, is_critical: false })} 
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Test Low Alert
          </button>
          
          <button onClick={() => emit('test-alert-event', { percentage: 4, is_critical: true })} 
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ff3b30', color: 'white', border: 'none' }}>
            Test Critical Alert
          </button>
        </div>
      </div>
    </div>
  );
}

