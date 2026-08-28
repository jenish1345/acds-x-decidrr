/**
 * Data Import Service
 * Handles importing real company data from various sources
 */

import Papa from 'papaparse';

export interface ImportedData {
  source: string;
  timestamp: string;
  data: any[];
  rowCount: number;
}

/**
 * Import data from CSV file
 */
export async function importCSV(file: File): Promise<ImportedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          source: file.name,
          timestamp: new Date().toISOString(),
          data: results.data,
          rowCount: results.data.length
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Import data from JSON file
 */
export async function importJSON(file: File): Promise<ImportedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const dataArray = Array.isArray(data) ? data : [data];
        
        resolve({
          source: file.name,
          timestamp: new Date().toISOString(),
          data: dataArray,
          rowCount: dataArray.length
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Parse and validate company metrics data
 */
export function parseCompanyMetrics(data: any[]): {
  revenue: number[];
  costs: number[];
  employees: number[];
  customers: number[];
  dates: string[];
} {
  const metrics = {
    revenue: [] as number[],
    costs: [] as number[],
    employees: [] as number[],
    customers: [] as number[],
    dates: [] as string[]
  };

  data.forEach(row => {
    if (row.date) metrics.dates.push(row.date);
    if (row.revenue) metrics.revenue.push(Number(row.revenue));
    if (row.costs) metrics.costs.push(Number(row.costs));
    if (row.employees) metrics.employees.push(Number(row.employees));
    if (row.customers) metrics.customers.push(Number(row.customers));
  });

  return metrics;
}

/**
 * Detect data type and structure
 */
export function detectDataType(data: any[]): {
  type: 'timeseries' | 'metrics' | 'events' | 'unknown';
  fields: string[];
  hasTimestamp: boolean;
  hasMetrics: boolean;
} {
  if (data.length === 0) {
    return { type: 'unknown', fields: [], hasTimestamp: false, hasMetrics: false };
  }

  const firstRow = data[0];
  const fields = Object.keys(firstRow);
  
  const hasTimestamp = fields.some(f => 
    f.toLowerCase().includes('date') || 
    f.toLowerCase().includes('time') ||
    f.toLowerCase().includes('timestamp')
  );

  const hasMetrics = fields.some(f => 
    f.toLowerCase().includes('revenue') ||
    f.toLowerCase().includes('cost') ||
    f.toLowerCase().includes('sales') ||
    f.toLowerCase().includes('count') ||
    f.toLowerCase().includes('amount')
  );

  let type: 'timeseries' | 'metrics' | 'events' | 'unknown' = 'unknown';
  
  if (hasTimestamp && hasMetrics) {
    type = 'timeseries';
  } else if (hasMetrics) {
    type = 'metrics';
  } else if (hasTimestamp) {
    type = 'events';
  }

  return { type, fields, hasTimestamp, hasMetrics };
}

/**
 * Generate sample CSV template
 */
export function generateSampleCSV(): string {
  const headers = ['date', 'revenue', 'costs', 'employees', 'customers', 'complaints', 'churn_rate'];
  const rows = [
    ['2024-01-01', '100000', '60000', '50', '1000', '5', '2.5'],
    ['2024-01-02', '102000', '61000', '50', '1020', '7', '2.3'],
    ['2024-01-03', '98000', '59000', '51', '1015', '4', '2.1'],
    ['2024-01-04', '101000', '60500', '51', '1030', '6', '2.4'],
    ['2024-01-05', '99000', '60000', '52', '1025', '5', '2.2'],
  ];

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

/**
 * Download sample CSV
 */
export function downloadSampleCSV() {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'company_metrics_sample.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
