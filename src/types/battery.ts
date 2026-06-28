export interface BatteryStatus {
  percentage: number;
  health: number;
  cycle_count: number;
  state: 'charging' | 'discharging' | 'empty' | 'full' | 'unknown';
}
