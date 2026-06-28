import { BatteryStatus } from '../types/battery';

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
  let batteryColor = '#34C759'; // Green
  if (percentage <= 20) batteryColor = '#FF3B30'; // Red
  else if (percentage <= 50) batteryColor = '#FFCC00'; // Yellow
  
  if (state === 'charging') batteryColor = '#007AFF'; // Blue when charging

  return (
    <div className="battery-gauge-container">
      <div className="battery-level-text">
        <span className="percentage">{percentage}%</span>
        <span className="state">{state}</span>
      </div>
      
      <div className="battery-icon-wrapper">
        <div className="battery-body">
          <div 
            className={`battery-fill ${state === 'charging' ? 'charging' : ''}`}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: batteryColor 
            }}
          />
          {state === 'charging' && (
             <div className="charging-bolt">⚡</div>
          )}
        </div>
        <div className="battery-tip" />
      </div>
    </div>
  );
}
