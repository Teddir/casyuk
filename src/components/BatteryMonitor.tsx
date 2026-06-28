import { BatteryStatus } from '../types/battery';
import { Battery, Lightbulb } from 'lucide-react';

interface Props {
  battery: BatteryStatus | null;
}

export function BatteryMonitor({ battery }: Props) {
  return (
    <div className="settings-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Battery size={28} /> Battery Monitor</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Detailed hardware metrics and sensor readings.</p>
        </div>
      </div>
      
      <div className="widgets-row">
        <div className="widget-card">
          <div className="widget-header">
            <h3>Primary Metrics</h3>
          </div>
          <div className="widget-content" style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
              <strong>Max Capacity</strong>
              <span>{battery?.health !== undefined ? `${battery.health}%` : 'Reading...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid var(--border-color)' }}>
              <strong>Current State</strong>
              <span>{battery?.state ? battery.state.charAt(0).toUpperCase() + battery.state.slice(1) : 'Reading...'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <strong>Cycle Count</strong>
              <span>{battery?.cycle_count !== undefined ? battery.cycle_count : 'Reading...'}</span>
            </div>
            <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--accent-purple)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', fontWeight: 700, display: 'flex', gap: '0.5rem' }}>
                <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Keeping your cycle count low and maintaining your battery health above 80% ensures optimal performance for your Mac.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="widget-card">
          <div className="widget-header">
            <h3>Advanced Hardware Info</h3>
          </div>
          <div className="widget-content" style={{ padding: '1rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Technology</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Lithium-Ion</div>
              </div>
              <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Temperature</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>32.4°C</div>
              </div>
              <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Design Capacity</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>5103 mAh</div>
              </div>
              <div className="neo-card" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Serial Number</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>F5K123498XYZ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
