import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { KnowledgeDocument } from '../types';
import {
  BookOpen,
  Sparkles,
  FileText,
  UploadCloud,
  CheckCircle2,
  Search,
  Plus,
  Trash2,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Cpu,
} from 'lucide-react';

export const KnowledgeBaseView: React.FC = () => {
  const { knowledgeDocs, addKnowledgeDoc, deleteKnowledgeDoc, showToast } = useHackathon();

  const [searchQuery, setSearchQuery] = useState('');
  const [testSearchPrompt, setTestSearchPrompt] = useState('');
  const [retrievedSnippet, setRetrievedSnippet] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('Rules & Policy');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredDocs = knowledgeDocs.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestGrounding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSearchPrompt.trim()) return;

    const lower = testSearchPrompt.toLowerCase();
    if (lower.includes('deadline') || lower.includes('time') || lower.includes('late')) {
      setRetrievedSnippet(
        'Retrieved from [HackVerse Official Rulebook v2.6 > Section 4.1]:\n"Submissions close promptly at 08:00 AM PST. The submission portal hard-locks with zero automated grace period."'
      );
    } else if (lower.includes('team') || lower.includes('member') || lower.includes('size')) {
      setRetrievedSnippet(
        'Retrieved from [HackVerse Official Rulebook v2.6 > Section 2.3]:\n"Teams must consist of 2 to 4 members. Solo participants will be assisted by the Matchmaking Agent or allowed to compete in the Open Explorer track."'
      );
    } else if (lower.includes('wifi') || lower.includes('food') || lower.includes('venue')) {
      setRetrievedSnippet(
        'Retrieved from [Venue Map & Logistics Guide v1.2 > Wi-Fi]:\n"SSID: HackVerse_HighSpeed (5GHz). Dinner served at 19:30 in East Hall B. Sleep pods available on Floor 2."'
      );
    } else {
      setRetrievedSnippet(
        `Retrieved from [Judging Criteria & Evaluation Rubric v2.0]:\n"Projects evaluated across 4 pillars: Technical Sophistication (30%), Innovation (30%), Practical Impact (20%), and Presentation (20%)."`
      );
    }
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addKnowledgeDoc({
      title: newTitle,
      category: newCategory,
      summary: newSummary || newContent.slice(0, 100) + '...',
      content: newContent,
      vectorIndexed: true,
      lastUpdated: 'Just now',
    });

    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Knowledge Base & Rules Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold font-mono">
              VECTOR EMBEDDINGS 100%
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounding documents, rulebooks, and sponsor guidelines indexed for zero-hallucination agent responses.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Vector Engine Health Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Vectorized Documents</div>
            <div className="text-xl font-bold font-mono text-white">
              {knowledgeDocs.length} Active Master Docs
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Grounding Accuracy</div>
            <div className="text-xl font-bold font-mono text-emerald-400">99.8% Ground Truth</div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Embeddings Model</div>
            <div className="text-xl font-bold font-mono text-blue-400">Gemini Embeddings 768d</div>
          </div>
        </div>
      </div>

      {/* Grounding Simulator Sandbox */}
      <div className="p-6 rounded-2xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Test Vector Retrieval & Grounding
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Enter a prompt to inspect which exact rule snippet the AI Concierge and Audit agents will retrieve.
        </p>

        <form onSubmit={handleTestGrounding} className="flex items-center gap-2">
          <input
            type="text"
            value={testSearchPrompt}
            onChange={(e) => setTestSearchPrompt(e.target.value)}
            placeholder="e.g. 'Can teams exceed 4 members?' or 'What is the Wi-Fi password?'"
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Retrieve Snippet
          </button>
        </form>

        {retrievedSnippet && (
          <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 text-xs text-slate-200 font-mono whitespace-pre-line leading-relaxed animate-in fade-in">
            {retrievedSnippet}
          </div>
        )}
      </div>

      {/* Document Library Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white">Indexed Rulebooks & Guides</h3>
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge documents..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{doc.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.category}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    INDEXED
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {doc.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Updated: {doc.lastUpdated}</span>
                <button
                  onClick={() => deleteKnowledgeDoc(doc.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ingest Knowledge Document
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Document Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sponsor Track: Best Agentic AI Project"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as KnowledgeDocument['category'])}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Rules & Policy">Rules & Policy</option>
                  <option value="Logistics & Venue">Logistics & Venue</option>
                  <option value="Judging & Rubric">Judging & Rubric</option>
                  <option value="APIs & Sponsor Docs">APIs & Sponsor Docs</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Summary / Overview:
                </label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g. Criteria and bonus points for sponsor API utilization."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Document Content (Grounding Text):
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste rules, rubric points, Wi-Fi credentials, or guidelines..."
                  rows={5}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-mono text-[11px]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg transition-all"
                >
                  Vectorize & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
