/**
 * DEMO: Anomaly Detection in Action
 * Run this to see how the detector works with real examples
 */

import { AnomalyDetector } from '../ml/anomalyDetector';

console.log('='.repeat(60));
console.log('ANOMALY DETECTION DEMO');
console.log('='.repeat(60));

// ============================================
// EXAMPLE 1: Revenue Monitoring
// ============================================
console.log('\n📊 EXAMPLE 1: Daily Revenue Monitoring\n');

const revenueDetector = new AnomalyDetector();

// Historical revenue (last 10 days) - all around $100k
const historicalRevenue = [
  100000, 102000, 98000, 101000, 99000,
  103000, 97000, 100000, 102000, 98000
];

console.log('Historical Revenue (Last 10 Days):');
console.log(historicalRevenue.map(r => `$${(r/1000).toFixed(0)}k`).join(', '));

// Train the detector
revenueDetector.train(historicalRevenue);

// Test different scenarios
const scenarios = [
  { day: 'Day 11', revenue: 101000, expected: 'NORMAL' },
  { day: 'Day 12', revenue: 150000, expected: 'ANOMALY' },
  { day: 'Day 13', revenue: 50000, expected: 'ANOMALY' },
  { day: 'Day 14', revenue: 99000, expected: 'NORMAL' },
];

console.log('\nTesting New Values:\n');

scenarios.forEach(scenario => {
  const result = revenueDetector.detect(scenario.revenue);
  
  console.log(`${scenario.day}: $${(scenario.revenue/1000).toFixed(0)}k`);
  console.log(`  Status: ${result.isAnomaly ? '🚨 ANOMALY' : '✅ NORMAL'}`);
  console.log(`  Z-Score: ${result.score.toFixed(2)}`);
  console.log(`  Confidence: ${result.confidence.toFixed(0)}%`);
  console.log(`  Expected: ${scenario.expected}`);
  console.log('');
});

// ============================================
// EXAMPLE 2: Customer Complaints
// ============================================
console.log('\n📞 EXAMPLE 2: Customer Complaints Monitoring\n');

const complaintsDetector = new AnomalyDetector();

// Historical complaints per day - usually 5-8 complaints
const historicalComplaints = [5, 7, 4, 6, 5, 8, 4, 6, 7, 5];

console.log('Historical Complaints (Last 10 Days):');
console.log(historicalComplaints.join(', '));

complaintsDetector.train(historicalComplaints);

const complaintScenarios = [
  { day: 'Monday', complaints: 6, expected: 'NORMAL' },
  { day: 'Tuesday', complaints: 45, expected: 'ANOMALY' },
  { day: 'Wednesday', complaints: 3, expected: 'NORMAL' },
];

console.log('\nTesting New Values:\n');

complaintScenarios.forEach(scenario => {
  const result = complaintsDetector.detect(scenario.complaints);
  
  console.log(`${scenario.day}: ${scenario.complaints} complaints`);
  console.log(`  Status: ${result.isAnomaly ? '🚨 ANOMALY' : '✅ NORMAL'}`);
  console.log(`  Z-Score: ${result.score.toFixed(2)}`);
  console.log(`  Confidence: ${result.confidence.toFixed(0)}%`);
  console.log('');
});

// ============================================
// EXAMPLE 3: Operating Margin
// ============================================
console.log('\n💰 EXAMPLE 3: Operating Margin Monitoring\n');

const marginDetector = new AnomalyDetector();

// Historical operating margin (%) - usually around 24-26%
const historicalMargin = [24.5, 25.2, 24.8, 25.5, 24.3, 25.8, 24.1, 25.0, 25.3, 24.7];

console.log('Historical Operating Margin (Last 10 Days):');
console.log(historicalMargin.map(m => `${m}%`).join(', '));

marginDetector.train(historicalMargin);

const marginScenarios = [
  { day: 'Q1', margin: 25.1, expected: 'NORMAL' },
  { day: 'Q2', margin: 15.0, expected: 'ANOMALY' },
  { day: 'Q3', margin: 35.0, expected: 'ANOMALY' },
];

console.log('\nTesting New Values:\n');

marginScenarios.forEach(scenario => {
  const result = marginDetector.detect(scenario.margin);
  
  console.log(`${scenario.day}: ${scenario.margin}%`);
  console.log(`  Status: ${result.isAnomaly ? '🚨 ANOMALY' : '✅ NORMAL'}`);
  console.log(`  Z-Score: ${result.score.toFixed(2)}`);
  console.log(`  Confidence: ${result.confidence.toFixed(0)}%`);
  console.log('');
});

// ============================================
// EXAMPLE 4: Time Series Detection
// ============================================
console.log('\n📈 EXAMPLE 4: Time Series Anomaly Detection\n');

const tsDetector = new AnomalyDetector();

// Simulate 30 days of website traffic
const trafficData = [
  { value: 10000, timestamp: new Date('2024-01-01') },
  { value: 10200, timestamp: new Date('2024-01-02') },
  { value: 9800, timestamp: new Date('2024-01-03') },
  { value: 10100, timestamp: new Date('2024-01-04') },
  { value: 9900, timestamp: new Date('2024-01-05') },
  { value: 10300, timestamp: new Date('2024-01-06') },
  { value: 9700, timestamp: new Date('2024-01-07') },
  { value: 10000, timestamp: new Date('2024-01-08') },
  { value: 10200, timestamp: new Date('2024-01-09') },
  { value: 9800, timestamp: new Date('2024-01-10') },
  { value: 10100, timestamp: new Date('2024-01-11') },
  { value: 9900, timestamp: new Date('2024-01-12') },
  { value: 25000, timestamp: new Date('2024-01-13') }, // SPIKE!
  { value: 10000, timestamp: new Date('2024-01-14') },
  { value: 10200, timestamp: new Date('2024-01-15') },
  { value: 2000, timestamp: new Date('2024-01-16') },  // DROP!
  { value: 10100, timestamp: new Date('2024-01-17') },
  { value: 9900, timestamp: new Date('2024-01-18') },
];

console.log('Analyzing 18 days of website traffic...\n');

const anomalies = tsDetector.detectTimeSeries(trafficData);

console.log(`Found ${anomalies.length} anomalies:\n`);

anomalies.forEach(anomaly => {
  const date = anomaly.timestamp.toISOString().split('T')[0];
  console.log(`🚨 ${date}: ${anomaly.value.toLocaleString()} visitors`);
});

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`
The Z-Score Anomaly Detector:

✅ Detects unusual values automatically
✅ Works with any numeric metric
✅ Provides confidence scores
✅ No ML libraries needed
✅ Fast and simple

How it works:
1. Train with historical data (10+ points)
2. Calculate mean and standard deviation
3. Compare new values using Z-score
4. Flag values > 2 standard deviations away

Use cases in ACDS:
- Monitor KPIs in real-time
- Detect revenue/cost anomalies
- Track customer metrics
- Alert on unusual patterns
- Calculate risk scores
`);

console.log('='.repeat(60));

// Export for use in other files
export function runAnomalyDemo() {
  // This function can be called from the UI
  console.log('Anomaly detection demo completed!');
}
