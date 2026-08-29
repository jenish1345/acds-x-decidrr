/**
 * Gemini Multimodal API Service
 *
 * Sends uploaded files (PDF, image, CSV text) to Gemini and extracts
 * structured financial insights. All raw Gemini output is cleaned and
 * structured before being handed to the UI — the user never sees raw JSON.
 */

import type { GeminiInsight } from '../types/financial';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

const SYSTEM_PROMPT = `You are a senior financial analyst AI. The user has uploaded a financial document.
Your job is to extract and analyze the financial information and return a structured JSON response.

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "summary": "2-3 sentence plain English summary of the company's financial health",
  "keyMetrics": [
    {"label": "Revenue", "value": "$X.XM", "sentiment": "positive"},
    {"label": "Net Margin", "value": "X%", "sentiment": "neutral"},
    {"label": "YoY Growth", "value": "+X%", "sentiment": "positive"}
  ],
  "risks": ["Risk 1 in plain English", "Risk 2"],
  "opportunities": ["Opportunity 1", "Opportunity 2"],
  "recommendation": "One clear, actionable recommendation in plain English",
  "extractedMetrics": [
    {
      "period": "Q1 2024",
      "revenue": 45000000,
      "grossProfit": 20000000,
      "operatingIncome": 8000000,
      "netIncome": 6000000,
      "totalAssets": 200000000,
      "totalEquity": 90000000,
      "totalDebt": 50000000,
      "ebitda": 10000000
    }
  ]
}

If quarterly or annual financial figures (revenue, profits, assets, debt, equity, etc.) exist in the document, populate extractedMetrics with at least 2-4 periods of numbers extracted directly from the document.
Sentiment must be one of: positive, negative, neutral.
Use plain English — no financial jargon. Be concise. Extract 3-6 key metrics.`;

/**
 * Convert a File to a base64 string and determine its MIME type
 */
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type || 'application/octet-stream',
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze a financial document with Gemini Multimodal API
 */
export async function analyzeWithGemini(
  file: File,
  apiKey: string
): Promise<GeminiInsight> {
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Please add your key to the .env file.');
  }

  let parts: object[];

  if (file.type === 'text/csv' || file.type === 'text/plain') {
    // For text-based files, read as text and send as text part
    const text = await file.text();
    parts = [
      { text: SYSTEM_PROMPT },
      { text: `\n\nAnalyze this financial data:\n\n${text.slice(0, 8000)}` },
    ];
  } else {
    // For PDFs and images, use inline data
    const filePart = await fileToGenerativePart(file);
    parts = [
      { text: SYSTEM_PROMPT },
      filePart,
    ];
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Strip any accidental markdown code fences
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  let parsed: Omit<GeminiInsight, 'rawText'>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: extract what we can
    parsed = {
      summary: rawText.slice(0, 300),
      keyMetrics: [],
      risks: ['Unable to parse structured risks from document'],
      opportunities: ['Unable to parse structured opportunities from document'],
      recommendation: 'Review the document manually for detailed insights.',
    };
  }

  return { ...parsed, rawText };
}
