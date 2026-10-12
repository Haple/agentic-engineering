// Give a lesson draft (scenes w/ narration) fake word timings so templates can be QA'd before TTS.
// usage: node tools/fake_timing.mjs course/lessons/x.json > out.json
import { readFileSync } from "node:fs";
const L = JSON.parse(readFileSync(process.argv[2], "utf8"));
let t = 0.6;
for (const sc of L.scenes) {
  const words = String(sc.narration || "").split(/\s+/).filter(Boolean);
  sc.start = t; sc.words = [];
  let w0 = t + 0.35;
  for (const w of words) { const d = 0.16 + Math.min(0.5, w.length * 0.045); sc.words.push({ text: w, s: +w0.toFixed(3), e: +(w0 + d).toFixed(3) }); w0 += d + 0.06 + (/[.,;:?!]$/.test(w) ? 0.25 : 0); }
  sc.dur = +((w0 - t) + 0.7 + (sc.template === "quiz" ? 4.5 : 0) + (sc.hold || 0)).toFixed(3);
  t += sc.dur;
}
L.total = +(t + 0.8).toFixed(3);
process.stdout.write(JSON.stringify(L));
