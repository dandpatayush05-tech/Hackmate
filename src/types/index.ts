export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus =
  | 'Resolved by AI'
  | 'Attempted Resolution'
  | 'Escalated to Organizer'
  | 'Pending'
  | 'In Progress';
export type TicketCategory =
  | 'Wi-Fi & Hardware'
  | 'Rules & Eligibility'
  | 'Team & Teammates'
  | 'Mentors & Debugging'
  | 'API Keys & Cloud Credits'
  | 'Submission & Deliverables'
  | 'Food & Logistics'
  | 'Technical'
  | 'Schedule'
  | 'Team'
  | 'Submission'
  | 'Mentor'
  | 'Venue'
  | 'Rules';

export type SubmissionStatus =
  | 'Complete'
  | 'Missing Demo'
  | 'Missing Repository'
  | 'Missing Video'
  | 'Ineligible'
  | 'Under Review';
export type AgentStatus = 'ACTIVE' | 'PROCESSING' | 'STANDBY' | 'OPTIMIZING' | 'TRIGGERED';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  email: string;
  skills: string[];
  preferredDomain: string;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  availability: 'Full Weekend' | 'Partial / Remote' | 'On-Site 24h';
  teamPreference: 'Looking for Team' | 'In Team' | 'Solo Explorer';
  teamId?: string;
  discordHandle?: string;
  bio?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  track: string;
  members: TeamMember[];
  projectTitle: string;
  submissionStatus: SubmissionStatus;
  complianceScore: number;
  repoUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  lastActive: string;
  mentorAssigned?: string;
}

export interface MatchRecommendation {
  id: string;
  teamName: string;
  participants: Participant[];
  matchScore: number;
  reasons: string[];
  recommendedRoles: { [participantId: string]: string };
  accepted?: boolean;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  stage: string;
  category:
    | 'Ceremony'
    | 'Hacking'
    | 'Mentor'
    | 'Workshop'
    | 'Checkpoint'
    | 'Deadline'
    | 'Judging'
    | 'Results';
  status: 'Completed' | 'In Progress' | 'Upcoming';
  description: string;
  location: string;
  attendeesNotified?: number;
  originalTime?: string;
  isAdaptiveModified?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  trigger: string;
  audience: string;
  timing: string;
  channel: 'Discord Webhook' | 'Slack' | 'Email' | 'SMS' | 'In-App Toast';
  priority: Priority;
  isActive: boolean;
  lastSent?: string;
  sentCount: number;
}

export interface SubmissionAuditItem {
  id: string;
  teamId: string;
  teamName: string;
  projectTitle?: string;
  track: string;
  repoUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  githubUrl?: string;
  repoVerified?: boolean;
  demoVerified?: boolean;
  videoVerified?: boolean;
  readMeVerified?: boolean;
  eligibility: 'Complete' | 'Eligible' | 'Action Required' | 'Ineligible' | 'Pending';
  complianceScore: number;
  status: SubmissionStatus;
  lastAudited?: string;
  issues?: string[];
  flags?: string[];
}

export type SubmissionAudit = SubmissionAuditItem;

export interface SupportTicket {
  id: string;
  participantName: string;
  participantAvatar?: string;
  teamName?: string;
  query: string;
  category: TicketCategory | string;
  priority?: Priority;
  aiResolution?: string;
  aiResponse?: string;
  status: TicketStatus;
  timestamp: string;
  citedSource?: string;
  citation?: string;
  escalatedTo?: string;
  escalationReason?: string;
  organizerNotes?: string;
  aiConfidence?: number;
  assignedMentor?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category:
    | 'Event Rules'
    | 'FAQs'
    | 'Schedule'
    | 'Submission Guidelines'
    | 'Judging Criteria'
    | 'Venue Information'
    | 'Sponsor Information'
    | 'Mentor Information'
    | 'Rules & Policy'
    | 'Logistics & Venue'
    | 'Judging & Rubric'
    | 'APIs & Sponsor Docs'
    | 'FAQ'
    | string;
  snippet?: string;
  summary?: string;
  content?: string;
  lastUpdated: string;
  size: string;
  embeddingStatus?: 'Indexed' | 'Syncing' | 'Updated';
  vectorIndexed?: boolean;
  rulesCount?: number;
}

export interface ActivityEvent {
  id: string;
  type:
    | 'submission'
    | 'ai_resolved'
    | 'escalation'
    | 'reminder'
    | 'mentor_request'
    | 'team_match'
    | 'schedule_change';
  title: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  agent?: string;
}

export interface AIAgentInfo {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  throughput: string;
  successRate: string;
  latency: string;
  description: string;
  lastAction: string;
  iconName: string;
}

export interface OperationalInsight {
  id: string;
  type: 'positive' | 'warning' | 'urgent' | 'action';
  message: string;
  count?: number;
  timestamp: string;
  actionLabel?: string;
  actionType?: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'urgent' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export type AppointmentType =
  | 'Mentor 1-on-1 Session'
  | 'Technical Debugging Clinic'
  | 'Project Architecture Review'
  | 'Pitch & Demo Dry Run'
  | 'Organizer Office Hours'
  | 'Cloud & API Integration Help';

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

export interface BookingAppointment {
  id: string;
  participant_name: string;
  participant_email: string;
  team_name?: string;
  appointment_type: AppointmentType | string;
  mentor_or_host: string;
  scheduled_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  location_or_link: string;
  notes?: string;
  created_at?: string;
}

// ==========================================
// SUPABASE DATABASE MODELS
// ==========================================

export interface SupabaseUser {
  id: string;
  email: string;
  metadata?: {
    name?: string;
    role?: 'participant' | 'organizer' | 'mentor' | 'judge';
    avatar?: string;
    skills?: string[];
    [key: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}

export type SessionStatus = 'active' | 'paused' | 'completed' | 'failed' | 'archived';

export interface SupabaseAgentSession {
  id: string;
  user_id?: string | null;
  agent_id: string;
  session_title?: string | null;
  status: SessionStatus;
  model_name: string;
  system_prompt_snapshot?: string | null;
  session_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

export interface SupabaseSessionMessage {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  token_count?: number | null;
  tool_call_id?: string | null;
  raw_payload?: Record<string, any>;
  created_at?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

export interface SupabaseAgentTask {
  id: string;
  session_id: string;
  parent_task_id?: string | null;
  task_name: string;
  goal_description: string;
  status: TaskStatus;
  priority?: number;
  assigned_agent?: string | null;
  max_retries?: number;
  retry_count?: number;
  result_summary?: string | null;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseAgentTaskStep {
  id: string;
  task_id: string;
  step_number: number;
  thought_reasoning?: string | null;
  action_plan?: string | null;
  execution_status?: 'success' | 'warning' | 'failed' | string;
  step_duration_ms?: number | null;
  created_at?: string;
}

export interface SupabaseAgentToolCall {
  id: string;
  session_id: string;
  task_id?: string | null;
  step_id?: string | null;
  tool_name: string;
  input_args: Record<string, any>;
  output_result?: Record<string, any> | null;
  is_error?: boolean;
  error_details?: string | null;
  execution_time_ms?: number | null;
  created_at?: string;
}

export type MemoryType = 'short_term' | 'long_term' | 'episodic' | 'entity';

export interface SupabaseAgentMemory {
  id: string;
  user_id?: string | null;
  session_id?: string | null;
  memory_type: MemoryType;
  memory_key?: string | null;
  memory_value: string;
  importance_score?: number;
  access_count?: number;
  last_accessed_at?: string;
  expires_at?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface SupabaseKnowledgeChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  chunk_text: string;
  chunk_metadata?: Record<string, any>;
  created_at?: string;
}

export interface TableCheckResult {
  tableName: string;
  exists: boolean;
  canRead: boolean;
  canWrite: boolean;
  rowCount: number;
  error?: string | null;
  writeTestNote?: string;
}

export interface DatabaseTestReport {
  timestamp: string;
  connected: boolean;
  supabaseUrl: string;
  projectId: string;
  overallHealth: 'healthy' | 'partial' | 'error';
  tables: Record<string, TableCheckResult>;
  readWriteTestPassed: boolean;
  summary: string;
}

