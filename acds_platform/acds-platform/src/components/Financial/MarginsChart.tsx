/**
 * MarginsChart — Chart.js grouped bar chart showing gross, operating,
 * and net profit margins over time.
 */

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from 'chart.js';
import type { FinancialMetric } from '../../types/financial';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

interface MarginsChartProps {
  metrics: FinancialMetric[];
}

export const MarginsChart: React.FC<MarginsChartProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const labels = metrics.map(m => m.period);
    const grossMargins = metrics.map(m => parseFloat(((m.grossProfit / m.revenue) * 100).toFixed(1)));
    const opMargins = metrics.map(m => parseFloat(((m.operatingIncome / m.revenue) * 100).toFixed(1)));
    const netMargins = metrics.map(m => parseFloat(((m.netIncome / m.revenue) * 100).toFixed(1)));

    if (chartRef.current) chartRef.current.destroy();

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Gross Margin %',
            data: grossMargins,
            backgroundColor: 'rgba(229,50,45,0.75)',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Operating Margin %',
            data: opMargins,
            backgroundColor: 'rgba(99,102,241,0.75)',
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Net Margin %',
            data: netMargins,
            backgroundColor: 'rgba(16,185,129,0.75)',
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#6b7280', font: { size: 12 }, boxWidth: 14 },
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            padding: 12,
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#6b7280', font: { size: 11 }, callback: v => `${v}%` },
            min: 0,
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [metrics]);

  return (
    <div style={{ height: 260, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
