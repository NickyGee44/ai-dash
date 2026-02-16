import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getRequiredEnv } from "@/lib/env";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function canSetCookies(
  cookieStore: CookieStore
): cookieStore is CookieStore & {
  set: (cookie: { name: string; value: string } & Record<string, unknown>) => void;
} {
  return (
    "set" in cookieStore &&
    typeof (cookieStore as { set?: unknown }).set === "function"
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getRequiredEnv("SUPABASE_URL", ["NEXT_PUBLIC_SUPABASE_URL"]),
    getRequiredEnv("SUPABASE_ANON_KEY", ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          if (canSetCookies(cookieStore)) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          }
        },
      },
    }
  );
}
