import { useState, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginView } from './views/LoginView';
import { SignupView, SignupData } from './views/SignupView';
import { PricingView } from './views/PricingView';
import { SubscriptionView } from './views/SubscriptionView';
import { DataImportView } from './views/DataImportView';
import { DataUploadViewEnhanced } from './views/DataUploadViewEnhanced';
import { DashboardView } from './views/DashboardView';
import { AlertsView } from './views/AlertsView';
import { AnalysisView } from './views/AnalysisView';
import { ImpactView } from './views/ImpactView';
import { RecommendationsView } from './views/RecommendationsView';
import { HeatmapView } from './views/HeatmapView';
import { ReportView } from './views/ReportView';
import { IntegrationView } from './views/IntegrationView';
import { mockUser } from './data/mockData';
import { useDatasetStore } from './store/datasetStore';
import type { BillingInterval } from './types/subscription';
import type { Dataset } from './types/dataset';

type ViewType = 'dashboard' | 'alerts' | 'analysis' | 'impact' | 'recommendations' | 'heatmap' | 'report' | 'subscription' | 'pricing' | 'import' | 'upload' | 'integration';
type AppState = 'login' | 'signup' | 'pricing' | 'trial' | 'authenticated';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>();
  
  // Use Zustand store for centralized state management
  const store = useDatasetStore();

  // Handle dataset upload - now managed by Zustand store
  const handleDatasetUploaded = (dataset: Dataset) => {
    store.addDataset(dataset);
    setActiveView('dashboard');
  };

  const handleLogin = (email: string, password: string) => {
    // Simple mock authentication
    if (email && password) {
      setAppState('authenticated');
    }
  };

  const handleSignup = (data: SignupData) => {
    console.log('Signup data:', data);
    // In production, this would create account and start trial
    setAppState('pricing');
  };

  const handleSelectPlan = (planId: string, interval: BillingInterval) => {
    console.log('Selected plan:', planId, interval);
    // In production, this would redirect to Stripe checkout
    // For demo, just start trial
    setAppState('trial');
    setTimeout(() => setAppState('authenticated'), 1000);
  };

  const handleLogout = () => {
    setAppState('login');
    setActiveView('dashboard');
    store.resetDynamicData();
  };

  const handleNavigate = (view: string, alertId?: string) => {
    setActiveView(view as ViewType);
    if (alertId) {
      setSelectedAlertId(alertId);
    }
  };

  // Login/Signup Flow
  if (appState === 'login') {
    return (
      <div>
        <LoginView onLogin={handleLogin} />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setAppState('signup')}
            className="btn-primary"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'signup') {
    return <SignupView onSignup={handleSignup} />;
  }

  if (appState === 'pricing') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PricingView onSelectPlan={handleSelectPlan} />
      </div>
    );
  }

  if (appState === 'trial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-corporate-navy to-corporate-darkblue flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Setting up your trial...</h2>
          <p className="text-gray-300">This will only take a moment</p>
        </div>
      </div>
    );
  }

  // Main Application
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
      <div className="min-h-screen flex flex-col">
        <Header user={mockUser} onLogout={handleLogout} />
        <div className="flex flex-1">
          <Sidebar activeView={activeView} onNavigate={handleNavigate} />
          <main className="flex-1 p-8 bg-gray-50 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {activeView === 'dashboard' && (
                <DashboardView onNavigate={handleNavigate} />
              )}
              {activeView === 'alerts' && <AlertsView onNavigate={handleNavigate} />}
              {activeView === 'analysis' && <AnalysisView selectedAlertId={selectedAlertId} onNavigate={handleNavigate} />}
              {activeView === 'impact' && <ImpactView onNavigate={handleNavigate} />}
              {activeView === 'recommendations' && <RecommendationsView />}
              {activeView === 'heatmap' && <HeatmapView />}
              {activeView === 'report' && <ReportView />}
              {activeView === 'integration' && <IntegrationView />}
              {activeView === 'import' && <DataImportView />}
              {activeView === 'upload' && (
                <DataUploadViewEnhanced onDatasetUploaded={handleDatasetUploaded} />
              )}
              {activeView === 'subscription' && <SubscriptionView />}
              {activeView === 'pricing' && <PricingView onSelectPlan={handleSelectPlan} />}
            </div>
          </main>
        </div>
      </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
