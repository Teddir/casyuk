import { BatteryStatus } from '../types/battery';
import { Zap } from 'lucide-react';

interface BatteryGaugeProps {
  status: BatteryStatus | null;
  error: string | null;
}

export function BatteryGauge({ status, error }: BatteryGaugeProps) {
  if (error) {
    return (
      <div className="battery-gauge-container error">
        <h3>Error detecting battery</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="battery-gauge-container loading">
        <p>Detecting battery state...</p>
      </div>
    );
  }

  const { percentage, state } = status;

  // Determine color based on percentage and state
  let batteryColor = 'var(--accent-green)'; // Green
  if (percentage <= 20) batteryColor = 'var(--accent-red)'; // Red
  else if (percentage <= 50) batteryColor = 'var(--accent-orange)'; // Yellow
  
  if (state === 'charging') batteryColor = 'var(--accent-blue)'; // Blue when charging

  return (
    <div className="battery-gauge-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
      <div className="battery-level-text" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px', textShadow: '4px 4px 0px var(--border-color)' }}>
          {percentage}%
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: batteryColor, marginTop: '0.5rem', textShadow: '1px 1px 0px var(--border-color)' }}>
          {state}
        </div>
      </div>
      
      <div className="battery-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="battery-body" style={{ width: '180px', height: '80px', border: '4px solid var(--border-color)', borderRadius: '12px', padding: '6px', position: 'relative', background: 'var(--card-bg)', boxShadow: '6px 6px 0px var(--border-color)' }}>
          <div 
            className={`battery-fill ${state === 'charging' ? 'charging' : ''}`}
            style={{ 
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: batteryColor,
              borderRadius: '4px',
              transition: 'width 0.5s ease-out, background-color 0.3s',
              border: '2px solid var(--border-color)'
            }}
          />
          {state === 'charging' && (
             <div className="charging-bolt" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Zap size={32} color="var(--border-color)" fill="var(--accent-yellow)" strokeWidth={2.5} />
             </div>
          )}
        </div>
        <div className="battery-tip" style={{ width: '12px', height: '30px', background: 'var(--border-color)', borderRadius: '0 6px 6px 0', marginLeft: '4px' }} />
      </div>
    </div>
  );
}
