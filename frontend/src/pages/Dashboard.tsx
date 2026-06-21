import { type FC } from "react";
import { UploadForm } from "../components/UploadForm";
import { type ExecutionStep } from "../hooks/useT3Session";
import { Cpu, CheckCircle2, Circle, AlertCircle, ArrowLeft } from "lucide-react";

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
    <div className="flex flex-col items-center w-full max-w-lg space-y-6 animate-fade-in px-4">
      {!loading && !steps.some((s) => s.status === "active" || s.status === "success" || s.status === "error") ? (
        // Standard Upload Form Screen
        <div className="flex flex-col items-center w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Credit Document Analysis</h2>
            <p className="text-slate-400 text-xs font-semibold">
              Upload your financial statement to calculate your score in the T3 secure enclave.
            </p>
          </div>

          <UploadForm onAnalyze={startAnalysis} loading={loading} />

          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to main</span>
          </button>
        </div>
      ) : (
        // Processing / Running Scoring Screen
        <div className="w-full bg-[#0F1115]/90 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 relative shadow-inner">
              <Cpu className="w-8 h-8 text-emerald-400 animate-pulse" />
              {loading && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200 tracking-wide">Executing T3 TEE Pipeline</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Verifiably evaluating credit scoring logic...</p>
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
                      ? "border-celo-gold/60 bg-yellow-500/5 text-celo-gold shadow-[0_0_15px_rgba(251,204,92,0.04)]"
                      : isSuccess
                      ? "border-emerald-800/40 bg-emerald-500/[0.02] text-emerald-400"
                      : isError
                      ? "border-red-800/40 bg-red-500/[0.02] text-red-450"
                      : "border-slate-800/60 bg-slate-900/10 text-slate-500"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                    ) : isError ? (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-450" />
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border-2 border-celo-gold border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 flex-shrink-0 text-slate-700" />
                    )}
                    <span className="font-bold text-xs md:text-sm tracking-wide">{step.name}</span>
                  </div>
                  <span className="text-[9px] uppercase font-black tracking-widest">
                    {step.status}
                  </span>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="flex items-start space-x-3 bg-red-950/20 border border-red-900/30 rounded-xl p-4 text-red-300 text-xs shadow-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="space-y-2.5 w-full">
                <div>
                  <strong className="font-extrabold text-red-400 block uppercase tracking-wider text-[10px]">Pipeline Error</strong>
                  <p className="leading-relaxed font-semibold mt-1">{error}</p>
                </div>
                <div className="flex items-center space-x-4 pt-1.5 border-t border-slate-800/40">
                  <button
                    onClick={onBack}
                    className="text-red-400 hover:text-red-300 underline font-extrabold transition-colors uppercase tracking-wider text-[10px]"
                  >
                    Restart Analysis
                  </button>
                  <span className="text-slate-800 font-bold">|</span>
                  <button
                    onClick={retryInSandbox}
                    className="text-celo-gold hover:text-yellow-450 font-extrabold flex items-center space-x-1 transition-colors uppercase tracking-wider text-[10px]"
                  >
                    <span>Try Sandbox Mode (Simulation) →</span>
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

