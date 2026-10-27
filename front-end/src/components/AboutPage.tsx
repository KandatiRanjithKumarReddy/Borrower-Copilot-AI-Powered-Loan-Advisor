import { ArrowRight, Scale, ShieldCheck, Percent, Bot, FileText, CheckCircle2 } from 'lucide-react';
import { HeaderBrand } from './HeaderBrand';
import { Footer } from './Footer';
import type { User as UserType } from '../api/client';

interface AboutPageProps {
  onStart: () => void;
  onHome: () => void;
  onExplorePersonas: () => void;
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
  user?: UserType | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export function AboutPage({
  onStart,
  onHome,
  onExplorePersonas,
  onNavigate,
  user,
  onLogout,
  onOpenProfile,
}: AboutPageProps) {
  const coreFeatures = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'True Affordability Engine',
      desc: 'We stress-test your monthly cash flow against non-negotiable living costs, rent, dependents, and income volatility — preventing over-leveraging before loan approval.',
    },
    {
      icon: <Percent className="w-6 h-6 text-amber-600" />,
      title: 'Fair Interest Rate & True APR',
      desc: 'We decode advertised nominal rates by factoring in hidden processing fees, mandatory insurance, and GST to show you the real effective cost of borrowing.',
    },
    {
      icon: <Bot className="w-6 h-6 text-primary-600" />,
      title: 'BorrowerIQ AI Insights',
      desc: 'Receive personalized, plain-English strategic takeaways analyzing your safe EMI ceiling, budget defense, and early prepayment compound savings.',
    },
    {
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      title: 'Lender Negotiation Card',
      desc: 'Walk into any bank branch with a structured, printable negotiation sheet detailing target rate benchmarks and talking points to push back on predatory terms.',
    },
  ];

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
            activeScreen="about"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16 flex-1">
        {/* Mission Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary-100">
            <Scale className="w-4 h-4" />
            The Borrower's Side of the Table
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            We exist to protect borrowers from debt traps and sales pressure.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Most online loan calculators are marketing funnels built by lenders to maximize the loan volume they disburse. Borrower Copilot was built independently to calculate what protects your household financial stability.
          </p>
        </div>

        {/* Affordability vs. Eligibility */}
        <div className="card mb-14 border border-primary-100 bg-white shadow-md p-6 sm:p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Bank Eligibility vs. Genuine Affordability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 leading-relaxed text-sm sm:text-base">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80">
              <h3 className="font-bold text-slate-900 text-base mb-2 text-danger-700 flex items-center gap-2">
                <span>The Lender's Metric: Eligibility</span>
              </h3>
              <p>
                When a bank offers you a "pre-approved" ₹15 Lakhs, they are calculating the maximum mathematical risk their balance sheet can tolerate. Their algorithm does not know or care about your family medical expenses, variable incentive dips, or emergency cushions.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-primary-50/60 border border-primary-100">
              <h3 className="font-bold text-slate-900 text-base mb-2 text-primary-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary-600" />
                <span>Our Metric: Borrower Safe Capacity</span>
              </h3>
              <p>
                Borrower Copilot calculates your safe borrowing boundary (e.g. ₹9.5 Lakhs). It ensures your combined monthly debt commitments never compromise essential living expenses, emergency reserves, or long-term financial security.
              </p>
            </div>
          </div>
        </div>

        {/* Core Feature Suite */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Our Core Diagnostic Suite</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Every assessment is evaluated through four independent lenses before presenting recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreFeatures.map((feat, idx) => (
              <div key={idx} className="card p-6 bg-white border border-slate-200/80 hover:border-primary-300 hover:shadow-md transition-all rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Take control of your borrowing decision</h2>
          <p className="text-slate-600 max-w-lg mx-auto mb-6 text-sm sm:text-base">
            Zero credit bureau checks, zero sales calls, and 100% private.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onStart}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl cursor-pointer"
            >
              Start Free Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExplorePersonas}
              className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl cursor-pointer"
            >
              Explore Demo Personas
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
