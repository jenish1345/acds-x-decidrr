/**
 * PDF Export Utility
 * Generate professional PDF reports from dashboard data
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CompanyHealth, KPI, Alert, PredictiveInsight } from '../types';
import { formatNumber } from './dataProcessor';

interface ExportData {
  companyName: string;
  reportDate: string;
  health: CompanyHealth;
  kpis: KPI[];
  alerts: Alert[];
  insights?: PredictiveInsight[];
  predictedLoss?: number;
  riskProbability?: number;
  vulnerableDepartment?: string;
}

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 138); // Corporate navy
  doc.text('ACDS Executive Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(data.companyName, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(10);
  doc.text(`Generated: ${data.reportDate}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;

  // Company Health Score
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Company Health Overview', 14, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  
  const healthColor = data.health.riskStatus === 'healthy' ? [34, 197, 94] : 
                     data.health.riskStatus === 'warning' ? [234, 179, 8] : [239, 68, 68];
  
  doc.setFillColor(...healthColor);
  doc.rect(14, yPos - 5, 50, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(`Score: ${data.health.overallScore}`, 16, yPos + 2);
  
  doc.setTextColor(0, 0, 0);
  doc.text(`Status: ${data.health.riskStatus.toUpperCase()}`, 70, yPos + 2);
  doc.text(`Trend: ${data.health.trend.toUpperCase()}`, 120, yPos + 2);
  
  yPos += 20;

  // KPIs Table
  doc.setFontSize(14);
  doc.text('Key Performance Indicators', 14, yPos);
  yPos += 5;

  const kpiData = data.kpis.map(kpi => [
    kpi.label,
    kpi.value,
    `${kpi.change > 0 ? '+' : ''}${kpi.change.toFixed(1)}%`,
    kpi.trend.toUpperCase()
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value', 'Change', 'Trend']],
    body: kpiData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 10 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // AI Predictions (if available)
  if (data.insights && data.insights.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('AI Predictive Insights', 14, yPos);
    yPos += 5;

    // Key Metrics
    doc.setFontSize(11);
    doc.setFillColor(239, 246, 255);
    doc.rect(14, yPos, pageWidth - 28, 25, 'F');
    
    doc.setTextColor(30, 58, 138);
    doc.text(`90-Day Loss Projection: $${formatNumber(data.predictedLoss || 0)}`, 18, yPos + 8);
    doc.text(`Risk Escalation: ${data.riskProbability || 0}%`, 18, yPos + 16);
    doc.text(`Vulnerable Department: ${data.vulnerableDepartment || 'N/A'}`, 18, yPos + 24);
    
    yPos += 35;

    // Insights Table
    const insightData = data.insights.slice(0, 3).map(insight => [
      insight.title,
      insight.prediction,
      `${insight.confidence}%`,
      insight.timeframe
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Prediction', 'Analysis', 'Confidence', 'Timeframe']],
      body: insightData,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 80 }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Critical Alerts
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Critical Alerts', 14, yPos);
  yPos += 5;

  const alertData = data.alerts.slice(0, 5).map(alert => [
    alert.title,
    alert.department,
    alert.severity.toUpperCase(),
    alert.impact.toUpperCase(),
    alert.detectedDate
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Alert', 'Department', 'Severity', 'Impact', 'Detected']],
    body: alertData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 60 }
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | ACDS Platform | Confidential`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `ACDS_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
