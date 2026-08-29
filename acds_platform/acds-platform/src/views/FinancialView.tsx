/**
 * FinancialView — Main Financial Intelligence Dashboard
 *
 * Integrates:
 *   - Chart.js interactive charts (revenue, margins)
 *   - Monte Carlo simulation (scenario fan chart)
 *   - DuPont profitability breakdown
 *   - ML Ensemble predictions (Gradient Boosting + Random Forest)
 *   - Gemini Multimodal document analysis
 *
 * All ML/finance complexity is hidden behind plain English labels.
 * User sees: insights, scenarios, and recommendations — not formulas.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  Cpu, Layers, RefreshCw, ChevronDown, ChevronUp,
  Sparkles, Target, AlertTriangle, CheckCircle2,
} from 'lucide-react';

import { sampleFinancialMetrics } from '../data/financialData';
import { runMonteCarlo } from '../ml/monteCarlo';
import { computeDuPontSeries, getDuPontDiagnosis } from '../ml/dupont';
import { predictFinancialMetric } from '../ml/regressors';
import { RevenueChart } from '../components/Financial/RevenueChart';
import { MarginsChart } from '../components/Financial/MarginsChart';
import { MonteCarloChart } from '../components/Financial/MonteCarloChart';
import { DuPontChart } from '../components/Financial/DuPontChart';
import { GeminiUploadPanel } from '../components/Financial/GeminiUploadPanel';
import type { GeminiInsight, FinancialMetric, MLPrediction } from '../types/financial';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function pct(v: number): string {
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
}

function qGrowth(metrics: FinancialMetric[], key: keyof FinancialMetric): number {
  if (metrics.length < 2) return 0;
  const last = metrics[metrics.length - 1][key] as number;
  const prev = metrics[metrics.length - 2][key] as number;
  return prev > 0 ? ((last - prev) / prev) * 100 : 0;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  accent: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, change, icon, accent }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {pct(change)} vs prev quarter
        </div>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// ─── Section Card wrapper ────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title, subtitle, badge, badgeColor = 'bg-indigo-50 text-indigo-600', children, collapsible = false
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className={`flex items-start justify-between px-6 py-4 border-b border-gray-50 ${collapsible ? 'cursor-pointer select-none hover:bg-gray-50/60 transition-colors' : ''}`}
        onClick={collapsible ? () => setOpen(o => !o) : undefined}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {badge && (
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        {collapsible && (
          <button className="text-gray-400 mt-0.5">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {(!collapsible || open) && (
          <motion.div
            key="content"
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main View ───────────────────────────────────────────────────────────────

export const FinancialView: React.FC = () => {
  const [metrics, setMetrics] = useState<FinancialMetric[]>(sampleFinancialMetrics);
  const [isRunningML, setIsRunningML] = useState(false);
  const [mlPredictions, setMLPredictions] = useState<MLPrediction[]>([]);
  const [geminiInsight, setGeminiInsight] = useState<GeminiInsight | null>(null);
  const [isDocumentData, setIsDocumentData] = useState(false);

  const handleInsightReady = useCallback((insight: GeminiInsight) => {
    setGeminiInsight(insight);
    if (insight.extractedMetrics && insight.extractedMetrics.length >= 2) {
      setMetrics(insight.extractedMetrics);
      setIsDocumentData(true);
      setMLPredictions([]); // reset previous predictions for new data
    }
  }, []);

  const resetToBaseline = useCallback(() => {
    setMetrics(sampleFinancialMetrics);
    setIsDocumentData(false);
    setGeminiInsight(null);
    setMLPredictions([]);
  }, []);

  // Compute ML predictions lazily
  const computeML = useCallback(() => {
    setIsRunningML(true);
    setTimeout(() => {
      try {
        const preds = predictFinancialMetric(metrics, 'revenue', 4);
        setMLPredictions(preds);
      } catch (e) {
        console.error('ML prediction failed:', e);
      } finally {
        setIsRunningML(false);
      }
    }, 50);
  }, [metrics]);

  // Monte Carlo (memoized — expensive but stable for this data)
  const monteCarloResult = useMemo(() => {
    return runMonteCarlo({ historicalValues: metrics.map(m => m.revenue), periods: 6, numSimulations: 800 });
  }, [metrics]);

  // DuPont
  const dupontSeries = useMemo(() => computeDuPontSeries(metrics), [metrics]);
  const latestDupont = dupontSeries[dupontSeries.length - 1];
  const dupontDiagnosis = latestDupont ? getDuPontDiagnosis(latestDupont) : '';

  // Latest period KPIs
  const latest = metrics[metrics.length - 1];
  const netMargin = latest.revenue > 0 ? (latest.netIncome / latest.revenue) * 100 : 0;

  const mcPeriodLabels = Array.from({ length: 6 }, (_, i) => {
    const q = ((4 + i) % 4) + 1;
    const y = 2024 + Math.floor((4 + i) / 4);
    return `Q${q} ${y}`;
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Intelligence</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            AI-powered financial analysis · Monte Carlo scenarios · Profitability drivers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Latest: {latest.period}</span>
          <motion.button
            onClick={computeML}
            disabled={isRunningML}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E5322D] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 hover:bg-[#cc2923] transition-colors"
          >
            {isRunningML
              ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCw size={13} /></motion.div>Running AI…</>
              : <><Cpu size={13} />Run AI Forecast</>
            }
          </motion.button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Revenue"
          value={fmt(latest.revenue)}
          change={qGrowth(metrics, 'revenue')}
          icon={<DollarSign size={18} className="text-red-500" />}
          accent="bg-red-50"
        />
        <KPICard
          label="Net Income"
          value={fmt(latest.netIncome)}
          change={qGrowth(metrics, 'netIncome')}
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          accent="bg-emerald-50"
        />
        <KPICard
          label="EBITDA"
          value={fmt(latest.ebitda)}
          change={qGrowth(metrics, 'ebitda')}
          icon={<BarChart3 size={18} className="text-indigo-500" />}
          accent="bg-indigo-50"
        />
        <KPICard
          label="Net Margin"
          value={`${netMargin.toFixed(1)}%`}
          change={netMargin - ((metrics[metrics.length - 2]?.netIncome / metrics[metrics.length - 2]?.revenue) * 100)}
          icon={<Target size={18} className="text-amber-500" />}
          accent="bg-amber-50"
        />
      </div>

      {/* Gemini AI — Document Upload */}
      <SectionCard
        title="AI Document Analysis"
        subtitle="Upload a financial report, PDF, or spreadsheet — Gemini extracts key insights automatically"
        badge="Gemini AI"
        badgeColor="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
        collapsible
      >
        <GeminiUploadPanel onInsightReady={handleInsightReady} />
        {geminiInsight && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-100 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  {isDocumentData ? 'Real financial metrics extracted from document & applied to dashboard!' : 'Document analysis completed!'}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Charts, Monte Carlo simulations, DuPont model, and ML forecasts are now operating on your uploaded document data.
                </p>
              </div>
            </div>
            {isDocumentData && (
              <button
                onClick={resetToBaseline}
                className="text-xs text-emerald-700 hover:text-emerald-900 underline font-medium flex-shrink-0"
              >
                Reset Data
              </button>
            )}
          </div>
        )}
      </SectionCard>

      {/* Revenue + ML Forecast */}
      <SectionCard
        title="Revenue Trend & AI Forecast"
        subtitle={mlPredictions.length > 0
          ? `AI ensemble (Gradient Boosting + Random Forest) forecast for next ${mlPredictions.length} quarters`
          : 'Click "Run AI Forecast" to generate ML predictions'}
        badge={mlPredictions.length > 0 ? 'ML Active' : undefined}
        badgeColor="bg-emerald-50 text-emerald-600"
      >
        <RevenueChart metrics={metrics} predictions={mlPredictions} />
        {mlPredictions.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mlPredictions.map(p => (
              <div key={p.period} className="rounded-lg bg-indigo-50 px-3 py-2.5">
                <p className="text-xs text-indigo-500 font-medium">{p.period}</p>
                <p className="text-sm font-bold text-indigo-800">{fmt(p.predicted)}</p>
                <p className="text-[10px] text-indigo-400">{p.confidence}% confidence</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Profit Margins */}
      <SectionCard
        title="Profit Margins Over Time"
        subtitle="Gross, operating, and net margins — how efficiently the business converts revenue to profit"
      >
        <MarginsChart metrics={metrics} />
      </SectionCard>

      {/* Monte Carlo */}
      <SectionCard
        title="Possible Future Outcomes"
        subtitle="What could revenue look like? 800 simulations show the range of realistic scenarios — not just one guess"
        badge="Scenario Analysis"
        badgeColor="bg-purple-50 text-purple-600"
      >
        <MonteCarloChart
          result={monteCarloResult}
          startValue={latest.revenue}
          periodLabels={mcPeriodLabels}
        />
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center rounded-lg bg-gray-50 py-3 px-4">
            <p className="text-xs text-gray-500 mb-1">Most Likely Outcome</p>
            <p className="text-base font-bold text-gray-900">{fmt(monteCarloResult.expectedValue)}</p>
          </div>
          <div className="text-center rounded-lg bg-emerald-50 py-3 px-4">
            <p className="text-xs text-emerald-600 mb-1">Best Case (Top 10%)</p>
            <p className="text-base font-bold text-emerald-700">
              {fmt(monteCarloResult.percentiles.p90[monteCarloResult.percentiles.p90.length - 1])}
            </p>
          </div>
          <div className={`text-center rounded-lg py-3 px-4 ${monteCarloResult.riskOfLoss > 30 ? 'bg-red-50' : 'bg-amber-50'}`}>
            <p className={`text-xs mb-1 ${monteCarloResult.riskOfLoss > 30 ? 'text-red-600' : 'text-amber-600'}`}>
              Downside Risk
            </p>
            <div className="flex items-center justify-center gap-1">
              {monteCarloResult.riskOfLoss > 30 && <AlertTriangle size={13} className="text-red-500" />}
              <p className={`text-base font-bold ${monteCarloResult.riskOfLoss > 30 ? 'text-red-700' : 'text-amber-700'}`}>
                {monteCarloResult.riskOfLoss.toFixed(1)}%
              </p>
            </div>
            <p className={`text-[10px] ${monteCarloResult.riskOfLoss > 30 ? 'text-red-400' : 'text-amber-400'}`}>
              chance of revenue decline
            </p>
          </div>
        </div>
      </SectionCard>

      {/* DuPont */}
      <SectionCard
        title="Why Is This Company Profitable?"
        subtitle="Profitability breakdown: pricing power × efficiency × financial leverage = return to shareholders"
        badge="DuPont Analysis"
        badgeColor="bg-amber-50 text-amber-600"
        collapsible
      >
        <DuPontChart data={dupontSeries} />
        {latestDupont && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Latest Period Diagnosis</p>
              <p className="text-sm text-amber-800 capitalize">{dupontDiagnosis}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Pricing Power</p>
                <p className="text-lg font-bold text-red-600">{latestDupont.netProfitMargin}%</p>
                <p className="text-[10px] text-gray-400">Net Profit Margin</p>
              </div>
              <div className="rounded-lg bg-indigo-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Asset Efficiency</p>
                <p className="text-lg font-bold text-indigo-600">{latestDupont.assetTurnover}×</p>
                <p className="text-[10px] text-gray-400">Asset Turnover</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">Leverage Used</p>
                <p className="text-lg font-bold text-amber-600">{latestDupont.equityMultiplier}×</p>
                <p className="text-[10px] text-gray-400">Equity Multiplier</p>
              </div>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Return on Equity (ROE)</p>
                <p className="text-xs text-emerald-500">Net Margin × Asset Turnover × Leverage</p>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{latestDupont.roe}%</p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* AI Insights from Gemini (shown after upload) */}
      <AnimatePresence>
        {geminiInsight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <SectionCard
              title="AI Financial Insights"
              subtitle="Extracted from your uploaded document by Gemini AI"
              badge="Live AI"
              badgeColor="bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{geminiInsight.summary}</p>
                </div>
                {geminiInsight.recommendation && (
                  <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3">
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Action Recommended</p>
                    <p className="text-sm text-indigo-800">{geminiInsight.recommendation}</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
