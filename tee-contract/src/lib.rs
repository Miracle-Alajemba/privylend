wit_bindgen::generate!({
    world: "privylend",
    path: "wit",
    with: {
        "host:tenant/tenant-context@1.0.0": generate,
        "host:interfaces/logging@2.1.0": generate,
        "host:interfaces/kv-store@2.1.0": generate,
        "host:interfaces/http-with-placeholders@2.1.0": generate,
    }
});

mod score;
mod vc_issue;

struct PrivyLend;

impl exports::z::privylend::contracts::Guest for PrivyLend {
    fn score_credit(req: exports::z::privylend::contracts::GenericInput) -> Result<Vec<u8>, String> {
        score::score_credit_impl(req)
    }
}

export!(PrivyLend);
