import { useState } from 'react';
import { useBattery } from './hooks/useBattery';
import { BatteryGauge } from './components/BatteryGauge';
import { SettingsPanel } from './components/SettingsPanel';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import './App.css';

function App() {
  const { battery, error } = useBattery(5000);
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');

  const testNotification = async () => {
    try {
      console.log('Testing notification...');
      let permissionGranted = await isPermissionGranted();
      console.log('Permission initially granted?', permissionGranted);
      
      if (!permissionGranted) {
        console.log('Requesting permission...');
        const permission = await requestPermission();
        console.log('Permission result:', permission);
        permissionGranted = permission === 'granted';
      }
      
      if (permissionGranted) {
        console.log('Sending notification...');
        sendNotification({ title: 'CasYuk 🔋', body: 'This is a test notification from your battery companion!' });
        console.log('Notification sent.');
      } else {
        console.log('Permission denied, cannot send notification.');
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>CasYuk 🔋</h1>
        <p>Your emotional battery companion</p>
      </header>

      <nav className="view-switcher">
        <button 
          className={currentView === 'dashboard' ? 'active' : ''} 
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={currentView === 'settings' ? 'active' : ''} 
          onClick={() => setCurrentView('settings')}
        >
          Settings
        </button>
      </nav>

      <section className="main-content">
        {currentView === 'dashboard' ? (
          <div className="dashboard-view">
            {battery ? (
              <>
                <BatteryGauge status={battery} error={error} />
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Membaca sensor baterai...</p>
              </div>
            )}
            
            {import.meta.env.DEV && (
              <button className="test-notif-btn" onClick={testNotification}>
                🔔 Test Notification
              </button>
            )}
          </div>
        ) : (
          <SettingsPanel />
        )}
      </section>
    </main>
  );
}

export default App;
