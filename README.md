# ai-dash

Next.js App Router dashboard with Supabase OAuth and a streamed chat endpoint.

## Local setup

1. Install dependencies:
```bash
npm install
```
2. Create env file:
```bash
cp .env.example .env.local
```
3. Populate `.env.local`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Run

```bash
npm run dev
```

## Validate

```bash
npm run lint
npm test
```

`npm test` runs a production build and smoke-checks:
- build completes successfully
- compiled app manifest includes `/`, `/auth/callback`, and `/api/chat` routes

## Supabase OAuth redirects

For local development, configure redirect URLs to match this app:
- `http://localhost:3000/auth/callback`
- `http://127.0.0.1:3000/auth/callback`

## Vercel deployment notes

This repo includes `vercel.json` with explicit Next.js build/install commands.

If Vercel shows "build succeeded" but runtime is `404`, verify:
1. Project **Root Directory** is this repo root (not `docs/` or another folder).
2. Production branch is `main`.
3. Required env vars are set in Vercel for the target environment.
4. Domain is attached to the same Vercel project shown in `.vercel/project.json`.
5. Latest deployment URL serves `/` directly before testing the custom domain.

CLI helper:
```bash
bash scripts/vercel-404-diagnose.sh
```

To automatically re-alias the latest READY production deployment:
```bash
bash scripts/vercel-404-diagnose.sh --fix
```
