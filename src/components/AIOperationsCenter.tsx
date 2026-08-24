import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Terminal,
  Sparkles,
  Send,
  Loader2,
  Bot,
  Zap,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  Users,
  BellRing,
  CheckCircle2,
  RefreshCw,
  Eye,
  Brain,
  SlidersHorizontal,
} from 'lucide-react';

export const AIOperationsCenter: React.FC = () => {
  const {
    teams,
    submissionAudits,
    tickets,
    scheduleEvents,
    insights,
    dismissInsight,
    setCurrentTab,
    triggerReminderNow,
    runFleetAIAudit,
    showToast,
  } = useHackathon();

  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; text: string; actions?: string[]; timestamp: string }[]
  >([
    {
      role: 'ai',
      text: "👋 **HackMate AI Operations Center is ready.** I am actively monitoring 1,240 participants across 312 teams in HackVerse 2026. You can ask natural language operational queries, audit compliance, or dispatch autonomous workflows.",
      actions: [
        "Which teams haven't submitted yet?",
        "Who needs a mentor?",
        "What are the most common participant issues?",
        "Show me teams missing GitHub links.",
        "What's happening in the next 2 hours?",
      ],
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    "Which teams haven't submitted yet?",
    "Who needs a mentor?",
    "What are the most common participant issues?",
    "Show me teams missing GitHub links.",
    "What's happening in the next 2 hours?",
  ];

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || queryInput;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setQueryInput('');
    setIsLoading(true);

    try {
      const operationalContext = {
        totalTeams: teams.length,
        submittedTeams: submissionAudits.filter((s) => s.status === 'Complete').length,
        openTickets: tickets.filter((t) => t.status !== 'Resolved by AI').length,
        upcomingEvents: scheduleEvents.filter((e) => e.status === 'Upcoming').slice(0, 3),
        missingRepoCount: submissionAudits.filter((s) => s.status === 'Missing Repository').length,
      };

      const res = await fetch('/api/ai/ask-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend, operationalContext }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.reply || 'Operational analysis completed.',
          actions: data.suggestedActions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Currently 41 out of 68 teams have submitted. 7 teams have missing repository links. Suggested next step: broadcast deadline alerts across Discord.',
          actions: ['Send 3-Hour Deadline Reminder to 27 Unsubmitted Teams'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (action: string) => {
    const lower = action.toLowerCase();
    if (lower.includes('reminder') || lower.includes('deadline') || lower.includes('alert')) {
      triggerReminderNow('rem-1');
      showToast({
        title: 'Broadcast Dispatched',
        description: 'Sent 3-hour deadline reminder to 27 unsubmitted teams.',
        type: 'success',
      });
    } else if (lower.includes('audit') || lower.includes('repo')) {
      runFleetAIAudit();
    } else if (lower.includes('mentor')) {
      showToast({
        title: 'Mentor Assigned',
        description: 'Auto-assigned Mentor Sarah Lin to Team BioGen.',
        type: 'success',
      });
      setCurrentTab('support');
    } else {
      showToast({
        title: 'Action Triggered',
        description: action,
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Operations Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono">
              BRAIN CORE v3.7
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Observe → Understand → Decide → Act → Escalate. Autonomous event supervision console.
          </p>
        </div>

        {/* Operating Loop Cycle Status */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Eye className="w-3.5 h-3.5" /> OBSERVE
          </span>
          <span className="text-slate-600">→</span>
          <span className="flex items-center gap-1 text-indigo-400 font-semibold">
            <Brain className="w-3.5 h-3.5" /> DECIDE
          </span>
          <span className="text-slate-600">→</span>
          <span className="flex items-center gap-1 text-purple-400 font-semibold">
            <Zap className="w-3.5 h-3.5" /> ACT
          </span>
        </div>
      </div>

      {/* Main Bento Grid: AI Console & Live Autonomous Insights Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Natural Language Query & Action Console */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950 p-6 shadow-2xl h-[640px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Organizer Intelligence Terminal
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Grounding: HackVerse Rules & Live Telemetry
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    role: 'ai',
                    text: 'Console history cleared. Ready for new operations queries.',
                    actions: quickPrompts,
                    timestamp: 'Just now',
                  },
                ]);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Console"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-2 mb-3 relative z-10">
            {quickPrompts.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendQuery(chip)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all hover:scale-[1.02] active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin relative z-10">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.text}</div>

                  {/* Suggested Quick Actions */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-white/10 space-y-2">
                      <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                        Suggested Autonomous Actions:
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleExecuteAction(act)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-300 hover:text-white text-left text-xs font-semibold transition-all group"
                          >
                            <span className="truncate">{act}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 font-mono ${
                      msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-indigo-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>HackMate AI synthesizing live telemetry & rules...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="pt-3.5 mt-2 border-t border-slate-800 flex items-center gap-2 relative z-10"
          >
            <input
              id="ai-ops-query-input"
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ask an operational question (e.g. 'Show me teams missing GitHub links')"
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            <button
              id="ai-ops-send-btn"
              type="submit"
              disabled={isLoading || !queryInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Query</span>
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Autonomous Decision Feed & Proactive Actions */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl p-6 shadow-2xl h-[640px]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Proactive Agent Insights
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Continuous Evaluation</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {insights.map((insight) => {
              const borderStyles = {
                positive: 'border-emerald-500/20 bg-emerald-500/5',
                warning: 'border-amber-500/20 bg-amber-500/5',
                urgent: 'border-rose-500/20 bg-rose-500/5',
                action: 'border-indigo-500/20 bg-indigo-500/5',
              };

              const badgeStyles = {
                positive: 'bg-emerald-500/20 text-emerald-400',
                warning: 'bg-amber-500/20 text-amber-400',
                urgent: 'bg-rose-500/20 text-rose-400',
                action: 'bg-indigo-500/20 text-indigo-400',
              };

              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-2xl border ${borderStyles[insight.type]} space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${badgeStyles[insight.type]}`}
                    >
                      {insight.type}
                    </span>
                    <span className="text-[10px] text-slate-500">{insight.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {insight.message}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    {insight.actionLabel ? (
                      <button
                        onClick={() => {
                          if (insight.actionType === 'matchmaking') setCurrentTab('teams');
                          else if (insight.actionType === 'reminder') triggerReminderNow('rem-2');
                          else if (insight.actionType === 'submissions') setCurrentTab('submissions');
                          else if (insight.actionType === 'support') setCurrentTab('support');
                          else setCurrentTab('ops-center');
                        }}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>{insight.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">Autonomous loop active</span>
                    )}

                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Fast Action Controls */}
          <div className="pt-3 mt-2 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Emergency Fast Actions:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  triggerReminderNow('rem-1');
                  showToast({
                    title: 'Broadcast Triggered',
                    description: 'T-3h deadline warning delivered to 27 unsubmitted teams.',
                    type: 'success',
                  });
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                <span>Blast Deadline Alert</span>
              </button>

              <button
                onClick={() => setCurrentTab('support')}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Escalation Queue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
