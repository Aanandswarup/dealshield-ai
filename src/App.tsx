import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ContractInput } from './components/ContractInput';
import { ScoreDashboard } from './components/ScoreDashboard';
import { RedlineViewer } from './components/RedlineViewer';
import { EmailModal } from './components/EmailModal';
import { UpgradeModal } from './components/UpgradeModal';
import { RiskEngine } from './services/riskEngine';
import { CreditManager } from './services/creditManager';
import { PdfExportService } from './services/pdfExport';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import type { ContractAuditResult, UserCredits } from './types';
import { Shield, Lock, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [contractText, setContractText] = useState<string>(SAMPLE_CONTRACTS[0].text);
  const [result, setResult] = useState<ContractAuditResult | null>(null);
  const [credits, setCredits] = useState<UserCredits>(CreditManager.getCredits());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [isEmailOpen, setIsEmailOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Initial scan on load with sample contract
  useEffect(() => {
    const initialResult = RiskEngine.auditContract(SAMPLE_CONTRACTS[0].text);
    setResult(initialResult);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAudit = () => {
    if (!contractText.trim()) {
      showToast('Please paste a contract or select a preset to audit.');
      return;
    }

    if (!CreditManager.canAudit()) {
      setIsUpgradeOpen(true);
      showToast('Daily free audit limit reached. Upgrade to Pro for unlimited audits!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const audited = RiskEngine.auditContract(contractText);
      CreditManager.consumeAudit();
      setCredits(CreditManager.getCredits());
      setResult(audited);
      setIsLoading(false);

      if (audited.score >= 80) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
      showToast('Contract audit complete! Findings highlighted below.');
    }, 600);
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    PdfExportService.exportAuditReport(result, 'Client_Agreement_Audit');
    showToast('Executive PDF Audit Report downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-surface-base text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-200 relative overflow-x-hidden">
      
      {/* Ambient Radial Spotlight */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 blur-[130px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(99,102,241,0.2) 50%, transparent 70%)'
          }}
        />
      </div>

      {/* Launch Announcement Bar */}
      {!credits.isPro && (
        <aside aria-label="Announcement" className="relative z-40 bg-gradient-to-r from-brand-950/70 via-indigo-950/50 to-brand-950/70 border-b border-brand-500/20 py-2 px-4 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 flex-wrap text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30 uppercase tracking-wider">
              🔥 Launch Special
            </span>
            <span>
              First 10 Freelancers get <strong className="text-white font-semibold">50% OFF</strong> ($19 Lifetime Access) with code{' '}
              <code className="bg-surface-card px-1.5 py-0.5 rounded text-amber-300 font-mono font-bold border border-surface-border">
                EARLYBIRD
              </code>
            </span>
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span>Claim \$19 Pass</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </aside>
      )}

      {/* Navigation */}
      <Navbar
        credits={credits}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-surface-border text-[11px] font-mono tracking-wider text-slate-300 shadow-sm backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
            </span>
            <span className="text-brand-400 font-bold flex items-center gap-1">
              <Shield className="w-3 h-3 text-brand-400" />
              100% PRIVATE CLIENT-SIDE AUDIT
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 font-sans tracking-normal hidden sm:inline">Zero Cloud Document Storage</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Catch Contract Traps{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Before You Sign.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Audit any client agreement, SOW, or NDA in 5 seconds. Detect unlimited liability exposure, pre-existing IP forfeiture, and Net-90 cashflow traps with attorney-grade counter-clauses.
          </p>

          {/* Value Props Strip */}
          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Documents never leave browser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Attorney-vetted counter-clauses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant executive PDF redline report</span>
            </div>
          </div>
        </div>

        {/* Contract Input Area */}
        <ContractInput
          contractText={contractText}
          setContractText={setContractText}
          onAudit={handleAudit}
          isLoading={isLoading}
        />

        {/* Results Area */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Dashboard Score */}
            <ScoreDashboard
              result={result}
              onDownloadPdf={handleDownloadPdf}
              onOpenEmailModal={() => setIsEmailOpen(true)}
            />

            {/* Findings & Redline View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-brand-400" />
                    <span>Redline Findings & Counter-Clauses</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click each finding to view the plain-English risk explanation and copy replacement clauses.
                  </p>
                </div>
              </div>

              <RedlineViewer findings={result.findings} />
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-base py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 DealShield AI • Engineered by Aanandswarup Chavan • Zero Server Cost Architecture</p>
        <p className="text-[11px] text-slate-600 max-w-xl mx-auto">
          Legal Disclaimer: DealShield AI is an automated business risk assessment tool and does not provide formal legal representation. Always consult a qualified attorney for jurisdictional contract advice.
        </p>
      </footer>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-surface-elevated border border-brand-500/40 text-xs font-semibold text-white shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modals */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onSuccess={() => {
          setCredits(CreditManager.getCredits());
          showToast('DealShield PRO successfully unlocked! Unlimited audits active.');
        }}
      />

      <EmailModal
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        emailText={result?.suggestedEmailResponse || ''}
      />

    </div>
  );
}
