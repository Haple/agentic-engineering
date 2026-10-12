// Page screenshots for QA: node tools/shot.mjs <url> <out.png> [--w 1440] [--h 900] [--full] [--wait 1500] [--click sel]
import puppeteer from "/home/agent/.local/lib/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { readdirSync } from "node:fs";
const [u, out] = process.argv.slice(2);
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const base = "/home/agent/.cache/puppeteer/chrome-headless-shell/"; const exe = `${base}${readdirSync(base)[0]}/chrome-headless-shell-linux64/chrome-headless-shell`;
const br = await puppeteer.launch({ executablePath: exe, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
const p = await br.newPage();
const w = +arg("w", 1440), h = +arg("h", 900);
await p.setViewport({ width: w, height: h, deviceScaleFactor: +arg("dpr", 1), isMobile: w < 600, hasTouch: w < 600 });
p.on("pageerror", (e) => console.log("pageerror:", e.message));
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) console.log("console:", m.text()); });
p.on("requestfailed", (r) => console.log("reqfail:", r.url(), r.failure()?.errorText));
await p.goto(u, { waitUntil: "networkidle0" });
if (arg("click", null)) { await p.click(arg("click")); }
await new Promise((r) => setTimeout(r, +arg("wait", 1500)));
if (arg("eval", null)) console.log(await p.evaluate(arg("eval")));
await p.screenshot({ path: out, fullPage: process.argv.includes("--full") });
await br.close(); console.log("ok", out);
