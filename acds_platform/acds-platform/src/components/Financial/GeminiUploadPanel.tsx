/**
 * GeminiUploadPanel — Drag-and-drop file upload for financial documents.
 * Sends to Gemini Multimodal API and displays structured insights.
 * Accepts: PDF, PNG, JPG, JPEG, CSV, TXT
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { analyzeWithGroq } from '../../services/groqService';
import { analyzeWithGemini } from '../../services/geminiService';
import type { GeminiInsight } from '../../types/financial';

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/csv', 'text/plain'];
const ACCEPTED_EXT = '.pdf,.png,.jpg,.jpeg,.csv,.txt';

interface GeminiUploadPanelProps {
  onInsightReady: (insight: GeminiInsight) => void;
}

const SentimentIcon: React.FC<{ sentiment: 'positive' | 'negative' | 'neutral' }> = ({ sentiment }) => {
  if (sentiment === 'positive') return <TrendingUp size={14} className="text-emerald-500" />;
  if (sentiment === 'negative') return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
};

export const GeminiUploadPanel: React.FC<GeminiUploadPanelProps> = ({ onInsightReady }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const envVars = (import.meta as unknown as { env: Record<string, string> }).env || {};
  const rawGroqKey = envVars.VITE_GROQ_API_KEY || '';
  const rawGeminiKey = envVars.VITE_GEMINI_API_KEY || '';

  // Smart detect: Groq keys start with 'gsk_'
  const groqApiKey = rawGroqKey || (rawGeminiKey.startsWith('gsk_') ? rawGeminiKey : '');
  const geminiApiKey = !rawGeminiKey.startsWith('gsk_') ? rawGeminiKey : '';
  const apiKey = groqApiKey || geminiApiKey;
  const isGroq = Boolean(groqApiKey);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|png|jpg|jpeg|csv|txt)$/i)) {
      setError('Unsupported file type. Please upload a PDF, image, CSV, or text file.');
      return;
    }

    setFileName(file.name);
    setIsAnalyzing(true);
    setError(null);
    setInsight(null);

    try {
      let result: GeminiInsight;
      if (groqApiKey) {
        result = await analyzeWithGroq(file, groqApiKey);
      } else if (geminiApiKey) {
        result = await analyzeWithGemini(file, geminiApiKey);
      } else {
        throw new Error('Please set VITE_GROQ_API_KEY in your .env file to enable AI analysis.');
      }
      setInsight(result);
      onInsightReady(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [groqApiKey, geminiApiKey, onInsightReady]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <label
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 p-8
          ${isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40'
          }
          ${isAnalyzing ? 'pointer-events-none opacity-70' : ''}
        `}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input type="file" accept={ACCEPTED_EXT} onChange={onFileInput} className="sr-only" />

        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-indigo-100' : 'bg-white shadow-sm'}`}>
          {isAnalyzing
            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Sparkles size={24} className="text-indigo-500" />
              </motion.div>
            : <Upload size={24} className="text-gray-400" />
          }
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isAnalyzing
              ? `Analyzing "${fileName}"…`
              : 'Drop a financial report here, or click to browse'
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, PNG, JPG, CSV or TXT • Powered by {isGroq ? 'Groq Llama 3.3 70B' : 'Groq AI'}
          </p>
        </div>
      </label>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-100 p-4"
          >
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insight Result */}
      <AnimatePresence>
        {insight && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Sparkles size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">AI Financial Analysis</p>
                <p className="text-xs text-gray-500">{fileName}</p>
              </div>
              <CheckCircle size={18} className="text-emerald-500 ml-auto" />
            </div>

            <div className="p-5 space-y-4">
              {/* Summary */}
              <p className="text-sm text-gray-700 leading-relaxed">{insight.summary}</p>

              {/* Key Metrics */}
              {insight.keyMetrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {insight.keyMetrics.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <SentimentIcon sentiment={m.sentiment} />
                      <div>
                        <p className="text-xs text-gray-500">{m.label}</p>
                        <p className="text-sm font-semibold text-gray-800">{m.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Risks & Opportunities */}
              <div className="grid grid-cols-2 gap-4">
                {insight.risks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Risks</p>
                    <ul className="space-y-1">
                      {insight.risks.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-red-400 mt-0.5">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {insight.opportunities.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Opportunities</p>
                    <ul className="space-y-1">
                      {insight.opportunities.map((o, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-emerald-400 mt-0.5">•</span>{o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              {insight.recommendation && (
                <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Recommendation</p>
                  <p className="text-sm text-indigo-800">{insight.recommendation}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!apiKey && !insight && (
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-100 p-4">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700">Groq API Key Required</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Add <code className="bg-amber-100 px-1 rounded">VITE_GROQ_API_KEY=gsk_your_key</code> to{' '}
              <code className="bg-amber-100 px-1 rounded">acds_platform/acds-platform/.env</code> to enable ultra-fast document analysis.
              {' '}Get a free key at{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium text-amber-800 hover:text-amber-950"
              >
                console.groq.com/keys
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
