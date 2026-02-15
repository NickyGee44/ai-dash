# Decision Matrix — AI Assistant Dashboard

## Key Technical Decisions (For Nick to Review)

---

## 1. Agent Framework

| Option | Pros | Cons | Effort | Recommend |
|--------|------|------|--------|-----------|
| **Fork ClawdBot** | ✅ Proven framework<br>✅ Multi-tool support<br>✅ Active development | ❌ Designed for single-user<br>❌ Needs refactoring for multi-tenant<br>❌ Complexity we may not need | 2-3 weeks | ❌ No |
| **Custom (LangGraph)** | ✅ Full control<br>✅ Optimized for SaaS from day one<br>✅ Simpler codebase<br>✅ Easier to scale | ❌ Build from scratch<br>❌ Reinvent some patterns | 3-4 weeks | ✅ **Yes** |

**Recommendation:** Custom framework  
**Rationale:** Multi-tenancy is critical. Easier to build right from the start than refactor ClawdBot.

---

## 2. AI Provider Strategy

| Provider | Use Case | Cost (per 1M tokens) | Recommendation |
|----------|----------|----------------------|----------------|
| **Claude Sonnet 4.5** | Primary (best agentic workflows) | $3 (in) / $15 (out) | ✅ Primary |
| **GPT-4o** | Fallback + user preference | $5 (in) / $15 (out) | ✅ Fallback |
| **Gemini 2.0 Pro** | Cost optimization (future) | $1.25 (in) / $5 (out) | 🔮 Future |

**Recommendation:** Claude primary, GPT fallback  
**Rationale:** Claude has best tool use + reasoning. GPT as backup for reliability.

---

## 3. Hosting & Infrastructure

| Component | Option | Cost (est.) | Recommendation |
|-----------|--------|-------------|----------------|
| **Frontend + API** | Vercel | $20/mo (Pro) | ✅ Yes |
| **Database + Auth** | Supabase | $25/mo (Pro) | ✅ Yes |
| **File Storage** | Supabase Storage | Included | ✅ Yes |
| **Caching** | Vercel KV (Redis) | $10/mo | ✅ Yes |
| **Monitoring** | Sentry | $26/mo (Team) | ✅ Yes |

**Total platform cost:** ~$80/mo + usage-based AI costs  
**Recommendation:** Vercel + Supabase stack  
**Rationale:** Fast development, easy scaling, managed services. Focus on product, not DevOps.

---

## 4. Pricing Model

| Tier | Price | Messages/mo | Target Margin | Rationale |
|------|-------|-------------|---------------|-----------|
| **Free** | $0 | 100 | Loss leader | Acquisition funnel |
| **Pro** | $29/mo | 2,000 | 78% | Sweet spot ($6.25 cost) |
| **Team** | $99/mo | 10,000 | 85% | Shared pool, higher margin |
| **Enterprise** | Custom | Unlimited | 70%+ | Volume discounts, SLA |

**Recommendation:** Start with Free + Pro tiers only  
**Rationale:** Validate demand before building team/enterprise features.

---

## 5. MVP Feature Scope

| Feature | Priority | Effort | Include in MVP? |
|---------|----------|--------|-----------------|
| OAuth login (Google/GitHub) | P0 | 3 days | ✅ Yes |
| Chat interface (streaming) | P0 | 5 days | ✅ Yes |
| Conversation history | P0 | 2 days | ✅ Yes |
| Web search tool | P0 | 2 days | ✅ Yes |
| Calculator tool | P0 | 1 day | ✅ Yes |
| Usage dashboard | P0 | 3 days | ✅ Yes |
| Stripe billing | P0 | 4 days | ✅ Yes |
| Mobile app | P1 | 2 weeks | ❌ No (PWA instead) |
| Voice input/output | P1 | 1 week | ❌ No (post-MVP) |
| Calendar integration | P1 | 3 days | ⚠️ Maybe (if time) |
| Email integration | P1 | 3 days | ❌ No (post-MVP) |
| Team workspaces | P2 | 2 weeks | ❌ No (post-MVP) |

**MVP timeline:** 4-6 weeks  
**Post-MVP (v1.1):** 2-3 weeks for calendar, voice, mobile improvements

---

## 6. Go-to-Market Strategy

| Phase | Duration | Goal | Tactics |
|-------|----------|------|---------|
| **1. Beta (Invite-only)** | 4 weeks | 100 users, gather feedback | Friends & family, Twitter/X announcement |
| **2. Public Beta** | 8 weeks | 1,000 users, validate pricing | Product Hunt, blog posts, referral program |
| **3. Growth** | Ongoing | 10K users, $50K MRR | Paid ads, partnerships, content marketing |

**Launch timeline:** 6 weeks from kickoff to public beta

---

## 7. Name & Branding

| Name | Pros | Cons | Domain Available? |
|------|------|------|-------------------|
| AI Assistant Dashboard | Descriptive, clear | Generic, bland | N/A (working title) |
| ClawdBot SaaS | Leverages ClawdBot brand | Implies forking ClawdBot | Maybe |
| Nova AI | Clean, modern | Generic "nova" | Likely taken |
| BridgAI | Ties to Bridg3 brand | May confuse with "bridge" | Check |
| AgentHub | Describes product well | Competitive space | Likely taken |
| **PersonalAI** | Clear value prop | Generic | personalai.com taken |
| **AgentBox** | Modern, techy | Not descriptive | agentbox.io available? |

**Recommendation:** Brainstorm 10 more names, check domains, pick top 3  
**Brand tone:** Professional but approachable, tech-forward but not intimidating

---

## Summary Recommendations

1. ✅ **Build custom agent framework** (LangGraph, not ClawdBot fork)
2. ✅ **Claude Sonnet 4.5 primary** + GPT-4o fallback
3. ✅ **Vercel + Supabase stack** (managed services, fast dev)
4. ✅ **Start with Free + Pro tiers** ($0, $29/mo)
5. ✅ **MVP in 4-6 weeks** (OAuth, chat, 2-3 tools, billing)
6. ✅ **Invite-only beta** → Product Hunt launch → growth
7. ⚠️ **Name TBD** (brainstorm alternatives to "AI Assistant Dashboard")

---

## Questions for Nick

1. **Target audience:** B2C individuals or B2B teams first?
2. **White-label:** Should we design for white-label from day one?
3. **Tool priorities:** Which integrations are must-have for you personally?
4. **Brand:** Any name ideas? Bridg3 sub-brand or standalone?
5. **Timeline:** 4-6 weeks realistic or push to 8 weeks for polish?

**Next step:** Get your input on these decisions, then start building.
