import { BrowserProvider, JsonRpcProvider } from "ethers";

const CELO_RPC = import.meta.env.VITE_CELO_RPC || "https://alfajores-forno.celo-testnet.org";

// Alfajores Testnet specifications
export const CELO_ALFAJORES_CHAIN_ID = 44787; // 0xaf33

export const celoRpcProvider = new JsonRpcProvider(CELO_RPC);

export function getBrowserProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new BrowserProvider((window as any).ethereum);
  }
  return null;
}

export async function switchNetworkToCelo() {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return false;

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CELO_ALFAJORES_CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // If the chain hasn't been added yet, add it
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${CELO_ALFAJORES_CHAIN_ID.toString(16)}`,
              chainName: "Celo Alfajores Testnet",
              nativeCurrency: {
                name: "CELO",
                symbol: "CELO",
                decimals: 18,
              },
              rpcUrls: [CELO_RPC],
              blockExplorerUrls: ["https://alfajores.celoscan.io"],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add Celo Alfajores network to Metamask:", addError);
        return false;
      }
    }
    console.error("Failed to switch Celo Alfajores network:", switchError);
    return false;
  }
}
