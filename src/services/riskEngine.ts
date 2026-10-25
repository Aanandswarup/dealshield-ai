import type { ContractAuditResult, ContractFinding } from '../types';

export const RiskEngine = {
  auditContract(text: string): ContractAuditResult {
    if (!text || text.trim().length < 50) {
      return {
        score: 100,
        grade: 'A',
        summary: 'No substantial contract terms detected. Please paste your agreement to scan.',
        findings: [],
        stats: { critical: 0, warning: 0, safe: 0 },
        suggestedEmailResponse: ''
      };
    }

    const lower = text.toLowerCase();
    const findings: ContractFinding[] = [];
    let score = 100;

    // Helper to find best highlight phrase match in original text
    const findSnippetInText = (keywords: string[]): string | undefined => {
      for (const kw of keywords) {
        const idx = lower.indexOf(kw.toLowerCase());
        if (idx !== -1) {
          // extract a clean ~80-120 char window around match
          const start = Math.max(0, text.lastIndexOf('.', idx) + 1);
          let end = text.indexOf('.', idx + kw.length);
          if (end === -1 || end - start > 220) end = Math.min(text.length, idx + kw.length + 80);
          return text.slice(start, end + 1).trim();
        }
      }
      return undefined;
    };

    // RULE 1: Unlimited Liability
    if (
      lower.includes('unlimited') && (lower.includes('liability') || lower.includes('damages')) ||
      lower.includes('consequential damages') && !lower.includes('neither party shall be liable for indirect')
    ) {
      score -= 22;
      const matched = findSnippetInText(['unlimited liability', 'liability under this agreement shall be unlimited', 'consequential damages']);
      findings.push({
        id: 'risk-unlimited-liability',
        title: 'Unlimited Liability & Consequential Damages Trap',
        category: 'liability',
        severity: 'critical',
        clauseTitle: 'Indemnification & Liability Capping',
        snippet: matched || 'Contractor\'s liability under this agreement shall be UNLIMITED and shall include indirect, incidental, punitive, and consequential damages.',
        highlightPhrase: 'liability',
        explanation: 'If the client\'s website has downtime or loses data, you could theoretically be sued for hundreds of thousands of dollars in lost business profits—far exceeding what they paid you.',
        recommendation: 'Replace with a mutual liability cap: "To the maximum extent permitted by law, each party\'s total aggregate liability arising under this Agreement shall be strictly limited to the total fees actually paid by Client under this SOW. In no event shall either party be liable for indirect, consequential, or punitive damages."'
      });
    }

    // RULE 2: One-Way Broad Indemnification
    if (
      lower.includes('indemnify and hold harmless') ||
      lower.includes('defend, indemnify') ||
      lower.includes('regardless of fault')
    ) {
      score -= 18;
      const matched = findSnippetInText(['indemnify and hold harmless', 'defend, indemnify', 'regardless of fault']);
      findings.push({
        id: 'risk-broad-indemnity',
        title: 'Asymmetric One-Way Indemnification',
        category: 'liability',
        severity: 'critical',
        clauseTitle: 'Indemnification Scope',
        snippet: matched || 'Contractor shall defend, indemnify, and hold harmless Client... against any and all claims, damages, liabilities... regardless of fault.',
        highlightPhrase: 'indemnif',
        explanation: 'You are agreeing to pay the client\'s legal fees and defense costs even for lawsuits that are not your fault or involve third-party claims.',
        recommendation: 'Replace with standard fault-based indemnity: "Contractor agrees to indemnify Client only against final judgments directly resulting from deliverables intentionally infringing verified third-party intellectual property. Client shall mutually indemnify Contractor against all claims arising from Client-supplied content, branding, or specifications."'
      });
    }

    // RULE 3: Pre-Existing IP & Tool Forfeiture
    if (
      lower.includes('pre-existing software') ||
      lower.includes('frameworks utilized') ||
      lower.includes('pre-existing tools') && lower.includes('property of client') ||
      lower.includes('waives all moral rights')
    ) {
      score -= 20;
      const matched = findSnippetInText(['pre-existing software', 'frameworks utilized', 'pre-existing tools', 'moral rights']);
      findings.push({
        id: 'risk-ip-grab',
        title: 'Pre-Existing IP & Developer Tooling Grab',
        category: 'intellectual_property',
        severity: 'critical',
        clauseTitle: 'Intellectual Property Ownership',
        snippet: matched || 'All works, code, inventions, frameworks, design files, methodologies, and pre-existing software tools utilized... shall become the sole property of Client in perpetuity.',
        highlightPhrase: 'pre-existing',
        explanation: 'Under this clause, the client claims ownership of your personal code libraries, design starter kits, UI boilerplates, and frameworks. You would legally be barred from using your own code on future client projects.',
        recommendation: 'Carve out pre-existing background IP: "Client shall own the bespoke final deliverable upon full payment. Contractor explicitly retains full ownership of all pre-existing tools, libraries, boilerplates, and know-how utilized during the engagement, granting Client a perpetual, royalty-free license to use them solely within the final deliverable."'
      });
    }

    // RULE 4: Portfolio Gag Order
    if (
      lower.includes('never to display') ||
      lower.includes('waive') && lower.includes('portfolio') ||
      lower.includes('shall not display') && lower.includes('portfolio')
    ) {
      score -= 10;
      const matched = findSnippetInText(['never to display', 'portfolio']);
      findings.push({
        id: 'risk-portfolio-gag',
        title: 'Portfolio Showcase Ban (Gag Order)',
        category: 'intellectual_property',
        severity: 'warning',
        clauseTitle: 'Marketing & Portfolio Rights',
        snippet: matched || 'Contractor agrees never to display any aspect of the work in Contractor\'s professional portfolio or website.',
        highlightPhrase: 'portfolio',
        explanation: 'You cannot use the completed project as social proof or in your case studies to win future clients.',
        recommendation: 'Add mutual portfolio permission: "Contractor reserves the right to display screenshots, case study summaries, and links to the completed non-confidential deliverables in Contractor\'s professional portfolio and promotional channels."'
      });
    }

    // RULE 5: Extended Payment Terms & Pay-When-Paid
    if (
      lower.includes('pay-when-paid') ||
      lower.includes('net-90') ||
      lower.includes('net 90') ||
      lower.includes('net-60') ||
      lower.includes('net 60') ||
      lower.includes('no obligation to disburse funds')
    ) {
      score -= 18;
      const matched = findSnippetInText(['pay-when-paid', 'net-90', 'net 90', 'net-60', 'net 60']);
      findings.push({
        id: 'risk-payment-delay',
        title: 'Predatory Net-60/90 & Pay-When-Paid Clause',
        category: 'payment_terms',
        severity: 'critical',
        clauseTitle: 'Payment Disbursement',
        snippet: matched || 'Payments shall be disbursed on a Net-90 basis... In the event Client does not receive payment from its end sponsor, Client shall have no obligation to disburse funds.',
        highlightPhrase: 'net-',
        explanation: 'You act as an unpaid bank for the client. Waiting 90 days creates fatal cashflow gaps, and "pay-when-paid" means you take on the client\'s customer default risk.',
        recommendation: 'Replace with standard commercial terms: "All invoices shall be disbursed on a Net-15 (or Net-30) basis. Payment obligations are independent of Client\'s receipts from third parties. Late invoices shall accrue interest at 1.5% per month."'
      });
    }

    // RULE 6: Subjective "Complete Satisfaction" & Unlimited Revisions
    if (
      lower.includes('complete subjective satisfaction') ||
      lower.includes('without additional charge until') ||
      lower.includes('unlimited revisions') ||
      lower.includes('all modifications') && lower.includes('without additional charge')
    ) {
      score -= 16;
      const matched = findSnippetInText(['complete subjective satisfaction', 'without additional charge', 'unlimited revisions']);
      findings.push({
        id: 'risk-scope-creep',
        title: 'Unlimited Revisions & Subjective Approval Trap',
        category: 'scope_creep',
        severity: 'critical',
        clauseTitle: 'Scope & Acceptance Criteria',
        snippet: matched || 'Contractor shall perform all modifications, revisions, and enhancements requested by Client without additional charge until Client expresses complete subjective satisfaction.',
        highlightPhrase: 'satisfaction',
        explanation: 'The client can demand endless design changes and rewrite requests for free, dragging a 2-week project into a 6-month nightmare without paying you more.',
        recommendation: 'Bound the revision rounds: "Project fee includes up to two (2) rounds of reasonable revisions per milestone against the agreed specification. Revisions beyond this limit or additions to scope shall be billed at Contractor\'s standard rate of $95/hr with prior written authorization."'
      });
    }

    // RULE 7: Unfair Global Non-Compete
    if (
      lower.includes('non-compete') ||
      lower.includes('shall not directly or indirectly provide services') && lower.includes('months')
    ) {
      score -= 15;
      const matched = findSnippetInText(['non-compete', 'shall not directly or indirectly provide services']);
      findings.push({
        id: 'risk-non-compete',
        title: 'Overbroad Freelance Non-Compete Clause',
        category: 'termination_covenants',
        severity: 'critical',
        clauseTitle: 'Restrictive Covenants',
        snippet: matched || 'Contractor shall not directly or indirectly provide services, consulting, or software engineering to any company... globally.',
        highlightPhrase: 'non-compete',
        explanation: 'As an independent contractor, signing a non-compete restricts your fundamental right to earn a living in your own industry. Non-competes for freelancers are legally abusive.',
        recommendation: 'Strike the non-compete completely: "Replace with standard non-disclosure of confidential business secrets only: \'Contractor agrees strictly not to disclose or utilize Client\'s proprietary trade secrets or proprietary customer lists outside this engagement.\'"'
      });
    }

    // RULE 8: Unilateral Termination Without Compensation
    if (
      lower.includes('terminate this agreement at any time') && lower.includes('without') && lower.includes('obligation to pay') ||
      lower.includes('immediately upon written notice, without incurring any liability')
    ) {
      score -= 18;
      const matched = findSnippetInText(['terminate this agreement at any time', 'without incurring any liability']);
      findings.push({
        id: 'risk-unilateral-kill',
        title: 'Zero-Notice Unilateral Termination Without Pay',
        category: 'termination_covenants',
        severity: 'critical',
        clauseTitle: 'Contract Termination',
        snippet: matched || 'Client may terminate this agreement at any time... immediately upon written notice, without incurring any liability or obligation to pay for services rendered.',
        highlightPhrase: 'terminate',
        explanation: 'The client can cancel right before project completion, take your draft work, and refuse to pay you a single dollar.',
        recommendation: 'Add notice and kill fee protection: "Either party may terminate upon fourteen (14) days written notice. In the event of early termination by Client, Contractor shall be paid for all hours worked and milestones achieved to date, plus a twenty percent (20%) project kill fee."'
      });
    }

    // RULE 9: Unreasonable Foreign Jurisdiction & Distant Venue
    if (
      (lower.includes('exclusive jurisdiction') || lower.includes('governed by the laws of') || lower.includes('courts of')) &&
      (lower.includes('delaware') || lower.includes('new york') || lower.includes('california') || lower.includes('london') || lower.includes('singapore') || lower.includes('england and wales'))
    ) {
      score -= 14;
      const matched = findSnippetInText(['exclusive jurisdiction', 'governed by the laws of', 'courts of']);
      findings.push({
        id: 'risk-distant-jurisdiction',
        title: 'Distant Foreign Jurisdiction & Venue Trap',
        category: 'jurisdiction_compliance',
        severity: 'critical',
        clauseTitle: 'Governing Law & Dispute Forum',
        snippet: matched || 'This Agreement shall be governed exclusively by the laws of Delaware, and the parties submit to the exclusive jurisdiction of the state and federal courts located in Wilmington, Delaware.',
        highlightPhrase: 'jurisdiction',
        explanation: 'If a payment dispute arises over an unpaid invoice, you would be forced to retain overseas attorneys and travel to a distant court, effectively costing more than the unpaid amount.',
        recommendation: 'Replace with digital arbitration or contractor\'s local jurisdiction: "This Agreement shall be governed by the laws of Contractor’s principal place of business. Any unresolved disputes shall be submitted to binding, digital expedited arbitration administered by an established digital dispute provider, with proceedings conducted remotely via video conference."'
      });
    }

    // RULE 10: Excessive Warranty Periods (1-Year / Indefinite Bug Fixing)
    if (
      (lower.includes('warranty') || lower.includes('free from defects') || lower.includes('bug fix')) &&
      (lower.includes('one (1) year') || lower.includes('1 year') || lower.includes('365 days') || lower.includes('12 months') || lower.includes('indefinitely maintain') || lower.includes('perpetual'))
    ) {
      score -= 15;
      const matched = findSnippetInText(['one (1) year', '1 year', '365 days', '12 months', 'free from defects', 'warranty']);
      findings.push({
        id: 'risk-excessive-warranty',
        title: 'Excessive 1-Year / Indefinite Bug Fix Warranty Trap',
        category: 'jurisdiction_compliance',
        severity: 'critical',
        clauseTitle: 'Warranty & Maintenance Obligations',
        snippet: matched || 'Contractor warrants that the deliverables shall remain free from defects and bugs for a period of one (1) year from final handover, and shall correct all errors without charge.',
        highlightPhrase: 'warranty',
        explanation: 'Third-party APIs, web browsers, and OS updates change constantly. A 1-year or unlimited free bug-fix warranty converts a fixed-fee project into unpaid perpetual maintenance.',
        recommendation: 'Bound warranty to 30 days: "Contractor warrants that deliverables will substantially conform to agreed written specifications for thirty (30) days following delivery. Verifiable defects reported within this 30-day window will be resolved at no additional charge. Ongoing support or maintenance after 30 days shall be billed under a separate maintenance retainer."'
      });
    }

    // RULE 11: Unilateral Client Audit & Equipment Inspection Rights
    if (
      (lower.includes('right to audit') || lower.includes('inspect contractor') || lower.includes('inspect books and records')) &&
      (lower.includes('systems') || lower.includes('devices') || lower.includes('premises') || lower.includes('equipment') || lower.includes('at any time'))
    ) {
      score -= 16;
      const matched = findSnippetInText(['right to audit', 'inspect contractor', 'inspect books and records', 'audit']);
      findings.push({
        id: 'risk-unilateral-audit',
        title: 'Invasive Client Audit & Computer Inspection Rights',
        category: 'jurisdiction_compliance',
        severity: 'critical',
        clauseTitle: 'Audit & Inspection Rights',
        snippet: matched || 'Client reserves the right at any time to audit and inspect Contractor’s premises, personal computers, systems, and books to verify contract compliance.',
        highlightPhrase: 'audit',
        explanation: 'This grants the client the legal pretext to inspect your computer files, code for other clients, and personal workstation setups.',
        recommendation: 'Limit audits strictly to milestone invoices: "Contractor shall maintain billing records directly related to this SOW for twelve (12) months. Upon thirty (30) days prior written notice, Client may inspect invoice backup records during normal business hours. Client shall have no right of physical or digital inspection of Contractor’s hardware, internal network, or non-related materials."'
      });
    }

    // RULE 12: Positive / Healthy Signals
    if (lower.includes('mutual limitation of liability') || lower.includes('limited to the total fees actually paid')) {
      findings.push({
        id: 'safe-liability-cap',
        title: 'Fair Mutual Liability Cap Detected',
        category: 'liability',
        severity: 'safe',
        clauseTitle: 'Limitation of Liability',
        snippet: 'Each party\'s total aggregate liability... shall be strictly limited to the total fees actually paid.',
        highlightPhrase: 'liability',
        explanation: 'Your financial liability is safely bounded to what the client paid you. You cannot be bankrupted by unexpected claims.',
        recommendation: 'Accept as is. Standard fair commercial practice.'
      });
    }

    if (lower.includes('reserves the right to showcase') || lower.includes('portfolio and case studies')) {
      findings.push({
        id: 'safe-portfolio-rights',
        title: 'Portfolio Showcase Rights Preserved',
        category: 'intellectual_property',
        severity: 'safe',
        clauseTitle: 'Marketing Rights',
        snippet: 'Consultant reserves the right to showcase the completed work in Consultant\'s professional portfolio.',
        highlightPhrase: 'portfolio',
        explanation: 'You are legally empowered to showcase this project to win future clients.',
        recommendation: 'Accept as is. Excellent protection for solo builders.'
      });
    }

    if (lower.includes('two (2) rounds of reasonable revisions') || lower.includes('2 rounds of revisions')) {
      findings.push({
        id: 'safe-revisions',
        title: 'Clear Bounded Revisions',
        category: 'scope_creep',
        severity: 'safe',
        clauseTitle: 'Revision Scope',
        snippet: 'Includes up to two (2) rounds of reasonable revisions per milestone.',
        highlightPhrase: 'revisions',
        explanation: 'Prevents infinite scope creep and protects your project timeline.',
        recommendation: 'Accept as is.'
      });
    }

    if (lower.includes('binding online arbitration') || lower.includes('remote dispute resolution')) {
      findings.push({
        id: 'safe-arbitration',
        title: 'Remote Digital Dispute Resolution',
        category: 'jurisdiction_compliance',
        severity: 'safe',
        clauseTitle: 'Governing Law',
        snippet: 'Disputes resolved via binding remote digital arbitration.',
        highlightPhrase: 'arbitration',
        explanation: 'Prevents being dragged to physical courts in overseas jurisdictions.',
        recommendation: 'Accept as is. Fair modern commercial standard.'
      });
    }

    if (lower.includes('thirty (30) days following delivery') || lower.includes('30-day warranty')) {
      findings.push({
        id: 'safe-warranty',
        title: 'Reasonable 30-Day Defect Correction Window',
        category: 'jurisdiction_compliance',
        severity: 'safe',
        clauseTitle: 'Warranty Window',
        snippet: 'Deliverables warrantied against defects for thirty (30) days following delivery.',
        highlightPhrase: 'warranty',
        explanation: 'Protects you from being trapped in permanent unbilled maintenance.',
        recommendation: 'Accept as is.'
      });
    }

    // Ensure score boundaries
    const finalScore = Math.max(12, Math.min(100, score));

    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
    if (finalScore < 45) grade = 'F';
    else if (finalScore < 65) grade = 'D';
    else if (finalScore < 80) grade = 'C';
    else if (finalScore < 90) grade = 'B';

    const criticalCount = findings.filter(f => f.severity === 'critical').length;
    const warningCount = findings.filter(f => f.severity === 'warning').length;
    const safeCount = findings.filter(f => f.severity === 'safe').length;

    let summaryText = '';
    if (finalScore >= 85) {
      summaryText = '🟢 SAFE & BALANCED: This contract contains standard commercial protections. Minor formalities only.';
    } else if (finalScore >= 60) {
      summaryText = '🟡 MODERATE RISK: Contains several one-sided clauses (extended payment terms or loose revision scope). Request standard redlines.';
    } else {
      summaryText = '🔴 CRITICAL RISK DETECTED: DO NOT SIGN AS-IS. Contains predatory liability exposure, IP overreach, or cashflow traps that could jeopardize your business.';
    }

    // Generate tailored counter-offer email
    const redlineRequests = findings
      .filter(f => f.severity === 'critical' || f.severity === 'warning')
      .map((f, i) => `${i + 1}. **${f.clauseTitle}:** ${f.title}\n   *Proposed Revision:* ${f.recommendation}`)
      .join('\n\n');

    const suggestedEmail = `Subject: Revision Requests for [Project / SOW Agreement] - [Your Name / Agency]

Hi [Client Name],

Thank you for sharing the draft agreement! We are genuinely excited about partnering with your team on this project.

Our standard legal policy requires minor commercial adjustments to align with our agency master terms before signature. Below are the key adjustments we have noted:

${redlineRequests}

These revisions follow standard commercial practices and ensure mutual alignment and clear scope for both parties. 

Please review and let us know if you can issue an updated draft with these points incorporated so we can sign and kick off immediately!

Warm regards,
[Your Name / Agency Name]`;

    return {
      score: finalScore,
      grade,
      summary: summaryText,
      findings,
      stats: {
        critical: criticalCount,
        warning: warningCount,
        safe: safeCount
      },
      suggestedEmailResponse: suggestedEmail
    };
  }
};
