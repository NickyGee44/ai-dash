import "server-only";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/env";

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  if (cachedAdminClient) return cachedAdminClient;

  cachedAdminClient = createClient(
    getRequiredEnv("SUPABASE_URL", ["NEXT_PUBLIC_SUPABASE_URL"]),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return cachedAdminClient;
}
