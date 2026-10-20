import { useState, type FormEvent } from 'react';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { register, type User as UserType } from '../api/client';
import { HeaderBrand } from './HeaderBrand';

interface RegisterPageProps {
  onSuccess: (user: UserType) => void;
  onSwitchToLogin: () => void;
  onClose?: () => void;
}

export function RegisterPage({ onSuccess, onSwitchToLogin, onClose }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await register(name.trim(), email.trim(), password);
      onSuccess(res.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="flex justify-between items-center mb-6">
          <HeaderBrand onClick={onClose} />
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Join Borrower Copilot to save your personalized borrowing assessments and BorrowerIQ summaries.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-danger-50 border border-danger-100 rounded-xl flex items-start gap-2.5 text-danger-700 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-danger-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-11 text-sm sm:text-base py-3 rounded-xl"
                  placeholder="Priya Sharma"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11 text-sm sm:text-base py-3 rounded-xl"
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="register-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 text-sm sm:text-base py-3 rounded-xl"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Must contain at least 6 characters.</p>
            </div>

            <div className="p-3 bg-primary-50/70 border border-primary-100 rounded-xl flex items-center gap-2.5 text-xs text-primary-700">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-primary-600" />
              <span>Your diagnostic numbers are protected with strict user isolation.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-3 flex items-center justify-center gap-2 text-base font-semibold py-3 px-6 rounded-xl shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-primary-600 hover:text-primary-700 underline focus:outline-none cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
