# 🧪 Test Dataset Guide - Expected vs Actual Results

## 📊 Test Dataset: `test_company_crisis.csv`

This dataset simulates a company experiencing a **financial crisis** from April-June 2024. Perfect for demonstrating your AI platform's capabilities!

---

## 🎯 **What's in the Data?**

### **Healthy Period (Jan-Mar 2024)**
- ✅ Steady revenue growth
- ✅ Controlled expenses
- ✅ High employee satisfaction (8.0-8.7)
- ✅ Low turnover (1.5-3.0%)
- ✅ High customer retention (97-98.5%)

### **Crisis Period (Apr-Jun 2024)** ⚠️
- ❌ Revenue declining 10-15% monthly
- ❌ Expenses increasing (budget overruns)
- ❌ Employee satisfaction dropping (8.5 → 5.2)
- ❌ Turnover spiking (2% → 15%)
- ❌ Customer retention falling (98% → 84%)
- ❌ Operations showing NEGATIVE profit in June

---

## 🔮 **Expected Results from Your AI Platform**

### 1. **Health Score**
**Expected**: 35-45 (Critical)
- Started at 85-90 in January
- Dropped dramatically in April-June
- Should show RED/Critical status

### 2. **Critical Alerts** (Should Detect 6-8 Alerts)

#### Alert 1: Revenue Decline
- **Severity**: Critical
- **Department**: All departments
- **Description**: "Revenue decreased 30% over 3 months"
- **Impact**: High

#### Alert 2: Expense Overrun
- **Severity**: Critical
- **Department**: Engineering, Marketing
- **Description**: "Budget exceeded by 20-40%"
- **Impact**: High

#### Alert 3: Employee Turnover Spike
- **Severity**: Critical
- **Department**: All departments
- **Description**: "Turnover increased from 2% to 15%"
- **Impact**: High

#### Alert 4: Satisfaction Drop
- **Severity**: Warning
- **Department**: All departments
- **Description**: "Employee satisfaction fell 35%"
- **Impact**: Medium

#### Alert 5: Customer Churn
- **Severity**: Critical
- **Department**: Sales
- **Description**: "Retention dropped from 98% to 85%"
- **Impact**: High

#### Alert 6: Negative Profit
- **Severity**: Critical
- **Department**: Operations
- **Description**: "Department showing losses"
- **Impact**: High

### 3. **Dynamic KPIs**

#### Revenue KPI
- **Expected Value**: $1,260,000 (June total)
- **Change**: -25% ↓ (Red arrow)
- **Trend**: Down

#### Profit Margin KPI
- **Expected Value**: 5-10%
- **Change**: -70% ↓ (Red arrow)
- **Trend**: Down

#### Customer Retention KPI
- **Expected Value**: 86%
- **Change**: -12% ↓ (Red arrow)
- **Trend**: Down

#### Employee Satisfaction KPI
- **Expected Value**: 5.6/10
- **Change**: -35% ↓ (Red arrow)
- **Trend**: Down

### 4. **AI Predictive Insights**

#### Insight 1: Financial Risk
- **Type**: Risk
- **Title**: "Company at risk of insolvency"
- **Confidence**: 85-92%
- **Impact**: High
- **Timeframe**: "Next 90 days"

#### Insight 2: Talent Crisis
- **Type**: Risk
- **Title**: "Critical talent retention issue"
- **Confidence**: 88-95%
- **Impact**: High
- **Timeframe**: "Immediate"

#### Insight 3: Customer Loss
- **Type**: Risk
- **Title**: "Accelerating customer churn"
- **Confidence**: 82-90%
- **Impact**: High
- **Timeframe**: "Next 60 days"

### 5. **Predicted Financial Loss**
- **Expected**: $800,000 - $1,200,000
- **Confidence**: 85-90%
- **Timeframe**: Next 90 days

### 6. **Risk Probability**
- **Expected**: 85-95%
- **Status**: Critical

### 7. **Most Vulnerable Department**
- **Expected**: Engineering or Marketing
- **Reason**: Highest budget overrun + turnover

### 8. **Root Cause Analysis**

**Primary Causes:**
1. Expense management failure (40% over budget)
2. Employee retention crisis (15% turnover)
3. Customer satisfaction issues (14% churn)

**Contributing Factors:**
- Budget overruns in all departments
- Declining employee morale
- Operational inefficiencies

### 9. **Business Impact**

**Financial Impact:**
- **Estimated Loss**: $1,000,000
- **Range**: $800K - $1.2M
- **Probability**: 90%
- **Timeframe**: Q3 2024

**Affected Revenue:**
- 30% decline in 3 months
- Projected 40% decline if uncorrected

### 10. **Recommendations** (Should Generate 5-8)

#### Recommendation 1: Emergency Cost Reduction
- **Priority**: Critical
- **Action**: "Implement immediate 20% expense reduction"
- **Expected Outcome**: "Save $200K monthly"
- **Effort**: High
- **Timeline**: "Immediate - 30 days"

#### Recommendation 2: Retention Program
- **Priority**: Critical
- **Action**: "Launch employee retention initiative"
- **Expected Outcome**: "Reduce turnover to 5%"
- **Effort**: Medium
- **Timeline**: "30-60 days"

#### Recommendation 3: Customer Win-Back
- **Priority**: High
- **Action**: "Implement customer success program"
- **Expected Outcome**: "Improve retention to 95%"
- **Effort**: Medium
- **Timeline**: "60-90 days"

---

## 🎬 **Demo Script - What to Say**

### Opening (30 seconds)
"Let me show you how our AI detects problems before they become disasters. I'm uploading 6 months of company data..."

### Upload (30 seconds)
"Watch as the AI automatically analyzes revenue, expenses, employee data, and customer metrics..."

### Results (2 minutes)
"The AI detected a critical situation:
- Health score dropped from 85 to 38 (Critical)
- 6 critical alerts identified
- Predicted $1M loss in next 90 days with 90% confidence
- Engineering is the most vulnerable department
- Employee turnover spiked from 2% to 15%"

### Insights (1 minute)
"The AI identified the root causes:
1. Budget overruns (40% over)
2. Employee retention crisis
3. Customer churn accelerating

And generated 8 actionable recommendations to fix it."

### Closing (30 seconds)
"This is what early warning looks like. Imagine catching this in April instead of discovering it in July when it's too late."

---

## 📈 **How to Test**

### Step 1: Upload the Dataset
1. Go to your deployed site
2. Click Data Upload (📤)
3. Upload `test_company_crisis.csv`
4. Click "Analyze Dataset"

### Step 2: Verify Results
Check that you see:
- ✅ Health Score: 35-45 (Red/Critical)
- ✅ 6-8 Critical Alerts
- ✅ All KPIs showing downward trends
- ✅ Predicted loss: ~$1M
- ✅ Risk probability: 85-95%
- ✅ Vulnerable department identified

### Step 3: Export PDF
- Click "Export PDF"
- Verify report includes all insights
- Use for demos/presentations

---

## 🎯 **Why This Dataset is Perfect**

1. **Clear Story**: Healthy → Crisis (easy to explain)
2. **Multiple Signals**: Revenue, expenses, employees, customers all declining
3. **Realistic**: Mimics real company problems
4. **Impressive Results**: AI catches everything
5. **Demo-Ready**: Perfect for presentations

---

## 🔄 **Want Different Scenarios?**

I can create datasets for:
- ✅ **Growth Success** - Everything improving
- ✅ **Department-Specific Issue** - Only one dept failing
- ✅ **Seasonal Patterns** - Cyclical business
- ✅ **Slow Decline** - Gradual deterioration
- ✅ **Recovery Story** - Crisis → Turnaround

Just let me know what you need!

---

## 📊 **Quick Comparison Table**

| Metric | Jan 2024 | Jun 2024 | Change | AI Should Detect |
|--------|----------|----------|--------|------------------|
| Revenue | $1.25M | $1.03M | -18% | ✅ Critical Alert |
| Profit | $540K | $70K | -87% | ✅ Critical Alert |
| Turnover | 2.4% | 13.5% | +460% | ✅ Critical Alert |
| Satisfaction | 8.2 | 5.7 | -30% | ✅ Warning Alert |
| Retention | 97.6% | 86% | -12% | ✅ Critical Alert |
| Budget Variance | -2% | +36% | +38% | ✅ Critical Alert |

---

**This dataset will make your AI platform look AMAZING in demos!** 🚀

Upload it and watch the magic happen! ✨
