// Narrate a lesson: per-scene ElevenLabs v4 TTS (fal) with character timestamps -> word timings,
// cached by spoken-text hash; then lay scenes end to end, mix one lesson track, write the timed lesson JSON.
// usage: FAL_KEY=... node tools/voice.mjs course/lessons/NN-slug.json [--voice Eric] [--force] [--jobs 3]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
const ROOT = new URL("..", import.meta.url).pathname;
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const file = args.find((a) => a.endsWith(".json"));
const L = JSON.parse(readFileSync(file, "utf8"));
const VOICE = opt("voice", L.voice || "Eric");
const STAB = +opt("stability", L.stability || 0.42);
const FORCE = args.includes("--force");
const JOBS = +opt("jobs", 3);
const KEY = process.env.FAL_KEY;
const ADIR = join(ROOT, "audio", L.id); mkdirSync(ADIR, { recursive: true });

// display word -> spoken words (captions keep the display form; timings map back 1:n)
const LEX = {
  "claude.md": "Claude dot M D", "agents.md": "agents dot M D", "skill.md": "skill dot M D", "readme": "read me", "readme.md": "read me",
  "npm": "N P M", "e.g.": "for example", "i.e.": "that is", "vs": "versus", "vs.": "versus", "jsonl": "Jason L",
  "2x": "two x", "3x": "three x", "5x": "five x", "10x": "ten x", "100x": "a hundred x", "1m": "one million", "100k": "a hundred thousand", "200k": "two hundred thousand",
  "worktrees": "work trees", "worktree": "work tree", "subagent": "sub-agent", "subagents": "sub-agents", "frontmatter": "front matter",
};
function speakable(display) {
  const dw = display.split(/\s+/).filter(Boolean);
  const spoken = []; const map = [];
  for (const w of dw) {
    const m = w.match(/^([("“'‘]*)(.*?)([)"”'’.,;:!?…—–-]*)$/);
    const pre = m ? m[1] : "", core = m ? m[2] : w, post = m ? m[3] : "";
    const key = core.toLowerCase();
    let rep = LEX[key] ?? LEX[(core + post).toLowerCase()];
    let words;
    if (rep != null) { words = rep.split(/\s+/); words[0] = pre + words[0]; words[words.length - 1] += (LEX[(core + post).toLowerCase()] != null ? "" : post); }
    else words = [w];
    const a = spoken.length; spoken.push(...words); map.push([a, spoken.length - 1]);
  }
  return { dw, spoken, map, text: spoken.join(" ") };
}
async function tts(text) {
  let last;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch("https://fal.run/elevenlabs/tts/eleven-v4", { method: "POST", headers: { Authorization: `Key ${KEY}`, "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 agentic-course" }, body: JSON.stringify({ text, voice: VOICE, stability: STAB, similarity_boost: 0.78, timestamps: true }) });
      if (!r.ok) throw new Error(`tts ${r.status}: ${(await r.text()).slice(0, 200)}`);
      const j = await r.json();
      const buf = Buffer.from(await (await fetch(j.audio.url)).arrayBuffer());
      return { buf, ts: j.timestamps };
    } catch (e) { last = e; await new Promise((s) => setTimeout(s, 2000 * (attempt + 1))); }
  }
  throw last;
}
function wordsFromTs(ts) {
  const chars = [], st = [], en = [];
  for (const c of ts || []) { chars.push(...c.characters); st.push(...c.character_start_times_seconds); en.push(...c.character_end_times_seconds); }
  const out = []; let cur = null;
  chars.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (cur) { out.push(cur); cur = null; } return; }
    if (!cur) cur = { text: "", s: st[i], e: en[i] };
    cur.text += ch; cur.e = en[i];
  });
  if (cur) out.push(cur);
  return out;
}
const dur = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim();

async function voiceScene(sc, k) {
  const sp = speakable(sc.narration || "");
  const h = createHash("sha1").update(VOICE + "|" + STAB + "|" + sp.text).digest("hex").slice(0, 12);
  const base = join(ADIR, `s${String(k).padStart(2, "0")}`);
  const metaF = base + ".json", mp3 = base + ".mp3";
  if (!FORCE && existsSync(metaF)) { const m = JSON.parse(readFileSync(metaF, "utf8")); if (m.hash === h && existsSync(mp3)) return m; }
  if (!sp.text.trim()) { execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "1.2", mp3]); const m = { hash: h, dur: 1.2, words: [] }; writeFileSync(metaF, JSON.stringify(m)); return m; }
  const { buf, ts } = await tts(sp.text);
  writeFileSync(mp3, buf);
  const sw = wordsFromTs(ts);
  let words;
  if (sw.length === sp.spoken.length) words = sp.dw.map((w, i) => ({ text: w, s: +sw[sp.map[i][0]].s.toFixed(3), e: +sw[sp.map[i][1]].e.toFixed(3) }));
  else { // fallback: proportional mapping by character position
    console.warn(`  word count mismatch scene ${k}: spoken ${sp.spoken.length} vs ts ${sw.length}`);
    const total = sw.length ? sw[sw.length - 1].e : dur(mp3);
    const n = sp.dw.length; words = sp.dw.map((w, i) => ({ text: w, s: +(total * i / n).toFixed(3), e: +(total * (i + 0.9) / n).toFixed(3) }));
  }
  const m = { hash: h, dur: +dur(mp3).toFixed(3), words, spoken: sp.text };
  writeFileSync(metaF, JSON.stringify(m));
  console.log(`  scene ${k} voiced ${m.dur}s`);
  return m;
}

const metas = new Array(L.scenes.length);
const queue = L.scenes.map((sc, k) => k);
await Promise.all(Array.from({ length: JOBS }, async () => { while (queue.length) { const k = queue.shift(); metas[k] = await voiceScene(L.scenes[k], k); } }));

// lay out: lead-in, per-scene pre-roll + audio + tail (+ quiz hold)
const LEAD = 0.5, PRE = 0.3;
let t = LEAD; const parts = [];
const out = { id: L.id, number: L.number, slug: L.slug, title: L.title, short: L.short, module: L.module, summary: L.summary, voice: VOICE, scenes: [] };
L.scenes.forEach((sc, k) => {
  const m = metas[k];
  const tail = sc.tail ?? (sc.template === "title" ? 0.9 : sc.template === "quiz" ? 5.2 : sc.template === "recap" ? 1.6 : 0.65) + (sc.hold || 0);
  const start = +t.toFixed(3), a0 = t + PRE;
  parts.push([a0, join(ADIR, `s${String(k).padStart(2, "0")}.mp3`)]);
  const d = PRE + m.dur + tail;
  out.scenes.push({ ...sc, start, dur: +d.toFixed(3), words: m.words.map((w) => ({ text: w.text, s: +(a0 + w.s).toFixed(3), e: +(a0 + w.e).toFixed(3) })) });
  t += d;
});
out.total = +(t + 0.4).toFixed(3);
// mix: one wav (capture/mux) + one mp3 (web)
const wav = join(ADIR, "lesson.wav"), webDir = join(ROOT, "site", "static", "audio"); mkdirSync(webDir, { recursive: true });
const ff = ["-v", "error", "-y"]; parts.forEach(([, f]) => ff.push("-i", f));
const fl = parts.map(([st], k) => `[${k}:a]aresample=48000,aformat=channel_layouts=mono,adelay=${Math.round(st * 1000)}:all=1[a${k}]`);
fl.push(parts.map((_, k) => `[a${k}]`).join("") + `amix=inputs=${parts.length}:normalize=0,apad=whole_dur=${out.total}[o]`);
execFileSync("ffmpeg", [...ff, "-filter_complex", fl.join(";"), "-map", "[o]", "-t", String(out.total), "-ar", "48000", wav]);
const web = join(webDir, `${L.id}.mp3`);
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1", "-ar", "44100", "-b:a", "80k", web]);
out.audio = `/audio/${L.id}.mp3`;
const dataDir = join(ROOT, "site", "static", "data"); mkdirSync(dataDir, { recursive: true });
writeFileSync(join(dataDir, `${L.id}.json`), JSON.stringify(out));
console.log(JSON.stringify({ id: L.id, scenes: out.scenes.length, total_s: out.total, min: +(out.total / 60).toFixed(2), voice: VOICE }));
