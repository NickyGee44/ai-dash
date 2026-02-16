import DashboardClient from "./dashboard-client";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  let isAuthenticated = false;
  let serverError: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
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
      />
    </div>
  );
}
