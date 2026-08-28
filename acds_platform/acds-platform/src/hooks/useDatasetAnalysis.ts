/**
 * Custom Hooks for Dataset Analysis
 * Uses React Query for caching and automatic refetching
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  calculateHealthScore, 
  detectRiskAlerts, 
  predictFinancialLoss,
  generatePredictiveInsights,
  identifyVulnerableDepartment
} from '../services/aiEngine';
import { calculateStats, formatNumber } from '../utils/dataProcessor';
import type { Dataset } from '../types/dataset';
import type { KPI } from '../types';
import { useDatasetStore } from '../store/datasetStore';
import toast from 'react-hot-toast';

/**
 * Hook to analyze dataset with AI
 */
export const useDatasetAnalysis = (dataset: Dataset | null) => {
  const store = useDatasetStore();
  
  const analysisResult = useQuery({
    queryKey: ['dataset-analysis', dataset?.metadata.id],
    queryFn: async () => {
      if (!dataset) throw new Error('No dataset provided');
      
      // Run all AI analyses in parallel
      const [healthScore, alerts, insights, lossData] = await Promise.all([
        calculateHealthScore(dataset),
        detectRiskAlerts(dataset),
        generatePredictiveInsights(dataset),
        predictFinancialLoss(dataset)
      ]);
      
      const vulnDept = identifyVulnerableDepartment(dataset);
      const kpis = generateDynamicKPIs(dataset);
      
      return {
        healthScore,
        alerts,
        insights,
        lossData,
        vulnDept,
        kpis
      };
    },
    enabled: !!dataset,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Update store when data changes
  React.useEffect(() => {
    if (analysisResult.data) {
      const data = analysisResult.data;
      store.setDynamicHealth({
        overallScore: data.healthScore,
        riskStatus: data.healthScore >= 70 ? 'healthy' : data.healthScore >= 50 ? 'warning' : 'critical',
        lastUpdated: new Date().toISOString(),
        trend: 'stable'
      });
      
      store.setDynamicAlerts(data.alerts);
      store.setDynamicKPIs(data.kpis);
      store.setPredictiveInsights(data.insights);
      store.setPredictedLoss(data.lossData.estimatedLoss);
      store.setRiskProbability(Math.min(95, 60 + (data.alerts.length * 10)));
      store.setVulnerableDepartment(data.vulnDept);
      store.setAiConfidence(data.lossData.confidence);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisResult.data]);
  
  return analysisResult;
};

/**
 * Hook to upload and process dataset
 */
export const useUploadDataset = () => {
  const queryClient = useQueryClient();
  const store = useDatasetStore();
  
  return useMutation({
    mutationFn: async (dataset: Dataset) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return dataset;
    },
    onSuccess: (dataset) => {
      store.addDataset(dataset);
      queryClient.invalidateQueries({ queryKey: ['dataset-analysis'] });
      toast.success('Dataset uploaded successfully!');
    },
    onError: (error) => {
      toast.error('Failed to upload dataset');
      console.error('Upload error:', error);
    }
  });
};

/**
 * Generate dynamic KPIs from dataset
 */
function generateDynamicKPIs(dataset: Dataset): KPI[] {
  const kpis: KPI[] = [];
  const { data, mappings } = dataset;
  
  if (!mappings) return kpis;
  
  // Revenue KPI
  if (mappings.revenue) {
    const stats = calculateStats(data, mappings.revenue);
    const recent = data.slice(-2).map(row => Number(row[mappings.revenue!]));
    const change = recent.length === 2 ? ((recent[1] - recent[0]) / recent[0]) * 100 : 0;
    
    kpis.push({
      id: 'kpi_revenue',
      label: 'Revenue',
      value: `$${formatNumber(stats.mean)}`,
      change: Number(change.toFixed(1)),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    });
  }
  
  // Profit Margin KPI
  if (mappings.profit && mappings.revenue) {
    const profitStats = calculateStats(data, mappings.profit);
    const revenueStats = calculateStats(data, mappings.revenue);
    const margin = (profitStats.mean / revenueStats.mean) * 100;
    
    kpis.push({
      id: 'kpi_margin',
      label: 'Profit Margin',
      value: `${margin.toFixed(1)}%`,
      change: 0,
      trend: 'stable'
    });
  }
  
  // Customer Retention KPI
  if (mappings.retention) {
    const stats = calculateStats(data, mappings.retention);
    kpis.push({
      id: 'kpi_retention',
      label: 'Customer Retention',
      value: `${stats.mean.toFixed(1)}%`,
      change: 0,
      trend: stats.mean > 85 ? 'up' : 'down'
    });
  }
  
  // Employee Satisfaction KPI
  if (mappings.satisfaction) {
    const stats = calculateStats(data, mappings.satisfaction);
    kpis.push({
      id: 'kpi_satisfaction',
      label: 'Employee Satisfaction',
      value: `${stats.mean.toFixed(1)}/10`,
      change: 0,
      trend: stats.mean > 7.5 ? 'up' : 'down'
    });
  }
  
  return kpis;
}
