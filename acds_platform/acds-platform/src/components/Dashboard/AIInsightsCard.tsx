import { Brain, TrendingDown, AlertTriangle, Target, Sparkles } from 'lucide-react';
import type { PredictiveInsight } from '../../types/dataset';
import { formatNumber } from '../../utils/dataProcessor';

interface AIInsightsCardProps {
  insights: PredictiveInsight[];
  predictedLoss: number;
  riskProbability: number;
  vulnerableDepartment: string;
  confidence: number;
  loading?: boolean;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insights,
  predictedLoss,
  riskProbability,
  vulnerableDepartment,
  confidence,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-corporate-navy mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">AI Predictive Insights</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-corporate-navy" />
          <span className="ml-3 text-gray-600">Analyzing data...</span>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="w-6 h-6 text-corporate-navy mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Predictive Insights</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Powered by statistical analysis • {confidence}% confidence
            </p>
          </div>
        </div>
        <div className="flex items-center text-corporate-navy">
          <Sparkles className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">Live Analysis</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Predicted 90-Day Loss */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-xs font-medium text-red-700 uppercase">90-Day Projection</span>
          </div>
          <p className="text-2xl font-bold text-red-900">
            ${formatNumber(predictedLoss)}
          </p>
          <p className="text-xs text-red-600 mt-1">Potential loss if trends continue</p>
        </div>

        {/* Risk Escalation Probability */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-xs font-medium text-yellow-700 uppercase">Risk Escalation</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {riskProbability}%
          </p>
          <p className="text-xs text-yellow-600 mt-1">Probability of worsening conditions</p>
        </div>

        {/* Most Vulnerable Department */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-xs font-medium text-blue-700 uppercase">Priority Focus</span>
          </div>
          <p className="text-lg font-bold text-blue-900 leading-tight">
            {vulnerableDepartment}
          </p>
          <p className="text-xs text-blue-600 mt-1">Requires immediate attention</p>
        </div>
      </div>

      {/* Predictive Insights List */}
      {insights.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Predictive Analysis
          </h4>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border rounded-lg p-4 ${getSeverityColor(insight.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-sm font-semibold">{insight.title}</h5>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-white bg-opacity-50">
                    {insight.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm mb-2">{insight.prediction}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">
                    {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)} Impact
                  </span>
                  <span className="text-gray-600">
                    Timeframe: {insight.timeframe}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No significant predictions at this time</p>
          <p className="text-xs mt-1">Upload more data for enhanced insights</p>
        </div>
      )}
    </div>
  );
};
