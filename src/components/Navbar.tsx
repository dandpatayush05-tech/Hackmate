import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Sparkles,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Clock,
  LayoutDashboard,
  UserCheck,
  UserPlus,
  Cpu,
  Home,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  User,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    theme,
    toggleTheme,
    selectedEvent,
    setSelectedEvent,
    availableEvents,
    formattedCountdown,
    notifications,
    setIsNotificationDrawerOpen,
    setIsAskAIModalOpen,
    setCurrentTab,
    currentUser,
    setIsAuthModalOpen,
  } = useHackathon();


  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (viewMode !== 'dashboard') {
      setViewMode('dashboard');
    }
    setIsAskAIModalOpen(true);
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Event Selector */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            id="nav-brand-logo"
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  HackMate AI
                </span>
                <span className="bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold px-2 py-0.5 border border-indigo-500/20 rounded-md">
                  AGENT OS
                </span>
              </div>
            </div>
          </button>

          {/* Event Selector Pill */}
          <div className="relative">
            <button
              id="event-selector-button"
              onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-xs font-medium text-slate-200 hover:border-slate-700 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[140px] md:max-w-[200px]">{selectedEvent}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isEventDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Active Hackathon
                </div>
                {availableEvents.map((evt) => (
                  <button
                    key={evt}
                    onClick={() => {
                      setSelectedEvent(evt);
                      setIsEventDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      selectedEvent === evt
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{evt}</span>
                    {selectedEvent === evt && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <form onSubmit={handleQuickSearch} className="w-full relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask operations, search teams, audit rules... (Press ↵ to Ask AI)"
              className="w-full pl-10 pr-20 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-semibold tracking-wide bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-400 rounded-lg transition-colors"
            >
              Ask AI
            </button>
          </form>
        </div>

        {/* Live Timer & View Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Countdown Badge */}
          <div
            id="live-countdown-badge"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/50 text-indigo-400 text-xs font-semibold font-mono"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formattedCountdown}</span>
          </div>

          {/* Quick Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
            <button
              id="view-landing-btn"
              onClick={() => setViewMode('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'landing'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Public Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing</span>
            </button>

            <button
              id="view-dashboard-btn"
              onClick={() => {
                setViewMode('dashboard');
                setCurrentTab('overview');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Organizer Operations Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Organizer</span>
            </button>

            <button
              id="view-participant-btn"
              onClick={() => setViewMode('participant')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'participant'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Participant Alex's View"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Participant</span>
            </button>

            <button
              id="view-enroll-btn"
              onClick={() => setViewMode('enroll')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'enroll'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
              title="Enroll / Registration"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enroll</span>
            </button>

            <button
              id="view-architecture-btn"
              onClick={() => setViewMode('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="AI Swarm & Intelligence Layer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Swarm</span>
            </button>
          </div>

          {/* Ask AI Command Button */}
          <button
            id="nav-ask-ai-button"
            onClick={() => setIsAskAIModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ask AI</span>
          </button>

          {/* Supabase Auth Indicator */}
          <button
            id="nav-supabase-auth-btn"
            onClick={() => setIsAuthModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              currentUser
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title={currentUser ? `Signed in as ${currentUser.email}` : 'Sign In with Supabase'}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">
              {currentUser ? (currentUser.email?.split('@')[0] || 'User') : 'Supabase Auth'}
            </span>
          </button>

          {/* Notifications Drawer Toggle */}

          <button
            id="nav-notifications-btn"
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
