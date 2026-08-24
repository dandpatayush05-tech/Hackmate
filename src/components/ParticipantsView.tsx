import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  Database,
  RefreshCw,
} from 'lucide-react';

export const ParticipantsView: React.FC = () => {
  const {
    participants,
    showToast,
    setCurrentTab,
    setViewMode,
    syncParticipantsToSupabase,
    supabaseStatus,
    fetchParticipants,
  } = useHackathon();

  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncSupabase = async () => {
    setIsSyncing(true);
    await syncParticipantsToSupabase();
    await fetchParticipants();
    setIsSyncing(false);
  };

  const filtered = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDomain = domainFilter === 'All' || p.preferredDomain === domainFilter;
    const matchesExp = expFilter === 'All' || p.experience === expFilter;
    return matchesSearch && matchesDomain && matchesExp;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight">Participant Roster</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
              {participants.length} REGISTERED
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" />
              Supabase Cloud
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Attendee registry, skill profiles, squad allocations, and Supabase cloud persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="sync-participants-supabase-btn"
            onClick={handleSyncSupabase}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-xs shadow-sm transition-all disabled:opacity-50"
            title="Sync all participants to Supabase Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>

          <button
            id="roster-enroll-participant-btn"
            onClick={() => setViewMode('enroll')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Participant</span>
          </button>

          <button
            onClick={() => setCurrentTab('teams')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Team Matchmaking</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or skill..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Tracks</option>
            <option value="AI & Autonomous Agents">AI & Autonomous Agents</option>
            <option value="FinTech & Web3">FinTech & Web3</option>
            <option value="HealthTech & BioAI">HealthTech & BioAI</option>
            <option value="ClimateTech">ClimateTech</option>
            <option value="Open Innovation">Open Innovation</option>
          </select>

          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Participants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white truncate">{p.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.teamPreference === 'In Team'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {p.teamPreference}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{p.email}</p>
                  <p className="text-[11px] font-mono text-indigo-400 mt-0.5">{p.discordHandle}</p>
                </div>
              </div>

              {p.bio && <p className="text-xs text-slate-300 line-clamp-2">{p.bio}</p>}

              <div className="flex flex-wrap gap-1">
                {p.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Level: <strong className="text-slate-200">{p.experience}</strong>
              </span>
              <span className="text-slate-300 truncate max-w-[140px]">{p.preferredDomain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
