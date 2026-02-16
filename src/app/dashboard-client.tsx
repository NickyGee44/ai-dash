"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardClient({
  isAuthenticated,
  serverError,
  supabaseUrl,
  supabaseAnonKey,
}: {
  isAuthenticated: boolean;
  serverError?: string | null;
  supabaseUrl?: string | null;
  supabaseAnonKey?: string | null;
}) {
  const { supabase, clientError } = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        supabase: null,
        clientError:
          "Missing Supabase client configuration (URL or anon key).",
      };
    }

    try {
      return {
        supabase: createClient({ supabaseUrl, supabaseAnonKey }),
        clientError: null,
      };
    } catch (error) {
      const clientError =
        error instanceof Error
          ? error.message
          : "Unable to initialize Supabase client.";
      console.error("Failed to initialize Supabase client:", error);
      return { supabase: null, clientError };
    }
  }, [supabaseAnonKey, supabaseUrl]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, `You: ${userMessage}`]);
    setStreaming(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response did not include a stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.startsWith("Assistant: ")) {
            next[next.length - 1] = `Assistant: ${assistant}`;
            return next;
          }
          return [...next, `Assistant: ${assistant}`];
        });
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Request failed";
      setError(message);
      setMessages((prev) => [...prev, `System: ${message}`]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">xecbot dashboard</h1>
          <p className="text-sm text-neutral-500">
            Supabase auth + OpenClaw streaming demo
          </p>
        </div>
        {isAuthenticated ? (
          <button
            onClick={handleSignOut}
            className="rounded bg-neutral-900 px-4 py-2 text-sm text-white"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Sign in with Google
          </button>
        )}
      </header>

      <section className="rounded border border-neutral-200 p-4">
        {(serverError || clientError) && (
          <p className="mb-3 text-sm text-red-600">
            Configuration issue: {serverError || clientError}
          </p>
        )}
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="space-y-2 text-sm">
          {messages.length === 0 && (
            <p className="text-neutral-500">No messages yet.</p>
          )}
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            isAuthenticated ? "Ask OpenClaw…" : "Sign in to start chatting"
          }
          disabled={!isAuthenticated || streaming || !supabase}
          className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!isAuthenticated || streaming || !supabase}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {streaming ? "Streaming…" : "Send"}
        </button>
      </form>
    </div>
  );
}
