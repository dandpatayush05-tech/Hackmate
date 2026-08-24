import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { ScheduleEvent } from '../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BellRing,
  Edit3,
  Send,
  Users,
  Radio,
  ArrowRight,
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { scheduleEvents, modifyScheduleAdaptive, showToast } = useHackathon();

  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('Speaker flight delay & room setup');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenReschedule = (ev: ScheduleEvent) => {
    setSelectedEvent(ev);
    setNewTimeInput(ev.time);
    setIsModalOpen(true);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !newTimeInput.trim()) return;

    modifyScheduleAdaptive(selectedEvent.id, newTimeInput, rescheduleReason);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Schedule & Timeline</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
              ADAPTIVE TIMELINE ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time stage tracking, live countdowns, and automatic schedule adaptation notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Adaptive Schedule Agent Active (14 checks/min)</span>
        </div>
      </div>

      {/* Adaptive Schedule Highlight Banner */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                Adaptive Schedule Alert
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                TRIGGERED
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium mt-0.5">
              “Workshop moved from 4:00 PM → 5:00 PM.”
            </p>
            <p className="text-[11px] text-amber-300/80 font-mono mt-0.5">
              ✓ <strong>147 participants notified</strong> across Discord & Mobile push.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            showToast({
              title: 'Notification Delivery Audit',
              description: '147 Discord webhooks and 284 mobile notifications delivered in 1.1s.',
              type: 'info',
            });
          }}
          className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold transition-colors shrink-0"
        >
          View Delivery Audit
        </button>
      </div>

      {/* Visual Timeline Cards */}
      <div className="space-y-4">
        {scheduleEvents.map((ev, index) => {
          const statusColors = {
            Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse',
            Upcoming: 'bg-slate-800 text-slate-400 border-slate-700',
          };

          return (
            <div
              key={ev.id}
              className={`p-5 rounded-2xl border ${
                ev.status === 'In Progress'
                  ? 'border-blue-500/40 bg-slate-900/90 shadow-xl shadow-blue-500/5'
                  : 'border-slate-800 bg-slate-900/60'
              } flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700`}
            >
              {/* Left Stage & Time */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">STEP</span>
                  <span className="text-xs font-bold text-white font-mono">{index + 1}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-white tracking-tight">{ev.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        statusColors[ev.status]
                      }`}
                    >
                      {ev.status}
                    </span>
                    {ev.isAdaptiveModified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                        Adaptive Shift
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-snug">{ev.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <strong>{ev.time}</strong>
                      {ev.originalTime && ev.originalTime !== ev.time && (
                        <span className="line-through text-slate-400 ml-1">
                          {ev.originalTime}
                        </span>
                      )}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {ev.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action: Reschedule Trigger */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {ev.attendeesNotified && (
                  <div className="text-[11px] text-slate-400 font-mono text-right hidden lg:block mr-2">
                    <span className="text-emerald-400 font-semibold">{ev.attendeesNotified}</span> attendees synced
                  </div>
                )}

                <button
                  onClick={() => handleOpenReschedule(ev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Adaptive Reschedule</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reschedule Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Adaptive Schedule Trigger
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">{selectedEvent.title}</h4>
              <p className="text-xs text-slate-400">Current Slot: {selectedEvent.time}</p>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Adjusted Time:
                </label>
                <input
                  type="text"
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  placeholder="e.g. 05:00 PM"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rescheduling Reason (Grounding Context):
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Speaker delay, Q&A extension"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-snug">
                ⚡ <strong>Adaptive Dispatcher</strong> will auto-calculate conflicts and broadcast Discord webhooks + In-app toasts to all ~147 registered attendees instantly.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg transition-all"
                >
                  Broadcast Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
