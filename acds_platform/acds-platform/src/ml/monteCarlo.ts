/**
 * Monte Carlo Simulation Engine
 *
 * Generates multiple possible future paths for a financial metric
 * using Geometric Brownian Motion (GBM) — the same model used in
 * Black-Scholes options pricing. This replaces a single-point forecast
 * with a realistic distribution of outcomes.
 *
 * All complexity is hidden from the UI; it receives only clean percentile bands.
 */

import type { MonteCarloResult } from '../types/financial';

interface MonteCarloConfig {
  /** Historical data series (e.g. quarterly revenue) */
  historicalValues: number[];
  /** Number of future periods to simulate */
  periods?: number;
  /** Number of simulation paths */
  numSimulations?: number;
}

/**
 * Compute log returns from a time series
 */
function logReturns(values: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > 0) {
      returns.push(Math.log(values[i] / values[i - 1]));
    }
  }
  return returns;
}

function mean(arr: number[]): number {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function std(arr: number[], mu: number): number {
  const variance = arr.reduce((s, v) => s + Math.pow(v - mu, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * Box-Muller transform: produces a standard-normal random value
 */
function randNorm(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Percentile of a sorted array
 */
function percentile(sorted: number[], p: number): number {
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Run the Monte Carlo simulation and return clean percentile bands
 */
export function runMonteCarlo(config: MonteCarloConfig): MonteCarloResult {
  const { historicalValues, periods = 8, numSimulations = 1000 } = config;

  // Need at least 2 data points for returns
  if (historicalValues.length < 2) {
    throw new Error('Need at least 2 historical data points');
  }

  const returns = logReturns(historicalValues);
  const mu = mean(returns);
  const sigma = std(returns, mu);
  const startValue = historicalValues[historicalValues.length - 1];

  // Generate simulation paths using GBM
  const simulations: number[][] = [];
  for (let s = 0; s < numSimulations; s++) {
    const path: number[] = [startValue];
    for (let t = 0; t < periods; t++) {
      const prev = path[path.length - 1];
      const drift = mu - 0.5 * sigma * sigma;
      const shock = sigma * randNorm();
      const next = prev * Math.exp(drift + shock);
      path.push(next);
    }
    simulations.push(path.slice(1)); // exclude starting point
  }

  // Compute percentile bands across each period
  const p10: number[] = [];
  const p25: number[] = [];
  const p50: number[] = [];
  const p75: number[] = [];
  const p90: number[] = [];

  for (let t = 0; t < periods; t++) {
    const col = simulations.map(s => s[t]).sort((a, b) => a - b);
    p10.push(percentile(col, 10));
    p25.push(percentile(col, 25));
    p50.push(percentile(col, 50));
    p75.push(percentile(col, 75));
    p90.push(percentile(col, 90));
  }

  // Final period distribution for risk analysis
  const finalValues = simulations.map(s => s[s.length - 1]).sort((a, b) => a - b);
  const expectedValue = mean(finalValues);
  const riskOfLoss = (finalValues.filter(v => v < startValue).length / numSimulations) * 100;

  return {
    simulations,
    percentiles: { p10, p25, p50, p75, p90 },
    finalDistribution: finalValues,
    expectedValue,
    riskOfLoss,
  };
}
