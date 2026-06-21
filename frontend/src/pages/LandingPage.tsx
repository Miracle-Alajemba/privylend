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
    <div className="flex flex-col md:flex-row items-stretch justify-center w-full max-w-5xl gap-8 animate-fade-in py-4 md:py-8 px-2 md:px-6">
      
      {/* Left Column: Title, About, and Wallet Connect */}
      <div className="flex flex-col justify-between flex-1 space-y-6 max-w-md">
        
        {/* Title Header */}
        <div className="text-left space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-celo-gold via-slate-100 to-celo-green bg-clip-text text-transparent">
            PrivyLend
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Privacy-First DeFi Credit Scoring Agent on Celo using Terminal 3 enclaves.
          </p>
        </div>

        {/* About Section */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3 backdrop-blur-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-celo-gold flex items-center space-x-1.5">
            <span>The Problem & Solution</span>
          </h4>
          <p className="text-slate-300 text-xs leading-relaxed">
            DeFi credit checks usually require handing over highly sensitive financial files (like bank statements or payslips), exposing private transactions to third-party databases. 
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            <strong>PrivyLend</strong> resolves this by processing files locally inside a hardware-secured TEE enclave, resolving sensitive metrics (such as income or balance) via private placeholders. Lenders get cryptographic proof of your credit tier, while your PII details remain 100% confidential.
          </p>
        </div>

        {/* Wallet Connection / Next Trigger */}
        <div className="pt-2 flex flex-col items-start space-y-4">
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
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-6 py-3.5 rounded-full shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Proceed to Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Steps */}
      <div className="flex flex-col justify-center flex-1 space-y-4 max-w-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-left px-1">How it Works</h4>
        <div className="flex flex-col gap-4 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 border rounded-xl p-4 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 ${step.color}`}
            >
              <div className="p-2.5 rounded-lg border bg-slate-900/40 flex-shrink-0">
                <step.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-slate-200 font-bold text-xs md:text-sm tracking-wide">{step.title}</h3>
                <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
