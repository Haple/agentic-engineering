#!/usr/bin/env bash
# voice + QA sheet for one lesson: tools/make_lesson.sh 02-how-agents-work [--portrait]
set -e
cd ~/agentic-engineering
id="$1"; shift || true
export FAL_KEY=${FAL_KEY:-$(doppler secrets get FALAI_API_KEY -p default -c prd --plain)}
python3 -c "import json;L=json.load(open('course/lessons/$id.json'));w=sum(len(s['narration'].split()) for s in L['scenes']);print('words',w,'scenes',len(L['scenes']))"
node tools/voice.mjs course/lessons/$id.json --voice Eric
S=/tmp/claude-1000/-home-agent/8537e6f6-254b-40ae-ab7e-c17f4ac1ae81/scratchpad/qa-$id
node tools/stills.mjs /data/$id.json $S --scale 0.5 "$@"
