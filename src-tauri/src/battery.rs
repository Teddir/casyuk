use serde::Serialize;
use battery::Manager;

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
        // state_of_charge is a ratio from 0.0 to 1.0
        let percentage = (battery.state_of_charge().value * 100.0).round() as u8;
        
        // state_of_health is a ratio from 0.0 to 1.0
        let health = (battery.state_of_health().value * 100.0).round() as u8;
        
        let cycle_count = battery.cycle_count().unwrap_or(0);
        
        let state = match battery.state() {
            battery::State::Charging => "charging",
            battery::State::Discharging => "discharging",
            battery::State::Empty => "empty",
            battery::State::Full => "full",
            battery::State::Unknown => "unknown",
            _ => "unknown", // To be safe with future versions
        }.to_string();

        Ok(BatteryStatus {
            percentage,
            state,
            health,
            cycle_count,
        })
    } else {
        Err("No battery found on this system".to_string())
    }
}
