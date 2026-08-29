/**
 * DuPontChart — Stacked visualization of DuPont components across periods.
 * Uses Chart.js bar chart for the three multipliers and a line overlay for ROE.
 * UI labels: "Why is this company profitable?" with plain-English breakdown.
 */

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from 'chart.js';
import type { DuPontComponents } from '../../types/financial';

Chart.register(BarController, LineController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface DuPontChartProps {
  data: DuPontComponents[];
}

export const DuPontChart: React.FC<DuPontChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    if (chartRef.current) chartRef.current.destroy();

    const labels = data.map(d => d.label);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Net Profit Margin %',
            data: data.map(d => d.netProfitMargin),
            backgroundColor: 'rgba(229,50,45,0.7)',
            borderRadius: 3,
            borderSkipped: false,
            yAxisID: 'yLeft',
          },
          {
            type: 'bar',
            label: 'Asset Turnover (×)',
            data: data.map(d => d.assetTurnover * 10), // scale for visibility
            backgroundColor: 'rgba(99,102,241,0.7)',
            borderRadius: 3,
            borderSkipped: false,
            yAxisID: 'yLeft',
          },
          {
            type: 'bar',
            label: 'Equity Multiplier (×)',
            data: data.map(d => d.equityMultiplier),
            backgroundColor: 'rgba(245,158,11,0.7)',
            borderRadius: 3,
            borderSkipped: false,
            yAxisID: 'yLeft',
          },
          {
            type: 'line',
            label: 'ROE %',
            data: data.map(d => d.roe),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: '#10b981',
            tension: 0.4,
            yAxisID: 'yRight',
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
            labels: {
              color: '#6b7280',
              font: { size: 11 },
              boxWidth: 14,
            },
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f9fafb',
            bodyColor: '#d1d5db',
            padding: 12,
            callbacks: {
              label: ctx => {
                const ds = ctx.dataset.label || '';
                const v = ctx.parsed.y;
                if (v === null || v === undefined) return '';
                if (ds.includes('Asset Turnover')) return `Asset Turnover: ${(Number(v) / 10).toFixed(3)}×`;
                if (ds.includes('Equity Multiplier')) return `Equity Multiplier: ${Number(v).toFixed(3)}×`;
                return `${ds}: ${Number(v).toFixed(2)}%`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          yLeft: {
            position: 'left',
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#6b7280', font: { size: 11 } },
          },
          yRight: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#10b981', font: { size: 11 }, callback: (v) => `${v ?? 0}%` },
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div style={{ height: 280, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
