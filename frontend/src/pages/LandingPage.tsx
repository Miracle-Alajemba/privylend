import React from "react";
import { WalletConnect } from "../components/WalletConnect";
import { ShieldCheck, Cpu, Coins, ArrowRight, ShieldAlert, BadgeCheck } from "lucide-react";

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
      title: "1. Link Wallet",
      desc: "Connect your wallet to Celo Alfajores Testnet to authenticate your secure session.",
      icon: Coins,
      color: "border-slate-800/80 hover:border-amber-500/40 text-amber-400 hover:shadow-[0_0_20px_rgba(251,204,92,0.08)] bg-slate-900/10",
      badge: "Step 1"
    },
    {
      title: "2. Private Document Ingestion",
      desc: "Upload bank statements or payslips. Your sensitive data is processed only inside the secure enclave.",
      icon: ShieldCheck,
      color: "border-slate-800/80 hover:border-emerald-500/40 text-emerald-400 hover:shadow-[0_0_20px_rgba(53,208,127,0.08)] bg-slate-900/10",
      badge: "Step 2"
    },
    {
      title: "3. TEE Scoring & VC Issuance",
      desc: "The Rust WASM contract runs scoring rules and issues a cryptographic Verifiable Credential on-chain.",
      icon: Cpu,
      color: "border-slate-800/80 hover:border-blue-500/40 text-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] bg-slate-900/10",
      badge: "Step 3"
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center w-full max-w-5xl gap-8 lg:gap-12 animate-fade-in py-4 lg:py-8 px-4 md:px-8">
      
      {/* Left Column: Title, About, and Wallet Connect */}
      <div className="flex flex-col justify-between flex-1 space-y-6 max-w-md">
        
        {/* Title Header */}
        <div className="text-left space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 shadow-md">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal 3 Agent ADK</span>
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-celo-gold via-slate-100 to-celo-green bg-clip-text text-transparent pb-1">
            PrivyLend
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            Privacy-preserving DeFi credit rating agent secured by hardware enclaves.
          </p>
        </div>

        {/* About Section */}
        <div className="bg-[#0F1115]/90 border border-slate-800/90 rounded-2xl p-6 text-left space-y-4 backdrop-blur-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-celo-gold/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <h4 className="text-xs font-bold uppercase tracking-wider text-celo-gold flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-celo-gold" />
            <span>The Privacy Dilemma & Solution</span>
          </h4>
          
          <div className="space-y-3 text-xs leading-relaxed">
            <p className="text-slate-300">
              Traditional credit verification forces borrowers to reveal raw financial files containing PII (Personally Identifiable Information), creating massive security and compliance risks.
            </p>
            <p className="text-slate-400">
              <span className="text-slate-200 font-semibold">PrivyLend</span> solves this. The agent evaluates your records inside a secure hardware TEE enclave. Lenders get cryptographic proof of your credit score tier, while your raw statements remain 100% private.
            </p>
          </div>
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
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
            >
              <span>Proceed to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Steps */}
      <div className="flex flex-col justify-center flex-1 space-y-4 max-w-md">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Pipeline</h4>
          <span className="text-[10px] text-slate-600 font-semibold tracking-wider uppercase">Alpha Testnet</span>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 border rounded-xl p-5 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 shadow-lg ${step.color}`}
            >
              <div className="p-3 rounded-lg border border-slate-800 bg-[#0B0C0E]/80 text-slate-300 flex-shrink-0 flex items-center justify-center">
                <step.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-slate-200 font-bold text-xs md:text-sm tracking-wide">{step.title}</h3>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800/60 text-slate-500">
                    {step.badge}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

