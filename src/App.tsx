import { useState, useEffect, useRef } from 'react';
import { useBattery } from './hooks/useBattery';
import { BatteryGauge } from './components/BatteryGauge';
import { SettingsPanel } from './components/SettingsPanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { VideoBank } from './components/VideoBank';
import { BatteryMonitor } from './components/BatteryMonitor';
import { ChargingControl } from './components/ChargingControl';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { load } from '@tauri-apps/plugin-store';
import { LayoutDashboard, Battery, Palette, Settings, Zap, Search, Moon, Sun, Bell, ChevronLeft, ChevronRight, Plug, CheckCircle2, Film, PanelLeft, Globe, MessageCircle, Crown } from 'lucide-react';
import { openUrl } from '@tauri-apps/plugin-opener';
import { LicenseModal } from './components/LicenseModal';
import './App.css';

// Helper function to track events via Tauri v2 IPC
const trackEvent = async (name: string, props?: Record<string, string | number | boolean>) => {
  try {
    await invoke('plugin:aptabase|track_event', { name, props });
  } catch (err) {
    console.error('Aptabase error:', err);
  }
};

type ViewState = 'dashboard' | 'video_bank' | 'battery_monitor' | 'charging_control' | 'customization' | 'settings';

function App() {
  const { battery, error } = useBattery(5000);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appVersion, setAppVersion] = useState('...');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Initialize App and check onboarding
  useEffect(() => {
    const initApp = async () => {
      const store = await load('settings.json');
      const storedTheme = await store.get<{ value: string }>('theme');
      if (storedTheme && (storedTheme.value === 'light' || storedTheme.value === 'dark')) {
        setTheme(storedTheme.value);
      }
      
      const proStatus = await store.get<{ value: boolean }>('is_pro_activated');
      if (proStatus) {
        setIsPro(proStatus.value);
      }
    };

    initApp();

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

    if (currentView === 'video_bank') {
      return <VideoBank isPro={isPro} onUpgradeClick={() => setShowLicenseModal(true)} />;
    }

    if (currentView === 'battery_monitor') {
      return <BatteryMonitor battery={battery} isPro={isPro} onUpgradeClick={() => setShowLicenseModal(true)} />;
    }

    if (currentView === 'charging_control') {
      return <ChargingControl battery={battery} isPro={isPro} onUpgradeClick={() => setShowLicenseModal(true)} />;
    }

    if (currentView === 'customization') {
      return <CustomizationPanel isPro={isPro} onUpgradeClick={() => setShowLicenseModal(true)} />;
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
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg-main)' }}>
      {/* Top Marquee Announcement Bar */}
      <div className="announcement-bar" data-tauri-drag-region>
        <div className="marquee-container" style={{ pointerEvents: 'none', flex: 1, marginRight: '1rem' }}>
          <div className="marquee-content">
            <span style={{ fontSize: '1.2rem', marginRight: '0.5rem', verticalAlign: 'middle' }}>🔥</span> 
            <span><strong>Steal a LIFETIME Pro Key!</strong> Why pay when your creativity can? Submit 3 jaw-dropping, uniquely crafted video alerts. If they're sick enough to make it into the official CasYuk Video Bank, a Lifetime Pro License is yours for absolutely $0.</span>
          </div>
        </div>
        <button style={{
          background: '#fff',
          color: '#000',
          border: '2px solid #000',
          borderRadius: '6px',
          padding: '4px 12px',
          fontWeight: 800,
          fontSize: '0.75rem',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px #000',
          whiteSpace: 'nowrap',
          transition: 'transform 0.1s',
          flexShrink: 0,
        }} 
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #000'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px #000'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px #000'; }}
        onClick={() => openUrl('https://discord.gg/casyuk')}>
          Submit on Discord
        </button>
      </div>

      <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ flex: 1, height: 'calc(100vh - 40px)' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand" data-tauri-drag-region>
          <div className="brand-left">
            <img src="/logo.png" alt="CasYuk Logo" className="brand-logo-img" />
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
            className={`menu-item ${currentView === 'video_bank' ? 'active' : ''}`}
            onClick={() => setCurrentView('video_bank')}
            title="Video Bank"
          >
            <span className="icon"><Film size={18} /></span> {isSidebarOpen && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Video Bank <span style={{ background: 'var(--accent-green)', color: '#000', padding: '1px 6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>PRO</span></span>}
          </button>
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
            <div className="avatar">{isPro ? '🚀' : 'C'}</div>
            {isSidebarOpen && (
              <div className="user-info">
                <p className="name" title={isPro ? "CasYuk Pro" : "CasYuk"}>{isPro ? "CasYuk Pro" : "CasYuk"}</p>
                <p className="email" title={`v${appVersion}${isPro ? '-pro' : '-free'}`}>v{appVersion}{isPro ? <span style={{color:'var(--accent-green)', fontWeight:'bold'}}> PRO</span> : ''}</p>
              </div>
            )}
            {!isPro && isSidebarOpen && (
              <button 
                onClick={() => setShowLicenseModal(true)}
                style={{ 
                  marginLeft: 'auto', background: 'var(--accent-green)', color: '#000', 
                  border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem',
                  fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                UPGRADE
              </button>
            )}
            {isPro && isSidebarOpen && (
              <button 
                onClick={async () => {
                  const store = await load('settings.json');
                  await store.delete('is_pro_activated');
                  await store.save();
                  setIsPro(false);
                  showToastMessage('Pro Plan Reset (Testing)');
                }}
                style={{ 
                  marginLeft: 'auto', background: 'var(--accent-red)', color: '#fff', 
                  border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem',
                  fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                RESET
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-area">
        <header className="topbar" data-tauri-drag-region>
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="icon-btn" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              title="Toggle Sidebar"
              style={{ background: 'var(--primary-color)', border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)', color: 'var(--text-main)' }}
            >
              <PanelLeft size={18} />
            </button>
            <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>
              {currentView === 'dashboard' && 'Battery Overview'}
              {currentView === 'video_bank' && 'Video Bank PRO'}
              {currentView === 'battery_monitor' && 'Hardware Metrics'}
              {currentView === 'charging_control' && 'Power Management'}
              {currentView === 'customization' && 'Appearance'}
              {currentView === 'settings' && 'App Settings'}
            </h1>
          </div>

          <div className="topbar-actions">
            {!isPro && (
              <button 
                onClick={() => setShowLicenseModal(true)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--accent-green)', color: '#000', 
                  border: '2px solid #000', padding: '8px 16px', borderRadius: '8px', 
                  fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '3px 3px 0px #000',
                  transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(3px, 3px)'; e.currentTarget.style.boxShadow = '0px 0px 0px #000'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px #000'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px #000'; }}
              >
                <Crown size={16} /> Get Pro
              </button>
            )}
            
            <div style={{ width: '2px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem', opacity: 0.5 }}></div>

            <button className="icon-btn" onClick={() => openUrl('https://discord.gg/casyuk')} title="Join Discord">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.05.05 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.7.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="currentColor"/>
              </svg>
            </button>
            <button className="icon-btn" onClick={() => openUrl('https://casyuk.com')} title="Official Website">
              <Globe size={18} />
            </button>
            
            <div style={{ width: '2px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem', opacity: 0.5 }}></div>

            <button className="icon-btn theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        <div className="content-scroll">
          {renderContent()}
        </div>
      </main>

      {/* Notification Toast */}
      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      
      {/* License Modal */}
      {showLicenseModal && (
        <LicenseModal 
          onSuccess={() => {
            setIsPro(true);
            setShowLicenseModal(false);
            showToastMessage('CasYuk Pro successfully activated! 🎉');
          }}
          onCancel={() => setShowLicenseModal(false)}
        />
      )}
      </div>
    </div>
  );
}

export default App;
