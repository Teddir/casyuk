mod battery;
mod tray;
mod rules;

use std::sync::Mutex;
use tauri::Manager;

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
            let _ = app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            
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
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_battery_status,
            get_advanced_info,
            get_charging_control_info,
            apply_charging_settings
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| {
            match event {
                tauri::RunEvent::Reopen { .. } => {
                    if let Some(window) = app_handle.get_webview_window("main") {
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
