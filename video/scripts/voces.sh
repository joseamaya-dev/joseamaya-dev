#!/usr/bin/env bash
# Genera, normaliza y sincroniza las voces de un episodio.
# Uso: scripts/voces.sh ep02 [--force] [--only=3,5]
set -euo pipefail
cd "$(dirname "$0")/.."
EP="${1:?Indica el episodio, p. ej. ep02}"; shift || true
if [ -z "${CARTESIA_API_KEY:-}" ] && [ -f /root/.ccr/ca-bundle.crt ]; then
  export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt NODE_NO_WARNINGS=1  # sesión en la nube: el proxy pone la clave
fi
node --no-warnings scripts/cartesia-tts.mjs "$EP" "$@"
for f in public/audio/"$EP"/[0-9][0-9].wav; do
  npx remotion ffmpeg -hide_banner -loglevel error -y -i "$f" \
    -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 1 -c:a pcm_s16le "$f.tmp.wav" 2>&1 | grep -v '^Warning' || true
  mv "$f.tmp.wav" "$f"
done
node scripts/sync-audio.mjs "$EP"
