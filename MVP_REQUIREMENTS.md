# xecbot MVP Requirements (Week 1-8)

## MVP Scope: Web Dashboard + Chat Only
- **Messaging:** Web chat interface only (no IMSG/WhatsApp/Twilio yet — Phase 3+)
- **No multi-page:** Single dashboard MVP
- **Target:** OAuth login → AI chat for tasks/research

## Week 1-2: Auth + Core Chat
- [ ] Supabase project (cloud + local)
- [ ] Next.js 15 app scaffold (shadcn/ui, Tailwind)
- [ ] Google OAuth (Supabase Auth)
- [ ] Dashboard: Chat input + streaming responses
- [ ] Conversation history (Supabase PostgreSQL + RLS)
- [ ] AI: Claude Sonnet 4.5 primary + GPT-4o fallback (OpenClaw tools)
- [ ] Usage meter (tokens/messages)

## Week 3-4: Email + Calendar (Future)
[Deferred]

## Week 5-6: Accounting + External Messaging (Future)
[Deferred]

## Week 7-8: PWA + Polish
- [ ] PWA manifest + offline
- [ ] Billing stub (Stripe checkout)
- [ ] Error boundaries + loading states
- [ ] Vercel deploy-ready

**Success criteria:** User logs in → chats with AI → history persists → usage tracked.