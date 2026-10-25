import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, LayoutList, FileSearch } from 'lucide-react';
import type { ContractFinding, ContractCategory } from '../types';
import { ContractHighlighter } from './ContractHighlighter';

interface RedlineViewerProps {
  findings: ContractFinding[];
  contractText?: string;
}

export const RedlineViewer: React.FC<RedlineViewerProps> = ({ findings, contractText = '' }) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'inline'>('cards');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(findings[0]?.id || null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: `All Findings (${findings.length})` },
    { id: 'liability', label: 'Liability & Indemnity' },
    { id: 'intellectual_property', label: 'IP & Portfolio Rights' },
    { id: 'payment_terms', label: 'Payment Terms' },
    { id: 'scope_creep', label: 'Scope & Revisions' },
    { id: 'termination_covenants', label: 'Termination & Non-Compete' },
    { id: 'jurisdiction_compliance', label: 'Jurisdiction & Warranties' },
  ];

  const filteredFindings = selectedCategory === 'all'
    ? findings
    : findings.filter(f => f.category === (selectedCategory as ContractCategory));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* View Mode Toggle: Cards vs Inline Highlighter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
        <div className="inline-flex p-1 rounded-xl bg-surface-card border border-surface-border">
          <button
            onClick={() => setActiveTab('cards')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-brand-600 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span>Finding Cards ({findings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inline')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inline'
                ? 'bg-brand-600 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>Interactive Document Redline</span>
          </button>
        </div>

        {activeTab === 'cards' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40 shadow-sm'
                    : 'bg-surface-card border border-surface-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Findings Cards List */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center bg-surface-card border border-surface-border rounded-2xl text-slate-400 text-sm">
              No findings detected in this category.
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isCrit = finding.severity === 'critical';
              const isWarn = finding.severity === 'warning';
              const isExpanded = expandedId === finding.id;

              const borderClass = isCrit
                ? 'border-red-500/30 bg-red-950/10'
                : isWarn
                ? 'border-amber-500/30 bg-amber-950/10'
                : 'border-emerald-500/30 bg-emerald-950/10';

              const badgeBg = isCrit
                ? 'bg-red-500/15 text-red-400 border-red-500/30'
                : isWarn
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={finding.id}
                  className={`border rounded-2xl p-5 sm:p-6 transition-all shadow-sm ${borderClass}`}
                >
                  {/* Header row */}
                  <div
                    className="flex items-start justify-between gap-4 cursor-pointer"
                    onClick={() => toggleExpand(finding.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${badgeBg}`}>
                          {isCrit ? 'CRITICAL TRAP' : isWarn ? 'WARNING' : 'HEALTHY CLAUSE'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {finding.clauseTitle}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
                        {isCrit && <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />}
                        {isWarn && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                        {!isCrit && !isWarn && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        <span>{finding.title}</span>
                      </h4>
                    </div>

                    <button
                      className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="mt-5 space-y-4 pt-4 border-t border-surface-border/60 animate-fade-in text-sm">
                      
                      {/* The Snippet Quote */}
                      <div className="p-3.5 rounded-xl bg-surface-well border border-surface-border text-xs font-mono text-slate-300 italic">
                        <span className="text-slate-500 not-italic block text-[10px] uppercase font-bold tracking-wider mb-1">
                          Contract Snippet Detected:
                        </span>
                        "{finding.snippet}"
                      </div>

                      {/* The Trap (Risk explanation) */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                          ⚠️ The Hidden Risk (Plain English):
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-surface-card/60 p-3 rounded-xl border border-surface-border/60">
                          {finding.explanation}
                        </p>
                      </div>

                      {/* The Fix (Recommended Counter-Clause) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider">
                            🛡️ Attorney-Recommended Replacement Clause:
                          </span>
                          <button
                            onClick={() => handleCopy(finding.id, finding.recommendation)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-[11px] font-mono font-semibold text-brand-300 transition-colors cursor-pointer"
                          >
                            {copiedId === finding.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Fix</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-brand-950/20 border border-brand-500/30 text-xs font-mono text-brand-200 leading-relaxed select-all">
                          {finding.recommendation}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Inline Document Redline */}
      {activeTab === 'inline' && (
        <ContractHighlighter
          contractText={contractText}
          findings={findings}
        />
      )}

    </div>
  );
};
