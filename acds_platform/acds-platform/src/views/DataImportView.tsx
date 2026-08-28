import { useState } from 'react';
import { Upload, Download, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { importCSV, importJSON, detectDataType, downloadSampleCSV, parseCompanyMetrics, ImportedData } from '../services/dataImportService';
import { AnomalyDetector } from '../ml/anomalyDetector';

export const DataImportView: React.FC = () => {
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      let data: ImportedData;

      if (file.name.endsWith('.csv')) {
        data = await importCSV(file);
      } else if (file.name.endsWith('.json')) {
        data = await importJSON(file);
      } else {
        throw new Error('Unsupported file format. Please upload CSV or JSON.');
      }

      setImportedData(data);
      
      // Analyze the data
      analyzeData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to import file');
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeData = (data: ImportedData) => {
    const dataType = detectDataType(data.data);
    
    // Try to parse as company metrics
    try {
      const metrics = parseCompanyMetrics(data.data);
      
      // Run anomaly detection on revenue
      if (metrics.revenue.length > 10) {
        const detector = new AnomalyDetector();
        detector.train(metrics.revenue.slice(0, -1));
        const latestRevenue = metrics.revenue[metrics.revenue.length - 1];
        const anomalyResult = detector.detect(latestRevenue);
        
        setAnalysis({
          dataType,
          metrics,
          anomaly: anomalyResult,
          insights: generateInsights(metrics, anomalyResult)
        });
      } else {
        setAnalysis({
          dataType,
          metrics,
          insights: ['Not enough data points for anomaly detection (need at least 10)']
        });
      }
    } catch (err) {
      setAnalysis({
        dataType,
        insights: ['Data structure detected but could not parse metrics automatically']
      });
    }
  };

  const generateInsights = (metrics: any, anomaly: any): string[] => {
    const insights: string[] = [];
    
    if (anomaly.isAnomaly) {
      insights.push(`🚨 ANOMALY DETECTED: Latest revenue is ${anomaly.confidence}% unusual compared to historical data`);
    } else {
      insights.push(`✅ Revenue is within normal range (Z-score: ${anomaly.score.toFixed(2)})`);
    }

    if (metrics.revenue.length > 0) {
      const avgRevenue = metrics.revenue.reduce((a: number, b: number) => a + b, 0) / metrics.revenue.length;
      const latestRevenue = metrics.revenue[metrics.revenue.length - 1];
      const change = ((latestRevenue - avgRevenue) / avgRevenue * 100).toFixed(1);
      insights.push(`📊 Latest revenue is ${change}% ${Number(change) > 0 ? 'above' : 'below'} average`);
    }

    if (metrics.costs.length > 0 && metrics.revenue.length > 0) {
      const latestMargin = ((metrics.revenue[metrics.revenue.length - 1] - metrics.costs[metrics.costs.length - 1]) / metrics.revenue[metrics.revenue.length - 1] * 100).toFixed(1);
      insights.push(`💰 Current operating margin: ${latestMargin}%`);
    }

    if (metrics.customers.length > 1) {
      const growth = ((metrics.customers[metrics.customers.length - 1] - metrics.customers[0]) / metrics.customers[0] * 100).toFixed(1);
      insights.push(`📈 Customer growth: ${growth}% over period`);
    }

    return insights;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Import Real Data</h1>
        <p className="text-sm text-gray-600">Upload your company data to validate the diagnostic system</p>
      </div>

      {/* Upload Section */}
      <div className="card-enterprise p-8">
        <div className="text-center">
          <Upload className="mx-auto text-corporate-navy mb-4" size={48} />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Company Data</h2>
          <p className="text-sm text-gray-600 mb-6">
            Supported formats: CSV, JSON
          </p>

          <div className="flex items-center justify-center space-x-4">
            <label className="btn-primary cursor-pointer">
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              {isProcessing ? 'Processing...' : 'Choose File'}
            </label>

            <button
              onClick={downloadSampleCSV}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Download Sample CSV</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Don't have data? Download our sample CSV to see how it works
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card-enterprise p-4 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-status-critical mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-gray-900">Import Error</p>
              <p className="text-sm text-gray-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Import Success */}
      {importedData && (
        <div className="card-enterprise p-6 bg-green-50 border-green-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-status-healthy mt-0.5" size={24} />
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900 mb-2">Data Imported Successfully!</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Source</p>
                  <p className="font-medium text-gray-900">{importedData.source}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rows</p>
                  <p className="font-medium text-gray-900">{importedData.rowCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Imported</p>
                  <p className="font-medium text-gray-900">
                    {new Date(importedData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Data Type Detection */}
          <div className="card-enterprise p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Data Analysis</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">DATA TYPE</p>
                <p className="text-sm font-medium text-gray-900 uppercase">{analysis.dataType.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">FIELDS DETECTED</p>
                <p className="text-sm font-medium text-gray-900">{analysis.dataType.fields.length}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.dataType.fields.map((field: string) => (
                <span key={field} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm">
                  {field}
                </span>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card-enterprise p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="text-corporate-navy" size={20} />
              <h3 className="text-base font-semibold text-gray-900">AI-Powered Insights</h3>
            </div>
            <div className="space-y-3">
              {analysis.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-sm">
                  <FileText size={16} className="text-gray-600 mt-0.5" />
                  <p className="text-sm text-gray-900">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Detection Results */}
          {analysis.anomaly && (
            <div className={`card-enterprise p-6 ${
              analysis.anomaly.isAnomaly ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                {analysis.anomaly.isAnomaly ? '🚨 Anomaly Detected' : '✅ Normal Pattern'}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Z-SCORE</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.anomaly.score.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">CONFIDENCE</p>
                  <p className="text-2xl font-semibold text-gray-900">{analysis.anomaly.confidence}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">STATUS</p>
                  <p className={`text-lg font-semibold ${
                    analysis.anomaly.isAnomaly ? 'text-status-critical' : 'text-status-healthy'
                  }`}>
                    {analysis.anomaly.isAnomaly ? 'UNUSUAL' : 'NORMAL'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Summary */}
          {analysis.metrics && (
            <div className="card-enterprise p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Metrics Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.metrics.revenue.length > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-sm">
                    <p className="text-xs text-gray-600 mb-1">REVENUE POINTS</p>
                    <p className="text-2xl font-semibold text-gray-900">{analysis.metrics.revenue.length}</p>
                  </div>
                )}
                {analysis.metrics.costs.length > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-sm">
                    <p className="text-xs text-gray-600 mb-1">COST POINTS</p>
                    <p className="text-2xl font-semibold text-gray-900">{analysis.metrics.costs.length}</p>
                  </div>
                )}
                {analysis.metrics.employees.length > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-sm">
                    <p className="text-xs text-gray-600 mb-1">EMPLOYEE DATA</p>
                    <p className="text-2xl font-semibold text-gray-900">{analysis.metrics.employees.length}</p>
                  </div>
                )}
                {analysis.metrics.customers.length > 0 && (
                  <div className="text-center p-4 bg-gray-50 rounded-sm">
                    <p className="text-xs text-gray-600 mb-1">CUSTOMER DATA</p>
                    <p className="text-2xl font-semibold text-gray-900">{analysis.metrics.customers.length}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="card-enterprise p-6 bg-blue-50 border-blue-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Expected Data Format</h3>
        <p className="text-sm text-gray-700 mb-4">
          Your CSV or JSON should include columns like:
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-status-healthy" />
            <span className="text-gray-700">date (YYYY-MM-DD)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-status-healthy" />
            <span className="text-gray-700">revenue (numbers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-status-healthy" />
            <span className="text-gray-700">costs (numbers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-status-healthy" />
            <span className="text-gray-700">employees (numbers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-status-healthy" />
            <span className="text-gray-700">customers (numbers)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-status-healthy" />
            <span className="text-gray-700">Any other metrics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
