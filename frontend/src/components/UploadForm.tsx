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
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-celo-gold bg-yellow-500/5 shadow-lg shadow-yellow-500/5"
            : file
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/20"
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
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-emerald-950/40 rounded-full border border-emerald-800/30">
              <FileText className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-semibold text-sm line-clamp-1 max-w-[280px]">{file.name}</p>
              <p className="text-slate-400 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <span className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Document Ready</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-slate-800/50 rounded-full border border-slate-700/50">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-slate-200 font-semibold text-sm">Drag & drop bank statement</p>
              <p className="text-slate-400 text-xs mt-1">Accepts PDF or images (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-slate-400 font-medium text-xs uppercase tracking-wider mb-2">
              Select Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-celo-gold transition-colors"
            >
              <option value="bank_statement">Bank Statement</option>
              <option value="payslip">Payslip / Salary Cert</option>
              <option value="tax_return">Tax Return</option>
            </select>
          </div>

          <div className="flex items-start space-x-2.5 bg-slate-800/30 border border-slate-700/40 rounded-xl p-3">
            <ShieldAlert className="w-5 h-5 text-celo-gold flex-shrink-0 mt-0.5" />
            <p className="text-slate-400 text-xs leading-relaxed">
              <strong className="text-slate-300 font-semibold">Privacy Notice:</strong> Your raw document data never leaves the Trusted Execution Environment (TEE). The scoring logic computes metrics locally, preserving total data confidentiality.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 disabled:transform-none disabled:text-slate-500 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5" />
            <span>Analyse with T3 TEE</span>
          </button>
        </div>
      )}
    </form>
  );
};
