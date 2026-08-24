import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Bot,
  Trash2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab,
    setViewMode,
  } = useHackathon();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between space-y-4 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Event Notifications ({notifications.length})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors p-1"
                title="Mark all read"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 mb-2 stroke-[1.5]" />
                <span>No new notifications</span>
              </div>
            ) : (
              notifications.map((n) => {
                const styles = {
                  info: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
                  warning: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
                  urgent: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
                  success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
                };

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkTab) {
                        setViewMode('dashboard');
                        setCurrentTab(n.linkTab);
                        setIsNotificationDrawerOpen(false);
                      }
                    }}
                    className={`p-4 rounded-xl border ${
                      styles[n.type]
                    } cursor-pointer hover:border-slate-700 transition-all space-y-1 relative ${
                      !n.isRead ? 'ring-1 ring-blue-500/40' : 'opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">{n.message}</p>

                    {n.linkTab && (
                      <div className="pt-2 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                        <span>Open in dashboard</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 font-mono">
              HackMate AI Real-Time Broadcast Stream
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
