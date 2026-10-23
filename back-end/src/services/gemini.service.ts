import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import type { AssessmentInput, AssessmentResult } from '../engine/types.js';

const SYSTEM_INSTRUCTION = `You are an expert, empathetic borrower advocate and personal financial copilot for Indian families.
Your mission is to write exactly 5 personalized, plain-English takeaway points for the borrower.

CRITICAL RULES:
1. ALWAYS CITE THE BORROWER'S REAL NUMBERS:
   - In EVERY point, you MUST mention their specific Rupee amounts (₹), percentages, or tenure years from the Assessment Data.
   - Do NOT write generic or vague advice. Every point must feel custom-tailored to their exact financial numbers.

2. STRUCTURE THE 5 POINTS DYNAMICALLY:
   - Point 1 (Monthly Cash Flow Reality):
     Quote their exact monthly income, rent, living expenses, and show what leftover cash remains (₹ amount) after paying the requested monthly payment (EMI).
   - Point 2 (Verdict & Safe Borrowing Limit):
     - If BORROW: State why their requested loan of ₹X is safely below their safe borrowing capacity of ₹Y, and warn against accepting aggressive bank offers of ₹Z.
     - If BORROW_LESS: Clearly contrast their requested loan of ₹X against the safe limit of ₹Y, explaining how much they need to cut down.
     - If DONT_BORROW: Explain the dangerous cash shortfall or high-cost debt trap they face if they take this loan.
   - Point 3 (Emergency Buffer & Stress Test Reality):
     Quote their emergency savings (₹X) and state what happens during the 15% income shock (quote the exact leftover ₹ surplus or deficit from the stress test).
   - Point 4 (Actionable Adjustment Tailored to Their Situation):
     - If BORROW: State their fair interest rate band (quote X% to Y%) and explain how tenure choices affect total interest.
     - If BORROW_LESS: Give a concrete adjustment (e.g., increase down payment or stretch tenure from X to Y years to bring the payment down to the safe ₹ limit).
     - If DONT_BORROW: Give immediate debt recovery advice (clearing high-interest credit card/app debt or building 3 months of emergency savings before taking any loan).
   - Point 5 (Bank Negotiation Defense):
     Give a specific talking point to use at the bank branch: tell them to reject unnecessary lender-bundled insurance packages (which can add ₹20,000–₹50,000 to the debt) and ask for a 100% waiver on bank processing fees.

3. CLEAN PLAIN TEXT ONLY:
   - Output exactly 5 numbered points (1 to 5).
   - Keep each point crisp (1-2 sentences), natural, and direct.
   - DO NOT USE ANY MARKDOWN ASTERISKS OR STARS (no **bold**, no *italics*, no * bullets). Output clean plain text only.
4. BAN ALL TECHNICAL JARGON:
   - Do NOT use terms like "APR", "FOIR", "DTI", "amortization", "verdict", "ceiling", or "debt service ratio".
   - Use plain everyday terms: say "total loan cost with bank charges" instead of "APR", "safe monthly payment limit" instead of "safe EMI ceiling", and "expensive credit card dues" instead of "high-cost debt".`;

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

  const monthlyIncome = Number(input?.borrower?.monthlyIncome) || 0;
  const rent = Number(input?.financial?.rent) || 0;
  const expenses = Number(input?.financial?.householdExpenses) || 0;
  const existingEmi = Number(input?.financial?.existingEmi) || 0;
  const requestedEmi = Number(result?.requestedEmi) || 0;
  const safeEmi = Number(result?.safeEmi) || 0;
  const emergencySavings = Number(input?.financial?.emergencySavings) || 0;
  const leftoverCash = monthlyIncome - (rent + expenses + existingEmi + requestedEmi);

  const promptContent = `Assessment Data for Borrower:
- Profile: Age ${input?.borrower?.age ?? 'N/A'}, ${input?.borrower?.employmentType ?? 'N/A'}, Monthly Income ₹${monthlyIncome.toLocaleString('en-IN')}
- Loan Request: Purpose: ${input?.loan?.purpose ?? 'personal'}, Requested Amount: ₹${Number(input?.loan?.requestedAmount || 0).toLocaleString('en-IN')}, Tenure: ${input?.loan?.tenure ?? 3} years
- Monthly Commitments: Rent ₹${rent.toLocaleString('en-IN')}, Household Living Expenses ₹${expenses.toLocaleString('en-IN')}, Existing EMIs ₹${existingEmi.toLocaleString('en-IN')}
- Emergency Savings: ₹${emergencySavings.toLocaleString('en-IN')}
- Safe Limits vs Requested:
  * Safe Monthly Payment Limit: ₹${safeEmi.toLocaleString('en-IN')} (vs Requested Monthly Payment: ₹${requestedEmi.toLocaleString('en-IN')})
  * Safe Loan Capacity: ₹${Number(result?.borrowerSafeAmount || 0).toLocaleString('en-IN')} (Bank Sales Indicative: ₹${Number(result?.lenderIndicativeAmount || 0).toLocaleString('en-IN')})
  * Monthly Cash Leftover After Requested Loan & All Bills: ₹${leftoverCash.toLocaleString('en-IN')}
- Recommendation: ${result?.recommendation ?? 'BORROW'} (${result?.recommendationReason ?? ''})
- Fair Interest Rate Band: ${result?.fairRateMin ?? ''}% - ${result?.fairRateMax ?? ''}% (Total cost APR with fees: ${result?.estimatedAprMin ?? ''}% - ${result?.estimatedAprMax ?? ''}%)
- High Cost Debt Warning: ${result?.highCostDebtWarning ? result?.highCostDebtMessage || 'Active credit card or high-cost loan app dues detected' : 'None'}
- Stress Test (15% Income Shock): Manageable: ${result?.stressTest?.isManageable ? 'Yes' : 'No'} - ${result?.stressTest?.explanation || ''}
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
