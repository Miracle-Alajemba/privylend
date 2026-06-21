import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useT3Session } from "./hooks/useT3Session";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { ResultsPage } from "./pages/ResultsPage";
import { Shield, Lock } from "lucide-react";

export default function App() {
  const { address, isConnected, error: walletError, connectWallet, disconnectWallet } = useWallet();
  const { loading, error: sessionError, result, steps, startAnalysis, retryInSandbox, resetSession } = useT3Session();
  
  // App navigation state: "landing" | "dashboard" | "results"
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "results">("landing");

  const handleNextToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleBackToLanding = () => {
    resetSession();
    setCurrentPage("landing");
  };

  const handleStartAnalysis = async (documentType: string) => {
    const success = await startAnalysis(documentType);
    if (success) {
      setCurrentPage("results");
    }
  };

  const handleRetryInSandbox = async () => {
    const success = await retryInSandbox();
    if (success) {
      setCurrentPage("results");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#08090B] text-slate-100 selection:bg-celo-gold/30 selection:text-celo-gold overflow-hidden">
      
      {/* Background Ambient Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-yellow-500/[0.02] blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-emerald-500/[0.02] blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative w-full border-b border-slate-800 bg-[#08090B]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between z-25">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-r from-celo-gold to-yellow-500 rounded-xl text-slate-950 shadow-md">
            <Shield className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-slate-100 to-slate-350 bg-clip-text text-transparent">
            PrivyLend
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-400 text-xs bg-[#0F1115]/90 border border-slate-800 rounded-full px-3 py-1.5 shadow-sm">
          <Lock className="w-3 h-3 text-celo-green" />
          <span className="font-bold uppercase tracking-wider text-[9px] text-slate-400">Enclave Active</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative flex-grow flex items-center justify-center px-4 py-6 z-10 overflow-y-auto">
        {currentPage === "landing" && (
          <LandingPage
            address={address}
            isConnected={isConnected}
            error={walletError}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            onNext={handleNextToDashboard}
          />
        )}

        {currentPage === "dashboard" && (
          <Dashboard
            loading={loading}
            error={sessionError}
            steps={steps}
            startAnalysis={handleStartAnalysis}
            retryInSandbox={handleRetryInSandbox}
            onBack={handleBackToLanding}
          />
        )}

        {currentPage === "results" && result && (
          <ResultsPage result={result} onReset={handleBackToLanding} />
        )}
      </main>

      {/* Footer */}
      <footer className="relative w-full border-t border-slate-800 bg-[#08090B]/40 px-6 py-4 text-center text-slate-650 text-[9px] font-bold tracking-widest uppercase z-10">
        © 2026 PrivyLend • Secured by Terminal 3
      </footer>
    </div>

  );
}
