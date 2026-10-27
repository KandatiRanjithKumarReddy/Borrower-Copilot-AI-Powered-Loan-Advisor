import {
  Shield,
  TrendingUp,
  Target,
  Percent,
  CreditCard,
  ArrowRight,
  Sparkles,
  User,
} from 'lucide-react';
import type { AssessmentInput } from '../engine/types';
import { PERSONAS } from '../utils/personas';

import { HeaderBrand } from './HeaderBrand';
import { Footer } from './Footer';
import type { User as UserType } from '../api/client';

interface LandingPageProps {
  onStart: () => void;
  onLoadPersona: (input: AssessmentInput) => void;
  onHome?: () => void;
  user?: UserType | null;
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export function LandingPage({
  onStart,
  onLoadPersona,
  onHome,
  user,
  onNavigate,
  onLogout,
  onOpenProfile,
}: LandingPageProps) {
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
            activeScreen="landing"
          />
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary-100">
            <Sparkles className="w-4 h-4" />
            Personal Financial Self-Assessment
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Know what you can afford
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              before you negotiate.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Answer four essential questions before speaking to a lender.
            Get a personal Negotiation Card with transparent, explainable numbers and AI financial summaries — stored securely in your private account with zero credit bureau impact.
          </p>

          <button
            onClick={onStart}
            className="btn-primary text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-3 shadow-xl shadow-primary-200/50"
            id="start-assessment"
          >
            Start Assessment
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 animate-fade-in-up delay-200">
          <FeatureCard
            icon={<Target className="w-5 h-5" />}
            title="Should I borrow at all?"
            description="Honest assessment of whether borrowing makes sense for your situation — including when the answer is no."
            color="success"
          />
          <FeatureCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="How much can I safely borrow?"
            description="Two separate numbers: what a lender may offer vs. what you can actually afford. They are rarely the same."
            color="primary"
          />
          <FeatureCard
            icon={<Percent className="w-5 h-5" />}
            title="What is a fair interest rate?"
            description="A transparent rate range based on your profile — not a guarantee, but a baseline for negotiation."
            color="warning"
          />
          <FeatureCard
            icon={<CreditCard className="w-5 h-5" />}
            title="What EMI should I agree to?"
            description="Your EMI ceiling, tenure trade-offs, and stress-tested resilience. Know your limit before you sign."
            color="danger"
          />
        </div>

        {/* Privacy Strip */}
        <div className="mt-12 text-center animate-fade-in delay-300">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-lg max-w-2xl border border-slate-800">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-slate-200 text-center sm:text-left leading-relaxed">
              Zero credit bureau impact • 100% private financial diagnostics. We never pull your CIBIL score or sell your data to lenders. Your numbers stay securely isolated in your private account.
            </p>
          </div>
        </div>

        {/* Quick Demo Personas */}
        <div className="mt-16 animate-fade-in-up delay-400">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Quick Demo</p>
            <p className="text-slate-600 dark:text-zinc-300 mt-1">Load a sample borrower profile to see the assessment instantly</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {Object.entries(PERSONAS).map(([key, persona]) => (
              <button
                key={key}
                onClick={() => onLoadPersona(persona.data)}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900/90 border-2 border-slate-200 dark:border-zinc-800 hover:border-primary-300 dark:hover:border-primary-500/80 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-md dark:hover:bg-zinc-900 group cursor-pointer"
                id={`persona-${key}`}
              >
                <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/90 border border-primary-200/60 dark:border-primary-800/70 flex items-center justify-center shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/80 transition-colors">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-800 dark:text-white text-sm">{persona.label}</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">{persona.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'success' | 'primary' | 'warning' | 'danger';
}) {
  const colors = {
    success: 'bg-success-50 text-success-600 border-success-100',
    primary: 'bg-primary-50 text-primary-600 border-primary-100',
    warning: 'bg-warning-50 text-warning-600 border-warning-100',
    danger: 'bg-danger-50 text-danger-600 border-danger-100',
  };

  return (
    <div className="card hover:shadow-lg group">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3 border transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
