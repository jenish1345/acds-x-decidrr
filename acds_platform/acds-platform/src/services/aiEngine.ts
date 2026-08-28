/**
 * AI Engine Service
 * Provides predictive analytics and intelligent insights
 * Currently uses statistical methods - ready for ML API integration
 */

import type { Dataset, DatasetComparison, KPIChange, RiskChange, PredictiveInsight } from '../types/dataset';
import type { Alert } from '../types';
import { calculateStats, calculatePercentageChange, formatNumber } from '../utils/dataProcessor';

/**
 * Calculate overall company health score (0-100)
 * Based on multiple factors: financial health, operational efficiency, risk exposure
 */
export async function calculateHealthScore(dataset: Dataset): Promise<number> {
  // Simulate async API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const { data, mappings } = dataset;
  
  if (!mappings || data.length === 0) return 50;
  
  let score = 70; // Base score
  
  // Factor 1: Revenue trend (weight: 30%)
  if (mappings.revenue) {
    const revenueStats = calculateStats(data, mappings.revenue);
    const recentRevenue = data.slice(-3).map(row => Number(row[mappings.revenue!]));
    const avgRecent = recentRevenue.reduce((sum, v) => sum + v, 0) / recentRevenue.length;
    
    if (avgRecent > revenueStats.mean * 1.1) score += 15;
    else if (avgRecent < revenueStats.mean * 0.9) score -= 15;
  }
  
  // Factor 2: Profit margin (weight: 25%)
  if (mappings.profit && mappings.revenue) {
    const profitData = data.map(row => ({
      profit: Number(row[mappings.profit!]),
      revenue: Number(row[mappings.revenue!])
    })).filter(d => !isNaN(d.profit) && !isNaN(d.revenue) && d.revenue > 0);
    
    if (profitData.length > 0) {
      const avgMargin = profitData.reduce((sum, d) => sum + (d.profit / d.revenue), 0) / profitData.length;
      if (avgMargin > 0.25) score += 10;
      else if (avgMargin < 0.10) score -= 10;
    }
  }
  
  // Factor 3: Customer retention (weight: 20%)
  if (mappings.retention) {
    const retentionStats = calculateStats(data, mappings.retention);
    if (retentionStats.mean > 85) score += 8;
    else if (retentionStats.mean < 70) score -= 12;
  }
  
  // Factor 4: Employee satisfaction (weight: 15%)
  if (mappings.satisfaction) {
    const satisfactionStats = calculateStats(data, mappings.satisfaction);
    if (satisfactionStats.mean > 8) score += 7;
    else if (satisfactionStats.mean < 6) score -= 8;
  }
  
  // Factor 5: Volatility check (weight: 10%)
  if (mappings.revenue) {
    const revenueStats = calculateStats(data, mappings.revenue);
    const coefficientOfVariation = revenueStats.stdDev / revenueStats.mean;
    if (coefficientOfVariation > 0.3) score -= 5; // High volatility
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Detect risk alerts from dataset anomalies
 */
export async function detectRiskAlerts(dataset: Dataset): Promise<Alert[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const alerts: Alert[] = [];
  const { data, mappings } = dataset;
  
  if (!mappings || data.length < 5) return alerts;
  
  // Alert 1: Revenue decline detection
  if (mappings.revenue) {
    const recentRevenue = data.slice(-3).map(row => Number(row[mappings.revenue!]));
    const previousRevenue = data.slice(-6, -3).map(row => Number(row[mappings.revenue!]));
    
    const recentAvg = recentRevenue.reduce((sum, v) => sum + v, 0) / recentRevenue.length;
    const previousAvg = previousRevenue.reduce((sum, v) => sum + v, 0) / previousRevenue.length;
    
    const change = calculatePercentageChange(recentAvg, previousAvg);
    
    if (change < -10) {
      alerts.push({
        id: `A${Date.now()}_REV`,
        title: 'Significant Revenue Decline Detected',
        severity: change < -20 ? 'critical' : 'warning',
        department: 'Finance',
        impact: 'high',
        detectedDate: new Date().toISOString().split('T')[0],
        description: `Revenue decreased by ${Math.abs(change).toFixed(1)}% in recent period. Immediate investigation required.`,
        affectedMetrics: ['Revenue Growth', 'Cash Flow', 'Profitability']
      });
    }
  }
  
  // Alert 2: Customer retention risk
  if (mappings.retention) {
    const recentRetention = data.slice(-2).map(row => Number(row[mappings.retention!]));
    const avgRecent = recentRetention.reduce((sum, v) => sum + v, 0) / recentRetention.length;
    
    if (avgRecent < 75) {
      alerts.push({
        id: `A${Date.now()}_RET`,
        title: 'Customer Retention Below Threshold',
        severity: avgRecent < 65 ? 'critical' : 'warning',
        department: 'Sales',
        impact: 'high',
        detectedDate: new Date().toISOString().split('T')[0],
        description: `Customer retention rate at ${avgRecent.toFixed(1)}%, significantly below industry standard of 85%.`,
        affectedMetrics: ['Customer Retention', 'Revenue Stability', 'Growth Rate']
      });
    }
  }
  
  // Alert 3: Profit margin compression
  if (mappings.profit && mappings.revenue) {
    const margins = data.map(row => {
      const profit = Number(row[mappings.profit!]);
      const revenue = Number(row[mappings.revenue!]);
      return revenue > 0 ? (profit / revenue) * 100 : 0;
    }).filter(m => !isNaN(m));
    
    const recentMargin = margins.slice(-2).reduce((sum, v) => sum + v, 0) / 2;
    
    if (recentMargin < 15) {
      alerts.push({
        id: `A${Date.now()}_MAR`,
        title: 'Profit Margin Compression Detected',
        severity: recentMargin < 10 ? 'critical' : 'warning',
        department: 'Operations',
        impact: 'high',
        detectedDate: new Date().toISOString().split('T')[0],
        description: `Operating margin compressed to ${recentMargin.toFixed(1)}%. Cost optimization required.`,
        affectedMetrics: ['Operating Margin', 'Profitability', 'Cost Efficiency']
      });
    }
  }
  
  // Alert 4: Employee satisfaction decline
  if (mappings.satisfaction) {
    const recent = data.slice(-2).map(row => Number(row[mappings.satisfaction!]));
    const avgRecent = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    
    if (avgRecent < 6.5) {
      alerts.push({
        id: `A${Date.now()}_SAT`,
        title: 'Employee Satisfaction Declining',
        severity: avgRecent < 5.5 ? 'critical' : 'warning',
        department: 'Human Resources',
        impact: 'medium',
        detectedDate: new Date().toISOString().split('T')[0],
        description: `Employee satisfaction score at ${avgRecent.toFixed(1)}/10. Risk of increased turnover.`,
        affectedMetrics: ['Employee Satisfaction', 'Retention', 'Productivity']
      });
    }
  }
  
  return alerts;
}

/**
 * Predict financial loss over next 90 days
 */
export async function predictFinancialLoss(dataset: Dataset): Promise<{
  estimatedLoss: number;
  confidence: number;
  breakdown: { category: string; amount: number }[];
}> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const { data, mappings } = dataset;
  
  if (!mappings || data.length < 3) {
    return { estimatedLoss: 0, confidence: 0, breakdown: [] };
  }
  
  let totalLoss = 0;
  const breakdown: { category: string; amount: number }[] = [];
  
  // Revenue loss projection
  if (mappings.revenue) {
    const revenueStats = calculateStats(data, mappings.revenue);
    const recent = data.slice(-3).map(row => Number(row[mappings.revenue!]));
    const avgRecent = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    
    if (avgRecent < revenueStats.mean * 0.95) {
      const monthlyLoss = (revenueStats.mean - avgRecent) * 3; // 90 days projection
      totalLoss += monthlyLoss;
      breakdown.push({ category: 'Revenue Decline', amount: monthlyLoss });
    }
  }
  
  // Customer churn impact
  if (mappings.retention && mappings.revenue) {
    const retentionStats = calculateStats(data, mappings.retention);
    if (retentionStats.mean < 80) {
      const churnRate = (100 - retentionStats.mean) / 100;
      const avgRevenue = calculateStats(data, mappings.revenue).mean;
      const churnLoss = avgRevenue * churnRate * 0.3; // 30% of churned revenue
      totalLoss += churnLoss;
      breakdown.push({ category: 'Customer Churn', amount: churnLoss });
    }
  }
  
  // Operational inefficiency
  if (mappings.expenses && mappings.revenue) {
    const expenseStats = calculateStats(data, mappings.expenses);
    const revenueStats = calculateStats(data, mappings.revenue);
    const expenseRatio = expenseStats.mean / revenueStats.mean;
    
    if (expenseRatio > 0.75) {
      const inefficiencyLoss = revenueStats.mean * (expenseRatio - 0.70) * 3;
      totalLoss += inefficiencyLoss;
      breakdown.push({ category: 'Operational Inefficiency', amount: inefficiencyLoss });
    }
  }
  
  const confidence = Math.min(95, 60 + (data.length * 2)); // More data = higher confidence
  
  return {
    estimatedLoss: Math.round(totalLoss),
    confidence,
    breakdown
  };
}

/**
 * Compare two datasets and generate insights
 */
export async function compareDatasets(
  current: Dataset,
  previous: Dataset
): Promise<DatasetComparison> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const kpiChanges: KPIChange[] = [];
  const riskChanges: RiskChange[] = [];
  
  const currentMappings = current.mappings || {};
  const previousMappings = previous.mappings || {};
  
  // Compare revenue
  if (currentMappings.revenue && previousMappings.revenue) {
    const currentStats = calculateStats(current.data, currentMappings.revenue);
    const previousStats = calculateStats(previous.data, previousMappings.revenue);
    const change = calculatePercentageChange(currentStats.mean, previousStats.mean);
    
    kpiChanges.push({
      metric: 'Revenue',
      currentValue: currentStats.mean,
      previousValue: previousStats.mean,
      percentageChange: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    });
  }
  
  // Compare profit
  if (currentMappings.profit && previousMappings.profit) {
    const currentStats = calculateStats(current.data, currentMappings.profit);
    const previousStats = calculateStats(previous.data, previousMappings.profit);
    const change = calculatePercentageChange(currentStats.mean, previousStats.mean);
    
    kpiChanges.push({
      metric: 'Profit',
      currentValue: currentStats.mean,
      previousValue: previousStats.mean,
      percentageChange: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    });
  }
  
  // Compare retention
  if (currentMappings.retention && previousMappings.retention) {
    const currentStats = calculateStats(current.data, currentMappings.retention);
    const previousStats = calculateStats(previous.data, previousMappings.retention);
    const change = calculatePercentageChange(currentStats.mean, previousStats.mean);
    
    kpiChanges.push({
      metric: 'Customer Retention',
      currentValue: currentStats.mean,
      previousValue: previousStats.mean,
      percentageChange: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    });
  }
  
  // Determine overall trend
  const positiveChanges = kpiChanges.filter(k => k.direction === 'up').length;
  const negativeChanges = kpiChanges.filter(k => k.direction === 'down').length;
  
  let trendDirection: 'improving' | 'declining' | 'stable' = 'stable';
  if (positiveChanges > negativeChanges) trendDirection = 'improving';
  else if (negativeChanges > positiveChanges) trendDirection = 'declining';
  
  return {
    current,
    previous,
    changes: {
      kpiChanges,
      riskChanges,
      trendDirection
    }
  };
}

/**
 * Generate predictive insights
 */
export async function generatePredictiveInsights(dataset: Dataset): Promise<PredictiveInsight[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const insights: PredictiveInsight[] = [];
  const { data, mappings } = dataset;
  
  if (!mappings || data.length < 5) return insights;
  
  // Insight 1: Revenue forecast
  if (mappings.revenue) {
    const recent = data.slice(-3).map(row => Number(row[mappings.revenue!]));
    const trend = recent[recent.length - 1] - recent[0];
    
    if (trend < 0) {
      insights.push({
        id: 'PI_REV_001',
        title: 'Revenue Decline Trajectory',
        prediction: `Based on current trend, revenue may decline by ${formatNumber(Math.abs(trend * 3))} over next 90 days`,
        confidence: 78,
        timeframe: '90 days',
        estimatedImpact: Math.abs(trend * 3),
        category: 'financial',
        severity: 'warning'
      });
    }
  }
  
  // Insight 2: Churn risk escalation
  if (mappings.retention) {
    const retentionStats = calculateStats(data, mappings.retention);
    if (retentionStats.mean < 80) {
      const riskProbability = Math.round((100 - retentionStats.mean) * 1.2);
      insights.push({
        id: 'PI_CHU_001',
        title: 'Customer Churn Risk Escalation',
        prediction: `${riskProbability}% probability of accelerated churn if retention initiatives not implemented`,
        confidence: 82,
        timeframe: '60 days',
        estimatedImpact: 0,
        category: 'risk',
        severity: riskProbability > 30 ? 'critical' : 'warning'
      });
    }
  }
  
  // Insight 3: Operational efficiency opportunity
  if (mappings.expenses && mappings.revenue) {
    const expenseStats = calculateStats(data, mappings.expenses);
    const revenueStats = calculateStats(data, mappings.revenue);
    const currentRatio = (expenseStats.mean / revenueStats.mean) * 100;
    
    if (currentRatio > 70) {
      const savingsPotential = revenueStats.mean * ((currentRatio - 65) / 100);
      insights.push({
        id: 'PI_OPS_001',
        title: 'Cost Optimization Opportunity',
        prediction: `Potential to reduce operating costs by ${formatNumber(savingsPotential)} through efficiency improvements`,
        confidence: 71,
        timeframe: '120 days',
        estimatedImpact: savingsPotential,
        category: 'operational',
        severity: 'info'
      });
    }
  }
  
  return insights;
}

/**
 * Determine most vulnerable department (mock implementation)
 */
export function identifyVulnerableDepartment(dataset: Dataset): string {
  const { mappings } = dataset;
  
  // Simple heuristic based on available metrics
  if (mappings?.retention) {
    const retentionStats = calculateStats(dataset.data, mappings.retention);
    if (retentionStats.mean < 75) return 'Sales & Customer Success';
  }
  
  if (mappings?.satisfaction) {
    const satisfactionStats = calculateStats(dataset.data, mappings.satisfaction);
    if (satisfactionStats.mean < 6.5) return 'Human Resources';
  }
  
  if (mappings?.expenses && mappings?.revenue) {
    const expenseStats = calculateStats(dataset.data, mappings.expenses);
    const revenueStats = calculateStats(dataset.data, mappings.revenue);
    if (expenseStats.mean / revenueStats.mean > 0.75) return 'Operations';
  }
  
  return 'Finance';
}
