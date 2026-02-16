"use client";

import { useMemo, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function DashboardClient({ session }: { session: Session | null }) {
  const supabase = useMemo(() => createClient(), []);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
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

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.body) {
      setStreaming(false);
      return;
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

    setStreaming(false);
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
        {session ? (
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
            session ? "Ask OpenClaw…" : "Sign in to start chatting"
          }
          disabled={!session || streaming}
          className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!session || streaming}
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {streaming ? "Streaming…" : "Send"}
        </button>
      </form>
    </div>
  );
}
