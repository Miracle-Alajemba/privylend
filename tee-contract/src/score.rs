use crate::exports::z::privylend::contracts::GenericInput;
use crate::host::interfaces::{kv_store, http_with_placeholders, logging};
use crate::vc_issue;
use serde_json::json;

pub fn score_credit_impl(req: GenericInput) -> Result<Vec<u8>, String> {
    // 1. Parse req.input as JSON to get documentType
    let input_bytes = req.input.unwrap_or_default();
    let input_json: serde_json::Value = serde_json::from_slice(&input_bytes).unwrap_or_default();
    let document_type = input_json
        .get("documentType")
        .and_then(|v| v.as_str())
        .unwrap_or("bank_statement");

    logging::log(
        logging::Level::Info,
        &format!("Processing credit scoring for documentType: {}", document_type),
    );

    // 2. Retrieve the scoring_endpoint from the KV store
    let mut endpoint = String::new();
    match kv_store::get("secrets", "scoring_endpoint") {
        Ok(Some(bytes)) => {
            if let Ok(endpoint_str) = String::from_utf8(bytes) {
                endpoint = endpoint_str;
            }
        }
        _ => {}
    }

    if endpoint.is_empty() {
        endpoint = "https://api.mockscoring.com/score".to_string();
        logging::log(
            logging::Level::Info,
            "scoring_endpoint not found in KV secrets map. Seeding fallback default...",
        );
        let _ = kv_store::set("secrets", "scoring_endpoint", endpoint.as_bytes());
    }

    logging::log(
        logging::Level::Info,
        &format!("Using scoring endpoint: {}", endpoint),
    );

    // 3. Formulate placeholders request
    // These resolve from the user's T3N profile inside the TEE via http-with-placeholders
    let body_str = format!(
        r#"{{"documentType":"{}","income":"{{{{profile.monthly_income}}}}","balance":"{{{{profile.account_balance}}}}"}}"#,
        document_type
    );
    let body_bytes = body_str.into_bytes();

    let headers = vec![("Content-Type".to_string(), "application/json".to_string())];

    logging::log(
        logging::Level::Info,
        "Sending request to scoring endpoint with T3N placeholders...",
    );

    let mut income_score = 80.0;
    let mut balance_score = 75.0;

    match http_with_placeholders::send(&endpoint, "POST", &headers, Some(&body_bytes)) {
        Ok(resp) => {
            logging::log(
                logging::Level::Info,
                &format!("Received response from scoring endpoint. Status: {}", resp.status),
            );
            if let Ok(resp_json) = serde_json::from_slice::<serde_json::Value>(&resp.body) {
                // If the mock endpoint returned actual scores (or placeholder-resolved mock scores)
                if let Some(inc) = resp_json.get("income_score").and_then(|v| v.as_f64()) {
                    income_score = inc;
                } else if let Some(inc_str) = resp_json.get("income").and_then(|v| v.as_str()) {
                    // Try parsing from string (if returned as raw placeholder replacement)
                    if let Ok(inc_val) = inc_str.parse::<f64>() {
                        // Assuming income maps to a score out of 100
                        income_score = (inc_val / 100.0).min(100.0);
                    }
                }

                if let Some(bal) = resp_json.get("balance_score").and_then(|v| v.as_f64()) {
                    balance_score = bal;
                } else if let Some(bal_str) = resp_json.get("balance").and_then(|v| v.as_str()) {
                    if let Ok(bal_val) = bal_str.parse::<f64>() {
                        balance_score = (bal_val / 100.0).min(100.0);
                    }
                }
            }
        }
        Err(e) => {
            logging::log(
                logging::Level::Error,
                &format!("Failed to execute http-with-placeholders: {}. Using fallback mock scores.", e),
            );
        }
    }

    // 4. Run simple scoring algorithm: score = min(100, (income_score * 0.6) + (balance_score * 0.4))
    let final_score_f64 = (income_score * 0.6 + balance_score * 0.4).min(100.0);
    let score = final_score_f64 as u32;

    // 5. Assign tier: A = score >= 75, B = score >= 50, C = below 50
    let tier = if score >= 75 {
        "A"
    } else if score >= 50 {
        "B"
    } else {
        "C"
    };

    // Assign max loan amount based on tier
    let max_loan = if score >= 75 {
        10000
    } else if score >= 50 {
        5000
    } else {
        1000
    };

    logging::log(
        logging::Level::Info,
        &format!("Calculated score: {}, Tier: {}, Max Loan: {}", score, tier, max_loan),
    );

    // 6. Generate core response to compute hash
    let core_result = json!({
        "tier": tier,
        "score": score,
        "maxLoan": max_loan
    });
    let core_bytes = serde_json::to_vec(&core_result).map_err(|e| e.to_string())?;

    // Hash the core result bytes
    let hash_bytes = vc_issue::compute_hash(&core_bytes);
    let vc_hash = hex::encode(hash_bytes);

    // 7. Return final response with hash
    let final_result = json!({
        "tier": tier,
        "score": score,
        "maxLoan": max_loan,
        "vcHash": vc_hash
    });

    let final_bytes = serde_json::to_vec(&final_result).map_err(|e| e.to_string())?;
    Ok(final_bytes)
}
