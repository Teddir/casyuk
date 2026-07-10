use tauri::{AppHandle, Emitter, Manager};
use std::time::{Duration, Instant};
use std::sync::Mutex;
pub struct CooldownState {
    pub last_alert: Option<Instant>,
}

impl CooldownState {
    pub fn new() -> Self {
        Self { last_alert: None }
    }
}

pub fn start_rule_engine(app: AppHandle) {
    tauri::async_runtime::spawn(async move {
        loop {
            tokio::time::sleep(Duration::from_secs(10)).await;
            
            if let Ok(battery) = crate::battery::get_status() {
                let mut low_threshold = 20;
                let mut critical_threshold = 10;
                
                // Reliably read settings from disk since store.get might fail in background thread
                if let Ok(app_dir) = app.path().app_data_dir() {
                    let settings_path = app_dir.join("settings.json");
                    if let Ok(content) = std::fs::read_to_string(&settings_path) {
                        if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
                            if let Some(obj) = json.get("low_threshold").and_then(|v| v.as_object()) {
                                if let Some(num) = obj.get("value").and_then(|v| v.as_u64()) {
                                    low_threshold = num as u8;
                                }
                            } else if let Some(num) = json.get("low_threshold").and_then(|v| v.as_u64()) {
                                low_threshold = num as u8;
                            }

                            if let Some(obj) = json.get("critical_threshold").and_then(|v| v.as_object()) {
                                if let Some(num) = obj.get("value").and_then(|v| v.as_u64()) {
                                    critical_threshold = num as u8;
                                }
                            } else if let Some(num) = json.get("critical_threshold").and_then(|v| v.as_u64()) {
                                critical_threshold = num as u8;
                            }
                        }
                    }
                }
                
                let state_mutex = app.state::<Mutex<CooldownState>>();
                
                if battery.state != "charging" && battery.percentage <= low_threshold {
                    // Cooldown logic: alert every 5 minutes (300 seconds)
                    let mut state = state_mutex.lock().unwrap();
                    let should_alert = match state.last_alert {
                        Some(last) => last.elapsed() > Duration::from_secs(300),
                        None => true,
                    };
                    
                    if should_alert {
                        state.last_alert = Some(Instant::now());
                        
                        let event_payload = format!(
                            "{{\"percentage\": {}, \"is_critical\": {}}}", 
                            battery.percentage,
                            battery.percentage <= critical_threshold
                        );
                        
                        let _ = app.emit("trigger-alert", event_payload);
                    }
                } else if battery.state == "charging" {
                    // Reset cooldown when charging
                    let mut state = state_mutex.lock().unwrap();
                    state.last_alert = None;
                }
            }
        }
    });
}
