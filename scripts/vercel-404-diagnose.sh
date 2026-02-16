#!/usr/bin/env bash
set -euo pipefail

FIX_ALIAS=0
if [[ "${1:-}" == "--fix" ]]; then
  FIX_ALIAS=1
  shift
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install: npm i -g vercel"
  exit 1
fi

PROJECT_NAME="$(node -e "const fs=require('fs');const p='.vercel/project.json';if(!fs.existsSync(p)){process.exit(2)};const j=JSON.parse(fs.readFileSync(p,'utf8'));process.stdout.write(j.projectName||'')")" || {
  echo "Could not read .vercel/project.json. Run 'vercel link' first."
  exit 1
}

if [[ -z "$PROJECT_NAME" ]]; then
  echo "Missing projectName in .vercel/project.json"
  exit 1
fi

echo "Project: $PROJECT_NAME"
echo

echo "== Whoami =="
vercel whoami || true
echo

echo "== Project Inspect =="
vercel project inspect "$PROJECT_NAME" || true
echo

echo "== Domains =="
vercel domains ls || true
echo

echo "== Aliases =="
vercel alias ls || true
echo

echo "== Latest Ready Deployment =="
READY_LIST="$(vercel ls --status READY --environment production 2>/dev/null || true)"
LATEST_READY_URL="$(printf '%s\n' "$READY_LIST" | rg '^https://[^[:space:]]+$' | head -n 1 || true)"

if [[ -z "$LATEST_READY_URL" ]]; then
  echo "No READY production deployment found."
  printf '%s\n' "$READY_LIST"
  exit 1
fi

DEFAULT_ALIAS="${PROJECT_NAME}.vercel.app"
echo "Latest ready deployment: $LATEST_READY_URL"
echo "Expected default alias: $DEFAULT_ALIAS"

echo
if [[ "$FIX_ALIAS" -eq 1 ]]; then
  echo "Applying alias updates..."
  vercel alias set "$LATEST_READY_URL" "$DEFAULT_ALIAS"

  for domain in "$@"; do
    vercel alias set "$LATEST_READY_URL" "$domain"
  done

  echo
  echo "Updated aliases:"
  vercel alias ls || true
else
  echo "Dry run complete."
  echo "To fix aliasing automatically, run:"
  echo "  bash scripts/vercel-404-diagnose.sh --fix"
  echo "To also bind custom domains in one run:"
  echo "  bash scripts/vercel-404-diagnose.sh --fix yourdomain.com www.yourdomain.com"
fi
