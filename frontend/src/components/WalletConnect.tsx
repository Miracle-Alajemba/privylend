import React from "react";
import { formatAddress } from "../utils/formatters";
import { Wallet, LogOut, ShieldAlert } from "lucide-react";

interface WalletConnectProps {
  address: string | null;
  isConnected: boolean;
  error: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  address,
  isConnected,
  error,
  connectWallet,
  disconnectWallet,
}) => {
  return (
    <div className="flex flex-col items-center">
      {isConnected && address ? (
        <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-full px-5 py-2">
          <div className="w-2.5 h-2.5 bg-celo-green rounded-full animate-pulse" />
          <span className="text-slate-300 font-medium text-sm">{formatAddress(address)}</span>
          <button
            onClick={disconnectWallet}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="flex items-center space-x-2 bg-gradient-to-r from-celo-gold to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-semibold px-6 py-3 rounded-full shadow-lg shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect MetaMask</span>
        </button>
      )}

      {error && (
        <div className="mt-4 flex items-center space-x-2 bg-red-950/50 border border-red-800/50 rounded-lg p-3 text-red-300 text-sm max-w-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
