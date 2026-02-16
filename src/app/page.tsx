import DashboardClient from "./dashboard-client";
import { createClient } from "@/lib/supabase/server";
import { getRequiredEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

function isAuthSessionMissingError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string" &&
    (error as { message: string }).message
      .toLowerCase()
      .includes("auth session missing")
  );
}

export default async function Home() {
  let isAuthenticated = false;
  let serverError: string | null = null;
  let supabaseUrl: string | null = null;
  let supabaseAnonKey: string | null = null;

  try {
    supabaseUrl = getRequiredEnv("SUPABASE_URL", ["NEXT_PUBLIC_SUPABASE_URL"]);
    supabaseAnonKey = getRequiredEnv("SUPABASE_ANON_KEY", [
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ]);

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError && !isAuthSessionMissingError(userError)) {
      throw userError;
    }

    isAuthenticated = Boolean(user);
  } catch (error) {
    serverError =
      error instanceof Error
        ? error.message
        : "Unable to initialize server session.";
    console.error("Failed to initialize Supabase session:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <DashboardClient
        isAuthenticated={isAuthenticated}
        serverError={serverError}
        supabaseUrl={supabaseUrl}
        supabaseAnonKey={supabaseAnonKey}
      />
    </div>
  );
}
