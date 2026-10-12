// Site-wide: progress badges, copy buttons, hero mini-player (muted, looping).
(function () {
  "use strict";
  const get = (k, d) => { try { const v = localStorage.getItem("ae:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  const done = get("done", {});
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1600); }
  window.AE_TOAST = toast;
  document.querySelectorAll("[data-lesson]").forEach((el) => { if (done[el.dataset.lesson]) el.classList.add("done"); });
  const rows = document.querySelectorAll(".lrow[data-lesson]");
  if (rows.length) {
    const n = [...rows].filter((r) => done[r.dataset.lesson]).length;
    const total = document.querySelectorAll(".lrow").length;
    const bar = document.getElementById("prog-bar"), txt = document.getElementById("prog-txt");
    if (bar) bar.style.width = (100 * n / total).toFixed(1) + "%";
    if (txt && n) txt.textContent = `${n} of ${total} lessons done`;
  }
  document.querySelectorAll(".copyable .copy").forEach((b) => b.addEventListener("click", () => {
    const pre = b.parentElement.querySelector("pre"); navigator.clipboard?.writeText(pre.innerText.trim()); b.textContent = "Copied"; setTimeout(() => (b.textContent = "Copy"), 1400);
  }));
  // hero mini player: silent loop through the first minute of lesson 1
  const mini = document.getElementById("mini");
  if (mini) {
    const start = async () => {
      if (!window.AE || !window.gsap) return setTimeout(start, 50);
      const data = await (await fetch(mini.dataset.src)).json();
      await document.fonts.ready;
      const stage = mini.querySelector(".stage");
      const L = new AE.Lesson(stage, data, { mode: "web", portrait: false });
      const fit = () => { stage.style.transform = `scale(${mini.clientWidth / 1920})`; };
      fit(); new ResizeObserver(fit).observe(mini);
      const loopEnd = Math.min(L.total, (data.scenes[6] ? data.scenes[6].start : 60));
      let t0 = performance.now(), vis = true;
      new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(mini);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tick = (now) => { if (vis && !document.hidden) { const t = reduce ? 6 : ((now - t0) / 1000) % loopEnd; L.seek(t); } requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      mini.style.cursor = "pointer";
      mini.addEventListener("click", () => { const a = document.querySelector(".cta .primary"); if (a) location.href = a.href; });
    };
    if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  }
})();
