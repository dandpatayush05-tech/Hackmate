import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { AppointmentStatus, BookingAppointment } from '../types';
import {
  Database,
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  AlertCircle,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  User,
  Users,
  MapPin,
  Sparkles,
  ShieldCheck,
  Code2,
  Trash2,
} from 'lucide-react';

export const AppointmentsManager: React.FC = () => {
  const {
    appointments,
    isLoadingAppointments,
    supabaseStatus,
    checkSupabaseStatus,
    updateAppointmentStatus,
    deleteAppointment,
    syncAppointmentsToSupabase,
    setIsBookingModalOpen,
    showToast,
  } = useHackathon();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Status counts
  const totalBookings = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.mentor_or_host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apt.team_name && apt.team_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apt.notes && apt.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      apt.appointment_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.appointment_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCopySchema = () => {
    if (supabaseStatus?.sqlSchema) {
      navigator.clipboard.writeText(supabaseStatus.sqlSchema);
      setCopiedSchema(true);
      showToast({
        title: 'SQL Schema Copied to Clipboard',
        description: 'You can paste and execute this directly in your Supabase SQL Editor.',
        type: 'info',
      });
      setTimeout(() => setCopiedSchema(false), 2000);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    await checkSupabaseStatus();
    setIsTestingConnection(false);
    showToast({
      title: 'Supabase Status Checked',
      description: supabaseStatus?.statusMessage || 'Connected to Supabase project cichsftdtoefgdhfyquk',
      type: 'success',
    });
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    await syncAppointmentsToSupabase();
    setIsSyncing(false);
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock3 className="w-3 h-3" /> Pending
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Check className="w-3 h-3" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div id="appointments-manager-view" className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner & Supabase Connection Status Bento */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" /> Supabase Storage Engine Active
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
                Project ID: {supabaseStatus?.projectId || 'cichsftdtoefgdhfyquk'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Booking & Mentor Appointments
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              All participant bookings, mentor 1-on-1s, technical clinics, and organizer office hour details are stored and persisted to your Supabase database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
              <span>Test Connection</span>
            </button>

            <button
              onClick={() => setShowSchemaDrawer(!showSchemaDrawer)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showSchemaDrawer ? 'Hide SQL Schema' : 'View SQL Schema'}</span>
            </button>

            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-all flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSyncing ? 'Syncing to Supabase...' : 'Sync All to Supabase'}</span>
            </button>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Database diagnostic bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <div className={`w-2 h-2 rounded-full ${supabaseStatus?.tableExists ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'}`} />
            <span className="text-slate-400">Database Status:</span>
            <span className={`font-semibold font-mono ${supabaseStatus?.tableExists ? 'text-emerald-400' : 'text-amber-400'}`}>
              {supabaseStatus?.tableExists ? 'Cloud Synced' : 'Connected (Local Persisted)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-400">Target Table:</span>
            <span className="font-semibold font-mono text-slate-200">public.appointments</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-400">Cloud Host:</span>
            <span className="font-mono text-slate-400 truncate">cichsftdtoefgdhfyquk.supabase.co</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-400">Stored Records:</span>
            <span className="font-semibold text-white font-mono">{appointments.length} Records</span>
          </div>
        </div>
      </div>

      {/* Notice if table hasn't been created in Supabase SQL editor yet */}
      {supabaseStatus && !supabaseStatus.tableExists && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                Supabase Project Connected • Enable Cloud PostgreSQL Syncing
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5 max-w-2xl">
                Appointments are currently stored locally. To synchronize appointments directly with your live Supabase cloud database, execute the SQL schema once in your Supabase SQL editor.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setShowSchemaDrawer(true);
                handleCopySchema();
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL & Setup Table'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SQL Schema helper box if toggled */}
      {showSchemaDrawer && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold text-white">Supabase SQL Schema & Row Level Security (RLS)</h3>
            </div>
            <button
              onClick={handleCopySchema}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedSchema ? 'Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            If you ever need to create or inspect the table structure in your Supabase Dashboard SQL Editor, run this script:
          </p>
          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
            {supabaseStatus?.sqlSchema || `-- Supabase Appointments Table Schema
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  team_name TEXT,
  appointment_type TEXT NOT NULL,
  mentor_or_host TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Confirmed',
  location_or_link TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
          </pre>
        </div>
      )}

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1.5 font-mono">{totalBookings}</p>
          <p className="text-[10px] text-slate-400 mt-1">Saved in Supabase database</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Confirmed</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1.5 font-mono">{confirmedCount}</p>
          <p className="text-[10px] text-emerald-400/80 mt-1">Ready for mentor review</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending Review</p>
            <Clock3 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-1.5 font-mono">{pendingCount}</p>
          <p className="text-[10px] text-amber-400/80 mt-1">Awaiting mentor confirmation</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Completed Sessions</p>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-1.5 font-mono">{completedCount}</p>
          <p className="text-[10px] text-indigo-400/80 mt-1">Feedback logged in portal</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search participant, team, mentor, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'all' ? 'All Statuses' : status}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Session Types</option>
            <option value="Mentor 1-on-1 Session">Mentor 1-on-1 Session</option>
            <option value="Technical Debugging Clinic">Technical Debugging Clinic</option>
            <option value="Project Architecture Review">Project Architecture Review</option>
            <option value="Pitch & Demo Dry Run">Pitch & Demo Dry Run</option>
            <option value="Organizer Office Hours">Organizer Office Hours</option>
            <option value="Cloud & API Integration Help">Cloud & API Integration Help</option>
          </select>
        </div>
      </div>

      {/* Appointments List / Bento Cards */}
      {isLoadingAppointments ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading appointments from Supabase...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 space-y-3">
          <Database className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No appointments found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Book your first mentor session or office hour appointment to save in Supabase.'}
          </p>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Book First Appointment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              id={`appointment-card-${apt.id}`}
              className="p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 inline-block mb-1.5">
                    {apt.appointment_type}
                  </span>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {apt.participant_name}
                    {apt.team_name && (
                      <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                        • <Users className="w-3 h-3 text-slate-500" /> {apt.team_name}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{apt.participant_email}</p>
                </div>
                <div>{getStatusBadge(apt.status)}</div>
              </div>

              {/* Mentor and Location Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Host / Mentor</p>
                    <p className="font-medium text-slate-200 truncate">{apt.mentor_or_host}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Location / Stage</p>
                    <p className="font-medium text-slate-200 truncate">{apt.location_or_link}</p>
                  </div>
                </div>
              </div>

              {/* Time and Duration */}
              <div className="flex items-center justify-between text-xs px-1 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-200">{formatDateTime(apt.scheduled_time)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{apt.duration_minutes} Minutes</span>
                </div>
              </div>

              {/* Notes */}
              {apt.notes && (
                <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300 italic">
                  "{apt.notes}"
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Status:</span>
                  <select
                    value={apt.status}
                    onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                    className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteAppointment(apt.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title="Cancel & Remove from Supabase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
