import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getServerTrackingEnv } from "@/lib/tracking/server-env";

type SupabaseAdminClient = SupabaseClient;

let supabaseAdminClient: SupabaseAdminClient | null = null;

export function getSupabaseAdminClient() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const config = getServerTrackingEnv();

  supabaseAdminClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}
