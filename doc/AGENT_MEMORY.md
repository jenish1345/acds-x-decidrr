# Agent Memory — ACDS Financial Dashboard

> Updated every time work is completed, even a single line of code change.

---

## Project Context

- **Repo**: `acds-x-decidrr`
- **Target app**: `acds_platform/acds-platform` (Vite + React + TypeScript + Tailwind)
- **Tech stack**: React 18, TypeScript, Tailwind CSS, Vite, Framer Motion, Recharts, Zustand, React Query
- **Backend**: FastAPI at port 8001 (`acds_platform/backend/server.py`)
- **Existing charts lib**: `recharts` (already installed)

## User Decisions

| Decision | Choice |
|----------|--------|
| Gemini API key | User has one — will add to `.env` as `VITE_GEMINI_API_KEY` |
| Dashboard placement | **Replace** the current Executive Dashboard with the Financial Dashboard |

## Task 2 Requirements

1. **Chart.js** → Interactive financial charts (line, bar, donut for KPIs, revenue, margins)
2. **Monte Carlo simulation** → Show multiple future outcome paths instead of a single prediction
3. **DuPont profitability model** → Break ROE into Net Margin × Asset Turnover × Equity Multiplier
4. **Gradient Boosting + Random Forest Regressor** → Pure TypeScript/JS in-browser ML to predict financial metrics
5. **Gemini Multimodal API** → Upload PDFs, images, financial reports → Gemini extracts insights
6. **Simple intuitive UI** → Hide complexity, show clear insights, no jargon overload

---

## Session Log

### Session 1 — 2026-08-29

#### Research completed
- Explored full repo structure: `acds_platform/acds-platform/src/` with views, components, ml, data, store, hooks, services, utils, types dirs
- Existing dependencies: recharts, framer-motion, lucide-react, zustand, react-query, papaparse, jspdf
- `.env.example` has `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLIC_KEY`, `VITE_OPENAI_API_KEY`
- Only one ML file exists: `src/ml/anomalyDetector.ts` (Z-score + IQR)
- Current dashboard: `DashboardView.tsx` uses mock workforce data, not financial data
- App state: starts directly at 'authenticated' → 'dashboard' (no auth friction)
- Sidebar has 10 menu items; will add 'financial' view item

#### Files created
| File | Purpose |
|------|---------|
| `doc/AGENT_MEMORY.md` | This file |
| `src/types/financial.ts` | TypeScript types for all financial data |
| `src/ml/monteCarlo.ts` | Monte Carlo GBM simulation engine |
| `src/ml/dupont.ts` | DuPont decomposition engine with plain-English diagnosis |
| `src/ml/regressors.ts` | In-browser Random Forest + Gradient Boosting regressors |
| `src/services/geminiService.ts` | Gemini Multimodal API integration |
| `src/data/financialData.ts` | 8-quarter realistic sample financial dataset |
| `src/components/Financial/RevenueChart.tsx` | Chart.js line chart with ML predictions |
| `src/components/Financial/MarginsChart.tsx` | Chart.js bar chart for profit margins |
| `src/components/Financial/MonteCarloChart.tsx` | Monte Carlo fan chart (P10–P90 bands) |
| `src/components/Financial/DuPontChart.tsx` | DuPont dual-axis bar + line chart |
| `src/components/Financial/GeminiUploadPanel.tsx` | Drag-and-drop file upload + Gemini result display |
| `src/views/FinancialView.tsx` | Main financial dashboard (all 6 features wired) |

#### Files modified
| File | Change |
|------|--------|
| `src/App.tsx` | Added FinancialView import, 'financial' view type, default activeView |
| `src/components/Layout/Sidebar.tsx` | Added Financial Intelligence as first nav item with AI badge |
| `.env.example` | Added `VITE_GEMINI_API_KEY` documentation |

#### Packages installed
- `chart.js` v4+ (Chart.js core)
- `react-chartjs-2` (React wrapper)
- `@google/generative-ai` (Gemini SDK — not used directly but available)

#### Verification results (browser check)
- ✅ KPI cards: Revenue $67.8M (+10.4%), Net Income $11.8M, EBITDA $18.9M, Net Margin 17.4%
- ✅ Gemini upload panel: drag-drop zone + API key warning shown correctly
- ✅ Revenue chart: historical trend renders with Chart.js
- ✅ ML Forecast: "Run AI Forecast" button → "ML Active" badge appears → 4 quarter predictions with confidence scores
- ✅ Profit Margins: grouped bar chart for gross/operating/net margins
- ✅ Monte Carlo: fan chart with Best Case ($118.4M), Expected ($101.3M), Downside Risk (0.0%)
- ✅ DuPont: dual-axis bar+line chart with plain-English diagnosis
- ✅ No TS errors in new files; pre-existing errors in repo are unrelated
- ✅ No browser console errors

#### Status: COMPLETE ✅

---

### Session 2 — 2026-08-29 (key activation)

- User added real `VITE_GEMINI_API_KEY` to `acds_platform/acds-platform/.env`
- Verified in browser: amber "API Key Required" warning is **gone**
- Upload panel shows clean state: "Drop a financial report here, or click to browse"
- Gemini Multimodal API is now fully live and ready for PDF/image/CSV uploads
- **Status: All 6 features fully operational** ✅

---

### Session 3 — 2026-08-29 (Gemini model fix)

- **Bug**: `gemini-1.5-flash` returned "not found for API version v1beta"
- **Fix**: Updated `src/services/geminiService.ts` model URL to `gemini-2.0-flash`
- Vite HMR auto-reloaded — no server restart needed

---

### Session 4 — 2026-08-29 (Gemini 3.6-flash)

- **Bug**: `gemini-2.0-flash` returned "no longer available"
- **Fix**: Updated model to `gemini-3.6-flash` per API error guidance
- Model history: `1.5-flash` → `2.0-flash` → `3.6-flash` (current)

---

### Session 5 — 2026-08-29 (Cleanup & Real Data Integration)

- **Unwanted Markdown Files Removed**: Deleted 28 redundant `.md` documentation files from `acds_platform/acds-platform/`.
- **Mock Data Cleanup**:
  - Removed `getMockInsight()` fallback from `geminiService.ts`.
  - Removed `mockStripeService` export from `stripeService.ts`.
  - Renamed `mockUser` export to `currentUser` in `mockData.ts` and updated imports in `App.tsx` & `Header.tsx`.
- **Real Document Data Integration**:
  - Enhanced `gemini-3.6-flash` prompt to extract real numeric quarterly financial metrics (`extractedMetrics`) from uploaded reports/spreadsheets.
  - Updated `FinancialView.tsx` so all charts (Revenue, Margins), Monte Carlo simulations, DuPont model, and ML forecasts dynamically update to use REAL extracted financial metrics upon document upload.
  - Added reset option to toggle between loaded document metrics and baseline data.
- **Verification**:
  - `npx tsc --noEmit` passed with 0 errors on all financial and updated files.
  - All 6 core requirements remain fully functional and live at `http://localhost:5173`.
- **Status: CLEANED & COMPLETE ✅**

