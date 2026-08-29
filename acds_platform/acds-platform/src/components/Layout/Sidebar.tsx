import React from 'react';
import { LayoutDashboard, AlertTriangle, Search, TrendingUp, FileText, Grid, BarChart3, Upload, Database, LineChart } from 'lucide-react';
import { useDatasetStore } from '../../store/datasetStore';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const DATASET_DEPENDENT_VIEWS = new Set([
  'dashboard',
  'alerts',
  'analysis',
  'impact',
  'recommendations',
  'heatmap',
  'report'
]);

const menuItems = [
  { id: 'financial', label: 'Financial Intelligence', icon: LineChart, accent: true },
  { id: 'divider1', label: '', icon: null },
  { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'alerts', label: 'Risk & Alerts', icon: AlertTriangle },
  { id: 'analysis', label: 'Root Cause Analysis', icon: Search },
  { id: 'impact', label: 'Business Impact', icon: TrendingUp },
  { id: 'recommendations', label: 'Recommendations', icon: FileText },
  { id: 'heatmap', label: 'Department Heatmap', icon: Grid },
  { id: 'report', label: 'Executive Report', icon: BarChart3 },
  { id: 'integration', label: 'B2B2C Integration', icon: LayoutDashboard },
  { id: 'divider', label: '', icon: null },
  { id: 'upload', label: 'Upload Dataset', icon: Database },
  { id: 'import', label: 'Import Real Data', icon: Upload }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const currentDataset = useDatasetStore((state) => state.currentDataset);
  const hasDataset = Boolean(currentDataset);

  const visibleMenuItems = menuItems.filter((item) => {
    if (!hasDataset && DATASET_DEPENDENT_VIEWS.has(item.id)) {
      return false;
    }
    return true;
  });

  return (
    <aside className="w-64 bg-[#1f2937] text-white flex-shrink-0 border-r border-[#2f3b4f] flex flex-col justify-between">
      <nav className="py-5">
        {visibleMenuItems.map((item) => {
          if (item.id === 'divider' || item.id === 'divider1') {
            return <div key={item.id} className="my-4 border-t border-[#334155]" />;
          }

          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isAccent = (item as { accent?: boolean }).accent;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full px-5 py-2.5 flex items-center gap-3 text-left transition-colors ${
                isActive
                  ? isAccent
                    ? 'bg-[#E5322D]/20 text-white border-r-2 border-[#E5322D]'
                    : 'bg-[#2d3d55] text-white'
                  : 'text-[#dbe2ea] hover:bg-[#2b3a4d] hover:text-white'
              }`}
            >
              {Icon && <Icon size={18} className={isActive ? (isAccent ? 'text-[#E5322D]' : 'text-[#f8fafc]') : 'text-[#cbd5e1]'} />}
              <span className="text-sm font-medium">{item.label}</span>
              {isAccent && !isActive && <span className="ml-auto text-[9px] font-bold bg-[#E5322D]/20 text-[#E5322D] px-1.5 py-0.5 rounded-full uppercase tracking-wide">AI</span>}
            </button>
          );
        })}
      </nav>
      {!hasDataset && (
        <div className="p-4 m-3 bg-[#111827]/60 rounded-lg border border-[#374151]">
          <p className="text-xs font-medium text-[#9ca3af]">Diagnostic Suite</p>
          <p className="text-[11px] text-[#6b7280] mt-1">Upload a real dataset to unlock executive dashboard, alerts & root cause analysis.</p>
          <button
            onClick={() => onNavigate('upload')}
            className="mt-2.5 w-full text-xs font-semibold py-1.5 px-2.5 rounded bg-[#374151] hover:bg-[#4b5563] text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Database size={13} />
            <span>Upload Dataset</span>
          </button>
        </div>
      )}
    </aside>
  );
};
