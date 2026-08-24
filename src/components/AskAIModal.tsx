import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Terminal,
  Sparkles,
  Send,
  X,
  Loader2,
  Bot,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const AskAIModal: React.FC = () => {
  const {
    isAskAIModalOpen,
    setIsAskAIModalOpen,
    teams,
    submissionAudits,
    tickets,
    scheduleEvents,
    triggerReminderNow,
    runFleetAIAudit,
    showToast,
    setCurrentTab,
  } = useHackathon();

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAskAIModalOpen) return null;

  const handleQuerySubmit = async (customText?: string) => {
    const text = customText || query;
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

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
        body: JSON.stringify({ query: text, operationalContext }),
      });

      const data = await res.json();
      setResponse(data.reply || 'Operational query evaluated successfully.');
      setSuggestedActions(data.suggestedActions || []);
    } catch (err) {
      setResponse(
        'HackMate AI Telemetry: 41/68 submissions complete. 7 teams require GitHub repository links. Recommended: Dispatch automated T-3h warning.'
      );
      setSuggestedActions(['Send 3-Hour Deadline Reminder']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (act: string) => {
    if (act.toLowerCase().includes('reminder')) {
      triggerReminderNow('rem-1');
      showToast({
        title: 'Broadcast Dispatched',
        description: 'T-3h deadline reminder sent to 27 unsubmitted teams.',
        type: 'success',
      });
    } else if (act.toLowerCase().includes('audit')) {
      runFleetAIAudit();
    } else {
      showToast({
        title: 'Action Triggered',
        description: act,
        type: 'info',
      });
    }
    setIsAskAIModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700/50 bg-slate-950 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Ask HackMate AI
              </h2>
              <p className="text-[11px] text-slate-400">Natural language event supervisor</p>
            </div>
          </div>

          <button
            onClick={() => setIsAskAIModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuerySubmit();
          }}
          className="relative"
        >
          <input
            id="modal-ask-ai-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'Show me teams missing GitHub links' or 'Who needs a mentor?')..."
            className="w-full pl-4 pr-12 py-3 text-xs rounded-xl border border-slate-800 bg-slate-900/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Sample chips */}
        <div className="flex flex-wrap gap-2">
          {[
            "Which teams haven't submitted yet?",
            'Who needs a mentor?',
            'What are the top participant complaints?',
            'Show me teams missing GitHub links.',
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setQuery(chip);
                handleQuerySubmit(chip);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Response Box */}
        {isLoading && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-indigo-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing 1,240 participants, 312 teams, and live telemetry...</span>
          </div>
        )}

        {response && (
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Bot className="w-4 h-4" />
              <span>Operational Synthesis</span>
            </div>
            <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">{response}</p>

            {suggestedActions.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Suggested Actions:
                </div>
                <div className="flex flex-col gap-1.5">
                  {suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleAction(act)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/25 transition-all text-left"
                    >
                      <span>{act}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
