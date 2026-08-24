import React from 'react';
import { useHackathon } from '../context/HackathonContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  Award,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const categoryData = [
    { name: 'Wi-Fi & Infra', queries: 84, resolved: 82 },
    { name: 'Submission Rules', queries: 72, resolved: 68 },
    { name: 'Schedule/Events', queries: 65, resolved: 65 },
    { name: 'Team Matching', queries: 48, resolved: 45 },
    { name: 'Mentors/Debug', queries: 38, resolved: 32 },
    { name: 'Food & Venue', queries: 32, resolved: 32 },
  ];

  const hourlyVolumeData = [
    { hour: '09:00', inquiries: 24, aiResolved: 22 },
    { hour: '11:00', inquiries: 45, aiResolved: 42 },
    { hour: '13:00', inquiries: 68, aiResolved: 63 },
    { hour: '15:00', inquiries: 52, aiResolved: 49 },
    { hour: '17:00', inquiries: 78, aiResolved: 73 },
    { hour: '19:00', inquiries: 92, aiResolved: 86 },
    { hour: '21:00', inquiries: 110, aiResolved: 101 },
    { hour: '23:00', inquiries: 85, aiResolved: 79 },
    { hour: '02:00', inquiries: 42, aiResolved: 39 },
    { hour: '05:00', inquiries: 64, aiResolved: 58 },
  ];

  const submissionProgressData = [
    { time: 'T-24h', target: 5, actual: 4 },
    { time: 'T-18h', target: 15, actual: 12 },
    { time: 'T-12h', target: 30, actual: 26 },
    { time: 'T-6h', target: 50, actual: 41 },
    { time: 'T-2h (Now)', target: 60, actual: 41 },
    { time: 'Deadline', target: 68, actual: 68 },
  ];

  const agentPieData = [
    { name: 'Concierge Agent', value: 45, color: '#3b82f6' },
    { name: 'Triage Agent', value: 20, color: '#8b5cf6' },
    { name: 'Matchmaking Agent', value: 15, color: '#ec4899' },
    { name: 'Audit Agent', value: 12, color: '#10b981' },
    { name: 'Reminder Agent', value: 8, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Analytics & Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold font-mono">
              REAL-TIME AGENT TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            System performance, query volume distributions, and submission velocity metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span>Estimated Organizer Time Saved:</span>
          <strong className="text-emerald-400 font-bold">128.5 Hours</strong>
        </div>
      </div>

      {/* KPI Stats Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <div className="text-[11px] text-slate-400 font-medium">Autonomous Resolution Rate</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">92.4%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">312 of 339 answered</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <div className="text-[11px] text-slate-400 font-medium">Average Triage Latency</div>
          <div className="text-2xl font-bold font-mono text-blue-400 mt-1">1.8s</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Under 2.5s SLA target</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <div className="text-[11px] text-slate-400 font-medium">Team Match Satisfaction</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">94.6%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">24 squads formed</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <div className="text-[11px] text-slate-400 font-medium">Escalation Rate to Staff</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">4.2%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">14 high-severity tickets</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Hourly Query Ingress Volume */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Hourly Participant Query Velocity
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Inquiries vs Resolved</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyVolumeData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inquiries"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorQueries)"
                  name="Total Inquiries"
                />
                <Area
                  type="monotone"
                  dataKey="aiResolved"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  name="AI Auto-Resolved"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Queries by Operational Category
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Volume count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="queries" fill="#6366f1" radius={[0, 4, 4, 0]} name="Total Queries" />
                <Bar
                  dataKey="resolved"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                  name="Resolved by AI"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Submission Pace vs Expected Target */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Submission Progression Timeline
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Actual vs Projected</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="target" fill="#475569" radius={[4, 4, 0, 0]} name="Projected Target" />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Submitted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Autonomous Workload Distribution */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Agent Workload Share (%)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">7 Agent Dispatchers</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {agentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
