import { useState, type FormEvent } from 'react';
import { User, Mail, Calendar, LogOut, Edit2, Check, X, Shield, History, Loader2 } from 'lucide-react';
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
      setTimeout(() => setSuccess(false), 3000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with background gradient */}
        <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 px-6 pt-8 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-primary-700 font-extrabold text-xl flex items-center justify-center shadow-md">
              {getInitials(user.name)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-xs text-primary-100 flex items-center gap-1 mt-0.5">
                <Shield className="w-3.5 h-3.5" />
                Verified Borrower Account
              </p>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          {success && (
            <div className="p-3 bg-success-50 border border-success-200 rounded-xl text-success-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-success-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal Details
              </span>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Name</span>
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-3">
                <div>
                  <label className="input-label text-xs" htmlFor="edit-name">
                    Full Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field text-sm py-2"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setName(user.name);
                    }}
                    className="btn-ghost text-xs py-1.5 px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-500 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Full Name</span>
                </span>
                <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Email Address</span>
              </span>
              <span className="text-sm font-semibold text-slate-800">{user.email}</span>
            </div>

            {user.createdAt && (
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Member Since</span>
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToHistory();
              }}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-primary-600" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-primary-700">
                  My Saved Assessments
                </span>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-primary-600">→</span>
            </button>
          </div>

          {/* Logout Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sign out of this session</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-danger-700 bg-danger-50 hover:bg-danger-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
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
