import React from "react";
import { formatHash } from "../utils/formatters";
import { Terminal, Shield, Cpu, Key, Check } from "lucide-react";

interface AuditLogProps {
  vcHash: string;
}

export const AuditLog: React.FC<AuditLogProps> = ({ vcHash }) => {
  const logs = [
    {
      title: "Secure TEE Session Created",
      desc: "Intel TDX hardware enclave successfully provisioned and verified.",
      icon: Cpu,
      color: "text-blue-400",
    },
    {
      title: "Credential Decryption Successful",
      desc: "ML-KEM private key parsed inside the enclaved storage scope.",
      icon: Key,
      color: "text-purple-400",
    },
    {
      title: "Placeholders Resolved & Ingested",
      desc: "Profile attributes replaced dynamically at host-interface level.",
      icon: Shield,
      color: "text-emerald-400",
    },
    {
      title: "Verifiable Credential Hashed",
      desc: `SHA-256 footprint computed: ${formatHash(vcHash)}`,
      icon: Terminal,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="w-full max-w-md bg-[#090A0C] border border-slate-800 rounded-xl p-5 space-y-4 shadow-2xl relative overflow-hidden text-left">
      <div className="absolute top-3.5 right-4 flex space-x-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/40" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
        <div className="w-2 h-2 rounded-full bg-green-500/40" />
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <Terminal className="w-4 h-4 text-slate-500" />
        <h3 className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">TEE Audit Trail</h3>
      </div>

      <div className="relative border-l border-slate-800 pl-4 ml-2.5 space-y-5">
        {logs.map((log, index) => (
          <div key={index} className="relative group">
            {/* Step dot */}
            <span className="absolute -left-[22.5px] top-0.5 flex items-center justify-center bg-[#090A0C] border border-slate-800 w-4 h-4 rounded-full group-hover:border-emerald-500 transition-colors">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </span>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <log.icon className={`w-3.5 h-3.5 ${log.color}`} />
                <h4 className="text-slate-200 font-bold text-[11px] tracking-wide">{log.title}</h4>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed font-semibold">{log.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

