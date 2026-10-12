// Render a lesson to MP4: N headless Chromes each seek a contiguous frame range of dev/stage.html (capture mode),
// screenshot every frame into an x264 encoder; chunks are concatenated and the lesson narration is muxed in.
// usage: node tools/capture.mjs <id> [--portrait] [--out renders/<id>-landscape.mp4] [--fps 30] [--workers 6] [--crf 18] [--to <s>]
import puppeteer from "/home/agent/.local/lib/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { readdirSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import path from "node:path";
const ROOT = new URL("..", import.meta.url).pathname;
const id = process.argv[2];
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const portrait = process.argv.includes("--portrait");
const fps = +arg("fps", 30), W = +arg("workers", 6), crf = arg("crf", "18"), port = process.env.PORT || 4730;
const out = path.resolve(arg("out", `${ROOT}renders/${id}-${portrait ? "portrait" : "landscape"}.mp4`));
const wav = `${ROOT}audio/${id}/lesson.wav`;
if (!existsSync(wav)) throw new Error("missing narration " + wav);
const VW = portrait ? 1080 : 1920, VH = portrait ? 1920 : 1080;
const src = arg("src", `/data/${id}.json`);
const url = `http://127.0.0.1:${port}/dev/stage.html?src=${encodeURIComponent(src)}&portrait=${portrait ? 1 : 0}&mode=capture`;
const base = "/home/agent/.cache/puppeteer/chrome-headless-shell/"; const exe = `${base}${readdirSync(base)[0]}/chrome-headless-shell-linux64/chrome-headless-shell`;
const launch = () => puppeteer.launch({ executablePath: exe, args: ["--no-sandbox", "--force-color-profile=srgb", "--font-render-hinting=none", "--disable-gpu-vsync", "--run-all-compositor-stages-before-draw"] });
mkdirSync(path.dirname(out), { recursive: true });
const tmp = out + ".parts"; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const total = +arg("to", 0) || await (async () => { const b = await launch(); const p = await b.newPage(); await p.goto(url); await p.evaluate(() => window.__ready); const t = await p.evaluate(() => window.TOTAL); await b.close(); return t; })();
const N = Math.ceil(total * fps), per = Math.ceil(N / W);
const t0 = Date.now(); const prog = new Array(W).fill(0);
const tick = setInterval(() => { const done = prog.reduce((a, b) => a + b, 0); const el = (Date.now() - t0) / 1000; process.stdout.write(`\r${id} ${portrait ? "P" : "L"} ${done}/${N} frames ${(done / el).toFixed(1)} fps eta ${((N - done) / Math.max(1e-3, done / el) / 60).toFixed(1)} min   `); }, 10000);
async function worker(i) {
  const a = i * per, b = Math.min(N, a + per); if (a >= b) return null;
  const br = await launch();
  const p = await br.newPage(); await p.setViewport({ width: VW, height: VH, deviceScaleFactor: 1 });
  p.on("pageerror", (e) => console.log("\npageerror:", e.message));
  await p.goto(url, { waitUntil: "load" }); await p.evaluate(() => window.__ready);
  const cdp = await p.createCDPSession();
  const part = `${tmp}/part${String(i).padStart(2, "0")}.mp4`;
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", crf, "-tune", "animation", "-pix_fmt", "yuv420p", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-threads", "1", part], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((r, j) => ff.on("close", (c) => (c ? j(new Error("ffmpeg " + c)) : r())));
  for (let k = a; k < b; k++) {
    await p.evaluate((t) => window.__seek(t), k / fps);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 95, optimizeForSpeed: true });
    const buf = Buffer.from(data, "base64");
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    prog[i]++;
  }
  ff.stdin.end(); await done; await br.close(); return part;
}
const parts = (await Promise.all([...Array(W).keys()].map(worker))).filter(Boolean);
clearInterval(tick);
writeFileSync(`${tmp}/list.txt`, parts.map((p) => `file '${p}'`).join("\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${tmp}/list.txt`, "-i", wav,
  "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", out]);
rmSync(tmp, { recursive: true, force: true });
console.log(`\ndone ${out}  ${N} frames in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
