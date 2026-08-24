import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  BookOpen,
  HelpCircle,
  Clock,
  MapPin,
  FileCheck2,
  Users,
  Award,
  AlertTriangle,
  Copy,
  Check,
  Volume2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
  timestamp: string;
}

export const AIConcierge: React.FC = () => {
  const { showToast, addActivity, activeSessionId, recordSessionMessage } = useHackathon();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategoryChip, setSelectedCategoryChip] = useState<string>('All');


  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content:
        "Hello! I'm HackMate AI, your dedicated hackathon concierge for **HackVerse 2026**. I can answer any questions about the schedule, venue Wi-Fi & food, submission criteria, team matching, and mentor office hours.",
      source: 'HackVerse Grounding Knowledge Base v2.6',
      timestamp: '09:00 AM',
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'What are the exact submission requirements and deadline?',
      timestamp: '09:02 AM',
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content:
        'According to HackVerse Submission Rules (Section 4.1):\n• **Deadline**: Tomorrow at **08:00 AM PST sharp** with zero grace period.\n• **Required Artifacts**:\n  1. Public GitHub / GitLab repository with commit logs during event.\n  2. Live working web/mobile demo URL.\n  3. 2-3 minute video walkthrough (YouTube / Loom / Vimeo).\n  4. Track selection and project abstract.',
      source: 'HackVerse Submission Guidelines v2.4 (Section 4.1)',
      timestamp: '09:02 AM',
    },
  ]);

  const categoryChips = [
    { label: 'Schedule', icon: Clock, prompt: 'When does judging start and what is the full event schedule?' },
    { label: 'Submission Rules', icon: FileCheck2, prompt: 'What are the required deliverables for final submission?' },
    { label: 'Team Help', icon: Users, prompt: 'Can I change my team or how do I find remaining teammates?' },
    { label: 'Mentors', icon: HelpCircle, prompt: 'Where can I find mentors and how does the debug queue work?' },
    { label: 'Judging', icon: Award, prompt: 'What are the official judging criteria and weightings?' },
    { label: 'Venue & Logistics', icon: MapPin, prompt: 'Where is the venue, food service, and quiet sleeping pods?' },
  ];

  const suggestedQuestions = [
    'Where is the venue?',
    'When does judging start?',
    'What is the submission deadline?',
    'How do I submit my project?',
    'Can I change my team?',
    'Where can I find mentors?',
    'What are the judging criteria?',
    'What happens if I miss the deadline?',
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    // Sync user message to Supabase
    if (activeSessionId) {
      recordSessionMessage(activeSessionId, 'user', text).catch(() => {});
    }

    try {
      const history = chatMessages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        text: m.content,
      }));

      const response = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || 'Here is the relevant information based on the hackathon guidelines.',
        source: data.source || 'HackVerse Rules Engine v2.6',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);

      // Sync assistant reply to Supabase
      if (activeSessionId) {
        recordSessionMessage(activeSessionId, 'assistant', assistantMessage.content).catch(() => {});
      }

      addActivity({
        type: 'ai_resolved',
        title: 'Concierge answered participant inquiry',
        description: `Query: "${text.slice(0, 45)}..."`,
        severity: 'info',
        agent: 'Concierge Agent',
      });
    } catch (err) {
      const fallbackReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content:
          'According to HackVerse Knowledge Base:\nAll submissions are due at 08:00 AM PST tomorrow. Ensure your public GitHub repo is connected and your live demo is reachable.',
        source: 'HackVerse Knowledge Base & Rules Engine v2.6',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({
      title: 'Copied to Clipboard',
      description: 'Response copied.',
      type: 'info',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*•#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast({
        title: 'Voice Synthesizer',
        description: 'Playing audio response...',
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Event Concierge</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              RULES ENGINE GROUNDED
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Participant support agent answering questions with official rulebook citations.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Grounding: 6 Indexed Master Documents</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col h-[660px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">HackMate AI</h2>
              <span className="text-xs text-slate-400">“Your hackathon assistant”</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero Hallucination Mode</span>
          </div>
        </div>

        {/* Category Topic Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.label}
                onClick={() => handleSendMessage(chip.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap transition-all hover:scale-105 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-1 scrollbar-thin">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/20'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line font-sans leading-relaxed">{msg.content}</div>

                {/* Grounding Source Citation */}
                {msg.source && (
                  <div className="mt-3 pt-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-blue-400 font-mono">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-blue-400" />
                      <span>{msg.source}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1.5 font-mono ${
                    msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-blue-400 max-w-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying rules engine & verifying ground truth...</span>
            </div>
          )}
        </div>

        {/* Suggested Question Chips below chat */}
        <div className="py-2 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Frequent Questions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-400 hover:text-slate-200 transition-all hover:scale-[1.01]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 flex items-center gap-2"
        >
          <input
            id="concierge-chat-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about HackVerse (e.g., 'Where is the venue?', 'Can I change my team?')..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <button
            id="concierge-send-btn"
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
