// OG images: title scene of each lesson -> site/static/img/og/<slug>.png (1200x630), plus og-default.png
import puppeteer from "/home/agent/.local/lib/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const ROOT = new URL("..", import.meta.url).pathname;
const course = JSON.parse(readFileSync(ROOT + "course/course.json", "utf8"));
const base = "/home/agent/.cache/puppeteer/chrome-headless-shell/"; const exe = `${base}${readdirSync(base)[0]}/chrome-headless-shell-linux64/chrome-headless-shell`;
const br = await puppeteer.launch({ executablePath: exe, args: ["--no-sandbox", "--force-color-profile=srgb"] });
const p = await br.newPage(); await p.setViewport({ width: 1920, height: 1080 });
const out = ROOT + "site/static/img/og/"; mkdirSync(out, { recursive: true });
// synthetic home card
const home = { id: "home", number: null, title: "Agentic Engineering", brand: true, total: 6, scenes: [{ template: "title", start: 0, dur: 6, words: [], narration: "", params: { kicker: "Free course · 24 animated lessons", title: "Learn *agentic engineering*", subtitle: "Build real software with AI coding agents. Distilled from 126 talks and articles.", bubble: "Your agent can take it too.", human: true } }] };
writeFileSync(ROOT + ".serve/testdata/og-home.json", JSON.stringify(home));
const jobs = [["/testdata/og-home.json", "og-default"]];
course.modules.forEach((m) => m.lessons.forEach((l) => jobs.push([`/data/${l.id}.json`, l.slug])));
for (const [src, name] of jobs) {
  await p.goto(`http://127.0.0.1:4730/dev/stage.html?src=${encodeURIComponent(src)}&mode=capture&t=0`, { waitUntil: "load" });
  await p.evaluate(() => window.__ready);
  await p.evaluate(() => { const S = window.L.scenes[0]; window.__seek(Math.min(S.t0 + S.dur - 0.3, S.t0 + 4.5)); document.querySelector(".cap").style.display = "none"; document.querySelector(".stage-progress").style.display = "none"; });
  const raw = `${out}${name}.raw.png`;
  await p.screenshot({ path: raw, clip: { x: 0, y: 30, width: 1920, height: 1005 } });
  execFileSync("python3", ["-c", `from PIL import Image; im=Image.open("${raw}"); im=im.resize((1200,628), Image.LANCZOS); im.save("${out}${name}.png", optimize=True)`]);
  execFileSync("rm", [raw]);
  process.stdout.write(name + " ");
}
await br.close(); console.log("\ndone");
