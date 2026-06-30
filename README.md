<div align="center">
  <h1>🔋 CasYuk</h1>
  <p><b>A Next-Generation Emotional Battery Management System for macOS</b></p>
  
  <p>
    <a href="https://github.com/Teddir/casyuk/releases/latest"><img src="https://img.shields.io/github/v/release/Teddir/casyuk?style=for-the-badge&color=10b981" alt="Release" /></a>
    <img src="https://img.shields.io/badge/Platform-macOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="macOS" />
    <img src="https://img.shields.io/badge/Tauri-v2-24C8DB?style=for-the-badge&logo=tauri&logoColor=white" alt="Tauri" />
    <img src="https://img.shields.io/badge/Rust-1.80+-F74C00?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </p>
</div>

---

## 📖 Overview

**CasYuk** is not just another battery monitor. Most battery apps fail because they rely on passive notifications that users easily ignore. CasYuk attacks the problem through **behavioral psychology and emotional triggers**. 

By utilizing dynamic, high-quality **green-screen (chroma-key) video overlays**, CasYuk creates a sense of urgency and emotional connection that actively changes user charging habits in real-time. Built for enterprise and power users who care about the longevity of their hardware, CasYuk combines extreme performance (via Rust) with a premium Neo-Brutalist UI.

## ✨ Core Features

*   🎭 **Chroma-Key Video Engine (Pro)**: Replaces boring push notifications with transparent, high-fidelity video overlays that demand attention.
*   ⚡ **Smart Charge Limiter**: Automatically stops charging at 80% to preserve lithium-ion cell chemistry (hardware dependent).
*   📊 **Behavioral Analytics**: Tracks success metrics (e.g., *time to response after notification*, *plug rate*) using Aptabase to validate the emotional trigger's effectiveness.
*   🚀 **Insanely Fast & Lightweight**: Powered by Tauri v2 and Rust, ensuring near-zero CPU overhead while monitoring battery hardware states.
*   🔄 **Seamless Auto-Updates**: Built-in CI/CD pipeline pushes delta updates directly to users globally.

## 🛠️ Technology Stack

CasYuk is engineered using a modern, scalable, and memory-safe technology stack:

*   **Core Logic & Hardware Access**: Rust (`battery` crate, `smc` for Apple Silicon logic)
*   **Application Framework**: Tauri v2
*   **Frontend UI**: React 19 + TypeScript + Vite
*   **Styling**: Pure CSS with Neo-Brutalism aesthetic
*   **Analytics**: Aptabase (Privacy-First Event Tracking)
*   **CI/CD**: GitHub Actions (Automated macOS Code Signing & Release)

## 🚀 Installation

You can download the latest compiled release directly from our [Releases Page](https://github.com/Teddir/casyuk/releases/latest).

### Building from Source

If you wish to compile CasYuk locally, ensure you have **Node.js 22+** and **Rust** installed on your macOS machine.

```bash
# Clone the repository
git clone https://github.com/Teddir/casyuk.git
cd casyuk

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## 🗺️ Product Roadmap

- [x] **Phase 1: Foundation & Telemetry** (Tauri v2, Aptabase, CI/CD, Auto-updater).
- [ ] **Phase 2: Monetization & Pro Gate** (Lemon Squeezy integration, License key validation, Video Bank unlocking).
- [ ] **Phase 3: Video Content Delivery** (Chroma-key logic, Dynamic Video processing).
- [ ] **Phase 4: Cross-Platform Expansion** (Windows WMI support, Linux UPower support).

## 💼 Enterprise & Licensing

CasYuk is available under a Freemium model. The **Free Tier** includes basic battery tracking and standard notifications. The **Pro Tier** unlocks the curated Video Bank, custom video uploads, and advanced battery limiters.

For enterprise licensing, fleet deployment, or acquisition inquiries, please reach out via our official channels.

---

<div align="center">
  <p>Built with ❤️ by <b>Teddir</b></p>
</div>
