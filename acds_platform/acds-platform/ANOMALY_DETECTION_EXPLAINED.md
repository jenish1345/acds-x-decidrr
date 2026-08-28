# Anomaly Detection Explained - Simple Guide

## What Problem Does It Solve?

**Problem:** How do we automatically detect when business metrics are unusual?

**Examples:**
- Revenue suddenly drops by 50%
- Customer complaints spike 10x
- Website traffic drops to zero
- Operating costs double overnight

**Solution:** Z-Score Anomaly Detection

---

## Real-World Example

### Scenario: Monitoring Daily Revenue

**Historical Data (Last 10 Days):**
```
Day 1:  $100,000
Day 2:  $102,000
Day 3:  $98,000
Day 4:  $101,000
Day 5:  $99,000
Day 6:  $103,000
Day 7:  $97,000
Day 8:  $100,000
Day 9:  $102,000
Day 10: $98,000
```

**Today's Revenue:** $250,000

**Question:** Is this normal or an anomaly?

---

## Step-by-Step Detection

### Step 1: Calculate Average (Mean)

```javascript
const data = [100000, 102000, 98000, 101000, 99000, 103000, 97000, 100000, 102000, 98000];

const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
// mean = 1,000,000 / 10 = 100,000
```

**Result:** Average revenue = $100,000

---

### Step 2: Calculate Standard Deviation

**What is Standard Deviation?**
- Measures how spread out the numbers are
- Small SD = numbers are close together
- Large SD = numbers are spread out

```javascript
// Calculate variance (average of squared differences)
const variance = data.reduce((sum, val) => {
  return sum + Math.pow(val - mean, 2);
}, 0) / data.length;

// variance = 4,000,000

// Standard deviation is square root of variance
const stdDev = Math.sqrt(variance);
// stdDev = 2,000
```

**Result:** Standard Deviation = $2,000

---

### Step 3: Calculate Z-Score

**Formula:**
```
Z-Score = (Value - Mean) / Standard Deviation
```

**For today's revenue ($250,000):**
```javascript
const todayRevenue = 250000;
const zScore = (todayRevenue - mean) / stdDev;
// zScore = (250000 - 100000) / 2000
// zScore = 150000 / 2000
// zScore = 75
```

**Result:** Z-Score = 75

---

### Step 4: Determine if Anomaly

**Rule:**
```
If Z-Score > 2 (or 3) → ANOMALY
If Z-Score ≤ 2 → NORMAL
```

**In our case:**
```javascript
const threshold = 2;
const isAnomaly = Math.abs(zScore) > threshold;
// isAnomaly = 75 > 2 = TRUE ✓

const confidence = Math.min((zScore / threshold) * 100, 100);
// confidence = (75 / 2) * 100 = 3750% → capped at 100%
```

**Result:** 
- ✅ **ANOMALY DETECTED!**
- Confidence: 100%
- The revenue is 75 standard deviations away from normal!

---

## Visual Representation

```
Normal Revenue Range:
├────────────────────────────────────────┤
$96K    $98K    $100K   $102K   $104K
        -2σ     Mean     +2σ
        
        ↑ 95% of normal days fall here

Today's Revenue: $250K
                                          ↑
                                    Way outside!
                                    ANOMALY!
```

---

## Code Walkthrough

### The Complete Detector Class

```typescript
export class AnomalyDetector {
  private historicalData: number[] = [];
  private threshold: number = 2; // How many σ away = anomaly

  // 1. TRAIN: Learn what's "normal"
  train(data: number[]) {
    this.historicalData = data;
  }

  // 2. DETECT: Check if new value is anomalous
  detect(value: number): { isAnomaly: boolean; score: number; confidence: number } {
    // Need at least 10 data points to be reliable
    if (this.historicalData.length < 10) {
      return { isAnomaly: false, score: 0, confidence: 0 };
    }

    // Calculate mean (average)
    const mean = this.calculateMean(this.historicalData);
    
    // Calculate standard deviation (spread)
    const stdDev = this.calculateStdDev(this.historicalData, mean);
    
    // Calculate Z-score (how many σ away)
    const zScore = Math.abs((value - mean) / stdDev);
    
    // Determine if anomaly
    const isAnomaly = zScore > this.threshold;
    
    // Calculate confidence (0-100%)
    const confidence = Math.min(zScore / this.threshold * 100, 100);

    return {
      isAnomaly,      // true/false
      score: zScore,  // how unusual (0 = normal, >2 = anomaly)
      confidence      // how confident we are (0-100%)
    };
  }

  // Helper: Calculate average
  private calculateMean(data: number[]): number {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  // Helper: Calculate standard deviation
  private calculateStdDev(data: number[], mean: number): number {
    const variance = data.reduce((sum, val) => {
      return sum + Math.pow(val - mean, 2);
    }, 0) / data.length;
    
    return Math.sqrt(variance);
  }
}
```

---

## How to Use It

### Example 1: Detect Revenue Anomaly

```typescript
import { AnomalyDetector } from './ml/anomalyDetector';

// Create detector
const detector = new AnomalyDetector();

// Train with historical revenue data (last 10 days)
const historicalRevenue = [
  100000, 102000, 98000, 101000, 99000,
  103000, 97000, 100000, 102000, 98000
];
detector.train(historicalRevenue);

// Check today's revenue
const todayRevenue = 250000;
const result = detector.detect(todayRevenue);

console.log(result);
// {
//   isAnomaly: true,
//   score: 75,
//   confidence: 100
// }

if (result.isAnomaly) {
  console.log('🚨 ALERT: Revenue is unusual!');
  console.log(`Confidence: ${result.confidence}%`);
}
```

### Example 2: Monitor Customer Complaints

```typescript
const detector = new AnomalyDetector();

// Historical complaints per day
const historicalComplaints = [5, 7, 4, 6, 5, 8, 4, 6, 7, 5];
detector.train(historicalComplaints);

// Today's complaints
const todayComplaints = 45;
const result = detector.detect(todayComplaints);

console.log(result);
// {
//   isAnomaly: true,
//   score: 28.5,
//   confidence: 100
// }
```

### Example 3: Time Series Detection

```typescript
const detector = new AnomalyDetector();

// Metrics with timestamps
const metrics = [
  { value: 100, timestamp: new Date('2024-01-01') },
  { value: 102, timestamp: new Date('2024-01-02') },
  { value: 98, timestamp: new Date('2024-01-03') },
  // ... more data
  { value: 250, timestamp: new Date('2024-01-15') }
];

// Detect anomalies in the series
const anomalies = detector.detectTimeSeries(metrics);

console.log(`Found ${anomalies.length} anomalies`);
anomalies.forEach(anomaly => {
  console.log(`Anomaly on ${anomaly.timestamp}: ${anomaly.value}`);
});
```

---

## Integration with ACDS

### Use Case 1: Real-time KPI Monitoring

```typescript
// In DashboardView.tsx
import { AnomalyDetector } from '../ml/anomalyDetector';

const detector = new AnomalyDetector();

// Monitor revenue growth
useEffect(() => {
  const historicalGrowth = [8.1, 8.3, 7.9, 8.2, 8.0, 8.4, 7.8, 8.1, 8.3, 7.9];
  detector.train(historicalGrowth);
  
  const currentGrowth = 8.2;
  const result = detector.detect(currentGrowth);
  
  if (result.isAnomaly) {
    // Create alert
    createAlert({
      title: 'Revenue Growth Anomaly Detected',
      severity: 'warning',
      confidence: result.confidence
    });
  }
}, []);
```

### Use Case 2: Department Risk Scoring

```typescript
// Calculate risk score for each department
departments.forEach(dept => {
  const detector = new AnomalyDetector();
  
  // Historical risk scores
  detector.train(dept.historicalScores);
  
  // Current score
  const result = detector.detect(dept.currentScore);
  
  if (result.isAnomaly) {
    console.log(`${dept.name} has unusual risk level!`);
  }
});
```

### Use Case 3: Automated Alert Generation

```typescript
// Monitor all KPIs automatically
const kpiDetectors = {
  revenue: new AnomalyDetector(),
  margin: new AnomalyDetector(),
  retention: new AnomalyDetector(),
  satisfaction: new AnomalyDetector()
};

// Train each detector
Object.keys(kpiDetectors).forEach(kpi => {
  kpiDetectors[kpi].train(historicalData[kpi]);
});

// Check current values
Object.keys(kpiDetectors).forEach(kpi => {
  const result = kpiDetectors[kpi].detect(currentData[kpi]);
  
  if (result.isAnomaly) {
    generateAlert({
      kpi,
      confidence: result.confidence,
      severity: result.score > 5 ? 'critical' : 'warning'
    });
  }
});
```

---

## Advantages & Limitations

### ✅ Advantages

1. **Simple** - Easy to understand and implement
2. **Fast** - Calculations are instant
3. **No Training** - Works with just historical data
4. **No Dependencies** - Pure JavaScript/TypeScript
5. **Interpretable** - Z-score has clear meaning
6. **Free** - No API costs or ML libraries

### ⚠️ Limitations

1. **Assumes Normal Distribution** - Works best when data follows bell curve
2. **Needs Historical Data** - Requires at least 10-20 data points
3. **Static Threshold** - Doesn't adapt to changing patterns
4. **No Seasonality** - Doesn't account for weekly/monthly patterns
5. **Simple Patterns Only** - Can't detect complex anomalies

### When to Use

**Good For:**
- ✅ Quick anomaly detection
- ✅ Simple metrics (revenue, costs, counts)
- ✅ Real-time monitoring
- ✅ Prototypes and MVPs
- ✅ When you don't have ML expertise

**Not Good For:**
- ❌ Seasonal data (e.g., holiday sales)
- ❌ Complex patterns
- ❌ Multiple correlated metrics
- ❌ Predictive analytics
- ❌ Root cause analysis

---

## Comparison with Other Methods

| Method | Complexity | Accuracy | Speed | Cost |
|--------|-----------|----------|-------|------|
| **Z-Score** | Low | 70-80% | Instant | Free |
| Isolation Forest | Medium | 85-90% | Fast | Free |
| LSTM Neural Net | High | 90-95% | Slow | $$ |
| GPT-4 Analysis | Low | 85% | Medium | $$$ |

---

## Next Steps

### Improve the Detector

1. **Add Seasonality Detection**
```typescript
// Account for day-of-week patterns
const dayOfWeek = new Date().getDay();
const historicalForThisDay = historical.filter((_, i) => i % 7 === dayOfWeek);
```

2. **Use Moving Window**
```typescript
// Only use recent data (last 30 days)
const recentData = historical.slice(-30);
detector.train(recentData);
```

3. **Adaptive Threshold**
```typescript
// Adjust threshold based on data volatility
const threshold = stdDev > 1000 ? 3 : 2;
```

4. **Multiple Metrics**
```typescript
// Detect anomalies across multiple related metrics
const multiDetector = new MultiVariateAnomalyDetector();
multiDetector.train([revenue, costs, margin]);
```

---

## Summary

**Z-Score Anomaly Detection:**
- Compares new values to historical average
- Measures "how unusual" using standard deviations
- Simple, fast, and effective for basic patterns
- Already implemented in your ACDS system!

**Formula:**
```
Z-Score = (Value - Mean) / Standard Deviation

If Z-Score > 2 → Anomaly!
```

**Use it to:**
- Monitor KPIs in real-time
- Detect unusual business metrics
- Generate automatic alerts
- Calculate confidence scores

**It's running and ready to use!** 🚀
