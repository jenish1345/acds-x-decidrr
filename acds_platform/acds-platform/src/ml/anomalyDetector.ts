/**
 * Enhanced Anomaly Detection using Statistical Methods
 * Implements Z-score, IQR, and moving average detection
 */

interface Metric {
  value: number;
  timestamp: Date;
}

interface AnomalyResult {
  isAnomaly: boolean;
  score: number;
  confidence: number;
  method?: string;
}

export class AnomalyDetector {
  private historicalData: number[] = [];
  private threshold: number = 2; // Standard deviations
  private readonly MIN_DATA_POINTS = 10;

  /**
   * Train the detector with historical data
   */
  train(data: number[]) {
    this.historicalData = data;
  }

  /**
   * Detect if a value is anomalous using Z-score method
   */
  detect(value: number): AnomalyResult {
    if (this.historicalData.length < this.MIN_DATA_POINTS) {
      return { isAnomaly: false, score: 0, confidence: 0, method: 'insufficient_data' };
    }

    const mean = this.calculateMean(this.historicalData);
    const stdDev = this.calculateStdDev(this.historicalData, mean);
    
    // Prevent division by zero
    if (stdDev === 0) {
      return { isAnomaly: false, score: 0, confidence: 0, method: 'zero_variance' };
    }
    
    // Z-score: how many standard deviations away from mean
    const zScore = Math.abs((value - mean) / stdDev);
    
    const isAnomaly = zScore > this.threshold;
    const confidence = Math.min(zScore / this.threshold * 100, 100);

    return {
      isAnomaly,
      score: zScore,
      confidence: Math.round(confidence),
      method: 'z-score'
    };
  }

  /**
   * Detect anomalies using Interquartile Range (IQR) method
   * More robust to outliers than Z-score
   */
  detectIQR(value: number): AnomalyResult {
    if (this.historicalData.length < this.MIN_DATA_POINTS) {
      return { isAnomaly: false, score: 0, confidence: 0, method: 'insufficient_data' };
    }

    const sorted = [...this.historicalData].sort((a, b) => a - b);
    const q1 = this.percentile(sorted, 25);
    const q3 = this.percentile(sorted, 75);
    const iqr = q3 - q1;
    
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const isAnomaly = value < lowerBound || value > upperBound;
    const distance = Math.max(
      Math.abs(value - lowerBound),
      Math.abs(value - upperBound)
    );
    const score = distance / (iqr || 1);
    const confidence = Math.min(score * 50, 100);

    return {
      isAnomaly,
      score,
      confidence: Math.round(confidence),
      method: 'iqr'
    };
  }

  /**
   * Detect anomalies in time series data
   */
  detectTimeSeries(data: Metric[]): Metric[] {
    const anomalies: Metric[] = [];
    
    for (let i = 10; i < data.length; i++) {
      const window = data.slice(i - 10, i).map(m => m.value);
      this.train(window);
      
      const result = this.detect(data[i].value);
      if (result.isAnomaly) {
        anomalies.push(data[i]);
      }
    }
    
    return anomalies;
  }

  private calculateMean(data: number[]): number {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  private calculateStdDev(data: number[], mean: number): number {
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  private percentile(sortedData: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedData.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
  }

  /**
   * Set custom threshold for anomaly detection
   */
  setThreshold(threshold: number): void {
    if (threshold <= 0) {
      throw new Error('Threshold must be positive');
    }
    this.threshold = threshold;
  }

  /**
   * Get statistics about the historical data
   */
  getStatistics(): { mean: number; stdDev: number; min: number; max: number; count: number } | null {
    if (this.historicalData.length === 0) {
      return null;
    }

    const mean = this.calculateMean(this.historicalData);
    const stdDev = this.calculateStdDev(this.historicalData, mean);
    
    return {
      mean,
      stdDev,
      min: Math.min(...this.historicalData),
      max: Math.max(...this.historicalData),
      count: this.historicalData.length
    };
  }
}

// Example usage:
// const detector = new AnomalyDetector();
// detector.train([100, 102, 98, 101, 99, 103, 97, 100, 102, 98]);
// const result = detector.detect(150); // { isAnomaly: true, score: 5.2, confidence: 100 }
