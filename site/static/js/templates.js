// Scene templates. Each is (S, params) => builds DOM into S.cam and schedules tweens on S.tl.
(function () {
  "use strict";
  const A = window.AE_ART;
  const T = {};
  const fmtT = (s) => { s = Math.round(s || 0); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0"); };
  const lenClass = (s, a, b) => (String(s || "").length > b ? "s" : String(s || "").length > a ? "m" : "l");
  T.defaultBg = (name) => ({ title: "grid", quiz: "grid", recap: "grid", venn: "ink", stat: "paper", wall: "grid" }[name] || "paper");

  // ---------------- title ----------------
  T.title = (S, p) => {
    const L = S.L.data;
    const root = S.add(`<div class="ti">
      <div class="ti-text">
        <div class="ti-kick"><span class="chip">${S.esc(p.kicker || "Lesson " + L.number)}</span>${p.module ? `<span class="ti-mod">${S.esc(p.module)}</span>` : ""}</div>
        <h1 class="ti-h">${S.md(p.title || L.title)}</h1>
        ${p.subtitle ? `<p class="ti-sub">${S.md(p.subtitle)}</p>` : ""}
      </div>
      <div class="ti-art">${p.human ? `<span class="ti-human">${A.human({ size: S.portrait ? 200 : 210 })}</span>` : ""}${A.agent({ size: S.portrait ? 340 : 380, mood: p.mood || "normal" })}${p.bubble ? `<div class="bubble">${S.esc(p.bubble)}</div>` : ""}</div>
    </div>`);
    const t = S.t0;
    S.slideL(t + 0.1, root.querySelector(".ti-kick"));
    S.words(t + 0.3, root.querySelector(".ti-h"), 0.08);
    if (p.subtitle) S.rise(t + 1.0, root.querySelector(".ti-sub"));
    S.pop(t + 0.45, root.querySelector(".ti-art"), 0.75);
    A.animateAgent(S, root.querySelector(".agent"));
    if (p.human) A.animateAgent(S, root.querySelector(".human"), { phase: 1.3, bob: 3 });
    if (p.bubble) S.pop(S.cue(p.bubble_at, 0.4), root.querySelector(".bubble"));
    S.marks(root, t + 1.4, t + 1.2);
  };

  // ---------------- statement ----------------
  T.statement = (S, p) => {
    const txt = String(p.text || "");
    const size = p.size || (txt.length > 90 ? "s" : txt.length > 55 ? "m" : txt.length > 28 ? "l" : "xl");
    const art = p.art ? (p.art === "agent" ? A.agent({ size: S.portrait ? 220 : 260, mood: p.mood }) : p.art === "human" ? A.human({ size: 240 }) : `<span class="st-ico">${A.icon(p.art, S.portrait ? 150 : 190)}</span>`) : "";
    const root = S.add(`<div class="stm align-${p.align || "left"} ${art ? "has-art" : ""}">
      <div class="stm-text">${p.eyebrow ? `<div class="eyebrow">${S.esc(p.eyebrow)}</div>` : ""}<h2 class="stm-h size-${size}">${S.md(txt)}</h2>${p.sub ? `<p class="stm-sub">${S.md(p.sub)}</p>` : ""}</div>
      ${art ? `<div class="stm-art tone-${p.tone || "agent"}">${art}</div>` : ""}
    </div>`);
    const t = S.cue(p.at, 0.0);
    if (p.eyebrow) S.slideL(t, root.querySelector(".eyebrow"));
    const h2 = root.querySelector(".stm-h");
    if (p.sync === false) S.words(t + 0.1, h2, 0.06); else S.say(h2, t + 0.05);
    S.marks(h2, t + 0.8, t + 0.2);
    if (p.sub) S.rise(S.cue(p.sub_at, 0.5), root.querySelector(".stm-sub"));
    if (art) { S.pop(t + 0.3, root.querySelector(".stm-art")); A.animateAgent(S, root.querySelector(".stm-art .agent")); }
  };

  // ---------------- quote ----------------
  T.quote = (S, p) => {
    const who = p.who || "";
    const initials = who.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const root = S.add(`<figure class="qt">
      <div class="qt-mark">&ldquo;</div>
      <blockquote class="qt-text size-${lenClass(p.text, 90, 170)}">${S.md(p.text)}</blockquote>
      <figcaption class="qt-cap"><span class="qt-av">${S.esc(initials)}</span><span class="qt-who"><b>${S.esc(who)}</b>${p.role ? `<i>${S.esc(p.role)}</i>` : ""}</span>
      ${p.src ? `<span class="qt-src">${A.icon("eye", 26)}<span>${S.esc(p.src)}${p.t != null ? " &middot; " + fmtT(p.t) : ""}</span></span>` : ""}</figcaption>
    </figure>`);
    const t = S.cue(p.at, 0.02);
    S.pop(t, root.querySelector(".qt-mark"), 0.5);
    const bq = root.querySelector(".qt-text");
    if (p.sync === false) S.words(t + 0.2, bq, 0.045); else S.say(bq, t + 0.15);
    S.rise(t + 0.6, root.querySelector(".qt-cap"));
    S.marks(bq, t + 1.2, t + 0.4);
  };

  // ---------------- terminal ----------------
  const PFX = { cmd: "$", you: "&rsaquo;", agent: "&#9679;", tool: "&#9135;", ok: "&#10003;", err: "&#10007;", warn: "!", add: "+", del: "&minus;", out: "", dim: "", blank: "" };
  T.terminal = (S, p) => {
    const lines = p.lines || [];
    const root = S.add(`<div class="term ${p.wide ? "wide" : ""}">
      <div class="term-bar"><i></i><i></i><i></i><span>${S.esc(p.title || "~/project")}</span></div>
      <div class="term-body"><div class="term-scroll"></div></div>
    </div>`);
    if (p.caption) S.add(`<div class="term-cap">${S.md(p.caption)}</div>`);
    const scroll = root.querySelector(".term-scroll");
    S.rise(S.t0 + 0.02, root, 0.55, 30);
    if (p.caption) S.rise(S.cue(p.caption_at, 0.1), S.cam.querySelector(".term-cap"));
    const times = S.spread(lines, 0.05, 0.85);
    const LH = S.portrait ? 50 : 56;
    const maxV = p.max || (S.portrait ? 18 : 12);
    let last = S.t0 + 0.35;
    lines.forEach((ln, k) => {
      const kind = ln.k || "out";
      const el = S.h(`<div class="tl k-${kind}"><span class="pfx">${PFX[kind] ?? ""}</span><span class="tx"></span></div>`);
      scroll.appendChild(el);
      const tx = el.querySelector(".tx");
      const t = Math.max(times[k], last + 0.1);
      if ((kind === "cmd" || kind === "you") && p.typing !== false) { S.fade(t, el, 0.12); last = S.type(t + 0.08, tx, ln.text, kind === "you" ? 60 : 34); }
      else { tx.innerHTML = S.md(ln.text || ""); S.inn(t, el, { y: 8 }, 0.22); last = t + 0.08; }
      if (k >= maxV) S.to(t, scroll, { y: -(k - maxV + 1) * LH, duration: 0.28 });
    });
  };

  // ---------------- code (with optional diff + highlights) ----------------
  const KW = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|def|async|await|new|true|false|null|None|True|False|try|catch|except|raise|throw|in|of|with|as|yield|lambda|type|interface|public|private)\b/g;
  function hl(line, lang) {
    if (lang === "md" || lang === "text") return S_esc(line).replace(/^(#{1,6} .*)$/, '<span class="c-h">$1</span>').replace(/(`[^`]+`)/g, '<span class="c-s">$1</span>').replace(/^(\s*[-*] )/, '<span class="c-k">$1</span>');
    if (lang === "json") return S_esc(line).replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="c-k">$1</span>$2').replace(/(:\s*)(&quot;.*?&quot;)/g, '$1<span class="c-s">$2</span>');
    const out = []; let rest = line;
    const m = rest.match(/(\/\/.*|#(?!!).*|--\s.*)$/);
    let comment = "";
    if (m && !/["'`].*(\/\/|#).*["'`]/.test(rest.slice(0, m.index + 2))) { comment = m[0]; rest = rest.slice(0, m.index); }
    rest = S_esc(rest).replace(/(&quot;.*?&quot;|'[^']*'|`[^`]*`)/g, "\u0001$1\u0002").replace(KW, (k) => `\u0003${k}\u0004`).replace(/\b(\d+(\.\d+)?)\b/g, "\u0005$1\u0006");
    rest = rest.replace(/\u0001/g, '<span class="c-s">').replace(/\u0003/g, '<span class="c-k">').replace(/\u0005/g, '<span class="c-n">').replace(/[\u0002\u0004\u0006]/g, "</span>");
    out.push(rest);
    if (comment) out.push(`<span class="c-c">${S_esc(comment)}</span>`);
    return out.join("");
  }
  function S_esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  T.code = (S, p) => {
    const lines = (p.lines || String(p.code || "").split("\n"));
    const lang = p.lang || "ts";
    const rows = lines.map((l, i) => {
      let cls = "", body = l;
      if (p.diff && /^\+/.test(l)) { cls = "d-add"; body = l.slice(1); }
      else if (p.diff && /^-/.test(l)) { cls = "d-del"; body = l.slice(1); }
      else if (p.diff && /^ /.test(l)) body = l.slice(1);
      return `<div class="cl ${cls}"><span class="ln">${p.diff ? (cls === "d-add" ? "+" : cls === "d-del" ? "&minus;" : "") : i + 1}</span><span class="cx">${hl(body, lang) || "&nbsp;"}</span></div>`;
    }).join("");
    const root = S.add(`<div class="code ${p.diff ? "is-diff" : ""}">
      <div class="code-bar">${A.icon("file", 26)}<span class="fname">${S.esc(p.file || "untitled")}</span>${p.badge ? `<span class="badge">${S.esc(p.badge)}</span>` : ""}</div>
      <div class="code-body"><div class="code-hls"></div>${rows}</div>
    </div>`);
    if (p.caption) S.add(`<div class="term-cap">${S.md(p.caption)}</div>`);
    S.rise(S.t0 + 0.02, root, 0.55, 30);
    const cls = root.querySelectorAll(".cl");
    const tLines = S.cue(p.at, 0.04) + 0.25;
    const gap = Math.min(0.12, (S.dur * 0.45) / Math.max(1, cls.length));
    cls.forEach((c, k) => S.inn(tLines + k * gap, c, { x: -14 }, 0.25));
    if (p.caption) S.rise(S.cue(p.caption_at, 0.15), S.cam.querySelector(".term-cap"));
    const LH = S.portrait ? 46 : 50;
    (p.hl || []).forEach((h, k) => {
      const band = S.h(`<div class="hlb tone-${h.tone || "agent"}" style="top:${(h.from - 1) * LH + 14}px;height:${(h.to - h.from + 1) * LH}px">${h.label ? `<span class="hlb-l">${S.esc(h.label)}</span>` : ""}</div>`);
      root.querySelector(".code-hls").appendChild(band);
      S.inn(S.cue(h.at, 0.45 + k * 0.15), band, { scaleX: 0.2 }, 0.4);
    });
  };

  // ---------------- chat ----------------
  T.chat = (S, p) => {
    const msgs = p.messages || [];
    const root = S.add(`<div class="chat">${p.title ? `<div class="chat-h">${S.md(p.title)}</div>` : ""}<div class="chat-list"></div></div>`);
    const list = root.querySelector(".chat-list");
    const times = S.spread(msgs, 0.04, 0.8);
    if (p.title) S.rise(S.t0, root.querySelector(".chat-h"));
    msgs.forEach((m, k) => {
      const ag = m.from === "agent";
      const el = S.h(`<div class="msg from-${ag ? "agent" : "you"} ${m.tone ? "tone-" + m.tone : ""}"><span class="av">${ag ? A.agent({ size: 76 }) : A.human({ size: 72 })}</span><div class="bub">${m.label ? `<b class="bub-l">${S.esc(m.label)}</b>` : ""}${S.md(m.text)}</div></div>`);
      list.appendChild(el);
      const t = times[k];
      if (ag) {
        const dots = S.h(`<div class="msg from-agent typing"><span class="av"></span><div class="bub"><i></i><i></i><i></i></div></div>`);
        list.insertBefore(dots, el);
        gsap.set(dots, { display: "none" });
        S.tl.set(dots, { display: "flex", autoAlpha: 1 }, Math.max(S.t0, t - 0.6));
        S.tl.set(dots, { display: "none" }, t);
        A.animateAgent(S, el.querySelector(".agent"), { phase: k, bob: 2 });
      }
      S.inn(t, el, { y: 26, scale: 0.96 }, 0.4, "back.out(1.4)");
      S.marks(el, t + 0.4, t + 0.3);
    });
  };

  // ---------------- loop (cycle diagram) ----------------
  T.loop = (S, p) => {
    const steps = p.steps || [];
    const n = steps.length;
    const D = S.portrait ? 860 : 640, R = D * 0.36, cx = D / 2, cy = D / 2, nr = S.portrait ? 76 : 62;
    const pts = steps.map((_, k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / n; return [cx + R * Math.cos(a), cy + R * Math.sin(a), a]; });
    const arcs = pts.map((pt, k) => {
      const a0 = pt[2] + (nr / R) * 1.25, a1 = pts[(k + 1) % n][2] - (nr / R) * 1.25 + (k + 1 === n ? 2 * Math.PI : 0);
      const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0), x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
      return `<path data-draw d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" marker-end="url(#ah-${S.i})"/>`;
    }).join("");
    const nodes = steps.map((s, k) => {
      const [x, y] = pts[k];
      const dx = x - cx, dy = y - cy;
      let pos = Math.abs(dy) >= Math.abs(dx) * 0.9 ? (dy < 0 ? "above" : "below") : (dx < 0 ? "left" : "right");
      if (S.portrait && (pos === "left" || pos === "right")) pos = "below";
      return `<div class="lp-node" style="left:${x}px;top:${y}px"><div class="lp-c">${A.icon(s.icon || "spark", nr * 0.8)}</div><div class="lp-l ${pos}"><b>${S.esc(s.label)}</b>${s.sub ? `<i>${S.esc(s.sub)}</i>` : ""}</div></div>`;
    }).join("");
    const root = S.add(`<div class="lp ${p.title ? "has-title" : ""}">
      ${p.title ? `<div class="lp-side"><h3 class="side-h">${S.md(p.title)}</h3>${p.sub ? `<p class="side-p">${S.md(p.sub)}</p>` : ""}</div>` : ""}
      <div class="lp-box" style="width:${D}px;height:${D}px">
        <svg class="lp-svg" viewBox="0 0 ${D} ${D}" width="${D}" height="${D}"><defs><marker id="ah-${S.i}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker></defs><g class="arcs" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round">${arcs}</g></svg>
        ${p.center ? `<div class="lp-center" style="left:${cx}px;top:${cy}px">${p.center.agent ? A.agent({ size: 150 }) : ""}<b>${S.esc(p.center.label || "")}</b>${p.center.sub ? `<i>${S.esc(p.center.sub)}</i>` : ""}</div>` : ""}
        ${nodes}
        <div class="lp-dot"></div>
      </div>
    </div>`);
    if (p.title) { S.rise(S.t0, root.querySelector(".side-h")); if (p.sub) S.rise(S.frac(0.15), root.querySelector(".side-p")); S.marks(root.querySelector(".lp-side"), S.frac(0.3)); }
    const times = S.spread(steps, 0.08, 0.7);
    const nodeEls = root.querySelectorAll(".lp-node");
    const arcEls = root.querySelectorAll(".arcs path");
    nodeEls.forEach((el, k) => {
      S.pop(times[k], el, 0.5);
      S.to(times[k], el.querySelector(".lp-c"), { backgroundColor: "var(--agent)", color: "#fff", duration: 0.25 });
      S.to(times[k] + 0.9, el.querySelector(".lp-c"), { backgroundColor: "var(--paper)", color: "var(--ink)", duration: 0.4 });
      S.draw(times[k] + 0.25, arcEls[k], 0.6);
    });
    if (p.center) { const c = root.querySelector(".lp-center"); S.pop(S.cue(p.center.at, 0.02), c, 0.6); const ag = c.querySelector(".agent"); if (ag) A.animateAgent(S, ag); }
    // traveling dot after the loop is complete
    const dot = root.querySelector(".lp-dot");
    const tStart = times[n - 1] + 0.8;
    const period = p.period || 3.2;
    S.amb((t) => {
      if (t < tStart) { dot.style.opacity = 0; return; }
      const a = -Math.PI / 2 + (((t - tStart) / period) % 1) * 2 * Math.PI;
      dot.style.opacity = 1;
      dot.style.left = cx + R * Math.cos(a) + "px"; dot.style.top = cy + R * Math.sin(a) + "px";
      // pulse the node the dot is passing
      nodeEls.forEach((el, k) => { const d = Math.abs(((a - pts[k][2]) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); el.classList.toggle("hot", d < 0.28); });
    });
  };

  // ---------------- flow (pipeline) ----------------
  T.flow = (S, p) => {
    const nodes = p.nodes || [];
    const vertical = S.portrait || p.vertical;
    const nodeHTML = nodes.map((nd, k) => {
      const art = nd.kind === "agent" ? A.agent({ size: 84 }) : nd.kind === "human" ? A.human({ size: 80 }) : A.icon(nd.icon || ({ tool: "tool", doc: "doc", test: "test", check: "check", code: "code", git: "branch", warn: "warn", db: "db", web: "globe" }[nd.kind] || "spark"), 56);
      const arrow = k < nodes.length - 1 ? `<div class="fl-arrow">${vertical ? `<svg viewBox="0 0 40 70" width="40" height="70"><path data-draw d="M20 4 V60" /><path class="ah" d="M8 48 L20 64 L32 48"/></svg>` : `<svg viewBox="0 0 90 40" width="90" height="40"><path data-draw d="M4 20 H76"/><path class="ah" d="M62 8 L80 20 L62 32"/></svg>`}${nodes[k].edge ? `<span class="fl-edge">${S.esc(nodes[k].edge)}</span>` : ""}</div>` : "";
      return `<div class="fl-node kind-${nd.kind || "plain"}"><div class="fl-art">${art}</div><b>${S.md(nd.label)}</b>${nd.sub ? `<i>${S.md(nd.sub)}</i>` : ""}</div>${arrow}`;
    }).join("");
    const root = S.add(`<div class="fl ${vertical ? "vert" : ""}">${p.title ? `<h3 class="side-h fl-title">${S.md(p.title)}</h3>` : ""}<div class="fl-row">${nodeHTML}</div>${p.caption ? `<p class="fl-cap">${S.md(p.caption)}</p>` : ""}</div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".fl-title"));
    const times = S.spread(nodes, 0.06, 0.75);
    const nEls = root.querySelectorAll(".fl-node"), aEls = root.querySelectorAll(".fl-arrow");
    nEls.forEach((el, k) => {
      S.pop(times[k], el, 0.5);
      const ag = el.querySelector(".agent, .human"); if (ag) A.animateAgent(S, ag, { phase: k, bob: 3 });
      if (aEls[k]) { const a = aEls[k]; S.draw(times[k] + 0.3, a, 0.45); S.fade(times[k] + 0.55, a.querySelector(".ah"), 0.2); const e = a.querySelector(".fl-edge"); if (e) S.fade(times[k] + 0.5, e, 0.3); }
    });
    if (p.caption) S.rise(S.cue(p.caption_at, 0.8), root.querySelector(".fl-cap"));
    if (p.loopback) { root.classList.add("loopback"); }
  };

  // ---------------- context window ----------------
  T.context = (S, p) => {
    const blocks = p.blocks || [];
    const total = blocks.reduce((a, b) => a + (b.w || 0.1), 0);
    const root = S.add(`<div class="ctx">
      <div class="ctx-head"><span class="ctx-title">${S.md(p.title || "Context window")}</span><span class="ctx-cap">${S.esc(p.cap || "")}</span></div>
      <div class="ctx-bar">${blocks.map((b) => `<div class="cb kind-${b.kind || "file"}" style="width:${((b.w || 0.1) * 100).toFixed(2)}%"><span>${S.esc(b.label)}</span></div>`).join("")}
        ${p.compact ? `<div class="cb kind-sum compact-blk" style="width:${(p.compact.w || 0.14) * 100}%"><span>${S.esc(p.compact.label || "summary")}</span></div>` : ""}
      </div>
      <div class="ctx-zones">${(p.zones || []).map((z) => `<div class="zone tone-${z.tone || "good"}" style="left:${z.from * 100}%;width:${(z.to - z.from) * 100}%"><span>${S.esc(z.label)}</span></div>`).join("")}</div>
      <div class="ctx-foot"><span class="ctx-pct"><b class="pct">0</b>% full</span>${p.note ? `<span class="ctx-note">${S.md(p.note)}</span>` : ""}</div>
    </div>`);
    S.rise(S.t0, root.querySelector(".ctx-head"));
    S.fade(S.t0 + 0.1, root.querySelector(".ctx-bar"), 0.4);
    const times = S.spread(blocks, 0.08, 0.72);
    const cbs = [...root.querySelectorAll(".ctx-bar .cb:not(.compact-blk)")];
    const pct = root.querySelector(".pct");
    let acc = 0; const accs = [];
    cbs.forEach((el, k) => {
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      S.tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, times[k]);
      acc += blocks[k].w || 0.1; accs.push([times[k], acc]);
    });
    S.amb((t) => { let v = 0; for (const [tt, a] of accs) if (t >= tt + 0.45) v = a; else if (t >= tt) v = a - (blocks[accs.findIndex((x) => x[0] === tt)].w || 0) * (1 - (t - tt) / 0.45); pct.textContent = Math.round(Math.min(1, v) * 100); });
    (p.zones || []).length && S.fade(S.cue(p.zones_at, 0.75), root.querySelector(".ctx-zones"), 0.5);
    if (p.note) S.rise(S.cue(p.note_at, 0.6), root.querySelector(".ctx-note"));
    if (p.rot) { const tr = S.cue(p.rot.at, 0.7); cbs.forEach((el, k) => { if ((accs[k][1]) > (p.rot.from || 0.5)) S.to(tr + k * 0.05, el, { filter: "blur(2px) saturate(0.4)", opacity: 0.55, duration: 0.6 }); }); }
    if (p.compact) {
      const tc = S.cue(p.compact.at, 0.75);
      cbs.forEach((el) => S.to(tc, el, { scaleX: 0, duration: 0.5, ease: "power2.in" }));
      const cb = root.querySelector(".compact-blk"); gsap.set(cb, { scaleX: 0, transformOrigin: "left center" });
      S.tl.fromTo(cb, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "back.out(1.4)", immediateRender: false }, tc + 0.5);
      accs.push([tc + 0.5, p.compact.w || 0.14]); accs.sort((a, b) => a[0] - b[0]);
      S.amb((t) => { if (t >= tc + 0.5) pct.textContent = Math.round((p.compact.w || 0.14) * 100); });
    }
  };

  // ---------------- compare ----------------
  T.compare = (S, p) => {
    const L = p.left || {}, R = p.right || {};
    const col = (c, side) => `<div class="cmp-col tone-${c.tone || (side === "l" ? "bad" : "good")}">
      <div class="cmp-h">${c.who === "agent" ? A.agent({ size: 64 }) : c.who === "human" ? A.human({ size: 60 }) : A.icon(c.icon || ({ good: "check", bad: "x" }[c.tone || (side === "l" ? "bad" : "good")] || "spark"), 40)}<span>${S.md(c.title || "")}</span></div>
      <ul>${(c.items || []).map((it) => `<li><span class="mk-i">${A.icon((c.tone || (side === "l" ? "bad" : "good")) === "bad" ? "x" : (c.tone === "neutral" || c.tone === "human" || c.tone === "agent") ? "spark" : "check", 30)}</span><span>${S.md(typeof it === "string" ? it : it.text)}</span></li>`).join("")}</ul></div>`;
    const root = S.add(`<div class="cmp">${p.title ? `<h3 class="side-h cmp-title">${S.md(p.title)}</h3>` : ""}<div class="cmp-cols">${col(L, "l")}<div class="cmp-vs">${S.esc(p.vs || "vs")}</div>${col(R, "r")}</div></div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".cmp-title"));
    const cols = root.querySelectorAll(".cmp-col");
    const li = [...cols[0].querySelectorAll("li")], ri = [...cols[1].querySelectorAll("li")];
    const lItems = (L.items || []).map((x) => (typeof x === "string" ? {} : x)), rItems = (R.items || []).map((x) => (typeof x === "string" ? {} : x));
    const tl0 = S.cue(L.at, 0.03), tr0 = S.cue(R.at, 0.45);
    S.slideL(tl0, cols[0]); S.slideR(tr0, cols[1]); S.pop(tr0 - 0.1, root.querySelector(".cmp-vs"));
    li.forEach((el, k) => S.rise(lItems[k].at ? S.cue(lItems[k].at) : tl0 + 0.35 + k * Math.min(0.9, (tr0 - tl0 - 0.4) / Math.max(1, li.length)), el, 0.4, 16));
    ri.forEach((el, k) => S.rise(rItems[k].at ? S.cue(rItems[k].at) : tr0 + 0.35 + k * Math.min(0.9, (S.t1 - tr0 - 1) / Math.max(1, ri.length)), el, 0.4, 16));
    li.concat(ri).forEach((el) => S.marks(el, S.frac(0.85)));
  };

  // ---------------- list ----------------
  T.list = (S, p) => {
    const items = p.items || [];
    const style = p.style || "check";
    const bul = (k) => style === "num" ? `<span class="bul num">${k + 1}</span>` : style === "dot" ? `<span class="bul dot"></span>` : `<span class="bul ico tone-${style === "warn" ? "bad" : style === "x" ? "bad" : "good"}">${A.icon(style === "warn" ? "warn" : style === "x" ? "x" : "check", 30)}</span>`;
    const root = S.add(`<div class="lst style-${style} ${items.length > 4 ? "dense" : ""} ${items.length > 5 ? "cols2" : ""}">${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}<ul>${items.map((it, k) => { const o = typeof it === "string" ? { text: it } : it; return `<li>${bul(k)}<span class="li-t">${S.md(o.text)}${o.sub ? `<small>${S.md(o.sub)}</small>` : ""}</span></li>`; }).join("")}</ul></div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    const objs = items.map((it) => (typeof it === "string" ? {} : it));
    const times = S.spread(objs, p.title ? 0.12 : 0.04, 0.78);
    root.querySelectorAll("li").forEach((el, k) => { S.rise(times[k], el, 0.45, 22); const b = el.querySelector(".bul"); S.pop(times[k] + 0.1, b, 0.4); S.marks(el, times[k] + 0.5, times[k] + 0.2); });
  };

  // ---------------- stat (one or several big numbers) ----------------
  T.stat = (S, p) => {
    const items = p.items || [{ value: p.value, prefix: p.prefix, suffix: p.suffix, decimals: p.decimals, label: p.label, sub: p.sub, tone: p.tone, at: p.at }];
    const root = S.add(`<div class="stat n${items.length}">${p.title ? `<h3 class="side-h stat-title">${S.md(p.title)}</h3>` : ""}<div class="stat-row">${items.map((it) => `<div class="stat-i tone-${it.tone || "agent"}"><div class="stat-v"><span class="num"></span></div><div class="stat-l">${S.md(it.label || "")}</div>${it.sub ? `<div class="stat-s">${S.md(it.sub)}</div>` : ""}</div>`).join("")}</div>${p.src ? `<div class="src">${S.md(p.src)}</div>` : ""}</div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".stat-title"));
    const els = root.querySelectorAll(".stat-i");
    const times = S.spread(items, 0.04, 0.5);
    els.forEach((el, k) => {
      const it = items[k];
      S.rise(times[k], el, 0.5);
      const num = el.querySelector(".num");
      if (typeof it.value === "number") S.count(times[k] + 0.1, num, it.value, { d: it.d || 1.3, decimals: it.decimals || 0, prefix: it.prefix || "", suffix: it.suffix || "" });
      else { num.textContent = it.value; el.classList.add("is-text"); }
      S.marks(el, times[k] + 0.6);
    });
    if (p.src) S.fade(S.frac(0.3), root.querySelector(".src"));
  };

  // ---------------- agents in parallel ----------------
  const STATUS = ["reading", "planning", "editing", "running tests", "fixing", "done"];
  T.agents = (S, p) => {
    const lanes = p.lanes || [];
    const root = S.add(`<div class="lanes-wrap">
      ${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}
      <div class="lanes">${lanes.map((l, k) => `<div class="lane ${l.tone ? "tone-" + l.tone : l.fail ? "tone-bad" : ""}"><span class="lane-ag">${A.agent({ size: S.portrait ? 74 : 78, mood: l.mood || "work" })}</span><div class="lane-main"><div class="lane-top"><b>${S.esc(l.label)}</b><i class="lane-st">queued</i></div><div class="lane-bar"><i></i></div></div><span class="lane-done">${A.icon(l.fail ? "x" : "check", 34)}</span></div>`).join("")}</div>
      ${p.merge ? `<div class="merge">${A.icon("merge", 40)}<span>${S.esc(p.merge.label || "merged")}</span></div>` : ""}
    </div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    const laneEls = root.querySelectorAll(".lane");
    const starts = S.spread(lanes, 0.05, 0.3);
    const endF = p.end || 0.82;
    laneEls.forEach((el, k) => {
      const l = lanes[k];
      S.slideL(starts[k], el, 0.45);
      A.animateAgent(S, el.querySelector(".agent"), { phase: k * 0.7, bob: 2.5 });
      const t0 = starts[k] + 0.3, t1 = l.done_at ? S.cue(l.done_at) : S.frac(endF - 0.25 + (((k * 37) % 10) / 10) * 0.25);
      const bar = el.querySelector(".lane-bar i"), st = el.querySelector(".lane-st"), done = el.querySelector(".lane-done");
      gsap.set(done, { autoAlpha: 0, scale: 0.4 });
      S.amb((t) => {
        const pr = Math.max(0, Math.min(1, (t - t0) / Math.max(0.5, t1 - t0)));
        bar.style.transform = `scaleX(${(l.fail ? Math.min(pr, 0.62) : pr).toFixed(3)})`;
        st.textContent = t < t0 ? "queued" : pr >= 1 ? (l.fail ? "blocked" : (l.result || "done")) : (l.steps || STATUS)[Math.min((l.steps || STATUS).length - 2, Math.floor(pr * ((l.steps || STATUS).length - 1)))] + "…";
        el.classList.toggle("is-done", pr >= 1);
        done.style.opacity = pr >= 1 ? 1 : 0; done.style.transform = pr >= 1 ? "scale(1)" : "scale(.4)";
      });
    });
    if (p.merge) S.rise(S.cue(p.merge.at, 0.88), root.querySelector(".merge"));
  };

  // ---------------- stack (layers) ----------------
  T.stack = (S, p) => {
    const layers = p.layers || [];
    const root = S.add(`<div class="stk-wrap">${p.title ? `<div class="stk-side"><h3 class="side-h">${S.md(p.title)}</h3>${p.sub ? `<p class="side-p">${S.md(p.sub)}</p>` : ""}</div>` : ""}<div class="stk">${layers.map((l, k) => `<div class="layer tone-${l.tone || ["ink", "agent", "human", "paper", "good"][k % 5]}">${l.icon ? A.icon(l.icon, 40) : ""}<b>${S.md(l.label)}</b>${l.sub ? `<i>${S.md(l.sub)}</i>` : ""}</div>`).join("")}</div></div>`);
    if (p.title) { S.rise(S.t0, root.querySelector(".side-h")); if (p.sub) S.rise(S.frac(0.2), root.querySelector(".side-p")); }
    const times = S.spread(layers, 0.06, 0.72);
    root.querySelectorAll(".layer").forEach((el, k) => S.drop(times[k], el));
  };

  // ---------------- timeline ----------------
  T.timeline = (S, p) => {
    const ev = p.events || [];
    const root = S.add(`<div class="tln ${S.portrait ? "vert" : ""}">${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}<div class="tln-track"><div class="tln-line"></div>
      ${ev.map((e, k) => `<div class="ev ${k % 2 ? "alt" : ""} ${e.now ? "now" : ""}" style="${S.portrait ? `top:${((k + 0.5) / ev.length) * 100}%` : `left:${((k + 0.5) / ev.length) * 100}%`}"><span class="ev-dot"></span><div class="ev-box"><span class="ev-when">${S.esc(e.when)}</span><b>${S.md(e.label)}</b>${e.sub ? `<i>${S.md(e.sub)}</i>` : ""}</div></div>`).join("")}</div></div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    const line = root.querySelector(".tln-line");
    const ax = S.portrait ? "scaleY" : "scaleX";
    gsap.set(line, { [ax]: 0, transformOrigin: S.portrait ? "50% 0%" : "0% 50%" });
    S.tl.fromTo(line, { [ax]: 0 }, { [ax]: 1, duration: 1.2, ease: "power2.inOut", immediateRender: false }, S.t0 + 0.2);
    const times = S.spread(ev, 0.1, 0.8);
    root.querySelectorAll(".ev").forEach((el, k) => { S.pop(times[k], el.querySelector(".ev-dot"), 0.4); S.rise(times[k] + 0.1, el.querySelector(".ev-box"), 0.45, 18); });
  };

  // ---------------- spectrum (e.g. the autonomy slider) ----------------
  T.spectrum = (S, p) => {
    const marks = p.marks || [];
    const root = S.add(`<div class="spc">${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}
      <div class="spc-ends"><div class="spc-end l">${A.human({ size: 96 })}<b>${S.esc(p.left?.label || "")}</b><i>${S.esc(p.left?.sub || "")}</i></div><div class="spc-end r">${A.agent({ size: 100 })}<b>${S.esc(p.right?.label || "")}</b><i>${S.esc(p.right?.sub || "")}</i></div></div>
      <div class="spc-track"><div class="spc-fill"></div>${marks.map((m) => `<div class="spc-mark" style="left:${m.pos * 100}%"><span class="tick"></span><span class="lab">${S.md(m.label)}</span></div>`).join("")}<div class="spc-knob"></div></div>
    </div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    S.slideL(S.t0 + 0.1, root.querySelector(".spc-end.l")); S.slideR(S.t0 + 0.25, root.querySelector(".spc-end.r"));
    A.animateAgent(S, root.querySelector(".spc-end .agent"));
    S.fade(S.t0 + 0.3, root.querySelector(".spc-track"));
    const knob = root.querySelector(".spc-knob");
    gsap.set(knob, { left: "0%" });
    const times = S.spread(marks, 0.15, 0.85);
    root.querySelectorAll(".spc-mark").forEach((el, k) => {
      S.rise(times[k] - 0.2, el, 0.4, 12);
      S.tl.to(knob, { left: marks[k].pos * 100 + "%", duration: 0.8, ease: "power3.inOut" }, times[k] - 0.3);
    });
  };

  // ---------------- venn (3 sets, e.g. the lethal trifecta) ----------------
  T.venn = (S, p) => {
    const sets = p.sets || [];
    const D = S.portrait ? 900 : 760, r = D * 0.27;
    const c = [[D / 2, D * 0.34], [D * 0.33, D * 0.63], [D * 0.67, D * 0.63]];
    const colors = ["var(--agent)", "var(--human)", "var(--warn)"];
    const root = S.add(`<div class="venn-wrap">${p.title ? `<div class="venn-side"><h3 class="side-h">${S.md(p.title)}</h3>${p.sub ? `<p class="side-p">${S.md(p.sub)}</p>` : ""}</div>` : ""}<div class="venn" style="width:${D}px;height:${D}px">
      <svg viewBox="0 0 ${D} ${D}" width="${D}" height="${D}">${sets.map((s, k) => `<circle class="vc" cx="${c[k][0]}" cy="${c[k][1]}" r="${r}" fill="${colors[k]}" />`).join("")}<circle class="vcore" cx="${D / 2}" cy="${D * 0.535}" r="${r * 0.22}" /></svg>
      ${sets.map((s, k) => { const dx = c[k][0] - D / 2, dy = c[k][1] - D * 0.535; const m = Math.hypot(dx, dy) || 1; return `<div class="vl" style="left:${c[k][0] + (dx / m) * r * 0.6}px;top:${c[k][1] + (dy / m) * r * (dy > 0 ? 0.74 : 0.62)}px"><b>${S.esc(s.label)}</b>${s.sub ? `<i>${S.esc(s.sub)}</i>` : ""}</div>`; }).join("")}
      ${p.center ? `<div class="vcenter" style="left:${D / 2}px;top:${D * 0.535}px"><b>${S.esc(p.center.label)}</b></div>` : ""}
    </div></div>`);
    if (p.title) { S.rise(S.t0, root.querySelector(".side-h")); if (p.sub) S.rise(S.frac(0.2), root.querySelector(".side-p")); }
    const times = S.spread(sets, 0.08, 0.6);
    const cs = root.querySelectorAll(".vc"), ls = root.querySelectorAll(".vl");
    cs.forEach((el, k) => { gsap.set(el, { transformOrigin: "50% 50%" }); S.pop(times[k], el, 0.6); S.rise(times[k] + 0.2, ls[k], 0.4, 12); });
    if (p.center) {
      const tc = S.cue(p.center.at, 0.75), core = root.querySelector(".vcore"), lab = root.querySelector(".vcenter");
      gsap.set(core, { transformOrigin: "50% 50%" });
      S.pop(tc, core, 0.5); S.pop(tc + 0.15, lab, 0.5);
      S.amb((t) => { if (t > tc + 0.6) core.style.opacity = (0.75 + 0.25 * Math.sin(t * 6)).toFixed(3); });
    }
  };

  // ---------------- file tree ----------------
  T.filetree = (S, p) => {
    const items = p.items || [];
    const root = S.add(`<div class="tree-wrap">${p.title ? `<div class="tree-side"><h3 class="side-h">${S.md(p.title)}</h3>${p.sub ? `<p class="side-p">${S.md(p.sub)}</p>` : ""}</div>` : ""}<div class="tree"><div class="tr-row root">${A.icon("box", 34)}<span class="tr-name">${S.esc(p.root || "my-project/")}</span></div>
      ${items.map((it) => { const path = it.path.replace(/\/$/, ""); const depth = path.split("/").length; const name = path.split("/").pop() + (it.path.endsWith("/") ? "/" : ""); return `<div class="tr-row ${it.hl ? "hl" : ""}" style="padding-left:${depth * 44}px">${A.icon(it.path.endsWith("/") ? "box" : "file", 30)}<span class="tr-name">${S.esc(name)}</span>${it.note ? `<span class="tr-note">&larr; ${S.esc(it.note)}</span>` : ""}</div>`; }).join("")}</div></div>`);
    if (p.title) { S.rise(S.t0, root.querySelector(".side-h")); if (p.sub) S.rise(S.frac(0.2), root.querySelector(".side-p")); }
    S.rise(S.t0 + 0.1, root.querySelector(".tree"), 0.5);
    const rows = root.querySelectorAll(".tr-row:not(.root)");
    const times = S.spread(items, 0.08, 0.75);
    rows.forEach((el, k) => { S.slideL(times[k], el, 0.35); const nt = el.querySelector(".tr-note"); if (nt) S.pop(times[k] + 0.35, nt, 0.4); });
  };

  // ---------------- chart ----------------
  T.chart = (S, p) => {
    const data = p.data || [];
    const W = S.portrait ? 900 : 1300, H = S.portrait ? 900 : 640, pad = { l: 120, r: 40, t: 40, b: 90 };
    const ys = data.map((d) => d.y);
    const log = !!p.log;
    const yMin = log ? Math.log10(Math.min(...ys) / 2) : 0, yMax = log ? Math.log10(Math.max(...ys) * 2) : Math.max(...ys) * 1.15;
    const Y = (v) => pad.t + (H - pad.t - pad.b) * (1 - ((log ? Math.log10(v) : v) - yMin) / (yMax - yMin));
    const X = (k) => pad.l + ((W - pad.l - pad.r) * (k + 0.5)) / data.length;
    const bw = ((W - pad.l - pad.r) / data.length) * 0.56;
    const fmt = p.fmt || ((v) => String(v));
    const yfmt = typeof fmt === "function" ? fmt : (v) => (p.prefix || "") + v + (p.suffix || "");
    const bars = p.kind === "line" ? "" : data.map((d, k) => `<rect class="bar ${d.hl ? "hl" : ""}" x="${X(k) - bw / 2}" y="${Y(d.y)}" width="${bw}" height="${H - pad.b - Y(d.y)}" rx="8"/>`).join("");
    const line = p.kind === "line" ? `<polyline class="ln" data-draw points="${data.map((d, k) => `${X(k)},${Y(d.y)}`).join(" ")}"/>` + data.map((d, k) => `<circle class="pt ${d.hl ? "hl" : ""}" cx="${X(k)}" cy="${Y(d.y)}" r="11"/>`).join("") : "";
    const labels = data.map((d, k) => `<text class="ch-x" x="${X(k)}" y="${H - pad.b + 46}" text-anchor="middle">${S.esc(d.x)}</text><text class="ch-v" x="${X(k)}" y="${Y(d.y) - 22}" text-anchor="middle">${S.esc(d.label ?? yfmt(d.y))}</text>`).join("");
    const root = S.add(`<div class="chart-wrap">${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}<svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
      <line class="axis" data-draw x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}"/>${p.ylabel ? `<text class="ch-y" x="20" y="${pad.t + 10}">${S.esc(p.ylabel)}</text>` : ""}
      ${bars}${line}${labels}</svg>${p.src ? `<div class="src">${S.md(p.src)}</div>` : ""}</div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    S.draw(S.t0 + 0.2, root.querySelector(".axis"), 0.6);
    const times = S.spread(data, 0.1, 0.75);
    root.querySelectorAll(".ch-x").forEach((el, k) => S.fade(times[k], el, 0.3));
    root.querySelectorAll(".ch-v").forEach((el, k) => { gsap.set(el, { transformOrigin: "50% 50%", transformBox: "fill-box" }); S.pop(times[k] + 0.4, el, 0.35); });
    root.querySelectorAll(".bar").forEach((el, k) => { gsap.set(el, { transformOrigin: "50% 100%", transformBox: "fill-box" }); S.inn(times[k], el, { scaleY: 0 }, 0.6, "power3.out"); });
    const pl = root.querySelector(".ln"); if (pl) S.draw(times[0], pl, Math.max(0.8, times[times.length - 1] - times[0] + 0.4), "none");
    root.querySelectorAll(".pt").forEach((el, k) => { gsap.set(el, { transformOrigin: "50% 50%", transformBox: "fill-box" }); S.pop(times[k] + 0.1, el, 0.4); });
    if (p.src) S.fade(S.frac(0.5), root.querySelector(".src"));
  };

  // ---------------- formula: A + B + C = D ----------------
  T.formula = (S, p) => {
    const parts = p.parts || [];
    const root = S.add(`<div class="fml">${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}<div class="fml-row">${parts.map((pt) => pt.op ? `<span class="fml-op">${S.esc(pt.op)}</span>` : `<span class="fml-t tone-${pt.tone || "ink"}">${pt.icon ? A.icon(pt.icon, 56) : ""}<b>${S.md(pt.text)}</b>${pt.sub ? `<i>${S.md(pt.sub)}</i>` : ""}</span>`).join("")}</div>${p.caption ? `<p class="fml-cap">${S.md(p.caption)}</p>` : ""}</div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    const els = root.querySelectorAll(".fml-row > span");
    const times = S.spread(parts, 0.06, 0.7);
    els.forEach((el, k) => (parts[k].op ? S.pop(times[k], el, 0.35) : S.rise(times[k], el, 0.5)));
    if (p.caption) S.rise(S.cue(p.caption_at, 0.8), root.querySelector(".fml-cap"));
  };

  // ---------------- quiz ----------------
  T.quiz = (S, p) => {
    const opts = p.options || [];
    const root = S.add(`<div class="quiz">
      <div class="qz-kick">${A.icon("target", 34)}<span>${S.esc(p.kicker || "Quick check")}</span></div>
      <h3 class="qz-q">${S.md(p.q || p.question || "")}</h3>
      <div class="qz-opts n${opts.length}">${opts.map((o, i) => `<button class="qz-o" data-i="${i}" type="button"><span class="qz-l">${"ABCD"[i]}</span><span class="qz-t">${S.md(o)}</span><span class="qz-mark"></span></button>`).join("")}</div>
      <div class="qz-explain">${A.icon("spark", 34)}<span>${S.md(p.explain || "")}</span></div>
      <div class="qz-timer"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16"/></svg><span>tap an answer</span></div>
    </div>`);
    S.slideL(S.t0, root.querySelector(".qz-kick"));
    S.words(S.t0 + 0.15, root.querySelector(".qz-q"), 0.05);
    const oEls = [...root.querySelectorAll(".qz-o")];
    const times = S.spread(opts.map(() => ({})), 0.2, 0.6);
    oEls.forEach((el, k) => S.rise(times[k], el, 0.4, 18));
    const lastWord = S.ws.length ? S.ws[S.ws.length - 1].e : S.frac(0.7);
    const gateT = Math.min(S.t1 - 1.5, lastWord + 0.25);
    const timer = root.querySelector(".qz-timer");
    S.fade(gateT - 0.1, timer, 0.2);
    const ring = timer.querySelector("circle");
    const holdD = Math.max(1.2, S.t1 - gateT - 2.2);
    const answer = p.answer || 0;
    let state = -1;
    const reveal = (i) => {
      if (state === i) return; state = i;
      oEls.forEach((el, k) => { el.classList.toggle("right", k === answer); el.classList.toggle("wrong", k === i && i !== answer); el.classList.toggle("dim", k !== answer && k !== i); });
      root.classList.add("revealed");
    };
    const reset = () => { if (state === -1) return; state = -1; oEls.forEach((el) => el.classList.remove("right", "wrong", "dim")); root.classList.remove("revealed"); };
    S.amb((t) => {
      const k = Math.max(0, Math.min(1, (t - gateT) / holdD));
      ring.style.strokeDashoffset = (100.5 * k).toFixed(2);
      if (S.L.mode === "capture") { if (t >= gateT + holdD) reveal(answer); else reset(); }
    });
    if (S.L.mode === "capture") S.inn(gateT + holdD + 0.05, root.querySelector(".qz-explain"), { y: 14 }, 0.4);
    S.L.gates.push({ t: gateT, scene: S.i, root, answer, reveal, reset, auto: () => {}, options: oEls, explain: p.explain });
  };

  // ---------------- recap ----------------
  T.recap = (S, p) => {
    const items = p.items || [];
    const root = S.add(`<div class="rc">
      <div class="rc-main"><div class="eyebrow">${S.esc(p.kicker || "Key takeaways")}</div>
      <ul>${items.map((it) => `<li><span class="bul ico tone-good">${A.icon("check", 30)}</span><span>${S.md(it)}</span></li>`).join("")}</ul>
      ${p.next ? `<div class="rc-next"><span>Next</span><b>${S.md(p.next)}</b>${A.icon("rocket", 34)}</div>` : ""}</div>
      <div class="rc-art">${A.agent({ size: S.portrait ? 220 : 280, mood: "happy" })}</div>
    </div>`);
    S.slideL(S.t0, root.querySelector(".eyebrow"));
    const times = S.spread(items.map(() => ({})), 0.08, 0.72);
    root.querySelectorAll("li").forEach((el, k) => { S.rise(times[k], el, 0.45, 18); S.pop(times[k] + 0.1, el.querySelector(".bul"), 0.4); S.marks(el, times[k] + 0.4); });
    if (p.next) S.rise(S.cue(p.next_at, 0.85), root.querySelector(".rc-next"));
    S.pop(S.t0 + 0.3, root.querySelector(".rc-art"), 0.6);
    A.animateAgent(S, root.querySelector(".rc-art .agent"));
  };

  // ---------------- exercise ----------------
  T.exercise = (S, p) => {
    const root = S.add(`<div class="ex">
      <div class="ex-h">${A.icon("terminal", 40)}<span>${S.esc(p.title || "Try it with your agent")}</span></div>
      ${p.intro ? `<p class="ex-intro">${S.md(p.intro)}</p>` : ""}
      <div class="ex-card"><div class="ex-bar"><span>paste into Claude Code, Codex, Cursor…</span><button class="ex-copy" type="button">Copy</button></div><pre class="ex-prompt"></pre></div>
    </div>`);
    S.slideL(S.t0, root.querySelector(".ex-h"));
    if (p.intro) S.rise(S.t0 + 0.3, root.querySelector(".ex-intro"));
    S.rise(S.t0 + 0.5, root.querySelector(".ex-card"));
    const pre = root.querySelector(".ex-prompt");
    S.type(S.t0 + 0.9, pre, p.prompt || "", Math.max(40, String(p.prompt || "").length / Math.max(1, S.dur * 0.6)));
    const btn = root.querySelector(".ex-copy");
    btn.addEventListener("click", (e) => { e.stopPropagation(); navigator.clipboard?.writeText(p.prompt || ""); btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1500); });
  };

  // ---------------- wall of people / sources ----------------
  T.wall = (S, p) => {
    const items = p.items || [];
    const root = S.add(`<div class="wall">${p.title ? `<h3 class="side-h">${S.md(p.title)}</h3>` : ""}<div class="wall-grid">${items.map((it) => `<div class="wall-i"><span class="qt-av">${S.esc(it.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join(""))}</span><span><b>${S.esc(it.name)}</b><i>${S.esc(it.role || "")}</i></span></div>`).join("")}</div>${p.count ? `<div class="wall-count"><b class="num"></b><span>${S.esc(p.count.label)}</span></div>` : ""}</div>`);
    if (p.title) S.rise(S.t0, root.querySelector(".side-h"));
    const els = root.querySelectorAll(".wall-i");
    const a = S.t0 + 0.4, b = S.frac(0.7);
    els.forEach((el, k) => S.pop(a + ((b - a) * k) / Math.max(1, els.length), el, 0.35));
    if (p.count) { const c = root.querySelector(".wall-count"); S.rise(S.cue(p.count.at, 0.5), c); S.count(S.cue(p.count.at, 0.5) + 0.1, c.querySelector(".num"), p.count.value, { d: 1.6 }); }
  };

  window.AE_TEMPLATES = T;
})();
