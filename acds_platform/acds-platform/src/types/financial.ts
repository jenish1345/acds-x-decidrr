/**
 * Financial data types for the ACDS Financial Intelligence Dashboard
 */

export interface FinancialMetric {
  period: string; // e.g. "Q1 2024"
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  totalAssets: number;
  totalEquity: number;
  totalDebt: number;
  ebitda: number;
}

export interface DuPontComponents {
  netProfitMargin: number;      // Net Income / Revenue
  assetTurnover: number;        // Revenue / Total Assets
  equityMultiplier: number;     // Total Assets / Total Equity
  roe: number;                  // Derived: margin × turnover × multiplier
  label: string;
}

export interface MonteCarloResult {
  simulations: number[][];      // Each inner array is one simulation path
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  finalDistribution: number[];  // Final values of all simulations
  expectedValue: number;
  riskOfLoss: number;           // % of simulations ending below starting value
}

export interface MLPrediction {
  period: string;
  predicted: number;
  lower: number;
  upper: number;
  confidence: number;
  model: 'gradient_boosting' | 'random_forest' | 'ensemble';
}

export interface GeminiInsight {
  summary: string;
  keyMetrics: { label: string; value: string; sentiment: 'positive' | 'negative' | 'neutral' }[];
  risks: string[];
  opportunities: string[];
  recommendation: string;
  extractedMetrics?: FinancialMetric[];
  rawText: string;
}

export interface FinancialDataStore {
  metrics: FinancialMetric[];
  geminiInsight: GeminiInsight | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  activeSimulation: MonteCarloResult | null;
  mlPredictions: MLPrediction[];
  dupont: DuPontComponents[];
  selectedCompany: string;
}
