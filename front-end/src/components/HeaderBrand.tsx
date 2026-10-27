import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  History,
  ChevronDown,
  Sun,
  Moon,
  Home,
  Info,
  Mail,
  FileText,
} from 'lucide-react';
import type { User } from '../api/client';
import { useTheme } from '../utils/theme';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();

  const handleBrandClick = () => {
    if (onClick) {
      onClick();
    } else if (onNavigate) {
      onNavigate('landing');
    }
  };

  const handleNav = (screen: 'landing' | 'about' | 'contact' | 'history' | 'login' | 'privacy') => {
    setDrawerOpen(false);
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

  // Lock body scroll and listen for Escape key when mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setDrawerOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [drawerOpen]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="w-full flex items-center justify-between gap-2 relative">
      {/* Left side: Mobile Hamburger Button (top-left) + Brand */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Top-Left Hamburger button on mobile screens */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 text-slate-800 dark:text-zinc-100 bg-slate-100/90 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-700/80 hover:text-slate-950 dark:hover:text-white rounded-xl hover:bg-slate-200/70 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0 shadow-2xs"
            aria-label="Open Navigation Menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation-drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Brand Logo & Name */}
        <button
          type="button"
          onClick={handleBrandClick}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer rounded-xl px-1.5 sm:px-2 py-1.5 transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-zinc-900 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 text-left border-none bg-transparent min-w-0"
          aria-label="Borrower Copilot Home"
          title="Borrower Copilot Home"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xs shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate">
            Borrower Copilot
          </span>
        </button>
      </div>

      {/* Desktop Navigation Links (Center) */}
      {onNavigate && (
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-zinc-300 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeScreen === 'landing'
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/60 dark:text-primary-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeScreen === 'about'
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/60 dark:text-primary-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60'
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeScreen === 'contact'
                ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/60 dark:text-primary-400 font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60'
            }`}
          >
            Contact
          </button>
          {user && (
            <button
              type="button"
              onClick={() => handleNav('history')}
              className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'history'
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-950/60 dark:text-primary-400 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-zinc-800/60'
              }`}
            >
              My Assessments
            </button>
          )}
        </nav>
      )}

      {/* Right Controls: Theme Toggle + User Dropdown / Login + rightAction */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Quick Header Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-700 dark:text-zinc-200 bg-slate-100/80 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-700/80 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 shrink-0"
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-scale-in" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 animate-scale-in" />
          )}
        </button>

        {user ? (
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            {/* User Profile Pill Button */}
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-full border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="true"
              title="Account menu"
            >
              <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold text-xs flex items-center justify-center border border-primary-200 dark:border-primary-800 shrink-0">
                {getInitials(user.name)}
              </div>
              <span className="max-w-[100px] sm:max-w-[120px] truncate hidden sm:inline">{user.name}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 transition-transform duration-200 ${
                  profileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                role="menu"
                aria-label="Profile and account menu"
                className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-zinc-800 py-2 z-50 animate-scale-in"
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800/80">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">{user.email}</div>
                </div>

                {/* Theme Toggle Inside Dropdown Menu */}
                <div className="px-2 py-1.5 border-b border-slate-100 dark:border-zinc-800/80">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={toggleTheme}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {isDark ? (
                        <Moon className="w-4 h-4 text-primary-400" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                        isDark ? 'bg-primary-600 justify-end' : 'bg-slate-200 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </div>
                  </button>
                </div>

                {/* Profile Actions */}
                <div className="py-1 px-2 space-y-0.5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenProfile?.();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNav('history');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <History className="w-4 h-4 text-slate-400 dark:text-zinc-400" />
                    <span>My Saved Assessments</span>
                  </button>
                </div>

                {/* Logout Option */}
                <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-1 px-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Standalone Logout Button (Desktop visible) */}
            <button
              type="button"
              onClick={onLogout}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-danger-700 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 hover:bg-danger-600 hover:text-white dark:hover:bg-danger-600 dark:hover:text-white border border-danger-200/80 dark:border-danger-900/60 transition-all duration-200 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleNav('login')}
            className="text-xs sm:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 px-3 sm:px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            Login
          </button>
        )}

        {/* Optional Right Action (e.g. New Assessment, Start Over) */}
        {rightAction}
      </div>

      {/* ─── Mobile Left-Sliding Navigation Drawer (Rendered via Portal to escape header backdrop-filter) ─── */}
      {onNavigate &&
        drawerOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="md:hidden fixed inset-0 z-[100]" id="mobile-navigation-drawer">
            {/* Backdrop Overlay with blur */}
            <div
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Body sliding from the left */}
            <div
              className="fixed inset-y-0 left-0 w-72 sm:w-80 max-w-[85vw] bg-white dark:bg-zinc-950 shadow-2xl border-r border-slate-200 dark:border-zinc-800 flex flex-col z-[101] animate-slide-in-left overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Site Navigation"
            >
              {/* Drawer Header with Brand & Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    handleBrandClick();
                  }}
                  className="flex items-center gap-2.5 text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    Borrower Copilot
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Banner (if logged in) */}
              {user && (
                <div className="p-4 bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold text-sm flex items-center justify-center border border-primary-200 dark:border-primary-800 shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      onOpenProfile?.();
                    }}
                    className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="p-3 flex-1 space-y-1">
                <button
                  type="button"
                  onClick={() => handleNav('landing')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeScreen === 'landing'
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Home</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeScreen === 'about'
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0" />
                  <span>About</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('contact')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeScreen === 'contact'
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Contact</span>
                </button>

                {user && (
                  <button
                    type="button"
                    onClick={() => handleNav('history')}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      activeScreen === 'history'
                        ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold shadow-2xs'
                        : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <History className="w-4 h-4 shrink-0" />
                    <span>My Assessments</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleNav('privacy')}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeScreen === 'privacy'
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold shadow-2xs'
                      : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Privacy Policy</span>
                </button>
              </div>

              {/* Drawer Footer: Theme Switcher & Auth */}
              <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-3 bg-slate-50/50 dark:bg-zinc-900/40">
                {/* Theme Toggle Button inside Drawer */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-primary-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <span>{isDark ? 'Dark Theme (Pure Black)' : 'Light Theme'}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                    {isDark ? 'Dark' : 'Light'}
                  </span>
                </button>

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-danger-700 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 hover:bg-danger-100 dark:hover:bg-danger-900/60 border border-danger-200/80 dark:border-danger-900/50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNav('login')}
                    className="w-full py-2.5 text-center text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Login to Borrower Copilot
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
