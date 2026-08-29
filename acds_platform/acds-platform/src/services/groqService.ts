/**
 * Groq API Service
 * 
 * Powered by Groq Llama 3.3 70B (and Llama 3.2 Vision)
 * Delivers ultra-low latency structured financial analysis.
 */

import type { GeminiInsight as AIInsight, FinancialMetric } from '../types/financial';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_TEXT_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_VISION_MODEL = 'llama-3.2-11b-vision-preview';

const SYSTEM_PROMPT = `You are a senior financial analyst AI. The user has provided a financial document, statement, or data.
Your job is to extract and analyze the financial information and return a structured JSON response.

Return ONLY valid JSON matching this exact schema:
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

Guidelines:
- If quarterly or annual financial figures (revenue, profits, assets, debt, equity, etc.) exist in the document, populate extractedMetrics with real numbers in USD.
- Sentiment must be one of: "positive", "negative", "neutral".
- Use plain English — avoid unnecessary jargon. Extract 3-6 key metrics.`;

/**
 * Convert a file to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      resolve(res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze financial documents or data using Groq API
 */
export async function analyzeWithGroq(
  file: File,
  apiKey: string,
  modelOverride?: string
): Promise<AIInsight> {
  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY is not set. Please add your Groq key to the .env file.');
  }

  const isImage = file.type.startsWith('image/');
  const model = modelOverride || (isImage ? DEFAULT_VISION_MODEL : DEFAULT_TEXT_MODEL);

  let userContent: any;

  if (isImage) {
    const base64Data = await fileToBase64(file);
    userContent = [
      {
        type: 'text',
        text: 'Extract all financial metrics, risks, performance indicators, and financial tables from this document image.'
      },
      {
        type: 'image_url',
        image_url: {
          url: base64Data
        }
      }
    ];
  } else {
    // For CSV, TXT, or PDF text
    const text = await file.text();
    userContent = `Analyze the following financial report data (${file.name}):\n\n${text.slice(0, 30000)}`;
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawText: string = data?.choices?.[0]?.message?.content ?? '{}';

  let parsed: Omit<AIInsight, 'rawText'>;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }

  return {
    summary: parsed.summary || 'Financial document analyzed successfully.',
    keyMetrics: parsed.keyMetrics || [],
    risks: parsed.risks || [],
    opportunities: parsed.opportunities || [],
    recommendation: parsed.recommendation || 'Continue monitoring quarterly variance.',
    extractedMetrics: parsed.extractedMetrics,
    rawText
  };
}
