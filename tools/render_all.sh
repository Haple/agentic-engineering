#!/usr/bin/env bash
# Render queue (skips finished files): trailer (L+P), shorts (P), all lessons (L). Run inside tmux: agentic-render
cd "$(dirname "$0")/.." || exit 1
mkdir -p renders
W=${WORKERS:-4}
r() { local out=$1; shift; [ -s "$out" ] && { echo "skip $out"; return; }; node tools/capture.mjs "$@" --out "$out" --workers "$W" || echo "FAILED $out"; }
r renders/agentic-engineering-trailer-landscape.mp4 trailer
r renders/agentic-engineering-trailer-portrait.mp4 trailer --portrait
for c in $(python3 -c "import json;print(' '.join(c['id'] for c in json.load(open('course/promo/clips.json'))['clips']))"); do
  r "renders/shorts/$c.mp4" "$c" --src "/testdata/$c.json" --portrait
done
for id in $(python3 -c "import json;print(' '.join(l['id'] for m in json.load(open('course/course.json'))['modules'] for l in m['lessons']))"); do
  r "renders/lessons/$id-landscape.mp4" "$id"
done
echo ALL DONE
