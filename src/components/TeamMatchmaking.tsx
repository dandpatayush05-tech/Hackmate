import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { Participant } from '../types';
import {
  UserPlus,
  Sparkles,
  Users,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Check,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Code2,
} from 'lucide-react';

export const TeamMatchmaking: React.FC = () => {
  const {
    participants,
    matchRecommendations,
    acceptMatch,
    regenerateMatches,
    teams,
    showToast,
  } = useHackathon();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('Looking for Team');

  const domains = [
    'All',
    'AI & Autonomous Agents',
    'FinTech & Web3',
    'HealthTech & BioAI',
    'ClimateTech',
    'Open Innovation',
  ];

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || p.preferredDomain === selectedDomain;
    const matchesExp = selectedExperience === 'All' || p.experience === selectedExperience;
    const matchesStatus = selectedStatus === 'All' || p.teamPreference === selectedStatus;
    return matchesSearch && matchesDomain && matchesExp && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Team Formation</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold font-mono">
              MATCHMAKING AGENT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build balanced teams using skills, interests, domains and availability.
          </p>
        </div>

        <button
          id="regenerate-matches-btn"
          onClick={regenerateMatches}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Regenerate Matches</span>
        </button>
      </div>

      {/* AI Matching Visualization Cards (The Centerpiece of Matchmaking) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Matchmaking Recommendations
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Optimized via skill vector cosine similarity
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matchRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`rounded-2xl border ${
                rec.accepted
                  ? 'border-emerald-500/40 bg-slate-900/90'
                  : 'border-purple-500/30 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950'
              } p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Recommendation Header & Match Score */}
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{rec.teamName}</h3>
                      {rec.accepted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3" /> ACCEPTED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target: {rec.participants[0]?.preferredDomain}
                    </p>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-mono">
                      {rec.matchScore}%
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Compatibility
                    </div>
                  </div>
                </div>

                {/* Participant Roster in Recommended Team */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rec.participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3"
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-200 truncate">{p.name}</div>
                        <div className="text-[11px] font-medium text-purple-400 truncate">
                          {rec.recommendedRoles[p.id] || p.skills[0]}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {p.experience}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 truncate font-mono">
                            {p.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compatibility Reasons */}
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5">
                  <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Matching Synthesis Reasons:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {rec.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 text-sm leading-none">•</span>
                        <span className="leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    showToast({
                      title: 'Team Composition Details',
                      description: `Roster: ${rec.participants.map((p) => p.name).join(', ')}. Target Track: ${rec.participants[0]?.preferredDomain}`,
                      type: 'info',
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  View Team
                </button>

                <button
                  onClick={() => acceptMatch(rec.id)}
                  disabled={rec.accepted}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                    rec.accepted
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{rec.accepted ? 'Team Formed' : 'Accept Match'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participant Pool & Skill Filter Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Participant Matchmaking Roster ({filteredParticipants.length} Available)
            </h2>
            <p className="text-xs text-slate-400">
              Browse attendees seeking squads or complementary skill pairs.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, name, bio..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-purple-500"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Looking for Team">Looking for Team</option>
              <option value="In Team">In Team</option>
            </select>
          </div>
        </div>

        {/* Participant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParticipants.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.teamPreference === 'Looking for Team'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {p.teamPreference}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{p.email}</p>
                    <p className="text-[11px] font-mono text-indigo-400 mt-0.5">{p.discordHandle}</p>
                  </div>
                </div>

                {p.bio && <p className="text-xs text-slate-300 leading-snug">{p.bio}</p>}

                {/* Tags */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">DOMAIN</span>
                    <span className="text-slate-200 font-medium truncate block">
                      {p.preferredDomain}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">AVAILABILITY</span>
                    <span className="text-slate-200 font-medium">{p.availability}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Level: <strong className="text-slate-200">{p.experience}</strong>
                </span>
                <button
                  onClick={() => {
                    showToast({
                      title: 'Direct Invite Sent',
                      description: `Invitation dispatched to ${p.name} on Discord.`,
                      type: 'success',
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite to Team</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
