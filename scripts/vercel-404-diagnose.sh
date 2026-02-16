#!/usr/bin/env bash
set -euo pipefail

FIX_ALIAS=0
if [[ "${1:-}" == "--fix" ]]; then
  FIX_ALIAS=1
  shift
fi

extract_urls() {
  if command -v rg >/dev/null 2>&1; then
    rg '^https://[^[:space:]]+$'
  else
    grep -E '^https://[^[:space:]]+$'
  fi
}

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI not found. Install: npm i -g vercel"
  exit 1
fi

PROJECT_NAME="$(node -e "const fs=require('fs');const p='.vercel/project.json';if(!fs.existsSync(p)){process.exit(2)};const j=JSON.parse(fs.readFileSync(p,'utf8'));process.stdout.write(j.projectName||'')")" || {
  echo "Could not read .vercel/project.json. Run 'vercel link' first."
  exit 1
}
PROJECT_ID="$(node -e "const fs=require('fs');const p='.vercel/project.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));process.stdout.write(j.projectId||'')")"
ORG_ID="$(node -e "const fs=require('fs');const p='.vercel/project.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));process.stdout.write(j.orgId||'')")"

if [[ -z "$PROJECT_NAME" ]]; then
  echo "Missing projectName in .vercel/project.json"
  exit 1
fi

echo "Project: $PROJECT_NAME"
echo "Project ID: $PROJECT_ID"
echo "Org ID: $ORG_ID"
echo

SCOPE_ARGS=()
if [[ -n "$ORG_ID" ]]; then
  SCOPE_ARGS=(--scope "$ORG_ID")
fi

echo "== Whoami =="
vercel whoami || true
echo

echo "== Project Inspect =="
# Prefer linked project inspect to avoid same-name project collisions across scopes.
vercel project inspect || vercel project inspect "$PROJECT_NAME" || true
echo

echo "== Domains =="
if ! vercel domains ls "${SCOPE_ARGS[@]}" 2>/dev/null; then
  vercel domains ls || true
fi
echo

echo "== Aliases =="
if ! vercel alias ls "${SCOPE_ARGS[@]}" 2>/dev/null; then
  vercel alias ls || true
fi
echo

echo "== Latest Ready Deployment =="
if ! READY_LIST="$(vercel ls --status READY --environment production "${SCOPE_ARGS[@]}" 2>/dev/null)"; then
  READY_LIST="$(vercel ls --status READY --environment production 2>/dev/null || true)"
fi
LATEST_READY_URL="$(printf '%s\n' "$READY_LIST" | extract_urls | head -n 1 || true)"

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
  if ! vercel alias set "$LATEST_READY_URL" "$DEFAULT_ALIAS" "${SCOPE_ARGS[@]}"; then
    vercel alias set "$LATEST_READY_URL" "$DEFAULT_ALIAS"
  fi

  for domain in "$@"; do
    if ! vercel alias set "$LATEST_READY_URL" "$domain" "${SCOPE_ARGS[@]}"; then
      vercel alias set "$LATEST_READY_URL" "$domain"
    fi
  done

  echo
  echo "Updated aliases:"
  if ! vercel alias ls "${SCOPE_ARGS[@]}" 2>/dev/null; then
    vercel alias ls || true
  fi
else
  echo "Dry run complete."
  echo "To fix aliasing automatically, run:"
  echo "  bash scripts/vercel-404-diagnose.sh --fix"
  echo "To also bind custom domains in one run:"
  echo "  bash scripts/vercel-404-diagnose.sh --fix yourdomain.com www.yourdomain.com"
fi
