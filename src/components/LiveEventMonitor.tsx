import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Activity,
  Sparkles,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Bot,
  Filter,
  RefreshCw,
  Cpu,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const LiveEventMonitor: React.FC = () => {
  const { activities, selectedEvent, formattedCountdown, showToast } = useHackathon();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filteredActivities = activities.filter((act) => {
    if (selectedFilter === 'All') return true;
    return act.severity === selectedFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Live Event Monitor</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              TELEMETRY STREAMING
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time audit log of agent operations, participant queries, and submission events.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Ingress: 42 events/min</span>
        </div>
      </div>

      {/* Bento Telemetry Dashboard Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 font-medium">Inquiry Resolution Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">92.4%</div>
          <div className="text-[10px] text-slate-500 mt-1">Automated by AI</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 font-medium">Average Response Latency</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-2">1.8s</div>
          <div className="text-[10px] text-slate-500 mt-1">P95: 2.3s</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 font-medium">Active Agent Swarm</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-2">7 / 7 Online</div>
          <div className="text-[10px] text-slate-500 mt-1">Zero downtime</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 font-medium">Error & Anomaly Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">0.02%</div>
          <div className="text-[10px] text-slate-500 mt-1">Auto-recovered</div>
        </div>
      </div>

      {/* Live Stream Bento Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Activity Stream
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5">
            {['All', 'info', 'warning', 'critical'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedFilter === filter
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Stream Feed */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredActivities.map((act) => {
            const severityStyles = {
              info: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
              warning: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
              critical: 'border-rose-500/20 bg-rose-500/10 text-rose-400',
            };

            return (
              <div
                key={act.id}
                className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-start justify-between gap-4 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl border ${severityStyles[act.severity]} shrink-0 mt-0.5`}>
                    {act.severity === 'critical' ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : act.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{act.title}</span>
                      {act.agent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                          {act.agent}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{act.description}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {act.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
