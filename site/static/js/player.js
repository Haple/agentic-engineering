// Web player: wraps a Lesson stage with audio, controls, chapters, quiz gates, captions, keyboard + progress.
(function () {
  "use strict";
  const fmt = (s) => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ae:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("ae:" + k, JSON.stringify(v)); } catch {} },
  };
  window.AE_STORE = store;

  class Player {
    constructor(root, data, opts = {}) {
      this.root = root; this.data = data; this.opts = opts;
      this.portrait = opts.portrait ?? (window.matchMedia("(max-width: 720px) and (orientation: portrait)").matches);
      this.rate = store.get("rate", 1);
      this.capsOn = store.get("caps", true);
      this.answered = new Set();
      this.playing = false; this.t = 0;
      this.build();
    }
    build() {
      const r = this.root;
      r.classList.add("player");
      r.innerHTML = `
        <div class="pl-frame"><div class="pl-scale"><div class="stage"></div></div>
          <button class="pl-big" aria-label="Play"><svg viewBox="0 0 24 24" width="44" height="44"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
          <div class="pl-gate" hidden><span>Pick an answer to continue</span></div>
        </div>
        <div class="pl-bar">
          <button class="pl-play" aria-label="Play/pause"><svg viewBox="0 0 24 24" width="22" height="22"><path class="ic-play" d="M8 5v14l11-7z" fill="currentColor"/><g class="ic-pause" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></g></svg></button>
          <span class="pl-time">0:00 / 0:00</span>
          <div class="pl-scrub" role="slider" aria-label="Seek" tabindex="0"><div class="pl-buf"></div><div class="pl-fill"></div><div class="pl-ticks"></div><div class="pl-knob"></div><div class="pl-tip" hidden></div></div>
          <button class="pl-rate" aria-label="Playback speed">1x</button>
          <button class="pl-cc" aria-label="Captions">CC</button>
          <button class="pl-orient" aria-label="Rotate layout" title="Switch 16:9 / 9:16"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="3" width="10" height="18" rx="2"/></svg></button>
          <button class="pl-fs" aria-label="Fullscreen"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>
        </div>`;
      this.stageEl = r.querySelector(".stage");
      this.scaleEl = r.querySelector(".pl-scale");
      this.frame = r.querySelector(".pl-frame");
      this.audio = new Audio();
      this.audio.preload = "auto";
      this.audio.src = this.opts.audio;
      this.audio.playbackRate = this.rate;
      // static hosts often ignore Range requests, which breaks seeking in a streamed MP3:
      // fetch the whole (small) file once and play it from memory, where seeking is exact.
      fetch(this.opts.audio).then((r) => (r.ok ? r.blob() : Promise.reject())).then((b) => {
        const a = this.audio, was = this.playing;
        a.src = URL.createObjectURL(b); a.playbackRate = this.rate;
        this.audioLocal = true;
        if (was) a.addEventListener("loadedmetadata", () => { if (this.playing) { try { a.currentTime = this.t; } catch {} a.play().catch(() => (this.audioFail = true)); } }, { once: true });
      }).catch(() => {});
      this.mount();
      this.wire();
      this.resize();
      new ResizeObserver(() => this.resize()).observe(this.frame);
      const saved = store.get("pos:" + this.data.id, 0);
      if (saved > 5 && saved < this.L.total - 5) this.seek(saved);
      else { this.seek(0); this.poster(); }
    }
    mount() {
      this.L = new AE.Lesson(this.stageEl, this.data, { mode: "web", portrait: this.portrait });
      this.stageEl.classList.toggle("no-caps", !this.capsOn);
      this.frame.classList.toggle("is-portrait", this.portrait);
      this.root.querySelector(".pl-ticks").innerHTML = this.L.scenes.map((S) => `<i style="left:${(S.t0 / this.L.total) * 100}%"></i>`).join("");
      this.L.gates.forEach((g) => g.options.forEach((el, i) => el.addEventListener("click", (e) => { e.stopPropagation(); this.answer(g, i); })));
      this.L.gates.forEach((g) => { if (this.answered.has(g.scene)) g.reveal(this.answered.get?.(g.scene) ?? g.answer); });
    }
    resize() {
      const W = this.portrait ? 1080 : 1920, H = this.portrait ? 1920 : 1080;
      const fw = this.frame.clientWidth;
      const maxH = Math.min(window.innerHeight * (document.fullscreenElement ? 1 : 0.86), this.portrait ? 900 : 99999);
      let k = fw / W;
      if (H * k > maxH) k = maxH / H;
      this.scaleEl.style.width = W * k + "px"; this.scaleEl.style.height = H * k + "px";
      this.stageEl.style.transform = `scale(${k})`;
      this.frame.style.height = H * k + "px";
    }
    wire() {
      const r = this.root;
      const toggle = () => (this.playing ? this.pause() : this.play());
      r.querySelector(".pl-play").onclick = toggle;
      r.querySelector(".pl-big").onclick = toggle;
      this.frame.addEventListener("click", (e) => { if (e.target.closest(".qz-o,.ex-copy,a,button,.pl-end")) return; if (this.waiting) return; toggle(); });
      const rates = [1, 1.25, 1.5, 1.75, 2, 0.75];
      const rb = r.querySelector(".pl-rate");
      const setRate = (v) => { this.rate = v; this.audio.playbackRate = v; rb.textContent = v + "x"; store.set("rate", v); };
      setRate(this.rate);
      rb.onclick = () => setRate(rates[(rates.indexOf(this.rate) + 1) % rates.length]);
      const cc = r.querySelector(".pl-cc");
      const setCaps = (on) => { this.capsOn = on; this.stageEl.classList.toggle("no-caps", !on); cc.classList.toggle("on", on); store.set("caps", on); };
      setCaps(this.capsOn);
      cc.onclick = () => setCaps(!this.capsOn);
      r.querySelector(".pl-fs").onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else (this.root.requestFullscreen || this.root.webkitRequestFullscreen)?.call(this.root); };
      document.addEventListener("fullscreenchange", () => setTimeout(() => this.resize(), 60));
      r.querySelector(".pl-orient").onclick = () => { const t = this.t, was = this.playing; this.pause(); this.portrait = !this.portrait; this.mount(); this.resize(); this.seek(t); if (was) this.play(); };
      // scrubbing
      const sc = r.querySelector(".pl-scrub"), tip = r.querySelector(".pl-tip");
      const tAt = (e) => { const b = sc.getBoundingClientRect(); const x = ((e.touches ? e.touches[0].clientX : e.clientX) - b.left) / b.width; return Math.max(0, Math.min(1, x)) * this.L.total; };
      let drag = false, resume = false;
      const down = (e) => { drag = true; resume = this.playing; this.pause(); this.seek(tAt(e)); e.preventDefault(); };
      const move = (e) => { if (drag) this.seek(tAt(e)); };
      const up = () => { if (drag) { drag = false; if (resume) this.play(); } };
      sc.addEventListener("mousedown", down); sc.addEventListener("touchstart", down, { passive: false });
      window.addEventListener("mousemove", move); window.addEventListener("touchmove", move, { passive: true });
      window.addEventListener("mouseup", up); window.addEventListener("touchend", up);
      sc.addEventListener("mousemove", (e) => { const t = tAt(e); const S = this.L.scenes[this.L.sceneAt(t)]; tip.hidden = false; tip.textContent = fmt(t) + (S && S.sc.chapter ? " · " + S.sc.chapter : ""); tip.style.left = (t / this.L.total) * 100 + "%"; });
      sc.addEventListener("mouseleave", () => (tip.hidden = true));
      sc.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") this.seek(this.t + 5); if (e.key === "ArrowLeft") this.seek(this.t - 5); });
      window.addEventListener("keydown", (e) => {
        if (/input|textarea/i.test(document.activeElement?.tagName)) return;
        if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
        else if (e.key === "ArrowRight" || e.key === "l") this.seek(this.t + (e.key === "l" ? 10 : 5));
        else if (e.key === "ArrowLeft" || e.key === "j") this.seek(this.t - (e.key === "j" ? 10 : 5));
        else if (e.key === "c") setCaps(!this.capsOn);
        else if (e.key === "f") r.querySelector(".pl-fs").click();
        else if (e.key === "n") this.nextScene(1);
        else if (e.key === "p") this.nextScene(-1);
      });
      this.audio.addEventListener("ended", () => this.finish());
      document.addEventListener("visibilitychange", () => { if (document.hidden && this.playing) this.pause(); });
    }
    // before the first play, show a fully-built title card instead of an empty frame
    poster() { const S0 = this.L.scenes[0]; if (S0) this.L.seek(Math.min(S0.t1 - 0.4, S0.t0 + 3.2)); this.isPoster = true; }
    nextScene(d) { const i = this.L.sceneAt(this.t) + d; const S = this.L.scenes[Math.max(0, Math.min(this.L.scenes.length - 1, i))]; this.seek(S.t0 + 0.01); }
    play() {
      if (this.blockedGate()) return;
      if (this.isPoster) { this.isPoster = false; this.render(0); }
      if (this.t >= this.L.total - 0.1) this.render(0);
      this.root.classList.remove("is-done");
      this.playing = true; this.root.classList.add("is-playing");
      const a = this.audio;
      const start = () => { try { a.currentTime = this.t; } catch {} const pr = a.play(); if (pr && pr.catch) pr.catch(() => { this.audioFail = true; }); };
      if (a.readyState >= 1) start(); else { a.addEventListener("loadedmetadata", () => { if (this.playing) start(); }, { once: true }); a.load(); }
      this.last = performance.now();
      cancelAnimationFrame(this.raf);
      // the visual clock is the master; audio follows it (and is corrected if it drifts or restarts)
      const loop = (now) => {
        if (!this.playing) return;
        const dt = Math.min(0.25, (now - this.last) / 1000) * this.rate;
        this.last = now;
        let t = this.t + dt;
        if (!this.audioFail && a.readyState >= 2 && !a.paused && !a.seeking) {
          const at = a.currentTime;
          if (Math.abs(at - t) < 0.3) t = at;
          else if (now - (this.lastFix || 0) > 600) { this.lastFix = now; try { a.currentTime = t; } catch {} }
        }
        const g = this.L.gates.find((g) => !this.answered.has(g.scene) && this.t < g.t && t >= g.t);
        if (g) { this.render(g.t); this.gate(g); return; }
        if (t >= this.L.total) { this.render(this.L.total); this.finish(); return; }
        this.render(t);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
      this.opts.onPlay?.();
    }
    pause() { this.playing = false; this.root.classList.remove("is-playing"); this.audio.pause(); cancelAnimationFrame(this.raf); store.set("pos:" + this.data.id, this.t); }
    seek(t) { this.isPoster = false; t = Math.max(0, Math.min(this.L.total, t)); this.render(t); if (this.playing) this.audio.currentTime = t; }
    render(t) {
      this.t = t;
      this.L.seek(t);
      const k = t / this.L.total;
      this.root.querySelector(".pl-fill").style.transform = `scaleX(${k})`;
      this.root.querySelector(".pl-knob").style.left = k * 100 + "%";
      this.root.querySelector(".pl-time").textContent = fmt(t) + " / " + fmt(this.L.total);
      // quiz state follows the playhead: before a gate unanswered -> clean; answered -> revealed
      this.L.gates.forEach((g) => { if (this.answered.has(g.scene)) g.reveal(this.answers?.[g.scene] ?? g.answer); else g.reset(); });
      if (Math.floor(t) % 5 === 0) store.set("pos:" + this.data.id, t);
      this.opts.onTime?.(t, this);
    }
    blockedGate() { return this.waiting; }
    gate(g) {
      this.playing = false; this.audio.pause(); this.waiting = g;
      this.root.classList.remove("is-playing"); this.root.classList.add("at-gate");
      this.root.querySelector(".pl-gate").hidden = false;
    }
    answer(g, i) {
      // only answerable while the quiz is on screen
      const S = this.L.scenes[g.scene];
      if (!this.waiting && (this.t < S.t0 - 0.3 || this.t > S.t1 + 0.3)) return;
      if (this.answered.has(g.scene) && this.waiting !== g) return;
      this.answers = this.answers || {}; this.answers[g.scene] = i;
      this.answered.add(g.scene);
      g.reveal(i);
      this.opts.onAnswer?.(g, i, i === g.answer);
      if (this.waiting === g) {
        const gateEl = this.root.querySelector(".pl-gate");
        gateEl.hidden = false; gateEl.classList.add("cont");
        gateEl.innerHTML = `<span>${i === g.answer ? "Correct!" : "Not quite — see why above."}</span><button type="button" class="pl-cont">Continue ▶</button>`;
        gateEl.querySelector(".pl-cont").addEventListener("click", (e) => { e.stopPropagation(); this.resumeFromGate(g); });
      }
    }
    resumeFromGate(g) {
      const gateEl = this.root.querySelector(".pl-gate");
      gateEl.hidden = true; gateEl.classList.remove("cont"); gateEl.innerHTML = "<span>Pick an answer to continue</span>";
      this.root.classList.remove("at-gate");
      this.waiting = null;
      this.seek(Math.max(this.t, g.t + 0.01));
      this.play();
    }
    finish() {
      this.pause(); this.t = this.L.total; store.set("pos:" + this.data.id, 0);
      this.root.classList.add("is-done");
      let end = this.root.querySelector(".pl-end");
      if (!end) {
        end = document.createElement("div"); end.className = "pl-end";
        const nx = this.opts.next;
        end.innerHTML = `<div class="pl-end-in"><b>${this.opts.last ? "✓ Course complete. Thank you!" : "✓ Lesson complete"}</b>${nx ? `<a class="pl-next" href="${nx.url}">Next: ${nx.title} →</a>` : `<a class="pl-next" href="/#lessons">Back to the course →</a>`}<button type="button" class="pl-replay">↺ Replay</button></div>`;
        end.addEventListener("click", (e) => e.stopPropagation());
        end.querySelector(".pl-replay").addEventListener("click", () => { this.root.classList.remove("is-done"); this.answered.clear(); this.render(0); this.play(); });
        this.frame.appendChild(end);
      }
      this.opts.onDone?.();
    }
  }
  window.AE_Player = Player;
})();
