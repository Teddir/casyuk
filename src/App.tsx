import { useState, useEffect, useRef } from 'react';
import { useBattery } from './hooks/useBattery';
import { BatteryGauge } from './components/BatteryGauge';
import { SettingsPanel } from './components/SettingsPanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { BatteryMonitor } from './components/BatteryMonitor';
import { ChargingControl } from './components/ChargingControl';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { LayoutDashboard, Battery, Palette, Settings, Zap, Search, Moon, Sun, Bell, ChevronLeft, ChevronRight, Plug, CheckCircle2 } from 'lucide-react';
import './App.css';

// Helper function to track events via Tauri v2 IPC
const trackEvent = async (name: string, props?: Record<string, string | number | boolean>) => {
  try {
    await invoke('plugin:aptabase|track_event', { name, props });
  } catch (err) {
    console.error('Aptabase error:', err);
  }
};

type ViewState = 'dashboard' | 'battery_monitor' | 'charging_control' | 'customization' | 'settings';

function App() {
  const { battery, error } = useBattery(5000);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appVersion, setAppVersion] = useState('...');

  // Initialize App and check onboarding
  useEffect(() => {
    getVersion().then((ver) => {
      setAppVersion(ver);
      trackEvent('app_launched', { version: ver, os: 'macos' });
    }).catch(console.error);
    
    trackEvent('daily_active', { date: new Date().toISOString().split('T')[0] });

    const hasOnboarded = localStorage.getItem('casyuk_onboarded');
    if (!hasOnboarded) {
      setShowOnboarding(true);
    }
  }, []);

  // Silent Auto-Updater (Runs on startup & every 12 hours)
  useEffect(() => {
    const runSilentUpdater = async () => {
      try {
        const update = await check();
        if (update) {
          trackEvent('auto_update_started', { version: update.version });
          await update.downloadAndInstall();
          trackEvent('auto_update_success', { version: update.version });
          await relaunch();
        }
      } catch (err) {
        console.error("Silent auto-update failed:", err);
      }
    };

    // Delay the initial check slightly to avoid slowing down startup
    const initialTimer = setTimeout(runSilentUpdater, 5000);
    
    // Check every 12 hours
    const intervalId = setInterval(runSilentUpdater, 12 * 60 * 60 * 1000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, []);

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
  const [alerts, setAlerts] = useState<{ id: number, type: string, text: string, time: string }[]>(() => {
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
        newAlert = { id: Date.now(), type: 'ok', text: `Charger connected at ${battery.percentage}%`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      else if ((prev.state === 'charging' || prev.state === 'full') && battery.state === 'discharging') {
        newAlert = { id: Date.now(), type: 'warning', text: `Charger disconnected at ${battery.percentage}%`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      else if (prev.percentage > 20 && battery.percentage <= 20) {
        newAlert = { id: Date.now(), type: 'warning', text: `Battery dropped to ${battery.percentage}%`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      else if (prev.percentage > 10 && battery.percentage <= 10) {
        newAlert = { id: Date.now(), type: 'critical', text: `Critical level reached (${battery.percentage}%)`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      }
      else if (prev.percentage < 100 && battery.percentage === 100) {
        newAlert = { id: Date.now(), type: 'ok', text: `Battery fully charged`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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

  const renderContent = () => {
    if (currentView === 'dashboard') {
      return (
        <div className="dashboard-grid">
          {/* Stat Cards */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-header">
                <h3>Current Level</h3>
              </div>
              <div className="stat-value">
                <h2>{battery?.percentage !== undefined ? `${Math.round(battery.percentage)}%` : '--'}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <span className={`badge ${isCharging ? 'positive' : 'warning'}`}>
                    {isCharging ? 'Charging' : 'On Battery'}
                  </span>
                  <span className="badge neutral">{isCharging ? 'AC Adapter' : 'Internal'}</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Cycle Count</h3>
              </div>
              <div className="stat-value">
                <h2>{battery?.cycle_count !== undefined ? battery.cycle_count : '--'}</h2>
                <span className="badge info">Cycles</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3>Battery Health</h3>
              </div>
              <div className="stat-value">
                <h2>{battery?.health !== undefined ? `${battery.health}%` : '--'}</h2>
                <span className={`badge ${battery?.health !== undefined && battery.health > 80 ? 'positive' : 'warning'}`}>
                  {battery?.health !== undefined && battery.health > 80 ? 'Optimal' : 'Needs Check'}
                </span>
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
                          {alert.type === 'warning' ? <Zap size={16} /> : alert.type === 'critical' ? <Battery size={16} /> : <Zap size={16} />}
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
        </div>
      );
    }

    if (currentView === 'battery_monitor') {
      return <BatteryMonitor battery={battery} />;
    }

    if (currentView === 'charging_control') {
      return <ChargingControl battery={battery} />;
    }

    if (currentView === 'customization') {
      return <CustomizationPanel />;
    }

    if (currentView === 'settings') {
      return <SettingsPanel />;
    }
  };

  // Render Onboarding
  if (showOnboarding) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-content">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-main)', letterSpacing: '-1px' }}>Welcome to CasYuk 🔋</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
            CasYuk uses emotional green-screen videos to remind you when it's time to charge.
            To make this work, we need your permission to show notifications.
          </p>
          <button
            onClick={async () => {
              await requestPermission();
              localStorage.setItem('casyuk_onboarded', 'true');
              setShowOnboarding(false);
              trackEvent('onboarding_completed');
            }}
            className="onboarding-btn"
          >
            <CheckCircle2 size={24} /> <span>Grant Permission & Start</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-left">
            <span className="brand-icon"><Zap size={24} color="#000" /></span>
            {isSidebarOpen && <h2>CasYuk</h2>}
          </div>
          <button className="collapse-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <div className="menu-group">
          {isSidebarOpen && <p className="menu-label">General</p>}
          <button
            className={`menu-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
            title="Dashboard"
          >
            <span className="icon"><LayoutDashboard size={18} /></span> {isSidebarOpen && 'Dashboard'}
          </button>

          <div style={{ height: '1.5rem' }}></div>
          {isSidebarOpen && <p className="menu-label">Hardware</p>}
          <button
            className={`menu-item ${currentView === 'battery_monitor' ? 'active' : ''}`}
            onClick={() => setCurrentView('battery_monitor')}
            title="Battery Monitor"
          >
            <span className="icon"><Battery size={18} /></span> {isSidebarOpen && 'Battery Monitor'}
          </button>
          <button
            className={`menu-item ${currentView === 'charging_control' ? 'active' : ''}`}
            onClick={() => setCurrentView('charging_control')}
            title="Charging Control"
          >
            <span className="icon"><Plug size={18} /></span> {isSidebarOpen && 'Charging Control'}
          </button>

          <div style={{ height: '1.5rem' }}></div>
          {isSidebarOpen && <p className="menu-label">Preferences</p>}
          <button
            className={`menu-item ${currentView === 'customization' ? 'active' : ''}`}
            onClick={() => setCurrentView('customization')}
            title="Customization"
          >
            <span className="icon"><Palette size={18} /></span> {isSidebarOpen && 'Customization'}
          </button>
          <button
            className={`menu-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
            title="Settings"
          >
            <span className="icon"><Settings size={18} /></span> {isSidebarOpen && 'Settings'}
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">C</div>
            {isSidebarOpen && (
              <div className="user-info">
                <p className="name" title="CasYuk System">CasYuk System</p>
                <p className="email" title={`v${appVersion}-pro`}>v{appVersion}-pro</p>
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
            <h1>
              {currentView === 'dashboard' && 'Battery Overview'}
              {currentView === 'battery_monitor' && 'Hardware Metrics'}
              {currentView === 'charging_control' && 'Power Management'}
              {currentView === 'customization' && 'Appearance'}
              {currentView === 'settings' && 'App Settings'}
            </h1>
          </div>

          <div className="topbar-actions">
            <button className="icon-btn theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="icon-btn" onClick={testNotification} title="Test Notification">
              <Bell size={18} />
            </button>
            <div className="search-box">
              <span className="search-icon"><Search size={16} /></span>
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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
