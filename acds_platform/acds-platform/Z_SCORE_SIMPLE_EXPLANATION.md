# Z-Score Anomaly Detection - Explained Like You're 5

## The Cookie Jar Analogy 🍪

Imagine you have a cookie jar, and every day you count how many cookies are left:

```
Monday:    10 cookies
Tuesday:   11 cookies
Wednesday:  9 cookies
Thursday:  10 cookies
Friday:    11 cookies
Saturday:   9 cookies
Sunday:    10 cookies
```

**Normal pattern:** You eat about 10 cookies per day (give or take 1-2)

**Then one day:** You count and there are only **2 cookies** left!

**Question:** Is this normal, or did something unusual happen?

**Answer:** UNUSUAL! Someone ate way more cookies than normal!

---

## That's What Z-Score Does!

Z-Score answers: **"How unusual is this number?"**

### The Math (Simple Version)

**Step 1:** What's normal?
```
Average = 10 cookies per day
```

**Step 2:** How much do things usually vary?
```
Usually varies by ±1 cookie
```

**Step 3:** How far is today from normal?
```
Today: 2 cookies
Difference: 10 - 2 = 8 cookies missing!
That's 8 times more than usual variation!
```

**Step 4:** Is it unusual?
```
If difference is more than 2x usual variation → UNUSUAL!
8 is way more than 2 → DEFINITELY UNUSUAL! 🚨
```

---

## Real Business Example

### Your Company's Daily Revenue

**Last 10 Days:**
```
$100,000
$102,000
$98,000
$101,000
$99,000
$103,000
$97,000
$100,000
$102,000
$98,000
```

**Pattern:** Revenue is always around $100,000 (±$2,000)

**Today:** $250,000

**Question:** Is this normal or unusual?

### Let's Calculate!

**Step 1: Average (Mean)**
```
(100 + 102 + 98 + 101 + 99 + 103 + 97 + 100 + 102 + 98) ÷ 10 = 100

Average = $100,000
```

**Step 2: How Much Does It Usually Vary? (Standard Deviation)**
```
Most days are within $2,000 of average
Standard Deviation = $2,000
```

**Step 3: Calculate Z-Score**
```
Z-Score = (Today's Value - Average) ÷ Standard Deviation
Z-Score = ($250,000 - $100,000) ÷ $2,000
Z-Score = $150,000 ÷ $2,000
Z-Score = 75
```

**Step 4: Is It Unusual?**
```
Rule: If Z-Score > 2 → UNUSUAL!

75 is WAY bigger than 2!
🚨 ANOMALY DETECTED! 🚨
```

---

## Visual Explanation

### The Bell Curve (Normal Distribution)

```
        How Often Values Occur
        
              ╱‾‾‾╲
             ╱     ╲
            ╱       ╲
           ╱         ╲
          ╱           ╲
         ╱             ╲
        ╱               ╲
  ─────────────────────────────
  $96k  $98k  $100k $102k $104k
        -2σ   Mean   +2σ
        
  68% of days: $98k - $102k
  95% of days: $96k - $104k
  
  Today: $250k ← Way outside! ANOMALY!
```

### What Z-Score Means

```
Z-Score = 0   → Exactly average (normal)
Z-Score = 1   → A bit above average (normal)
Z-Score = 2   → Quite high (borderline)
Z-Score = 3   → Very high (unusual)
Z-Score = 75  → EXTREMELY HIGH! (definitely unusual)
```

---

## Why This Is Useful for Business

### Automatic Alerts

Instead of manually checking every number, the computer can:

1. **Learn** what's normal (from historical data)
2. **Watch** for new values
3. **Alert** you when something is unusual

### Example Alerts

```
✅ Revenue: $101,000 (Z-Score: 0.5) - NORMAL
✅ Revenue: $103,000 (Z-Score: 1.5) - NORMAL
🚨 Revenue: $250,000 (Z-Score: 75) - ANOMALY!
```

---

## The Code (Simplified)

```typescript
// 1. Historical data (what's normal)
const historical = [100, 102, 98, 101, 99, 103, 97, 100, 102, 98];

// 2. Calculate average
const average = 100;

// 3. Calculate standard deviation (how much it varies)
const stdDev = 2;

// 4. New value to check
const today = 250;

// 5. Calculate Z-Score
const zScore = (today - average) / stdDev;
// zScore = (250 - 100) / 2 = 75

// 6. Check if unusual
if (zScore > 2) {
  alert('🚨 ANOMALY DETECTED!');
}
```

---

## Real-World Use Cases in ACDS

### 1. Revenue Monitoring
```
Normal: $100k per day
Alert if: Revenue drops below $96k or goes above $104k
```

### 2. Customer Complaints
```
Normal: 5-8 complaints per day
Alert if: More than 12 complaints in one day
```

### 3. Website Traffic
```
Normal: 10,000 visitors per day
Alert if: Less than 8,000 or more than 12,000 visitors
```

### 4. Operating Costs
```
Normal: $50k per day
Alert if: Costs exceed $60k
```

### 5. Employee Satisfaction
```
Normal: 7.5-8.5 out of 10
Alert if: Drops below 7.0
```

---

## Advantages

### ✅ Simple
- Easy to understand
- No complex math
- No ML expertise needed

### ✅ Fast
- Instant calculations
- Real-time monitoring
- No training time

### ✅ Free
- No API costs
- No ML libraries
- Pure JavaScript

### ✅ Interpretable
- Z-Score has clear meaning
- Easy to explain to executives
- Transparent logic

---

## Limitations

### ⚠️ Assumes Normal Distribution
Works best when data follows a bell curve pattern

**Good for:**
- Revenue (usually stable)
- Daily metrics
- Counts and averages

**Not good for:**
- Seasonal data (holiday sales spike every December)
- Trending data (growing startup revenue)
- Rare events (once-a-year occurrences)

### ⚠️ Needs Historical Data
Requires at least 10-20 data points to be reliable

### ⚠️ Static Threshold
Doesn't adapt to changing patterns over time

---

## When to Use Z-Score

### ✅ Use When:
- You have stable, predictable metrics
- You need quick anomaly detection
- You want something simple and free
- You're building a prototype/MVP
- Data follows normal patterns

### ❌ Don't Use When:
- Data has strong seasonality
- Patterns change over time
- You need to predict future values
- You need complex pattern recognition
- You have very little historical data

---

## Summary

**Z-Score Anomaly Detection:**

1. **Learns** what's normal from historical data
2. **Calculates** how far new values are from normal
3. **Alerts** when values are too far away (unusual)

**Formula:**
```
Z-Score = (New Value - Average) / Standard Deviation

If Z-Score > 2 → ANOMALY!
```

**In Plain English:**
"Is this number way different from what we usually see?"

**Why It's Useful:**
- Automatic monitoring
- Catches problems early
- No manual checking needed
- Fast and simple

**Already in Your ACDS System:**
- ✅ Code written (`src/ml/anomalyDetector.ts`)
- ✅ Demo created (`src/demo/anomalyDemo.ts`)
- ✅ UI component ready (`src/components/Demo/AnomalyDemoCard.tsx`)
- ✅ Ready to use!

---

## Try It Yourself!

The detector is already built. You can:

1. **Test with revenue data**
2. **Monitor KPIs automatically**
3. **Generate alerts**
4. **Calculate confidence scores**

**It's running and ready to detect anomalies in your business data!** 🚀
