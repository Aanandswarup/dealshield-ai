import React from 'react';
import { Shield, Crown, Sparkles, Lock } from 'lucide-react';
import type { UserCredits } from '../types';

interface NavbarProps {
  credits: UserCredits;
  onOpenUpgrade: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ credits, onOpenUpgrade }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface-base/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_-3px_rgba(59,130,246,0.5)] border border-brand-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                DealShield <span className="text-brand-400">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-mono font-medium text-brand-300 uppercase tracking-wider">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Client-Side Contract & SOW Risk Audit Engine
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Privacy Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>100% In-Browser Privacy</span>
          </div>

          {/* Credits / Pro Badge */}
          {credits.isPro ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>PRO ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400 font-mono">
                Free Scans: <strong className="text-brand-400">{credits.freeAuditsRemaining} left today</strong>
              </span>
              <button
                onClick={onOpenUpgrade}
                className="py-2 px-3.5 rounded-xl text-xs font-bold font-sans text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-500 hover:to-indigo-500 shadow-[0_0_20px_-3px_rgba(59,130,246,0.4)] border border-brand-400/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Get Pro ($19 LTD)</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
