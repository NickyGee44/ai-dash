import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeRedirectPath(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  return path;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = getSafeRedirectPath(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}${nextPath}`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback session exchange failed:", error.message);
      const errorParams = new URLSearchParams({
        auth_error: "session_exchange_failed",
      });
      return NextResponse.redirect(`${origin}/?${errorParams.toString()}`);
    }
  } catch (error) {
    console.error("Auth callback failed:", error);
    const errorParams = new URLSearchParams({
      auth_error: "callback_failed",
    });
    return NextResponse.redirect(`${origin}/?${errorParams.toString()}`);
  }

  return NextResponse.redirect(`${origin}${nextPath}`);
}
