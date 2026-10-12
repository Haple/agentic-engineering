// Cut promo clips from already-voiced lessons (no new TTS): picks scenes from a lesson's timed data,
// re-times them back to back, appends a silent call-to-action card, and slices the matching narration audio.
// usage: node tools/clip.mjs [course/promo/clips.json] [--only id1,id2]
// writes .serve/testdata/<id>.json and audio/<id>/lesson.wav  (render: node tools/capture.mjs <id> --src /testdata/<id>.json --portrait)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const ROOT = new URL("..", import.meta.url).pathname;
const spec = JSON.parse(readFileSync(ROOT + (process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "course/promo/clips.json"), "utf8"));
const oi = process.argv.indexOf("--only"); const only = oi > 0 ? process.argv[oi + 1].split(",") : null;
const LEAD = 0.3;
for (const c of spec.clips) {
  if (only && !only.includes(c.id)) continue;
  const d = JSON.parse(readFileSync(`${ROOT}site/static/data/${c.lesson}.json`, "utf8"));
  let cur = LEAD; const scenes = []; const cuts = [];
  for (const i of c.scenes) {
    const s = d.scenes[i]; if (!s) throw new Error(`${c.id}: no scene ${i}`);
    if (s.template === "quiz") throw new Error(`${c.id}: quiz scenes can't be clipped`);
    const shift = cur - s.start;
    scenes.push({ ...s, start: cur, words: s.words.map((w) => ({ ...w, s: +(w.s + shift).toFixed(3), e: +(w.e + shift).toFixed(3) })) });
    cuts.push([s.start, s.start + s.dur]); cur += s.dur;
  }
  const cta = { ...spec.cta, ...(c.cta || {}) }; const dur = cta.dur || 3.5; delete cta.dur;
  scenes.push({ template: "title", chapter: "Free course", narration: "", params: cta, start: cur, dur, words: [] });
  const total = +(cur + dur).toFixed(3);
  writeFileSync(`${ROOT}.serve/testdata/${c.id}.json`, JSON.stringify({ ...d, id: c.id, total, scenes, audio: null }));
  const adir = `${ROOT}audio/${c.id}`; mkdirSync(adir, { recursive: true });
  const fc = cuts.map(([a, b], k) => `[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS[a${k}]`).join(";")
    + `;aevalsrc=0:d=${LEAD}[lead]` + `;[lead]${cuts.map((_, k) => `[a${k}]`).join("")}concat=n=${cuts.length + 1}:v=0:a=1,apad=whole_dur=${total}[out]`;
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", `${ROOT}audio/${c.lesson}/lesson.wav`, "-filter_complex", fc, "-map", "[out]", "-ar", "48000", "-ac", "1", `${adir}/lesson.wav`]);
  writeFileSync(`${adir}/caption.txt`, c.caption + "\n");
  console.log(c.id, total.toFixed(1) + "s");
}
