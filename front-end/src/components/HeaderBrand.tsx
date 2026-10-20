import { useState, useRef, useEffect } from 'react';
import { Sparkles, User as UserIcon, LogOut, Menu, X, History, ChevronDown } from 'lucide-react';
import type { User } from '../api/client';

export interface HeaderBrandProps {
  onClick?: () => void;
  activeScreen?: string;
  onNavigate?: (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => void;
  user?: User | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  rightAction?: React.ReactNode;
}

export function HeaderBrand({
  onClick,
  activeScreen = 'landing',
  onNavigate,
  user,
  onLogout,
  onOpenProfile,
  rightAction,
}: HeaderBrandProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleBrandClick = () => {
    if (onClick) {
      onClick();
    } else if (onNavigate) {
      onNavigate('landing');
    }
  };

  const handleNav = (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    onNavigate?.(screen);
  };

  // Close profile dropdown on outside click or Escape key
  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileDropdownOpen]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="w-full flex items-center justify-between">
      {/* Brand Logo & Name */}
      <button
        type="button"
        onClick={handleBrandClick}
        className="flex items-center gap-2.5 group cursor-pointer rounded-xl -ml-2 px-2 py-1.5 transition-all duration-200 hover:bg-slate-100/80 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 text-left border-none bg-transparent shrink-0"
        aria-label="Borrower Copilot Home"
        title="Borrower Copilot Home"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xs shrink-0">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </div>
        <span className="text-base sm:text-lg font-bold text-slate-800 transition-colors duration-200 group-hover:text-primary-600 whitespace-nowrap">
          Borrower Copilot
        </span>
      </button>

      {/* Desktop Navigation Links */}
      {onNavigate && (
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeScreen === 'landing'
                ? 'text-primary-600 bg-primary-50 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeScreen === 'about'
                ? 'text-primary-600 bg-primary-50 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeScreen === 'contact'
                ? 'text-primary-600 bg-primary-50 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Contact
          </button>
          {user && (
            <button
              type="button"
              onClick={() => handleNav('history')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeScreen === 'history'
                  ? 'text-primary-600 bg-primary-50 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <History className="w-4 h-4" />
              <span>My Assessments</span>
            </button>
          )}
        </nav>
      )}

      {/* User / Auth State Controls */}
      {onNavigate && (
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
              {/* Profile Avatar Button with Dropdown */}
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 transition-all cursor-pointer border border-slate-200/80 hover:border-slate-300"
                title="Account menu"
              >
                <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center border border-primary-200">
                  {getInitials(user.name)}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-50 animate-scale-in">
                  {/* User Info */}
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="text-sm font-semibold text-slate-900 truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user.email}</div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenProfile?.();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleNav('history');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <History className="w-4 h-4 text-slate-400" />
                      My Saved Assessments
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-danger-600 hover:bg-danger-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}

              {/* Standalone Logout Button (visible) */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-danger-700 bg-danger-50 hover:bg-danger-600 hover:text-white border border-danger-200/80 hover:border-danger-600 transition-all duration-200 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              {/* Optional Right Action (e.g. New Assessment, Start Over) */}
              {rightAction}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleNav('login')}
                className="text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                Login
              </button>
              {rightAction}
            </div>
          )}
        </div>
      )}

      {/* Mobile Controls */}
      <div className="flex md:hidden items-center gap-2">
        {rightAction}
        {onNavigate && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {onNavigate && mobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 space-y-2 z-50 animate-fade-in">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeScreen === 'landing' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeScreen === 'about' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-slate-700'
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activeScreen === 'contact' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-slate-700'
            }`}
          >
            Contact
          </button>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => handleNav('history')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeScreen === 'history' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-slate-700'
                }`}
              >
                My Assessments
              </button>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600 px-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile?.();
                  }}
                  className="font-semibold text-primary-600 underline"
                >
                  Profile ({user.name})
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-danger-700 bg-danger-50 hover:bg-danger-600 hover:text-white border border-danger-200/80 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleNav('login')}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-primary-600 rounded-lg"
              >
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
