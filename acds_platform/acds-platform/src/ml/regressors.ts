/**
 * In-Browser ML Regressors: Gradient Boosting + Random Forest
 *
 * These are pure TypeScript implementations so no Python backend is needed.
 * The models are intentionally simplified for browser performance while
 * retaining the core algorithmic properties of their production counterparts.
 *
 * Architecture:
 *   - Decision Tree Regressor (base learner for both models)
 *   - Random Forest: bagging of N trees on random feature subsets
 *   - Gradient Boosting: sequential additive trees minimizing MSE residuals
 *
 * All terminology is hidden from the UI — users see "Forecast" and confidence bands.
 */

import type { FinancialMetric, MLPrediction } from '../types/financial';

// ─── Decision Tree (Regression) ───────────────────────────────────────────────

interface TreeNode {
  featureIndex: number;
  threshold: number;
  value: number | null;
  left: TreeNode | null;
  right: TreeNode | null;
}

function mse(values: number[]): number {
  if (values.length === 0) return 0;
  const m = values.reduce((s, v) => s + v, 0) / values.length;
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / values.length;
}

function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((s, v) => s + v, 0) / arr.length;
}

function buildTree(
  X: number[][],
  y: number[],
  depth: number,
  maxDepth: number,
  minSamples: number
): TreeNode {
  if (depth >= maxDepth || y.length <= minSamples) {
    return { featureIndex: 0, threshold: 0, value: mean(y), left: null, right: null };
  }

  const nFeatures = X[0].length;
  let bestGain = -Infinity;
  let bestFeature = 0;
  let bestThreshold = 0;

  for (let f = 0; f < nFeatures; f++) {
    const values = [...new Set(X.map(row => row[f]))].sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
      const threshold = (values[i] + values[i + 1]) / 2;
      const leftY = y.filter((_, idx) => X[idx][f] <= threshold);
      const rightY = y.filter((_, idx) => X[idx][f] > threshold);
      if (leftY.length === 0 || rightY.length === 0) continue;
      const gain = mse(y) - (leftY.length / y.length) * mse(leftY) - (rightY.length / y.length) * mse(rightY);
      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = f;
        bestThreshold = threshold;
      }
    }
  }

  const leftIdx = X.map((row, i) => i).filter(i => X[i][bestFeature] <= bestThreshold);
  const rightIdx = X.map((row, i) => i).filter(i => X[i][bestFeature] > bestThreshold);

  if (leftIdx.length === 0 || rightIdx.length === 0) {
    return { featureIndex: 0, threshold: 0, value: mean(y), left: null, right: null };
  }

  return {
    featureIndex: bestFeature,
    threshold: bestThreshold,
    value: null,
    left: buildTree(leftIdx.map(i => X[i]), leftIdx.map(i => y[i]), depth + 1, maxDepth, minSamples),
    right: buildTree(rightIdx.map(i => X[i]), rightIdx.map(i => y[i]), depth + 1, maxDepth, minSamples),
  };
}

function predictTree(node: TreeNode, x: number[]): number {
  if (node.value !== null) return node.value;
  if (x[node.featureIndex] <= node.threshold) {
    return predictTree(node.left!, x);
  }
  return predictTree(node.right!, x);
}

// ─── Feature Engineering ──────────────────────────────────────────────────────

/**
 * Converts financial metrics into a feature matrix.
 * Features: [revenue growth, gross margin, operating margin, debt ratio, period index]
 */
function buildFeatures(metrics: FinancialMetric[]): number[][] {
  return metrics.map((m, i) => {
    const prev = metrics[i - 1];
    const revenueGrowth = prev && prev.revenue > 0 ? (m.revenue - prev.revenue) / prev.revenue : 0;
    const grossMargin = m.revenue > 0 ? m.grossProfit / m.revenue : 0;
    const opMargin = m.revenue > 0 ? m.operatingIncome / m.revenue : 0;
    const debtRatio = m.totalAssets > 0 ? m.totalDebt / m.totalAssets : 0;
    return [revenueGrowth, grossMargin, opMargin, debtRatio, i / metrics.length];
  });
}

// ─── Random Forest Regressor ──────────────────────────────────────────────────

class RandomForestRegressor {
  private trees: TreeNode[] = [];
  private readonly nTrees: number;
  private readonly maxDepth: number;
  private readonly maxFeatures: number;

  constructor(nTrees = 50, maxDepth = 4, maxFeatures = 3) {
    this.nTrees = nTrees;
    this.maxDepth = maxDepth;
    this.maxFeatures = maxFeatures;
  }

  fit(X: number[][], y: number[]) {
    this.trees = [];
    for (let t = 0; t < this.nTrees; t++) {
      // Bootstrap sample
      const indices = Array.from({ length: X.length }, () => Math.floor(Math.random() * X.length));
      const Xb = indices.map(i => X[i]);
      const yb = indices.map(i => y[i]);

      // Random feature subset
      const nFeatures = X[0].length;
      const featureIndices = shuffle(Array.from({ length: nFeatures }, (_, i) => i)).slice(0, this.maxFeatures);
      const Xs = Xb.map(row => featureIndices.map(f => row[f]));

      this.trees.push(buildTree(Xs, yb, 0, this.maxDepth, 2));
    }
  }

  predict(X: number[][]): number[] {
    return X.map(x => mean(this.trees.map(tree => predictTree(tree, x))));
  }
}

// ─── Gradient Boosting Regressor ─────────────────────────────────────────────

class GradientBoostingRegressor {
  private trees: TreeNode[] = [];
  private readonly nEstimators: number;
  private readonly learningRate: number;
  private readonly maxDepth: number;
  private initialPrediction = 0;

  constructor(nEstimators = 50, learningRate = 0.1, maxDepth = 3) {
    this.nEstimators = nEstimators;
    this.learningRate = learningRate;
    this.maxDepth = maxDepth;
  }

  fit(X: number[][], y: number[]) {
    this.initialPrediction = mean(y);
    let residuals = y.map(v => v - this.initialPrediction);
    this.trees = [];

    for (let t = 0; t < this.nEstimators; t++) {
      const tree = buildTree(X, residuals, 0, this.maxDepth, 2);
      this.trees.push(tree);
      const treePred = X.map(x => predictTree(tree, x));
      residuals = residuals.map((r, i) => r - this.learningRate * treePred[i]);
    }
  }

  predict(X: number[][]): number[] {
    return X.map(x => {
      const treePreds = this.trees.map(tree => predictTree(tree, x));
      return this.initialPrediction + this.learningRate * treePreds.reduce((s, v) => s + v, 0);
    });
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Train both models on historical metrics and produce ensemble predictions
 * for the next `horizon` periods.
 */
export function predictFinancialMetric(
  metrics: FinancialMetric[],
  target: keyof Pick<FinancialMetric, 'revenue' | 'netIncome' | 'ebitda' | 'grossProfit'>,
  horizon = 4
): MLPrediction[] {
  if (metrics.length < 4) {
    throw new Error('Need at least 4 historical periods to train');
  }

  const X = buildFeatures(metrics);
  const y = metrics.map(m => m[target] as number);

  // Train models
  const rf = new RandomForestRegressor(50, 4, 3);
  const gb = new GradientBoostingRegressor(50, 0.1, 3);
  rf.fit(X, y);
  gb.fit(X, y);

  // Generate future features by extrapolating trend
  const predictions: MLPrediction[] = [];
  const lastMetric = metrics[metrics.length - 1];
  const periods = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];
  const lastYear = parseInt(lastMetric.period.split(' ')[1] || '2024');
  const lastQ = parseInt(lastMetric.period.split('Q')[1]?.split(' ')[0] || '4');

  for (let h = 0; h < horizon; h++) {
    const qNum = ((lastQ + h) % 4) + 1;
    const year = lastYear + Math.floor((lastQ + h) / 4);
    const periodLabel = `Q${qNum} ${year}`;

    // Extrapolated feature row
    const futureX: number[][] = [X[X.length - 1].map((v, i) => v * (1 + (i === 4 ? 0.1 : 0.02)))];

    const rfPred = rf.predict(futureX)[0];
    const gbPred = gb.predict(futureX)[0];
    const ensemblePred = (rfPred + gbPred) / 2;

    // Uncertainty grows with horizon
    const uncertainty = 0.08 + h * 0.04;

    predictions.push({
      period: periodLabel,
      predicted: Math.round(ensemblePred),
      lower: Math.round(ensemblePred * (1 - uncertainty)),
      upper: Math.round(ensemblePred * (1 + uncertainty)),
      confidence: Math.round((1 - uncertainty) * 100),
      model: 'ensemble',
    });
  }

  return predictions;
}
