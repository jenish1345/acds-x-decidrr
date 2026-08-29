import { useState, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { DataImportView } from './views/DataImportView';
import { DataUploadViewEnhanced } from './views/DataUploadViewEnhanced';
import { DashboardView } from './views/DashboardView';
import { FinancialView } from './views/FinancialView';
import { AlertsView } from './views/AlertsView';
import { AnalysisView } from './views/AnalysisView';
import { ImpactView } from './views/ImpactView';
import { RecommendationsView } from './views/RecommendationsView';
import { HeatmapView } from './views/HeatmapView';
import { ReportView } from './views/ReportView';
import { IntegrationView } from './views/IntegrationView';
import { currentUser } from './data/user';
import { useDatasetStore } from './store/datasetStore';
import type { Dataset } from './types/dataset';

type ViewType = 'financial' | 'dashboard' | 'alerts' | 'analysis' | 'impact' | 'recommendations' | 'heatmap' | 'report' | 'import' | 'upload' | 'integration';
type AppState = 'login' | 'signup' | 'pricing' | 'trial' | 'authenticated';

function App() {
  const [appState, setAppState] = useState<AppState>('authenticated');
  const [activeView, setActiveView] = useState<ViewType>('financial');
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>();
  
  // Use Zustand store for centralized state management
  const store = useDatasetStore();

  // Handle dataset upload - now managed by Zustand store
  const handleDatasetUploaded = (dataset: Dataset) => {
    store.addDataset(dataset);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setAppState('authenticated');
    setActiveView('dashboard');
    store.resetDynamicData();
  };

  const handleNavigate = (view: string, alertId?: string) => {
    setActiveView(view as ViewType);
    if (alertId) {
      setSelectedAlertId(alertId);
    }
  };

  // Demo mode: open directly to the dashboard without auth.
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e40af',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen flex flex-col bg-[#f8f8f7] text-[#47474F]">
        <Header user={currentUser} onLogout={handleLogout} />
        <div className="flex flex-1 min-h-0">
          <Sidebar activeView={activeView} onNavigate={handleNavigate} />
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {activeView === 'financial' && <FinancialView />}
              {activeView === 'dashboard' && (
                <DashboardView onNavigate={handleNavigate} />
              )}
              {activeView === 'alerts' && <AlertsView onNavigate={handleNavigate} />}
              {activeView === 'analysis' && <AnalysisView selectedAlertId={selectedAlertId} onNavigate={handleNavigate} />}
              {activeView === 'impact' && <ImpactView onNavigate={handleNavigate} />}
              {activeView === 'recommendations' && <RecommendationsView onNavigate={handleNavigate} />}
              {activeView === 'heatmap' && <HeatmapView onNavigate={handleNavigate} />}
              {activeView === 'report' && <ReportView onNavigate={handleNavigate} />}
              {activeView === 'integration' && <IntegrationView />}
              {activeView === 'import' && <DataImportView />}
              {activeView === 'upload' && (
                <DataUploadViewEnhanced onDatasetUploaded={handleDatasetUploaded} />
              )}
            </div>
          </main>
        </div>
      </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
