# ACDS UI Wireframes & Screen Layouts

## Visual Structure Documentation

---

## 1. Login Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [Navy Gradient Background]               │
│                                                             │
│                         ┌─────┐                            │
│                         │ AC  │  Logo                      │
│                         └─────┘                            │
│                          ACDS                              │
│              Autonomous Company Diagnostic System          │
│                                                             │
│              ┌─────────────────────────────┐              │
│              │                             │              │
│              │  Executive Access           │              │
│              │                             │              │
│              │  Email Address              │              │
│              │  [📧 ________________]      │              │
│              │                             │              │
│              │  Password                   │              │
│              │  [🔒 ________________]      │              │
│              │                             │              │
│              │  [    Sign In    ]          │              │
│              │                             │              │
│              │  ─────────────────────      │              │
│              │  Authorized personnel only  │              │
│              │                             │              │
│              └─────────────────────────────┘              │
│                                                             │
│              © 2026 ACDS Enterprise Platform               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Centered layout
- Corporate gradient background (navy to slate)
- White authentication card
- Professional branding
- Security disclaimer

---

## 2. Executive Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │ Header
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ Executive Dashboard                                          │
│          │ Real-time company health and risk monitoring                 │
│          │                                                              │
│ [📊]     │ ┌──────────────┐  ┌─────────┬─────────┐                    │
│ Exec     │ │ COMPANY      │  │ REVENUE │ MARGIN  │                    │
│ Dash     │ │ HEALTH SCORE │  │ GROWTH  │         │                    │
│          │ │              │  │ +8.2%   │ 24.5%   │                    │
│ [⚠️]     │ │     72       │  │ ↓ -2.1% │ ↓ -3.2% │                    │
│ Risk &   │ │    /100      │  ├─────────┼─────────┤                    │
│ Alerts   │ │              │  │CUSTOMER │EMPLOYEE │                    │
│          │ │ ⚠️ WARNING   │  │RETENTION│  SATIS  │                    │
│ [🔍]     │ │              │  │ 89.3%   │ 7.8/10  │                    │
│ Root     │ │ ↓ Declining  │  │ ↑ +1.5% │ ↓ -0.4  │                    │
│ Cause    │ └──────────────┘  └─────────┴─────────┘                    │
│          │                                                              │
│ [📈]     │ Critical Alerts                    View All Alerts →        │
│ Business │                                                              │
│ Impact   │ ┌────────────────────────────────────────────────────┐     │
│          │ │ ⚠️ Supply Chain Disruption Detected                │     │
│ [📋]     │ │ Significant delays in raw material procurement     │     │
│ Recom-   │ │ Operations | HIGH IMPACT | Jan 18 | View Details → │     │
│ mendation│ └────────────────────────────────────────────────────┘     │
│          │                                                              │
│ [🗺️]     │ ┌────────────────────────────────────────────────────┐     │
│ Dept     │ │ ⚠️ Customer Churn Rate Increasing                  │     │
│ Heatmap  │ │ Enterprise customer churn rate increased by 15%    │     │
│          │ │ Sales | HIGH IMPACT | Jan 17 | View Details →      │     │
│ [📄]     │ └────────────────────────────────────────────────────┘     │
│ Exec     │                                                              │
│ Report   │ ┌────────────────────────────────────────────────────┐     │
│          │ │ ⚠️ IT Infrastructure Performance Degradation       │     │
│          │ │ System response times increased by 40%             │     │
│          │ │ Technology | MEDIUM | Jan 19 | View Details →      │     │
│          │ └────────────────────────────────────────────────────┘     │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Layout Structure:**
- Fixed header (64px height)
- Fixed sidebar (256px width, navy background)
- Main content area (flexible, max-width 1280px)
- 3-column grid for KPIs
- Stacked alert cards

---

## 3. Risk & Alerts Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ Risk & Diagnostic Alerts                                     │
│ [Sidebar]│ Monitor and manage company-wide risk indicators              │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ 🔍 Severity: [All ▼] Department: [All Departments ▼]  │  │
│          │ │                                          3 alerts       │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ ⚠️ Supply Chain Disruption Detected      [CRITICAL]   │  │
│          │ │ Significant delays in raw material procurement...     │  │
│          │ │ Operations | HIGH IMPACT | Jan 18 | View Details →    │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ ⚠️ Customer Churn Rate Increasing        [WARNING]    │  │
│          │ │ Enterprise customer churn rate increased by 15%...    │  │
│          │ │ Sales | HIGH IMPACT | Jan 17 | View Details →         │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ ⚠️ IT Infrastructure Performance          [WARNING]    │  │
│          │ │ System response times increased by 40% during peak... │  │
│          │ │ Technology | MEDIUM | Jan 19 | View Details →         │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Filter bar (severity, department)
- Alert count display
- Stacked alert cards
- Severity badges (color-coded)
- Quick action buttons

---

## 4. Root Cause Analysis

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ ← Back to Alerts                                             │
│ [Sidebar]│ Root Cause Analysis                                          │
│          │ Supply Chain Disruption Detected                             │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ A001 | Operations | CRITICAL | Jan 18, 2026           │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ 🎯 PRIMARY ROOT CAUSE              CONFIDENCE: 87%     │  │
│          │ │                                                        │  │
│          │ │ Primary supplier experienced production facility       │  │
│          │ │ shutdown due to regulatory compliance issues           │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ CONTRIBUTING FACTORS                                   │  │
│          │ │                                                        │  │
│          │ │ 1  Lack of supplier diversification strategy          │  │
│          │ │ 2  Insufficient inventory buffer for critical comp... │  │
│          │ │ 3  Delayed communication from supplier management...  │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ 📈 SUPPORTING METRICS                                  │  │
│          │ │                                                        │  │
│          │ │ │ Supplier Dependency Ratio                           │  │
│          │ │ │ 68%  +23% above threshold                           │  │
│          │ │                                                        │  │
│          │ │ │ Inventory Days on Hand                              │  │
│          │ │ │ 12 days  -18 days below target                      │  │
│          │ │                                                        │  │
│          │ │ │ Supplier Communication Lag                          │  │
│          │ │ │ 4.2 days  +2.8 days above SLA                       │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │                    [View Business Impact] [View Recommendations]│
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Structure:**
- Breadcrumb navigation
- Alert context bar
- Primary cause card (prominent)
- Contributing factors list
- Supporting metrics with deviations
- Action buttons (bottom)

---

## 5. Business Impact Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ Business Impact Estimation                                   │
│ [Sidebar]│ Financial and operational impact analysis of identified risks│
│          │                                                              │
│          │ Supply Chain Disruption Detected                             │
│          │ Operations                                                   │
│          │                                                              │
│          │ ┌──────────────────────────────────────┬─────────────────┐  │
│          │ │ 💰 ESTIMATED FINANCIAL IMPACT        │ 📈 PROBABILITY  │  │
│          │ │                                      │                 │  │
│          │ │ $4,200,000                           │      78%        │  │
│          │ │ Range: $3.1M - $5.8M                 │   Likelihood    │  │
│          │ │                                      │                 │  │
│          │ │ │ AFFECTED REVENUE  │ TIMEFRAME     │ [████████░░] 78%│  │
│          │ │ │ $12,500,000       │ 🕐 Q1 2026    │                 │  │
│          │ └──────────────────────────────────────┴─────────────────┘  │
│          │                                                              │
│          │ Customer Churn Rate Increasing                               │
│          │ Sales                                                        │
│          │                                                              │
│          │ ┌──────────────────────────────────────┬─────────────────┐  │
│          │ │ 💰 ESTIMATED FINANCIAL IMPACT        │ 📈 PROBABILITY  │  │
│          │ │                                      │                 │  │
│          │ │ $6,800,000                           │      85%        │  │
│          │ │ Range: $5.2M - $9.1M                 │   Likelihood    │  │
│          │ │                                      │                 │  │
│          │ │ │ AFFECTED REVENUE  │ TIMEFRAME     │ [█████████░] 85%│  │
│          │ │ │ $18,300,000       │ 🕐 Next 6 mo  │                 │  │
│          │ └──────────────────────────────────────┴─────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ EXECUTIVE SUMMARY                                      │  │
│          │ │                                                        │  │
│          │ │ Total Estimated Impact    Total Affected Revenue      │  │
│          │ │      $11.0M                      $30.8M                │  │
│          │ │                                                        │  │
│          │ │                    Average Probability: 82%            │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │                          [View Mitigation Recommendations] →│
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Layout:**
- Grouped by alert
- Split layout (financial left, probability right)
- Summary card at bottom
- Clear financial formatting
- Progress bars for probability

---

## 6. Recommendations Screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ Strategic Recommendations                                    │
│ [Sidebar]│ Actionable initiatives to mitigate identified risks          │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ Filter by Priority: [All Priorities ▼]    4 recommendations│
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ Implement Multi-Supplier Sourcing Strategy [CRITICAL] │  │
│          │ │                                                        │  │
│          │ │ Diversify supplier base by onboarding 2-3 qualified   │  │
│          │ │ alternative suppliers for critical components...      │  │
│          │ │                                                        │  │
│          │ │ ✓ EXPECTED OUTCOME                                    │  │
│          │ │   Reduce supplier dependency from 68% to <40%,        │  │
│          │ │   increase supply chain resilience by 60%             │  │
│          │ │                                                        │  │
│          │ │ 🕐 90 days  │  🔴 HIGH Effort  │  👤 Chief Operations Officer│
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ Launch Customer Retention Initiative      [CRITICAL]  │  │
│          │ │                                                        │  │
│          │ │ Deploy dedicated account management team for at-risk  │  │
│          │ │ enterprise customers. Implement quarterly business... │  │
│          │ │                                                        │  │
│          │ │ ✓ EXPECTED OUTCOME                                    │  │
│          │ │   Reduce churn rate by 40%, increase customer         │  │
│          │ │   lifetime value by $2.1M                             │  │
│          │ │                                                        │  │
│          │ │ 🕐 60 days  │  🟡 MEDIUM Effort  │  👤 Chief Revenue Officer│
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ IMPLEMENTATION OVERVIEW                                │  │
│          │ │                                                        │  │
│          │ │    2          2         180        4                  │  │
│          │ │ Critical   High      Total Days  Stakeholders         │  │
│          │ │ Priority   Priority                                   │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Priority filter
- Recommendation cards with full details
- Expected outcome highlighted (green box)
- Effort color-coded (red/amber/green)
- Implementation summary at bottom

---

## 7. Department Heatmap

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ Department Risk Heatmap                                      │
│ [Sidebar]│ Cross-functional risk visibility and monitoring              │
│          │                                                              │
│          │ ┌──────┬──────┬──────┬──────┐                               │
│          │ │  6   │  1   │  3   │  2   │                               │
│          │ │ Total│Crit  │Warn  │Health│                               │
│          │ │ Dept │      │      │      │                               │
│          │ └──────┴──────┴──────┴──────┘                               │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ Department Risk Overview                               │  │
│          │ │                                                        │  │
│          │ │ ┌──────────┐ ┌──────────┐ ┌──────────┐                │  │
│          │ │ │Operations│ │  Sales   │ │Technology│                │  │
│          │ │ │ ⚠️ 3     │ │ ⚠️ 2     │ │ ⚠️ 2     │                │  │
│          │ │ │   82     │ │   68     │ │   64     │                │  │
│          │ │ │ Risk Scr │ │ Risk Scr │ │ Risk Scr │                │  │
│          │ │ │[████████]│ │[██████░░]│ │[██████░░]│                │  │
│          │ │ │ CRITICAL │ │ WARNING  │ │ WARNING  │                │  │
│          │ │ └──────────┘ └──────────┘ └──────────┘                │  │
│          │ │                                                        │  │
│          │ │ ┌──────────┐ ┌──────────┐ ┌──────────┐                │  │
│          │ │ │ Finance  │ │   HR     │ │Marketing │                │  │
│          │ │ │ ⚠️ 1     │ │ ⚠️ 1     │ │          │                │  │
│          │ │ │   42     │ │   58     │ │   38     │                │  │
│          │ │ │ Risk Scr │ │ Risk Scr │ │ Risk Scr │                │  │
│          │ │ │[████░░░░]│ │[█████░░░]│ │[███░░░░░]│                │  │
│          │ │ │ HEALTHY  │ │ WARNING  │ │ HEALTHY  │                │  │
│          │ │ └──────────┘ └──────────┘ └──────────┘                │  │
│          │ │                                                        │  │
│          │ │ Legend: 🟢 Healthy (0-50) 🟡 Warning (51-70) 🔴 Critical (71-100)│
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │ RISK DISTRIBUTION ANALYSIS                             │  │
│          │ │                                                        │  │
│          │ │ Operations    [████████████████████░░] 82/100  3 alerts│  │
│          │ │ Sales         [█████████████░░░░░░░░] 68/100  2 alerts│  │
│          │ │ Technology    [████████████░░░░░░░░░] 64/100  2 alerts│  │
│          │ │ HR            [███████████░░░░░░░░░░] 58/100  1 alert │  │
│          │ │ Finance       [████████░░░░░░░░░░░░░] 42/100  1 alert │  │
│          │ │ Marketing     [███████░░░░░░░░░░░░░░] 38/100  0 alerts│  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Visual Elements:**
- Summary metrics (top)
- 3x2 grid of department cards
- Color-coded by risk level
- Progress bars within cards
- Detailed distribution chart (bottom)
- Legend for interpretation

---

## 8. Executive Report

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [AC] ACDS                                    [🔔] Robert Chen [👤] [⎋] │
├──────────┬──────────────────────────────────────────────────────────────┤
│          │ Executive Summary Report              [🖨️ Print] [📥 Export PDF]│
│ [Sidebar]│ Comprehensive company diagnostic overview                    │
│          │                                                              │
│          │ ┌────────────────────────────────────────────────────────┐  │
│          │ │                                                        │  │
│          │ │ Company Health Diagnostic Report        72/100        │  │
│          │ │ Generated: January 20, 2026, 09:30 AM                 │  │
│          │ │ ─────────────────────────────────────────────────────  │  │
│          │ │                                                        │  │
│          │ │ EXECUTIVE SUMMARY                                      │  │
│          │ │ The Autonomous Company Diagnostic System has           │  │
│          │ │ identified 3 active risk alerts across the             │  │
│          │ │ organization, with 1 classified as critical...         │  │
│          │ │                                                        │  │
│          │ │ KEY PERFORMANCE INDICATORS                             │  │
│          │ │ ┌──────┬──────┬──────┬──────┐                         │  │
│          │ │ │+8.2% │24.5% │89.3% │7.8/10│                         │  │
│          │ │ │Revenue│Margin│Retain│Satis │                         │  │
│          │ │ └──────┴──────┴──────┴──────┘                         │  │
│          │ │                                                        │  │
│          │ │ CRITICAL RISK ALERTS                                   │  │
│          │ │ 1. Supply Chain Disruption Detected [CRITICAL]        │  │
│          │ │    Significant delays in raw material procurement...  │  │
│          │ │    Operations | HIGH IMPACT | Jan 18                  │  │
│          │ │                                                        │  │
│          │ │ 2. Customer Churn Rate Increasing [WARNING]           │  │
│          │ │    Enterprise customer churn rate increased by 15%... │  │
│          │ │    Sales | HIGH IMPACT | Jan 17                       │  │
│          │ │                                                        │  │
│          │ │ DEPARTMENT RISK OVERVIEW                               │  │
│          │ │ ┌────┬────┬────┬────┬────┬────┐                       │  │
│          │ │ │Ops │Sale│Tech│Fin │HR  │Mkt │                       │  │
│          │ │ │82🔴│68🟡│64🟡│42🟢│58🟡│38🟢│                       │  │
│          │ │ └────┴────┴────┴────┴────┴────┘                       │  │
│          │ │                                                        │  │
│          │ │ STRATEGIC RECOMMENDATIONS                              │  │
│          │ │ 1. Implement Multi-Supplier Sourcing [CRITICAL]       │  │
│          │ │    Owner: COO | Timeline: 90 days | Effort: HIGH      │  │
│          │ │                                                        │  │
│          │ │ 2. Launch Customer Retention Initiative [CRITICAL]    │  │
│          │ │    Owner: CRO | Timeline: 60 days | Effort: MEDIUM    │  │
│          │ │                                                        │  │
│          │ │ ─────────────────────────────────────────────────────  │  │
│          │ │ Confidential - Executive Leadership Only               │  │
│          │ │ © 2026 ACDS - All rights reserved                     │  │
│          │ │                                                        │  │
│          │ └────────────────────────────────────────────────────────┘  │
│          │                                                              │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Report Structure:**
- Export buttons (top right)
- Single-page comprehensive layout
- Executive summary narrative
- KPI snapshot grid
- Alert list with key details
- Department risk grid
- Top recommendations
- Confidential footer

---

## Design Specifications

### Spacing
- Page padding: 32px (p-8)
- Card padding: 24px (p-6)
- Element spacing: 16px (space-y-4)
- Section spacing: 24px (space-y-6)

### Colors
- Background: #f1f5f9 (gray-50)
- Cards: #ffffff (white)
- Borders: #e2e8f0 (gray-200)
- Primary: #1e3a5f (corporate-navy)
- Text: #1e293b (gray-900)

### Typography
- Page titles: 24px semibold
- Section headers: 18px semibold
- Card titles: 16px semibold
- Body text: 14px normal
- Labels: 12px normal

### Components
- Border radius: 2px (rounded-sm)
- Shadows: Subtle (shadow-sm)
- Transitions: 150ms ease
- Focus rings: 2px navy

---

**These wireframes represent the complete UI structure of the ACDS platform, designed for executive-level clarity and professional presentation.**
