import React, { useState } from 'react';
import { ShieldAlert, FileText, Upload, Sparkles, CheckCircle, AlertTriangle, FileCode, Check } from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { extractTextFromPdf } from '../services/pdfParser';

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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractStatus, setExtractStatus] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    setActivePreset(id);
    setExtractStatus(null);
    const preset = SAMPLE_CONTRACTS.find(c => c.id === id);
    if (preset) {
      setContractText(preset.text);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      try {
        setIsExtracting(true);
        setExtractStatus(`Extracting text from ${file.name}...`);
        const result = await extractTextFromPdf(file);
        setContractText(result.text);
        setActivePreset('');
        setExtractStatus(`✓ Extracted ${result.pageCount} page${result.pageCount > 1 ? 's' : ''} from ${file.name} (Client-Side)`);
      } catch (err) {
        console.error('PDF parsing error:', err);
        setExtractStatus(`⚠️ Failed to parse PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsExtracting(false);
      }
    } else {
      // Plain text, markdown, doc
      setIsExtracting(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setContractText(content);
          setActivePreset('');
          setExtractStatus(`✓ Loaded ${file.name}`);
        }
        setIsExtracting(false);
      };
      reader.onerror = () => {
        setExtractStatus(`⚠️ Failed to read ${file.name}`);
        setIsExtracting(false);
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const wordCount = contractText.trim() ? contractText.trim().split(/\s+/).length : 0;

  return (
    <section 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full bg-surface-card border rounded-2xl p-5 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] space-y-6 transition-all ${
        isDragging 
          ? 'border-brand-400 bg-brand-950/20 ring-4 ring-brand-500/30' 
          : 'border-surface-border'
      }`}
    >
      
      {/* Top Header & Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <span>Upload or Paste Contract, NDA, or SOW</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Drop your PDF or paste agreement text to scan for uncapped liability, IP grabs, and Net-90 traps.
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-[#1a233a] border border-surface-border text-xs font-semibold text-slate-200 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4 text-brand-400" />
            <span>Upload PDF / Text</span>
            <input
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Drag & Drop Visual Banner if Dragging */}
      {isDragging && (
        <div className="border-2 border-dashed border-brand-400 rounded-xl p-8 text-center bg-brand-500/10 animate-pulse">
          <Upload className="w-8 h-8 text-brand-400 mx-auto mb-2 animate-bounce" />
          <p className="text-sm font-bold text-brand-300">Drop PDF or Contract File Here</p>
          <p className="text-xs text-brand-400/80">In-browser text extraction with 0 cloud storage</p>
        </div>
      )}

      {/* Extraction Status Alert */}
      {isExtracting && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-brand-500/15 border border-brand-500/40 text-xs font-semibold text-brand-200 animate-fade-in">
          <div className="w-4 h-4 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin shrink-0"></div>
          <span>{extractStatus || 'Extracting text directly in browser...'}</span>
        </div>
      )}

      {!isExtracting && extractStatus && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{extractStatus}</span>
          </div>
          <button 
            onClick={() => setExtractStatus(null)}
            className="text-[11px] text-emerald-400/80 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

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
                  {preset.riskExpectation === 'High Risk' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                  {preset.riskExpectation === 'Medium Risk' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {preset.riskExpectation === 'Low Risk' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
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
            setExtractStatus(null);
          }}
          placeholder="Paste your client agreement, statement of work (SOW), or NDA here, or drag & drop a PDF file..."
          rows={12}
          className="w-full bg-surface-well border border-surface-border rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/40 resize-y leading-relaxed"
        />

        {/* Drag target tip & Word count pill */}
        <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 pointer-events-none">
          <FileCode className="w-3.5 h-3.5" />
          <span>Supports drag-and-drop .pdf, .txt, .md</span>
        </div>

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
          disabled={isLoading || isExtracting || !contractText.trim()}
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
