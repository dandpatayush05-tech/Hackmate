import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  LogOut,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useHackathon } from '../context/HackathonContext';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    signIn,
    signUp,
    signOut,
    isAuthLoading,
    showToast,
  } = useHackathon();

  const [mode, setMode] = useState<'signin' | 'signup'>(currentUser ? 'signin' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'signup') {
      const res = await signUp(email, password, fullName || undefined);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg('Account registered successfully in Supabase!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 1200);
      }
    } else {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 1000);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {currentUser ? 'Supabase User Profile' : mode === 'signin' ? 'Sign In to Supabase' : 'Create Supabase Account'}
                </h3>
                <p className="text-xs text-slate-400">
                  Project: <code className="text-emerald-400 font-mono">{SUPABASE_PROJECT_ID}</code>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentUser ? (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Authentication Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">User Email</div>
                    <div className="text-sm font-mono text-white font-medium">{currentUser.email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Supabase User UID</div>
                    <div className="text-xs font-mono text-slate-300 break-all">{currentUser.id}</div>
                  </div>
                  {currentUser.created_at && (
                    <div>
                      <div className="text-xs text-slate-400">Registered At</div>
                      <div className="text-xs text-slate-300">
                        {new Date(currentUser.created_at).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/30 flex items-start gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-emerald-300 leading-relaxed">
                    Row Level Security (RLS) active. Your actions automatically associate with your Supabase authenticated session.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium text-sm transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tabs */}
                <div className="flex p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      mode === 'signin'
                        ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      mode === 'signup'
                        ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name / Handle
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="alex.m@hackmate.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-red-300 leading-tight">{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-emerald-300 leading-tight">{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
                >
                  {isAuthLoading ? (
                    <span>Authenticating with Supabase...</span>
                  ) : mode === 'signin' ? (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default AuthModal;
