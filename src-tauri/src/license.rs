use serde::{Deserialize, Serialize};
use reqwest::Client;

#[derive(Serialize)]
struct ValidateLicenseRequest {
    license_key: String,
}

#[derive(Deserialize, Debug)]
struct ValidateLicenseResponse {
    // Dodo Payments typically returns a boolean 'valid' field in its public validation endpoint
    valid: bool,
}

pub async fn verify_dodo_license(key: &str) -> Result<bool, String> {
    let client = Client::new();
    
    // Using Dodo Payments public license validation API
    let url = "https://live.dodopayments.com/api/licenses/validate"; // Base endpoint can be adjusted based on Dodo's exact API docs
    
    let res = client
        .post(url)
        .json(&ValidateLicenseRequest {
            license_key: key.to_string(),
        })
        .send()
        .await
        .map_err(|e| format!("Network error connecting to validation server: {}", e))?;

    if res.status().is_success() {
        let json_result = res.json::<ValidateLicenseResponse>().await;
        
        match json_result {
            Ok(data) => Ok(data.valid),
            Err(e) => Err(format!("Failed to parse response: {}", e)),
        }
    } else {
        // If it's a 4xx or 5xx, it might be an invalid key or server error
        Err(format!("License server returned error: {}", res.status()))
    }
}

// Fallback logic for Lemon Squeezy (pending approval)
pub async fn verify_lemon_squeezy_license(_key: &str) -> Result<bool, String> {
    // Implement Lemon Squeezy API call here later
    // For now, return false
    Ok(false)
}
