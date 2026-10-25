import React from 'react';
import { Download, Mail, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { ContractAuditResult } from '../types';

interface ScoreDashboardProps {
  result: ContractAuditResult;
  onDownloadPdf: () => void;
  onOpenEmailModal: () => void;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({
  result,
  onDownloadPdf,
  onOpenEmailModal
}) => {
  const isHealthy = result.score >= 80;
  const isModerate = result.score >= 60 && result.score < 80;
  const isCritical = result.score < 60;

  const scoreTextColor = isHealthy
    ? 'text-emerald-400'
    : isModerate
    ? 'text-amber-400'
    : 'text-red-400';

  const badgeBorderColor = isHealthy
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    : isModerate
    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
    : 'border-red-500/30 bg-red-500/10 text-red-400';

  return (
    <div className="w-full bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] space-y-6 animate-fade-in">
      
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-surface-border pb-6">
        
        {/* Score & Grade Circle */}
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-surface-well border border-surface-border shadow-inner">
            <div className="text-center">
              <span className={`text-4xl font-extrabold tracking-tight ${scoreTextColor} font-sans`}>
                {result.score}
              </span>
              <span className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                / 100
              </span>
            </div>
            {/* Grade Badge */}
            <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs ${badgeBorderColor} shadow-md`}>
              {result.grade}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border uppercase tracking-wider ${badgeBorderColor}`}>
                {isCritical ? 'CRITICAL RISK' : isModerate ? 'MODERATE RISK' : 'SAFE TO SIGN'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {result.findings.length} clauses audited
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Contract Health Assessment
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={onOpenEmailModal}
            className="flex-1 lg:flex-initial py-3 px-4 rounded-xl text-xs font-bold text-white bg-surface-elevated hover:bg-[#1a233a] border border-surface-border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Mail className="w-4 h-4 text-brand-400" />
            <span>Counter-Offer Email</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="flex-1 lg:flex-initial py-3 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-[0_0_20px_-3px_rgba(59,130,246,0.4)] border border-brand-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Executive PDF Report</span>
          </button>
        </div>

      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-surface-well border border-red-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono block">
              {result.stats.critical}
            </span>
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wide">
              Critical Traps
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-well border border-amber-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono block">
              {result.stats.warning}
            </span>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
              Warnings
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-well border border-emerald-500/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white font-mono block">
              {result.stats.safe}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
              Safe Clauses
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
