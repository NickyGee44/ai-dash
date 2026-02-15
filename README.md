# AI Assistant Dashboard

> A secure, OAuth-based SaaS platform that gives non-technical users instant access to powerful AI agents without managing API keys or infrastructure.

**Status:** 🚧 Planning & Architecture Phase  
**Target MVP:** 4-6 weeks  
**Stack:** Next.js 15 + Supabase + Claude/GPT  

---

## Vision

Democratize AI agent access. Users sign up with Google/GitHub → get a personal AI assistant for daily tasks, finances, research, and automation. No technical setup required.

**Full vision document:** [PROJECT_VISION.md](./PROJECT_VISION.md)

---

## Quick Start (Coming Soon)

```bash
# Clone repo
git clone https://github.com/NickyGee44/ai-dash.git
cd ai-dash

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase + AI provider keys

# Run dev server
npm run dev
```

---

## Architecture (Draft)

### Frontend
- **Next.js 15** (App Router, React Server Components)
- **TypeScript** + **Tailwind CSS** + **shadcn/ui**
- Mobile-responsive, PWA-ready

### Backend
- **Supabase** (Auth, PostgreSQL, Realtime, Edge Functions)
- **Row-Level Security (RLS)** for user data isolation
- **Stripe** for billing

### AI Layer
- **Option A:** Fork/adapt ClawdBot for multi-tenant use
- **Option B:** Custom agent framework (LangChain/LangGraph)
- **Providers:** Claude (Sonnet 4.5), GPT-4o, Gemini (fallback)

---

## Security Principles

1. **OAuth-only authentication** (Google, GitHub, Microsoft)
2. **Platform-managed API keys** (users never see them)
3. **Encrypted conversation history**
4. **RLS for data isolation**
5. **Prompt injection defense**
6. **Audit logging** for all agent actions
7. **GDPR compliance** (data export, deletion)

---

## Roadmap

### Phase 1: MVP (4-6 weeks)
- [ ] User auth (OAuth with Supabase)
- [ ] Chat interface (web-based AI assistant)
- [ ] Conversation history (saved, searchable)
- [ ] Usage dashboard (tokens, cost transparency)
- [ ] Basic tools (web search, calculator)
- [ ] Billing integration (Stripe)

### Phase 2: Growth Features (Weeks 7-12)
- [ ] Mobile app (PWA or React Native)
- [ ] Voice input/output
- [ ] Integrations (Calendar, Gmail, Notion)
- [ ] Team workspaces
- [ ] API access for power users

### Phase 3: Scale (Months 4-6)
- [ ] Enterprise features (SSO, admin controls)
- [ ] White-label option
- [ ] API marketplace (custom tools)
- [ ] Advanced analytics

---

## Pricing (Draft)

| Tier | Price | Messages/mo | Features |
|------|-------|-------------|----------|
| **Free** | $0 | 100 | Basic tools, 7-day history |
| **Pro** | $29 | 2,000 | Advanced tools, unlimited history, API access |
| **Team** | $99 | 10,000 | Multi-user, admin controls, SSO |
| **Enterprise** | Custom | Unlimited | On-premise, SLA, white-label |

---

## Tech Stack Decisions Needed

1. **Agent Framework:** ClawdBot fork vs. custom build?
2. **AI Providers:** Primary (Claude) + fallback (GPT)?
3. **Hosting:** Vercel + Supabase vs. self-hosted?
4. **Mobile:** PWA vs. React Native?

---

## Contributing

This is a Bridg3 project. Internal development only for now. Public contributions may be accepted post-launch.

---

## License

Proprietary — All rights reserved by Bridg3 Inc.

---

## Contact

Nick Grossi — CEO, Bridg3  
Email: novagrossi44@gmail.com
