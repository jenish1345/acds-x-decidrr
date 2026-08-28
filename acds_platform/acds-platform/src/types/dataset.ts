/**
 * Dataset Types for Dynamic AI-Powered Dashboard
 * Supports CSV/Excel uploads with historical comparison
 */

export interface DatasetMetadata {
  id: string;
  name: string;
  uploadDate: string;
  period: string; // e.g., "Q1 2025", "Jan 2026"
  rowCount: number;
  columnCount: number;
  fileType: 'csv' | 'xlsx';
  fileSize: number;
}

export interface DatasetColumn {
  name: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  sampleValues: string[];
  nullCount: number;
}

export interface Dataset {
  metadata: DatasetMetadata;
  columns: DatasetColumn[];
  data: Record<string, any>[];
  mappings?: ColumnMappings;
}

export interface ColumnMappings {
  revenue?: string;
  expenses?: string;
  profit?: string;
  employees?: string;
  customers?: string;
  retention?: string;
  satisfaction?: string;
  date?: string;
  department?: string;
}

export interface DatasetComparison {
  current: Dataset;
  previous: Dataset;
  changes: {
    kpiChanges: KPIChange[];
    riskChanges: RiskChange[];
    trendDirection: 'improving' | 'declining' | 'stable';
  };
}

export interface KPIChange {
  metric: string;
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  direction: 'up' | 'down' | 'stable';
}

export interface RiskChange {
  category: string;
  currentLevel: 'critical' | 'warning' | 'healthy';
  previousLevel: 'critical' | 'warning' | 'healthy';
  escalated: boolean;
}

export interface PredictiveInsight {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  estimatedImpact: number;
  category: 'financial' | 'operational' | 'strategic' | 'risk';
  severity: 'critical' | 'warning' | 'info';
}
