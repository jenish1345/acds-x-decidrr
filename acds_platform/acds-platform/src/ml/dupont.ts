/**
 * DuPont Analysis Engine
 *
 * Breaks down Return on Equity (ROE) into three multiplicative drivers:
 *   ROE = Net Profit Margin × Asset Turnover × Equity Multiplier
 *
 * This tells the user *why* a company is profitable (or not):
 *   - High margin but low turnover → premium pricing, slow volume
 *   - High turnover but low margin → commodity / high-volume business
 *   - High multiplier → leveraged; amplifies returns but increases risk
 */

import type { FinancialMetric, DuPontComponents } from '../types/financial';

/**
 * Compute DuPont components for a single period
 */
export function computeDuPont(metric: FinancialMetric): DuPontComponents {
  const netProfitMargin =
    metric.revenue > 0 ? metric.netIncome / metric.revenue : 0;

  const assetTurnover =
    metric.totalAssets > 0 ? metric.revenue / metric.totalAssets : 0;

  const equityMultiplier =
    metric.totalEquity > 0 ? metric.totalAssets / metric.totalEquity : 0;

  const roe = netProfitMargin * assetTurnover * equityMultiplier;

  return {
    netProfitMargin: parseFloat((netProfitMargin * 100).toFixed(2)),   // as %
    assetTurnover: parseFloat(assetTurnover.toFixed(3)),
    equityMultiplier: parseFloat(equityMultiplier.toFixed(3)),
    roe: parseFloat((roe * 100).toFixed(2)),                            // as %
    label: metric.period,
  };
}

/**
 * Compute DuPont for a series of periods
 */
export function computeDuPontSeries(metrics: FinancialMetric[]): DuPontComponents[] {
  return metrics.map(computeDuPont);
}

/**
 * Produce a plain-English diagnosis of the DuPont breakdown
 * (Used in the insights card to hide ML complexity from the user)
 */
export function getDuPontDiagnosis(d: DuPontComponents): string {
  const parts: string[] = [];

  if (d.netProfitMargin >= 15) {
    parts.push('strong pricing power');
  } else if (d.netProfitMargin >= 5) {
    parts.push('moderate profit margins');
  } else {
    parts.push('thin profit margins — cost pressure likely');
  }

  if (d.assetTurnover >= 1.5) {
    parts.push('highly efficient asset utilization');
  } else if (d.assetTurnover >= 0.7) {
    parts.push('adequate asset efficiency');
  } else {
    parts.push('underutilized assets — capital could be redeployed');
  }

  if (d.equityMultiplier >= 3) {
    parts.push('high financial leverage (amplifies both gains and losses)');
  } else if (d.equityMultiplier >= 1.5) {
    parts.push('moderate leverage');
  } else {
    parts.push('conservatively financed');
  }

  return parts.join(', ') + '.';
}
