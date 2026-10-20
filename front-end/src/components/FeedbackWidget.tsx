import { useState, type FormEvent } from 'react';
import { MessageSquarePlus, X, Loader2, CheckCircle2, AlertCircle, Lightbulb, AlertTriangle, HelpCircle } from 'lucide-react';
import { submitFeedback } from '../api/client';

type FeedbackCategory = 'Idea' | 'Problem' | 'Other';

const CATEGORIES: { value: FeedbackCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'Idea', label: 'Idea', icon: <Lightbulb className="w-4 h-4" />, color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { value: 'Problem', label: 'Problem', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-danger-600 bg-danger-50 border-danger-200 hover:bg-danger-100' },
  { value: 'Other', label: 'Other', icon: <HelpCircle className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50 border-primary-200 hover:bg-primary-100' },
];

const MAX_CHARS = 2000;

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setCategory(null);
    setMessage('');
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!category) {
      setError('Please select a category.');
      return;
    }
    if (!message.trim()) {
      setError('Please write your feedback before submitting.');
      return;
    }
    if (message.trim().length > MAX_CHARS) {
      setError(`Feedback must be ${MAX_CHARS} characters or fewer.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await submitFeedback(category, message.trim());
      setSuccess(res.message || 'Thank you for your feedback!');
      setCategory(null);
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSuccess(null);
          setError(null);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-[0.97] print:hidden"
        title="Send Feedback"
        aria-label="Send Feedback"
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span className="hidden sm:inline">Send Feedback</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in print:hidden">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Send Feedback</h3>
                  <p className="text-xs text-slate-500">Help us improve Borrower Copilot</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              {/* Success State */}
              {success && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-success-100 text-success-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Feedback Submitted</h4>
                  <p className="text-sm text-slate-600">{success}</p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-primary text-sm py-2 px-6 rounded-lg"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Form */}
              {!success && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-danger-50 border border-danger-100 rounded-xl flex items-start gap-2 text-danger-700 text-sm animate-fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <div className="flex gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            setCategory(cat.value);
                            setError(null);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
                            category === cat.value
                              ? cat.color + ' border-current'
                              : 'text-slate-500 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {cat.icon}
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="feedback-message">
                      Your Feedback
                    </label>
                    <textarea
                      id="feedback-message"
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setError(null);
                      }}
                      className="input-field resize-none text-sm"
                      placeholder="Tell us what's on your mind..."
                      maxLength={MAX_CHARS}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs ${message.length > MAX_CHARS * 0.9 ? 'text-danger-500' : 'text-slate-400'}`}>
                        {message.length}/{MAX_CHARS}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !category || !message.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Feedback</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
