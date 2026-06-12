import { T3nClient, TenantClient, loadWasmComponent, createEthAuthInput, eth_get_address, metamask_sign, setEnvironment } from "@terminal3/t3n-sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_T3N_API_KEY;
if (!API_KEY || API_KEY === "your_key_here") {
  console.error("Error: VITE_T3N_API_KEY is not configured in .env file.");
  process.exit(1);
}

const WASM_PATH = path.join(__dirname, "../tee-contract/target/wasm32-wasip2/release/z_privylend.wasm");

async function main() {
  console.log("Initializing Contract Registration...");
  setEnvironment("testnet");

  if (!fs.existsSync(WASM_PATH)) {
    console.error(`WASM file not found at: ${WASM_PATH}`);
    console.error("Please run: cargo build --target wasm32-wasip2 --release in the tee-contract directory first.");
    process.exit(1);
  }

  const wasmBytes = fs.readFileSync(WASM_PATH);
  console.log(`Loaded WASM bytes: ${wasmBytes.length} bytes`);

  const address = eth_get_address(API_KEY!);
  const wasmComponent = await loadWasmComponent();
  const client = new T3nClient({
    wasmComponent,
    handlers: {
      EthSign: metamask_sign(address, undefined, API_KEY),
    },
  });

  await client.handshake();
  const did = await client.authenticate(createEthAuthInput(address));
  const tenantDid = did.value;

  const tenant = new TenantClient({
    t3n: client,
    tenantDid,
  });

  console.log("Registering WASM contract on T3n...");
  try {
    const result = await tenant.contracts.register({
      tail: "privylend-contract",
      version: "0.1.0",
      wasm: new Uint8Array(wasmBytes),
    });
    console.log("Contract registered successfully! Result:", result);
  } catch (err: any) {
    console.error("Failed to register contract:", err.message || err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Registration failed:", err);
  process.exit(1);
});
