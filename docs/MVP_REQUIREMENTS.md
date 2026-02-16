# AI Assistant Dashboard — MVP Requirements (Updated)

**Last Updated:** 2026-02-15 21:52 EST  
**Based on:** Nick's feedback + must-have integrations

---

## Core Must-Have Features (For MVP)

### 1. Authentication ✅
- **OAuth:** Google, Microsoft (Outlook), GitHub
- **Session Management:** Supabase Auth
- **No passwords:** OAuth-only

### 2. Chat Interface ✅
- **Streaming responses** from AI
- **Conversation history** (saved, searchable)
- **Message actions:** Copy, regenerate, delete
- **Context-aware** (uses conversation history)

### 3. Email Integration 🔥 **CRITICAL**
**Providers Required:**
- ✅ **Google Gmail** (OAuth via Google Workspace API)
- ✅ **Microsoft Outlook** (OAuth via Microsoft Graph API)
- ✅ **Generic IMAP/SMTP** (for other providers like Yahoo, ProtonMail)

**Capabilities:**
- Read unread emails (with filters: sender, subject, date)
- Send emails (with attachments)
- Reply to threads
- Archive/delete emails
- Search emails
- Mark as read/unread

**Implementation:**
- Backend: Email service layer with provider abstraction
- Frontend: Email tool UI (show inbox preview, compose UI)
- Security: OAuth tokens stored per-user, encrypted
- Rate limiting: Prevent abuse (max 50 emails/day on free tier)

---

### 4. Calendar Integration 🔥 **CRITICAL**
**Providers Required:**
- ✅ **Google Calendar** (OAuth via Google Calendar API)
- ✅ **Microsoft Outlook Calendar** (OAuth via Microsoft Graph API)
- ✅ **Apple iCloud Calendar** (CalDAV, requires App-Specific Password)

**Capabilities:**
- View upcoming events (next 7 days)
- Create new events (with reminders)
- Update/reschedule events
- Delete events
- Check availability (free/busy)
- Send meeting invites

**Implementation:**
- Backend: Calendar service layer with provider abstraction
- Frontend: Calendar tool UI (mini calendar view, event list)
- Security: OAuth tokens per-user, encrypted
- Rate limiting: Max 100 calendar operations/day on free tier

---

### 5. Accounting Integration 🔥 **CRITICAL**
**Providers Required:**
- ✅ **Xero** (OAuth 2.0 via Xero API)
- ✅ **QuickBooks Online** (OAuth 2.0 via Intuit API)

**Capabilities:**
- **Read-only for MVP:**
  - View income/expenses summary
  - List recent invoices
  - Check account balances
  - Show P&L (Profit & Loss) snapshot
  - Show cash flow
  - List top customers/vendors

- **Write operations (post-MVP):**
  - Create invoices
  - Record expenses
  - Categorize transactions
  - Reconcile accounts

**Implementation:**
- Backend: Accounting service layer (Xero SDK, QuickBooks SDK)
- Frontend: Financial dashboard widget (charts, summaries)
- Security: OAuth tokens per-user, encrypted
- Compliance: Read-only scope for MVP (reduces risk)
- Rate limiting: Max 50 accounting queries/day on free tier

---

### 6. Messaging Integration 🔥 **CRITICAL**
**Providers Required:**
- ✅ **iMessage** (macOS/iOS only, via AppleScript or Shortcuts API)
- ✅ **WhatsApp** (via WhatsApp Business API or unofficial libraries)

**Use Case:**
- Platform sends notifications to user via their preferred channel
- User can ask questions via iMessage/WhatsApp → platform responds
- Bidirectional chat (not just notifications)

**Capabilities:**
- Send message to user (alerts, reminders, summaries)
- Receive messages from user (triggers AI assistant)
- Optionally: Reply to conversations, group chats

**Implementation:**

#### iMessage (macOS-specific)
- **Option A:** AppleScript (send only, macOS server required)
- **Option B:** iOS Shortcuts API (requires user setup)
- **Option C:** Third-party relay (e.g., BlueBubbles)
- **Recommended:** AppleScript for MVP (simple, works on macOS)

**Challenges:**
- Apple doesn't have official iMessage API
- Requires macOS server or user's device to relay
- Security risk if using third-party relay

#### WhatsApp
- **Option A:** WhatsApp Business API (official, requires approval)
- **Option B:** WhatsApp Web client (unofficial, via libraries like `whatsapp-web.js`)
- **Recommended:** WhatsApp Business API for production (official, compliant)

**Challenges:**
- Business API requires Meta approval + $0.005/message cost
- Unofficial libraries risk account bans
- Rate limiting strict (1,000 messages/day on Business API)

**Security:**
- End-to-end encryption maintained (via provider)
- User must explicitly opt-in to messaging integration
- Messages logged for audit (encrypted at rest)

---

### 7. Mobile App / PWA 🔥 **CRITICAL**
**Options:**
- ✅ **PWA (Progressive Web App)** — Recommended for MVP
- ⚠️ **React Native** — Post-MVP (native features)

**PWA Advantages:**
- Single codebase (Next.js)
- Install on iOS/Android via browser
- Push notifications (via service worker)
- Offline support (cache conversations)
- Lower development cost

**PWA Capabilities:**
- Add to home screen (iOS/Android)
- Runs fullscreen (like native app)
- Push notifications (on Android, limited on iOS)
- Offline chat (cached history)
- Background sync (when connection restored)

**Implementation:**
- Use Next.js PWA plugin (`next-pwa`)
- Service worker for caching + notifications
- Manifest file for install prompt
- Icon set for iOS/Android

**Post-MVP (React Native):**
- If PWA limitations hit (e.g., iOS push notifications)
- Native features: Face ID, Siri integration, deeper OS integration

---

## Revised MVP Scope (With Integrations)

| Feature | Priority | Effort | Include in MVP? |
|---------|----------|--------|-----------------|
| OAuth login (Google/Microsoft/GitHub) | P0 | 3 days | ✅ Yes |
| Chat interface (streaming) | P0 | 5 days | ✅ Yes |
| Conversation history | P0 | 2 days | ✅ Yes |
| **Email integration (Gmail + Outlook)** | P0 | 5 days | ✅ Yes |
| **Calendar integration (Google + Outlook)** | P0 | 4 days | ✅ Yes |
| **Accounting (Xero + QuickBooks read-only)** | P0 | 6 days | ✅ Yes |
| **Messaging (iMessage + WhatsApp)** | P0 | 5 days | ✅ Yes |
| **PWA (mobile app)** | P0 | 3 days | ✅ Yes |
| Web search tool | P1 | 2 days | ✅ Yes |
| Calculator tool | P1 | 1 day | ✅ Yes |
| Usage dashboard | P0 | 3 days | ✅ Yes |
| Stripe billing | P0 | 4 days | ✅ Yes |
| Voice input/output | P2 | 1 week | ❌ No (post-MVP) |
| Team workspaces | P2 | 2 weeks | ❌ No (post-MVP) |

**New MVP timeline:** 6-8 weeks (up from 4-6 weeks due to integrations)

---

## Integration Architecture

### Email Service Layer
```typescript
interface EmailProvider {
  authenticate(userId: string): Promise<void>;
  getUnreadEmails(filters: EmailFilter): Promise<Email[]>;
  sendEmail(to: string, subject: string, body: string, attachments?: File[]): Promise<void>;
  replyToThread(threadId: string, body: string): Promise<void>;
  searchEmails(query: string): Promise<Email[]>;
}

class GmailProvider implements EmailProvider { /* ... */ }
class OutlookProvider implements EmailProvider { /* ... */ }
class IMAPProvider implements EmailProvider { /* ... */ }
```

### Calendar Service Layer
```typescript
interface CalendarProvider {
  authenticate(userId: string): Promise<void>;
  getUpcomingEvents(days: number): Promise<CalendarEvent[]>;
  createEvent(event: NewEvent): Promise<CalendarEvent>;
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
  checkAvailability(start: Date, end: Date): Promise<FreeBusySlot[]>;
}

class GoogleCalendarProvider implements CalendarProvider { /* ... */ }
class OutlookCalendarProvider implements CalendarProvider { /* ... */ }
```

### Accounting Service Layer
```typescript
interface AccountingProvider {
  authenticate(userId: string): Promise<void>;
  getIncomeSummary(period: 'month' | 'quarter' | 'year'): Promise<Summary>;
  getExpenseSummary(period: 'month' | 'quarter' | 'year'): Promise<Summary>;
  listInvoices(limit: number): Promise<Invoice[]>;
  getProfitAndLoss(startDate: Date, endDate: Date): Promise<PLReport>;
  getCashFlow(startDate: Date, endDate: Date): Promise<CashFlowReport>;
}

class XeroProvider implements AccountingProvider { /* ... */ }
class QuickBooksProvider implements AccountingProvider { /* ... */ }
```

### Messaging Service Layer
```typescript
interface MessagingProvider {
  authenticate(userId: string): Promise<void>;
  sendMessage(to: string, message: string): Promise<void>;
  receiveMessage(callback: (from: string, message: string) => void): void;
  subscribeToIncoming(userId: string): Promise<void>;
}

class iMessageProvider implements MessagingProvider { /* ... */ }
class WhatsAppProvider implements MessagingProvider { /* ... */ }
```

---

## Security Considerations (With Integrations)

### OAuth Token Management
- **Storage:** Encrypted in PostgreSQL (pgcrypto)
- **Refresh:** Automated refresh before expiry
- **Revocation:** User can revoke access anytime
- **Scopes:** Minimal scopes only (read-only for accounting)

### Rate Limiting (Per Integration)
| Integration | Free Tier | Pro Tier |
|-------------|-----------|----------|
| Email (read) | 50/day | 500/day |
| Email (send) | 10/day | 100/day |
| Calendar | 100 ops/day | 1,000 ops/day |
| Accounting | 50 queries/day | 500 queries/day |
| Messaging | 20/day | 200/day |

### Audit Logging
- Every API call logged (who, what, when)
- User can review all actions in dashboard
- Immutable audit log (append-only)

### Data Retention
- Emails: Not stored (only referenced by ID)
- Calendar: Event metadata cached (7 days)
- Accounting: Summaries cached (24 hours)
- Messages: Not stored (ephemeral)

---

## Cost Impact (With Integrations)

### API Costs (Per User/Month)

| Integration | Free Tier Cost | Pro Tier Cost | Notes |
|-------------|----------------|---------------|-------|
| Email (Gmail/Outlook) | $0 | $0 | Free API (OAuth only) |
| Calendar | $0 | $0 | Free API |
| Accounting (Xero/QB) | $0 | $0 | Free API (read-only) |
| WhatsApp Business API | $0.10 (20 msg × $0.005) | $1.00 (200 msg) | Official API cost |
| iMessage | $0 | $0 | Free (requires macOS relay) |
| **Total Integration Cost** | ~$0.10/user | ~$1.00/user | Minimal |

### Revised Unit Economics (Pro Tier)

**Previous:**
- Revenue: $29/month
- AI cost: $4.50/user (Claude Sonnet)
- Platform cost: $1.75/user (Supabase, Vercel, Stripe)
- **Margin:** 78% ($22.75 profit)

**With Integrations:**
- Revenue: $29/month
- AI cost: $4.50/user
- Platform cost: $1.75/user
- Integration cost: $1.00/user (WhatsApp primarily)
- **New margin:** 75% ($21.75 profit) ✅ Still healthy

---

## Implementation Priority (8-Week Timeline)

### Weeks 1-2: Foundation
- Next.js + Supabase setup
- OAuth (Google, Microsoft, GitHub)
- Chat interface (streaming AI)
- Conversation history
- Usage dashboard
- Stripe billing

### Weeks 3-4: Email + Calendar
- Email integration (Gmail, Outlook, IMAP)
- Calendar integration (Google, Outlook)
- Frontend UI for email/calendar tools
- Testing + error handling

### Weeks 5-6: Accounting + Messaging
- Accounting integration (Xero, QuickBooks)
- Messaging integration (iMessage, WhatsApp)
- Financial dashboard widget
- Message notification system

### Weeks 7-8: Polish + PWA
- PWA setup (service worker, manifest)
- Mobile responsive design
- Push notifications
- Beta testing + bug fixes
- Documentation + user guide

---

## What I Need From You (Questions)

1. **iMessage Integration:** Do you have a macOS server available for relay? Or should we use third-party (BlueBubbles)?

2. **WhatsApp:** Official Business API (requires Meta approval) or unofficial library (risk of ban)?

3. **Accounting Scope:** Read-only for MVP or do you want write capabilities (create invoices, etc.)?

4. **Pricing:** Should integrations affect pricing tiers? (e.g., Free tier excludes accounting/messaging?)

5. **Target Users:** Who are the ideal first users? (Finance professionals? Busy executives? Small business owners?)

6. **White-Label:** Still want to design for white-label from day one, or focus on direct B2C first?

7. **Brand Name:** Any thoughts on alternatives to "AI Assistant Dashboard"? (AgentBox? PersonalAI? BridgAI?)

---

**Next Steps:**
1. Your answers to the 7 questions above
2. I'll update ARCHITECTURE.md with integration details
3. Build OAuth + email/calendar integration prototypes (Week 1-2)
4. Weekly demos to validate UX + features

Let me know when you're ready to proceed! 🚀
