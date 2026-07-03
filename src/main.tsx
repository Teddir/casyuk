import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AlertWindow } from "./AlertWindow";
import { getCurrentWindow } from '@tauri-apps/api/window';

const isAlertWindow = window.location.search.includes('window=alert');

if (isAlertWindow) {
  document.body.style.backgroundColor = 'transparent';
  document.body.style.backgroundImage = 'none';
  document.documentElement.style.backgroundColor = 'transparent';
  document.documentElement.style.backgroundImage = 'none';
  document.body.style.overflow = 'hidden';
}

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      {isAlertWindow ? <AlertWindow /> : <App />}
    </React.StrictMode>,
  );

  // Pengecualian macOS: Paksa OS untuk memberikan fokus penuh ke Jendela & Webview ini
  // agar user tidak perlu melakukan klik 2x pada interaksi pertamanya.
  if (!isAlertWindow) {
    getCurrentWindow().setFocus().catch(console.error);
  }
};

if (isAlertWindow) {
  // Jendela alert (notifikasi video) harus langsung muncul tanpa delay
  renderApp();
} else {
  // Jendela utama (dashboard) diberi waktu tunggu 1.5 detik agar 
  // animasi pengisian baterai di index.html selesai mencapai 100% (warna hijau)
  // sebelum digantikan oleh UI React.
  setTimeout(renderApp, 1500);
}
