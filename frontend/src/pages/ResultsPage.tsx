import { useState, type FC } from "react";
import { type ScoreResult } from "../agent/agentFlow";
import { ScoreBadge } from "../components/ScoreBadge";
import { AuditLog } from "../components/AuditLog";
import { formatCurrency } from "../utils/formatters";
import { ShieldCheck, Award, ArrowUpRight, Activity, Info, Copy, Check } from "lucide-react";

interface ResultsPageProps {
  result: ScoreResult;
  onReset: () => void;
}

export const ResultsPage: FC<ResultsPageProps> = ({ result, onReset }) => {
  const [showAuditLog, setShowAuditLog] = useState<boolean>(false);
  const [loanAccepted, setLoanAccepted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Configure rates based on tier
  // Tier A: Green (Excellent), Tier B: Blue (Good), Tier C: Amber (Fair)
  const getOfferConfig = (tier: string) => {
    switch (tier) {
      case "A":
        return {
          apr: "2.8%",
          baselineApr: "8.5%",
          tierLabel: "Tier A Prime Plus",
          desc: "You qualify for our lowest interest rate and maximum borrowing limit.",
          color: "border-emerald-500/20 shadow-emerald-500/5 bg-[#0F1115]/90",
        };
      case "B":
        return {
          apr: "4.9%",
          baselineApr: "8.5%",
          tierLabel: "Tier B Standard Prime",
          desc: "You qualify for preferred rates and intermediate borrowing limits.",
          color: "border-blue-500/20 shadow-blue-500/5 bg-[#0F1115]/90",
        };
      case "C":
      default:
        return {
          apr: "7.8%",
          baselineApr: "9.5%",
          tierLabel: "Tier C Subprime",
          desc: "You qualify for standard rates and basic borrowing limits.",
          color: "border-amber-500/20 shadow-amber-500/5 bg-[#0F1115]/90",
        };
    }
  };

  const offer = getOfferConfig(result.tier);

  const handleCopyVC = () => {
    navigator.clipboard.writeText(result.vcHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl space-y-6 animate-fade-in py-4 px-4">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Assessment Completed</h2>
        <p className="text-slate-400 text-xs font-semibold">Verifiable Credential generated successfully inside TEE enclave.</p>
      </div>

      {/* Main Score & Tier Card */}
      <div className="w-full bg-[#0F1115]/90 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col items-center space-y-6 shadow-xl backdrop-blur-xl">
        <ScoreBadge score={result.score} tier={result.tier} />

        <div className="text-center space-y-2">
          <h3 className="text-slate-200 font-extrabold text-sm tracking-wide">{offer.tierLabel} Offer</h3>
          <p className="text-slate-400 text-xs font-medium max-w-xs leading-relaxed">{offer.desc}</p>
        </div>
      </div>

      {/* DeFi Offer Comparison Card */}
      <div className={`w-full border rounded-2xl p-6 space-y-5 shadow-lg backdrop-blur-xl ${offer.color}`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h4 className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">DeFi Loan Limit</h4>
            <span className="text-3xl font-black text-slate-100 tracking-tight">
              {formatCurrency(result.maxLoan)} <span className="text-slate-400 text-lg font-bold">USDC</span>
            </span>
          </div>
          <div className="p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
            <Award className="w-6 h-6 text-celo-gold" />
          </div>
        </div>

        {/* APR Comparisons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0B0C0E] border border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="block text-slate-500 text-[9px] uppercase font-bold tracking-widest">
              DeFi APR (with VC)
            </span>
            <span className="text-2xl font-black text-emerald-400 tracking-tight">{offer.apr}</span>
          </div>
          <div className="bg-[#0B0C0E]/50 border border-slate-800/50 rounded-xl p-4 text-center space-y-1">
            <span className="block text-slate-500 text-[9px] uppercase font-bold tracking-widest">
              Baseline APR (no VC)
            </span>
            <span className="text-2xl font-bold text-slate-500 line-through decoration-red-500/80 tracking-tight">
              {offer.baselineApr}
            </span>
          </div>
        </div>

        {/* Loan Acceptance button */}
        {loanAccepted ? (
          <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-bold text-center rounded-xl py-3.5 px-4 text-sm flex items-center justify-center space-x-2 animate-fade-in">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Loan Application Approved on Alfajores!</span>
          </div>
        ) : (
          <button
            onClick={() => setLoanAccepted(true)}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-celo-gold to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-extrabold py-4 rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 text-sm"
          >
            <span>Accept Loan Terms</span>
            <ArrowUpRight className="w-4 h-4 text-slate-950" />
          </button>
        )}
      </div>

      {/* VC Hash footprint */}
      <div className="flex items-center justify-between bg-[#0F1115]/50 border border-slate-800 rounded-xl px-4 py-3.5 w-full shadow-inner">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <p className="text-[10px] text-slate-500 font-mono tracking-wide truncate">
            VC Hash: <span className="text-slate-350 font-semibold">{result.vcHash}</span>
          </p>
        </div>
        <button
          onClick={handleCopyVC}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-800/40 rounded-lg ml-2 flex-shrink-0"
          title="Copy VC Hash"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Actions (View Log Toggle / Reset) */}
      <div className="flex flex-col items-center space-y-4 w-full">
        <button
          onClick={() => setShowAuditLog(!showAuditLog)}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 text-xs font-semibold underline transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{showAuditLog ? "Hide Audit Verification Logs" : "Show Audit Verification Logs"}</span>
        </button>

        {showAuditLog && <AuditLog vcHash={result.vcHash} />}

        <button
          onClick={onReset}
          className="text-slate-400 hover:text-slate-300 text-xs font-semibold hover:underline transition-all duration-200 pt-2"
        >
          Verify Another Statement
        </button>
      </div>
    </div>
  );
};

