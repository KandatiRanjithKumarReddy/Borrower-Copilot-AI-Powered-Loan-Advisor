import { useState, useEffect, type FormEvent } from 'react';
import { User as UserIcon, Mail, Lock, ArrowRight, Loader2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { login, register, googleLogin, type User } from '../api/client';
import { HeaderBrand } from './HeaderBrand';

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onSuccess: (user: User, action?: 'login' | 'register') => void;
  onClose?: () => void;
}

export function AuthModal({
  initialMode = 'login',
  onSuccess,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAuthError = (err: unknown, defaultFallback: string) => {
    if (err instanceof Error && err.message) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        return 'Unable to reach the server. Please check your internet connection.';
      }
      return err.message;
    }
    return defaultFallback;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      try {
        setLoading(true);
        const res = await register(name.trim(), email.trim(), password);
        onSuccess(res.user, 'register');
      } catch (err: unknown) {
        setError(formatAuthError(err, 'Failed to create your account. Please try again.'));
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter both email and password.');
        return;
      }

      try {
        setLoading(true);
        const res = await login(email.trim(), password);
        onSuccess(res.user, 'login');
      } catch (err: unknown) {
        setError(formatAuthError(err, 'Invalid email or password. Please try again.'));
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let checkInterval: any = null;

    const setupGoogle = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: { credential?: string }) => {
              if (response?.credential) {
                try {
                  setGoogleLoading(true);
                  setError(null);
                  const res = await googleLogin({ credential: response.credential });
                  onSuccess(res.user, mode === 'register' ? 'register' : 'login');
                } catch (err: unknown) {
                  setError(formatAuthError(err, 'Google authentication failed. Please try again.'));
                } finally {
                  setGoogleLoading(false);
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const container = document.getElementById('google-btn-container');
          if (container) {
            container.innerHTML = '';
            (window as any).google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              width: 360,
              text: mode === 'login' ? 'signin_with' : 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google Identity initialization notice:', e);
        }
        return true;
      }
      return false;
    };

    if (!setupGoogle()) {
      checkInterval = setInterval(() => {
        if (setupGoogle()) {
          clearInterval(checkInterval);
        }
      }, 400);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [mode, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
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

        <div className="p-6 sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Free Account'}
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {mode === 'login'
                ? 'Sign in to access your saved financial diagnostics and BorrowerIQ summaries.'
                : 'Join Borrower Copilot to safely store and compare your borrowing capacity.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-danger-50 border border-danger-100 rounded-xl flex items-start gap-2.5 text-danger-700 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-danger-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Official Google Identity Services Button */}
          <div className="w-full flex flex-col items-center mb-5">
            {googleLoading && (
              <div className="w-full py-2.5 px-4 mb-2 bg-primary-50 border border-primary-100 rounded-xl text-primary-700 text-sm font-semibold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in with Google...</span>
              </div>
            )}
            <div id="google-btn-container" className="w-full flex justify-center"></div>
          </div>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="modal-name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-11 text-sm sm:text-base py-3 rounded-xl"
                    placeholder="Priya Sharma"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="modal-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11 text-sm sm:text-base py-3 rounded-xl"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="modal-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="modal-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 text-sm sm:text-base py-3 rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="p-3 bg-primary-50/70 border border-primary-100 rounded-xl flex items-center gap-2.5 text-xs text-primary-700">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-primary-600" />
                <span>Your financial numbers are isolated and never shared with lenders.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-3 flex items-center justify-center gap-2 text-base font-semibold py-3 px-6 rounded-xl shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{mode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="font-bold text-primary-600 hover:text-primary-700 underline cursor-pointer"
              >
                {mode === 'login' ? 'Register now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
