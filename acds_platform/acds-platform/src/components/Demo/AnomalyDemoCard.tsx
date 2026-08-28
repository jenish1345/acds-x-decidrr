import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { AnomalyDetector } from '../../ml/anomalyDetector';

export const AnomalyDemoCard: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [testValue, setTestValue] = useState<number>(100000);

  // Historical revenue data (last 10 days)
  const historicalData = [100000, 102000, 98000, 101000, 99000, 103000, 97000, 100000, 102000, 98000];
  
  const detector = new AnomalyDetector();
  detector.train(historicalData);

  useEffect(() => {
    const detectionResult = detector.detect(testValue);
    setResult(detectionResult);
  }, [testValue]);

  const mean = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
  const formatCurrency = (val: number) => `$${(val / 1000).toFixed(0)}k`;

  return (
    <div className="card-enterprise p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="text-corporate-navy" size={20} />
        <h3 className="text-base font-semibold text-gray-900">
          Anomaly Detection Demo (Z-Score Method)
        </h3>
      </div>

      {/* Historical Data */}
      <div className="mb-6">
        <p className="text-xs text-gray-600 mb-2">HISTORICAL REVENUE (LAST 10 DAYS)</p>
        <div className="flex flex-wrap gap-2">
          {historicalData.map((val, idx) => (
            <div key={idx} className="px-3 py-1 bg-gray-100 rounded-sm text-xs font-medium text-gray-700">
              {formatCurrency(val)}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Average: {formatCurrency(mean)} | Range: {formatCurrency(Math.min(...historicalData))} - {formatCurrency(Math.max(...historicalData))}
        </p>
      </div>

      {/* Test Input */}
      <div className="mb-6">
        <label className="text-xs text-gray-600 mb-2 block">TEST NEW VALUE (TODAY'S REVENUE)</label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="50000"
            max="250000"
            step="10000"
            value={testValue}
            onChange={(e) => setTestValue(Number(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            value={testValue}
            onChange={(e) => setTestValue(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-sm text-sm"
          />
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-2">{formatCurrency(testValue)}</p>
      </div>

      {/* Result */}
      {result && (
        <div className={`border-2 rounded-sm p-4 ${
          result.isAnomaly 
            ? 'bg-red-50 border-red-300' 
            : 'bg-green-50 border-green-300'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {result.isAnomaly ? (
                <AlertCircle className="text-status-critical" size={24} />
              ) : (
                <TrendingUp className="text-status-healthy" size={24} />
              )}
              <div>
                <p className={`text-lg font-semibold ${
                  result.isAnomaly ? 'text-status-critical' : 'text-status-healthy'
                }`}>
                  {result.isAnomaly ? '🚨 ANOMALY DETECTED' : '✅ NORMAL'}
                </p>
                <p className="text-xs text-gray-600">
                  {result.isAnomaly 
                    ? 'This value is unusual compared to historical data' 
                    : 'This value is within normal range'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Z-SCORE</p>
              <p className="text-2xl font-semibold text-gray-900">{result.score.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Standard deviations</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">CONFIDENCE</p>
              <p className="text-2xl font-semibold text-gray-900">{result.confidence.toFixed(0)}%</p>
              <p className="text-xs text-gray-500">Detection certainty</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">DEVIATION</p>
              <p className="text-2xl font-semibold text-gray-900">
                {((testValue - mean) / mean * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">From average</p>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2">POSITION RELATIVE TO NORMAL RANGE</p>
            <div className="relative h-8 bg-gray-200 rounded-sm overflow-hidden">
              {/* Normal range (±2σ) */}
              <div 
                className="absolute h-full bg-green-200"
                style={{ 
                  left: '25%', 
                  width: '50%' 
                }}
              />
              {/* Mean line */}
              <div 
                className="absolute h-full w-0.5 bg-gray-700"
                style={{ left: '50%' }}
              />
              {/* Current value */}
              <div 
                className={`absolute h-full w-1 ${result.isAnomaly ? 'bg-red-600' : 'bg-green-600'}`}
                style={{ 
                  left: `${Math.min(Math.max((testValue - 50000) / (250000 - 50000) * 100, 0), 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$50k</span>
              <span className="text-gray-700 font-medium">Normal Range</span>
              <span>$250k</span>
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>How it works:</strong> The Z-score measures how many standard deviations a value is from the mean. 
          Values beyond ±2 standard deviations (Z-score &gt; 2) are flagged as anomalies. 
          This method is fast, simple, and requires no ML libraries.
        </p>
      </div>

      {/* Quick Test Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setTestValue(100000)}
          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-sm hover:bg-green-200"
        >
          Normal ($100k)
        </button>
        <button
          onClick={() => setTestValue(150000)}
          className="px-3 py-1 text-xs bg-amber-100 text-amber-800 rounded-sm hover:bg-amber-200"
        >
          High ($150k)
        </button>
        <button
          onClick={() => setTestValue(250000)}
          className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-sm hover:bg-red-200"
        >
          Anomaly ($250k)
        </button>
        <button
          onClick={() => setTestValue(50000)}
          className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-sm hover:bg-red-200"
        >
          Low ($50k)
        </button>
      </div>
    </div>
  );
};
