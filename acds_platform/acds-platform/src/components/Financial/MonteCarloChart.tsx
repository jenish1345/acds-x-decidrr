/**
 * MonteCarloChart — Chart.js area chart showing the fan of possible
 * future revenue paths (percentile bands) from the Monte Carlo simulation.
 *
 * The UI shows "Possible Future Outcomes" — no GBM/simulation jargon.
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
import type { MonteCarloResult } from '../../types/financial';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

interface MonteCarloChartProps {
  result: MonteCarloResult;
  startValue: number;
  periodLabels: string[];
}

function fmt(v: number): string {
  return v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`;
}

export const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ result, startValue, periodLabels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { percentiles } = result;

    const labels = ['Now', ...periodLabels];

    // Prepend the start value so the chart begins from current state
    const p90 = [startValue, ...percentiles.p90];
    const p75 = [startValue, ...percentiles.p75];
    const p50 = [startValue, ...percentiles.p50];
    const p25 = [startValue, ...percentiles.p25];
    const p10 = [startValue, ...percentiles.p10];

    if (chartRef.current) chartRef.current.destroy();

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Best Case (90th %)',
            data: p90,
            borderColor: 'rgba(16,185,129,0.5)',
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4,
            fill: '+1',
          },
          {
            label: 'Likely High (75th %)',
            data: p75,
            borderColor: 'rgba(16,185,129,0.4)',
            backgroundColor: 'rgba(16,185,129,0.12)',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4,
            fill: '+1',
          },
          {
            label: 'Expected (Median)',
            data: p50,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.08)',
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#6366f1',
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Likely Low (25th %)',
            data: p25,
            borderColor: 'rgba(229,50,45,0.4)',
            backgroundColor: 'rgba(229,50,45,0.1)',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4,
            fill: '+1',
          },
          {
            label: 'Worst Case (10th %)',
            data: p10,
            borderColor: 'rgba(229,50,45,0.5)',
            backgroundColor: 'rgba(229,50,45,0.08)',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4,
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
            position: 'top',
            labels: { color: '#6b7280', font: { size: 11 }, boxWidth: 14 },
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
  }, [result, startValue, periodLabels]);

  return (
    <div style={{ height: 280, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
