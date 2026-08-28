import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import type { DatasetComparison } from '../../types/dataset';
import { formatNumber } from '../../utils/dataProcessor';

interface ComparisonViewProps {
  comparison: DatasetComparison;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ comparison }) => {
  const { changes } = comparison;
  const { kpiChanges, trendDirection } = changes;

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'improving':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-6 h-6 text-red-600" />;
      default:
        return <Minus className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'improving': return 'bg-green-50 border-green-200 text-green-800';
      case 'declining': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getChangeIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (direction: 'up' | 'down' | 'stable', metric: string) => {
    // For most metrics, up is good. But for some (like churn), down is good
    const reverseMetrics = ['churn', 'cost', 'expense'];
    const isReverse = reverseMetrics.some(m => metric.toLowerCase().includes(m));
    
    if (direction === 'stable') return 'text-gray-600';
    
    const isPositive = isReverse ? direction === 'down' : direction === 'up';
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dataset Comparison</h3>
          <p className="text-sm text-gray-600 mt-1">
            {comparison.previous.metadata.name} vs {comparison.current.metadata.name}
          </p>
        </div>
        <div className={`flex items-center px-4 py-2 rounded-lg border ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-2 font-semibold capitalize">{trendDirection}</span>
        </div>
      </div>

      {/* Period Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Previous Period</p>
          <p className="text-sm font-semibold text-gray-900">
            {comparison.previous.metadata.period}
          </p>
          <p className="text-xs text-gray-600">
            {comparison.previous.metadata.rowCount} data points
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Current Period</p>
          <p className="text-sm font-semibold text-gray-900">
            {comparison.current.metadata.period}
          </p>
          <p className="text-xs text-gray-600">
            {comparison.current.metadata.rowCount} data points
          </p>
        </div>
      </div>

      {/* KPI Changes */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Performance Indicators</h4>
        <div className="space-y-3">
          {kpiChanges.map((kpi, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center flex-1">
                {getChangeIcon(kpi.direction)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{kpi.metric}</p>
                  <p className="text-xs text-gray-600">
                    {formatNumber(kpi.previousValue)} → {formatNumber(kpi.currentValue)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getChangeColor(kpi.direction, kpi.metric)}`}>
                  {kpi.percentageChange > 0 ? '+' : ''}
                  {kpi.percentageChange.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">Change</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {kpiChanges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No comparable metrics found</p>
          <p className="text-xs mt-1">Ensure both datasets have similar column structures</p>
        </div>
      )}

      {/* Summary */}
      {kpiChanges.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Analysis Summary:</span>{' '}
            {trendDirection === 'improving' && 
              'Overall performance shows positive momentum across key metrics. Continue current strategies.'}
            {trendDirection === 'declining' && 
              'Performance indicators show concerning trends. Immediate strategic review recommended.'}
            {trendDirection === 'stable' && 
              'Metrics remain relatively stable. Monitor for emerging patterns.'}
          </p>
        </div>
      )}
    </div>
  );
};
