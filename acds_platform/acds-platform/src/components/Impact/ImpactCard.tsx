import React from 'react';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import type { BusinessImpact } from '../../types';

interface ImpactCardProps {
  impact: BusinessImpact;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ impact }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: impact.financialImpact.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card-enterprise p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="text-corporate-navy" size={20} />
              <h3 className="text-sm font-semibold text-gray-900">ESTIMATED FINANCIAL IMPACT</h3>
            </div>
            <p className="text-3xl font-semibold text-status-critical mb-2">
              {formatCurrency(impact.financialImpact.estimated)}
            </p>
            <p className="text-xs text-gray-600">
              Range: {formatCurrency(impact.financialImpact.range.min)} - {formatCurrency(impact.financialImpact.range.max)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-2 border-gray-300 pl-4">
              <p className="text-xs text-gray-500 mb-1">AFFECTED REVENUE</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(impact.affectedRevenue)}
              </p>
            </div>
            <div className="border-l-2 border-gray-300 pl-4">
              <p className="text-xs text-gray-500 mb-1">TIMEFRAME</p>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-gray-600" />
                <p className="text-sm font-medium text-gray-900">{impact.timeframe}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="text-corporate-navy" size={20} />
            <h3 className="text-sm font-semibold text-gray-900">PROBABILITY</h3>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-5xl font-semibold text-corporate-navy">{impact.probability}%</p>
                <p className="text-xs text-gray-600 mt-2">Likelihood</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-sm h-2 mt-4">
              <div 
                className="bg-status-critical h-2 rounded-sm transition-all"
                style={{ width: `${impact.probability}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
