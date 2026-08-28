/**
 * Zustand Store for Dataset Management
 * Centralized state - no more props drilling!
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Dataset, DatasetComparison, PredictiveInsight } from '../types/dataset';
import type { Alert, KPI, CompanyHealth } from '../types';

interface DatasetStore {
  // State
  datasets: Dataset[];
  currentDataset: Dataset | null;
  comparisonData: DatasetComparison | null;
  comparisonMode: boolean;
  
  // Dynamic dashboard data
  dynamicKPIs: KPI[] | undefined;
  dynamicAlerts: Alert[] | undefined;
  dynamicHealth: CompanyHealth | undefined;
  predictiveInsights: PredictiveInsight[];
  predictedLoss: number;
  riskProbability: number;
  vulnerableDepartment: string;
  aiConfidence: number;
  
  // Actions
  addDataset: (dataset: Dataset) => void;
  setCurrentDataset: (dataset: Dataset | null) => void;
  removeDataset: (id: string) => void;
  clearDatasets: () => void;
  
  setComparisonMode: (mode: boolean) => void;
  setComparisonData: (data: DatasetComparison | null) => void;
  
  setDynamicKPIs: (kpis: KPI[]) => void;
  setDynamicAlerts: (alerts: Alert[]) => void;
  setDynamicHealth: (health: CompanyHealth) => void;
  setPredictiveInsights: (insights: PredictiveInsight[]) => void;
  setPredictedLoss: (loss: number) => void;
  setRiskProbability: (prob: number) => void;
  setVulnerableDepartment: (dept: string) => void;
  setAiConfidence: (confidence: number) => void;
  
  resetDynamicData: () => void;
}

export const useDatasetStore = create<DatasetStore>()(
  persist(
    (set) => ({
      // Initial state
      datasets: [],
      currentDataset: null,
      comparisonData: null,
      comparisonMode: false,
      
      dynamicKPIs: undefined,
      dynamicAlerts: undefined,
      dynamicHealth: undefined,
      predictiveInsights: [],
      predictedLoss: 0,
      riskProbability: 0,
      vulnerableDepartment: 'Not Available',
      aiConfidence: 0,
      
      // Actions
      addDataset: (dataset) => set((state) => ({
        datasets: [...state.datasets, dataset],
        currentDataset: dataset
      })),
      
      setCurrentDataset: (dataset) => set({ currentDataset: dataset }),
      
      removeDataset: (id) => set((state) => ({
        datasets: state.datasets.filter(d => d.metadata.id !== id),
        currentDataset: state.currentDataset?.metadata.id === id ? null : state.currentDataset
      })),
      
      clearDatasets: () => set({
        datasets: [],
        currentDataset: null,
        comparisonData: null,
        comparisonMode: false
      }),
      
      setComparisonMode: (mode) => set({ comparisonMode: mode }),
      setComparisonData: (data) => set({ comparisonData: data }),
      
      setDynamicKPIs: (kpis) => set({ dynamicKPIs: kpis }),
      setDynamicAlerts: (alerts) => set({ dynamicAlerts: alerts }),
      setDynamicHealth: (health) => set({ dynamicHealth: health }),
      setPredictiveInsights: (insights) => set({ predictiveInsights: insights }),
      setPredictedLoss: (loss) => set({ predictedLoss: loss }),
      setRiskProbability: (prob) => set({ riskProbability: prob }),
      setVulnerableDepartment: (dept) => set({ vulnerableDepartment: dept }),
      setAiConfidence: (confidence) => set({ aiConfidence: confidence }),
      
      resetDynamicData: () => set({
        dynamicKPIs: undefined,
        dynamicAlerts: undefined,
        dynamicHealth: undefined,
        predictiveInsights: [],
        predictedLoss: 0,
        riskProbability: 0,
        vulnerableDepartment: 'Not Available',
        aiConfidence: 0
      })
    }),
    {
      name: 'acds-dataset-storage',
      partialize: (state) => ({
        datasets: state.datasets,
        currentDataset: state.currentDataset
      })
    }
  )
);
