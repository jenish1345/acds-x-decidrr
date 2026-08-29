import React from 'react';
import { Database, UploadCloud, ArrowRight } from 'lucide-react';

interface NoDatasetEmptyStateProps {
  title: string;
  description?: string;
  onNavigate?: (view: string) => void;
}

export const NoDatasetEmptyState: React.FC<NoDatasetEmptyStateProps> = ({
  title,
  description = 'This view requires real company data to generate autonomous diagnostics. No mock data is used.',
  onNavigate
}) => {
  return (
    <div className="min-h-[480px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-5 text-amber-600">
          <Database size={28} />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Real Data Policy</p>
          <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
            <li>Zero mocked data is generated or assumed</li>
            <li>All metrics are computed mathematically from your files</li>
            <li>Supports CSV and Excel business spreadsheets</li>
          </ul>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('upload')}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E5322D] hover:bg-[#c92925] text-white font-medium text-sm transition-colors shadow-sm"
          >
            <UploadCloud size={18} />
            <span>Upload Company Dataset</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
