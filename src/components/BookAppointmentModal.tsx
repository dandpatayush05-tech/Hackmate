import React, { useState } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { AppointmentType, AppointmentStatus } from '../types';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Users,
  MapPin,
  FileText,
  Sparkles,
  Database,
  CheckCircle2,
} from 'lucide-react';

const MENTOR_OPTIONS = [
  { name: 'Sarah Lin', role: 'Staff ML Engineer @ Google', specialty: 'AI Models, Gemini, PyTorch' },
  { name: 'David Chen', role: 'Distributed Systems Lead', specialty: 'Backend, Scale, Docker/K8s' },
  { name: 'Dr. Maya Patel', role: 'VP Cloud Architecture', specialty: 'Cloud, Firestore, Supabase, Security' },
  { name: 'Akash', role: 'Lead Organizer & Pitch Judge', specialty: 'Judging Rubric, Pitch Polish, Event Ops' },
  { name: 'Elena Rostova', role: 'Full Stack Architect', specialty: 'React, Node, WebSockets, UI/UX' },
  { name: 'Marcus Vance', role: 'Product & Design Partner', specialty: 'Product Strategy, UX, Storytelling' },
];

const APPOINTMENT_TYPES: AppointmentType[] = [
  'Mentor 1-on-1 Session',
  'Technical Debugging Clinic',
  'Project Architecture Review',
  'Pitch & Demo Dry Run',
  'Organizer Office Hours',
  'Cloud & API Integration Help',
];

export const BookAppointmentModal: React.FC = () => {
  const { isBookingModalOpen, setIsBookingModalOpen, createAppointment, supabaseStatus } = useHackathon();

  const [formData, setFormData] = useState({
    participant_name: '',
    participant_email: '',
    team_name: '',
    appointment_type: 'Mentor 1-on-1 Session' as AppointmentType,
    mentor_or_host: 'Sarah Lin (Staff ML Engineer @ Google)',
    scheduled_time: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
    duration_minutes: 30,
    status: 'Confirmed' as AppointmentStatus,
    location_or_link: 'Mentor Lounge - Station 4 (Hall B)',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isBookingModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.participant_name || !formData.participant_email) return;

    setIsSubmitting(true);
    const success = await createAppointment({
      ...formData,
      scheduled_time: new Date(formData.scheduled_time).toISOString(),
    });

    setIsSubmitting(false);
    if (success) {
      setIsBookingModalOpen(false);
      // Reset form
      setFormData({
        participant_name: '',
        participant_email: '',
        team_name: '',
        appointment_type: 'Mentor 1-on-1 Session',
        mentor_or_host: 'Sarah Lin (Staff ML Engineer @ Google)',
        scheduled_time: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
        duration_minutes: 30,
        status: 'Confirmed',
        location_or_link: 'Mentor Lounge - Station 4 (Hall B)',
        notes: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        id="book-appointment-modal"
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Book Appointment Session</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Supabase Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Appointments are stored in your Supabase database ({supabaseStatus?.projectId || 'cichsftdtoefgdhfyquk'})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick presets / AI assist banner */}
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Smart matching: Mentors and slots are verified in real-time with event schedules.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  participant_name: 'Alex Rivera',
                  participant_email: 'alex.rivera@cs.stanford.edu',
                  team_name: 'Team NeuroPulse',
                  appointment_type: 'Project Architecture Review',
                  mentor_or_host: 'Akash (Lead Organizer & Judge)',
                  scheduled_time: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
                  duration_minutes: 30,
                  status: 'Confirmed',
                  location_or_link: 'Main Stage Organizer Desk / Hall A',
                  notes: 'Reviewing end-to-end architecture and Supabase database integration for judging dry-run.',
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-medium text-[11px] transition-colors shrink-0"
            >
              Fill Sample Booking
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Participant Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Participant Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.participant_name}
                onChange={(e) => setFormData({ ...formData, participant_name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Participant Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Participant Email *
              </label>
              <input
                type="email"
                required
                value={formData.participant_email}
                onChange={(e) => setFormData({ ...formData, participant_email: e.target.value })}
                placeholder="e.g. alex@stanford.edu"
                className="w-full px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" /> Team Name (Optional)
              </label>
              <input
                type="text"
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                placeholder="e.g. Team NeuroPulse"
                className="w-full px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Appointment Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Session Type *
              </label>
              <select
                value={formData.appointment_type}
                onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value as AppointmentType })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {APPOINTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mentor / Host Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Mentor / Host / Reviewer *
            </label>
            <select
              value={formData.mentor_or_host}
              onChange={(e) => setFormData({ ...formData, mentor_or_host: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {MENTOR_OPTIONS.map((m) => (
                <option key={m.name} value={`${m.name} (${m.role})`}>
                  {m.name} — {m.role} ({m.specialty})
                </option>
              ))}
              <option value="General On-Duty Mentor Team">General On-Duty Mentor Team</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Scheduled Time */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Duration
              </label>
              <select
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          {/* Location or Virtual Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location / Room / Link *
            </label>
            <input
              type="text"
              required
              value={formData.location_or_link}
              onChange={(e) => setFormData({ ...formData, location_or_link: e.target.value })}
              placeholder="e.g. Mentor Lounge - Station 4 (Hall B) or Discord Voice Room #3"
              className="w-full px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Topic / Objectives / Questions
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Detail what help is needed (e.g. debugging token latency, Spanner schema design, dry run feedback)..."
              className="w-full px-3.5 py-2 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Persisting directly to Supabase table: <code className="text-slate-300">appointments</code></span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Save to Supabase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
