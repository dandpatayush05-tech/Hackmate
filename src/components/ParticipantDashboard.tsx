import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Clock,
  Github,
  Globe,
  Video,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  Send,
  Calendar,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ParticipantDashboard: React.FC = () => {
  const { formattedCountdown, setViewMode, showToast } = useHackathon();

  const [githubInput, setGithubInput] = useState('https://github.com/alexchen/hackverse-pulse');
  const [demoInput, setDemoInput] = useState('https://pulse-health-ai.vercel.app');
  const [videoInput, setVideoInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hi Alex! You are registered in Team Pulse for HealthTech & BioAI. Your mentor session is scheduled for 13:00 PM today. Let me know if you have any questions!',
    },
  ]);

  const handleSaveDeliverables = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    showToast({
      title: 'Deliverables Synced',
      description: 'HackMate AI verified repository and live demo accessibility.',
      type: 'success',
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `According to HackVerse Guidelines for HealthTech: Submissions close at 08:00 AM PST tomorrow. Ensure your video pitch (2-3 min) covers the clinical AI model validation!`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
              PARTICIPANT PORTAL
            </span>
            <span className="text-xs text-slate-400">• HackVerse 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, Alex Chen 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Assigned to <strong>Team Pulse</strong> (Track: HealthTech & BioAI)
          </p>
        </div>

        {/* Big Timer */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl">
          <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Submission Window</div>
            <div className="text-lg font-bold font-mono text-amber-300">{formattedCountdown}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Submission Status & Team Workspace vs Embedded Concierge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Team Workspace & Submission Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {/* Team Roster Card */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Squad Roster (Team Pulse)
                </h3>
              </div>
              <span className="text-xs text-purple-400 font-mono font-semibold">3 / 4 Members</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white">Alex Chen (You)</div>
                <div className="text-[11px] text-purple-400">Lead AI & PyTorch</div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                  Online
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white">Priya Patel</div>
                <div className="text-[11px] text-blue-400">Backend & Go/gRPC</div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                  Online
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-white">Marcus Vance</div>
                <div className="text-[11px] text-pink-400">Frontend UI/UX</div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Submission Deliverables Editor & Verification */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Submission Deliverables & AI Verification
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                2 of 3 Verified
              </span>
            </div>

            <form onSubmit={handleSaveDeliverables} className="space-y-4">
              {/* GitHub Repo */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-blue-400" />
                    <span>Public GitHub / GitLab Repository:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Repo Verified (14 commits)
                  </span>
                </label>
                <input
                  type="url"
                  value={githubInput}
                  onChange={(e) => setGithubInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Working Demo URL:</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 200 OK (HTTPS Ready)
                  </span>
                </label>
                <input
                  type="url"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              {/* Video Pitch URL */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    <span>Video Pitch URL (Loom / YouTube / Vimeo):</span>
                  </span>
                  <span className="text-[10px] text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Missing (Required for Judging)
                  </span>
                </label>
                <input
                  type="url"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isSaved ? '✓ Deliverables synced with HackMate AI' : 'Changes autosaved to cloud'}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Save & Validate Artifacts
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 5 Cols: Dedicated Participant AI Concierge Chat */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-5 shadow-xl h-[560px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                HackMate AI Assistant
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
              ONLINE
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="py-2 border-t border-slate-800 flex flex-wrap gap-1">
            {['When is dinner?', 'How do I request a mentor?', 'Judging rubric'].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setChatMessages((prev) => [
                    ...prev,
                    { role: 'user', text: chip },
                    {
                      role: 'ai',
                      text:
                        chip === 'When is dinner?'
                          ? 'Dinner is served at 19:30 in East Hall B! Vegan and gluten-free options are labeled at Station 2.'
                          : chip.includes('mentor')
                          ? 'You can request a mentor anytime via the Discord #mentor-queue channel or tell me your technical blocker.'
                          : 'Judging begins tomorrow at 10:00 AM. Scoring: 30% Tech, 30% Innovation, 20% Impact, 20% Pitch.',
                    },
                  ]);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendChat} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about HackVerse..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
