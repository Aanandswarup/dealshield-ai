import React, { useState } from 'react';
import { ShieldAlert, FileText, Upload, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

interface ContractInputProps {
  contractText: string;
  setContractText: (text: string) => void;
  onAudit: () => void;
  isLoading: boolean;
}

export const ContractInput: React.FC<ContractInputProps> = ({
  contractText,
  setContractText,
  onAudit,
  isLoading
}) => {
  const [activePreset, setActivePreset] = useState<string>('predatory-sow');

  const handleSelectPreset = (id: string) => {
    setActivePreset(id);
    const preset = SAMPLE_CONTRACTS.find(c => c.id === id);
    if (preset) {
      setContractText(preset.text);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setContractText(content);
        setActivePreset('');
      }
    };
    reader.readAsText(file);
  };

  const wordCount = contractText.trim() ? contractText.trim().split(/\s+/).length : 0;

  return (
    <section className="w-full bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] space-y-6">
      
      {/* Top Header & Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <span>Paste Contract, NDA, or SOW</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze client agreements for uncapped liability, IP forfeiture, and payment traps.
          </p>
        </div>

        {/* Upload Button */}
        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-[#1a233a] border border-surface-border text-xs font-semibold text-slate-200 cursor-pointer transition-colors shrink-0">
          <Upload className="w-4 h-4 text-brand-400" />
          <span>Upload File (.txt, .md)</span>
          <input
            type="file"
            accept=".txt,.md,.doc"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
          Quick Test Presets (Click to load sample):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_CONTRACTS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500/40 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]'
                    : 'bg-surface-well border-surface-border/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-sans">
                  <span>{preset.name}</span>
                  {preset.riskExpectation === 'High Risk' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                  {preset.riskExpectation === 'Medium Risk' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {preset.riskExpectation === 'Low Risk' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={contractText}
          onChange={(e) => {
            setContractText(e.target.value);
            setActivePreset('');
          }}
          placeholder="Paste your client agreement, statement of work (SOW), or NDA here..."
          rows={12}
          className="w-full bg-surface-well border border-surface-border rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 resize-y leading-relaxed"
        />

        {/* Word count pill */}
        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-surface-card/90 border border-surface-border text-[11px] font-mono text-slate-400 backdrop-blur-sm pointer-events-none">
          {wordCount} words • {contractText.length} chars
        </div>
      </div>

      {/* Audit Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Zero cloud uploads — 100% evaluated client-side in your browser</span>
        </div>

        <button
          onClick={onAudit}
          disabled={isLoading || !contractText.trim()}
          className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 hover:to-indigo-500 shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] border border-brand-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Scanning Contract Clauses...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-brand-300" />
              <span>Audit Contract Risks (5s Scan)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </>
          )}
        </button>
      </div>

    </section>
  );
};
