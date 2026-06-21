import {
  T3nClient,
  setEnvironment,
  loadWasmComponent,
  eth_get_address,
  metamask_sign,
  createEthAuthInput,
} from "@terminal3/t3n-sdk";

setEnvironment("testnet");

export async function createT3Client() {
  const API_KEY = import.meta.env.VITE_T3N_API_KEY || "";
  if (!API_KEY || API_KEY === "your_key_here") {
    throw new Error("VITE_T3N_API_KEY is not configured in .env file.");
  }

  let address = "";
  try {
    address = eth_get_address(API_KEY);
  } catch (err: any) {
    throw new Error("Invalid VITE_T3N_API_KEY: " + err.message);
  }

  const wasmComponent = await loadWasmComponent();

  const client = new T3nClient({
    wasmComponent,
    handlers: {
      EthSign: async (msg: any) => {
        const tempEth = (window as any).ethereum;
        try {
          if (tempEth) {
            (window as any).ethereum = undefined;
          }
          const signFn = metamask_sign(address, undefined, API_KEY);
          return await signFn(msg);
        } finally {
          if (tempEth) {
            (window as any).ethereum = tempEth;
          }
        }
      },
    },
  });

  // Handshake must complete before authenticate
  await client.handshake();

  // Small delay to let the session establish
  await new Promise(resolve => setTimeout(resolve, 500));

  const did = await client.authenticate(createEthAuthInput(address));

  if (!did || !did.value) {
    throw new Error("Authentication failed: no DID returned from T3N");
  }

  return { client, tenantDid: did.value, address };
}
