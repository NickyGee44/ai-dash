#!/usr/bin/env bash
set -euo pipefail

BUILD_LOG="$(mktemp -t ai-dash-build-log.XXXXXX)"
MANIFEST_PATH=".next/server/app-paths-manifest.json"

if ! NEXT_TELEMETRY_DISABLED=1 npm run build >"$BUILD_LOG" 2>&1; then
  echo "Build failed during smoke test."
  cat "$BUILD_LOG"
  exit 1
fi

if [[ ! -f "$MANIFEST_PATH" ]]; then
  echo "Expected manifest not found at $MANIFEST_PATH"
  exit 1
fi

node - <<'NODE'
const fs = require('node:fs');

const manifest = JSON.parse(
  fs.readFileSync('.next/server/app-paths-manifest.json', 'utf8')
);

const requiredEntries = ['/page', '/auth/callback/route', '/api/chat/route'];
const missing = requiredEntries.filter((entry) => !(entry in manifest));

if (missing.length > 0) {
  console.error(`Missing required app routes in build manifest: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Smoke tests passed (build + required app routes present).');
NODE
