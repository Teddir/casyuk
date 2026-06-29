import { useState, useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification';
import { load } from '@tauri-apps/plugin-store';
import { AlertOverlay } from './components/AlertOverlay';
import { convertFileSrc } from '@tauri-apps/api/core';
import './App.css';

interface AlertData {
  percentage: number;
  is_critical: boolean;
}

export function AlertWindow() {
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const safeSendNotification = async (title: string, body: string) => {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
      }
      if (permissionGranted) {
        sendNotification({ title, body });
      }
    } catch (e) {
      console.error('Failed to send notification', e);
    }
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const store = await load('settings.json');
        const savedVid = await store.get<{ value: string }>('custom_video_path');
        const savedAud = await store.get<{ value: string }>('custom_audio_path');
        
        if (savedVid && savedVid.value) {
          setCustomVideoUrl(convertFileSrc(savedVid.value));
        } else {
          setCustomVideoUrl(null);
        }
        
        if (savedAud && savedAud.value) {
          setCustomAudioUrl(convertFileSrc(savedAud.value));
        } else {
          setCustomAudioUrl(null);
        }
      } catch (e) {
        console.error('Failed to load custom media settings', e);
      }
    }

    // Listen for alerts from Rust
    const unlisten = listen<string>('trigger-alert', async (event) => {
      try {
        await loadSettings(); // Reload settings right before showing
        const payload = JSON.parse(event.payload) as AlertData;
        setActiveAlert(payload);
        
        // Show this transparent overlay window, maximized but NOT fullscreen
        const appWindow = getCurrentWindow();
        await appWindow.maximize();
        await appWindow.show();
        await appWindow.setFocus();
        
        await safeSendNotification(
          payload.is_critical ? '⚠️ CRITICAL BATTERY' : '🔋 Low Battery',
          `Battery is at ${payload.percentage}%`
        );
      } catch (e) {
        console.error('Failed to parse alert payload', e);
      }
    });
    
    // Listen for testing button dispatch from the main window
    const unlistenTest = listen<AlertData>('test-alert-event', async (event) => {
      await loadSettings(); // Reload settings right before showing
      setActiveAlert(event.payload);
      const appWindow = getCurrentWindow();
      await appWindow.maximize();
      await appWindow.show();
      await appWindow.setFocus();
      
      await safeSendNotification(
        event.payload.is_critical ? '⚠️ CRITICAL BATTERY' : '🔋 Low Battery',
        `Battery is at ${event.payload.percentage}%`
      );
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
        customVideoUrl={customVideoUrl}
        customAudioUrl={customAudioUrl}
      />
    </div>
  );
}
