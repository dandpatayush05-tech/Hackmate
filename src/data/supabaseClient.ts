import { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../lib/supabase';

export function getClientSupabase() {
  return supabase;
}

export { supabase, SUPABASE_PROJECT_ID, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY as SUPABASE_KEY };
export default supabase;
