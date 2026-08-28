/**
 * Data Processing Utilities
 * Handles dataset parsing, validation, and transformation
 */

import type { DatasetColumn, ColumnMappings } from '../types/dataset';

/**
 * Detect column data type from sample values
 */
export function detectColumnType(values: any[]): 'number' | 'string' | 'date' | 'boolean' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';
  
  // Check if boolean
  const booleanValues = nonNullValues.filter(v => 
    v === true || v === false || v === 'true' || v === 'false' || v === 'yes' || v === 'no'
  );
  if (booleanValues.length / nonNullValues.length > 0.8) return 'boolean';
  
  // Check if number
  const numberValues = nonNullValues.filter(v => !isNaN(Number(v)));
  if (numberValues.length / nonNullValues.length > 0.8) return 'number';
  
  // Check if date
  const dateValues = nonNullValues.filter(v => !isNaN(Date.parse(String(v))));
  if (dateValues.length / nonNullValues.length > 0.8) return 'date';
  
  return 'string';
}

/**
 * Analyze dataset columns
 */
export function analyzeColumns(data: Record<string, any>[]): DatasetColumn[] {
  if (data.length === 0) return [];
  
  const columns: DatasetColumn[] = [];
  const columnNames = Object.keys(data[0]);
  
  for (const colName of columnNames) {
    const values = data.map(row => row[colName]);
    const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
    const sampleValues = values
      .filter(v => v !== null && v !== undefined && v !== '')
      .slice(0, 5)
      .map(v => String(v));
    
    columns.push({
      name: colName,
      type: detectColumnType(values),
      sampleValues,
      nullCount
    });
  }
  
  return columns;
}

/**
 * Auto-detect column mappings based on common naming patterns
 */
export function autoDetectMappings(columns: DatasetColumn[]): ColumnMappings {
  const mappings: ColumnMappings = {};
  
  const columnNames = columns.map(c => c.name.toLowerCase());
  
  // Revenue patterns
  const revenuePatterns = ['revenue', 'sales', 'income', 'turnover'];
  mappings.revenue = findColumnByPatterns(columnNames, revenuePatterns, columns);
  
  // Expenses patterns
  const expensePatterns = ['expense', 'cost', 'spending', 'expenditure'];
  mappings.expenses = findColumnByPatterns(columnNames, expensePatterns, columns);
  
  // Profit patterns
  const profitPatterns = ['profit', 'margin', 'earnings', 'net_income'];
  mappings.profit = findColumnByPatterns(columnNames, profitPatterns, columns);
  
  // Employee patterns
  const employeePatterns = ['employee', 'headcount', 'staff', 'workforce'];
  mappings.employees = findColumnByPatterns(columnNames, employeePatterns, columns);
  
  // Customer patterns
  const customerPatterns = ['customer', 'client', 'account'];
  mappings.customers = findColumnByPatterns(columnNames, customerPatterns, columns);
  
  // Retention patterns
  const retentionPatterns = ['retention', 'churn', 'renewal'];
  mappings.retention = findColumnByPatterns(columnNames, retentionPatterns, columns);
  
  // Satisfaction patterns
  const satisfactionPatterns = ['satisfaction', 'nps', 'score', 'rating'];
  mappings.satisfaction = findColumnByPatterns(columnNames, satisfactionPatterns, columns);
  
  // Date patterns
  const datePatterns = ['date', 'period', 'month', 'quarter', 'year'];
  mappings.date = findColumnByPatterns(columnNames, datePatterns, columns);
  
  // Department patterns
  const deptPatterns = ['department', 'dept', 'division', 'unit'];
  mappings.department = findColumnByPatterns(columnNames, deptPatterns, columns);
  
  return mappings;
}

function findColumnByPatterns(
  columnNames: string[], 
  patterns: string[], 
  columns: DatasetColumn[]
): string | undefined {
  for (const pattern of patterns) {
    const index = columnNames.findIndex(name => name.includes(pattern));
    if (index !== -1) {
      return columns[index].name;
    }
  }
  return undefined;
}

/**
 * Calculate statistical metrics from dataset
 */
export function calculateStats(data: Record<string, any>[], columnName: string) {
  const values = data
    .map(row => Number(row[columnName]))
    .filter(v => !isNaN(v));
  
  if (values.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  }
  
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1]
  };
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Format large numbers for display
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(decimals)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}
