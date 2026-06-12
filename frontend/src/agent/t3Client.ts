import { T3nClient, setEnvironment, loadWasmComponent,
  eth_get_address, metamask_sign, createEthAuthInput } from "@terminal3/t3n-sdk";

setEnvironment("testnet");
const API_KEY = import.meta.env.VITE_T3N_API_KEY || "";
const address = API_KEY ? eth_get_address(API_KEY) : "";

export async function createT3Client() {
  if (!API_KEY) {
    throw new Error("VITE_T3N_API_KEY is not set in frontend .env config");
  }

  const wasmComponent = await loadWasmComponent();
  const client = new T3nClient({
    wasmComponent,
    handlers: { EthSign: metamask_sign(address, undefined, API_KEY) },
  });
  await client.handshake();
  const did = await client.authenticate(createEthAuthInput(address));
  return { client, tenantDid: did.value };
}
