import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          if ("set" in cookieStore) {
            cookiesToSet.forEach(({ name, value, options }) => {
              (cookieStore as any).set({ name, value, ...options });
            });
          }
        },
      },
    }
  );
}
