import { jsPDF } from 'jspdf';
import type { ContractAuditResult } from '../types';

export const PdfExportService = {
  exportAuditReport(result: ContractAuditResult, documentName: string = 'Client Agreement SOW'): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    function setDarkBackground() {
      doc.setFillColor(7, 11, 18); // #070b12
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    function addHeader(pageNum: number) {
      if (pageNum === 1) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('DEALSHIELD AI  |  EXECUTIVE CONTRACT AUDIT REPORT', margin, 12);
      doc.text(`Page ${pageNum}`, pageWidth - margin - 15, 12);
      doc.setDrawColor(29, 39, 60);
      doc.setLineWidth(0.3);
      doc.line(margin, 15, pageWidth - margin, 15);
    }

    // ---------------- PAGE 1: COVER & EXECUTIVE SUMMARY ----------------
    setDarkBackground();

    // Top branding badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246); // Brand Blue
    doc.text('CONFIDENTIAL EXECUTIVE REDLINE REPORT', margin, 30);

    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('Contract Risk & Health Audit', margin, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text(`Document: ${documentName}`, margin, 50);
    doc.text(`Audit Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 56);

    // Score Banner Card
    doc.setFillColor(13, 19, 32);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, 65, contentWidth, 38, 4, 4, 'FD');

    // Score display
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    let scoreColor = [239, 68, 68]; // Red
    if (result.score >= 80) scoreColor = [16, 185, 129]; // Green
    else if (result.score >= 60) scoreColor = [245, 158, 11]; // Amber

    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${result.score}/100`, margin + 12, 85);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`OVERALL HEALTH: GRADE ${result.grade}`, margin + 12, 94);

    // Stat chips on right of card
    doc.setFontSize(9.5);
    doc.setTextColor(239, 68, 68);
    doc.text(`🔴 ${result.stats.critical} Critical Risks`, pageWidth - margin - 55, 78);
    doc.setTextColor(245, 158, 11);
    doc.text(`🟡 ${result.stats.warning} Warnings`, pageWidth - margin - 55, 86);
    doc.setTextColor(16, 185, 129);
    doc.text(`🟢 ${result.stats.safe} Safe Terms`, pageWidth - margin - 55, 94);

    // Executive Summary Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Executive Assessment', margin, 118);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    const splitSummary = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(splitSummary, margin, 126);

    let currentY = 126 + (splitSummary.length * 6) + 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Key Findings & Redline Breakdown', margin, currentY);
    currentY += 8;

    // Render first few findings on page 1
    result.findings.forEach((f) => {
      if (currentY > pageHeight - 35) {
        doc.addPage();
        setDarkBackground();
        addHeader(doc.getNumberOfPages());
        currentY = 28;
      }

      const isCrit = f.severity === 'critical';
      const isWarn = f.severity === 'warning';
      const cardColor = isCrit ? [239, 68, 68] : isWarn ? [245, 158, 11] : [16, 185, 129];

      doc.setFillColor(13, 19, 32);
      doc.setDrawColor(cardColor[0], cardColor[1], cardColor[2]);
      doc.setLineWidth(0.4);

      // Card Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(cardColor[0], cardColor[1], cardColor[2]);
      const flagLabel = isCrit ? '🔴 CRITICAL RISK' : isWarn ? '🟡 WARNING' : '🟢 SAFE TERM';
      doc.text(`${flagLabel}: ${f.title}`, margin, currentY);
      currentY += 5;

      // The Trap
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('THE RISK EXPOSURE:', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      const splitExp = doc.splitTextToSize(f.explanation, contentWidth);
      doc.text(splitExp, margin, currentY);
      currentY += splitExp.length * 4.5 + 3;

      // Recommended Replacement
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(59, 130, 246);
      doc.text('ATTORNEY-RECOMMENDED FIX (REPLACEMENT CLAUSE):', margin, currentY);
      currentY += 4.5;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(191, 219, 254);
      const splitFix = doc.splitTextToSize(f.recommendation, contentWidth);
      doc.text(splitFix, margin, currentY);
      currentY += splitFix.length * 4.5 + 7;
    });

    // Disclaimer footer on final page
    if (currentY > pageHeight - 25) {
      doc.addPage();
      setDarkBackground();
      addHeader(doc.getNumberOfPages());
      currentY = 28;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DISCLAIMER: This report is generated by DealShield AI for business risk assessment purposes and does not constitute formal legal counsel.', margin, currentY + 10);
    doc.text('Confidential audit generated with DealShield AI Studio (https://aanandswarup.github.io/dealshield-ai/).', margin, currentY + 14);

    doc.save(`DealShield_Audit_${documentName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  }
};
