import { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  BrainCircuit,
} from 'lucide-react';
import type { AssessmentInput, AssessmentResult } from '../engine/types';
import { generateAiSummary, generatePreviewAiSummary, type AiSummaryResponse } from '../api/client';

interface AiSummaryCardProps {
  assessmentId?: number;
  initialSummary?: {
    text: string;
    createdAt?: string;
  } | null;
  isDemo?: boolean;
  input?: AssessmentInput;
  result?: AssessmentResult;
}

function parseFivePoints(rawText: string): string[] {
  if (!rawText) return [];

  // Split into lines to extract numbered points, headings, or bullets
  const lines = rawText.trim().split(/\n+/);
  const points: string[] = [];
  let current = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Matches "1.", "1 -", "### 1.", "• ", "Point 1:", etc.
    const isNewPoint = /^(#{1,4}\s*)?(\d+[\.\)\-:]|\(?\d+\)|Point\s+\d+:?|[•\-])\s*/i.test(trimmed);

    if (isNewPoint) {
      if (current) points.push(current);
      // Remove the leading number/heading/bullet prefix for clean uniform rendering
      current = trimmed.replace(/^(#{1,4}\s*)?(\d+[\.\)\-:]|\(?\d+\)|Point\s+\d+:?|[•\-])\s*/i, '').trim();
    } else {
      if (current) {
        current += ' ' + trimmed;
      } else {
        current = trimmed;
      }
    }
  }

  if (current) points.push(current);

  if (points.length === 0) {
    return [rawText.trim()];
  }

  return points.slice(0, 5);
}

function FormattedPointText({ text }: { text: string }) {
  // Parse **bold text** without losing other content
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return (
            <strong key={idx} className="font-bold text-slate-900">
              {content}
            </strong>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}

export function AiSummaryCard({
  assessmentId,
  initialSummary,
  isDemo: _isDemo,
  input,
  result,
}: AiSummaryCardProps) {
  const [summaryData, setSummaryData] = useState<AiSummaryResponse | null>(
    initialSummary
      ? {
          summary: initialSummary.text,
          cached: true,
          unavailable: false,
          modelUsed: 'ai',
        }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (initialSummary) {
      setSummaryData({
        summary: initialSummary.text,
        cached: true,
        unavailable: false,
      });
    }
  }, [initialSummary]);

  const handleGenerate = async (force = false) => {
    if (loading) return; // Prevent duplicate concurrent requests

    try {
      setLoading(true);
      setError(null);
      let res: AiSummaryResponse;

      if (assessmentId) {
        res = await generateAiSummary(assessmentId, force);
      } else if (input && result) {
        // Unsaved or demo assessment: call live preview endpoint
        res = await generatePreviewAiSummary(input, result);
      } else {
        throw new Error('Assessment data is missing. Please compute an assessment first.');
      }

      setSummaryData(res);
    } catch (err: unknown) {
      // Sanitized error — never expose model names or technical codes
      const rawMsg = err instanceof Error ? err.message : '';
      let friendlyError = 'BorrowerIQ insights are currently experiencing high demand. Please try again in a few moments.';
      if (rawMsg.includes('hourly rate limit') || rawMsg.includes('limit reached')) {
        friendlyError = 'You have reached the summary generation limit for this assessment. Please check back later.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    const cleanText = text.replace(/\*\*/g, '').replace(/^["']|["']$/g, '').trim();
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const points = summaryData?.summary ? parseFivePoints(summaryData.summary) : [];

  return (
    <div className="card border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition-shadow rounded-2xl p-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 border border-primary-200">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>BorrowerIQ — AI Financial Insights</span>
              {summaryData?.cached && (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  Cached
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              5 personalized strategic takeaways tailored to your numbers
            </p>
          </div>
        </div>

        {summaryData && !loading && (
          <button
            onClick={() => handleGenerate(true)}
            disabled={loading}
            className="btn-ghost text-xs flex items-center gap-1.5 self-start sm:self-auto py-1.5 px-3 text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer rounded-lg border border-slate-200"
            title="Generate fresh insights"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        )}
      </div>

      {/* State 1: Error Banner */}
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-100 rounded-xl mb-4 text-sm text-danger-700 flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-danger-500 mt-0.5" />
            <div>
              <p className="font-semibold text-danger-800">BorrowerIQ Notice</p>
              <p className="text-danger-700 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => handleGenerate(true)}
            disabled={loading}
            className="btn-primary text-xs py-1.5 px-3 bg-danger-600 hover:bg-danger-700 text-white shrink-0 rounded-lg cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* State 2: Polished Multi-stage Loading Card */}
      {loading && (
        <div className="py-8 px-6 text-center space-y-3 bg-slate-50/80 rounded-xl border border-slate-100 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Preparing your BorrowerIQ insights...
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Analyzing your results. This may take a few moments.
            </p>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping delay-100" />
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-ping delay-200" />
          </div>
        </div>
      )}

      {/* State 3: 5 Key Takeaway Points List */}
      {!loading && summaryData && (
        <div className="divide-y divide-slate-100">
          {points.map((pointText, index) => {
            const isScriptOrQuote =
              pointText.includes('"') ||
              pointText.toLowerCase().includes('tell the bank') ||
              pointText.toLowerCase().includes('bank manager');

            return (
              <div key={index} className="py-4 first:pt-1 last:pb-1 flex items-start gap-3.5">
                {/* Number Badge */}
                <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 border border-primary-200">
                  {index + 1}
                </div>

                {/* Point Text with Bold Formatting */}
                <div className="flex-1 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <FormattedPointText text={pointText} />

                  {/* Inline Copy Button for bank negotiation script if present */}
                  {isScriptOrQuote && (
                    <button
                      onClick={() => handleCopy(pointText, index)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-md transition-colors ml-2 align-middle cursor-pointer border border-primary-200"
                      title="Copy script"
                    >
                      {copiedIdx === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* State 4: Initial Prompt */}
      {!loading && !summaryData && (
        <div className="text-center py-6 px-4 bg-slate-50/60 rounded-xl border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mx-auto mb-3 border border-primary-200">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Generate BorrowerIQ Insights
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-4 leading-relaxed">
            Get 5 plain-English takeaway insights analyzing your safe EMI ceiling, budget defense, add-on traps, and prepayment leverage.
          </p>
          <button
            onClick={() => handleGenerate(false)}
            disabled={loading}
            className="btn-primary text-sm sm:text-base py-2.5 px-6 rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate BorrowerIQ Insights</span>
          </button>
        </div>
      )}
    </div>
  );
}
