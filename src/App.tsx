import { useState, useEffect, useRef } from 'react';
import { useBattery } from './hooks/useBattery';
import { BatteryGauge } from './components/BatteryGauge';
import { SettingsPanel } from './components/SettingsPanel';
import { CustomizationPanel } from './components/CustomizationPanel';
import { VideoBank } from './components/VideoBank';
import { BatteryMonitor } from './components/BatteryMonitor';
import { ChargingControl } from './components/ChargingControl';
import { requestPermission } from '@tauri-apps/plugin-notification';
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { load } from '@tauri-apps/plugin-store';
import { LayoutDashboard, Battery, Palette, Settings, Zap, Moon, Sun, ChevronLeft, ChevronRight, Plug, CheckCircle2, Film, PanelLeft, Globe, Crown, Mail } from 'lucide-react';
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
  const [isPro, setIsPro] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appVersion, setAppVersion] = useState('...');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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
  // Auto-Update Check (Runs on startup & every 12 hours) - ONLY FOR PRO USERS
  useEffect(() => {
    // Jika bukan user Pro (belum memasukkan license key), jangan cek update sama sekali.
    if (!isPro) return;

    const runUpdateCheck = async () => {
      try {
        const update = await check();
        if (update) {
          trackEvent('update_available', { version: update.version });
          setPendingUpdate(update);
        }
      } catch (err) {
        console.error("Update check failed:", err);
      }
    };

    // Delay the initial check slightly to avoid slowing down startup
    const initialTimer = setTimeout(runUpdateCheck, 5000);

    // Check every 12 hours
    const intervalId = setInterval(runUpdateCheck, 12 * 60 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [isPro]);

  const handleInstallUpdate = async () => {
    if (!pendingUpdate) return;
    setIsUpdating(true);
    try {
      trackEvent('auto_update_started', { version: pendingUpdate.version });
      await pendingUpdate.downloadAndInstall();
      trackEvent('auto_update_success', { version: pendingUpdate.version });
      await relaunch();
    } catch (err) {
      console.error("Failed to install update:", err);
      showToastMessage("Failed to install update. Please try again.");
      setIsUpdating(false);
    }
  };

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);


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
  const filteredAlerts = alerts;


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
          background: 'var(--card-bg)',
          color: 'var(--text-main)',
          border: '2px solid var(--border-color)',
          borderRadius: '6px',
          padding: '4px 12px',
          fontWeight: 800,
          fontSize: '0.75rem',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px var(--border-color)',
          whiteSpace: 'nowrap',
          transition: 'transform 0.1s',
          flexShrink: 0,
        }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(2px, 2px)'; e.currentTarget.style.boxShadow = '0px 0px 0px var(--border-color)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px var(--border-color)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px var(--border-color)'; }}
          onClick={() => openUrl('mailto:teddir.ads@gmail.com')}>
          Submit via Email
        </button>
      </div>

      <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ flex: 1, height: 'calc(100vh - 40px)' }}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand" data-tauri-drag-region style={{ cursor: 'default' }}>
            <div className="brand-left" data-tauri-drag-region>
              <img src="/logo.png" alt="CasYuk Logo" className="brand-logo-img" data-tauri-drag-region />
              {isSidebarOpen && <h2 data-tauri-drag-region>CasYuk</h2>}
            </div>
            <button className="collapse-btn icon-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ background: 'var(--primary-color)', border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)', color: 'var(--text-main)' }}
            >
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

            <div style={{ height: '1.5rem' }}></div>
            {!isPro ? (
              <button
                className="menu-item"
                onClick={() => setShowLicenseModal(true)}
                title="Upgrade to Pro"
                style={{
                  color: '#000', fontWeight: 'bold',
                  border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)',
                  marginTop: '1rem'
                }}
              >
                <span className="icon"><Crown size={18} /></span> {isSidebarOpen && 'Upgrade to Pro'}
              </button>
            ) : (
              <button
                className="menu-item"
                onClick={async () => {
                  const store = await load('settings.json');
                  await store.delete('is_pro_activated');
                  await store.save();
                  setIsPro(false);
                  showToastMessage('Pro Plan Reset (Testing)');
                }}
                title="Downgrade to Free"
                style={{
                  color: '#000', fontWeight: 'bold',
                  border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)',
                  marginTop: '1rem'
                }}
              >
                <span className="icon"><Crown size={18} /></span> {isSidebarOpen && 'Downgrade Plan'}
              </button>
            )}
          </div>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">{isPro ? '🚀' : 'C'}</div>
              {isSidebarOpen && (
                <div className="user-info">
                  <p className="name" title={isPro ? "CasYuk Pro" : "CasYuk"}>{isPro ? "CasYuk Pro" : "CasYuk"}</p>
                  <p className="email" title={`v${appVersion}${isPro ? '-pro' : '-free'}`}>v{appVersion}{isPro ? <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}> PRO</span> : ''}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-area">
          <header className="topbar" data-tauri-drag-region>
            <div className="topbar-left" data-tauri-drag-region style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="icon-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title="Toggle Sidebar"
                style={{ background: 'var(--primary-color)', border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)', color: 'var(--text-main)' }}
              >
                <PanelLeft size={18} />
              </button>
              <h1 data-tauri-drag-region style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800, flex: 1, cursor: 'default' }}>
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
                    border: '2px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px',
                    fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer',
                    boxShadow: '3px 3px 0px var(--border-color)',
                    transition: 'transform 0.1s',
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(3px, 3px)'; e.currentTarget.style.boxShadow = '0px 0px 0px var(--border-color)'; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border-color)'; }}
                >
                  <Crown size={16} /> Get Pro
                </button>
              )}

              <div style={{ width: '2px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem', opacity: 0.5 }}></div>

              <button className="icon-btn" onClick={() => openUrl('mailto:teddir.ads@gmail.com')} title="Email Us"
                style={{ background: 'var(--primary-color)', border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)', color: 'var(--text-main)' }}
              >
                <Mail size={18} />
              </button>
              <button className="icon-btn" onClick={() => openUrl('https://casyuk.com')} title="Official Website"
                style={{ background: 'var(--primary-color)', border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)', color: 'var(--text-main)' }}
              >
                <Globe size={18} />
              </button>

              <div style={{ width: '2px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem', opacity: 0.5 }}></div>

              <button className="icon-btn theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme"
                style={{ background: 'var(--primary-color)', border: '2px solid var(--border-color)', boxShadow: '2px 2px 0px var(--border-color)', color: 'var(--text-main)' }}
              >
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

        {/* Update Modal */}
        {pendingUpdate && (
          <div className="modal-overlay">
            <div className="modal neo-brutalist">
              <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '16px' }}>New Version Available! 🚀</h2>
              <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
                CasYuk version <strong style={{ color: 'var(--primary)' }}>{pendingUpdate.version}</strong> is ready to install.
              </p>
              
              {pendingUpdate.body && (
                <div style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  border: '2px solid var(--border-color)', 
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '24px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'left'
                }}>
                  {pendingUpdate.body}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setPendingUpdate(null)}
                  disabled={isUpdating}
                >
                  Remind Me Later
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleInstallUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Installing...' : 'Update & Restart'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
