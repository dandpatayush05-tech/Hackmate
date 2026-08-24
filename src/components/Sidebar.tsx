import React from 'react';
import { useHackathon, DashboardTab } from '../context/HackathonContext';
import {
  LayoutDashboard,
  Bot,
  Terminal,
  Users,
  UserPlus,
  CalendarDays,
  BellRing,
  FileCheck,
  ShieldAlert,
  BookOpen,
  Activity,
  BarChart3,
  Sliders,
  ChevronRight,
  Sparkles,
  Database,
} from 'lucide-react';

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, tickets, submissionAudits, insights } = useHackathon();

  const openTicketsCount = tickets.filter(
    (t) => t.status === 'Attempted Resolution' || t.status === 'Escalated to Organizer' || t.status === 'In Progress'
  ).length;

  const flaggedAuditsCount = submissionAudits.filter(
    (a) => a.eligibility === 'Action Required' || a.eligibility === 'Ineligible'
  ).length;

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        {
          id: 'ops-center',
          label: 'AI Operations Center',
          icon: Terminal,
          badge: `${insights.length} Alerts`,
          badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
        },
        {
          id: 'supabase',
          label: 'Supabase Database',
          icon: Database,
          badge: '9 Tables',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        },
        { id: 'monitor', label: 'Live Event Monitor', icon: Activity, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
      ],
    },

    {
      title: 'EVENT OPERATIONS',
      items: [
        { id: 'concierge', label: 'AI Concierge', icon: Bot },
        { id: 'participants', label: 'Participants', icon: Users },
        { id: 'teams', label: 'Smart Team Formation', icon: UserPlus, badge: 'AI Match', badgeColor: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' },
        { id: 'schedule', label: 'Schedule & Timeline', icon: CalendarDays },
        {
          id: 'appointments',
          label: 'Bookings & Mentors',
          icon: Database,
          badge: 'Supabase',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        },
        { id: 'reminders', label: 'Automated Reminders', icon: BellRing },
        {
          id: 'submissions',
          label: 'Submission Audit',
          icon: FileCheck,
          badge: flaggedAuditsCount > 0 ? flaggedAuditsCount : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        },
        {
          id: 'support',
          label: 'Support Queue',
          icon: ShieldAlert,
          badge: openTicketsCount > 0 ? openTicketsCount : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      title: 'INTELLIGENCE & CONFIG',
      items: [
        { id: 'knowledge', label: 'Knowledge & Rules', icon: BookOpen },
        { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
        { id: 'settings', label: 'Agent Settings', icon: Sliders },
      ],
    },
  ];

  return (
    <aside
      id="dashboard-sidebar"
      className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]"
    >
      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => setCurrentTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-tight ${
                            item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid System Status Card */}
      <div className="pt-4 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
          <p className="text-xs text-indigo-300 font-medium mb-1.5">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
            <span className="text-xs font-semibold text-white">All Agents Online (7/7)</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Latency: 1.2s</span>
            <span className="text-emerald-400">92.4% Auto</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
