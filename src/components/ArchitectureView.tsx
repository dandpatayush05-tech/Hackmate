import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Cpu,
  Layers,
  Sparkles,
  Bot,
  Database,
  Radio,
  Send,
  Users,
  ShieldCheck,
  Zap,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Terminal,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const { setViewMode, setCurrentTab } = useHackathon();
  const [selectedNode, setSelectedNode] = useState<string>('brain');

  const nodes = {
    participants: {
      title: 'Participant Ingress Layer',
      desc: 'Attendees submit questions, join teams, and register repository links via Discord, Web App, or Slack.',
      metrics: '284 Connected • 42 msgs/min',
    },
    organizers: {
      title: 'Organizer Command Console',
      desc: 'Human organizers monitor high-severity escalations, inspect compliance scores, and review proactive insights.',
      metrics: '5 Active Staff • 1.8s Response SLA',
    },
    brain: {
      title: 'HackMate AI Orchestrator',
      desc: 'Central agent coordinator routing intent classification, vector grounding queries, and autonomous action execution.',
      metrics: 'Gemini 2.5 Flash • Context: 1M Tokens • 1.2s Latency',
    },
    agents: {
      title: 'Specialized 7-Agent Swarm',
      desc: 'Autonomous micro-agents each dedicated to a distinct operational vector (Concierge, Schedule, Matchmaking, Reminders, Submission, Support, Analytics).',
      metrics: '7 Agents Active • 92.4% Auto-Resolution Rate',
    },
    knowledge: {
      title: 'Knowledge Base & Rules Engine',
      desc: 'Vectorized master documents (rulebooks, venue logistics, judging rubrics, sponsor APIs) supplying zero-hallucination citations.',
      metrics: '6 Master Docs • Embeddings 768d • 100% Vectorized',
    },
    dispatchers: {
      title: 'Autonomous Action Dispatchers',
      desc: 'Webhooks triggering automated Discord announcements, email reminders, deadline warnings, and mentor assignments.',
      metrics: '1,420 Notifications Sent • 99.9% Delivery',
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Multi-Agent Swarm Architecture
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
              SYSTEM DIAGRAM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Interactive visualization of the autonomous Observe → Understand → Decide → Act → Escalate loop.
          </p>
        </div>

        <button
          onClick={() => {
            setViewMode('dashboard');
            setCurrentTab('overview');
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>

      {/* Interactive Architecture Canvas */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-10">
        {/* Layer 1: Users & Ingress */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Layer 1: User & Ingress Interface
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div
              onClick={() => setSelectedNode('participants')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedNode === 'participants'
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Participants & Teams</h3>
                  <p className="text-xs text-slate-400">Questions, Checkpoints, Submissions</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedNode('organizers')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedNode === 'organizers'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Event Organizers & Staff</h3>
                  <p className="text-xs text-slate-400">Supervision, Overrides, Escalations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connecting Line Down */}
        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-blue-500/50 animate-bounce" />
        </div>

        {/* Layer 2: Core Brain & Orchestrator */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Layer 2: Autonomous Intelligence Core
          </div>
          <div
            onClick={() => setSelectedNode('brain')}
            className={`max-w-2xl mx-auto p-6 rounded-3xl border transition-all cursor-pointer text-center space-y-3 ${
              selectedNode === 'brain'
                ? 'border-purple-500 bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 shadow-2xl shadow-purple-500/20'
                : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
            }`}
          >
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
              <Cpu className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">HackMate AI Autonomous Brain</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Intent Classification • Multi-Agent Orchestration • Contextual Grounding • Automated Decision Engine
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Observe → Understand → Decide → Act → Escalate
              </span>
            </div>
          </div>
        </div>

        {/* Connecting Lines */}
        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-purple-500/50 animate-bounce" />
        </div>

        {/* Layer 3: Specialized 7-Agent Swarm */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Layer 3: Autonomous Agent Swarm (7 Micro-Agents)
          </div>
          <div
            onClick={() => setSelectedNode('agents')}
            className={`p-6 rounded-3xl border transition-all cursor-pointer ${
              selectedNode === 'agents'
                ? 'border-blue-500/60 bg-blue-500/5'
                : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-blue-400 font-bold text-xs">Concierge</div>
                <div className="text-[10px] text-slate-400">Rules & FAQ</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-indigo-400 font-bold text-xs">Schedule</div>
                <div className="text-[10px] text-slate-400">Adaptive Shift</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-purple-400 font-bold text-xs">Matchmaking</div>
                <div className="text-[10px] text-slate-400">Skill Vectors</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-amber-400 font-bold text-xs">Reminder</div>
                <div className="text-[10px] text-slate-400">Webhooks</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold text-xs">Submission</div>
                <div className="text-[10px] text-slate-400">Audit & Verify</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-rose-400 font-bold text-xs">Escalation</div>
                <div className="text-[10px] text-slate-400">Human Handoff</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold text-xs">Analytics</div>
                <div className="text-[10px] text-slate-400">Telemetry</div>
              </div>
            </div>
          </div>
        </div>

        {/* Connecting Lines */}
        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-emerald-500/50 animate-bounce" />
        </div>

        {/* Layer 4: Knowledge Base & Action Dispatchers */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
            Layer 4: Data Grounding & External Dispatch
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div
              onClick={() => setSelectedNode('knowledge')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedNode === 'knowledge'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Grounding Vector Store</h3>
                  <p className="text-xs text-slate-400">Rulebooks, Venue, Rubrics, Sponsor Docs</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setSelectedNode('dispatchers')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedNode === 'dispatchers'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Action Dispatchers</h3>
                  <p className="text-xs text-slate-400">Discord Webhooks, Slack, Email & In-App</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="p-6 rounded-2xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              {nodes[selectedNode as keyof typeof nodes]?.title}
            </h3>
            <span className="text-xs text-blue-400 font-mono font-semibold">
              {nodes[selectedNode as keyof typeof nodes]?.metrics}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {nodes[selectedNode as keyof typeof nodes]?.desc}
          </p>
        </div>
      )}
    </div>
  );
};
