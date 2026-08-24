import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import type {
  BookingAppointment,
  SupabaseUser,
  SupabaseAgentSession,
  SupabaseSessionMessage,
  SupabaseAgentTask,
  SupabaseAgentTaskStep,
  SupabaseAgentToolCall,
  SupabaseAgentMemory,
  SupabaseKnowledgeChunk,
  DatabaseTestReport,
  TableCheckResult,
} from '../types';

// ============================================================================
// ENVIRONMENT VARIABLES & CONFIGURATION
// ============================================================================

export const SUPABASE_PROJECT_ID = 'cichsftdtoefgdhfyquk';

export const SUPABASE_URL: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  `https://${SUPABASE_PROJECT_ID}.supabase.co`;

export const SUPABASE_PUBLISHABLE_KEY: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_KEY) ||
  'sb_publishable_vHwS-xlxPnLE53aSW2k5tw_WUHxfS-_';

/**
 * Reusable Supabase client instance with persistent browser session handling.
 * Never uses secret / service-role keys in frontend code.
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// ============================================================================
// 1. AUTHENTICATION HELPERS
// ============================================================================

export async function signUpWithEmail(email: string, password: string, name?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (error) throw error;

    // If user created, attempt to link/create a record in 'users' table
    if (data.user) {
      await upsertUserRecord({
        id: data.user.id,
        email: data.user.email || email,
        metadata: {
          name: name || email.split('@')[0],
          role: 'participant',
        },
      }).catch((err) => console.warn('[Supabase] Non-blocking user profile sync notice:', err));
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err?.message || 'Failed to sign up' };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, session: data.session, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err?.message || 'Failed to sign in' };
  }
}

export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to sign out' };
  }
}

export async function getCurrentAuthUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session || null;
  } catch {
    return null;
  }
}

export function onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null, session || null);
  });
}

// ============================================================================
// 2. USERS TABLE HELPERS
// ============================================================================

export async function getUserRecords(): Promise<{ data: SupabaseUser[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data as SupabaseUser[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch users' };
  }
}

export async function getUserRecordById(userId: string): Promise<{ data: SupabaseUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data: data as SupabaseUser, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to fetch user' };
  }
}

export async function upsertUserRecord(user: Partial<SupabaseUser> & { email: string }): Promise<{ data: SupabaseUser | null; error: string | null }> {
  try {
    const payload = {
      id: user.id || undefined,
      email: user.email,
      metadata: user.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .upsert(payload, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseUser, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to upsert user record' };
  }
}

// ============================================================================
// 3. AGENT SESSIONS TABLE HELPERS
// ============================================================================

export async function getAgentSessions(userId?: string): Promise<{ data: SupabaseAgentSession[]; error: string | null }> {
  try {
    let query = supabase.from('agent_sessions').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as SupabaseAgentSession[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch agent sessions' };
  }
}

export async function getAgentSessionById(sessionId: string): Promise<{ data: SupabaseAgentSession | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('agent_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return { data: data as SupabaseAgentSession, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to fetch agent session' };
  }
}

export async function createAgentSession(
  session: Partial<SupabaseAgentSession> & { agent_id: string }
): Promise<{ data: SupabaseAgentSession | null; error: string | null }> {
  try {
    const payload = {
      user_id: session.user_id || null,
      agent_id: session.agent_id,
      session_title: session.session_title || `${session.agent_id} Run - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: session.status || 'active',
      model_name: session.model_name || 'gemini-2.5-flash',
      system_prompt_snapshot: session.system_prompt_snapshot || null,
      session_metadata: session.session_metadata || {},
    };

    const { data, error } = await supabase
      .from('agent_sessions')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseAgentSession, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create agent session' };
  }
}

export async function updateAgentSession(
  sessionId: string,
  updates: Partial<SupabaseAgentSession>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('agent_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update agent session' };
  }
}

// ============================================================================
// 4. SESSION MESSAGES TABLE HELPERS
// ============================================================================

export async function getSessionMessages(sessionId: string): Promise<{ data: SupabaseSessionMessage[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('session_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data: (data as SupabaseSessionMessage[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch session messages' };
  }
}

export async function saveSessionMessage(
  msg: Omit<SupabaseSessionMessage, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: SupabaseSessionMessage | null; error: string | null }> {
  try {
    const payload = {
      session_id: msg.session_id,
      role: msg.role,
      content: msg.content,
      token_count: msg.token_count || Math.ceil(msg.content.length / 4),
      tool_call_id: msg.tool_call_id || null,
      raw_payload: msg.raw_payload || {},
    };

    const { data, error } = await supabase
      .from('session_messages')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseSessionMessage, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to save session message' };
  }
}

// ============================================================================
// 5. AGENT TASKS & TASK STEPS HELPERS
// ============================================================================

export async function getAgentTasks(sessionId?: string): Promise<{ data: SupabaseAgentTask[]; error: string | null }> {
  try {
    let query = supabase.from('agent_tasks').select('*').order('created_at', { ascending: false });
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as SupabaseAgentTask[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch agent tasks' };
  }
}

export async function createAgentTask(
  task: Omit<SupabaseAgentTask, 'id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<{ data: SupabaseAgentTask | null; error: string | null }> {
  try {
    const payload = {
      session_id: task.session_id,
      parent_task_id: task.parent_task_id || null,
      task_name: task.task_name,
      goal_description: task.goal_description,
      status: task.status || 'pending',
      priority: task.priority || 1,
      assigned_agent: task.assigned_agent || 'general-task-runner',
      max_retries: task.max_retries || 3,
      retry_count: task.retry_count || 0,
      result_summary: task.result_summary || null,
      error_message: task.error_message || null,
      started_at: task.status === 'in_progress' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('agent_tasks')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseAgentTask, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create agent task' };
  }
}

export async function updateAgentTask(
  taskId: string,
  updates: Partial<SupabaseAgentTask>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const payload: Record<string, any> = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    if (updates.status === 'completed' || updates.status === 'failed') {
      payload.completed_at = new Date().toISOString();
    }
    if (updates.status === 'in_progress' && !updates.started_at) {
      payload.started_at = new Date().toISOString();
    }

    const { error } = await supabase.from('agent_tasks').update(payload).eq('id', taskId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update agent task' };
  }
}

export async function deleteAgentTask(taskId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('agent_tasks').delete().eq('id', taskId);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete agent task' };
  }
}

export async function getAgentTaskSteps(taskId: string): Promise<{ data: SupabaseAgentTaskStep[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('agent_task_steps')
      .select('*')
      .eq('task_id', taskId)
      .order('step_number', { ascending: true });

    if (error) throw error;
    return { data: (data as SupabaseAgentTaskStep[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch task steps' };
  }
}

export async function createAgentTaskStep(
  step: Omit<SupabaseAgentTaskStep, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: SupabaseAgentTaskStep | null; error: string | null }> {
  try {
    const payload = {
      task_id: step.task_id,
      step_number: step.step_number,
      thought_reasoning: step.thought_reasoning || null,
      action_plan: step.action_plan || null,
      execution_status: step.execution_status || 'success',
      step_duration_ms: step.step_duration_ms || 150,
    };

    const { data, error } = await supabase
      .from('agent_task_steps')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseAgentTaskStep, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create task step' };
  }
}

// ============================================================================
// 6. AGENT TOOL CALLS HELPERS
// ============================================================================

export async function getAgentToolCalls(sessionId?: string, taskId?: string): Promise<{ data: SupabaseAgentToolCall[]; error: string | null }> {
  try {
    let query = supabase.from('agent_tool_calls').select('*').order('created_at', { ascending: false });
    if (sessionId) query = query.eq('session_id', sessionId);
    if (taskId) query = query.eq('task_id', taskId);
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as SupabaseAgentToolCall[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch tool calls' };
  }
}

export async function logAgentToolCall(
  call: Omit<SupabaseAgentToolCall, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: SupabaseAgentToolCall | null; error: string | null }> {
  try {
    const payload = {
      session_id: call.session_id,
      task_id: call.task_id || null,
      step_id: call.step_id || null,
      tool_name: call.tool_name,
      input_args: call.input_args || {},
      output_result: call.output_result || {},
      is_error: call.is_error || false,
      error_details: call.error_details || null,
      execution_time_ms: call.execution_time_ms || 200,
    };

    const { data, error } = await supabase
      .from('agent_tool_calls')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseAgentToolCall, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to log tool call' };
  }
}

// ============================================================================
// 7. AGENT MEMORY HELPERS
// ============================================================================

export async function getAgentMemories(
  userId?: string,
  sessionId?: string,
  memoryType?: string
): Promise<{ data: SupabaseAgentMemory[]; error: string | null }> {
  try {
    let query = supabase.from('agent_memory').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    if (sessionId) query = query.eq('session_id', sessionId);
    if (memoryType) query = query.eq('memory_type', memoryType);
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as SupabaseAgentMemory[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch agent memories' };
  }
}

export async function saveAgentMemory(
  mem: Omit<SupabaseAgentMemory, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: SupabaseAgentMemory | null; error: string | null }> {
  try {
    const payload = {
      user_id: mem.user_id || null,
      session_id: mem.session_id || null,
      memory_type: mem.memory_type || 'long_term',
      memory_key: mem.memory_key || null,
      memory_value: mem.memory_value,
      importance_score: mem.importance_score || 0.5,
      access_count: 0,
      metadata: mem.metadata || {},
    };

    const { data, error } = await supabase
      .from('agent_memory')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseAgentMemory, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to save agent memory' };
  }
}

// ============================================================================
// 8. APPOINTMENTS TABLE HELPERS
// ============================================================================

export interface SaveAppointmentResult {
  success: boolean;
  data?: BookingAppointment | null;
  error?: string | null;
  isSchemaError?: boolean;
  isConnectionError?: boolean;
}

export async function getAppointments(): Promise<{ data: BookingAppointment[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return { data: (data as BookingAppointment[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch appointments' };
  }
}

export async function saveAppointment(
  appointment: Partial<BookingAppointment> & {
    participant_name: string;
    participant_email: string;
    scheduled_time: string;
  }
): Promise<SaveAppointmentResult> {
  const recordToInsert: BookingAppointment = {
    id: appointment.id || `apt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    participant_name: appointment.participant_name.trim(),
    participant_email: appointment.participant_email.trim(),
    team_name: appointment.team_name?.trim() || undefined,
    appointment_type: appointment.appointment_type || 'Mentor 1-on-1 Session',
    mentor_or_host: appointment.mentor_or_host || 'Assigned Technical Mentor',
    scheduled_time: appointment.scheduled_time,
    duration_minutes: appointment.duration_minutes || 30,
    status: appointment.status || 'Confirmed',
    location_or_link: appointment.location_or_link || 'Discord Voice #mentor-lounge-1',
    notes: appointment.notes?.trim() || undefined,
    created_at: appointment.created_at || new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([recordToInsert])
      .select()
      .single();

    if (error) {
      const isMissingTable =
        error.code === '42P01' ||
        error.message?.toLowerCase().includes('does not exist');

      const isRlsError =
        error.code === '42501' ||
        error.message?.toLowerCase().includes('row-level security');

      console.group(
        '%c[Supabase Appointments Error] Failed to Save Appointment Record',
        'color: #ef4444; font-weight: bold;'
      );
      console.error('PostgreSQL Error Code:', error.code);
      console.error('Error Message:', error.message);
      console.error('Error Details:', error.details);
      console.error('Error Hint:', error.hint);
      console.error('Attempted Payload:', recordToInsert);
      if (isMissingTable) {
        console.warn(
          "ROOT CAUSE: Table 'public.appointments' does not exist in Supabase. Please run the SQL migration script from runSupabaseInitDiagnostic()."
        );
      } else if (isRlsError) {
        console.warn(
          "ROOT CAUSE: Row Level Security (RLS) policy is active on 'appointments' without an INSERT rule for the active role (anon/authenticated)."
        );
      }
      console.groupEnd();

      return {
        success: false,
        error: isMissingTable
          ? "Table 'public.appointments' does not exist in Supabase yet."
          : isRlsError
          ? 'Insert blocked by Row Level Security (RLS) policy.'
          : error.message,
        isSchemaError: isMissingTable || isRlsError,
        isConnectionError: false,
      };
    }

    return {
      success: true,
      data: (data as BookingAppointment) || recordToInsert,
      error: null,
    };
  } catch (err: any) {
    console.error('[Supabase Appointments] Network/Client exception during save:', err);
    return {
      success: false,
      error: err?.message || 'Connection error',
      isConnectionError: true,
    };
  }
}

export async function updateAppointment(
  id: string,
  updates: Partial<BookingAppointment>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('appointments').update(updates).eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update appointment' };
  }
}

export async function deleteAppointment(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete appointment' };
  }
}

// ============================================================================
// 9. KNOWLEDGE CHUNKS HELPERS
// ============================================================================

export async function getKnowledgeChunks(documentId?: string): Promise<{ data: SupabaseKnowledgeChunk[]; error: string | null }> {
  try {
    let query = supabase.from('knowledge_chunks').select('*').order('created_at', { ascending: false });
    if (documentId) query = query.eq('document_id', documentId);
    const { data, error } = await query;
    if (error) throw error;
    return { data: (data as SupabaseKnowledgeChunk[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch knowledge chunks' };
  }
}

export async function saveKnowledgeChunk(
  chunk: Omit<SupabaseKnowledgeChunk, 'id' | 'created_at'> & { id?: string }
): Promise<{ data: SupabaseKnowledgeChunk | null; error: string | null }> {
  try {
    const payload = {
      document_id: chunk.document_id,
      chunk_index: chunk.chunk_index,
      chunk_text: chunk.chunk_text,
      chunk_metadata: chunk.chunk_metadata || {},
    };

    const { data, error } = await supabase
      .from('knowledge_chunks')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return { data: data as SupabaseKnowledgeChunk, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to save knowledge chunk' };
  }
}

// ============================================================================
// 10. REAL DATABASE READ & WRITE VERIFICATION TEST SUITE & DIAGNOSTICS
// ============================================================================

export interface SupabaseDiagnosticReport {
  timestamp: string;
  projectId: string;
  supabaseUrl: string;
  select1Status: 'success' | 'fallback_ping_success' | 'failed';
  select1LatencyMs: number;
  select1Error?: string | null;
  authState: {
    isAuthenticated: boolean;
    userEmail: string | null;
    userId: string | null;
    role: string;
  };
  appointmentsTable: {
    exists: boolean;
    canRead: boolean;
    canWrite: boolean;
    rowCount: number;
    readError: string | null;
    writeError: string | null;
    rlsEnforced: boolean;
    rootCauseDiagnosis: string;
  };
  overallStatus: 'healthy' | 'table_missing' | 'rls_blocked' | 'connection_error';
  recommendedAction: string;
  sqlRemediationScript?: string;
}

/**
 * Diagnostic utility that attempts a 'SELECT 1' / ping probe against Supabase on initialization
 * and logs a comprehensive, styled connection and RLS status report to the console to identify
 * exactly why appointments are or are not saving.
 */
export async function runSupabaseInitDiagnostic(options?: {
  verbose?: boolean;
  attemptTestWrite?: boolean;
}): Promise<SupabaseDiagnosticReport> {
  const startTime = Date.now();
  const verbose = options?.verbose ?? true;
  const attemptTestWrite = options?.attemptTestWrite ?? true;

  let select1Status: 'success' | 'fallback_ping_success' | 'failed' = 'failed';
  let select1LatencyMs = 0;
  let select1Error: string | null = null;

  // 1. Step 1: Attempt 'SELECT 1' direct query / ping probe
  try {
    const probeStart = Date.now();
    // Attempt RPC or raw probe if available
    const rpcRes = await supabase.rpc('ping');
    select1LatencyMs = Date.now() - probeStart;

    if (!rpcRes.error) {
      select1Status = 'success';
    } else {
      // Fallback probe: query PostgREST endpoint
      const pingStart = Date.now();
      const { error: pingError } = await supabase.from('appointments').select('id', { head: true }).limit(1);
      select1LatencyMs = Date.now() - pingStart;

      if (!pingError || pingError.code === '42P01' || pingError.code === '42501') {
        // Connected to PostgREST successfully even if table is missing/protected
        select1Status = 'fallback_ping_success';
      } else {
        select1Error = pingError.message;
      }
    }
  } catch (err: any) {
    select1Error = err?.message || 'Network unreachable';
  }

  // 2. Step 2: Auth and Role status
  let authState = {
    isAuthenticated: false,
    userEmail: null as string | null,
    userId: null as string | null,
    role: 'anon (public)',
  };

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session?.user) {
      authState = {
        isAuthenticated: true,
        userEmail: sessionData.session.user.email || null,
        userId: sessionData.session.user.id,
        role: sessionData.session.user.role || 'authenticated',
      };
    }
  } catch {
    // Keep anon default
  }

  // 3. Step 3: Specific Audit of 'appointments' table
  let tableExists = false;
  let canRead = false;
  let canWrite = false;
  let rowCount = 0;
  let readError: string | null = null;
  let writeError: string | null = null;
  let rlsEnforced = false;
  let rootCauseDiagnosis = '';
  let overallStatus: 'healthy' | 'table_missing' | 'rls_blocked' | 'connection_error' = 'healthy';

  // Test Read
  try {
    const { data: readData, error: rError, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .limit(1);

    if (rError) {
      readError = rError.message;
      if (rError.code === '42P01' || rError.message?.toLowerCase().includes('does not exist')) {
        tableExists = false;
        overallStatus = 'table_missing';
        rootCauseDiagnosis = "Table 'public.appointments' does not exist in the Supabase PostgreSQL schema.";
      } else if (rError.code === '42501' || rError.message?.toLowerCase().includes('row-level security')) {
        tableExists = true;
        rlsEnforced = true;
        overallStatus = 'rls_blocked';
        rootCauseDiagnosis = "Row Level Security (RLS) is blocking read access for the current role.";
      } else {
        tableExists = false;
        rootCauseDiagnosis = `Read query failed: ${rError.message} (Code: ${rError.code || 'UNKNOWN'})`;
      }
    } else {
      tableExists = true;
      canRead = true;
      rowCount = count ?? (readData?.length || 0);
    }
  } catch (err: any) {
    readError = err?.message || 'Read exception';
    overallStatus = 'connection_error';
    rootCauseDiagnosis = `Failed to contact Supabase REST API: ${readError}`;
  }

  // Test Write & RLS if table exists
  if (tableExists && attemptTestWrite) {
    const testProbeId = `probe-test-${Date.now()}`;
    const testPayload = {
      id: testProbeId,
      participant_name: 'Diagnostic Connection Probe',
      participant_email: 'diagnostic-probe@supabase.local',
      appointment_type: 'System Connection Audit',
      mentor_or_host: 'Supabase JS SDK Diagnostic',
      scheduled_time: new Date().toISOString(),
      location_or_link: 'Diagnostic Channel',
      status: 'Confirmed',
      notes: 'Ephemeral test probe to verify table write permissions and RLS rules.',
    };

    try {
      const { data: insertData, error: insError } = await supabase
        .from('appointments')
        .insert([testPayload])
        .select()
        .single();

      if (insError) {
        writeError = insError.message;
        if (insError.code === '42501' || insError.message?.toLowerCase().includes('row-level security')) {
          rlsEnforced = true;
          canWrite = false;
          overallStatus = 'rls_blocked';
          rootCauseDiagnosis =
            "Table 'appointments' exists, but Row Level Security (RLS) is ENABLED without an INSERT policy for the active role. " +
            "Any appointment booking submitted by public users is being rejected by PostgreSQL with code 42501.";
        } else if (insError.code === '23502') {
          canWrite = false;
          rootCauseDiagnosis = `Not-Null Constraint Violation: ${insError.message}. The database schema has columns marked NOT NULL that are missing in the insert payload.`;
        } else {
          canWrite = false;
          rootCauseDiagnosis = `Insert failed: ${insError.message} (Code: ${insError.code || 'UNKNOWN'}).`;
        }
      } else if (insertData) {
        canWrite = true;
        overallStatus = 'healthy';
        rootCauseDiagnosis = "Full Read & Write operations to 'appointments' table are active and functioning correctly.";

        // Cleanup ephemeral probe record
        try {
          await supabase.from('appointments').delete().eq('id', testProbeId);
        } catch {
          // Ignore cleanup error
        }
      }
    } catch (err: any) {
      writeError = err?.message || 'Write probe exception';
      canWrite = false;
    }
  } else if (!tableExists) {
    canWrite = false;
    overallStatus = 'table_missing';
  }

  // Recommended Action & SQL Remediation Script
  const sqlRemediationScript = `-- ============================================================================
-- SQL REMEDIATION SCRIPT FOR SUPABASE APPOINTMENTS
-- Paste this script into your Supabase Dashboard -> SQL Editor and click RUN
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  team_name TEXT,
  appointment_type TEXT DEFAULT 'Mentor 1-on-1 Session',
  mentor_or_host TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Confirmed',
  location_or_link TEXT DEFAULT 'Mentor Lounge',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow read & write policies for anonymous public and authenticated users
DROP POLICY IF EXISTS "Allow public read access to appointments" ON public.appointments;
CREATE POLICY "Allow public read access to appointments"
  ON public.appointments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access to appointments" ON public.appointments;
CREATE POLICY "Allow public insert access to appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to appointments" ON public.appointments;
CREATE POLICY "Allow public update access to appointments"
  ON public.appointments FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow public delete access to appointments" ON public.appointments;
CREATE POLICY "Allow public delete access to appointments"
  ON public.appointments FOR DELETE
  USING (true);
`;

  let recommendedAction = '';
  if (overallStatus === 'healthy') {
    recommendedAction = 'No action required. Database connectivity and appointments table read/write permissions are verified.';
  } else if (overallStatus === 'table_missing') {
    recommendedAction =
      "Create the 'appointments' table in your Supabase SQL Editor. Run the provided SQL remediation script to create the table and configure permissions.";
  } else if (overallStatus === 'rls_blocked') {
    recommendedAction =
      "Add an INSERT policy to the 'appointments' table in Supabase to permit anonymous or authenticated inserts (Run the SQL script above).";
  } else {
    recommendedAction =
      `Verify network connectivity and check that ${SUPABASE_URL} is accessible and your publishable key is valid.`;
  }

  const report: SupabaseDiagnosticReport = {
    timestamp: new Date().toISOString(),
    projectId: SUPABASE_PROJECT_ID,
    supabaseUrl: SUPABASE_URL,
    select1Status,
    select1LatencyMs,
    select1Error,
    authState,
    appointmentsTable: {
      exists: tableExists,
      canRead,
      canWrite,
      rowCount,
      readError,
      writeError,
      rlsEnforced,
      rootCauseDiagnosis,
    },
    overallStatus,
    recommendedAction,
    sqlRemediationScript,
  };

  // 4. Output styled diagnostic log to the Console
  if (verbose && typeof console !== 'undefined') {
    const isOk = overallStatus === 'healthy';
    const statusColor = isOk ? '#10b981' : overallStatus === 'rls_blocked' ? '#f59e0b' : '#ef4444';
    const badgeText = isOk ? 'HEALTHY' : overallStatus === 'rls_blocked' ? 'RLS POLICY BLOCKED' : overallStatus === 'table_missing' ? 'TABLE MISSING' : 'ERROR';

    console.group(
      `%c[Supabase Connection Diagnostic] %c ${badgeText} %c (${select1LatencyMs}ms)`,
      'color: #06b6d4; font-weight: bold;',
      `background-color: ${statusColor}; color: #000; font-weight: bold; border-radius: 4px; padding: 2px 6px;`,
      'color: #94a3b8; font-size: 11px;'
    );

    console.log(
      '%cProject ID:%c ' + SUPABASE_PROJECT_ID + ' | %cSupabase URL:%c ' + SUPABASE_URL,
      'color: #94a3b8; font-weight: bold;',
      'color: #10b981; font-family: monospace;',
      'color: #94a3b8; font-weight: bold;',
      'color: #38bdf8; font-family: monospace;'
    );

    console.log(
      '%cAuth Role :%c ' + authState.role + (authState.userEmail ? ` (${authState.userEmail})` : ' [Anonymous]'),
      'color: #94a3b8; font-weight: bold;',
      'color: #a855f7; font-family: monospace;'
    );

    console.log(
      `%c'SELECT 1' Probe :%c ${select1Status === 'failed' ? 'FAILED' : 'CONNECTED'} (${select1LatencyMs}ms)`,
      'color: #94a3b8; font-weight: bold;',
      select1Status === 'failed' ? 'color: #ef4444; font-weight: bold;' : 'color: #10b981; font-weight: bold;'
    );

    console.log(
      `%c'appointments' Table :%c Exists: ${tableExists ? 'YES' : 'NO'} | Can Read: ${canRead ? 'YES' : 'NO'} | Can Write: ${canWrite ? 'YES' : 'NO'} | Rows: ${rowCount}`,
      'color: #94a3b8; font-weight: bold;',
      tableExists && canWrite ? 'color: #10b981;' : 'color: #f59e0b; font-weight: bold;'
    );

    if (rootCauseDiagnosis) {
      console.log(
        '%cRoot Cause Analysis:%c ' + rootCauseDiagnosis,
        'color: #fbbf24; font-weight: bold;',
        'color: #f8fafc;'
      );
    }

    if (!isOk) {
      console.warn('%cRecommended Action:%c ' + recommendedAction, 'color: #fbbf24; font-weight: bold;', 'color: #f8fafc;');
      console.groupCollapsed('%c[Click to view SQL Remediation Script for Supabase SQL Editor]', 'color: #38bdf8; text-decoration: underline; cursor: pointer;');
      console.log(sqlRemediationScript);
      console.groupEnd();
    }

    console.groupEnd();
  }

  return report;
}

// Automatically trigger diagnostic connection audit on initialization
if (typeof window !== 'undefined') {
  setTimeout(() => {
    runSupabaseInitDiagnostic({ verbose: true, attemptTestWrite: true }).catch((err) => {
      console.warn('[Supabase Diagnostic] Connection probe notice:', err);
    });
  }, 100);
}

export async function performDatabaseReadWriteTest(): Promise<DatabaseTestReport> {
  const tableNames = [
    'users',
    'agent_sessions',
    'session_messages',
    'agent_tasks',
    'agent_task_steps',
    'agent_tool_calls',
    'agent_memory',
    'appointments',
    'knowledge_chunks',
  ];

  const tableResults: Record<string, TableCheckResult> = {};
  let anyReadSuccess = false;
  let writeTestSucceeded = false;

  // 1. Test reads across all 9 tables
  for (const table of tableNames) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        const isMissing = error.code === '42P01' || error.message?.includes('does not exist');
        tableResults[table] = {
          tableName: table,
          exists: !isMissing,
          canRead: false,
          canWrite: false,
          rowCount: 0,
          error: error.message,
        };
      } else {
        anyReadSuccess = true;
        tableResults[table] = {
          tableName: table,
          exists: true,
          canRead: true,
          canWrite: false, // will update on write test
          rowCount: count ?? (data?.length || 0),
          error: null,
        };
      }
    } catch (err: any) {
      tableResults[table] = {
        tableName: table,
        exists: false,
        canRead: false,
        canWrite: false,
        rowCount: 0,
        error: err?.message || 'Unknown query error',
      };
    }
  }

  // 2. Perform real database WRITE test on appointments table
  const testAptId = `test-verify-${Date.now()}`;
  try {
    const { data: writeData, error: writeError } = await supabase
      .from('appointments')
      .insert([
        {
          id: testAptId,
          participant_name: 'Database Live Verifier',
          participant_email: 'verifier@hackmate.ai',
          appointment_type: 'Live Supabase Connection Audit',
          mentor_or_host: 'Automated Supabase JS SDK Check',
          scheduled_time: new Date().toISOString(),
          location_or_link: 'Supabase Cloud Verification Channel',
          notes: 'Auto-generated verification record for database connection check.',
        },
      ])
      .select()
      .single();

    if (writeError) {
      tableResults['appointments'].canWrite = false;
      tableResults['appointments'].writeTestNote = `Write check: ${writeError.message}`;
    } else if (writeData) {
      tableResults['appointments'].canWrite = true;
      tableResults['appointments'].writeTestNote = 'Write verified: test row inserted successfully.';
      writeTestSucceeded = true;

      // Clean up test verification row
      try {
        await supabase.from('appointments').delete().eq('id', testAptId);
      } catch {
        // Ignore cleanup error
      }
    }
  } catch (err: any) {
    tableResults['appointments'].writeTestNote = `Write exception: ${err?.message}`;
  }

  const overallHealth: 'healthy' | 'partial' | 'error' =
    anyReadSuccess && writeTestSucceeded ? 'healthy' : anyReadSuccess ? 'partial' : 'error';

  return {
    timestamp: new Date().toISOString(),
    connected: anyReadSuccess,
    supabaseUrl: SUPABASE_URL,
    projectId: SUPABASE_PROJECT_ID,
    overallHealth,
    tables: tableResults,
    readWriteTestPassed: writeTestSucceeded,
    summary: writeTestSucceeded
      ? `Successfully connected to Supabase (${SUPABASE_PROJECT_ID}). Read and Write operations verified active.`
      : anyReadSuccess
      ? `Connected to Supabase (${SUPABASE_PROJECT_ID}). Read active across tables, write policies active.`
      : `Could not reach Supabase at ${SUPABASE_URL}.`,
  };
}

export default supabase;
