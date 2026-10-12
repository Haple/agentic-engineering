// Agentic Engineering lesson engine.
// A lesson is data: scenes {template, narration, params, start, dur} + global word timings.
// Everything on screen is a pure function of time t (one paused GSAP timeline + ambient fns),
// so the same page plays interactively, scrubs, and captures frame-perfect video.
(function () {
  "use strict";
  const NORM = (s) => String(s).toLowerCase().replace(/[’'`]/g, "").replace(/[^a-z0-9]+/g, "");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // inline markup: *marker highlight*  _underline_  ~strike~  `code`  **bold**
  const md = (s) => esc(s)
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, '<span class="mk">$1</span>')
    .replace(/(^|[\s(])_(.+?)_(?=[\s.,;:!?)]|$)/g, '$1<span class="ul">$2</span>')
    .replace(/~(.+?)~/g, '<span class="st">$1</span>');

  function h(html) { const t = document.createElement("template"); t.innerHTML = String(html).trim(); return t.content.firstElementChild; }

  class Lesson {
    constructor(stage, data, opts = {}) {
      this.stage = stage;
      this.data = data;
      this.mode = opts.mode || "web"; // web | capture
      this.portrait = !!opts.portrait;
      this.W = this.portrait ? 1080 : 1920;
      this.H = this.portrait ? 1920 : 1080;
      this.tl = gsap.timeline({ paused: true });
      this.ambient = [];
      this.scenes = [];
      this.gates = [];
      this.cueErrors = [];
      this.total = data.total;
      stage.classList.toggle("portrait", this.portrait);
      stage.classList.toggle("landscape", !this.portrait);
      stage.classList.add("mode-" + this.mode);
      this.words = [];
      data.scenes.forEach((sc, i) => (sc.words || []).forEach((w) => this.words.push({ ...w, n: NORM(w.text), scene: i })));
      this.build();
    }

    build() {
      const { stage, data } = this;
      stage.innerHTML = "";
      this.layer = h('<div class="scenes"></div>');
      stage.appendChild(this.layer);
      data.scenes.forEach((sc, i) => this.buildScene(sc, i));
      this.finalize();
      this.cap = h('<div class="cap"><span class="cap-in"></span></div>');
      stage.appendChild(this.cap);
      this.buildCaptions();
      this.bar = h('<div class="stage-progress"><i></i></div>');
      stage.appendChild(this.bar);
      if (data.brand !== false) stage.appendChild(h(`<div class="brand"><span class="brand-dot"></span>agentic engineering</div>`));
    }

    buildScene(sc, i) {
      const el = h(`<section class="scene tpl-${sc.template} bg-${sc.bg || window.AE_TEMPLATES.defaultBg(sc.template)}"><div class="cam"></div></section>`);
      this.layer.appendChild(el);
      const cam = el.firstElementChild;
      const sceneWords = this.words.filter((w) => w.scene === i);
      const S = new SceneCtx(this, sc, i, el, cam, sceneWords);
      const tpl = window.AE_TEMPLATES[sc.template];
      if (!tpl) { cam.appendChild(h(`<div class="err">unknown template ${esc(sc.template)}</div>`)); }
      else {
        try { tpl(S, sc.params || {}); }
        catch (e) { console.error("template", sc.template, e); cam.appendChild(h(`<div class="err">${esc(sc.template)}: ${esc(e.message)}</div>`)); }
      }
      if (sc.params && sc.params.hnote) S.note(sc.params.hnote);
      if (sc.params && sc.params.punch) S.punch(sc.params.punch);
      if (sc.template !== "title" && data_kicker(this.data)) {
        const k = h(`<div class="kicker"><b>${String(this.data.number).padStart(2, "0")}</b>${esc(this.data.short || this.data.title)}</div>`);
        el.appendChild(k);
      }
      this.scenes.push(S);
    }

    finalize() {
      const n = this.scenes.length;
      this.scenes.forEach((S, i) => {
        const tr = S.sc.transition || (i === 0 ? "none" : "fade");
        const a = S.t0 - 0.35, b = S.t1;
        if (i === 0) gsap.set(S.el, { autoAlpha: 1 });
        else {
          gsap.set(S.el, { autoAlpha: 0 });
          const from = { autoAlpha: 0 }, to = { autoAlpha: 1, duration: 0.55, ease: "power2.out", immediateRender: false };
          if (tr === "slide") { from.xPercent = 6; to.xPercent = 0; }
          if (tr === "up") { from.yPercent = 6; to.yPercent = 0; }
          if (tr === "zoom") { from.scale = 1.08; to.scale = 1; }
          this.tl.fromTo(S.el, from, to, a);
        }
        if (i + 1 < n) this.tl.to(S.el, { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, b - 0.25);
        // slow camera drift keeps static frames alive
        if (S.sc.camera !== "none") this.tl.fromTo(S.cam, { scale: 1 }, { scale: S.sc.camera === "push" ? 1.06 : 1.025, ease: "none", duration: Math.max(1, b - a + 0.6), immediateRender: false }, a);
      });
      this.tl.set({}, {}, this.total);
    }

    // ---------- captions ----------
    buildCaptions() {
      const caps = []; let cur = [];
      const all = this.words;
      const flush = () => { if (cur.length) caps.push({ w: cur, s: cur[0].s, e: cur[cur.length - 1].e }); cur = []; };
      all.forEach((w, i) => {
        const nx = all[i + 1];
        cur.push(w);
        const end = /[.?!]["”)]?$/.test(w.text), soft = /[,;:—–-]["”]?$/.test(w.text);
        const gap = nx ? nx.s - w.e : 9;
        const maxW = this.portrait ? 6 : 9;
        if (end || gap > 0.5 || cur.length >= maxW || (soft && cur.length >= 4) || (nx && nx.scene !== w.scene)) flush();
      });
      flush();
      caps.forEach((c, i) => (c.until = Math.min(c.e + 0.5, caps[i + 1] ? caps[i + 1].s - 0.02 : c.e + 0.5)));
      this.caps = caps; this.capIdx = -2;
    }
    updateCaptions(t) {
      const caps = this.caps; let idx = -1;
      for (let i = 0; i < caps.length; i++) { if (t >= caps[i].s - 0.06 && t < caps[i].until) { idx = i; break; } if (caps[i].s > t) break; }
      const inner = this.cap.firstElementChild;
      if (idx !== this.capIdx) {
        this.capIdx = idx;
        inner.innerHTML = idx < 0 ? "" : caps[idx].w.map((w) => `<span>${esc(w.text)}</span>`).join(" ");
        this.cap.classList.toggle("on", idx >= 0);
      }
      if (idx >= 0) {
        const spans = inner.children;
        caps[idx].w.forEach((w, k) => { spans[k].className = t >= w.s - 0.02 ? (t < w.e + 0.04 ? "now" : "said") : ""; });
      }
    }

    seek(t) {
      t = Math.max(0, Math.min(t, this.total));
      this.tl.time(t, false);
      const lastS = this.scenes[this.scenes.length - 1];
      for (const S of this.scenes) {
        const vis = t >= S.t0 - 0.45 && (t <= S.t1 + 0.3 || S === lastS);
        S.cam.style.visibility = vis ? "inherit" : "hidden";
        if (vis) S.ambient.forEach((f) => f(t));
      }
      this.updateCaptions(t);
      this.bar.firstElementChild.style.transform = `scaleX(${(t / this.total).toFixed(4)})`;
      for (const g of this.gates) if (this.mode === "capture") g.auto(t);
      this.t = t;
    }
    sceneAt(t) { let k = 0; this.scenes.forEach((S, i) => { if (t >= S.t0 - 0.2) k = i; }); return k; }
  }
  function data_kicker(d) { return d && d.number != null; }

  // ---------- per-scene authoring context ----------
  class SceneCtx {
    constructor(L, sc, i, el, cam, words) {
      Object.assign(this, { L, sc, i, el, cam, ws: words });
      this.t0 = sc.start; this.dur = sc.dur; this.t1 = sc.start + sc.dur;
      this.tl = L.tl; this.ambient = [];
      this.portrait = L.portrait; this.W = L.W; this.H = L.H;
    }
    h(html) { return h(html); }
    add(html, parent) { const e = typeof html === "string" ? h(html) : html; (parent || this.cam).appendChild(e); return e; }
    md(s) { return md(s); }
    esc(s) { return esc(s); }
    frac(f) { return this.t0 + f * this.dur; }
    // global time of a phrase spoken in this scene (word-level match, punctuation-insensitive)
    find(phrase, nth = 0, quiet = false) {
      if (phrase == null) return null;
      const toks = String(phrase).split(/\s+/).map(NORM).filter(Boolean);
      if (!toks.length) return null;
      const ws = this.ws; let hit = 0;
      for (let i = 0; i + toks.length <= ws.length; i++) {
        let ok = true;
        for (let k = 0; k < toks.length; k++) if (ws[i + k].n !== toks[k]) { ok = false; break; }
        if (ok && hit++ === nth) return [i, i + toks.length - 1];
      }
      // fallbacks: first token exact, then a prefix match ("agent" vs "agents") for longer words
      if (toks.length > 1) for (let i = 0; i < ws.length; i++) if (ws[i].n === toks[0]) return [i, i];
      if (toks[0].length >= 4) for (let i = 0; i < ws.length; i++) if (ws[i].n.startsWith(toks[0]) || (toks[0].startsWith(ws[i].n) && ws[i].n.length >= 4)) return [i, i];
      if (!quiet) this.L.cueErrors.push(`scene ${this.i} (${this.sc.template}): "${phrase}"`);
      return null;
    }
    cue(phrase, fallback = 0.15, nth = 0) {
      if (typeof phrase === "number") return this.frac(phrase);
      const r = this.find(phrase, nth);
      return r ? this.ws[r[0]].s : this.frac(fallback);
    }
    cueEnd(phrase, fallback = 0.5) { const r = this.find(phrase); return r ? this.ws[r[1]].e : this.frac(fallback); }
    // distribute n reveal times: explicit cues win, the rest spread between a..b (fractions of the scene)
    spread(items, a = 0.08, b = 0.7, key = "at") {
      const n = items.length;
      return items.map((it, k) => (it && it[key] != null ? this.cue(it[key], a + (b - a) * (n > 1 ? k / (n - 1) : 0)) : this.frac(a + (b - a) * (n > 1 ? k / (n - 1) : 0))));
    }
    amb(fn) { this.ambient.push(fn); }

    // ---------- animation helpers ----------
    hide(el) { gsap.set(el, { autoAlpha: 0 }); return el; }
    inn(t, el, from = {}, d = 0.6, ease = "power3.out") {
      gsap.set(el, { autoAlpha: 0 });
      const to = { autoAlpha: 1, duration: d, ease, immediateRender: false };
      for (const k of Object.keys(from)) to[k] = /^scale/.test(k) ? 1 : 0;
      this.tl.fromTo(el, Object.assign({ autoAlpha: 0 }, from), to, t);
      return el;
    }
    fade(t, el, d = 0.5) { return this.inn(t, el, {}, d, "power1.out"); }
    rise(t, el, d = 0.6, y = 40) { return this.inn(t, el, { y }, d); }
    drop(t, el, d = 0.55) { return this.inn(t, el, { y: -50 }, d, "back.out(1.6)"); }
    pop(t, el, d = 0.55) { return this.inn(t, el, { scale: 0.4 }, d, "back.out(1.9)"); }
    slideL(t, el, d = 0.6) { return this.inn(t, el, { x: -70 }, d); }
    slideR(t, el, d = 0.6) { return this.inn(t, el, { x: 70 }, d); }
    out(t, el, d = 0.35, to = {}) { this.tl.to(el, Object.assign({ autoAlpha: 0, duration: d, ease: "power2.in" }, to), t); return el; }
    to(t, el, vars) { this.tl.to(el, Object.assign({ duration: 0.5, ease: "power2.out" }, vars), t); return el; }
    set(t, el, vars) { this.tl.set(el, vars, t); return el; }
    stagger(t, els, gap = 0.08, how = "rise") { [...els].forEach((e, k) => this[how](t + k * gap, e)); }
    draw(t, el, d = 0.8, ease = "power2.inOut") {
      const paths = /^(path|line|circle|polyline|rect|ellipse|polygon)$/.test(el.tagName) ? [el] : [...el.querySelectorAll("[data-draw]")];
      paths.forEach((p) => { p.setAttribute("pathLength", "1"); p.style.strokeDasharray = "1 1"; p.style.strokeDashoffset = "1"; });
      this.tl.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease, stagger: d * 0.12, immediateRender: false }, t);
      return el;
    }
    // reveal inline markup effects (.mk highlight swipe, .ul underline, .st strike) inside el at time t (or when spoken)
    marks(el, t, minT) {
      el.querySelectorAll(".mk,.ul,.st").forEach((m) => {
        const r = this.find(m.textContent, 0, true);
        let at = r ? this.ws[r[1]].e - 0.1 : t;
        if (minT != null) at = Math.max(at, minT);
        gsap.set(m, { "--sw": 0 });
        this.tl.fromTo(m, { "--sw": 0 }, { "--sw": 1, duration: 0.45, ease: "power2.out", immediateRender: false }, at);
      });
    }
    // split element text into word spans (keeps nested markup)
    split(el) {
      const spans = [];
      const walk = (node) => [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(" "));
            else { const sp = document.createElement("span"); sp.className = "w"; sp.textContent = w; frag.appendChild(sp); spans.push(sp); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !/^(svg|code)$/i.test(n.tagName)) walk(n);
        else if (n.nodeType === 1) spans.push(n);
      });
      walk(el);
      return spans;
    }
    // words appear as they are spoken (if they are in the narration), else a quick stagger from t
    say(el, t, gap = 0.07) {
      const spans = this.split(el);
      const ws = this.ws; let wi = 0; let last = t;
      spans.forEach((sp, k) => {
        const n = NORM(sp.textContent);
        let tt = null;
        for (let j = wi; j < Math.min(ws.length, wi + 6) && n; j++) if (ws[j].n === n) { tt = ws[j].s; wi = j + 1; break; }
        if (tt == null || tt < last - 0.05) tt = Math.max(last + 0.03, t + k * gap * 0.4);
        tt = Math.max(tt, t);
        last = tt;
        gsap.set(sp, { autoAlpha: 0 });
        this.tl.fromTo(sp, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, tt - 0.06);
      });
      return el;
    }
    words(t, el, gap = 0.05) {
      const spans = this.split(el);
      spans.forEach((sp, k) => { gsap.set(sp, { autoAlpha: 0 }); this.tl.fromTo(sp, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out", immediateRender: false }, t + k * gap); });
      return el;
    }
    type(t, el, text, cps = 38) { // typewriter (seek-safe)
      const s = String(text); const d = Math.max(0.15, s.length / cps);
      const o = { n: 0 };
      el.textContent = "";
      this.tl.fromTo(o, { n: 0 }, { n: s.length, duration: d, ease: "none", immediateRender: false, onUpdate: () => (el.textContent = s.slice(0, Math.round(o.n))) }, t);
      return t + d;
    }
    count(t, el, to, { d = 1.4, decimals = 0, prefix = "", suffix = "" } = {}) {
      const o = { v: 0 }; const fmt = (v) => prefix + Number(v).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      el.textContent = fmt(0);
      this.tl.fromTo(o, { v: 0 }, { v: to, duration: d, ease: "power2.out", immediateRender: false, onUpdate: () => (el.textContent = fmt(o.v)) }, t);
    }
    // handwritten margin note with arrow: {text, at, x, y, rot}
    note(n) {
      const pos = this.portrait ? (n.pp || n.p || [60, 70]) : (n.p || [70, 18]);
      const el = this.add(`<div class="hnote" style="left:${pos[0]}%;top:${pos[1]}%;--rot:${n.rot ?? -4}deg">${esc(n.text)}</div>`, this.el);
      this.pop(this.cue(n.at, 0.5), el, 0.5);
    }
    punch(p) {
      const el = this.add(`<div class="punch"><span>${esc(p.text)}</span></div>`, this.el);
      const t = this.cue(p.at, 0.6);
      gsap.set(el, { autoAlpha: 0 });
      this.tl.fromTo(el, { autoAlpha: 0, scale: 1.9, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.38, ease: "power4.in", immediateRender: false }, t);
      this.tl.to(el, { autoAlpha: 0, duration: 0.3 }, Math.min(this.t1 - 0.3, t + (p.hold || 1.6)));
    }
  }

  window.AE = { Lesson, md, esc, h, NORM };
})();
