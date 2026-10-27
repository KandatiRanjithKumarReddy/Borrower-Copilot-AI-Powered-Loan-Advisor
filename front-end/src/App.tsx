import { useState, useCallback, useEffect } from 'react';
import type { AssessmentInput, AssessmentResult } from './engine/types';
import { assessBorrower } from './engine';
import {
  getMe,
  logout,
  createAssessment,
  type User,
  type AssessmentDetailResponse,
} from './api/client';
import { LandingPage } from './components/LandingPage';
import { Questionnaire } from './components/Questionnaire';
import { ResultsPage } from './components/ResultsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AssessmentHistory } from './components/AssessmentHistory';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { FeedbackWidget } from './components/FeedbackWidget';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Toast } from './components/Toast';
import { Loader2 } from 'lucide-react';

type AppScreen =
  | 'landing'
  | 'questionnaire'
  | 'results'
  | 'about'
  | 'contact'
  | 'history'
  | 'privacy';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Auth & Profile Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Assessment State
  const [assessmentInput, setAssessmentInput] = useState<AssessmentInput | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [assessmentId, setAssessmentId] = useState<number | undefined>(undefined);
  const [initialSummary, setInitialSummary] = useState<{ text: string; createdAt?: string } | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pending action to execute after successful login
  const [pendingAssessmentInput, setPendingAssessmentInput] = useState<AssessmentInput | null>(null);

  // Toast Notifications
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getMe();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setShowProfileModal(false);
    setPendingAssessmentInput(null);
    setShowAuthModal(false);
    setToast({
      message: 'You have been logged out successfully. See you again!',
      type: 'info',
    });
    if (screen === 'history') {
      setScreen('landing');
    }
  }, [screen]);

  const handleStart = useCallback(() => {
    if (!user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    setSubmitError(null);
    setScreen('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  const handleAssessmentExecution = useCallback(
    async (input: AssessmentInput) => {
      try {
        setSubmitting(true);
        setSubmitError(null);
        setAssessmentInput(input);
        setIsDemo(false);

        const res = await createAssessment(input);
        setResult(res.result);
        setAssessmentId(res.id);
        setInitialSummary(null);
        setScreen('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to calculate assessment. Please try again.';
        setSubmitError(msg);
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  // Demo Persona Clicks: Purely client-side preview — NOT saved to MySQL or My Assessments!
  const handleLoadPersona = useCallback((input: AssessmentInput) => {
    const demoResult = assessBorrower(input);
    setAssessmentInput(input);
    setResult(demoResult);
    setAssessmentId(undefined);
    setIsDemo(true);
    setInitialSummary(null);
    setSubmitError(null);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Real Assessment Complete (from Questionnaire): Authenticated save to MySQL
  const handleAssessmentComplete = useCallback(
    (input: AssessmentInput) => {
      setIsDemo(false);
      if (!user) {
        setPendingAssessmentInput(input);
        setAuthModalMode('register');
        setShowAuthModal(true);
        return;
      }
      handleAssessmentExecution(input);
    },
    [user, handleAssessmentExecution]
  );

  // Allow explicitly saving a preview demo assessment if user requests it
  const handleSaveDemoAssessment = useCallback(async () => {
    if (!assessmentInput) return;
    if (!user) {
      setPendingAssessmentInput(assessmentInput);
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    await handleAssessmentExecution(assessmentInput);
  }, [assessmentInput, user, handleAssessmentExecution]);

  const handleAuthSuccess = useCallback(
    (loggedInUser: User, action: 'login' | 'register' = 'login') => {
      setUser(loggedInUser);
      setShowAuthModal(false);

      if (action === 'register') {
        setToast({
          message: 'Account created successfully! Welcome to Borrower Copilot.',
          type: 'success',
        });
      } else {
        setToast({
          message: "Welcome back! You've logged in successfully.",
          type: 'success',
        });
      }

      if (pendingAssessmentInput) {
        const input = pendingAssessmentInput;
        setPendingAssessmentInput(null);
        handleAssessmentExecution(input);
      }
    },
    [pendingAssessmentInput, handleAssessmentExecution]
  );

  const handleSelectHistoryAssessment = useCallback((detail: AssessmentDetailResponse) => {
    setAssessmentInput(detail.input);
    setResult(detail.result);
    setAssessmentId(detail.id);
    setInitialSummary(detail.aiSummary);
    setIsDemo(false);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartOver = useCallback(() => {
    setAssessmentInput(null);
    setResult(null);
    setAssessmentId(undefined);
    setInitialSummary(null);
    setIsDemo(false);
    setSubmitError(null);
    setScreen('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoHome = useCallback(() => {
    setScreen('landing');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback(
    (targetScreen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => {
      setSubmitError(null);
      if (targetScreen === 'login') {
        setAuthModalMode('login');
        setShowAuthModal(true);
        return;
      }
      setScreen(targetScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        setScreen('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">Initializing Borrower Copilot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      {screen === 'landing' && (
        <LandingPage
          onStart={handleStart}
          onLoadPersona={handleLoadPersona}
          onHome={handleGoHome}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {screen === 'questionnaire' && (
        <Questionnaire
          onComplete={handleAssessmentComplete}
          onBack={() => setScreen('landing')}
          onHome={handleGoHome}
          loading={submitting}
          error={submitError}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {screen === 'results' && result && assessmentInput && (
        <ResultsPage
          result={result}
          input={assessmentInput}
          assessmentId={assessmentId}
          initialSummary={initialSummary}
          isDemo={isDemo}
          onSaveAssessment={isDemo ? handleSaveDemoAssessment : undefined}
          onStartOver={handleStartOver}
          onHome={handleGoHome}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {screen === 'about' && (
        <AboutPage
          onStart={handleStart}
          onHome={handleGoHome}
          onExplorePersonas={() => setScreen('landing')}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {screen === 'contact' && (
        <ContactPage
          onHome={handleGoHome}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {screen === 'history' && (
        <AssessmentHistory
          onSelectAssessment={handleSelectHistoryAssessment}
          onNewAssessment={() => {
            setSubmitError(null);
            setScreen('questionnaire');
          }}
          onHome={handleGoHome}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {screen === 'privacy' && (
        <PrivacyPolicyPage
          onHome={handleGoHome}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
          onOpenProfile={() => setShowProfileModal(true)}
        />
      )}

      {/* Authentication Modal: Login, Register, Google Sign-In & Sign-Up */}
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          onSuccess={handleAuthSuccess}
          onClose={() => {
            setShowAuthModal(false);
            setPendingAssessmentInput(null);
          }}
        />
      )}

      {/* Profile Modal: View & Edit Name, Personal Details, Member Since, Logout */}
      {showProfileModal && user && (
        <ProfileModal
          user={user}
          onUpdateUser={(updated) => setUser(updated)}
          onLogout={handleLogout}
          onClose={() => setShowProfileModal(false)}
          onGoToHistory={() => {
            setShowProfileModal(false);
            handleNavigate('history');
          }}
        />
      )}

      {/* Floating Send Feedback Widget - accessible globally across all views */}
      <FeedbackWidget />

      {/* Toast Notification Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
