import { Code, BookOpen } from 'lucide-react';

export function Docs({ type }: { type: 'api' | 'documentation' }) {
  const isApi = type === 'api';

  return (
    <div className="pattern-boxes-faded hero-mask" style={{ padding: '180px 0 120px' }}>
      <div className="container" style={{ maxWidth: '1000px', display: 'flex', gap: '48px' }}>

        {/* Sidebar */}
        <div className="hide-on-mobile" style={{ width: '250px', borderRight: '3px solid var(--border-color)', paddingRight: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
            {isApi ? 'API Reference' : 'Documentation'}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontWeight: 600 }}>
            <li><a href="#" style={{ color: 'var(--accent-green)' }}>Getting Started</a></li>
            <li><a href="#">Installation</a></li>
            <li><a href="#">Configuration</a></li>
            <li><a href="#">Custom Media</a></li>
            <li><a href="#">Troubleshooting</a></li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isApi ? <Code size={40} color="var(--accent-purple)" /> : <BookOpen size={40} color="var(--accent-blue)" />}
            <h1 style={{ fontSize: '3.5rem', margin: 0, letterSpacing: '-0.05em' }}>
              {isApi ? 'API Reference' : 'Documentation'}
            </h1>
          </div>

          <div className="neo-box" style={{ padding: '40px', backgroundColor: 'var(--card-bg)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Getting Started</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500, marginBottom: '24px' }}>
              {isApi
                ? 'The CasYuk local API allows you to trigger custom battery states programmatically for testing purposes. It operates over a local UNIX socket.'
                : 'Welcome to the CasYuk documentation. Here you will find everything you need to set up, configure, and troubleshoot your emotional battery management system.'}
            </p>

            <div style={{ backgroundColor: '#000', color: '#fff', padding: '24px', borderRadius: '8px', border: '2px solid var(--border-color)', marginBottom: '32px' }}>
              <code style={{ fontSize: '1rem', color: 'var(--accent-green)' }}>
                {isApi
                  ? 'curl -X POST http://localhost:1414/api/v1/trigger -d \'{"status": "panic"}\''
                  : 'curl -fsSL https://casyuk.com/install.sh | bash'}
              </code>
            </div>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
              Note: This section is currently being expanded. Check our GitHub repository for the most up-to-date source code and technical implementation details.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
