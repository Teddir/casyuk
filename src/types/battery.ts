export interface BatteryStatus {
  percentage: number;
  state: 'charging' | 'discharging' | 'empty' | 'full' | 'unknown';
}
