import React, { useState } from 'react';
import { X, Check, Crown, Zap, ShieldCheck, Key } from 'lucide-react';
import { CreditManager } from '../services/creditManager';
import confetti from 'canvas-confetti';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = CreditManager.activatePro(licenseKeyInput);
    if (success) {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Invalid or unverified license key. Please check the key in your confirmation email.');
    }
  };

  const CHECKOUT_URL = 'https://caanand7.gumroad.com/l/hookforge/EARLYBIRD';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-brand-500/20 via-indigo-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-surface-elevated border border-surface-border transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium tracking-wide">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Founder Early-Bird Deal • First 10 Freelancers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Unlock DealShield <span className="bg-gradient-to-r from-brand-400 to-indigo-300 bg-clip-text text-transparent">PRO</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Never sign an uncapped liability trap or give away your code again.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-surface-well border border-surface-border mb-6 text-xs text-slate-200">
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-emerald-400" />
            </div>
            <span><strong className="text-white font-semibold">Unlimited Audits:</strong> Scan unlimited client agreements, MSAs & SOWs</span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-emerald-400" />
            </div>
            <span><strong className="text-white font-semibold">Executive PDF Reports:</strong> Branded client-ready Redline Audit PDFs</span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-emerald-400" />
            </div>
            <span><strong className="text-white font-semibold">Counter-Clause Generator:</strong> Attorney-grade replacement clauses</span>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-amber-400" />
            </div>
            <span><strong className="text-amber-300 font-semibold">🎁 Creator Suite Bonus:</strong> License key also unlocks HookForge AI Pro + 100+ Viral Hooks Vault</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="text-center space-y-4 mb-6">
          <div className="flex items-baseline justify-center gap-2.5">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">$19</span>
            <span className="text-sm text-slate-500 line-through font-mono">$29</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              LIFETIME ACCESS (CODE: EARLYBIRD)
            </span>
          </div>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_35px_-2px_rgba(59,130,246,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Claim Lifetime Deal ($19 LTD)</span>
          </a>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Use code <strong className="text-amber-300 font-mono">EARLYBIRD</strong> at checkout • 14-Day Money-Back Guarantee</span>
          </div>
        </div>

        {/* License Activation Form */}
        <div className="pt-4 border-t border-surface-border text-center">
          <form onSubmit={handleActivateKey} className="space-y-2.5">
            <label className="block text-[11px] font-mono font-semibold text-slate-400">
              Already purchased? Enter your License Key:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={licenseKeyInput}
                  onChange={(e) => setLicenseKeyInput(e.target.value)}
                  placeholder="DS-PRO-XXXX-XXXX-XXXX"
                  className="w-full bg-surface-well border border-surface-border rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/60 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-surface-elevated hover:bg-[#1f2a44] border border-surface-border text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Activate
              </button>
            </div>
            {errorMsg && (
              <p className="text-[11px] text-red-400 font-medium">{errorMsg}</p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};
