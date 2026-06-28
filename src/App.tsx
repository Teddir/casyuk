import { useState, useEffect, useRef } from 'react';
import { useBattery } from './hooks/useBattery';
import { BatteryGauge } from './components/BatteryGauge';
import { SettingsPanel } from './components/SettingsPanel';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import './App.css';

function App() {
  const { battery, error } = useBattery(5000);
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const testNotification = async () => {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        sendNotification({ title: 'CasYuk 🔋', body: 'This is a test notification from your battery companion!' });
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const isCharging = battery?.state === 'charging' || battery?.state === 'full';

  // Dynamic Alerts System
  const [alerts, setAlerts] = useState<{id: number, type: string, text: string, time: string}[]>(() => {
    const saved = localStorage.getItem('casyuk_alerts');
    return saved ? JSON.parse(saved) : [];
  });
  const prevBatteryRef = useRef<typeof battery>(null);

  useEffect(() => {
    if (!battery) return;
    const prev = prevBatteryRef.current;
    if (prev) {
      let newAlert = null;
      
      if (prev.state === 'discharging' && (battery.state === 'charging' || battery.state === 'full')) {
        newAlert = { id: Date.now(), type: 'ok', text: `Charger connected at ${battery.percentage}%`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      }
      else if ((prev.state === 'charging' || prev.state === 'full') && battery.state === 'discharging') {
        newAlert = { id: Date.now(), type: 'warning', text: `Charger disconnected at ${battery.percentage}%`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      }
      else if (prev.percentage > 20 && battery.percentage <= 20) {
        newAlert = { id: Date.now(), type: 'warning', text: `Battery dropped to ${battery.percentage}%`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      }
      else if (prev.percentage > 10 && battery.percentage <= 10) {
        newAlert = { id: Date.now(), type: 'critical', text: `Critical level reached (${battery.percentage}%)`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      }
      else if (prev.percentage < 100 && battery.percentage === 100) {
        newAlert = { id: Date.now(), type: 'ok', text: `Battery fully charged`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      }

      if (newAlert) {
        setAlerts(prevAlerts => {
          const updated = [newAlert, ...prevAlerts].slice(0, 50);
          localStorage.setItem('casyuk_alerts', JSON.stringify(updated));
          return updated;
        });
      }
    }
    prevBatteryRef.current = battery;
  }, [battery]);
  
  const filteredAlerts = alerts.filter(alert => 
    alert.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-left">
            <span className="brand-icon">⚡</span>
            {isSidebarOpen && <h2>CasYuk</h2>}
          </div>
          <button className="collapse-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <div className="menu-group">
          {isSidebarOpen && <p className="menu-label">General</p>}
          <button 
            className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
            title="Dashboard"
          >
            <span className="icon">📊</span> {isSidebarOpen && 'Dashboard'}
          </button>
          <button 
            className={`menu-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
            title="Settings"
          >
            <span className="icon">⚙️</span> {isSidebarOpen && 'Settings'}
          </button>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">C</div>
            {isSidebarOpen && (
              <div className="user-info">
                <p className="name">CasYuk System</p>
                <p className="email">v1.0.0-pro</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            {!isSidebarOpen && (
              <button className="mobile-menu-btn icon-btn" onClick={() => setIsSidebarOpen(true)}>
                ☰
              </button>
            )}
            <h1>{currentView === 'dashboard' ? 'Battery Overview' : 'Settings & Customization'}</h1>
          </div>
          
          <div className="topbar-actions">
            <button className="icon-btn theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="icon-btn" onClick={testNotification} title="Test Notification">🔔</button>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search alerts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="content-scroll">
          {currentView === 'dashboard' ? (
            <div className="dashboard-grid">
              {/* Stat Cards */}
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Current Level</h3>
                    <span className="more-icon">⋮</span>
                  </div>
                  <div className="stat-value">
                    <h2>{battery?.percentage !== undefined ? `${Math.round(battery.percentage)}%` : '--'}</h2>
                    <span className={`badge ${isCharging ? 'positive' : 'warning'}`}>
                      {isCharging ? '⚡ Charging' : '🔋 On Battery'}
                    </span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Cycle Count</h3>
                    <span className="more-icon">⋮</span>
                  </div>
                  <div className="stat-value">
                    <h2>{battery?.cycle_count !== undefined ? battery.cycle_count : '--'}</h2>
                    <span className="badge info">Cycles</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Battery Health</h3>
                    <span className="more-icon">⋮</span>
                  </div>
                  <div className="stat-value">
                    <h2>{battery?.health !== undefined ? `${battery.health}%` : '--'}</h2>
                    <span className={`badge ${battery?.health !== undefined && battery.health > 80 ? 'positive' : 'warning'}`}>
                      {battery?.health !== undefined && battery.health > 80 ? 'Optimal' : 'Needs Check'}
                    </span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <h3>Power Source</h3>
                    <span className="more-icon">⋮</span>
                  </div>
                  <div className="stat-value">
                    <h2>{isCharging ? 'AC Adapter' : 'Internal'}</h2>
                    <span className="badge neutral">Auto-detect</span>
                  </div>
                </div>
              </div>

              {/* Main Widgets */}
              <div className="widgets-row">
                <div className="widget-card main-widget">
                  <div className="widget-header">
                    <h3>Companion Status</h3>
                  </div>
                  <div className="widget-content centered-content">
                    {battery ? (
                      <div className="battery-gauge-wrapper">
                        <BatteryGauge status={battery} error={error} />
                      </div>
                    ) : (
                      <div className="loading-state">Reading sensors...</div>
                    )}
                  </div>
                </div>
                
                <div className="widget-card activity-widget">
                  <div className="widget-header">
                    <h3>Recent Alerts</h3>
                  </div>
                  <div className="widget-content">
                    {filteredAlerts.length > 0 ? (
                      <ul className="activity-list">
                        {filteredAlerts.map(alert => (
                          <li key={alert.id}>
                            <div className={`activity-icon ${alert.type}-bg`}>
                              {alert.type === 'warning' ? '⚠️' : alert.type === 'critical' ? '🆘' : '✅'}
                            </div>
                            <div className="activity-text">
                              <p>{alert.text}</p>
                              <small>{alert.time}</small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-results">No alerts match your search.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Advanced Controls Row */}
              <div className="widgets-row" style={{ marginTop: '2.5rem' }}>
                <div className="widget-card">
                  <div className="widget-header">
                    <h3>🔋 Battery Monitor</h3>
                  </div>
                  <div className="widget-content" style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <strong>Max Capacity</strong>
                      <span>{battery?.health !== undefined ? `${battery.health}%` : 'Reading...'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <strong>Current State</strong>
                      <span>{battery?.state ? battery.state.charAt(0).toUpperCase() + battery.state.slice(1) : 'Reading...'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <strong>Cycle Count</strong>
                      <span>{battery?.cycle_count !== undefined ? battery.cycle_count : 'Reading...'}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Keeping your cycle count low and maintaining your battery health above 80% ensures optimal performance for your Mac.
                    </p>
                  </div>
                </div>

                <div className="widget-card">
                  <div className="widget-header">
                    <h3>⚡ Charging Control</h3>
                  </div>
                  <div className="widget-content" style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Limit Charge to 80%</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prolong battery lifespan</span>
                      </div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--text-main)' }} />
                      </label>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Smart Discharge</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use battery while plugged in</span>
                      </div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--text-main)' }} />
                      </label>
                    </div>
                    
                    <button className="text-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
                      Apply Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="settings-wrapper">
              <SettingsPanel />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
