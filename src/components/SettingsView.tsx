import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Sliders,
  Sparkles,
  Bot,
  Save,
  ShieldCheck,
  Radio,
  Key,
  Cpu,
  MessageSquare,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { showToast } = useHackathon();

  const [autonomyMode, setAutonomyMode] = useState('Fully Autonomous (Observe → Act)');
  const [modelChoice, setModelChoice] = useState('Gemini 2.5 Flash (Default)');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [discordWebhook, setDiscordWebhook] = useState(
    'https://discord.com/api/webhooks/123456789/hackverse-ops'
  );
  const [slackWebhook, setSlackWebhook] = useState(
    'https://hooks.slack.com/services/T000/B000/XXXX'
  );
  const [isAutoEscalateSafety, setIsAutoEscalateSafety] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Agent Settings Saved',
      description: 'Autonomous swarm parameters and webhook endpoints updated.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Agent Swarm Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold font-mono">
              SYSTEM CONFIG
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure agent orchestration parameters, triage confidence thresholds, and webhook bridges.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Swarm Operating Mode */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Swarm Behavior
            </h2>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Agent Autonomy Level:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Fully Autonomous (Observe → Act)',
                'Semi-Autonomous (Confirm Reminders)',
                'Manual Approval Required',
              ].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setAutonomyMode(mode)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    autonomyMode === mode
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-300">
              Underlying Foundation Intelligence:
            </label>
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Gemini 2.5 Flash (Default)">
                Gemini 2.5 Flash (Ultra-Low Latency, 1M Context Window)
              </option>
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
            </select>
          </div>
        </div>

        {/* Triage & Escalation Thresholds */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Triage & Safety Thresholds
            </h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Automatic Escalation Confidence Floor:</span>
              <span className="text-blue-400 font-mono font-bold">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[11px] text-slate-400">
              If AI resolution confidence falls below {confidenceThreshold}%, the ticket is automatically escalated to human staff.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                Instant Safety & Code Dispute Escalation
              </div>
              <div className="text-[11px] text-slate-400">
                Immediately hand off queries containing harassment, emergency, or plagiarism flags.
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAutoEscalateSafety}
              onChange={(e) => setIsAutoEscalateSafety(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
            />
          </div>
        </div>

        {/* External Webhook Endpoints */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Radio className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Communication Bridges
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discord Announcement Webhook:
              </label>
              <input
                type="url"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slack Operations Channel Webhook:
              </label>
              <input
                type="url"
                value={slackWebhook}
                onChange={(e) => setSlackWebhook(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
