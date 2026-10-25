import React, { useState } from 'react';
import { X, Copy, Check, Mail, Sparkles } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailText: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, emailText }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-surface-elevated border border-surface-border transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
            <Mail className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-sans flex items-center gap-2">
              <span>Client Counter-Negotiation Email</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
            <p className="text-xs text-slate-400">
              Polite, firm, attorney-vetted email requesting the redline adjustments.
            </p>
          </div>
        </div>

        {/* Email Box */}
        <div className="bg-surface-well border border-surface-border rounded-xl p-4 sm:p-5 max-h-[60vh] overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
          {emailText}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-[0_0_20px_-3px_rgba(59,130,246,0.4)] border border-brand-400/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Email Draft</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
