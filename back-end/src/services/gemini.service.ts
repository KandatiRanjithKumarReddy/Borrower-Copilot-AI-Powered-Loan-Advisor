import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import type { AssessmentInput, AssessmentResult } from '../engine/types.js';

const SYSTEM_INSTRUCTION = `You are an expert, empathetic borrower advocate and personal financial copilot for Indian families.
Your mission is to write exactly 5 concise, plain-English takeaway points for the borrower.

CRITICAL RULES:
1. OUTPUT EXACTLY 5 NUMBERED POINTS (1 to 5):
   - Keep each point crisp (1-2 sentences), natural, and direct.
   - DO NOT USE ANY MARKDOWN ASTERISKS OR STARS (no **bold**, no *italics*, no * bullets). Output clean plain text only.
2. BAN ALL TECHNICAL JARGON:
   - Do NOT use terms like "APR", "FOIR", "DTI", "amortization", "verdict", "ceiling", "debt service ratio", or "stress test scenario".
   - Use plain, everyday terms:
     * Instead of "APR", say "total loan cost including bank processing charges".
     * Instead of "safe EMI ceiling", say "safe monthly payment limit".
     * Instead of "high-cost debt", say "expensive credit card dues or personal loans".
3. DO NOT MERELY REPEAT RAW NUMBERS:
   - Explain what the calculations realistically mean for daily living, savings, and peace of mind.
4. THE 5 POINTS MUST COVER:
   1. Household Budget Impact: What this payment means for daily living, rent, and monthly savings.
   2. Bank Sales vs Your Protection: Why lenders push higher loan amounts to meet sales targets, and why sticking to your safe limit protects your family.
   3. Emergency Buffer: Keeping your family safety savings untouched rather than draining them for loan fees or down payments.
   4. Practical Adjustment Tip: How adjusting tenure or down payment keeps monthly payments comfortable.
   5. Prepayment Defense and Add-on Trap: Warn about unnecessary lender-bundled insurance packages that inflate the loan amount and explain how making small early principal prepayments during the initial years dramatically cuts front-loaded interest without stressing monthly cash flow.`;

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
];

export interface GeminiSummaryResult {
  summary: string;
  unavailable: boolean;
  modelUsed: string;
  promptTokens?: number;
  responseTokens?: number;
}

export async function generateAiSummary(
  input: AssessmentInput,
  result: AssessmentResult
): Promise<GeminiSummaryResult> {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in backend .env. Please provide a valid Gemini API key.');
  }

  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const promptContent = `Assessment Data:
- Borrower: Age ${input?.borrower?.age ?? 'N/A'}, ${input?.borrower?.employmentType ?? 'N/A'}, Monthly Income ₹${input?.borrower?.monthlyIncome ?? 'N/A'}
- Loan Purpose: ${input?.loan?.purpose ?? 'N/A'}, Requested Amount: ₹${input?.loan?.requestedAmount ?? 'N/A'}, Tenure: ${input?.loan?.tenure ?? 'N/A'} years
- Financials: Existing EMI ₹${input?.financial?.existingEmi ?? 0}, Expenses ₹${input?.financial?.householdExpenses ?? 0}, Rent ₹${input?.financial?.rent ?? 0}
- Recommendation: ${result?.recommendation ?? 'BORROW'} (${result?.recommendationReason ?? ''})
- Safe Borrowing Amount: ₹${result?.borrowerSafeAmount ?? 'N/A'} (Lender Indicative: ₹${result?.lenderIndicativeAmount ?? 'N/A'}, Recommended: ₹${result?.recommendedAmount ?? 'N/A'})
- Safe Monthly EMI Ceiling: ₹${result?.safeEmi ?? 'N/A'} (Requested EMI: ₹${result?.requestedEmi ?? 'N/A'})
- Fair Interest Rate Range: ${result?.fairRateMin ?? ''}% - ${result?.fairRateMax ?? ''}%
- APR Range: ${result?.estimatedAprMin ?? ''}% - ${result?.estimatedAprMax ?? ''}%
- Confidence: ${result?.confidence ?? 'MEDIUM'}
- High Cost Debt: ${result?.highCostDebtWarning ? result?.highCostDebtMessage || 'Warning present' : 'None'}
- Stress Test Scenario: ${result?.stressTest?.scenario || 'Standard'} (Manageable: ${result?.stressTest?.isManageable ? 'Yes' : 'No'} - ${result?.stressTest?.explanation || ''})
- Explanations: ${Array.isArray(result?.explanations) ? result.explanations.join('; ') : ''}`;

  let lastError: unknown = null;

  // Try candidate models in order with retry on transient errors (503, 429, timeout)
  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[BorrowerIQ] Calling model: ${modelName} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptContent,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });

        const text = response.text || '';
        if (text.trim().length > 0) {
          console.log(`[BorrowerIQ] Successfully generated insights using model: ${modelName}`);
          return {
            summary: text.trim(),
            unavailable: false,
            modelUsed: modelName,
            promptTokens: response.usageMetadata?.promptTokenCount,
            responseTokens: response.usageMetadata?.candidatesTokenCount,
          };
        }
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[BorrowerIQ] Model ${modelName} attempt ${attempt} error: ${msg.slice(0, 150)}`);

        // Retry on transient errors: 503 (overloaded), 429 (rate limit/quota), timeouts
        const isTransient = msg.includes('503') || msg.includes('demand') || msg.includes('TIMEOUT')
          || msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');

        if (attempt < 2 && isTransient) {
          const delay = 1500 * attempt; // 1.5s first retry, 3s second
          console.log(`[BorrowerIQ] Transient error detected. Retrying in ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
        } else {
          // Non-transient error or exhausted retries — move to next candidate model
          if (CANDIDATE_MODELS.indexOf(modelName) < CANDIDATE_MODELS.length - 1) {
            const nextModel = CANDIDATE_MODELS[CANDIDATE_MODELS.indexOf(modelName) + 1];
            console.log(`[BorrowerIQ] Primary model ${modelName} failed. Switching to fallback: ${nextModel}...`);
          }
          break;
        }
      }
    }
  }

  const detailedMsg = lastError instanceof Error ? lastError.message : String(lastError);
  console.error('[BorrowerIQ] All candidate models failed:', detailedMsg);

  // Throw sanitized error — do NOT expose model names or raw API errors to the user
  throw new Error('BorrowerIQ insights are temporarily unavailable due to high demand. Please try again in a few moments.');
}
