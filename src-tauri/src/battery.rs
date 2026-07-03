#![allow(unused_imports, unused_mut, unused_variables, dead_code)]
use serde::Serialize;
use battery::Manager;
use std::process::Command;

#[derive(Serialize)]
pub struct BatteryStatus {
    pub percentage: u8,
    pub state: String,
    pub health: u8,
    pub cycle_count: u32,
}

pub fn get_status() -> Result<BatteryStatus, String> {
    let manager = Manager::new().map_err(|e| e.to_string())?;
    let mut batteries = manager.batteries().map_err(|e| e.to_string())?;
    
    if let Some(Ok(battery)) = batteries.next() {
        let percentage = (battery.state_of_charge().value * 100.0).round() as u8;
        let mut health = (battery.state_of_health().value * 100.0).round() as u8;
        
        #[cfg(target_os = "macos")]
        if health < 10 {
            if let Ok(output) = std::process::Command::new("ioreg").args(["-r", "-c", "AppleSmartBattery"]).output() {
                let stdout = String::from_utf8_lossy(&output.stdout);
                let mut raw_max = 0.0;
                let mut design = 0.0;
                for line in stdout.lines() {
                    if line.contains("\"AppleRawMaxCapacity\"") {
                        if let Some(val) = line.split('=').nth(1) {
                            raw_max = val.trim().parse().unwrap_or(0.0);
                        }
                    } else if line.contains("\"DesignCapacity\"") {
                        if let Some(val) = line.split('=').nth(1) {
                            design = val.trim().parse().unwrap_or(0.0);
                        }
                    }
                }
                if design > 0.0 && raw_max > 0.0 {
                    health = f64::round((raw_max / design) * 100.0) as u8;
                }
            }
        }

        let cycle_count = battery.cycle_count().unwrap_or(0);
        
        let state = match battery.state() {
            battery::State::Charging => "charging",
            battery::State::Discharging => "discharging",
            battery::State::Empty => "empty",
            battery::State::Full => "full",
            battery::State::Unknown => "unknown",
            _ => "unknown",
        }.to_string();

        Ok(BatteryStatus { percentage, state, health, cycle_count })
    } else {
        Err("No battery found on this system".to_string())
    }
}

#[derive(Serialize)]
pub struct AdvancedHardwareInfo {
    pub technology: String,
    pub temperature: String,
    pub design_capacity: String,
    pub serial_number: String,
}

pub fn get_advanced_info() -> Result<AdvancedHardwareInfo, String> {
    #[cfg(target_os = "macos")]
    {
        let output = Command::new("ioreg")
            .args(["-r", "-c", "AppleSmartBattery"])
            .output()
            .map_err(|e| e.to_string())?;
            
        let stdout = String::from_utf8_lossy(&output.stdout);
        
        let mut temp = String::from("N/A");
        let mut design_cap = String::from("N/A");
        let mut serial = String::from("N/A");
        
        for line in stdout.lines() {
            if line.contains("\"Temperature\"") {
                if let Some(val) = line.split('=').nth(1) {
                    let t: f64 = val.trim().parse().unwrap_or(0.0);
                    temp = format!("{:.1}°C", t / 100.0);
                }
            }
            if line.contains("\"DesignCapacity\"") {
                if let Some(val) = line.split('=').nth(1) {
                    design_cap = format!("{} mAh", val.trim());
                }
            }
        }
        
        if let Some(idx) = stdout.find("\"Serial\"=\"") {
            let start = idx + 10;
            if let Some(end) = stdout[start..].find('"') {
                serial = stdout[start..start+end].to_string();
            }
        }
        
        Ok(AdvancedHardwareInfo {
            technology: "Lithium-Ion".to_string(),
            temperature: temp,
            design_capacity: design_cap,
            serial_number: serial,
        })
    }

    #[cfg(target_os = "windows")]
    {
        let mut design_cap = String::from("N/A");
        if let Ok(out) = std::process::Command::new("powershell").args(["-Command", "(Get-WmiObject Win32_Battery).DesignCapacity"]).output() {
            let stdout = String::from_utf8_lossy(&out.stdout);
            if let Some(val) = stdout.lines().next() {
                if !val.trim().is_empty() {
                    design_cap = format!("{} mWh", val.trim());
                }
            }
        }
        
        Ok(AdvancedHardwareInfo {
            technology: "Lithium-Ion (WMI)".to_string(),
            temperature: "N/A".to_string(), 
            design_capacity: design_cap,
            serial_number: "N/A".to_string(),
        })
    }

    #[cfg(target_os = "linux")]
    {
        let mut temp = String::from("N/A");
        let mut design_cap = String::from("N/A");
        let mut serial = String::from("N/A");
        let mut tech = String::from("N/A");
        
        if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/BAT0/temp") {
            if let Ok(t) = content.trim().parse::<f64>() {
                temp = format!("{:.1}°C", t / 10.0);
            }
        }
        
        if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/BAT0/energy_full_design") {
            if let Ok(e) = content.trim().parse::<f64>() {
                design_cap = format!("{} uWh", e);
            }
        } else if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/BAT0/charge_full_design") {
            if let Ok(c) = content.trim().parse::<f64>() {
                design_cap = format!("{} uAh", c);
            }
        }
        
        if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/BAT0/serial_number") {
            serial = content.trim().to_string();
        }
        
        if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/BAT0/technology") {
            tech = content.trim().to_string();
        }

        Ok(AdvancedHardwareInfo {
            technology: tech,
            temperature: temp,
            design_capacity: design_cap,
            serial_number: serial,
        })
    }
}

#[derive(Serialize)]
pub struct ChargingControlInfo {
    pub source_type: String,
    pub current_draw: String,
    pub adapter_wattage: String,
    pub time_to_full: String,
}

pub fn get_charging_control_info() -> Result<ChargingControlInfo, String> {
    #[cfg(target_os = "macos")]
    {
        let ioreg = Command::new("ioreg")
            .args(["-r", "-c", "AppleSmartBattery"])
            .output()
            .map_err(|e| e.to_string())?;
        let ioreg_str = String::from_utf8_lossy(&ioreg.stdout);
        
        let mut amperage = 0.0;
        let mut time_to_full = String::from("N/A");
        
        for line in ioreg_str.lines() {
            if line.contains("\"Amperage\"") {
                if let Some(val) = line.split('=').nth(1) {
                    amperage = val.trim().parse().unwrap_or(0.0);
                }
            }
            if line.contains("\"TimeRemaining\"") {
                 if let Some(val) = line.split('=').nth(1) {
                     let mins: i32 = val.trim().parse().unwrap_or(0);
                     if mins > 0 && mins < 1000 {
                         time_to_full = format!("{}h {}m", mins / 60, mins % 60);
                     }
                 }
            }
        }
        
        let sp = Command::new("system_profiler")
            .arg("SPPowerDataType")
            .output()
            .map_err(|e| e.to_string())?;
        let sp_str = String::from_utf8_lossy(&sp.stdout);
        
        let mut wattage = String::from("Not Connected");
        let mut source = String::from("Internal Battery");
        
        if sp_str.contains("Connected: Yes") {
            source = String::from("AC Power");
            for line in sp_str.lines() {
                if line.contains("Wattage (W):") {
                    if let Some(val) = line.split(':').nth(1) {
                        wattage = format!("{} W", val.trim());
                    }
                }
            }
        }
        
        Ok(ChargingControlInfo {
            source_type: source,
            current_draw: format!("{:.2} A", f64::abs(amperage / 1000.0)),
            adapter_wattage: wattage,
            time_to_full,
        })
    }

    #[cfg(target_os = "windows")]
    {
        let mut source = String::from("Battery");
        
        if let Ok(out) = std::process::Command::new("powershell").args(["-Command", "(Get-WmiObject Win32_Battery).BatteryStatus"]).output() {
            let stdout = String::from_utf8_lossy(&out.stdout);
            let val = stdout.trim();
            if val == "2" {
                source = "AC Power".to_string();
            }
        }

        Ok(ChargingControlInfo {
            source_type: source,
            current_draw: "N/A".to_string(),
            adapter_wattage: "N/A".to_string(),
            time_to_full: "N/A".to_string(),
        })
    }

    #[cfg(target_os = "linux")]
    {
        let mut current_draw = String::from("N/A");
        let mut source = String::from("Battery");
        
        if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/BAT0/current_now") {
            if let Ok(c) = content.trim().parse::<f64>() {
                current_draw = format!("{:.2} A", c / 1_000_000.0);
            }
        }
        
        if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/AC/online") {
            if content.trim() == "1" {
                source = String::from("AC Power");
            }
        } else if let Ok(content) = std::fs::read_to_string("/sys/class/power_supply/ACAD/online") {
            if content.trim() == "1" {
                source = String::from("AC Power");
            }
        }

        Ok(ChargingControlInfo {
            source_type: source,
            current_draw,
            adapter_wattage: "N/A".to_string(),
            time_to_full: "N/A".to_string(),
        })
    }
}

pub fn apply_charging_settings(limit_80: bool, _smart_discharge: bool) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        let val = if limit_80 { "80" } else { "100" };
        
        let check = Command::new("which").arg("bclm").output();
        if let Ok(out) = check {
            if out.stdout.is_empty() {
                return Err("System requirement missing: 'bclm' is not installed. Please install it using Homebrew:\n\nbrew tap zackelia/formulae && brew install bclm".to_string());
            }
        } else {
            return Err("Failed to check for bclm on this system.".to_string());
        }
        
        let script = format!("do shell script \"/opt/homebrew/bin/bclm write {} || /usr/local/bin/bclm write {}\" with administrator privileges", val, val);
        
        let status = Command::new("osascript")
            .args(["-e", &script])
            .status()
            .map_err(|e| e.to_string())?;
            
        if status.success() {
            // Apply it immediately
            let persist = format!("do shell script \"/opt/homebrew/bin/bclm persist || /usr/local/bin/bclm persist\" with administrator privileges");
            let _ = Command::new("osascript").args(["-e", &persist]).status();
            Ok(())
        } else {
            Err("Failed to apply charging limit. Administrator privileges are required.".to_string())
        }
    }

    #[cfg(target_os = "windows")]
    {
        Err("Charging limit control is not natively supported on Windows. Requires proprietary vendor drivers (e.g., Lenovo Vantage, MyASUS).".to_string())
    }

    #[cfg(target_os = "linux")]
    {
        Err("Charging limit control on Linux requires modifying /sys/class/power_supply as root or via kernel modules (e.g. thinkpad_acpi).".to_string())
    }
}
