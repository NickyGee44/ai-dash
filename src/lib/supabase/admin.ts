import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv } from "@/lib/env";

export const supabaseAdmin = createClient(
  getRequiredEnv("SUPABASE_URL", ["NEXT_PUBLIC_SUPABASE_URL"]),
  getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
