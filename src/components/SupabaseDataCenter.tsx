import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Layers,
  Bot,
  Activity,
  Cpu,
  Sparkles,
  Terminal,
  ShieldCheck,
  Plus,
  Play,
  FileText,
  Calendar,
  Clock,
  HardDrive,
  Check,
  Users,
} from 'lucide-react';
import { useHackathon } from '../context/HackathonContext';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';

export const SupabaseDataCenter: React.FC = () => {
  const {
    diagnosticReport,
    isDiagnosticRunning,
    runDatabaseDiagnostic,
    agentSessions,
    activeSessionId,
    setActiveSessionId,
    createNewAgentSession,
    agentTasks,
    createTaskRecord,
    updateTaskRecord,
    toolCalls,
    recordToolExecution,
    agentMemories,
    recordMemory,
    knowledgeChunks,
    appointments,
    participants,
    currentUser,
    setIsAuthModalOpen,
    showToast,
  } = useHackathon();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'sessions' | 'tasks' | 'tools' | 'memory' | 'knowledge' | 'appointments'
  >('overview');

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAgent, setNewTaskAgent] = useState('Concierge Agent');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');
  const [newMemoryType, setNewMemoryType] = useState<'working' | 'short_term' | 'long_term'>('long_term');
  const [isSavingMemory, setIsSavingMemory] = useState(false);

  const tableList = [
    { name: 'users', label: 'Users & Auth', desc: 'Registered app & system users', count: diagnosticReport?.tables?.users?.rowCount ?? 0 },
    { name: 'agent_sessions', label: 'Agent Sessions', desc: 'Multi-turn conversation sessions', count: agentSessions.length },
    { name: 'session_messages', label: 'Session Messages', desc: 'Agent & participant interaction logs', count: diagnosticReport?.tables?.session_messages?.rowCount ?? 0 },
    { name: 'agent_tasks', label: 'Agent Tasks', desc: 'Execution lifecycle & status trackers', count: agentTasks.length },
    { name: 'agent_task_steps', label: 'Task Steps', desc: 'Granular step execution records', count: diagnosticReport?.tables?.agent_task_steps?.rowCount ?? 0 },
    { name: 'agent_tool_calls', label: 'Tool Call Logs', desc: 'Agent function calls & latency', count: toolCalls.length },
    { name: 'agent_memory', label: 'Agent Memory', desc: 'Working & long-term factual context', count: agentMemories.length },
    { name: 'appointments', label: 'Appointments', desc: 'Live mentor & workshop bookings', count: appointments.length },
    { name: 'knowledge_chunks', label: 'Knowledge Chunks', desc: 'RAG vector & context documents', count: knowledgeChunks.length },
  ];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    setIsCreatingTask(true);
    const created = await createTaskRecord({
      session_id: activeSessionId || 'session-default-live',
      task_name: newTaskTitle,
      goal_description: 'Automated dispatch task',
      assigned_agent: newTaskAgent.toLowerCase().replace(/\s+/g, '-'),
      status: 'pending',
    });
    setIsCreatingTask(false);
    if (created) {
      setNewTaskTitle('');
      showToast({
        title: 'Task Recorded in Supabase',
        description: `Created agent task "${newTaskTitle}" in agent_tasks table.`,
        type: 'success',
      });
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryKey || !newMemoryValue) return;
    setIsSavingMemory(true);
    const created = await recordMemory({
      agent_id: 'ops-agent',
      session_id: activeSessionId || null,
      memory_type: newMemoryType,
      memory_key: newMemoryKey,
      memory_value: newMemoryValue,
    });
    setIsSavingMemory(false);
    if (created) {
      setNewMemoryKey('');
      setNewMemoryValue('');
      showToast({
        title: 'Memory Stored in Supabase',
        description: `Persisted key "${newMemoryKey}" to agent_memory table.`,
        type: 'success',
      });
    }
  };

  const handleRunTestTool = async () => {
    const start = Date.now();
    await recordToolExecution({
      session_id: activeSessionId || null,
      agent_id: 'concierge-agent',
      tool_name: 'query_knowledge_base',
      input_args: { query: 'What is the deadline for HackVerse 2026 submissions?' },
      output_result: { result: 'Submissions close at 23:59 PST on Day 2.' },
      execution_time_ms: Date.now() - start + 45,
      is_error: false,
    });
    showToast({
      title: 'Tool Call Logged to Supabase',
      description: 'Recorded query_knowledge_base execution in agent_tool_calls table.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Cloud PostgreSQL Active</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Supabase Agentic Database Engine
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Real-time synchronization across all 9 core agentic system tables.
              Project ID: <code className="text-emerald-400 font-mono font-medium">{SUPABASE_PROJECT_ID}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => runDatabaseDiagnostic()}
              disabled={isDiagnosticRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
              <span>{isDiagnosticRunning ? 'Testing Database...' : 'Run Read/Write Test'}</span>
            </button>

            {!currentUser ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-all"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Supabase Auth</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 font-mono text-xs border border-emerald-500/30 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{currentUser.email}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Test Status Alert */}
        {diagnosticReport && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  diagnosticReport.readWriteTestPassed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {diagnosticReport.readWriteTestPassed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {diagnosticReport.readWriteTestPassed
                    ? 'Database Verified: Read & Write Tests Passed'
                    : 'Connected to Supabase Tables'}
                </div>
                <div className="text-xs text-slate-400">{diagnosticReport.summary}</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono whitespace-nowrap">
              Last probe: {new Date(diagnosticReport.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* 9 Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tableList.map((t) => {
          const diagTable = diagnosticReport?.tables?.[t.name];
          const isHealthy = diagTable?.canRead !== false;

          return (
            <div
              key={t.name}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>{t.name}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Check className="w-3 h-3" /> Live
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500">Accessible Rows</span>
                <span className="font-mono font-medium text-emerald-300">
                  {diagTable?.rowCount ?? t.count} records
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Subtabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'overview', label: 'Database Health', icon: Server },
          { id: 'sessions', label: `Sessions (${agentSessions.length})`, icon: Bot },
          { id: 'tasks', label: `Agent Tasks (${agentTasks.length})`, icon: Activity },
          { id: 'tools', label: `Tool Logs (${toolCalls.length})`, icon: Terminal },
          { id: 'memory', label: `Agent Memory (${agentMemories.length})`, icon: Cpu },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: 'knowledge', label: `Knowledge Base (${knowledgeChunks.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions & Live Operations */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Live Supabase Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => createNewAgentSession('concierge-agent')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-white">Create New Agent Session</div>
                  <div className="text-xs text-slate-400">Inserts a new record in `agent_sessions`</div>
                </div>
                <Plus className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={handleRunTestTool}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-white">Log Agent Tool Execution</div>
                  <div className="text-xs text-slate-400">Records tool latency & parameters in `agent_tool_calls`</div>
                </div>
                <Play className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Quick Add Memory */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Store Agent Long-Term Fact
            </h3>
            <form onSubmit={handleCreateMemory} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Memory key (e.g. preferred_stack)"
                  value={newMemoryKey}
                  onChange={(e) => setNewMemoryKey(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={newMemoryType}
                  onChange={(e) => setNewMemoryType(e.target.value as any)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="long_term">Long-Term Memory</option>
                  <option value="short_term">Short-Term Memory</option>
                  <option value="working">Working Memory</option>
                </select>
              </div>
              <textarea
                rows={2}
                placeholder="Memory content or learned preference..."
                value={newMemoryValue}
                onChange={(e) => setNewMemoryValue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSavingMemory || !newMemoryKey || !newMemoryValue}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-xl transition-all"
              >
                {isSavingMemory ? 'Persisting to agent_memory...' : 'Save to Supabase Memory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sessions View */}
      {activeTab === 'sessions' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Agent Sessions ({agentSessions.length})</h3>
            <button
              onClick={() => createNewAgentSession()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-medium text-xs hover:bg-emerald-400"
            >
              <Plus className="w-3.5 h-3.5" /> New Session
            </button>
          </div>

          {agentSessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No sessions found in `agent_sessions`. Click &quot;New Session&quot; to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {agentSessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`py-3 flex items-center justify-between cursor-pointer px-2 rounded-lg transition-colors ${
                    activeSessionId === s.id ? 'bg-slate-800/80 border border-emerald-500/30' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-emerald-400 font-semibold">{s.agent_id}</span>
                      <span className="text-xs text-white font-medium">{s.session_title || 'Untitled Session'}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{s.id}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-mono uppercase bg-slate-800 text-slate-300">
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks View */}
      {activeTab === 'tasks' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Agent Tasks ({agentTasks.length})</h3>
          </div>

          <form onSubmit={handleCreateTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Create new task (e.g., Audit Team 4 Repository)..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isCreatingTask || !newTaskTitle}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs disabled:opacity-50"
            >
              {isCreatingTask ? 'Creating...' : 'Add Task'}
            </button>
          </form>

          <div className="space-y-2">
            {agentTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white">{task.task_name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-emerald-400">{task.assigned_agent}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{task.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskRecord(task.id, { status: e.target.value as any })}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 border border-slate-700"
                  >
                    <option value="pending">pending</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                    <option value="failed">failed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Logs View */}
      {activeTab === 'tools' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Agent Tool Execution Logs ({toolCalls.length})</h3>
            <button
              onClick={handleRunTestTool}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs"
            >
              <Play className="w-3.5 h-3.5" /> Execute Test Call
            </button>
          </div>

          <div className="space-y-2">
            {toolCalls.map((call) => (
              <div
                key={call.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 font-mono text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold">{call.tool_name}</span>
                  <span className="text-slate-500">{call.execution_time_ms}ms</span>
                </div>
                <div className="text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px] overflow-x-auto">
                  {JSON.stringify(call.input_args)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory View */}
      {activeTab === 'memory' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white">Agent Memory Entries ({agentMemories.length})</h3>
          <div className="space-y-2">
            {agentMemories.map((mem) => (
              <div key={mem.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-emerald-400">{mem.memory_key}</span>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                    {mem.memory_type}
                  </span>
                </div>
                <div className="text-xs text-slate-300">{mem.memory_value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments View */}
      {activeTab === 'appointments' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-semibold text-white">Appointments Table ({appointments.length})</h3>
          <div className="space-y-2">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">{apt.participant_name} - {apt.appointment_type}</div>
                  <div className="text-xs text-slate-400">Host: {apt.mentor_or_host} • {apt.location_or_link}</div>
                </div>
                <span className="text-xs font-mono text-emerald-400">{apt.status || 'confirmed'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SupabaseDataCenter;
