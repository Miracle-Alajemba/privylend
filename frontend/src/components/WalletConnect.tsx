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
    <div className="flex flex-col items-start w-full">
      {isConnected && address ? (
        <div className="flex items-center space-x-3 bg-[#0F1115]/90 backdrop-blur-xl border border-slate-800 rounded-2xl px-4 py-3 shadow-lg w-full max-w-sm justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-celo-green rounded-full shadow-[0_0_8px_#35D07F]" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-celo-green rounded-full animate-ping opacity-75" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Celo Alfajores</span>
              <span className="text-slate-200 font-mono text-xs font-semibold">{formatAddress(address)}</span>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/5 p-2 rounded-xl border border-transparent hover:border-red-500/10 transition-all duration-200"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="group relative flex items-center justify-center space-x-2.5 bg-gradient-to-r from-celo-gold to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-4 rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
        >
          <Wallet className="w-4 h-4 text-slate-950 transition-transform group-hover:scale-110" />
          <span className="text-sm font-extrabold tracking-wide">Connect MetaMask</span>
        </button>
      )}

      {error && (
        <div className="mt-4 flex items-start space-x-2.5 bg-red-950/20 border border-red-900/30 rounded-xl p-3.5 text-red-400 text-xs w-full max-w-sm shadow-md">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

