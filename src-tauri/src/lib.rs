mod battery;
mod tray;
mod rules;

use std::sync::Mutex;
use tauri::Manager;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct ValidateRequest {
    license_key: String,
    instance_name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ActivateResponseMeta {
    store_id: u64,
}

#[derive(Serialize, Deserialize, Debug)]
struct ActivateResponse {
    activated: bool,
    error: Option<String>,
    meta: Option<ActivateResponseMeta>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_battery_status() -> Result<battery::BatteryStatus, String> {
    battery::get_status()
}

#[tauri::command]
fn get_advanced_info() -> Result<battery::AdvancedHardwareInfo, String> {
    battery::get_advanced_info()
}

#[tauri::command]
fn get_charging_control_info() -> Result<battery::ChargingControlInfo, String> {
    battery::get_charging_control_info()
}

#[tauri::command]
fn apply_charging_settings(limit_80: bool, smart_discharge: bool) -> Result<(), String> {
    battery::apply_charging_settings(limit_80, smart_discharge)
}

#[tauri::command]
async fn validate_license(key: String, instance_name: String) -> Result<bool, String> {
    let client = reqwest::Client::new();
    
    // --- 1. TRY DODO PAYMENTS (LIVE MODE) ---
    // Use /activate instead of /validate to actually consume a seat limit!
    let dodo_live = client
        .post("https://live.dodopayments.com/licenses/activate")
        .json(&serde_json::json!({ 
            "license_key": key.clone(),
            "name": instance_name.clone()
        }))
        .send()
        .await;

    if let Ok(res) = dodo_live {
        if res.status().is_success() {
            #[derive(serde::Deserialize)]
            struct DodoResponse { id: Option<String> }
            if let Ok(json) = res.json::<DodoResponse>().await {
                if json.id.is_some() { return Ok(true); }
            }
        } else if res.status() == reqwest::StatusCode::UNPROCESSABLE_ENTITY {
            return Err("License key activation limit reached.".to_string());
        }
    }

    // --- 2. TRY DODO PAYMENTS (TEST MODE) ---
    let dodo_test = client
        .post("https://test.dodopayments.com/licenses/activate")
        .json(&serde_json::json!({ 
            "license_key": key.clone(),
            "name": instance_name.clone()
        }))
        .send()
        .await;

    if let Ok(res) = dodo_test {
        if res.status().is_success() {
            #[derive(serde::Deserialize)]
            struct DodoResponse { id: Option<String> }
            if let Ok(json) = res.json::<DodoResponse>().await {
                if json.id.is_some() { return Ok(true); }
            }
        } else if res.status() == reqwest::StatusCode::UNPROCESSABLE_ENTITY {
            return Err("License key activation limit reached.".to_string());
        }
    }

    // --- 3. FALLBACK TO LEMON SQUEEZY ---
    // If Dodo fails (e.g. key format invalid, or just not a Dodo key), try Lemon Squeezy
    let res = client
        .post("https://api.lemonsqueezy.com/v1/licenses/activate")
        .header("Accept", "application/json")
        .json(&ValidateRequest {
            license_key: key.clone(),
            instance_name,
        })
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if res.status().is_success() || res.status() == reqwest::StatusCode::NOT_FOUND || res.status() == reqwest::StatusCode::BAD_REQUEST {
        let json_res: ActivateResponse = res.json().await.map_err(|e| format!("Failed to parse response: {}", e))?;
        if json_res.activated {
            // SECURITY CHECK: Verify this license belongs to OUR store
            let expected_store_id: u64 = 12345; // Update if using Lemon Squeezy
            
            if let Some(meta) = json_res.meta {
                if meta.store_id != expected_store_id && expected_store_id != 12345 {
                    return Err("Invalid license key for this product.".to_string());
                }
            }
            Ok(true)
        } else {
            Err(json_res.error.unwrap_or_else(|| "Failed to activate license key".to_string()))
        }
    } else {
        Err(format!("HTTP Error: {}", res.status()))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_aptabase::Builder::new("A-US-1652133515").build())
        .plugin(tauri_plugin_process::init())
        .manage(Mutex::new(rules::CooldownState::new()))
        .setup(|app| {
            #[cfg(desktop)]
            let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
            #[cfg(target_os = "macos")]
            let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);

            tray::create_tray(app.handle())?;
            rules::start_rule_engine(app.handle().clone());
            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                if window.is_fullscreen().unwrap_or(false) {
                    let _ = window.set_fullscreen(false);
                }
                let _ = window.hide();
                #[cfg(target_os = "macos")]
                let _ = window.app_handle().set_activation_policy(tauri::ActivationPolicy::Accessory);
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_battery_status,
            get_advanced_info,
            get_charging_control_info,
            apply_charging_settings,
            validate_license
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| {
            match event {
                #[cfg(target_os = "macos")]
                tauri::RunEvent::Reopen { .. } => {
                    if let Some(window) = app_handle.get_webview_window("main") {
                        #[cfg(target_os = "macos")]
                        {
                            let _ = app_handle.set_activation_policy(tauri::ActivationPolicy::Regular);
                            let _ = app_handle.show();
                        }
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                tauri::RunEvent::ExitRequested { api, .. } => {
                    // Prevent exit on Cmd+Q or Dock Quit so it runs in background
                    api.prevent_exit();
                }
                _ => {}
            }
        });
}
