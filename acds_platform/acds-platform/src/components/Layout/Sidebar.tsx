import React from 'react';
import { LayoutDashboard, AlertTriangle, Search, TrendingUp, FileText, Grid, BarChart3, CreditCard, DollarSign, Upload, Database } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const menuItems = [
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
  { id: 'import', label: 'Import Real Data', icon: Upload },
  { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
  { id: 'pricing', label: 'Upgrade Plan', icon: DollarSign }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <aside className="w-64 bg-corporate-navy text-white flex-shrink-0">
      <nav className="py-6">
        {menuItems.map((item) => {
          if (item.id === 'divider') {
            return <div key="divider" className="my-4 border-t border-gray-600" />;
          }
          
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full px-6 py-3 flex items-center space-x-3 text-left transition-colors ${
                isActive 
                  ? 'bg-corporate-darkblue text-white border-l-4 border-white' 
                  : 'text-gray-300 hover:bg-corporate-darkblue hover:text-white'
              }`}
            >
              {Icon && <Icon size={20} />}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
