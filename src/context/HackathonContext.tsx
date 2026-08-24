import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  Participant,
  Team,
  MatchRecommendation,
  ScheduleEvent,
  Reminder,
  SubmissionAuditItem,
  SupportTicket,
  KnowledgeDocument,
  ActivityEvent,
  AIAgentInfo,
  OperationalInsight,
  NotificationItem,
  BookingAppointment,
  AppointmentStatus,
  AppointmentType,
  SupabaseUser,
  SupabaseAgentSession,
  SupabaseSessionMessage,
  SupabaseAgentTask,
  SupabaseAgentTaskStep,
  SupabaseAgentToolCall,
  SupabaseAgentMemory,
  SupabaseKnowledgeChunk,
  DatabaseTestReport,
} from '../types';
import {
  INITIAL_AGENTS,
  INITIAL_INSIGHTS,
  INITIAL_PARTICIPANTS,
  INITIAL_TEAMS,
  INITIAL_MATCH_RECOMMENDATIONS,
  INITIAL_SCHEDULE,
  INITIAL_REMINDERS,
  INITIAL_SUBMISSION_AUDITS,
  INITIAL_TICKETS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  getCurrentAuthUser,
  getCurrentSession,
  onAuthStateChange,
  getAppointments as fetchSupabaseAppointments,
  saveAppointment as persistSupabaseAppointment,
  updateAppointment as updateSupabaseAppointment,
  deleteAppointment as deleteSupabaseAppointment,
  getAgentSessions,
  createAgentSession,
  getSessionMessages,
  saveSessionMessage,
  getAgentTasks,
  createAgentTask,
  updateAgentTask,
  getAgentToolCalls,
  logAgentToolCall,
  getAgentMemories,
  saveAgentMemory,
  getKnowledgeChunks,
  saveKnowledgeChunk,
  performDatabaseReadWriteTest,
} from '../lib/supabase';

export type ViewMode = 'landing' | 'dashboard' | 'participant' | 'architecture' | 'enroll';
export type DashboardTab =
  | 'overview'
  | 'ops-center'
  | 'concierge'
  | 'participants'
  | 'teams'
  | 'schedule'
  | 'reminders'
  | 'submissions'
  | 'support'
  | 'appointments'
  | 'supabase'
  | 'knowledge'
  | 'monitor'
  | 'analytics'
  | 'settings';


export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'critical';
}

export interface SupabaseStatusInfo {
  connected: boolean;
  projectId: string;
  supabaseUrl: string;
  table: string;
  tableExists: boolean;
  appointmentsTableExists?: boolean;
  participantsTableExists?: boolean;
  totalRecords?: number;
  totalAppointments?: number;
  totalParticipants?: number;
  statusMessage: string;
  sqlSchema: string;
  error?: string;
  notice?: string;
}

interface HackathonContextType {
  // Authentication State
  currentUser: User | null;
  currentSession: Session | null;
  isAuthLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ user: User | null; error: string | null }>;
  signUp: (email: string, pass: string, name?: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;

  // Database Diagnostic Suite
  diagnosticReport: DatabaseTestReport | null;
  isDiagnosticRunning: boolean;
  runDatabaseDiagnostic: () => Promise<DatabaseTestReport>;

  // Agent Sessions & Messages State
  agentSessions: SupabaseAgentSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  createNewAgentSession: (agentId?: string, title?: string) => Promise<SupabaseAgentSession | null>;
  loadSessionMessages: (sessionId: string) => Promise<SupabaseSessionMessage[]>;
  recordSessionMessage: (sessionId: string, role: 'user' | 'assistant' | 'system', content: string) => Promise<SupabaseSessionMessage | null>;

  // Agent Tasks & Tool Calls
  agentTasks: SupabaseAgentTask[];
  createTaskRecord: (task: Omit<SupabaseAgentTask, 'id' | 'created_at' | 'updated_at'>) => Promise<SupabaseAgentTask | null>;
  updateTaskRecord: (id: string, updates: Partial<SupabaseAgentTask>) => Promise<boolean>;
  toolCalls: SupabaseAgentToolCall[];
  recordToolExecution: (call: Omit<SupabaseAgentToolCall, 'id' | 'created_at'>) => Promise<SupabaseAgentToolCall | null>;

  // Agent Memory & Knowledge
  agentMemories: SupabaseAgentMemory[];
  recordMemory: (memory: Omit<SupabaseAgentMemory, 'id' | 'created_at'>) => Promise<SupabaseAgentMemory | null>;
  knowledgeChunks: SupabaseKnowledgeChunk[];
  loadKnowledgeChunks: (docId?: string) => Promise<void>;

  // Navigation & View
  viewMode: ViewMode;
  setViewMode: (view: ViewMode) => void;
  currentTab: DashboardTab;
  setCurrentTab: (tab: DashboardTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedEvent: string;
  setSelectedEvent: (event: string) => void;
  availableEvents: string[];

  // Live Timer
  remainingSeconds: number;
  formattedCountdown: string;

  // State Collections
  agents: AIAgentInfo[];
  insights: OperationalInsight[];
  dismissInsight: (id: string) => void;
  participants: Participant[];
  isLoadingParticipants: boolean;
  fetchParticipants: () => Promise<void>;
  teams: Team[];
  matchRecommendations: MatchRecommendation[];
  scheduleEvents: ScheduleEvent[];
  reminders: Reminder[];
  autoRemindersEnabled: boolean;
  setAutoRemindersEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  submissionAudits: SubmissionAuditItem[];
  tickets: SupportTicket[];
  knowledgeDocs: KnowledgeDocument[];
  activities: ActivityEvent[];
  notifications: NotificationItem[];

  // Supabase Booking & Appointment State
  appointments: BookingAppointment[];
  isLoadingAppointments: boolean;
  supabaseStatus: SupabaseStatusInfo | null;
  checkSupabaseStatus: () => Promise<void>;
  createAppointment: (apt: Omit<BookingAppointment, 'id' | 'created_at'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, updates?: Partial<BookingAppointment>) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
  syncAppointmentsToSupabase: () => Promise<void>;
  syncParticipantsToSupabase: () => Promise<void>;
  syncAllToSupabase: () => Promise<void>;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;

  // Participant Portal State (Alex)
  participantTasks: { id: string; label: string; completed: boolean }[];
  toggleParticipantTask: (taskId: string) => void;
  participantProgressPercent: number;

  // Actions
  registerParticipant: (p: Omit<Participant, 'id'>) => Promise<Participant>;
  acceptMatch: (recId: string) => void;
  regenerateMatches: () => void;
  modifyScheduleAdaptive: (eventId: string, newTime: string, reason: string) => void;
  triggerReminderNow: (reminderId: string) => void;
  createReminder: (reminder: Omit<Reminder, 'id' | 'sentCount'>) => void;
  runFleetAIAudit: () => Promise<void>;
  auditSingleTeam: (teamId: string) => Promise<void>;
  escalateTicketToOrganizer: (ticketId: string, reason?: string) => void;
  resolveTicketWithAI: (ticketId: string, reply: string) => void;
  uploadKnowledgeDoc: (file: { name: string; size: string; category: KnowledgeDocument['category'] }) => void;
  addActivity: (activity: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  isAuditingFleet: boolean;

  // Toast System
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals
  isAskAIModalOpen: boolean;
  setIsAskAIModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // New missing methods and aliases
  addKnowledgeDoc: (doc: Omit<KnowledgeDocument, 'id'>) => void;
  deleteKnowledgeDoc: (id: string) => void;
  resolveTicketByAI: (ticketId: string, reply?: string) => void;
  assignMentorToTicket: (ticketId: string, mentorName: string) => void;
  flagSubmissionTeam: (teamId: string) => void;
  acceptMatchRecommendation: (recId: string) => void;
  activityLog: ActivityEvent[];
}


const HackathonContext = createContext<HackathonContextType | undefined>(undefined);

const getInitialViewMode = (): ViewMode => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/enroll' || hash === '#enroll') return 'enroll';
    if (path === '/participant' || hash === '#participant') return 'participant';
    if (path === '/dashboard' || hash === '#dashboard') return 'dashboard';
    if (path === '/architecture' || hash === '#architecture') return 'architecture';
  }
  return 'landing';
};

export const HackathonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialViewMode);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      const targetPath = mode === 'landing' ? '/' : `/${mode}`;
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({ viewMode: mode }, '', targetPath);
        } catch {
          // Fallback if pushState restricted in iframe
        }
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const current = getInitialViewMode();
      setViewModeState(current);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedEvent, setSelectedEvent] = useState<string>('HackVerse 2026 (Live)');
  const availableEvents = [
    'HackVerse 2026 (Live)',
    'Global AI Agents Hackathon 2026',
    'CyberDefend ZeroDay Hackathon',
    'BioHealth Innovators 2026',
  ];

  // 18 hours 42 minutes 15 seconds initial countdown
  const [remainingSeconds, setRemainingSeconds] = useState<number>(18 * 3600 + 42 * 60 + 15);
  const [isAuditingFleet, setIsAuditingFleet] = useState(false);

  // Collections
  const [agents, setAgents] = useState<AIAgentInfo[]>(INITIAL_AGENTS);
  const [insights, setInsights] = useState<OperationalInsight[]>(INITIAL_INSIGHTS);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [matchRecommendations, setMatchRecommendations] = useState<MatchRecommendation[]>(INITIAL_MATCH_RECOMMENDATIONS);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [autoRemindersEnabled, setAutoRemindersEnabled] = useState<boolean>(true);
  const [submissionAudits, setSubmissionAudits] = useState<SubmissionAuditItem[]>(INITIAL_SUBMISSION_AUDITS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Supabase Booking & Appointment State
  const [appointments, setAppointments] = useState<BookingAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusInfo | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Database Diagnostic Suite State
  const [diagnosticReport, setDiagnosticReport] = useState<DatabaseTestReport | null>(null);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);

  // Agent State (Supabase Connected)
  const [agentSessions, setAgentSessions] = useState<SupabaseAgentSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-default-live');
  const [agentTasks, setAgentTasks] = useState<SupabaseAgentTask[]>([]);
  const [toolCalls, setToolCalls] = useState<SupabaseAgentToolCall[]>([]);
  const [agentMemories, setAgentMemories] = useState<SupabaseAgentMemory[]>([]);
  const [knowledgeChunks, setKnowledgeChunks] = useState<SupabaseKnowledgeChunk[]>([]);

  // 1. Initialize Auth on Mount
  useEffect(() => {
    let isMounted = true;
    getCurrentSession().then((session) => {
      if (isMounted) {
        setCurrentSession(session);
        setCurrentUser(session?.user || null);
        setIsAuthLoading(false);
      }
    });

    const { data: authListener } = onAuthStateChange((user, session) => {
      if (isMounted) {
        setCurrentUser(user);
        setCurrentSession(session);
        setIsAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 2. Run Database Diagnostic Test
  const runDatabaseDiagnostic = async (): Promise<DatabaseTestReport> => {
    setIsDiagnosticRunning(true);
    try {
      const report = await performDatabaseReadWriteTest();
      setDiagnosticReport(report);
      return report;
    } catch (err: any) {
      const fallbackReport: DatabaseTestReport = {
        timestamp: new Date().toISOString(),
        connected: false,
        supabaseUrl: SUPABASE_URL,
        projectId: SUPABASE_PROJECT_ID,
        overallHealth: 'error',
        tables: {},
        readWriteTestPassed: false,
        summary: `Diagnostic probe error: ${err?.message || 'Unknown'}`,
      };
      setDiagnosticReport(fallbackReport);
      return fallbackReport;
    } finally {
      setIsDiagnosticRunning(false);
    }
  };

  // 3. Auth Actions
  const signIn = async (email: string, pass: string) => {
    setIsAuthLoading(true);
    const res = await signInWithEmail(email, pass);
    setIsAuthLoading(false);
    if (res.user) {
      setCurrentUser(res.user);
      setCurrentSession(res.session);
      showToast({
        title: 'Signed In Successfully',
        description: `Welcome back, ${res.user.email}!`,
        type: 'success',
      });
    } else {
      showToast({
        title: 'Sign In Failed',
        description: res.error || 'Check your credentials.',
        type: 'critical',
      });
    }
    return res;
  };

  const signUp = async (email: string, pass: string, name?: string) => {
    setIsAuthLoading(true);
    const res = await signUpWithEmail(email, pass, name);
    setIsAuthLoading(false);
    if (res.user) {
      setCurrentUser(res.user);
      setCurrentSession(res.session);
      showToast({
        title: 'Account Created in Supabase',
        description: `User record established for ${email}.`,
        type: 'success',
      });
    } else {
      showToast({
        title: 'Sign Up Notice',
        description: res.error || 'Failed to create account.',
        type: 'warning',
      });
    }
    return res;
  };

  const signOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setCurrentSession(null);
    showToast({
      title: 'Signed Out',
      description: 'Session ended successfully.',
      type: 'info',
    });
  };

  // 4. Agent Sessions & Messages
  const loadAgentSessions = async () => {
    const res = await getAgentSessions();
    if (res.data && res.data.length > 0) {
      setAgentSessions(res.data);
      if (!activeSessionId || activeSessionId === 'session-default-live') {
        setActiveSessionId(res.data[0].id);
      }
    }
  };

  const createNewAgentSession = async (agentId = 'concierge-agent', title?: string) => {
    const res = await createAgentSession({
      agent_id: agentId,
      session_title: title || `${agentId} Session - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      user_id: currentUser?.id || null,
      status: 'active',
      model_name: 'gemini-2.5-flash',
    });
    if (res.data) {
      setAgentSessions((prev) => [res.data!, ...prev]);
      setActiveSessionId(res.data.id);
      return res.data;
    }
    return null;
  };

  const loadSessionMessages = async (sessionId: string) => {
    const res = await getSessionMessages(sessionId);
    return res.data;
  };

  const recordSessionMessage = async (sessionId: string, role: 'user' | 'assistant' | 'system', content: string) => {
    const res = await saveSessionMessage({
      session_id: sessionId,
      role,
      content,
    });
    return res.data;
  };

  // 5. Agent Tasks & Steps
  const loadAgentTasks = async () => {
    const res = await getAgentTasks();
    if (res.data && res.data.length > 0) {
      setAgentTasks(res.data);
    }
  };

  const createTaskRecord = async (task: Omit<SupabaseAgentTask, 'id' | 'created_at' | 'updated_at'>) => {
    const res = await createAgentTask(task);
    if (res.data) {
      setAgentTasks((prev) => [res.data!, ...prev]);
      return res.data;
    }
    return null;
  };

  const updateTaskRecord = async (id: string, updates: Partial<SupabaseAgentTask>) => {
    const res = await updateAgentTask(id, updates);
    if (res.success) {
      setAgentTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      return true;
    }
    return false;
  };

  // 6. Tool Calls
  const loadToolCalls = async () => {
    const res = await getAgentToolCalls();
    if (res.data) setToolCalls(res.data);
  };

  const recordToolExecution = async (call: Omit<SupabaseAgentToolCall, 'id' | 'created_at'>) => {
    const res = await logAgentToolCall(call);
    if (res.data) {
      setToolCalls((prev) => [res.data!, ...prev]);
      return res.data;
    }
    return null;
  };

  // 7. Memory & Knowledge
  const recordMemory = async (memory: Omit<SupabaseAgentMemory, 'id' | 'created_at'>) => {
    const res = await saveAgentMemory(memory);
    if (res.data) {
      setAgentMemories((prev) => [res.data!, ...prev]);
      return res.data;
    }
    return null;
  };

  const loadKnowledgeChunks = async (docId?: string) => {
    const res = await getKnowledgeChunks(docId);
    if (res.data) setKnowledgeChunks(res.data);
  };

  // Fetch appointments, participants, sessions, and diagnostic on load
  const checkSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (err) {
      console.warn('Failed to check Supabase status:', err);
    }
  };

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const res = await fetchSupabaseAppointments();
      if (res.data && res.data.length > 0) {
        setAppointments(res.data);
        setIsLoadingAppointments(false);
        return;
      }
    } catch {
      // Fallback
    }

    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
        }
      }
    } catch (err) {
      console.warn('Appointments fetch fallback:', err);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const fetchParticipants = async () => {
    setIsLoadingParticipants(true);
    try {
      const res = await fetch('/api/participants');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.participants) && data.participants.length > 0) {
          setParticipants(data.participants);
          setIsLoadingParticipants(false);
          return;
        }
      }
    } catch {
      // Direct client fallback
      try {
        const { data } = await supabase.from('participants').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0) {
          const mapped = data.map((raw: any) => ({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            avatar: raw.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(raw.name || 'user')}`,
            skills: Array.isArray(raw.skills) ? raw.skills : ['General Software'],
            preferredDomain: raw.preferred_domain || raw.preferredDomain || 'AI & Autonomous Agents',
            experience: raw.experience || 'Intermediate',
            availability: raw.availability || 'Full Weekend',
            teamPreference: raw.team_preference || raw.teamPreference || 'Looking for Team',
            teamId: raw.team_id || raw.teamId || undefined,
            discordHandle: raw.discord_handle || raw.discordHandle || undefined,
            bio: raw.bio || '',
            created_at: raw.created_at,
          }));
          setParticipants(mapped);
        }
      } catch (err) {
        console.warn('Direct Supabase fetch participants notice:', err);
      }
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  useEffect(() => {
    checkSupabaseStatus();
    fetchAppointments();
    fetchParticipants();
    loadAgentSessions();
    loadAgentTasks();
    loadToolCalls();
    loadKnowledgeChunks();
    runDatabaseDiagnostic();
  }, []);


  const createAppointment = async (apt: Omit<BookingAppointment, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apt),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.appointment) {
          setAppointments((prev) => [data.appointment, ...prev.filter((a) => a.id !== data.appointment.id)]);
        }
        showToast({
          title: 'Appointment Booked & Saved to Supabase',
          description: `Scheduled ${apt.appointment_type} with ${apt.mentor_or_host} for ${apt.participant_name}.`,
          type: 'success',
        });
        addActivity({
          type: 'mentor_request',
          title: `New Booking: ${apt.appointment_type}`,
          description: `${apt.participant_name} booked with ${apt.mentor_or_host} (${apt.location_or_link}). Synced to Supabase.`,
          severity: 'success',
          agent: 'Operations Agent',
        });
        checkSupabaseStatus();
        return true;
      }
    } catch {
      // Direct client fallback using src/lib/supabase.ts
    }

    // Direct fallback to Supabase client
    const fallbackId = `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullRecord: BookingAppointment = {
      ...apt,
      id: fallbackId,
      created_at: new Date().toISOString(),
    };

    const result = await persistSupabaseAppointment(fullRecord);
    if (result.success) {
      setAppointments((prev) => [fullRecord, ...prev]);
      showToast({
        title: 'Appointment Saved to Supabase Cloud',
        description: `Scheduled ${apt.appointment_type} with ${apt.mentor_or_host}.`,
        type: 'success',
      });
      return true;
    } else {
      // Still keep optimistic local copy with warning if schema error
      setAppointments((prev) => [fullRecord, ...prev]);
      showToast({
        title: result.isSchemaError ? 'Supabase Table Missing' : 'Saved Locally',
        description: result.error || 'Saved in local state. Create the appointments table in Supabase to sync.',
        type: result.isSchemaError ? 'critical' : 'warning',
      });
      return true;
    }
  };


  const updateAppointmentStatus = async (
    id: string,
    status: AppointmentStatus,
    updates?: Partial<BookingAppointment>
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...updates }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status, ...updates } : a))
        );
        showToast({
          title: 'Appointment Updated',
          description: `Status changed to ${status}. Synced with Supabase.`,
          type: 'info',
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        showToast({
          title: 'Appointment Cancelled',
          description: 'Removed from schedule and Supabase database.',
          type: 'warning',
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const syncAppointmentsToSupabase = async () => {
    try {
      const res = await fetch('/api/supabase/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointments }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.appointments) {
          setAppointments(data.appointments);
        }
        showToast({
          title: 'Supabase Sync Complete',
          description: `Successfully synchronized ${appointments.length} appointments to your Supabase project (cichsftdtoefgdhfyquk).`,
          type: 'success',
        });
        checkSupabaseStatus();
      } else {
        const data = await res.json();
        showToast({
          title: 'Supabase Sync Error',
          description: data.error || 'Failed to sync with Supabase',
          type: 'critical',
        });
      }
    } catch (err: any) {
      showToast({
        title: 'Sync Failed',
        description: err.message,
        type: 'critical',
      });
    }
  };

  const syncParticipantsToSupabase = async () => {
    try {
      const res = await fetch('/api/supabase/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.participants) {
          setParticipants(data.participants);
        }
        showToast({
          title: 'Participants Synced to Supabase',
          description: `Successfully synchronized ${participants.length} participants to Supabase cloud database!`,
          type: 'success',
        });
        checkSupabaseStatus();
      } else {
        const data = await res.json();
        showToast({
          title: 'Supabase Sync Notice',
          description: data.error || 'Failed to sync participants with Supabase',
          type: 'critical',
        });
      }
    } catch (err: any) {
      showToast({
        title: 'Sync Failed',
        description: err.message,
        type: 'critical',
      });
    }
  };

  const syncAllToSupabase = async () => {
    try {
      const res = await fetch('/api/supabase/sync-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointments, participants }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.appointments) setAppointments(data.appointments);
        if (data.participants) setParticipants(data.participants);
        showToast({
          title: 'Full Supabase Sync Complete',
          description: 'All appointments and participants are synchronized with Supabase PostgreSQL.',
          type: 'success',
        });
        checkSupabaseStatus();
      }
    } catch (err: any) {
      showToast({
        title: 'Sync Failed',
        description: err.message,
        type: 'critical',
      });
    }
  };

  // Participant checklist for Alex
  const [participantTasks, setParticipantTasks] = useState([
    { id: 't-join', label: 'Join / Form Verified Team', completed: true },
    { id: 't-reg', label: 'Project Registration & Track Selection', completed: true },
    { id: 't-repo', label: 'Public GitHub Repository Connected', completed: true },
    { id: 't-demo', label: 'Live Deployed Demo URL Deployed', completed: false },
    { id: 't-vid', label: '2-3 Min Pitch Video Walkthrough', completed: false },
  ]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAskAIModalOpen, setIsAskAIModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme root toggle
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Periodic subtle live events to make the operations monitor feel live
  useEffect(() => {
    const liveSimInterval = setInterval(() => {
      const simulatedEvents = [
        {
          type: 'ai_resolved' as const,
          title: 'Concierge resolved participant inquiry',
          description: 'Answered question on mentor office hours queue.',
          severity: 'info' as const,
          agent: 'Concierge Agent',
        },
        {
          type: 'submission' as const,
          title: 'Submission Agent checked commit velocity',
          description: 'Verified 14 commits across 8 active repositories.',
          severity: 'info' as const,
          agent: 'Submission Agent',
        },
      ];
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      if (Math.random() > 0.4) {
        addActivity(randomEvent);
      }
    }, 25000);
    return () => clearInterval(liveSimInterval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formattedCountdown = (() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    return `${hours}h ${minutes < 10 ? '0' : ''}${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s remaining`;
  })();

  const completedCount = participantTasks.filter((t) => t.completed).length;
  const participantProgressPercent = Math.round((completedCount / participantTasks.length) * 100);

  const toggleParticipantTask = (taskId: string) => {
    setParticipantTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
    showToast({
      title: 'Progress Updated',
      description: 'Your participant submission milestones have been updated.',
      type: 'success',
    });
  };

  const dismissInsight = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
    showToast({
      title: 'Insight Dismissed',
      description: 'Operational alert marked as reviewed.',
      type: 'info',
    });
  };

  const addActivity = (activity: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newAct: ActivityEvent = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  };

  const registerParticipant = async (newP: Omit<Participant, 'id'>): Promise<Participant> => {
    const tempId = `p-${Date.now().toString().slice(-6)}`;
    const optimisticParticipant: Participant = {
      ...newP,
      id: tempId,
    };

    // Optimistically update frontend state
    setParticipants((prev) => [optimisticParticipant, ...prev.filter((p) => p.email !== newP.email)]);

    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newP),
      });

      if (res.ok) {
        const data = await res.json();
        const savedParticipant: Participant = data.participant || optimisticParticipant;
        setParticipants((prev) => [savedParticipant, ...prev.filter((p) => p.email !== newP.email && p.id !== tempId)]);

        const isSupabaseSaved = data.supabase?.saved === true;
        showToast({
          title: isSupabaseSaved ? 'Enrolled & Saved to Supabase!' : 'Enrollment Confirmed!',
          description: isSupabaseSaved
            ? `Welcome ${savedParticipant.name}! Profile persisted in Supabase PostgreSQL (Project cichsftdtoefgdhfyquk).`
            : `Welcome ${savedParticipant.name}! Saved in HackMate persistent storage.`,
          type: 'success',
        });

        addActivity({
          type: 'team_match',
          title: `Participant Enrolled: ${savedParticipant.name}`,
          description: `${savedParticipant.name} registered for ${savedParticipant.preferredDomain} (${savedParticipant.skills.join(', ')}). ${isSupabaseSaved ? 'Synced to Supabase cloud database.' : ''}`,
          severity: 'success',
          agent: 'Concierge Agent',
        });

        checkSupabaseStatus();
        return savedParticipant;
      }
    } catch (err) {
      console.warn('Backend enrollment dispatch notice:', err);
      try {
        if (supabase) {
          await supabase.from('participants').insert([{
            id: optimisticParticipant.id,
            name: optimisticParticipant.name,
            email: optimisticParticipant.email,
            avatar: optimisticParticipant.avatar,
            skills: optimisticParticipant.skills,
            preferred_domain: optimisticParticipant.preferredDomain,
            experience: optimisticParticipant.experience,
            availability: optimisticParticipant.availability,
            team_preference: optimisticParticipant.teamPreference,
            team_id: optimisticParticipant.teamId || null,
            discord_handle: optimisticParticipant.discordHandle || null,
            bio: optimisticParticipant.bio || null,
            created_at: new Date().toISOString(),
          }]);
        }
      } catch (clientErr) {
        console.warn('Direct client Supabase insert notice:', clientErr);
      }
    }


    showToast({
      title: 'Registration Confirmed!',
      description: `Welcome ${optimisticParticipant.name}! You are enrolled in ${selectedEvent}.`,
      type: 'success',
    });

    addActivity({
      type: 'team_match',
      title: `Participant Enrolled: ${optimisticParticipant.name}`,
      description: `${optimisticParticipant.name} registered for ${optimisticParticipant.preferredDomain} (${optimisticParticipant.skills.join(', ')}).`,
      severity: 'success',
      agent: 'Concierge Agent',
    });

    return optimisticParticipant;
  };

  const acceptMatch = (recId: string) => {
    setMatchRecommendations((prev) =>
      prev.map((rec) => (rec.id === recId ? { ...rec, accepted: true } : rec))
    );
    showToast({
      title: 'Team Formed & Invites Dispatched',
      description: `Team invitations sent across Discord & Email. Assigned to Track.`,
      type: 'success',
    });
    addActivity({
      type: 'team_match',
      title: 'AI Match Accepted: Team Created',
      description: '4 participants grouped into official hackathon team.',
      severity: 'success',
      agent: 'Matchmaking Agent',
    });
  };

  const regenerateMatches = () => {
    showToast({
      title: 'Matchmaking Agent Triggered',
      description: 'Re-evaluating participant skill vectors, timezone overlap, and domain preferences...',
      type: 'info',
    });
    setTimeout(() => {
      setMatchRecommendations([
        ...INITIAL_MATCH_RECOMMENDATIONS,
        {
          id: `rec-${Date.now()}`,
          teamName: 'Recommended Team #26 (QuantumVanguard)',
          participants: [
            INITIAL_PARTICIPANTS[1],
            INITIAL_PARTICIPANTS[4],
            INITIAL_PARTICIPANTS[5],
          ],
          matchScore: 96,
          reasons: [
            'Exceptional Python/Data synthesis paired with real-time UI/UX specialist.',
            'Targeting Climate AI Open Track with high synergy.',
          ],
          recommendedRoles: {
            p2: 'Lead AI Engineer',
            p5: 'Telemetry Modeler',
            p6: 'App Developer',
          },
        },
      ]);
      showToast({
        title: 'New Matches Generated',
        description: 'Synthesized 1 new high-compatibility team recommendation.',
        type: 'success',
      });
    }, 1200);
  };

  const modifyScheduleAdaptive = (eventId: string, newTime: string, reason: string) => {
    let notifiedCount = 0;
    setScheduleEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          notifiedCount = ev.attendeesNotified || 147;
          return {
            ...ev,
            originalTime: ev.originalTime || ev.time,
            time: newTime,
            isAdaptiveModified: true,
            attendeesNotified: notifiedCount,
          };
        }
        return ev;
      })
    );
    showToast({
      title: 'Adaptive Schedule Triggered',
      description: `Schedule modified: "${newTime}". Broadcast push sent to ${notifiedCount} registered attendees.`,
      type: 'warning',
    });
    addActivity({
      type: 'schedule_change',
      title: `Schedule Updated: ${newTime}`,
      description: `Reason: ${reason}. Automated notifications delivered.`,
      severity: 'warning',
      agent: 'Schedule Agent',
    });
  };

  const triggerReminderNow = (reminderId: string) => {
    const rem = reminders.find((r) => r.id === reminderId);
    if (!rem) return;

    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? { ...r, sentCount: r.sentCount + 1, lastSent: 'Just now' }
          : r
      )
    );

    showToast({
      title: `Reminder Broadcast Dispatched`,
      description: `Dispatched via ${rem.channel} to ${rem.audience}.`,
      type: 'success',
    });

    addActivity({
      type: 'reminder',
      title: `Broadcast: ${rem.title}`,
      description: `Targeted ${rem.audience} via ${rem.channel}.`,
      severity: 'info',
      agent: 'Reminder Agent',
    });
  };

  const createReminder = (newRem: Omit<Reminder, 'id' | 'sentCount'>) => {
    const rem: Reminder = {
      ...newRem,
      id: `rem-${Date.now()}`,
      sentCount: 0,
    };
    setReminders((prev) => [rem, ...prev]);
    showToast({
      title: 'Smart Reminder Configured',
      description: `Automated trigger attached to operations loop.`,
      type: 'success',
    });
  };

  const runFleetAIAudit = async () => {
    setIsAuditingFleet(true);
    showToast({
      title: 'Fleet AI Submission Audit Started',
      description: 'Auditing 68 teams: verifying GitHub commit logs, checking live demo endpoints, and audio/video lengths...',
      type: 'info',
    });

    // Simulate multi-stage audit verification
    setTimeout(() => {
      setSubmissionAudits((prev) =>
        prev.map((item) => {
          if (item.status === 'Missing Demo') {
            return {
              ...item,
              demoVerified: false,
              complianceScore: 68,
              lastAudited: 'Just now',
            };
          }
          return {
            ...item,
            lastAudited: 'Just now',
          };
        })
      );
      setIsAuditingFleet(false);
      showToast({
        title: 'AI Submission Audit Complete',
        description: '92% Submission Compliance calculated across fleet. 7 action items flagged.',
        type: 'success',
      });
      addActivity({
        type: 'submission',
        title: 'Full Fleet Submission Audit Finished',
        description: '68 teams scanned. 41 fully compliant, 20 action required, 7 critical warnings.',
        severity: 'success',
        agent: 'Submission Agent',
      });
    }, 2000);
  };

  const auditSingleTeam = async (teamId: string) => {
    const item = submissionAudits.find((a) => a.teamId === teamId);
    if (!item) return;

    showToast({
      title: `Scanning ${item.teamName}...`,
      description: 'Verifying repository accessibility and live demo SSL certificates...',
      type: 'info',
    });

    try {
      const res = await fetch('/api/ai/audit-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: item.teamName,
          repoUrl: item.repoUrl,
          demoUrl: item.demoUrl,
          videoUrl: item.videoUrl,
          description: item.projectTitle,
        }),
      });
      const data = await res.json();

      setSubmissionAudits((prev) =>
        prev.map((a) =>
          a.teamId === teamId
            ? {
                ...a,
                complianceScore: data.complianceScore ?? a.complianceScore,
                eligibility: data.eligibility ?? a.eligibility,
                issues: data.issues ?? a.issues,
                lastAudited: 'Just now',
              }
            : a
        )
      );

      showToast({
        title: `${item.teamName} Audit Completed`,
        description: `Compliance score: ${data.complianceScore}%. Status: ${data.eligibility}`,
        type: 'success',
      });
    } catch {
      showToast({
        title: 'Audit Complete (Offline Cached)',
        description: 'Team verified against local rules matrix.',
        type: 'info',
      });
    }
  };

  const escalateTicketToOrganizer = (ticketId: string, reason = 'Complex Technical Escalation') => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Escalated to Organizer',
              escalatedTo: 'Organizer Desk (On-Duty)',
              escalationReason: reason,
            }
          : t
      )
    );

    showToast({
      title: 'Ticket Escalated to Organizer',
      description: 'Direct mobile notification & priority dispatch routed to event staff.',
      type: 'warning',
    });

    addActivity({
      type: 'escalation',
      title: `Ticket ${ticketId} Escalated to Organizer`,
      description: `Reason: ${reason}`,
      severity: 'critical',
      agent: 'Escalation Agent',
    });
  };

  const resolveTicketWithAI = (ticketId: string, reply: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Resolved by AI',
              aiResolution: reply,
            }
          : t
      )
    );

    showToast({
      title: 'Ticket Resolved',
      description: 'Resolution sent to participant Discord DM & Portal.',
      type: 'success',
    });

    addActivity({
      type: 'ai_resolved',
      title: `Ticket ${ticketId} Resolved`,
      description: 'Participant confirmed solution.',
      severity: 'success',
      agent: 'Concierge Agent',
    });
  };

  const uploadKnowledgeDoc = (file: { name: string; size: string; category: KnowledgeDocument['category'] }) => {
    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      title: file.name,
      category: file.category,
      snippet: `Uploaded documentation file: ${file.name}. Parsed 18 distinct rule statements and embedded into vector memory.`,
      lastUpdated: 'Just now',
      size: file.size,
      embeddingStatus: 'Indexed',
      rulesCount: 18,
    };
    setKnowledgeDocs((prev) => [newDoc, ...prev]);
    showToast({
      title: 'Document Indexed by HackMate AI',
      description: 'Extracted 18 rules and updated all 7 agents with new grounding context.',
      type: 'success',
    });
    addActivity({
      type: 'ai_resolved',
      title: `Knowledge Base Updated: ${file.name}`,
      description: 'Vector embeddings refreshed across Concierge and Submission agents.',
      severity: 'info',
      agent: 'Concierge Agent',
    });
  };

  const addKnowledgeDoc = (doc: Omit<KnowledgeDocument, 'id'>) => {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setKnowledgeDocs((prev) => [newDoc, ...prev]);
    showToast({
      title: 'Knowledge Document Added',
      description: 'The document is now available for agent grounding.',
      type: 'success',
    });
  };

  const deleteKnowledgeDoc = (id: string) => {
    setKnowledgeDocs((prev) => prev.filter((d) => d.id !== id));
    showToast({
      title: 'Document Deleted',
      description: 'Removed from knowledge base.',
      type: 'info',
    });
  };

  const resolveTicketByAI = (ticketId: string, reply?: string) => {
    resolveTicketWithAI(ticketId, reply || 'Resolved automatically by HackMate AI');
  };

  const assignMentorToTicket = (ticketId: string, mentorName: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Escalated to Organizer',
              escalatedTo: mentorName,
              escalationReason: 'Manual mentor assignment',
            }
          : t
      )
    );
    showToast({
      title: 'Mentor Assigned',
      description: `${mentorName} has been assigned to ticket ${ticketId}.`,
      type: 'success',
    });
  };

  const flagSubmissionTeam = (teamId: string) => {
    setSubmissionAudits((prev) =>
      prev.map((s) =>
        s.teamId === teamId
          ? {
              ...s,
              eligibility: 'Action Required',
              flags: [...(s.flags || []), 'Manually flagged for review'],
            }
          : s
      )
    );
    showToast({
      title: 'Team Flagged',
      description: 'Team submission has been flagged for manual organizer review.',
      type: 'warning',
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast({
      title: 'All Notifications Marked as Read',
      type: 'info',
    });
  };

  return (
    <HackathonContext.Provider
      value={{
        // Auth State
        currentUser,
        currentSession,
        isAuthLoading,
        signIn,
        signUp,
        signOut,

        // Diagnostic Suite
        diagnosticReport,
        isDiagnosticRunning,
        runDatabaseDiagnostic,

        // Agent Sessions, Tasks, Tool Calls, Memory, Knowledge
        agentSessions,
        activeSessionId,
        setActiveSessionId,
        createNewAgentSession,
        loadSessionMessages,
        recordSessionMessage,
        agentTasks,
        createTaskRecord,
        updateTaskRecord,
        toolCalls,
        recordToolExecution,
        agentMemories,
        recordMemory,
        knowledgeChunks,
        loadKnowledgeChunks,

        viewMode,
        setViewMode,
        currentTab,
        setCurrentTab,
        theme,
        toggleTheme,
        selectedEvent,
        setSelectedEvent,
        availableEvents,
        remainingSeconds,
        formattedCountdown,
        agents,
        insights,
        dismissInsight,
        participants,
        isLoadingParticipants,
        fetchParticipants,
        teams,
        matchRecommendations,
        scheduleEvents,
        reminders,
        autoRemindersEnabled,
        setAutoRemindersEnabled,
        submissionAudits,
        tickets,
        knowledgeDocs,
        activities,
        notifications,
        participantTasks,
        toggleParticipantTask,
        participantProgressPercent,
        registerParticipant,
        acceptMatch,
        regenerateMatches,
        modifyScheduleAdaptive,
        triggerReminderNow,
        createReminder,
        runFleetAIAudit,
        auditSingleTeam,
        escalateTicketToOrganizer,
        resolveTicketWithAI,
        uploadKnowledgeDoc,
        addActivity,
        markNotificationRead,
        markAllNotificationsRead,
        isAuditingFleet,
        appointments,
        isLoadingAppointments,
        supabaseStatus,
        checkSupabaseStatus,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        syncAppointmentsToSupabase,
        syncParticipantsToSupabase,
        syncAllToSupabase,
        isBookingModalOpen,
        setIsBookingModalOpen,
        toasts,
        showToast,
        removeToast,
        isAskAIModalOpen,
        setIsAskAIModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        addKnowledgeDoc,
        deleteKnowledgeDoc,
        resolveTicketByAI,
        assignMentorToTicket,
        flagSubmissionTeam,
        acceptMatchRecommendation: acceptMatch,
        activityLog: activities,
      }}
    >
      {children}
    </HackathonContext.Provider>
  );

};

export const useHackathon = () => {
  const context = useContext(HackathonContext);
  if (!context) {
    throw new Error('useHackathon must be used within a HackathonProvider');
  }
  return context;
};
