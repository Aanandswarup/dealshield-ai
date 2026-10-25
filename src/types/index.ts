export type RiskLevel = 'critical' | 'warning' | 'safe' | 'info';

export type ContractCategory = 
  | 'liability' 
  | 'intellectual_property' 
  | 'payment_terms' 
  | 'scope_creep' 
  | 'termination_covenants';

export interface ContractFinding {
  id: string;
  title: string;
  category: ContractCategory;
  severity: RiskLevel;
  clauseTitle: string;
  snippet: string;
  explanation: string;
  recommendation: string;
}

export interface ContractAuditResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
  documentTitle?: string;
  findings: ContractFinding[];
  stats: {
    critical: number;
    warning: number;
    safe: number;
  };
  suggestedEmailResponse: string;
}

export interface UserCredits {
  freeAuditsRemaining: number;
  isPro: boolean;
  lastResetDate: string;
  licenseKey?: string;
}

export interface SampleContractPreset {
  id: string;
  name: string;
  tagline: string;
  riskExpectation: 'High Risk' | 'Medium Risk' | 'Low Risk';
  text: string;
}
