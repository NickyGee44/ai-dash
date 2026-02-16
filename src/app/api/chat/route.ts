import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 20;
const UNKNOWN_IP = "unknown";

function isValidIpv4(value: string) {
  const segments = value.split(".");
  if (segments.length !== 4) return false;
  return segments.every((segment) => {
    if (!/^\d{1,3}$/.test(segment)) return false;
    const parsed = Number(segment);
    return parsed >= 0 && parsed <= 255;
  });
}

function isValidIpv6(value: string) {
  if (!value.includes(":")) return false;
  return /^[a-fA-F0-9:]+$/.test(value);
}

function firstHeaderIp(headerValue: string | null) {
  if (!headerValue) return null;
  const candidate = headerValue.split(",")[0]?.trim();
  if (!candidate || candidate.length > 45) return null;
  if (isValidIpv4(candidate) || isValidIpv6(candidate)) return candidate;
  return null;
}

function getClientIp(request: Request) {
  const candidates = [
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for"),
  ];

  for (const header of candidates) {
    const parsed = firstHeaderIp(header);
    if (parsed) return parsed;
  }

  return UNKNOWN_IP;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof body.message !== "string"
  ) {
    return NextResponse.json(
      { error: "Expected payload: { message: string }" },
      { status: 400 }
    );
  }

  const message = body.message.trim();
  if (!message || message.length > 4000) {
    return NextResponse.json(
      { error: "Message must be between 1 and 4000 characters" },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(request);
  let allowed: boolean | null = null;
  let rateLimitError: unknown = null;

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const result = await supabaseAdmin.rpc("consume_chat_rate_limit", {
      p_user_id: user.id,
      p_ip: clientIp,
      p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      p_max_requests: RATE_LIMIT_MAX_REQUESTS,
    });
    allowed = result.data;
    rateLimitError = result.error;
  } catch (error) {
    rateLimitError = error;
  }

  if (rateLimitError) {
    console.error("Rate limit check failed:", rateLimitError);
    return NextResponse.json(
      { error: "Rate limit service unavailable" },
      { status: 503 }
    );
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const chunks = [
        "Connecting to OpenClaw tools...\n",
        `Received: ${message}\n`,
        "Streaming placeholder response.\n",
      ];

      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
