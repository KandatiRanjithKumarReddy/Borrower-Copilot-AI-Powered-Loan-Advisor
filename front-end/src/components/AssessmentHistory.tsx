import { useState, useEffect } from 'react';
import { History, Calendar, ChevronRight, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import { listAssessments, getAssessment, type AssessmentListItem, type AssessmentDetailResponse, type User } from '../api/client';
import { formatINR } from '../utils/formatters';
import { HeaderBrand } from './HeaderBrand';
import { Footer } from './Footer';

interface AssessmentHistoryProps {
  onSelectAssessment: (detail: AssessmentDetailResponse) => void;
  onNewAssessment: () => void;
  onHome: () => void;
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
  user?: User | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export function AssessmentHistory({
  onSelectAssessment,
  onNewAssessment,
  onHome,
  onNavigate,
  user,
  onLogout,
  onOpenProfile,
}: AssessmentHistoryProps) {
  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchList = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssessments(pageNum, 10);
      setAssessments(res.assessments);
      setTotalPages(res.pagination.totalPages || 1);
      setPage(res.pagination.page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch assessment history.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(page);
  }, [page]);

  const handleItemClick = async (id: number) => {
    try {
      setLoadingDetailId(id);
      const detail = await getAssessment(id);
      onSelectAssessment(detail);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load assessment details.';
      alert(msg);
    } finally {
      setLoadingDetailId(null);
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'BORROW':
        return <span className="badge-success">Borrow</span>;
      case 'BORROW_LESS':
        return <span className="badge-warning">Borrow Less</span>;
      case 'DONT_BORROW':
        return <span className="badge-danger">Don't Borrow</span>;
      default:
        return <span className="badge-info">{rec}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4">
          <HeaderBrand
            onClick={onHome}
            onNavigate={onNavigate}
            user={user}
            onLogout={onLogout}
            onOpenProfile={onOpenProfile}
            activeScreen="history"
            rightAction={
              <button
                onClick={onNewAssessment}
                className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">New Assessment</span>
                <span className="sm:hidden">New</span>
              </button>
            }
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <History className="w-7 h-7 text-primary-600" />
              My Saved Assessments
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review your past borrowing evaluations, diagnostic cards, and AI summaries.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl mb-6 flex items-start gap-3 text-danger-800 text-sm">
            <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {loading && (
          <div className="card py-16 text-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading your assessments...</p>
          </div>
        )}

        {!loading && assessments.length === 0 && !error && (
          <div className="card py-16 text-center bg-white shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Assessments Yet</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
              You haven't run any loan evaluations yet. Complete a 4-step diagnostic to get your safe borrowing numbers.
            </p>
            <button onClick={onNewAssessment} className="btn-primary text-sm py-2.5 px-6">
              Start Your First Assessment
            </button>
          </div>
        )}

        {!loading && assessments.length > 0 && (
          <div className="space-y-3">
            {assessments.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="card bg-white p-5 hover:border-primary-300 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 capitalize text-base">
                      {item.loanPurpose.replace('_', ' ')} Loan
                    </span>
                    {getRecommendationBadge(item.recommendation)}
                    {item.hasAiSummary && (
                      <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
                        AI Summary Ready
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>Requested: <strong>{formatINR(item.requestedAmount)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-primary-600 font-semibold text-xs self-end sm:self-auto group-hover:translate-x-0.5 transition-transform">
                  {loadingDetailId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>View Results</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn-ghost text-xs disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="btn-ghost text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
