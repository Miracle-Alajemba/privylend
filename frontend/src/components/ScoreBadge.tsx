import React from "react";

interface ScoreBadgeProps {
  score: number;
  tier: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, tier }) => {
  // Get colors based on Tier
  // Tier A: Green, Tier B: Blue, Tier C: Amber
  const tierConfig: Record<string, { bg: string; border: string; text: string; fill: string; label: string }> = {
    A: {
      bg: "bg-emerald-950/40",
      border: "border-emerald-800/50",
      text: "text-emerald-400",
      fill: "stroke-emerald-500",
      label: "Excellent (Tier A)",
    },
    B: {
      bg: "bg-blue-950/40",
      border: "border-blue-800/50",
      text: "text-blue-400",
      fill: "stroke-blue-500",
      label: "Good (Tier B)",
    },
    C: {
      bg: "bg-amber-950/40",
      border: "border-amber-800/50",
      text: "text-amber-400",
      fill: "stroke-amber-500",
      label: "Fair / Subprime (Tier C)",
    },
  };

  const config = tierConfig[tier] || tierConfig["C"];
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        {/* SVG Circle Progress Bar */}
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={`${config.fill} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Score Number */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-slate-100 tracking-tight">{score}</span>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Score</span>
        </div>
      </div>

      {/* Tier Badge */}
      <div className={`mt-5 px-5 py-2 border rounded-full ${config.bg} ${config.border} ${config.text} text-sm font-bold tracking-wide shadow-lg`}>
        {config.label}
      </div>
    </div>
  );
};
