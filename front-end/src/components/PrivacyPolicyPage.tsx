import { Shield, Lock, EyeOff, Server, Bot, CheckCircle2, ArrowLeft } from 'lucide-react';
import { HeaderBrand } from './HeaderBrand';
import { Footer } from './Footer';
import type { User as UserType } from '../api/client';

interface PrivacyPolicyPageProps {
  onHome: () => void;
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
  user?: UserType | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export function PrivacyPolicyPage({
  onHome,
  onNavigate,
  user,
  onLogout,
  onOpenProfile,
}: PrivacyPolicyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4">
          <HeaderBrand
            onClick={onHome}
            onNavigate={onNavigate}
            user={user}
            onLogout={onLogout}
            onOpenProfile={onOpenProfile}
            activeScreen="privacy"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16 flex-1">
        {/* Top Back Navigation */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onHome}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-emerald-100 dark:border-emerald-800/70">
            <Shield className="w-4 h-4" />
            <span>Privacy & Data Protection Policy</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Your Privacy Is Our Non-Negotiable Foundation
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Borrower Copilot is an independent borrower advocate. Unlike loan marketplaces that monetize your data by selling leads to aggressive telemarketers, we operate under a strict, borrower-first privacy commitment.
          </p>
          <div className="mt-3 text-xs text-slate-400">
            Last Updated: 2026 · Effective Immediately
          </div>
        </div>

        {/* Key Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="card p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-100/60 dark:border-emerald-800/60">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Zero Bureau Pulls</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never trigger hard or soft inquiries with CIBIL, Experian, Equifax, or CRIF High Mark.
            </p>
          </div>

          <div className="card p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3 border border-primary-100/60 dark:border-primary-800/60">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Strict Isolation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your numbers are stored in encrypted database records accessible only through your authenticated account.
            </p>
          </div>

          <div className="card p-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 border border-amber-100/60 dark:border-amber-800/60">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">No Lead Brokering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never sell, rent, or distribute your email or financial profile to lenders, DSAs, or banks.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="card bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-primary-600">1.</span> Information We Collect
            </h2>
            <p className="mb-3">
              Borrower Copilot collects only the minimum information necessary to execute financial calculations and securely associate saved diagnostics with your account:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Account Credentials:</strong> Name, email address, and an encrypted salted password hash (via bcrypt) when creating an account, or verified name and email when signing in via Google OAuth.
              </li>
              <li>
                <strong>Self-Reported Financial Variables:</strong> Monthly take-home salary, existing loan EMIs, rent, estimated monthly household expenses, desired loan amount, loan type, and proposed tenure.
              </li>
              <li>
                <strong>Feedback & Inquiries:</strong> Any messages, category selections, or support questions you voluntarily submit through our Contact form or Send Feedback widget.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>2. Sensitive Data We NEVER Request or Store</span>
            </h2>
            <p className="mb-3">
              To guarantee complete borrower safety, our platform is architected to operate without ever handling sensitive financial identifiers:
            </p>
            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-sm space-y-2 text-emerald-900 dark:text-emerald-200">
              <p>• <strong>NO Credit Bureau Integration:</strong> Your CIBIL score is never queried, monitored, or impacted.</p>
              <p>• <strong>NO Government Identity Documents:</strong> We never ask for your PAN Card, Aadhaar Number, Passport, or Voter ID.</p>
              <p>• <strong>NO Bank Logins or Credentials:</strong> We never request net-banking credentials, account numbers, debit card details, UPI PINs, or OTPs.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-600" />
              <span>3. BorrowerIQ & Artificial Intelligence Processing</span>
            </h2>
            <p className="mb-3">
              When you generate a BorrowerIQ summary, our backend analytical engine processes your calculated numerical assessment parameters (e.g. Monthly Income, Requested Loan Amount, Fixed Obligation Ratio, and Safe EMI ceiling) to generate personalized takeaway points.
            </p>
            <p className="mb-2">
              <strong>Strict Privacy Safeguards:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-600 text-sm">
              <li>Your personal identifiers (name, email address, user ID) are <em>never</em> sent to AI generation prompts.</li>
              <li>Only anonymized numerical assessment variables are transmitted over encrypted TLS connections.</li>
              <li>AI prompts are processed purely for returning your 5 takeaway insights and are not used to train public models.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-primary-600">4.</span> Data Security & Storage Isolation
            </h2>
            <p>
              All user assessments and authentication data are stored in a dedicated MySQL database with strict row-level user isolation. Network communication is secured with TLS/HTTPS. Passwords are salted and hashed using bcrypt; plain-text passwords are never recorded in logs or persistent storage.
            </p>
          </section>

          {/* Section 5 */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-primary-600">5.</span> Your Rights and Account Control
            </h2>
            <p className="mb-3">
              You maintain complete authority over your diagnostic history:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>You can view all past assessments anytime under <strong>My Assessments</strong>.</li>
              <li>You can update your personal profile details anytime from the Profile dropdown.</li>
              <li>You can test assessments anonymously using our Demo Personas without creating an account or storing data.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-primary-600">6.</span> Contact Us About Privacy
            </h2>
            <p>
              If you have any questions or suggestions regarding our privacy practices, please contact us via our{' '}
              <button
                type="button"
                onClick={() => onNavigate?.('contact')}
                className="text-primary-600 font-semibold underline hover:text-primary-700 cursor-pointer"
              >
                Contact Page
              </button>{' '}
              or submit a message using the floating Send Feedback button.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
