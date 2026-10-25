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

    // RULE 1: Unlimited Liability
    if (
      lower.includes('unlimited') && (lower.includes('liability') || lower.includes('damages')) ||
      lower.includes('consequential damages') && !lower.includes('neither party shall be liable for indirect')
    ) {
      score -= 22;
      findings.push({
        id: 'risk-unlimited-liability',
        title: 'Unlimited Liability & Consequential Damages Trap',
        category: 'liability',
        severity: 'critical',
        clauseTitle: 'Indemnification & Liability Capping',
        snippet: 'Contractor\'s liability under this agreement shall be UNLIMITED and shall include indirect, incidental, punitive, and consequential damages.',
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
      findings.push({
        id: 'risk-broad-indemnity',
        title: 'Asymmetric One-Way Indemnification',
        category: 'liability',
        severity: 'critical',
        clauseTitle: 'Indemnification Scope',
        snippet: 'Contractor shall defend, indemnify, and hold harmless Client... against any and all claims, damages, liabilities... regardless of fault.',
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
      findings.push({
        id: 'risk-ip-grab',
        title: 'Pre-Existing IP & Developer Tooling Grab',
        category: 'intellectual_property',
        severity: 'critical',
        clauseTitle: 'Intellectual Property Ownership',
        snippet: 'All works, code, inventions, frameworks, design files, methodologies, and pre-existing software tools utilized... shall become the sole property of Client in perpetuity.',
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
      findings.push({
        id: 'risk-portfolio-gag',
        title: 'Portfolio Showcase Ban (Gag Order)',
        category: 'intellectual_property',
        severity: 'warning',
        clauseTitle: 'Marketing & Portfolio Rights',
        snippet: 'Contractor agrees never to display any aspect of the work in Contractor\'s professional portfolio or website.',
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
      findings.push({
        id: 'risk-payment-delay',
        title: 'Predatory Net-60/90 & Pay-When-Paid Clause',
        category: 'payment_terms',
        severity: 'critical',
        clauseTitle: 'Payment Disbursement',
        snippet: 'Payments shall be disbursed on a Net-90 basis... In the event Client does not receive payment from its end sponsor, Client shall have no obligation to disburse funds.',
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
      findings.push({
        id: 'risk-scope-creep',
        title: 'Unlimited Revisions & Subjective Approval Trap',
        category: 'scope_creep',
        severity: 'critical',
        clauseTitle: 'Scope & Acceptance Criteria',
        snippet: 'Contractor shall perform all modifications, revisions, and enhancements requested by Client without additional charge until Client expresses complete subjective satisfaction.',
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
      findings.push({
        id: 'risk-non-compete',
        title: 'Overbroad Freelance Non-Compete Clause',
        category: 'termination_covenants',
        severity: 'critical',
        clauseTitle: 'Restrictive Covenants',
        snippet: 'Contractor shall not directly or indirectly provide services, consulting, or software engineering to any company... globally.',
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
      findings.push({
        id: 'risk-unilateral-kill',
        title: 'Zero-Notice Unilateral Termination Without Pay',
        category: 'termination_covenants',
        severity: 'critical',
        clauseTitle: 'Contract Termination',
        snippet: 'Client may terminate this agreement at any time... immediately upon written notice, without incurring any liability or obligation to pay for services rendered.',
        explanation: 'The client can cancel right before project completion, take your draft work, and refuse to pay you a single dollar.',
        recommendation: 'Add notice and kill fee protection: "Either party may terminate upon fourteen (14) days written notice. In the event of early termination by Client, Contractor shall be paid for all hours worked and milestones achieved to date, plus a twenty percent (20%) project kill fee."'
      });
    }

    // RULE 9: Positive / Healthy Signals
    if (lower.includes('mutual limitation of liability') || lower.includes('limited to the total fees actually paid')) {
      findings.push({
        id: 'safe-liability-cap',
        title: 'Fair Mutual Liability Cap Detected',
        category: 'liability',
        severity: 'safe',
        clauseTitle: 'Limitation of Liability',
        snippet: 'Each party\'s total aggregate liability... shall be strictly limited to the total fees actually paid.',
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
        explanation: 'Prevents infinite scope creep and protects your project timeline.',
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
