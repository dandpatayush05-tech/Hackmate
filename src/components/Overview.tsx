import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Sparkles,
  Users,
  Layers,
  FileCheck2,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Terminal,
  Bot,
  CalendarClock,
  UserPlus,
  BellRing,
  BarChart3,
  CheckCircle2,
  Play,
  Check,
  Zap,
  Flame,
} from 'lucide-react';

export const Overview: React.FC = () => {
  const {
    selectedEvent,
    formattedCountdown,
    participants,
    teams,
    submissionAudits,
    tickets,
    insights,
    dismissInsight,
    agents,
    setCurrentTab,
    setIsAskAIModalOpen,
    runFleetAIAudit,
    isAuditingFleet,
    matchRecommendations,
    acceptMatchRecommendation,
    activityLog,
  } = useHackathon();

  // Calculated Stats
  const totalParticipants = 1240;
  const activeTeams = 312;
  const submissionsCount = submissionAudits.filter((s) => s.status === 'Complete').length;
  const submissionRate = Math.round((submissionsCount / Math.max(teams.length, 1)) * 100);
  const criticalAlertsCount = tickets.filter((t) => t.status === 'Escalated to Organizer').length + 
    submissionAudits.filter((s) => s.eligibility === 'Ineligible').length;

  const topMatch = matchRecommendations[0];

  const agentIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Bot,
    CalendarClock,
    Users: UserPlus,
    BellRing,
    FileCheck2,
    ShieldAlert,
    BarChart3,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Event Banner Card */}
      <div
        id="overview-event-status-card"
        className="rounded-3xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedEvent.replace(' (Live)', '')}
            </h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold px-2.5 py-0.5 border border-emerald-500/20 rounded-md">
              LIVE EVENT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Grand Tech Pavilion & Virtual Stream • 36-Hour Autonomous Event Window
          </p>
        </div>

        {/* Big Countdown Timer Card */}
        <div className="z-10 flex items-center gap-4 bg-slate-900/60 border border-slate-800 px-5 py-3 rounded-2xl shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Countdown
            </div>
            <div className="text-xl font-bold font-mono text-indigo-400">
              {formattedCountdown}
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/10 blur-[90px] rounded-full pointer-events-none" />
      </div>

      {/* Top 4-Column Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Participants */}
        <div 
          onClick={() => setCurrentTab('participants')}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Participants</span>
            <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">{totalParticipants}</span>
            <span className="text-xs text-emerald-400 font-medium">+8.2%</span>
          </div>
        </div>

        {/* Card 2: Active Teams */}
        <div 
          onClick={() => setCurrentTab('teams')}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Teams</span>
            <Layers className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">{activeTeams}</span>
            <span className="text-xs text-indigo-400 font-medium">94% Matching</span>
          </div>
        </div>

        {/* Card 3: Submission Rate */}
        <div 
          onClick={() => setCurrentTab('submissions')}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Submission Rate</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">{submissionRate}%</span>
            <span className="text-xs text-slate-500">{submissionsCount} completed</span>
          </div>
        </div>

        {/* Card 4: Critical Alerts */}
        <div 
          onClick={() => setCurrentTab('support')}
          className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between border-l-4 border-l-rose-500 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-400 font-medium">Critical Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-2xl font-bold text-white tracking-tight">{criticalAlertsCount}</span>
            <span className="text-xs text-rose-400 font-medium group-hover:underline">View All</span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid 2/3 + 1/3 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Left Bento: AI Operations Center */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/60 to-slate-950 border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">AI Operations Center</h3>
              <p className="text-sm text-slate-400">Proactive intelligence & resolution engine</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => runFleetAIAudit()}
                disabled={isAuditingFleet}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAuditingFleet ? 'Auditing Fleet...' : 'Run Fleet Audit'}</span>
              </button>
              <button
                onClick={() => setIsAskAIModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 text-white flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                Ask HackMate AI
              </button>
            </div>
          </div>

          {/* Bento Action Cards Inside Operations Center */}
          <div className="space-y-4 relative z-10 flex-1">
            {/* Action 1: Automations */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-emerald-400">23 Automations Successful</h4>
                  <span className="text-[10px] text-slate-500">2 mins ago</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  'Venue wifi details' and 'Judging criteria' questions were resolved automatically via the Rules Engine.
                </p>
              </div>
            </div>

            {/* Action 2: Smart Matchmaking */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-indigo-400">Smart Matchmaking Alert</h4>
                  <span className="text-[10px] text-slate-500">12 mins ago</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  4 participants from the Python track are currently unassigned. I have generated 2 optimized team recommendations for approval.
                </p>
              </div>
            </div>

            {/* Action 3: Escalation Alert */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-rose-500">Escalation Required</h4>
                  <span className="text-[10px] text-slate-500">Just now</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Team Alpha (ID: #842) is reporting hardware failure at Station 12. Mentor dispatched, waiting for logistics approval.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Query Pill Chips */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2.5 relative z-10">
            <span className="text-xs text-slate-400 font-medium mr-1">Quick Prompt:</span>
            <button
              onClick={() => {
                setCurrentTab('ops-center');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-semibold text-slate-300 transition-colors"
            >
              Who needs a mentor?
            </button>
            <button
              onClick={() => {
                setCurrentTab('submissions');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-semibold text-slate-300 transition-colors"
            >
              Unsubmitted teams
            </button>
            <button
              onClick={() => {
                setCurrentTab('schedule');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-semibold text-slate-300 transition-colors"
            >
              Update schedule
            </button>
          </div>
        </div>

        {/* Right Bento Column: Live Activity + Team Recommendations */}
        <div className="space-y-6 flex flex-col">
          {/* Live Activity Bento Card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 flex flex-col flex-1">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
              <span>Live Activity</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            </h4>
            <div className="flex-1 space-y-4 text-xs">
              {activityLog.slice(0, 4).map((act, idx) => (
                <div key={act.id || idx} className="flex gap-3">
                  <div className={`w-1 h-9 rounded-full shrink-0 ${
                    act.severity === 'success' ? 'bg-emerald-500/50' :
                    act.severity === 'warning' ? 'bg-amber-500/50' :
                    act.severity === 'critical' ? 'bg-rose-500/50' : 'bg-indigo-500/50'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-200 font-medium truncate">{act.title}</p>
                    <p className="text-slate-500 text-[11px] truncate">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Recommendations Bento Card */}
          <div className="bg-gradient-to-tr from-indigo-950/40 to-slate-900 border border-slate-700/50 rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Team Recommendations</h4>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">REC #24</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-gradient-to-r from-emerald-500 to-indigo-500" />
              </div>
              <span className="text-xs font-bold text-white">94%</span>
            </div>
            <div className="flex -space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">FE</div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">ML</div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-500 flex items-center justify-center text-[10px] font-bold text-white">UX</div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-400 flex items-center justify-center text-[10px] font-bold text-white">BE</div>
            </div>
            <button
              onClick={() => {
                if (topMatch) acceptMatchRecommendation(topMatch.id);
                setCurrentTab('teams');
              }}
              className="w-full py-2 rounded-xl bg-indigo-600 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              Accept Match
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Agent Swarm Status Bento Row */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Active Multi-Agent Swarm (7/7 Online)
            </h3>
            <p className="text-xs text-slate-400">
              Real-time telemetry and throughput across specialized event operations agents.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('analytics')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View Fleet Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const Icon = agentIcons[agent.iconName] || Bot;
            return (
              <div
                key={agent.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{agent.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      agent.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : agent.status === 'OPTIMIZING'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {agent.description}
                </div>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[9px]">SPEED</span>
                    <span className="text-slate-300 font-semibold">{agent.latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">SUCCESS</span>
                    <span className="text-emerald-400 font-semibold">{agent.successRate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">THROUGHPUT</span>
                    <span className="text-indigo-400 font-semibold">{agent.throughput}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
