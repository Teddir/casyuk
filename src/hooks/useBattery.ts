import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { BatteryStatus } from '../types/battery';

export function useBattery(pollIntervalMs = 5000) {
  const [battery, setBattery] = useState<BatteryStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timer: number;

    async function fetchBatteryStatus() {
      try {
        const status = await invoke<BatteryStatus>('get_battery_status');
        if (isMounted) {
          setBattery(status);
          setError(null);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.toString());
        }
      }
    }

    // Initial fetch
    fetchBatteryStatus();

    // Setup polling
    timer = setInterval(fetchBatteryStatus, pollIntervalMs) as unknown as number;

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [pollIntervalMs]);

  return { battery, error };
}
