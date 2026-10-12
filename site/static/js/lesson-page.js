// Lesson page: mount the player, sync the transcript, track completion, share.
(function () {
  "use strict";
  const host = document.getElementById("player");
  if (!host) return;
  const get = (k, d) => { try { const v = localStorage.getItem("ae:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  const set = (k, v) => { try { localStorage.setItem("ae:" + k, JSON.stringify(v)); } catch {} };
  const id = host.dataset.id;
  const markBtn = document.getElementById("mark-done");
  const setDone = (v) => { const d = get("done", {}); if (v) d[id] = Date.now(); else delete d[id]; set("done", d); markBtn.textContent = v ? "✓ Done" : "Mark as done"; markBtn.classList.toggle("primary", !!v); };
  setDone(!!get("done", {})[id]);
  markBtn.addEventListener("click", () => setDone(!get("done", {})[id]));
  const paras = [...document.querySelectorAll(".tr-p")];
  let cur = -1;
  const start = async () => {
    if (!window.AE_Player || !window.AE) return setTimeout(start, 40);
    const data = await (await fetch(host.dataset.src)).json();
    await document.fonts.ready;
    const P = new AE_Player(host, data, {
      audio: host.dataset.audio,
      next: host.dataset.next ? { url: host.dataset.next, title: host.dataset.nextTitle || "next lesson" } : null,
      last: !!host.dataset.last,
      onTime: (t, pl) => {
        const i = pl.L ? pl.L.sceneAt(t) : 0;
        if (i !== cur) { cur = i; paras.forEach((p) => p.classList.toggle("on", +p.dataset.i === i)); }
      },
      onDone: () => setDone(true),
      onAnswer: (g, i, ok) => { const q = get("quiz", {}); q[id + ":" + g.scene] = ok; set("quiz", q); },
    });
    window.P = P;
    document.querySelectorAll("[data-seek]").forEach((b) => b.addEventListener("click", () => { P.seek(+b.dataset.seek + 0.01); host.scrollIntoView({ behavior: "smooth", block: "start" }); }));
  };
  if (document.readyState !== "loading") start(); else document.addEventListener("DOMContentLoaded", start);
  const share = document.getElementById("share");
  share?.addEventListener("click", async () => {
    const data = { title: share.dataset.title, url: share.dataset.url };
    if (navigator.share) { try { await navigator.share(data); return; } catch {} }
    navigator.clipboard?.writeText(data.url); window.AE_TOAST?.("Link copied");
  });
})();
