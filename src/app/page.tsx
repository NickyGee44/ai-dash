import DashboardClient from "./dashboard-client";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <DashboardClient session={session} />
    </div>
  );
}
