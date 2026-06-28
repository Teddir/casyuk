import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { AlertOverlay } from './components/AlertOverlay';
import './App.css';

interface AlertData {
  percentage: number;
  is_critical: boolean;
}

export function AlertWindow() {
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    // Listen for alerts from Rust
    const unlisten = listen<string>('trigger-alert', async (event) => {
      try {
        const payload = JSON.parse(event.payload) as AlertData;
        setActiveAlert(payload);
        
        // Show this transparent overlay window, maximized but NOT fullscreen
        const appWindow = getCurrentWindow();
        await appWindow.maximize();
        await appWindow.show();
        await appWindow.setFocus();
        
        sendNotification({
          title: payload.is_critical ? '⚠️ CRITICAL BATTERY' : '🔋 Low Battery',
          body: `Battery is at ${payload.percentage}%`
        });
      } catch (e) {
        console.error('Failed to parse alert payload', e);
      }
    });
    
    // Listen for testing button dispatch from the main window
    const unlistenTest = listen<AlertData>('test-alert-event', async (event) => {
      setActiveAlert(event.payload);
      const appWindow = getCurrentWindow();
      await appWindow.maximize();
      await appWindow.show();
      await appWindow.setFocus();
      
      sendNotification({
        title: event.payload.is_critical ? '⚠️ CRITICAL BATTERY' : '🔋 Low Battery',
        body: `Battery is at ${event.payload.percentage}%`
      });
    });

    return () => {
      unlisten.then(f => f());
      unlistenTest.then(f => f());
    };
  }, []);

  const handleDismiss = async () => {
    setActiveAlert(null);
    // Hide and unmaximize the overlay window
    const appWindow = getCurrentWindow();
    await appWindow.unmaximize();
    await appWindow.hide();
  };

  // If there's no alert active, render nothing (transparent background)
  if (!activeAlert) {
    return <div style={{ background: 'transparent', width: '100%', height: '100%' }}></div>;
  }

  return (
    <div style={{ background: 'transparent', width: '100vw', height: '100vh' }}>
      <AlertOverlay 
        percentage={activeAlert.percentage} 
        isCritical={activeAlert.is_critical} 
        onDismiss={handleDismiss} 
      />
    </div>
  );
}
