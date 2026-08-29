/**
 * Sample financial data for the Financial Dashboard.
 * Based on realistic public-company-style quarterly data.
 * In production this would come from the Gemini document analysis or API.
 */

import type { FinancialMetric } from '../types/financial';

export const sampleFinancialMetrics: FinancialMetric[] = [
  {
    period: 'Q1 2023',
    revenue: 42500000,
    grossProfit: 18700000,
    operatingIncome: 7200000,
    netIncome: 5100000,
    totalAssets: 210000000,
    totalEquity: 88000000,
    totalDebt: 62000000,
    ebitda: 9800000,
  },
  {
    period: 'Q2 2023',
    revenue: 45800000,
    grossProfit: 20200000,
    operatingIncome: 8100000,
    netIncome: 5700000,
    totalAssets: 215000000,
    totalEquity: 91000000,
    totalDebt: 60000000,
    ebitda: 10500000,
  },
  {
    period: 'Q3 2023',
    revenue: 49100000,
    grossProfit: 22100000,
    operatingIncome: 9300000,
    netIncome: 6500000,
    totalAssets: 218000000,
    totalEquity: 94000000,
    totalDebt: 58000000,
    ebitda: 11800000,
  },
  {
    period: 'Q4 2023',
    revenue: 54200000,
    grossProfit: 24900000,
    operatingIncome: 11200000,
    netIncome: 7900000,
    totalAssets: 225000000,
    totalEquity: 98000000,
    totalDebt: 56000000,
    ebitda: 13600000,
  },
  {
    period: 'Q1 2024',
    revenue: 51300000,
    grossProfit: 23400000,
    operatingIncome: 10100000,
    netIncome: 7200000,
    totalAssets: 228000000,
    totalEquity: 102000000,
    totalDebt: 55000000,
    ebitda: 12900000,
  },
  {
    period: 'Q2 2024',
    revenue: 56700000,
    grossProfit: 26200000,
    operatingIncome: 12400000,
    netIncome: 8800000,
    totalAssets: 234000000,
    totalEquity: 107000000,
    totalDebt: 53000000,
    ebitda: 14800000,
  },
  {
    period: 'Q3 2024',
    revenue: 61400000,
    grossProfit: 28900000,
    operatingIncome: 14100000,
    netIncome: 10100000,
    totalAssets: 241000000,
    totalEquity: 113000000,
    totalDebt: 51000000,
    ebitda: 16500000,
  },
  {
    period: 'Q4 2024',
    revenue: 67800000,
    grossProfit: 32200000,
    operatingIncome: 16400000,
    netIncome: 11800000,
    totalAssets: 248000000,
    totalEquity: 120000000,
    totalDebt: 49000000,
    ebitda: 18900000,
  },
];

export const COMPANY_NAMES = ['ACDS Corp', 'Sample Inc', 'TechVenture Ltd'];
