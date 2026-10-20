import { useState, type FormEvent } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Shield, HelpCircle, Loader2 } from 'lucide-react';
import { submitContact, type User } from '../api/client';
import { HeaderBrand } from './HeaderBrand';
import { Footer } from './Footer';

interface ContactPageProps {
  onHome: () => void;
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
  user?: User | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

interface FaqItem {
  question: string;
  answer: string;
}

export function ContactPage({
  onHome,
  onNavigate,
  user,
  onLogout,
  onOpenProfile,
}: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Does running an assessment impact my CIBIL or Experian credit score?',
      answer: 'No, absolutely not. Borrower Copilot never initiates hard or soft inquiries with credit rating agencies. It is a completely self-contained mathematical diagnostic based solely on the figures you input.',
    },
    {
      question: 'Why is my Borrower-Safe amount lower than what my bank offered me?',
      answer: 'Lenders evaluate debt using maximum risk capacity models designed to maximize loan disbursement. In contrast, Borrower Copilot factors in mandatory living cost buffers, family dependents, emergency reserve preservation, and income volatility to protect your household from financial stress.',
    },
    {
      question: 'How is my personal financial data protected and is it shared with lenders?',
      answer: 'We never sell, share, or broker your financial details to third-party lenders, DSAs, or marketing agents. Your assessments are stored in a private database isolated strictly under your user account with industry-standard encryption.',
    },
    {
      question: 'What is the Negotiation Card and how should I use it with my bank manager?',
      answer: 'The Negotiation Card provides an executive summary of your calculated safe EMI ceiling, a fair interest rate target based on current market spreads, and specific leverage points. You can bring it or reference it directly during branch discussions to resist sales pressure.',
    },
    {
      question: 'What is BorrowerIQ and how are insights generated?',
      answer: 'BorrowerIQ evaluates your numerical assessment through our secure analytical engine to deliver five clear, plain-English strategic takeaways. It highlights budget safety margins, debt-trap warnings, and high-impact tips like early prepayment compounding and bundled insurance defense.',
    },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all fields before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await submitContact(name.trim(), email.trim(), subject.trim(), message.trim());
      setSuccess(res.message || 'Your inquiry has been submitted successfully.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <HeaderBrand
            onClick={onHome}
            onNavigate={onNavigate}
            user={user}
            onLogout={onLogout}
            onOpenProfile={onOpenProfile}
            activeScreen="contact"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-primary-100">
            <Mail className="w-4 h-4" />
            Contact & FAQs
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Have questions or feedback?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our mission is empowering borrowers with transparent financial intelligence. Send us a message or browse common questions below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 card bg-white shadow-md p-6 sm:p-8 rounded-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-600" />
              <span>Send Us a Message</span>
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-start gap-3 text-success-800 text-sm animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Message Delivered</div>
                  <div>{success}</div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-3 text-danger-800 text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="contact-name">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field text-sm sm:text-base py-3 rounded-xl"
                    placeholder="Priya Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="contact-email">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field text-sm sm:text-base py-3 rounded-xl"
                    placeholder="priya@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field text-sm sm:text-base py-3 rounded-xl"
                  placeholder="e.g., Question about EMI ceiling calculation"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field resize-none text-sm sm:text-base py-3 rounded-xl"
                  placeholder="Share your thoughts, suggestions, or loan assessment questions..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base font-semibold py-3 px-6 rounded-xl shadow-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card bg-white shadow-md p-6 rounded-2xl border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary-600" />
                <span>Frequently Asked Questions</span>
              </h2>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-slate-200/80 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 font-semibold text-sm sm:text-base text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card bg-primary-50/60 border border-primary-100 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-primary-800">
              <Shield className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
              <span>
                All inquiries are stored privately in our secure database and are never sold or shared with loan brokers or financial telemarketers.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
