import { T3nClient, TenantClient, loadWasmComponent, createEthAuthInput, eth_get_address, metamask_sign, setEnvironment } from "@terminal3/t3n-sdk";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();

const API_KEY = process.env.VITE_T3N_API_KEY;
if (!API_KEY || API_KEY === "your_key_here") {
  console.error("Error: VITE_T3N_API_KEY is not configured in .env file.");
  process.exit(1);
}

async function main() {
  console.log("Initializing T3 Tenant Setup...");
  setEnvironment("testnet");

  const address = eth_get_address(API_KEY!);
  console.log(`Using Ethereum Address: ${address}`);

  const wasmComponent = await loadWasmComponent();
  const client = new T3nClient({
    wasmComponent,
    handlers: {
      EthSign: metamask_sign(address, undefined, API_KEY),
    },
  });

  console.log("Performing handshake with T3n Node...");
  await client.handshake();

  console.log("Authenticating...");
  const authInput = createEthAuthInput(address);
  const did = await client.authenticate(authInput);
  const tenantDid = did.value;
  console.log(`Tenant Authenticated successfully. DID: ${tenantDid}`);

  const tenant = new TenantClient({
    t3n: client,
    tenantDid,
    baseUrl: "https://cn-api.sg.testnet.t3n.terminal3.io",
  });

  console.log("Claiming Tenant DID...");
  try {
    await tenant.tenant.claim();
    console.log("Tenant DID claimed successfully.");
  } catch (err: any) {
    console.log("Tenant claim returned (might already be claimed):", err.message || err);
  }

  console.log("Creating KV secrets map...");
  try {
    await tenant.maps.create({
      tail: "secrets",
      visibility: "private",
      writers: "all",
      readers: "all",
    });
    console.log("KV Map 'secrets' created successfully.");
  } catch (err: any) {
    console.log("KV Map creation returned (might already exist):", err.message || err);
  }

  console.log("Attempting to seed scoring_endpoint into secrets map...");
  const endpoint = "https://api.mockscoring.com/score";
  try {
    // Attempt to write using 'map-set'
    await tenant.executeControl("map-set", {
      map_name: "secrets",
      key: "scoring_endpoint",
      value: endpoint,
    });
    console.log(`Successfully seeded scoring_endpoint = '${endpoint}' via control plane 'map-set'.`);
  } catch (err: any) {
    console.warn("Notice: Control plane seeding failed or is unsupported:", err.message || err);
    console.log("The WASM TEE contract will self-seed this endpoint on execution if the KV key is missing.");
  }

  console.log("Tenant Setup Complete!");
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
