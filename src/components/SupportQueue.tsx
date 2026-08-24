import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { SupportTicket, TicketCategory, TicketStatus } from '../types';
import {
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Bot,
  User,
  BookOpen,
  Send,
  UserPlus,
  Check,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export const SupportQueue: React.FC = () => {
  const {
    tickets,
    resolveTicketByAI,
    escalateTicketToOrganizer,
    assignMentorToTicket,
    showToast,
  } = useHackathon();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);

  const categories = [
    'All',
    'Wi-Fi & Hardware',
    'Rules & Eligibility',
    'Team & Teammates',
    'Mentors & Debugging',
    'API Keys & Cloud Credits',
    'Submission & Deliverables',
    'Food & Logistics',
  ];

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.teamName && t.teamName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  const handleAIResolve = async (ticketId: string) => {
    setResolvingTicketId(ticketId);
    await resolveTicketByAI(ticketId);
    setResolvingTicketId(null);
  };

  const openCount = tickets.filter(
    (t) => t.status === 'In Progress' || t.status === 'Attempted Resolution'
  ).length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated to Organizer').length;
  const aiResolvedCount = tickets.filter((t) => t.status === 'Resolved by AI').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Support & Escalation Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
              TRIAGE & ESCALATION AGENT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Autonomous question resolution with zero-hallucination guardrails and organizer handoff.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>AI Triage Accuracy:</span>
          <strong className="text-emerald-400 font-bold">98.2%</strong>
        </div>
      </div>

      {/* KPI Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Auto-Resolved by AI</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{aiResolvedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">In AI Evaluation</div>
            <div className="text-2xl font-bold font-mono text-blue-400">{openCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Escalated to Staff</div>
            <div className="text-2xl font-bold font-mono text-rose-400">{escalatedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search query, participant, or team..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-rose-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Statuses</option>
            <option value="Attempted Resolution">Attempted Resolution</option>
            <option value="Escalated to Organizer">Escalated to Organizer</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved by AI">Resolved by AI</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => {
          const statusBadges = {
            'Resolved by AI': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Attempted Resolution': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            'Escalated to Organizer': 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse',
          };

          const isResolving = resolvingTicketId === ticket.id;

          return (
            <div
              key={ticket.id}
              className={`p-6 rounded-2xl border ${
                ticket.status === 'Escalated to Organizer'
                  ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/20 via-slate-900 to-slate-950 shadow-xl'
                  : 'border-slate-800 bg-slate-900/70'
              } space-y-4 transition-all`}
            >
              {/* Top Row: Participant Info & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                    {ticket.participantName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{ticket.participantName}</h4>
                      {ticket.teamName && (
                        <span className="text-[11px] text-slate-400">
                          (Team: <strong className="text-slate-300">{ticket.teamName}</strong>)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Category: {ticket.category} • Created: {ticket.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* AI Confidence */}
                  <div className="text-right mr-2 font-mono">
                    <span className="text-[10px] text-slate-400 block">AI CONFIDENCE</span>
                    <span
                      className={`text-xs font-bold ${
                        (ticket.aiConfidence || 0) >= 80
                          ? 'text-emerald-400'
                          : (ticket.aiConfidence || 0) >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {ticket.aiConfidence || 0}%
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      statusBadges[ticket.status]
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>

              {/* Query Content */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Participant Inquiry:
                </div>
                <p className="text-sm font-medium text-white leading-relaxed">
                  “{ticket.query}”
                </p>
              </div>

              {/* AI Drafted Response / Citation Box */}
              {ticket.aiResponse && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Bot className="w-4 h-4" />
                      <span>AI Synthesized Response & Rulebook Citation</span>
                    </div>
                    {ticket.citation && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Source: {ticket.citation}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {ticket.aiResponse}
                  </p>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-slate-400 font-mono">
                  {ticket.assignedMentor && (
                    <span>Assigned Mentor: <strong className="text-indigo-300">{ticket.assignedMentor}</strong></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {ticket.status !== 'Resolved by AI' && (
                    <button
                      onClick={() => handleAIResolve(ticket.id)}
                      disabled={isResolving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {isResolving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isResolving ? 'Resolving...' : 'AI Auto-Resolve'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => assignMentorToTicket(ticket.id, 'Dr. Aris Thorne (AI/ML Lead)')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Mentor</span>
                  </button>

                  {ticket.status !== 'Escalated to Organizer' && (
                    <button
                      onClick={() => escalateTicketToOrganizer(ticket.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Escalate to Staff</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
