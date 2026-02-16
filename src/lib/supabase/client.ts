import { createBrowserClient } from "@supabase/ssr";
import { getRequiredEnv } from "@/lib/env";

type ClientConfig = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

export function createClient(config: ClientConfig = {}) {
  const supabaseUrl =
    config.supabaseUrl ??
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL", ["SUPABASE_URL"]);
  const supabaseAnonKey =
    config.supabaseAnonKey ??
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ["SUPABASE_ANON_KEY"]);

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
