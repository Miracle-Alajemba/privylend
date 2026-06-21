import { useState, useEffect, useCallback } from "react";
import { switchNetworkToCelo } from "../utils/celoClient";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (err: any) {
      console.error("Failed to check wallet connection:", err);
    }
  }, []);

  const connectWallet = async () => {
    setError(null);
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      if (import.meta.env.DEV || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        console.log("MetaMask not detected in dev environment. Using mock bypass wallet.");
        setAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        setIsConnected(true);
        return;
      }
      setError("Please install MetaMask to proceed.");
      return;
    }

    try {
      // 1. Request account access
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // 2. Switch network to Celo Alfajores
      const switched = await switchNetworkToCelo();
      if (!switched) {
        setError("Please switch to the Celo Alfajores network.");
        return;
      }

      setAddress(accounts[0]);
      setIsConnected(true);
    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      setError(err.message || "Failed to connect wallet.");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
  };

  useEffect(() => {
    checkConnection();

    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      };

      const handleChainChanged = () => {
        // Reload page on network change as standard ethers.js recommendation
        window.location.reload();
      };

      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);

      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkConnection]);

  return {
    address,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
  };
}
