# Why We Built CasYuk with Tauri instead of Electron

When building a desktop app, the default choice for web developers is Electron (think Slack, VS Code, Discord). But Electron bundles an entire Chromium browser into the app, resulting in massive file sizes and high RAM usage.

For a battery utility app, being heavy and draining the battery is hypocritical.

## Enter Tauri

We built CasYuk using **Tauri**. Tauri relies on the OS's native webview (WKWebView on macOS, WebView2 on Windows) and uses **Rust** for the backend.

The result?
- **App Size**: Under 10MB (compared to Electron's 150MB+).
- **RAM Usage**: Less than 30MB at idle.
- **Performance**: Native access to IOKit and WMI via Rust for instant hardware control.

CasYuk is proof that web technologies can build native-feeling, ultra-lightweight desktop applications.