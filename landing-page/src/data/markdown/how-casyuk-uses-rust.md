
# How CasYuk Uses Rust & Tauri for Zero Lag

When we first prototyped CasYuk in Electron, we hit a wall. Running a hidden chromium instance just to wait for a battery drop was consuming 150MB of RAM. For a utility app, that is unacceptable.

## Enter Tauri and Rust

We rebuilt CasYuk from the ground up using **Tauri**, which utilizes the OS's native webview (WKWebView on macOS, WebView2 on Windows) instead of bundling an entire browser.

The backend logic—monitoring battery states via native APIs—is written entirely in **Rust**. 

### The Result?
- **Memory Footprint:** ~18MB (88% reduction)
- **CPU Usage (Idle):** 0.0%
- **Binary Size:** < 5MB

## Transparent Chroma-Key Rendering

The hardest part was rendering a transparent video without a traditional window border. We used native Rust windowing APIs to set the window to click-through and completely transparent, ensuring that when the cat screams, it feels like it's inside your computer, not just a window.
