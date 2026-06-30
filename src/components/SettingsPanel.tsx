import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { getVersion } from '@tauri-apps/api/app';
import { Settings, RefreshCw, DownloadCloud } from 'lucide-react';

const BatterySlider = ({ value, onChange, min, max, color }: { value: number, onChange: (v: number) => void, min: number, max: number, color: string }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '36px', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
      <div style={{ flex: 1, height: '100%', border: '3px solid var(--border-color)', borderRadius: '8px', padding: '3px', position: 'relative', background: 'var(--card-bg)', boxShadow: '3px 3px 0px var(--border-color)' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.1s ease-out' }}></div>
      </div>
      <div style={{ width: '8px', height: '16px', background: 'var(--border-color)', borderRadius: '0 4px 4px 0', marginLeft: '3px' }}></div>
      
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={(e) => {
          let val = Number(e.target.value);
          if (val > max) val = max;
          if (val < min) val = min;
          onChange(val);
        }} 
        style={{ position: 'absolute', top: 0, left: 0, width: 'calc(100% - 11px)', height: '100%', opacity: 0, cursor: 'pointer', margin: 0, padding: 0 }}
        title={`Set threshold (Min: ${min}%, Max: ${max}%)`}
      />
    </div>
  );
};

export function SettingsPanel() {
  const [lowThreshold, setLowThreshold] = useState(20);
  const [criticalThreshold, setCriticalThreshold] = useState(10);
  const [store, setStore] = useState<any>(null);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [appVersion, setAppVersion] = useState('...');

  useEffect(() => {
    getVersion().then(setAppVersion).catch(console.error);
    
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

  const handleLowChange = (val: number) => {
    setLowThreshold(val);
    setHasUnsaved(true);
  };

  const handleCriticalChange = (val: number) => {
    setCriticalThreshold(val);
    setHasUnsaved(true);
  };

  const resetThresholds = () => {
    setLowThreshold(20);
    setCriticalThreshold(10);
    setHasUnsaved(true);
  };

  const saveSettings = async () => {
    if (store) {
      await store.set('low_threshold', { value: lowThreshold });
      await store.set('critical_threshold', { value: criticalThreshold });
      await store.save();
      setHasUnsaved(false);
      alert('Settings saved successfully!');
    }
  };

  return (
    <div className="settings-panel">
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={28} /> App Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Configure notification thresholds and application behavior.</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="widget-card">
          <div className="widget-header">
            <h3>Notification Thresholds</h3>
            <button 
              onClick={resetThresholds} 
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--text-main)',
                boxShadow: '1px 1px 0px var(--border-color)'
              }}
            >
              Reset Default
            </button>
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
              <BatterySlider 
                value={lowThreshold} 
                onChange={handleLowChange} 
                min={5} 
                max={50} 
                color="var(--accent-orange)" 
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
              <BatterySlider 
                value={criticalThreshold} 
                onChange={handleCriticalChange} 
                min={1} 
                max={Math.min(lowThreshold - 1, 30)} 
                color="var(--accent-red)" 
              />
            </div>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>App Updates</h3>
          </div>
          <div className="widget-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontWeight: 700, margin: 0 }}>Current Version</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>v{appVersion}</p>
              </div>
              
              {!updateAvailable ? (
                <button 
                  className="text-btn" 
                  onClick={async () => {
                    try {
                      setIsCheckingUpdate(true);
                      setUpdateStatus('Checking for updates...');
                      const update = await check();
                      if (update) {
                        setUpdateAvailable(update);
                        setUpdateStatus(`Update v${update.version} available!`);
                      } else {
                        setUpdateStatus('You are up to date!');
                        setTimeout(() => setUpdateStatus(''), 3000);
                      }
                    } catch (error: any) {
                      console.error("Updater error:", error);
                      const errMsg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
                      setUpdateStatus(`Error: ${errMsg}`);
                      setTimeout(() => setUpdateStatus(''), 8000);
                    } finally {
                      setIsCheckingUpdate(false);
                    }
                  }}
                  disabled={isCheckingUpdate}
                  style={{ 
                    padding: '0.6rem 1.2rem', 
                    background: 'var(--border-color)',
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <RefreshCw size={16} className={isCheckingUpdate ? 'spin-anim' : ''} />
                  {isCheckingUpdate ? 'Checking...' : 'Check Update'}
                </button>
              ) : (
                <button 
                  className="text-btn" 
                  onClick={async () => {
                    try {
                      setIsDownloading(true);
                      setUpdateStatus('Downloading and installing update...');
                      let downloaded = 0;
                      let contentLength = 0;
                      await updateAvailable.downloadAndInstall((event: any) => {
                        switch (event.event) {
                          case 'Started':
                            contentLength = event.data.contentLength;
                            break;
                          case 'Progress':
                            downloaded += event.data.chunkLength;
                            const progress = Math.round((downloaded / contentLength) * 100);
                            setUpdateStatus(`Downloading: ${progress}%`);
                            break;
                          case 'Finished':
                            setUpdateStatus('Installing...');
                            break;
                        }
                      });
                      setUpdateStatus('Update installed! Restarting...');
                      setTimeout(() => relaunch(), 1500);
                    } catch (error: any) {
                      setUpdateStatus(`Install failed: ${error.message}`);
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading}
                  style={{ 
                    padding: '0.6rem 1.2rem', 
                    background: 'var(--accent-green)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <DownloadCloud size={16} />
                  {isDownloading ? 'Downloading...' : 'Install Update'}
                </button>
              )}
            </div>
            
            {updateStatus && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: 600, padding: '0.5rem', background: 'var(--sidebar-bg)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                ℹ️ {updateStatus}
              </p>
            )}
            {updateAvailable && updateAvailable.body && (
              <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--sidebar-bg)' }}>
                <p style={{ fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Release Notes (v{updateAvailable.version}):</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{updateAvailable.body}</p>
              </div>
            )}
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Save Configuration</h3>
          </div>
          <div className="widget-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
              Make sure to save your changes to apply the new battery notification thresholds globally.
            </p>
            <button 
              className="text-btn" 
              onClick={saveSettings}
              disabled={!hasUnsaved}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                background: hasUnsaved ? 'var(--accent-green)' : 'var(--border-color)',
                color: hasUnsaved ? '#000000' : 'var(--primary-color)'
              }}
            >
              {hasUnsaved ? 'Save Settings' : 'Saved'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

