import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { emit } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';

export function SettingsPanel() {
  const [lowThreshold, setLowThreshold] = useState(20);
  const [criticalThreshold, setCriticalThreshold] = useState(5);
  const [store, setStore] = useState<any>(null);
  const [customVideoPath, setCustomVideoPath] = useState('');
  const [customAudioPath, setCustomAudioPath] = useState('');

  useEffect(() => {
    async function initStore() {
      const s = await load('settings.json');
      setStore(s);
      
      const savedLow = await s.get<{ value: number }>('low_threshold');
      const savedCrit = await s.get<{ value: number }>('critical_threshold');
      const savedVid = await s.get<{ value: string }>('custom_video_path');
      const savedAud = await s.get<{ value: string }>('custom_audio_path');
      
      if (savedLow) setLowThreshold(savedLow.value);
      if (savedCrit) setCriticalThreshold(savedCrit.value);
      if (savedVid) setCustomVideoPath(savedVid.value);
      if (savedAud) setCustomAudioPath(savedAud.value);
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
      await store.set('low_threshold', { value: lowThreshold });
      await store.set('critical_threshold', { value: criticalThreshold });
      await store.set('custom_video_path', { value: customVideoPath });
      await store.set('custom_audio_path', { value: customAudioPath });
      await store.save();
    }
  };

  const handlePickVideo = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Video', extensions: ['mp4', 'mov', 'webm'] }]
    });
    if (selected && typeof selected === 'string') {
      setCustomVideoPath(selected);
      if (store) {
        await store.set('custom_video_path', { value: selected });
        await store.save();
      }
    }
  };

  const handlePickAudio = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }]
    });
    if (selected && typeof selected === 'string') {
      setCustomAudioPath(selected);
      if (store) {
        await store.set('custom_audio_path', { value: selected });
        await store.save();
      }
    }
  };

  const handleResetMedia = async () => {
    setCustomVideoPath('');
    setCustomAudioPath('');
    if (store) {
      await store.delete('custom_video_path');
      await store.delete('custom_audio_path');
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

      <div style={{ marginBottom: '20px' }}>
        <h3>🎨 Customization</h3>
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px' }}>Custom Video:</label>
          <input type="text" readOnly value={customVideoPath || 'Default (0629.mp4)'} style={{ flex: 1, padding: '0.5rem' }} />
          <button onClick={handlePickVideo} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Browse...</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ width: '150px' }}>Custom Audio:</label>
          <input type="text" readOnly value={customAudioPath || 'None (Silent)'} style={{ flex: 1, padding: '0.5rem' }} />
          <button onClick={handlePickAudio} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Browse...</button>
        </div>
        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <button onClick={handleResetMedia} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#ff3b30', color: 'white', border: 'none', borderRadius: '4px' }}>
            🔄 Reset to Default
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
          *Note: Video background must be green screen for chroma-key transparency to work.
        </p>
      </div>

      {import.meta.env.DEV && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
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
      )}
    </div>
  );
}

