import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";

interface UploadFormProps {
  onAnalyze: (documentType: string) => void;
  loading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onAnalyze, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [documentType, setDocumentType] = useState<string>("bank_statement");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onAnalyze(documentType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          isDragActive
            ? "border-celo-gold bg-yellow-500/5 shadow-lg shadow-yellow-500/5"
            : file
            ? "border-emerald-500/50 bg-emerald-500/[0.02]"
            : "border-slate-800 bg-[#0F1115]/60 hover:border-slate-700 hover:bg-[#0F1115]/90 shadow-md"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 relative">
              <FileText className="w-8 h-8 text-emerald-400" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 border-2 border-[#08090B]">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-bold text-sm line-clamp-1 max-w-[280px]">{file.name}</p>
              <p className="text-slate-400 text-xs font-semibold mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <span className="flex items-center space-x-1.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <span>Ready for Enclave</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-all duration-300">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-slate-200 transition-colors" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-200 font-bold text-sm tracking-wide">Drag & drop bank statement</p>
              <p className="text-slate-400 text-xs font-medium">Supports PDF, PNG, JPG (Max 10MB)</p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const demoFile = new File(["demo statement data"], "demo_bank_statement.pdf", { type: "application/pdf" });
                    setFile(demoFile);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-celo-gold hover:text-yellow-400 border border-slate-700 hover:border-celo-gold/30 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm"
                >
                  Use Demo Statement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {file && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <label className="block text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
              Verification Mode
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-[#0F1115] border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 text-sm font-semibold focus:outline-none focus:border-celo-gold transition-colors shadow-inner"
            >
              <option value="bank_statement">Bank Statement Evaluation</option>
              <option value="payslip">Payslip / Salary Verification</option>
              <option value="tax_return">Tax Return Verification</option>
            </select>
          </div>

          <div className="flex items-start space-x-3 bg-blue-500/[0.02] border border-blue-500/10 rounded-xl p-4 shadow-sm">
            <ShieldAlert className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-xs font-bold text-blue-300">Confidential Computing Active</span>
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                Your private document metrics are processed exclusively in a hardware-isolated secure enclave. Raw statements are not stored or transmitted outside the enclave.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 disabled:transform-none disabled:text-slate-500 transition-all duration-300 text-sm"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span className="tracking-wide">Run Enclave Assessment</span>
          </button>
        </div>
      )}
    </form>
  );
};

