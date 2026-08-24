import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { Reminder, Priority } from '../types';
import {
  BellRing,
  Sparkles,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  Sliders,
  MessageSquare,
  Mail,
  Zap,
} from 'lucide-react';

export const AutomatedReminders: React.FC = () => {
  const {
    reminders,
    autoRemindersEnabled,
    setAutoRemindersEnabled,
    triggerReminderNow,
    createReminder,
    showToast,
  } = useHackathon();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newTrigger, setNewTrigger] = useState('T-2 Hours Before Deadline');
  const [newAudience, setNewAudience] = useState('Unsubmitted Teams (27)');
  const [newTiming, setNewTiming] = useState('Scheduled at 06:00 AM');
  const [newChannel, setNewChannel] = useState<Reminder['channel']>('Discord Webhook');
  const [newPriority, setNewPriority] = useState<Priority>('HIGH');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    createReminder({
      title: newTitle,
      message: newMessage,
      trigger: newTrigger,
      audience: newAudience,
      timing: newTiming,
      channel: newChannel,
      priority: newPriority,
      isActive: true,
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewMessage('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Automated Reminders</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
              PROACTIVE BROADCASTER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Contextual broadcast engine delivering critical milestone and compliance alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Master Automation Toggle */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              AI Auto-Reminders:
            </span>
            <button
              onClick={() => {
                setAutoRemindersEnabled((prev) => !prev);
                showToast({
                  title: autoRemindersEnabled ? 'Auto-Reminders Paused' : 'Auto-Reminders Active',
                  description: autoRemindersEnabled
                    ? 'Automated scheduled broadcasts suspended.'
                    : 'AI Reminder agent is actively scheduling triggers.',
                  type: autoRemindersEnabled ? 'warning' : 'success',
                });
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                autoRemindersEnabled
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autoRemindersEnabled ? 'ON' : 'PAUSED'}
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Configure Reminder</span>
          </button>
        </div>
      </div>

      {/* Reminder Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reminders.map((rem) => {
          const priorityColors = {
            CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
            HIGH: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            MEDIUM: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            LOW: 'bg-slate-800 text-slate-400 border-slate-700',
          };

          return (
            <div
              key={rem.id}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <BellRing className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{rem.title}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Channel: {rem.channel}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      priorityColors[rem.priority]
                    }`}
                  >
                    {rem.priority}
                  </span>
                </div>

                {/* Message Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans">
                  “{rem.message}”
                </div>

                {/* Configuration Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TRIGGER RULE</span>
                    <span className="text-slate-300 font-medium truncate block">
                      {rem.trigger}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TARGET AUDIENCE</span>
                    <span className="text-slate-300 font-medium truncate block">
                      {rem.audience}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  Broadcasts Sent: <strong className="text-slate-200">{rem.sentCount}</strong>
                  {rem.lastSent && ` • Last: ${rem.lastSent}`}
                </div>

                <button
                  onClick={() => triggerReminderNow(rem.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-all hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Broadcast</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Reminder Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Configure Smart Reminder Rule
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reminder Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Final Submission T-1h Warning"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message Content:
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="e.g. Hackers, 60 minutes remaining! Ensure all video pitch links are public."
                  rows={3}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Trigger Condition:
                  </label>
                  <input
                    type="text"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    placeholder="e.g. T-1h to deadline"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Audience:
                  </label>
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    placeholder="e.g. All Teams (68)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Channel:
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as Reminder['channel'])}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Discord Webhook">Discord Webhook</option>
                    <option value="Slack">Slack</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="In-App Toast">In-App Toast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority:
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg transition-all"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
