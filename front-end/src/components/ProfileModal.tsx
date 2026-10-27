import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  User,
  Mail,
  Calendar,
  LogOut,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  History,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { updateProfile, type User as UserType } from '../api/client';

interface ProfileModalProps {
  user: UserType;
  onUpdateUser: (updated: UserType) => void;
  onLogout: () => void;
  onClose: () => void;
  onGoToHistory: () => void;
}

export function ProfileModal({
  user,
  onUpdateUser,
  onLogout,
  onClose,
  onGoToHistory,
}: ProfileModalProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updated = await updateProfile(name.trim());
      onUpdateUser(updated);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-black rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden animate-scale-in transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* AI-Inspired Header Banner */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-800 dark:from-zinc-900 dark:via-black dark:to-zinc-950 px-6 sm:px-8 pt-8 pb-7 text-white border-b border-primary-500/20 dark:border-zinc-800">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-400/20 via-transparent to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Identity Section */}
          <div className="relative flex items-center gap-4 sm:gap-5">
            {/* Avatar with Glow and Initials */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white dark:bg-zinc-900 text-primary-700 dark:text-primary-400 font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white/30 dark:border-zinc-700/60">
                {getInitials(user.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white dark:border-zinc-900" title="Active Account">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Name and Account Status */}
            <div className="min-w-0 flex-1">
              <h3 id="profile-modal-title" className="text-xl sm:text-2xl font-bold truncate tracking-tight">
                {user.name}
              </h3>
              <p className="text-xs text-primary-100 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300 dark:text-emerald-400 shrink-0" />
                <span className="truncate">Verified Personal Account</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Success Banner */}
          {success && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Information Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-400">
                Personal Information
              </span>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-2.5 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Name</span>
                </button>
              )}
            </div>

            {/* Editable Name Form */}
            {editing ? (
              <form onSubmit={handleSave} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5" htmlFor="edit-name">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      id="edit-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-black text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                      placeholder="Enter your full legal name"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                    This name will appear on all your generated financial self-assessments.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setName(user.name);
                      setError(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850">
                <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                  <span>Full Name</span>
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
              </div>
            )}

            {/* Email Address Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850">
              <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                <span>Email Address</span>
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.email}</span>
            </div>

            {/* Member Since Timestamp */}
            {user.createdAt && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850">
                <span className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                  <span>Member Since</span>
                </span>
                <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Quick Access Card */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToHistory();
              }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-primary-300 dark:hover:border-primary-700 bg-white dark:bg-zinc-900/50 hover:bg-primary-50/40 dark:hover:bg-primary-950/20 flex items-center justify-between text-left transition-all duration-200 group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <History className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    My Saved Assessments
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    Review past loan calculations & stress tests
                  </div>
                </div>
              </div>
              <span className="text-sm text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* Logout Action Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-zinc-400">End your current session</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-4 py-2 text-xs font-semibold text-danger-700 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 hover:bg-danger-100 dark:hover:bg-danger-900/50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-danger-200/80 dark:border-danger-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
