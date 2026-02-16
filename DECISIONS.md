# AI Assistant Dashboard — Key Decisions

**Date:** 2026-02-15  
**Decided By:** Nick Grossi (CEO, Bridg3)

---

## Product Decisions

### 1. iMessage Integration
**Decision:** Skip for MVP, use SMS (Twilio) instead  
**Rationale:**
- No macOS server available for iMessage relay
- Third-party relays (BlueBubbles) are fragile and risk account bans
- SMS via Twilio is more reliable, cross-platform
- Can add iMessage post-MVP if users demand it

**Implementation:** Twilio SMS API ($0.0079/message, ~$1.60/user/month for 200 messages)

---

### 2. WhatsApp Integration
**Decision:** Use WhatsApp Business API (official)  
**Rationale:**
- Official API = no ban risk, compliant, scalable
- Requires Meta approval (1-2 week process)
- Cost: $0.005/message (~$1.00/user/month for 200 messages)
- Alternative (ClawdBot approach): Uses unofficial `whatsapp-web.js` library
  - Pro: Free, no approval needed
  - Con: Risk of account bans, breaks frequently, not scalable for SaaS

**For MVP:** Start WhatsApp Business API approval process now (takes 1-2 weeks)  
**Fallback:** If approval delayed, launch MVP without WhatsApp, add later

**Note:** ClawdBot uses `whatsapp-web.js` (unofficial) which works for single-user local use but not recommended for multi-tenant SaaS due to ban risk.

---

### 3. Accounting Integration
**Decision:** Read-only for MVP (Xero + QuickBooks)  
**Rationale:**
- Lower risk (no writes = can't mess up user's books)
- Faster development (no transaction logic, just read + display)
- Post-MVP: Add write capabilities if users demand (create invoices, record expenses)

**Capabilities:**
- View income/expenses summary
- List recent invoices
- P&L snapshot
- Cash flow
- Account balances

---

### 4. Pricing Model
**Decision:** Single tier, pay or don't ($29/month)  
**Rationale:**
- Simpler to market ("One price, all features")
- No decision fatigue for users
- All integrations included (email, calendar, accounting, messaging)
- Usage limits still apply (2,000 messages/month, soft cap)

**No Free Tier:**
- Reduces support burden
- Attracts serious users only
- Higher conversion rate (no free-to-paid friction)

**Pricing:**
- **$29/month** — All features, 2,000 AI messages/month, all integrations
- Overage: $10 per additional 500 messages (if user exceeds 2,000)

**Alternative considered:** Free tier (100 messages) + Pro ($29) → rejected for simplicity

---

### 5. Target Users (First Beta)
**Decision:** Matt Grossi (Nick's brother) is first test user  
**Rationale:**
- Trusted, will give honest feedback
- Represents target user: busy professional needing AI assistant
- Low risk if MVP has bugs

**Beta expansion:**
- 5-10 friends/family (Week 6)
- 20-30 early adopters (Week 8)
- Public launch via Product Hunt (Week 10-12)

---

### 6. White-Label Strategy
**Decision:** Focus B2C first, white-label post-MVP  
**Rationale:**
- Faster to market (no white-label complexity)
- Prove product-market fit before offering to agencies/consultants
- Can rebrand later once core product works

**Post-MVP:** If agencies/consultants request white-label, consider Enterprise tier ($299/mo with custom branding)

---

### 7. Product Name
**Decision:** **EA-AI-O** (pronounced "E-A-I-O", like "E-I-E-I-O" from Old MacDonald song)  
**Rationale:**
- Memorable, playful, stands out
- "EA" = Email Assistant, Executive Assistant, Efficient AI
- "AI-O" = AI + I/O (Input/Output)
- Fun, approachable (not another boring "AI Assistant" name)

**Domain Check:**
- eaaio.com — Check availability ✅
- eaaio.ai — Check availability ✅
- getea.ai — Alternative if .com/.ai taken

**Branding Tone:**
- Professional but approachable
- Tech-forward, not intimidating
- Trustworthy, reliable
- "Your AI co-worker, not just a chatbot"

---

## Technical Decisions (Summary)

| Category | Decision |
|----------|----------|
| **Framework** | Next.js 15 (App Router) + React Server Components |
| **Database** | Supabase (PostgreSQL + Auth + Realtime) |
| **AI Provider** | Claude Sonnet 4.5 (primary) + GPT-4o (fallback) |
| **Email** | Gmail + Outlook + IMAP (OAuth) |
| **Calendar** | Google Calendar + Outlook Calendar (OAuth) |
| **Accounting** | Xero + QuickBooks (read-only, OAuth) |
| **Messaging** | SMS (Twilio) + WhatsApp Business API |
| **Mobile** | PWA (Next.js PWA plugin) |
| **Hosting** | Vercel (frontend + API) + Supabase (database) |
| **Billing** | Stripe ($29/mo subscription) |

---

## Revised MVP Scope (8 Weeks)

**Must-Have Features:**
1. ✅ OAuth login (Google, Microsoft, GitHub)
2. ✅ Chat interface (streaming AI)
3. ✅ Conversation history
4. ✅ Email integration (Gmail, Outlook, IMAP)
5. ✅ Calendar integration (Google, Outlook)
6. ✅ Accounting integration (Xero, QuickBooks read-only)
7. ✅ SMS notifications (Twilio)
8. ✅ WhatsApp (Business API, if approved by Week 6)
9. ✅ PWA (mobile app)
10. ✅ Web search tool
11. ✅ Calculator tool
12. ✅ Usage dashboard
13. ✅ Stripe billing

**Nice-to-Have (Post-MVP):**
- Voice input/output
- Team workspaces
- API access
- iMessage (if macOS server available)
- File uploads (analyze PDFs)
- Custom tools (user-defined integrations)

---

## Cost Model (Per User/Month)

**Revenue:** $29/month

**Costs:**
- AI (Claude): $4.50 (500 messages × 500 tokens × $3/$15 per MTok)
- Supabase: $0.50 (database + storage)
- Vercel: $0.25 (hosting + bandwidth)
- Twilio SMS: $1.60 (200 messages × $0.008)
- WhatsApp: $1.00 (200 messages × $0.005)
- Stripe fees: $1.00 (3% of $29)
- **Total cost:** $8.85/user

**Margin:** 69% ($20.15 profit per user) ✅

---

## Next Steps

1. ✅ Finalize branding (logo, colors for EA-AI-O)
2. ✅ Start WhatsApp Business API approval (1-2 weeks)
3. ✅ Set up Vercel + Supabase projects
4. ✅ Week 1-2: OAuth + chat interface
5. ✅ Week 3-4: Email + calendar integrations
6. ✅ Week 5-6: Accounting + messaging (SMS + WhatsApp)
7. ✅ Week 7-8: PWA + polish
8. ✅ Matt (beta user #1) gets access Week 6

**Launch target:** 8 weeks from kickoff (mid-April 2026)
