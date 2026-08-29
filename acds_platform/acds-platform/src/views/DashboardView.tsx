import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { HealthScore } from '../components/Dashboard/HealthScore';
import { KPICard } from '../components/Dashboard/KPICard';
import { AlertCard } from '../components/Alerts/AlertCard';
import { AIInsightsCard } from '../components/Dashboard/AIInsightsCard';
import { ComparisonView } from '../components/Dashboard/ComparisonView';
import { exportToPDF } from '../utils/pdfExport';
import { useDatasetStore } from '../store/datasetStore';
import { useDatasetAnalysis } from '../hooks/useDatasetAnalysis';
import { NoDatasetEmptyState } from '../components/Common/NoDatasetEmptyState';
import toast from 'react-hot-toast';

interface DashboardViewProps {
  onNavigate: (view: string, alertId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  // Get data from Zustand store
  const store = useDatasetStore();
  const currentDataset = store.currentDataset;
  const comparisonMode = store.comparisonMode;
  const comparisonData = store.comparisonData;
  
  // Use React Query hook for AI analysis
  const { data: analysisData, isLoading } = useDatasetAnalysis(currentDataset);
  
  if (!currentDataset) {
    return (
      <NoDatasetEmptyState
        title="Executive Dashboard"
        description="Upload your company's operational or financial dataset to view your real-time company health score, dynamic KPIs, and automated risk alerts."
        onNavigate={onNavigate}
      />
    );
  }

  // Use dynamic data computed from real dataset
  const displayHealth = store.dynamicHealth || {
    overallScore: 0,
    riskStatus: 'healthy',
    lastUpdated: new Date().toISOString(),
    trend: 'stable'
  };
  const displayKPIs = store.dynamicKPIs || [];
  const displayAlerts = store.dynamicAlerts || [];
  const hasAIData = store.predictiveInsights.length > 0;

  const handleExportPDF = () => {
    toast.loading('Generating PDF report...');
    
    try {
      exportToPDF({
        companyName: currentDataset?.metadata.name || 'Company Dashboard',
        reportDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        health: displayHealth,
        kpis: displayKPIs,
        alerts: displayAlerts,
        predictedLoss: store.predictedLoss,
        insights: store.predictiveInsights.map(pi => ({
          id: pi.id,
          title: pi.title,
          description: pi.prediction,
          confidence: pi.confidence,
          timeframe: pi.timeframe,
          type: (pi.category === 'risk' ? 'risk' : 'opportunity') as 'risk' | 'opportunity' | 'trend',
          impact: (pi.severity === 'critical' ? 'high' : 'medium') as 'high' | 'medium' | 'low'
        })),
        riskProbability: store.riskProbability,
        vulnerableDepartment: store.vulnerableDepartment
      });
      
      toast.dismiss();
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF report');
      console.error('PDF export error:', error);
    }
  };

  return (
    <motion.div 
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827] mb-1">Executive Dashboard</h1>
          <p className="text-sm text-[#6b7280]">
            {currentDataset 
              ? `AI-powered insights from ${currentDataset.metadata.name}` 
              : 'Real-time company health and risk monitoring'}
          </p>
          {isLoading && (
            <p className="text-sm text-[#1f2937] mt-1">
              Analyzing dataset with AI...
            </p>
          )}
        </div>
        <motion.button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 rounded-md bg-[#E5322D] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#cc2923] transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          Export PDF
        </motion.button>
      </div>

      {/* Comparison Mode */}
      {comparisonMode && comparisonData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ComparisonView comparison={comparisonData} />
        </motion.div>
      )}

      {/* Health Score & KPIs */}
      <div className="grid grid-cols-3 gap-6">
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <HealthScore health={displayHealth} />
        </motion.div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {displayKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <KPICard kpi={kpi} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Predictive Insights */}
      {hasAIData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AIInsightsCard
            insights={store.predictiveInsights}
            predictedLoss={store.predictedLoss}
            riskProbability={store.riskProbability}
            vulnerableDepartment={store.vulnerableDepartment}
            confidence={store.aiConfidence}
          />
        </motion.div>
      )}

      {/* Critical Alerts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-sm text-corporate-navy hover:text-corporate-darkblue font-medium"
          >
            View All Alerts →
          </button>
        </div>
        <div className="space-y-4">
          {displayAlerts.slice(0, 3).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <AlertCard
                alert={alert}
                onViewDetails={(id) => onNavigate('analysis', id)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
