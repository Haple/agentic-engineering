// QA stills: one screenshot per scene at fraction f of the scene (default .85) -> contact sheet.
// usage: node tools/stills.mjs <data-url-path> <outdir> [--portrait] [--f 0.85] [--scenes 0,3,5] [--scale 0.5]
import puppeteer from "/home/agent/.local/lib/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { readdirSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [src, out] = process.argv.slice(2);
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const portrait = process.argv.includes("--portrait");
const fr = (arg("f", "0.85")).split(",").map(Number);
const only = arg("scenes", null)?.split(",").map(Number);
const port = process.env.PORT || 4730;
mkdirSync(out, { recursive: true });
const base = "/home/agent/.cache/puppeteer/chrome-headless-shell/"; const exe = `${base}${readdirSync(base)[0]}/chrome-headless-shell-linux64/chrome-headless-shell`;
const br = await puppeteer.launch({ executablePath: exe, args: ["--no-sandbox", "--force-color-profile=srgb"] });
const p = await br.newPage();
const W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
await p.setViewport({ width: W, height: H, deviceScaleFactor: +arg("scale", "0.5") });
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("console:", m.text()); });
p.on("pageerror", (e) => console.log("pageerror:", e.message));
await p.goto(`http://127.0.0.1:${port}/dev/stage.html?src=${encodeURIComponent(src)}&portrait=${portrait ? 1 : 0}&mode=capture`, { waitUntil: "load" });
await p.evaluate(() => window.__ready);
const scenes = await p.evaluate(() => window.L.scenes.map((S) => [S.t0, S.dur, S.sc.template]));
const errs = await p.evaluate(() => window.L.cueErrors);
if (errs.length) console.log("cue errors:\n " + errs.join("\n "));
const files = [];
for (const [i, [t0, dur, tpl]] of scenes.entries()) {
  if (only && !only.includes(i)) continue;
  for (const f of fr) {
    await p.evaluate((t) => window.__seek(t), t0 + dur * f);
    const fn = `${out}/s${String(i).padStart(2, "0")}-${tpl}-${Math.round(f * 100)}.png`;
    await p.screenshot({ path: fn }); files.push(fn);
  }
}
await br.close();
const cols = portrait ? 5 : 4;
execFileSync("python3", ["-c", `
import sys,math
from PIL import Image
fs=sys.argv[2:]; cols=int(sys.argv[1]); ims=[Image.open(f) for f in fs]; w,h=ims[0].size
rows=math.ceil(len(ims)/cols); sheet=Image.new("RGB",(cols*w,rows*h),(30,30,30))
for k,im in enumerate(ims): sheet.paste(im,((k%cols)*w,(k//cols)*h))
sheet.save(sys.argv[-1] if False else "${out}/sheet.jpg",quality=82)
`, String(cols), ...files]);
console.log("ok", files.length, "stills ->", out + "/sheet.jpg");
