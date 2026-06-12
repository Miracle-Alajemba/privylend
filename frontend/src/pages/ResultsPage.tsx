import { useState, type FC } from "react";
import { type ScoreResult } from "../agent/agentFlow";
import { ScoreBadge } from "../components/ScoreBadge";
import { AuditLog } from "../components/AuditLog";
import { formatCurrency } from "../utils/formatters";
import { ShieldCheck, Award, ArrowUpRight, Activity, Info } from "lucide-react";

interface ResultsPageProps {
  result: ScoreResult;
  onReset: () => void;
}

export const ResultsPage: FC<ResultsPageProps> = ({ result, onReset }) => {
  const [showAuditLog, setShowAuditLog] = useState<boolean>(false);
  const [loanAccepted, setLoanAccepted] = useState<boolean>(false);

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
          color: "border-emerald-500/20 shadow-emerald-500/5",
        };
      case "B":
        return {
          apr: "4.9%",
          baselineApr: "8.5%",
          tierLabel: "Tier B Standard Prime",
          desc: "You qualify for preferred rates and intermediate borrowing limits.",
          color: "border-blue-500/20 shadow-blue-500/5",
        };
      case "C":
      default:
        return {
          apr: "7.8%",
          baselineApr: "9.5%",
          tierLabel: "Tier C Subprime",
          desc: "You qualify for standard rates and basic borrowing limits.",
          color: "border-amber-500/20 shadow-amber-500/5",
        };
    }
  };

  const offer = getOfferConfig(result.tier);

  return (
    <div className="flex flex-col items-center w-full max-w-xl space-y-8 animate-fade-in py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Analysis Results</h2>
        <p className="text-slate-400 text-xs">Verifiable Credential generated successfully inside TEE enclave.</p>
      </div>

      {/* Main Score & Tier Card */}
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 flex flex-col items-center space-y-6 shadow-xl backdrop-blur-md">
        <ScoreBadge score={result.score} tier={result.tier} />

        <div className="text-center space-y-1">
          <h3 className="text-slate-200 font-bold text-sm">{offer.tierLabel} Offer</h3>
          <p className="text-slate-400 text-xs max-w-xs">{offer.desc}</p>
        </div>
      </div>

      {/* DeFi Offer Comparison Card */}
      <div className={`w-full bg-slate-900/40 border rounded-2xl p-5 md:p-6 space-y-5 shadow-md ${offer.color}`}>
        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
          <div>
            <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider">DeFi Loan Offer</h4>
            <span className="text-2xl font-black text-slate-100 tracking-tight">
              {formatCurrency(result.maxLoan)} USDC
            </span>
          </div>
          <Award className="w-8 h-8 text-celo-gold" />
        </div>

        {/* APR Comparisons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-3.5 text-center">
            <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">
              DeFi APR (with VC)
            </span>
            <span className="text-2xl font-black text-emerald-400">{offer.apr}</span>
          </div>
          <div className="bg-slate-950/20 border border-slate-850/40 rounded-xl p-3.5 text-center">
            <span className="block text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
              Baseline (no VC)
            </span>
            <span className="text-2xl font-bold text-slate-400 line-through decoration-red-500/80">
              {offer.baselineApr}
            </span>
          </div>
        </div>

        {/* Loan Acceptance button */}
        {loanAccepted ? (
          <div className="bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 font-semibold text-center rounded-xl py-3 px-4 text-sm flex items-center justify-center space-x-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Loan Application Accepted!</span>
          </div>
        ) : (
          <button
            onClick={() => setLoanAccepted(true)}
            className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-celo-gold to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-bold py-3.5 rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Accept Loan Offer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* VC Hash footprint */}
      <div className="flex items-center space-x-2.5 bg-slate-950/30 border border-slate-850/40 rounded-xl p-3 w-full">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <p className="text-[10px] text-slate-500 font-mono tracking-wide line-clamp-1">
          VC cryptographic hash: <span className="text-slate-400 font-semibold">{result.vcHash}</span>
        </p>
      </div>

      {/* Actions (View Log Toggle / Reset) */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setShowAuditLog(!showAuditLog)}
          className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-xs font-semibold underline transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{showAuditLog ? "Hide Verifiable Audit Trail" : "View Verifiable Audit Trail"}</span>
        </button>

        {showAuditLog && <AuditLog vcHash={result.vcHash} />}

        <button
          onClick={onReset}
          className="text-slate-400 hover:text-slate-300 text-xs underline transition-colors"
        >
          Analyse Another Document
        </button>
      </div>
    </div>
  );
};
