/**
 * RevenueChart — Chart.js line chart showing historical + ML-predicted revenue
 * with confidence bands, styled with the ACDS brand palette.
 */

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from 'chart.js';
import type { FinancialMetric, MLPrediction } from '../../types/financial';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

interface RevenueChartProps {
  metrics: FinancialMetric[];
  predictions: MLPrediction[];
}

function fmt(v: number): string {
  return v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ metrics, predictions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const historicalLabels = metrics.map(m => m.period);
    const predLabels = predictions.map(p => p.period);
    const allLabels = [...historicalLabels, ...predLabels];

    const historicalRevenue = metrics.map(m => m.revenue);
    const predRevenue = predictions.map(p => p.predicted);
    const predUpper = predictions.map(p => p.upper);
    const predLower = predictions.map(p => p.lower);

    // Pad historical arrays with nulls for prediction region
    const histPadded = [...historicalRevenue, ...Array(predLabels.length).fill(null)];
    const predPadded = [...Array(historicalLabels.length - 1).fill(null), historicalRevenue[historicalRevenue.length - 1], ...predRevenue];
    const upperPadded = [...Array(historicalLabels.length - 1).fill(null), historicalRevenue[historicalRevenue.length - 1], ...predUpper];
    const lowerPadded = [...Array(historicalLabels.length - 1).fill(null), historicalRevenue[historicalRevenue.length - 1], ...predLower];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Revenue',
            data: histPadded,
            borderColor: '#E5322D',
            backgroundColor: 'rgba(229,50,45,0.08)',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#E5322D',
            tension: 0.35,
            fill: false,
          },
          {
            label: 'Upper Forecast',
            data: upperPadded,
            borderColor: 'rgba(99,102,241,0.3)',
            backgroundColor: 'rgba(99,102,241,0.08)',
            borderWidth: 1,
            borderDash: [4, 4],
            pointRadius: 0,
            tension: 0.35,
            fill: '+1',
          },
          {
            label: 'ML Forecast',
            data: predPadded,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            borderWidth: 2,
            borderDash: [6, 3],
            pointRadius: 3,
            pointBackgroundColor: '#6366f1',
            tension: 0.35,
            fill: false,
          },
          {
            label: 'Lower Forecast',
            data: lowerPadded,
            borderColor: 'rgba(99,102,241,0.3)',
            backgroundColor: 'rgba(99,102,241,0.08)',
            borderWidth: 1,
            borderDash: [4, 4],
            pointRadius: 0,
            tension: 0.35,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              filter: item => item.text !== 'Upper Forecast' && item.text !== 'Lower Forecast',
              color: '#6b7280',
              font: { size: 12 },
              boxWidth: 16,
            },
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            padding: 12,
            callbacks: {
              label: ctx => {
                if (ctx.parsed.y === null) return '';
                return `${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              color: '#6b7280',
              font: { size: 11 },
              callback: v => fmt(Number(v)),
            },
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [metrics, predictions]);

  return (
    <div style={{ height: 280, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
