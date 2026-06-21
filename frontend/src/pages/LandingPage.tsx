import React from "react";
import { WalletConnect } from "../components/WalletConnect";
import { ShieldCheck, Cpu, Coins, ArrowRight } from "lucide-react";

interface LandingPageProps {
  address: string | null;
  isConnected: boolean;
  error: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  onNext: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  address,
  isConnected,
  error,
  connectWallet,
  disconnectWallet,
  onNext,
}) => {
  const steps = [
    {
      title: "1. Connect Wallet",
      desc: "Connect your MetaMask wallet to Celo Alfajores testnet to authenticate your session.",
      icon: Coins,
      color: "text-amber-400 bg-amber-500/5 border-amber-800/30",
    },
    {
      title: "2. Ingest Document",
      desc: "Upload bank statements or payslips privately. PII details resolve only inside TEE enclaves.",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/5 border-emerald-800/30",
    },
    {
      title: "3. TEE Credit Scoring",
      desc: "The Rust WASM contract calculates your rating and issues a Verifiable Credential on-chain.",
      icon: Cpu,
      color: "text-blue-400 bg-blue-500/5 border-blue-800/30",
    },
  ];

  return (
    <div className="flex flex-col items-center max-w-xl text-center space-y-8 animate-fade-in py-8">
      {/* Title Header */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-celo-gold via-slate-100 to-celo-green bg-clip-text text-transparent">
          PrivyLend
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Privacy-First DeFi Credit Scoring Agent on Celo using Terminal 3 enclaves.
        </p>
      </div>

      {/* Steps Explanation */}
      <div className="grid grid-cols-1 gap-4 w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-start space-x-4 border rounded-xl p-4 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${step.color}`}
          >
            <div className="p-2.5 rounded-lg border bg-slate-900/40">
              <step.icon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-200 font-bold text-sm tracking-wide">{step.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3 backdrop-blur-md w-full">
        <h4 className="text-xs font-bold uppercase tracking-wider text-celo-gold flex items-center space-x-1.5">
          <span>The Problem & Solution</span>
        </h4>
        <p className="text-slate-300 text-xs leading-relaxed">
          DeFi credit checks usually require handing over highly sensitive financial files (like bank statements or payslips), exposing private transactions to third-party databases. 
        </p>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          <strong>PrivyLend</strong> resolves this by processing files locally inside a hardware-secured TEE enclave, resolving sensitive metrics (such as income or balance) via private placeholders. Lenders get cryptographic proof of your credit tier, while your raw PII details remain 100% confidential.
        </p>
      </div>

      {/* Wallet Connection / Next Trigger */}
      <div className="pt-2 space-y-4">
        <WalletConnect
          address={address}
          isConnected={isConnected}
          error={error}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />

        {isConnected && (
          <button
            onClick={onNext}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-500 font-semibold px-6 py-3 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 animate-pulse"
          >
            <span>Proceed to Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
