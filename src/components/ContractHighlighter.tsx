import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, AlertTriangle, CheckCircle, Eye, FileSearch } from 'lucide-react';
import type { ContractFinding } from '../types';

interface ContractHighlighterProps {
  contractText: string;
  findings: ContractFinding[];
}

export const ContractHighlighter: React.FC<ContractHighlighterProps> = ({
  contractText,
  findings
}) => {
  const [activeFinding, setActiveFinding] = useState<ContractFinding | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Find occurrences of findings in text paragraphs
  const paragraphs = contractText.split(/\n\n+/);

  const getParagraphFinding = (para: string): ContractFinding | undefined => {
    const lowerPara = para.toLowerCase();
    for (const f of findings) {
      if (f.highlightPhrase && lowerPara.includes(f.highlightPhrase.toLowerCase())) {
        return f;
      }
      // Check for key words
      if (f.id === 'risk-unlimited-liability' && (lowerPara.includes('unlimited') || lowerPara.includes('consequential damages'))) return f;
      if (f.id === 'risk-broad-indemnity' && lowerPara.includes('indemnify and hold harmless')) return f;
      if (f.id === 'risk-ip-grab' && (lowerPara.includes('pre-existing') || lowerPara.includes('work made for hire'))) return f;
      if (f.id === 'risk-portfolio-gag' && lowerPara.includes('portfolio')) return f;
      if (f.id === 'risk-payment-delay' && (lowerPara.includes('net-90') || lowerPara.includes('pay-when-paid'))) return f;
      if (f.id === 'risk-scope-creep' && (lowerPara.includes('subjective satisfaction') || lowerPara.includes('without additional charge'))) return f;
      if (f.id === 'risk-non-compete' && lowerPara.includes('non-compete')) return f;
      if (f.id === 'risk-unilateral-kill' && lowerPara.includes('terminate this agreement at any time')) return f;
      if (f.id === 'risk-distant-jurisdiction' && (lowerPara.includes('delaware') || lowerPara.includes('exclusive jurisdiction'))) return f;
      if (f.id === 'risk-excessive-warranty' && (lowerPara.includes('one (1) year') || lowerPara.includes('free from defects'))) return f;
      if (f.id === 'risk-unilateral-audit' && (lowerPara.includes('audit') || lowerPara.includes('inspect contractor'))) return f;
      if (f.id === 'safe-liability-cap' && lowerPara.includes('strictly limited to the total fees')) return f;
      if (f.id === 'safe-portfolio-rights' && lowerPara.includes('reserves the right to showcase')) return f;
      if (f.id === 'safe-revisions' && lowerPara.includes('two (2) rounds of reasonable revisions')) return f;
      if (f.id === 'safe-arbitration' && lowerPara.includes('online arbitration')) return f;
      if (f.id === 'safe-warranty' && lowerPara.includes('thirty (30) days following delivery')) return f;
    }
    return undefined;
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Visual Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-card border border-surface-border p-4 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Eye className="w-4 h-4 text-brand-400" />
          <span className="font-semibold text-white">Visual Inline Redline:</span>
          <span>Click any highlighted clause to view the risk explanation & attorney replacement.</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            Critical Trap
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Warning
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Fair Protection
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Main: The Highlighted Contract Document */}
        <div className="lg:col-span-7 bg-surface-well border border-surface-border rounded-2xl p-6 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto space-y-4 shadow-inner">
          {paragraphs.map((para, idx) => {
            const finding = getParagraphFinding(para);
            if (!finding) {
              return (
                <p key={idx} className="text-slate-400 whitespace-pre-wrap">
                  {para}
                </p>
              );
            }

            const isCrit = finding.severity === 'critical';
            const isWarn = finding.severity === 'warning';
            const isSelected = activeFinding?.id === finding.id;

            const bgClass = isCrit
              ? isSelected ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/30' : 'bg-red-950/20 border-red-500/40 hover:bg-red-950/30'
              : isWarn
              ? isSelected ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30' : 'bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/30'
              : isSelected ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30' : 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30';

            const badgeBg = isCrit
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : isWarn
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

            return (
              <div
                key={idx}
                onClick={() => setActiveFinding(finding)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${bgClass}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${badgeBg}`}>
                    {isCrit ? '🚨 CRITICAL TRAP' : isWarn ? '⚠️ WARNING' : '✅ SAFE TERM'}: {finding.clauseTitle}
                  </span>
                  <span className="text-[10px] text-slate-400 underline group-hover:text-white transition-colors">
                    Click to inspect fix →
                  </span>
                </div>
                <p className="whitespace-pre-wrap font-mono text-slate-200">
                  {para}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Active Finding Inspector Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          {activeFinding ? (
            <div className="bg-surface-card border border-brand-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  activeFinding.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  activeFinding.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {activeFinding.severity.toUpperCase()} RISK
                </span>
                <span className="text-xs font-mono text-slate-400">{activeFinding.clauseTitle}</span>
              </div>

              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {activeFinding.severity === 'critical' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
                {activeFinding.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                {activeFinding.severity === 'safe' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
                <span>{activeFinding.title}</span>
              </h4>

              {/* The Risk */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                  The Risk Exposure (Plain English):
                </span>
                <p className="text-xs text-slate-300 bg-surface-well p-3 rounded-xl border border-surface-border leading-relaxed">
                  {activeFinding.explanation}
                </p>
              </div>

              {/* Counter-Clause */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider">
                    🛡️ Attorney-Vetted Counter-Clause:
                  </span>
                  <button
                    onClick={() => handleCopy(activeFinding.id, activeFinding.recommendation)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-[11px] font-mono font-semibold text-brand-300 transition-colors cursor-pointer"
                  >
                    {copiedId === activeFinding.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Replacement</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-brand-950/30 border border-brand-500/40 text-xs font-mono text-brand-200 leading-relaxed select-all">
                  {activeFinding.recommendation}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-surface-card border border-surface-border rounded-2xl p-8 text-center space-y-3">
              <FileSearch className="w-10 h-10 text-slate-500 mx-auto" />
              <h5 className="font-bold text-sm text-slate-200">Interactive Clause Inspector</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click any highlighted red, amber, or green clause in the contract on the left to see why it was flagged and copy the counter-clause.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
