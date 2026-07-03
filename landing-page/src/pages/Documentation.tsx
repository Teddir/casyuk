import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    const sections = ['getting-started', 'installation', 'configuration', 'custom-media', 'troubleshooting', 'api-reference'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -100% 0px', threshold: 0.1 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <div className="pattern-grid-faded hero-mask" style={{ padding: '160px 0 120px' }}>
      <div className="container flex-col-mobile" style={{ maxWidth: '1000px', display: 'flex', gap: '48px' }}>

        {/* Sidebar */}
        <div className="hide-on-mobile" style={{ width: '250px', borderRight: '3px solid var(--border-color)', paddingRight: '24px' }}>
          <div style={{ position: 'sticky', top: '120px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
              Documentation
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontWeight: 600 }}>
              <li><a href="#getting-started" style={{ color: activeSection === 'getting-started' ? 'var(--accent-green)' : 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }}>Getting Started</a></li>
              <li><a href="#installation" style={{ color: activeSection === 'installation' ? 'var(--accent-green)' : 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }}>Installation</a></li>
              <li><a href="#configuration" style={{ color: activeSection === 'configuration' ? 'var(--accent-green)' : 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }}>Configuration</a></li>
              <li><a href="#custom-media" style={{ color: activeSection === 'custom-media' ? 'var(--accent-green)' : 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }}>Custom Media</a></li>
              <li><a href="#troubleshooting" style={{ color: activeSection === 'troubleshooting' ? 'var(--accent-green)' : 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }}>Troubleshooting</a></li>
              <li><a href="#api-reference" style={{ color: activeSection === 'api-reference' ? 'var(--accent-green)' : 'var(--text-main)', textDecoration: 'none', transition: 'color 0.2s' }}>API Reference</a></li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <BookOpen size={40} color="var(--accent-blue)" />
            <h1 style={{ fontSize: '3.5rem', margin: 0, letterSpacing: '-0.05em' }}>
              Documentation
            </h1>
          </div>

          <div id="getting-started" className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>Getting Started</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, color: 'var(--text-main)' }}>
              Welcome to the CasYuk documentation. CasYuk is an emotional battery management system that forces you to respect your hardware by interrupting your workflow with high-fidelity, transparent video overlays when your battery hits critical thresholds.
            </p>
          </div>

          <div id="installation" className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>Installation</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: '24px', color: 'var(--text-main)' }}>
              We provide one-line installation scripts for macOS, Windows, and Linux. Ensure you have administrative privileges before running these commands.
            </p>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>macOS / Linux</h4>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '16px', borderRadius: '8px', border: '2px solid var(--border-color)', marginBottom: '24px' }}>
              <code style={{ fontSize: '0.9rem', color: 'var(--accent-green)', wordBreak: 'break-all' }}>curl -fsSL https://casyuk.com/install.sh | bash</code>
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Windows (PowerShell)</h4>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '16px', borderRadius: '8px', border: '2px solid var(--border-color)' }}>
              <code style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', wordBreak: 'break-all' }}>iwr -useb https://casyuk.com/install.ps1 | iex</code>
            </div>
          </div>

          <div id="configuration" className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>Configuration</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: '16px', color: 'var(--text-main)' }}>
              CasYuk can be configured by right-clicking the system tray icon and opening the Settings panel, or by editing the JSON config file directly at <code>~/.config/casyuk/config.json</code>.
            </p>
            <ul style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, color: 'var(--text-main)', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><strong>Upper Limit (Plugged In):</strong> Default is 80%. When reached, CasYuk warns you to unplug to prevent lithium-ion degradation.</li>
              <li><strong>Lower Limit (On Battery):</strong> Default is 20%. When reached, CasYuk triggers an alert to plug in your charger.</li>
              <li><strong>Aggressiveness:</strong> Determines how often the overlay repeats if ignored (options: Chill, Annoying, Aggressive).</li>
            </ul>
          </div>

          <div id="custom-media" className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>Custom Media</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: '16px', color: 'var(--text-main)' }}>
              CasYuk uses a built-in chroma-key engine. To use your own videos:
            </p>
            <ol style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, color: 'var(--text-main)', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>Record or download a video with a solid green background (Hex: <code>#00FF00</code>).</li>
              <li>Open CasYuk Settings &gt; Media Library.</li>
              <li>Click "Add Custom Overlay" and select your <code>.mp4</code> or <code>.webm</code> file.</li>
              <li>Adjust the "Chroma Tolerance" slider until the background perfectly disappears.</li>
            </ol>
          </div>

          <div id="troubleshooting" className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>Troubleshooting</h2>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>The video overlay is black/flickering</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: '24px', color: 'var(--text-main)' }}>
              This usually happens if hardware acceleration is disabled in your OS. Ensure your GPU drivers are up to date. If using Linux, make sure your compositor (e.g. Picom or Wayland) supports transparent windows.
            </p>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>CasYuk isn't reading my battery (Windows)</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, margin: 0, color: 'var(--text-main)' }}>
              If the tray icon shows <code>?%</code>, the WMI polling might be blocked. Try running CasYuk as Administrator once to register the WMI permissions.
            </p>
          </div>

          <div id="api-reference" className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-main)' }}>API Reference</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: '24px', color: 'var(--text-main)' }}>
              The CasYuk local API allows you to trigger custom battery states programmatically over a local UNIX socket (or <code>localhost:1414</code>).
            </p>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Trigger Overlay Manually</h4>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '16px', borderRadius: '8px', border: '2px solid var(--border-color)', marginBottom: '24px' }}>
              <code style={{ fontSize: '0.9rem', color: 'var(--accent-red)', wordBreak: 'break-all' }}>curl -X POST http://localhost:1414/api/v1/trigger -d '{`{"status": "panic", "message": "Custom warning!"}`}'</code>
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)' }}>Get Current Status</h4>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '16px', borderRadius: '8px', border: '2px solid var(--border-color)' }}>
              <code style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', wordBreak: 'break-all' }}>curl GET http://localhost:1414/api/v1/status</code>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
