// Static site builder: course/*.json + site/static/data/*.json (timed lessons) -> site/dist
// usage: node site/build.mjs [--base https://...]
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, cpSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { createHash } from "node:crypto";
const ROOT = new URL("..", import.meta.url).pathname;
const SITE = join(ROOT, "site"), DIST = join(SITE, "dist"), STATIC = join(SITE, "static");
const course = JSON.parse(readFileSync(join(ROOT, "course/course.json"), "utf8"));
const BASE = (process.argv.includes("--base") ? process.argv[process.argv.indexOf("--base") + 1] : course.site).replace(/\/$/, "");
const catalog = JSON.parse(readFileSync(join(ROOT, "research/sources.json"), "utf8"));
// prompts are hard-wrapped for the video; join mid-sentence breaks for pages and copy/paste
const unwrap = (t) => t.replace(/([a-z,])\n(?=[a-z])/g, "$1 ");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const md2txt = (s) => String(s ?? "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/(^|\s)_(.+?)_/g, "$1$2").replace(/~(.+?)~/g, "$1").replace(/`([^`]+)`/g, "$1");
const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<em>$1</em>");
const fmtT = (s) => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const fmtMin = (s) => Math.max(1, Math.round((s || 0) / 60)) + " min";

rmSync(DIST, { recursive: true, force: true }); mkdirSync(DIST, { recursive: true });
for (const d of ["css", "js", "fonts", "audio", "data", "img"]) if (existsSync(join(STATIC, d))) cpSync(join(STATIC, d), join(DIST, d), { recursive: true });
// files served at the site root (e.g. IndexNow key)
if (existsSync(join(STATIC, "root"))) cpSync(join(STATIC, "root"), DIST, { recursive: true });
// cache-bust assets
const hashOf = (f) => createHash("md5").update(readFileSync(join(STATIC, f))).digest("hex").slice(0, 8);
const V = {}; for (const f of ["css/fonts.css", "css/lesson.css", "css/site.css", "js/engine.js", "js/templates.js", "js/art.js", "js/player.js", "js/site.js", "js/lesson-page.js", "js/gsap.min.js"]) if (existsSync(join(STATIC, f))) V[f] = `/${f}?v=${hashOf(f)}`;

// ---------- data ----------
const lessons = [];
course.modules.forEach((m, mi) => m.lessons.forEach((l) => {
  const authorF = join(ROOT, "course/lessons", l.id + ".json"), timedF = join(STATIC, "data", l.id + ".json");
  const author = existsSync(authorF) ? JSON.parse(readFileSync(authorF, "utf8")) : null;
  const timed = existsSync(timedF) ? JSON.parse(readFileSync(timedF, "utf8")) : null;
  lessons.push({ ...l, module: m, moduleIndex: mi, author, timed, ready: !!(author && timed), number: lessons.length + 1 });
}));
const ready = lessons.filter((l) => l.ready);
const url = (l) => `/lessons/${l.slug}/`;
const totalMin = Math.round(ready.reduce((a, l) => a + l.timed.total, 0) / 60);
const talkCount = Object.values(catalog).filter((s) => s.kind === "talk").length;
const articleCount = Object.values(catalog).filter((s) => s.kind === "article").length;

function sourceInfo(ref) {
  const id = ref.id.startsWith("article-") || catalog[ref.id] ? ref.id : (catalog["article-" + ref.id] ? "article-" + ref.id : ref.id);
  const s = catalog[id];
  if (!s) return { id, title: ref.id, url: "#", who: "", kind: "unknown" };
  const who = (s.speakers || []).map((p) => p.name).filter(Boolean).slice(0, 3).join(", ");
  let u = s.url; if (s.kind === "talk" && ref.t) u = `${s.url}&t=${Math.floor(ref.t)}s`;
  return { id, kind: s.kind, title: s.title, url: u, who, channel: s.channel, t: ref.t };
}
function lessonSources(l) {
  const seen = new Map();
  for (const ref of l.author.sources || []) { const si = sourceInfo(ref); const key = si.id; if (!seen.has(key)) seen.set(key, { ...si, times: [] }); if (ref.t) seen.get(key).times.push(ref.t); }
  return [...seen.values()];
}

// ---------- markdown for agents ----------
function lessonMarkdown(l) {
  const a = l.author, t = l.timed;
  const lines = [`# Lesson ${l.number}: ${a.title}`, "", `> ${a.summary}`, "", `Course: ${course.title} — ${BASE}/ · Module ${l.moduleIndex + 1}: ${l.module.title} · ${fmtMin(t.total)} · Watch: ${BASE}${url(l)}`, "", "## Key takeaways", ""];
  (a.takeaways || []).forEach((x) => lines.push(`- ${md2txt(x)}`));
  if (a.practices?.length) { lines.push("", "## Practices for coding agents", ""); a.practices.forEach((x) => lines.push(`- ${md2txt(x)}`)); }
  lines.push("", "## Lesson transcript", "");
  let chap = null;
  t.scenes.forEach((sc) => {
    if (sc.chapter && sc.chapter !== chap) { chap = sc.chapter; lines.push("", `### ${chap} (${fmtT(sc.start)})`, ""); }
    if (sc.template === "quiz") { lines.push(`**Quiz:** ${md2txt(sc.params.q)}`, ...sc.params.options.map((o, i) => `${"ABCD"[i]}. ${md2txt(o)}`), `Answer: ${"ABCD"[sc.params.answer]} — ${md2txt(sc.params.explain)}`, ""); return; }
    if (sc.template === "exercise") { lines.push(sc.narration, "", "```text", unwrap(sc.params.prompt), "```", ""); return; }
    lines.push(sc.narration);
  });
  lines.push("", "## Sources", "");
  lessonSources(l).forEach((s) => lines.push(`- ${s.who ? s.who + " — " : ""}${s.title}${s.times.length ? " (at " + s.times.map(fmtT).join(", ") + ")" : ""}: ${s.url}`));
  lines.push("", `License: CC BY 4.0 · ${course.repo}`);
  return lines.join("\n") + "\n";
}

// ---------- layout ----------
const LOGO = `<svg class="logo-mark" viewBox="0 0 120 124" width="30" height="31" aria-hidden="true"><line x1="60" y1="20" x2="60" y2="8" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="7" r="7" fill="#FFD24A" stroke="currentColor" stroke-width="4"/><rect x="8" y="20" width="104" height="96" rx="30" fill="#FF5A1F" stroke="currentColor" stroke-width="6"/><rect x="22" y="36" width="76" height="50" rx="22" fill="#18181D"/><rect x="41" y="49" width="12" height="20" rx="6" fill="#fff"/><rect x="67" y="49" width="12" height="20" rx="6" fill="#fff"/></svg>`;
function page({ title, desc, path, body, og, scripts = "", head = "", type = "website", jsonld = null }) {
  const full = title === course.title ? `${course.title} — free animated course on building with AI coding agents` : `${title} · ${course.title}`;
  const ogImg = og || `${BASE}/img/og/og-default.png`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${BASE}${path}">
<meta property="og:type" content="${type}"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${BASE}${path}"><meta property="og:image" content="${ogImg}"><meta property="og:site_name" content="${esc(course.title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(full)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${ogImg}">
<meta name="theme-color" content="#F6F3EC">
<link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt">
<link rel="preload" href="/fonts/SpaceGrotesk-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${V["css/fonts.css"]}"><link rel="stylesheet" href="${V["css/site.css"]}">
${head}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="nav"><div class="wrap nav-in">
  <a class="brandlink" href="/">${LOGO}<span>Agentic Engineering</span></a>
  <nav class="nav-links"><a href="/#lessons">Lessons</a><a href="/agents/">For agents</a><a href="/sources/">Sources</a><a class="gh" href="${course.repo}" rel="noopener">GitHub</a></nav>
</div></header>
<main id="main">${body}</main>
<footer class="foot"><div class="wrap foot-in">
  <div><a class="brandlink" href="/">${LOGO}<span>Agentic Engineering</span></a><p>A free, open-source course. Content <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>, code MIT.</p></div>
  <div class="foot-links"><a href="/#lessons">All lessons</a><a href="/agents/">For agents</a><a href="/sources/">Sources</a><a href="/about/">How this was made</a><a href="/llms.txt">llms.txt</a><a href="${course.repo}">GitHub</a></div>
</div></footer>
<script src="${V["js/site.js"]}" defer></script>
${scripts}
</body></html>`;
}

// ---------- home ----------
const speakers = (() => {
  const m = new Map();
  for (const s of Object.values(catalog)) for (const p of s.speakers || []) for (const n0 of (p.name || "").split(/\s+and\s+|\s*&\s*/)) { const n = ({ "Erik S.": "Erik Schluntz" })[n0.trim()] || n0.replace(/\s*\(.*\)$/, "").trim(); if (!n || /maintainers|contributors|sloth/i.test(n) || /host|unknown|anthropic|openai|base case|team|member|narrator|author/i.test(n) || n.length > 32 || n.split(/\s+/).length < 2) continue; if (!m.has(n)) m.set(n, { name: n, role: p.role || "", n: 0 }); m.get(n).n++; }
  return [...m.values()].sort((a, b) => b.n - a.n);
})();
const lessonRow = (l) => l.ready
  ? `<a class="lrow" href="${url(l)}" data-lesson="${l.id}"><span class="lnum">${String(l.number).padStart(2, "0")}</span><span class="ltxt"><b>${esc(l.title)}</b><i>${esc(l.author.summary)}</i></span><span class="lmeta"><span class="ldone" aria-label="watched">✓</span>${fmtMin(l.timed.total)}</span></a>`
  : `<div class="lrow soon"><span class="lnum">${String(l.number).padStart(2, "0")}</span><span class="ltxt"><b>${esc(l.title)}</b><i>Coming soon</i></span><span class="lmeta">—</span></div>`;
const home = page({
  title: course.title, path: "/", desc: course.description,
  jsonld: { "@context": "https://schema.org", "@type": "Course", name: "Agentic Engineering", description: course.description, url: BASE + "/", isAccessibleForFree: true, inLanguage: "en", license: "https://creativecommons.org/licenses/by/4.0/", provider: { "@type": "Organization", name: "Agentic Engineering (open source)", sameAs: course.repo }, hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: `PT${totalMin}M` }, hasPart: ready.map((l) => ({ "@type": "LearningResource", name: l.title, url: BASE + url(l) })) },
  body: `
<section class="hero"><div class="wrap hero-in">
  <div class="hero-txt">
    <div class="eyebrow">Free course · ${lessons.length} animated lessons · open source</div>
    <h1>Learn <span class="mk">agentic engineering</span></h1>
    <p class="lede">Build real software with AI coding agents like Claude Code, Codex and Cursor. Every lesson is distilled from ${talkCount} talks and ${articleCount} articles by the people who build these tools, and every claim links to its source.</p>
    <div class="cta"><a class="btn primary" href="${ready[0] ? url(ready[0]) : "#lessons"}">Start lesson 1 →</a><a class="btn" href="/agents/">Let your agent take it</a></div>
    <ul class="facts"><li><b>${ready.length ? totalMin + " min" : "—"}</b> of lessons</li><li><b>${talkCount + articleCount}</b> sources</li><li><b>0</b> sign-ups</li></ul>
  </div>
  <div class="hero-play"><div class="mini" id="mini" data-src="/data/${ready[0]?.id}.json"><div class="stage"></div></div><p class="mini-cap">Not a video file: every lesson is animated live by code in your browser.</p></div>
</div></section>
<section class="band"><div class="wrap band-in">
  <div><h3>For developers</h3><p>Go from “AI writes some snippets” to running agents that ship reviewed, tested work.</p></div>
  <div><h3>For tech leads</h3><p>Context, verification, review, security and team practices that keep the quality bar high.</p></div>
  <div><h3>For your agent</h3><p>Install the course as a skill and your coding agent follows the same practices you learn.</p></div>
</div></section>
<section id="lessons" class="wrap curriculum">
  <h2>The course</h2>
  <div class="progress-line"><span id="prog-txt">Your progress is saved in this browser.</span><div class="pbar"><i id="prog-bar"></i></div></div>
  ${course.modules.map((m, mi) => `<div class="module"><div class="mhead"><span class="mnum">Module ${mi + 1}</span><h3>${esc(m.title)}</h3><p>${esc(m.blurb)}</p></div><div class="lrows">${lessons.filter((l) => l.moduleIndex === mi).map(lessonRow).join("")}</div></div>`).join("")}
</section>
<section class="wrap agents-teaser">
  <div class="at-txt"><div class="eyebrow">Your agent can take this course too</div><h2>One course, two students</h2><p>The lessons double as an agent skill. Install it and Claude Code, Codex, Cursor or any agent that reads skills will follow the practices from the course: explore before editing, plan, prove its work, keep context clean.</p><a class="btn" href="/agents/">Agent setup →</a></div>
  <pre class="code-card"><span class="c">$</span> npx skills add Haple/agentic-engineering\n\n<span class="d"># or point any agent at the course</span>\n<span class="c">$</span> curl ${BASE}/llms.txt</pre>
</section>
<section class="wrap people">
  <h2>Distilled from the people building it</h2>
  <p class="sub">Talks, interviews and essays from engineers at Anthropic, OpenAI, Cursor, Factory, Airbnb, AWS and independent practitioners. <a href="/sources/">See all ${talkCount + articleCount} sources →</a></p>
  <div class="names">${speakers.slice(0, 42).map((p) => `<span>${esc(p.name)}</span>`).join("")}</div>
  <p class="fine">Not affiliated with or endorsed by any of the people or companies cited. Quotes link to the original talks.</p>
</section>
<section class="wrap faq">
  <h2>Questions</h2>
  <details><summary>Is it really free?</summary><p>Yes. No sign-up, no paywall, no tracking cookies. The content is CC BY 4.0 and the code is MIT on <a href="${course.repo}">GitHub</a>.</p></details>
  <details><summary>Which tools does it cover?</summary><p>The practices apply to any coding agent: Claude Code, OpenAI Codex, Cursor, GitHub Copilot's agent mode, Amp, OpenCode and others. Examples mostly use Claude Code and Codex because that's where most of the source material comes from.</p></details>
  <details><summary>Are these videos?</summary><p>Sort of. Each lesson is a scene graph rendered live by JavaScript and synced to narration, so it's tiny, crisp at any size, scrubbable and searchable. The narration is an AI voice. Every lesson also has a full transcript and a Markdown version.</p></details>
  <details><summary>Who made this, and how?</summary><p>It was researched and produced with AI agents, which felt fitting. Talk transcripts were distilled into cited insights, then written into lessons and animated by code. <a href="/about/">Read how it was made</a>.</p></details>
  <details><summary>I found a mistake.</summary><p>Please <a href="${course.repo}/issues">open an issue</a>. Every claim links to its source, so corrections are easy to check.</p></details>
</section>`,
  scripts: `<script src="${V["js/gsap.min.js"]}" defer></script><script src="${V["js/art.js"]}" defer></script><script src="${V["js/templates.js"]}" defer></script><script src="${V["js/engine.js"]}" defer></script><link rel="stylesheet" href="${V["css/lesson.css"]}">`,
});
writeFileSync(join(DIST, "index.html"), home);

// ---------- lesson pages ----------
for (const [k, l] of lessons.entries()) {
  if (!l.ready) continue;
  const a = l.author, t = l.timed;
  const prev = lessons.slice(0, k).reverse().find((x) => x.ready), next = lessons.slice(k + 1).find((x) => x.ready);
  const nextAny = lessons[k + 1];
  const srcs = lessonSources(l);
  const mdUrl = `${BASE}/lessons/${l.slug}.md`;
  const askText = `I'm taking the free Agentic Engineering course. Read lesson ${l.number}, "${a.title}": ${mdUrl}\n\nThen quiz me on it with 3 questions, one at a time, and help me apply it to a project I'm working on.`;
  const ex = t.scenes.find((s) => s.template === "exercise");
  let chap = null;
  const transcript = t.scenes.map((sc, i) => {
    let h = "";
    if (sc.chapter && sc.chapter !== chap) { chap = sc.chapter; h = `<h4>${esc(chap)}</h4>`; }
    return `${h}<p class="tr-p" data-t="${sc.start}" data-i="${i}"><button class="tr-t" data-seek="${sc.start}">${fmtT(sc.start)}</button>${esc(sc.narration)}</p>`;
  }).join("");
  const body = `
<div class="wrap lesson">
  <div class="crumbs"><a href="/#lessons">Course</a><span>›</span><span>Module ${l.moduleIndex + 1}: ${esc(l.module.title)}</span><span>›</span><span>Lesson ${l.number}</span></div>
  <h1 class="ltitle">${esc(a.title)}</h1>
  <div id="player" class="player-host" data-src="/data/${l.id}.json" data-audio="${t.audio}" data-id="${l.id}" data-next="${next ? url(next) : "/agents/"}" data-next-title="${next ? esc(next.title) : "let your agent take the course"}"${next ? "" : ' data-last="1"'}></div>
  <noscript><p class="nojs">This lesson is animated with JavaScript. Read the <a href="/lessons/${l.slug}.md">text version</a>.</p></noscript>
  <div class="actions">
    ${prev ? `<a class="btn small" href="${url(prev)}">← ${String(prev.number).padStart(2, "0")}</a>` : ""}
    <button class="btn small" id="mark-done" type="button">Mark as done</button>
    <a class="btn small" href="https://claude.ai/new?q=${encodeURIComponent(askText)}" target="_blank" rel="noopener">Ask Claude about it</a>
    <a class="btn small" href="https://chatgpt.com/?q=${encodeURIComponent(askText)}" target="_blank" rel="noopener">Ask ChatGPT</a>
    <a class="btn small ghost" href="/lessons/${l.slug}.md">Markdown</a>
    <button class="btn small ghost" id="share" type="button" data-url="${BASE}${url(l)}" data-title="${esc(a.title)}">Share</button>
    ${next ? `<a class="btn small primary right" href="${url(next)}">Next: ${esc(next.title)} →</a>` : nextAny ? `<span class="btn small ghost right">Next: ${esc(nextAny.title)} (soon)</span>` : ""}
  </div>
  <div class="lgrid">
    <article class="lmain">
      <p class="lsum">${esc(a.summary)}</p>
      <section><h2>Key takeaways</h2><ul class="tk">${(a.takeaways || []).map((x) => `<li>${inline(x)}</li>`).join("")}</ul></section>
      ${ex ? `<section class="tryit"><h2>Try it with your agent</h2><p>${esc(ex.params.intro || "")}</p><div class="code-card copyable"><button class="copy" type="button">Copy</button><pre>${esc(unwrap(ex.params.prompt))}</pre></div></section>` : ""}
      <section><h2>Transcript</h2><div class="transcript">${transcript}</div></section>
    </article>
    <aside class="lside">
      <section><h3>Sources cited</h3><ul class="srcs">${srcs.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener"><b>${esc(s.who || (s.kind === "article" ? "Article" : s.channel || ""))}</b><span>${esc(s.title)}</span>${s.times.length ? `<i>${s.times.map(fmtT).join(" · ")}</i>` : ""}</a></li>`).join("")}</ul></section>
      ${a.practices?.length ? `<section><h3>What your agent learns</h3><ul class="pr">${a.practices.map((x) => `<li>${inline(x)}</li>`).join("")}</ul><a class="more" href="/agents/">Install the course skill →</a></section>` : ""}
      <section><h3>Module ${l.moduleIndex + 1}</h3><ol class="mlist">${lessons.filter((x) => x.moduleIndex === l.moduleIndex).map((x) => x.ready ? `<li class="${x.id === l.id ? "cur" : ""}"><a href="${url(x)}" data-lesson="${x.id}">${esc(x.title)}</a></li>` : `<li class="soon">${esc(x.title)}</li>`).join("")}</ol></section>
    </aside>
  </div>
</div>`;
  const html = page({
    title: a.title, path: url(l), desc: a.summary, type: "article", body, og: existsSync(join(STATIC, "img/og", l.slug + ".png")) ? `${BASE}/img/og/${l.slug}.png` : null,
    jsonld: { "@context": "https://schema.org", "@type": "LearningResource", name: a.title, description: a.summary, url: BASE + url(l), isAccessibleForFree: true, inLanguage: "en", timeRequired: `PT${Math.round(t.total / 60)}M`, isPartOf: { "@type": "Course", name: course.title, url: BASE + "/" }, learningResourceType: "Lesson", teaches: (a.takeaways || []).map(md2txt), license: "https://creativecommons.org/licenses/by/4.0/" },
    head: `<link rel="stylesheet" href="${V["css/lesson.css"]}"><link rel="alternate" type="text/markdown" href="/lessons/${l.slug}.md"><link rel="preload" as="fetch" href="/data/${l.id}.json" crossorigin>`,
    scripts: `<script src="${V["js/gsap.min.js"]}" defer></script><script src="${V["js/art.js"]}" defer></script><script src="${V["js/templates.js"]}" defer></script><script src="${V["js/engine.js"]}" defer></script><script src="${V["js/player.js"]}" defer></script><script src="${V["js/lesson-page.js"]}" defer></script>`,
  });
  mkdirSync(join(DIST, "lessons", l.slug), { recursive: true });
  writeFileSync(join(DIST, "lessons", l.slug, "index.html"), html);
  writeFileSync(join(DIST, "lessons", l.slug + ".md"), lessonMarkdown(l));
}

// ---------- sources page ----------
const citedBy = new Map();
for (const l of ready) for (const s of lessonSources(l)) { if (!citedBy.has(s.id)) citedBy.set(s.id, []); citedBy.get(s.id).push(l); }
const srcList = Object.values(catalog).sort((a, b) => (citedBy.get(b.id)?.length || 0) - (citedBy.get(a.id)?.length || 0) || String(a.title).localeCompare(String(b.title)));
mkdirSync(join(DIST, "sources"), { recursive: true });
writeFileSync(join(DIST, "sources", "index.html"), page({
  title: "Sources", path: "/sources/", desc: `The ${talkCount} talks and ${articleCount} articles this course was distilled from.`,
  body: `<div class="wrap prose"><h1>Sources</h1><p class="lede">The course was distilled from ${talkCount} talks and interviews and ${articleCount} articles and guides. Quotes in the lessons link to the exact moment in each talk. Not affiliated with or endorsed by anyone listed.</p>
  <div class="srcgrid">${srcList.map((s) => `<a class="srccard" href="${esc(s.url)}" target="_blank" rel="noopener"><span class="kind">${s.kind === "talk" ? "Talk" : "Article"}</span><b>${esc(s.title)}</b><span class="who">${esc((s.speakers || []).map((p) => p.name).slice(0, 3).join(", ") || s.channel || "")}</span>${s.summary ? `<span class="sum">${esc(s.summary)}</span>` : ""}${citedBy.get(s.id) ? `<span class="cited">Cited in ${citedBy.get(s.id).map((l) => "lesson " + l.number).join(", ")}</span>` : ""}</a>`).join("")}</div></div>`,
}));

// ---------- agents page ----------
mkdirSync(join(DIST, "agents"), { recursive: true });
writeFileSync(join(DIST, "agents", "index.html"), page({
  title: "For agents", path: "/agents/", desc: "Let your coding agent take the Agentic Engineering course: install it as a skill, or read the course as Markdown and llms.txt.",
  body: `<div class="wrap prose"><h1>For agents</h1><p class="lede">Every lesson is also written for machines. Your coding agent can learn the same practices you do, or teach you the course right in your terminal.</p>
  <h2>1. Install the course as a skill</h2><p>Works with Claude Code, Codex, Cursor, OpenCode and any agent that supports <a href="https://agentskills.io">Agent Skills</a>.</p>
  <div class="code-card copyable"><button class="copy" type="button">Copy</button><pre>npx skills add Haple/agentic-engineering</pre></div>
  <p>In Claude Code you can also add it as a plugin marketplace:</p>
  <div class="code-card copyable"><button class="copy" type="button">Copy</button><pre>/plugin marketplace add Haple/agentic-engineering
/plugin install agentic-engineering@agentic-engineering</pre></div>
  <p>This installs two skills: <b>agentic-engineering</b>, the practices from the course that your agent applies while it works (explore before editing, plan, verify, keep context clean, stay safe), and <b>agentic-engineering-tutor</b>, which teaches you the course interactively. Try: <code>teach me lesson 1 of agentic engineering</code>.</p>
  <h2>2. Read the course directly</h2>
  <ul><li><a href="/llms.txt">/llms.txt</a> — index of every lesson in Markdown</li><li><a href="/llms-full.txt">/llms-full.txt</a> — the entire course in one file</li><li><code>/lessons/&lt;slug&gt;.md</code> — one lesson, with transcript, takeaways, practices and sources</li><li><a href="/api/course.json">/api/course.json</a> — structured course data</li></ul>
  <h2>3. Paste this into any agent</h2>
  <div class="code-card copyable"><button class="copy" type="button">Copy</button><pre>Read ${BASE}/llms.txt and teach me the Agentic Engineering course,
one lesson at a time. After each lesson, quiz me and help me apply it
to the project in this directory.</pre></div></div>`,
}));

// ---------- about ----------
mkdirSync(join(DIST, "about"), { recursive: true });
writeFileSync(join(DIST, "about", "index.html"), page({
  title: "How this course was made", path: "/about/", desc: "How the Agentic Engineering course was researched, written and animated, mostly by AI agents.",
  body: `<div class="wrap prose"><h1>How this course was made</h1>
  <p class="lede">A course about building with agents, built with agents. Here's the pipeline, so you can judge what to trust.</p>
  <ol>
  <li><b>Sources.</b> We searched for the most useful talks on agentic coding from 2025 and 2026, chose ${talkCount} of them (talks by people who build coding agents or use them seriously), and fetched their transcripts. We added ${articleCount} written guides and essays.</li>
  <li><b>Distillation.</b> A model read every transcript and extracted specific, citable insights, each with a verbatim quote and timestamp. Quotes were automatically checked against the transcript text.</li>
  <li><b>Writing.</b> Lessons were written from those insights by Claude, with the cited sources attached to each lesson. Claims and numbers were checked against the source text.</li>
  <li><b>Animation.</b> Lessons are not video files. Each one is a list of scenes (diagrams, terminals, code, charts, quizzes) rendered live by a small JavaScript engine and synced word-by-word to the narration.</li>
  <li><b>Narration.</b> The voice is an AI voice (ElevenLabs).</li>
  </ol>
  <p>Mistakes are possible. If you spot one, <a href="${course.repo}/issues">open an issue</a> with the lesson and timestamp. The source code for the engine, the lessons and the build is all on <a href="${course.repo}">GitHub</a>.</p></div>`,
}));

// ---------- 404 ----------
writeFileSync(join(DIST, "404.html"), page({ title: "Not found", path: "/404", desc: "Page not found.", body: `<div class="wrap prose"><h1>Lost the context?</h1><p class="lede">That page doesn't exist. <a href="/">Back to the course</a>.</p></div>` }));

// ---------- llms.txt, llms-full.txt, api, sitemap, robots ----------
const llms = [`# ${course.title}`, "", `> ${course.description}`, "", "Each lesson below is a Markdown file with a summary, key takeaways, practices for coding agents, a full transcript and cited sources (talks link to exact timestamps). Content is CC BY 4.0.", "", "## Lessons", ""];
course.modules.forEach((m, mi) => { llms.push(`### Module ${mi + 1}: ${m.title}`, ""); lessons.filter((l) => l.moduleIndex === mi && l.ready).forEach((l) => llms.push(`- [Lesson ${l.number}: ${l.author.title}](${BASE}/lessons/${l.slug}.md): ${l.author.summary}`)); llms.push(""); });
llms.push("## For agents", "", `- [Install as an agent skill](${BASE}/agents/): \`npx skills add Haple/agentic-engineering\``, `- [Full course in one file](${BASE}/llms-full.txt)`, `- [Structured course data](${BASE}/api/course.json)`, "", "## Optional", "", `- [All sources](${BASE}/sources/): ${talkCount} talks and ${articleCount} articles`, `- [Source code](${course.repo})`, "");
writeFileSync(join(DIST, "llms.txt"), llms.join("\n"));
writeFileSync(join(DIST, "llms-full.txt"), `# ${course.title}\n\n> ${course.description}\n\n` + ready.map(lessonMarkdown).join("\n---\n\n"));
mkdirSync(join(DIST, "api"), { recursive: true });
writeFileSync(join(DIST, "api", "course.json"), JSON.stringify({ title: course.title, url: BASE, description: course.description, license: "CC-BY-4.0", modules: course.modules.map((m, mi) => ({ title: m.title, lessons: lessons.filter((l) => l.moduleIndex === mi).map((l) => l.ready ? { number: l.number, title: l.author.title, url: BASE + url(l), markdown: `${BASE}/lessons/${l.slug}.md`, minutes: Math.round(l.timed.total / 60), summary: l.author.summary, takeaways: (l.author.takeaways || []).map(md2txt), practices: (l.author.practices || []).map(md2txt) } : { number: l.number, title: l.title, status: "coming soon" }) })) }, null, 1));
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["/", "/agents/", "/sources/", "/about/", ...ready.map(url)].map((p) => `<url><loc>${BASE}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`);
writeFileSync(join(DIST, "_headers"), `/data/*\n  Cache-Control: public, max-age=3600\n/audio/*\n  Cache-Control: public, max-age=86400\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/*.md\n  Content-Type: text/markdown; charset=utf-8\n  Access-Control-Allow-Origin: *\n/llms.txt\n  Access-Control-Allow-Origin: *\n/llms-full.txt\n  Access-Control-Allow-Origin: *\n/api/*\n  Access-Control-Allow-Origin: *\n`);
console.log(JSON.stringify({ base: BASE, lessons_ready: ready.length, lessons_total: lessons.length, minutes: totalMin, sources: talkCount + articleCount }));
