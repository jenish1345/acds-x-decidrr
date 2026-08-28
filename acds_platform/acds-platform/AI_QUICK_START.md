# AI-Powered Dashboard - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Application
```bash
cd acds-platform
npm run dev
```
Open http://localhost:5173/

### Step 2: Login
- Email: any@email.com
- Password: any password
- Click "Login"

### Step 3: Upload Sample Dataset

1. Click **"Upload Dataset"** in the left sidebar
2. Enter dataset details:
   - **Name**: Q4 2025 - Q1 2026 Data
   - **Period**: Oct 2025 - Feb 2026
3. Click the upload area
4. Select `public/sample_ai_dataset.csv`
5. Review the preview showing:
   - 10 rows × 9 columns
   - Auto-detected mappings (revenue, expenses, profit, etc.)
6. Click **"Analyze Dataset"**

### Step 4: View AI Insights

The dashboard will now show:

#### 🎯 Dynamic Health Score
- Calculated from your actual data
- Risk status: Critical/Warning/Healthy
- Based on revenue trends, margins, retention

#### 📊 Dynamic KPIs
- **Revenue**: Average from your dataset
- **Profit Margin**: Calculated automatically
- **Customer Retention**: From retention column
- **Employee Satisfaction**: From satisfaction column

#### 🧠 AI Predictive Insights Card
- **90-Day Loss Projection**: $XXX,XXX
- **Risk Escalation Probability**: XX%
- **Most Vulnerable Department**: Operations
- **Confidence Score**: 78%

#### 📈 Predictive Analysis
- Revenue decline trajectory
- Customer churn risk
- Cost optimization opportunities

### Step 5: Explore Features

#### View Alerts
- Click "Risk & Alerts" in sidebar
- See AI-detected issues from your data
- Revenue decline alerts
- Retention warnings
- Margin compression alerts

#### Compare Datasets
1. Upload another dataset with different period
2. Toggle "Comparison Mode"
3. Select previous dataset
4. View KPI changes and trends

## 📁 Sample Dataset Explained

The included `sample_ai_dataset.csv` shows a declining business scenario:

| Metric | Trend |
|--------|-------|
| Revenue | Declining from $1.2M to $950K |
| Expenses | Rising from $850K to $960K |
| Profit | Declining from $350K to -$10K (loss) |
| Retention | Dropping from 88.5% to 71.2% |
| Satisfaction | Falling from 7.8 to 5.3 |

This triggers multiple AI alerts and predictions!

## 🎨 What You'll See

### Before Upload (Static Mode)
- Mock data dashboard
- Sample alerts and KPIs
- No AI insights card

### After Upload (AI Mode)
- ✅ Dynamic health score from your data
- ✅ Auto-generated KPIs
- ✅ AI-detected alerts
- ✅ Predictive insights card
- ✅ 90-day loss forecast
- ✅ Risk probability
- ✅ Vulnerable department identification

## 🔧 Creating Your Own Dataset

### Required Columns (at least one)
- `revenue` or `sales` or `income`
- `expenses` or `cost`
- `profit` or `margin`
- `retention` or `churn`
- `satisfaction` or `nps` or `score`
- `employees` or `headcount`
- `customers` or `clients`

### Optional Columns
- `date` or `period`
- `department` or `division`

### Format Requirements
- CSV file format
- First row must be headers
- Numeric columns should contain numbers
- At least 5 rows of data recommended

### Example CSV Structure
```csv
date,revenue,expenses,profit,retention,satisfaction
2026-01-01,1200000,850000,350000,88.5,7.8
2026-02-01,1350000,920000,430000,89.2,8.1
2026-03-01,1180000,880000,300000,85.3,7.4
```

## 🎯 Key Features to Test

### 1. Health Score Calculation
- Upload dataset with good metrics (high revenue, low expenses)
- Score should be 70+ (Healthy)
- Upload dataset with poor metrics
- Score should be <50 (Critical)

### 2. Alert Detection
- **Revenue Decline**: Recent revenue drops >10%
- **Low Retention**: Retention <75%
- **Margin Compression**: Profit margin <15%
- **Low Satisfaction**: Employee score <6.5

### 3. Predictive Insights
- **Financial Loss**: Projected 90-day impact
- **Churn Risk**: Probability of customer loss
- **Cost Optimization**: Savings opportunities

### 4. Dataset Comparison
- Upload Q1 2026 data
- Upload Q2 2026 data
- Compare to see:
  - KPI percentage changes
  - Trend direction (improving/declining)
  - Visual indicators

## 🔍 Understanding AI Confidence

The AI confidence score (60-95%) indicates:
- **60-70%**: Limited data, basic predictions
- **70-80%**: Good data quality, reliable insights
- **80-90%**: Excellent data, high confidence
- **90-95%**: Extensive data, very reliable

More data points = Higher confidence!

## 🚨 Troubleshooting

### Dataset Not Processing
- ✅ Check file is CSV format
- ✅ Verify first row has column headers
- ✅ Ensure numeric columns have numbers
- ✅ Remove empty rows

### No AI Insights Showing
- ✅ Upload dataset first
- ✅ Navigate to Dashboard
- ✅ Wait for processing (1-2 seconds)
- ✅ Check browser console for errors

### Mappings Not Detected
- ✅ Use standard column names (revenue, profit, etc.)
- ✅ Check spelling in headers
- ✅ Avoid special characters in column names

## 📚 Next Steps

1. **Upload Real Data**: Use your company's actual CSV exports
2. **Compare Periods**: Upload multiple quarters for trend analysis
3. **Export Insights**: Take screenshots for presentations
4. **Customize Mappings**: Edit `dataProcessor.ts` for custom columns
5. **Integrate Backend**: Connect to ML API (see AI_UPGRADE_GUIDE.md)

## 💡 Pro Tips

- Upload at least 10 rows for better predictions
- Use consistent date formats
- Include all recommended columns
- Upload historical data for comparison
- Review auto-detected mappings before analyzing

## 🎉 Success Indicators

You'll know it's working when you see:
- ✅ Health score changes based on your data
- ✅ KPIs show your actual numbers
- ✅ AI Insights card appears on dashboard
- ✅ Alerts match your data patterns
- ✅ Predictions reference your metrics

## 📞 Support

For issues or questions:
1. Check `AI_UPGRADE_GUIDE.md` for technical details
2. Review `PROJECT_SUMMARY.md` for architecture
3. Inspect browser console for errors
4. Verify TypeScript compilation: `npm run build`

---

**Ready to transform your static dashboard into an AI-powered intelligence system!** 🚀
