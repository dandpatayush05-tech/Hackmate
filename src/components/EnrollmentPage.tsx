import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Sparkles,
  ArrowLeft,
  User,
  Mail,
  Github,
  MessageSquare,
  Code2,
  Cpu,
  Layers,
  CheckCircle2,
  Zap,
  Users,
  ShieldCheck,
  Award,
  Clock,
  Send,
  Calendar,
  Compass,
  FileCheck,
  Database,
  Copy,
  Check,
} from 'lucide-react';
import { Participant } from '../types';

const POPULAR_SKILLS = [
  'Python',
  'TypeScript',
  'React',
  'PyTorch',
  'LangChain',
  'Node.js',
  'Next.js',
  'TailwindCSS',
  'PostgreSQL',
  'Docker',
  'FastAPI',
  'Supabase',
  'Rust',
  'Solidity',
  'GraphQL',
  'UI/UX Design',
];

const DOMAINS = [
  {
    id: 'AI & Autonomous Agents',
    title: 'AI & Autonomous Agents',
    desc: 'LLMs, multi-agent frameworks, tool calling, neural search',
    icon: Cpu,
  },
  {
    id: 'Full-Stack & Cloud Apps',
    title: 'Full-Stack & Cloud Apps',
    desc: 'Scalable web systems, real-time sync, microservices',
    icon: Code2,
  },
  {
    id: 'Developer Tools & Infra',
    title: 'Developer Tools & Infra',
    desc: 'DevOps, CI/CD agents, observability, developer productivity',
    icon: Layers,
  },
  {
    id: 'Web3 & Decentralized',
    desc: 'Smart contracts, zero-knowledge proofs, decentralized compute',
    title: 'Web3 & Decentralized',
    icon: Zap,
  },
];

export const EnrollmentPage: React.FC = () => {
  const {
    setViewMode,
    setCurrentTab,
    selectedEvent,
    registerParticipant,
    formattedCountdown,
    supabaseStatus,
    showToast,
  } = useHackathon();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [githubHandle, setGithubHandle] = useState('');
  const [bio, setBio] = useState('');
  const [preferredDomain, setPreferredDomain] = useState('AI & Autonomous Agents');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['TypeScript', 'React', 'Python']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [experience, setExperience] = useState<Participant['experience']>('Intermediate');
  const [availability, setAvailability] = useState<Participant['availability']>('Full Weekend');
  const [teamPreference, setTeamPreference] = useState<Participant['teamPreference']>('Looking for Team');
  const [agreedToRules, setAgreedToRules] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if ('preventDefault' in e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleCopySql = () => {
    if (supabaseStatus?.sqlSchema) {
      navigator.clipboard.writeText(supabaseStatus.sqlSchema);
      setCopiedSql(true);
      showToast({
        title: 'SQL Schema Copied',
        description: 'Paste into your Supabase Dashboard SQL Editor to initialize the database.',
        type: 'info',
      });
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    try {
      const newParticipant = await registerParticipant({
        name: name.trim(),
        email: email.trim(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
        skills: selectedSkills.length > 0 ? selectedSkills : ['General Software'],
        preferredDomain,
        experience,
        availability,
        teamPreference,
        discordHandle: discordHandle.trim() || `${name.toLowerCase().replace(/\s+/g, '_')}#0001`,
        bio: bio.trim() || `Excited to build next-gen solutions at ${selectedEvent}!`,
      });

      setRegisteredId(newParticipant.id);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-600 selection:text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          id="enroll-back-home-btn"
          onClick={() => setViewMode('landing')}
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Landing Page</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header Hero */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Hackathon Registration • Open Enrollment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Enroll in <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">{selectedEvent}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of builders, researchers, and engineers. Complete your participant profile to unlock AI team matching, mentor booking, and 24/7 concierge support.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Registration Open
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Hackathon starts in {formattedCountdown}
            </span>
            <span>•</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Supabase Cloud: {supabaseStatus?.projectId || 'Connected'}</span>
            </div>
          </div>
        </div>

        {/* Supabase Schema Notice Banner (if table not yet created in Supabase) */}
        {supabaseStatus && !supabaseStatus.participantsTableExists && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block font-semibold">Supabase Table Initialization Notice</strong>
                <span className="text-slate-300">
                  Data is safely saved to local storage. To persist in Supabase cloud PostgreSQL, run the SQL schema in your Supabase SQL Editor.
                </span>
              </div>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Schema Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
        )}

        {/* Success Confirmation Card */}
        {isSubmitted ? (
          <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 backdrop-blur-xl p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Enrollment Confirmed!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Welcome aboard, <strong className="text-white">{name}</strong>! Your participant profile has been created and indexed in the HackMate AI matchmaking swarm.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Participant ID:</span>
                <span className="font-mono text-indigo-400 font-semibold">{registeredId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Selected Domain:</span>
                <span className="text-slate-200 font-medium">{preferredDomain}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Team Preference:</span>
                <span className="text-slate-200 font-medium">{teamPreference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Key Skills:</span>
                <span className="text-slate-200 font-medium truncate max-w-[240px]">{selectedSkills.join(', ')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="enroll-go-to-participant-dashboard-btn"
                onClick={() => setViewMode('participant')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Go to Participant Dashboard</span>
              </button>

              <button
                id="enroll-view-teams-btn"
                onClick={() => {
                  setViewMode('dashboard');
                  setCurrentTab('teams');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Explore Team Matchmaking</span>
              </button>
            </div>
          </div>
        ) : (
          /* Enrollment Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Personal & Contact Info */}
              <div className="lg:col-span-7 space-y-6">
                {/* Step 1: Basic Information */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">Personal & Contact Info</h2>
                      <p className="text-[11px] text-slate-400">Used for official badging and Discord team formation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Full Name <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        id="enroll-input-fullname"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jordan Hayes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Email Address <span className="text-rose-400">*</span></span>
                      </label>
                      <input
                        id="enroll-input-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jordan@university.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                        <span>Discord Handle</span>
                      </label>
                      <input
                        id="enroll-input-discord"
                        type="text"
                        value={discordHandle}
                        onChange={(e) => setDiscordHandle(e.target.value)}
                        placeholder="jordan_dev#1234"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-slate-400" />
                        <span>GitHub Username</span>
                      </label>
                      <input
                        id="enroll-input-github"
                        type="text"
                        value={githubHandle}
                        onChange={(e) => setGithubHandle(e.target.value)}
                        placeholder="github.com/jordanhayes"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Bio / What do you want to build?</label>
                    <textarea
                      id="enroll-input-bio"
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. AI systems engineer excited about real-time multimodal copilots and agent swarms."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Step 2: Track & Technical Domain */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">Preferred Track & Domain</h2>
                      <p className="text-[11px] text-slate-400">Select the domain you are most passionate about hacking on</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOMAINS.map((dom) => {
                      const Icon = dom.icon;
                      const isSelected = preferredDomain === dom.id;
                      return (
                        <button
                          key={dom.id}
                          type="button"
                          onClick={() => setPreferredDomain(dom.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/10'
                              : 'border-slate-800 bg-slate-950/60 hover:bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-xl border shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h3 className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                {dom.title}
                              </h3>
                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                                {dom.desc}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Skills Multiselect */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                      <span>Technical Skills ({selectedSkills.length} selected)</span>
                      <span className="text-[10px] text-slate-500">Click chips to toggle</span>
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SKILLS.map((sk) => {
                        const active = selectedSkills.includes(sk);
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => toggleSkill(sk)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                              active
                                ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 shadow-sm'
                                : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {sk}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={handleAddCustomSkill}
                        placeholder="Add custom skill (e.g. OpenCV, Go)..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Experience, Team Match & Summary */}
              <div className="lg:col-span-5 space-y-6">
                {/* Step 3: Experience & Team Formation */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">Experience & Team Formation</h2>
                      <p className="text-[11px] text-slate-400">Match with complementary teammates</p>
                    </div>
                  </div>

                  {/* Experience Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Experience Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setExperience(lvl)}
                          className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                            experience === lvl
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Team Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Team Status</label>
                    <div className="space-y-2">
                      {[
                        { id: 'Looking for Team', label: 'Looking for a Team', desc: 'AI Matchmaker will recommend complementary peers' },
                        { id: 'In Team', label: 'Already Have a Team', desc: 'Will connect with existing team code on-site' },
                        { id: 'Solo Explorer', label: 'Solo Explorer', desc: 'Building individually or deciding at opening ceremony' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTeamPreference(t.id as Participant['teamPreference'])}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            teamPreference === t.id
                              ? 'bg-purple-500/15 border-purple-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <div className="text-xs font-semibold">{t.label}</div>
                          <div className="text-[10px] text-slate-400">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Weekend Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as Participant['availability'])}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Full Weekend">Full Weekend (On-Site 24h & Continuous)</option>
                      <option value="On-Site 24h">On-Site Main Venue Only</option>
                      <option value="Partial / Remote">Partial / Remote Collaboration</option>
                    </select>
                  </div>

                  {/* Code of Conduct Check */}
                  <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToRules}
                      onChange={(e) => setAgreedToRules(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                    />
                    <span className="text-[11px] text-slate-400">
                      I agree to the <strong className="text-slate-300">Hackathon Code of Conduct</strong>, anti-harassment policy, and intellectual property terms.
                    </span>
                  </label>
                </div>

                {/* Submit Card & Perks */}
                <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-950 p-6 space-y-4 shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Instant Participant Perks Included</span>
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>$500 Cloud Credits & API keys for all finalists</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>1-on-1 Debugging appointments with industry mentors</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>24/7 AI Concierge resolving rules, hardware, & food</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    id="enroll-submit-button"
                    type="submit"
                    disabled={isSubmitting || !agreedToRules || !name.trim() || !email.trim()}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Participant Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Enrollment</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-500">
                    No credit card required. Free registration for all university & industry builders.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
