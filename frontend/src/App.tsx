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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-celo-gold/30 selection:text-celo-gold">
      
      {/* Background Ambient Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-yellow-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative w-full border-b border-slate-900 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-r from-celo-gold to-yellow-500 rounded-lg text-slate-950">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            PrivyLend
          </span>
        </div>

        <div className="flex items-center space-x-1 text-slate-500 text-xs bg-slate-900/40 border border-slate-800/60 rounded-full px-3 py-1.5">
          <Lock className="w-3.5 h-3.5 text-celo-green" />
          <span>TEE Enclave Active</span>
        </div>
      </header>

      {/* Main Body */}
      <main className="relative flex-grow flex items-center justify-center px-4 py-8 z-10">
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
      <footer className="relative w-full border-t border-slate-900 bg-slate-950/40 px-6 py-4 text-center text-slate-600 text-[10px] tracking-widest uppercase z-10">
        © 2026 PrivyLend • Secured by Terminal 3
      </footer>
    </div>
  );
}
