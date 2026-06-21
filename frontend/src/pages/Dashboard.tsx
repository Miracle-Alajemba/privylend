import { type FC } from "react";
import { UploadForm } from "../components/UploadForm";
import { type ExecutionStep } from "../hooks/useT3Session";
import { Cpu, CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface DashboardProps {
  loading: boolean;
  error: string | null;
  steps: ExecutionStep[];
  startAnalysis: (documentType: string) => void;
  retryInSandbox: () => void;
  onBack: () => void;
}

export const Dashboard: FC<DashboardProps> = ({
  loading,
  error,
  steps,
  startAnalysis,
  retryInSandbox,
  onBack,
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-lg space-y-6 animate-fade-in">
      {!loading && !steps.some((s) => s.status === "active" || s.status === "success" || s.status === "error") ? (
        // Standard Upload Form Screen
        <div className="flex flex-col items-center w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Credit Document Analysis</h2>
            <p className="text-slate-400 text-xs">
              Upload your financial statement to calculate your score in the T3 secure enclave.
            </p>
          </div>

          <UploadForm onAnalyze={startAnalysis} loading={loading} />

          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-200 text-xs underline transition-colors"
          >
            Go back
          </button>
        </div>
      ) : (
        // Processing / Running Scoring Screen
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur-md">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 relative">
              <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
              {loading && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">Executing T3 TEE Pipeline</h3>
              <p className="text-slate-400 text-xs mt-1">Verifiably evaluating credit scoring logic...</p>
            </div>
          </div>

          {/* Stepper progress indicator */}
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isActive = step.status === "active";
              const isSuccess = step.status === "success";
              const isError = step.status === "error";

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between border rounded-xl p-4 transition-all duration-300 ${
                    isActive
                      ? "border-celo-gold bg-yellow-500/5 text-celo-gold"
                      : isSuccess
                      ? "border-emerald-800/30 bg-emerald-500/5 text-emerald-400"
                      : isError
                      ? "border-red-800/30 bg-red-500/5 text-red-400"
                      : "border-slate-800 bg-slate-900/20 text-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : isError ? (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border-2 border-celo-gold border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-xs md:text-sm">{step.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {step.status}
                  </span>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="flex items-start space-x-2.5 bg-red-950/40 border border-red-800/40 rounded-xl p-4 text-red-300 text-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 w-full">
                <strong className="font-bold">Pipeline Error:</strong>
                <p className="leading-relaxed">{error}</p>
                <div className="flex items-center space-x-4 mt-3 pt-1">
                  <button
                    onClick={onBack}
                    className="text-red-400 hover:text-red-300 underline font-semibold transition-colors"
                  >
                    Restart Analysis
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    onClick={retryInSandbox}
                    className="text-celo-gold hover:text-yellow-400 font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <span>Switch to Sandbox Mode (Simulation) →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
