import { Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">Borrower Copilot</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Empowering Indian borrowers with independent financial diagnostics to calculate safe borrowing limits before negotiating with lenders.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200/60">
              <Shield className="w-3.5 h-3.5 text-primary-600" />
              <span>Zero CIBIL Impact • Strict Data Isolation</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('landing')}
                  className="hover:text-primary-600 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('about')}
                  className="hover:text-primary-600 transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('contact')}
                  className="hover:text-primary-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('history')}
                  className="hover:text-primary-600 transition-colors cursor-pointer"
                >
                  My Assessments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('privacy')}
                  className="hover:text-primary-600 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Borrower Protection Commitment */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Borrower Protection Commitment
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Borrower Copilot is an independent consumer decision-support tool. We are not a bank or loan distributor. We do not sell leads, collect commissions, or steer you toward high-margin credit products.
            </p>
            <p className="text-xs text-slate-400">
              Always inspect total APR, insurance add-ons, and processing charges before signing loan documents.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Centered Credit & Privacy Policy */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center justify-center gap-2.5 text-center">
          <p className="text-base sm:text-lg font-semibold text-slate-800 flex items-center justify-center gap-1.5 flex-wrap">
            <span>© 2026 Borrower Copilot</span>
            <span className="text-slate-300">·</span>
            <span>Built independently by Ranjith</span>
            <Heart className="w-5 h-5 text-red-500 fill-red-500 inline-block shrink-0 drop-shadow-xs" />
          </p>
          <div>
            <button
              type="button"
              onClick={() => onNavigate?.('privacy')}
              className="text-xs sm:text-sm text-slate-400 hover:text-slate-600 underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
