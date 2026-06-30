import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AlertWindow } from "./AlertWindow";

const isAlertWindow = window.location.search.includes('window=alert');

if (isAlertWindow) {
  document.body.style.backgroundColor = 'transparent';
  document.body.style.backgroundImage = 'none';
  document.documentElement.style.backgroundColor = 'transparent';
  document.documentElement.style.backgroundImage = 'none';
  document.body.style.overflow = 'hidden';
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {isAlertWindow ? <AlertWindow /> : <App />}
  </React.StrictMode>,
);
