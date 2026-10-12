// Characters + icons. The agent: an orange tile with a dark visor. You: a blue person.
(function () {
  "use strict";
  const eyes = {
    normal: '<rect class="eye" x="41" y="49" width="12" height="20" rx="6"/><rect class="eye" x="67" y="49" width="12" height="20" rx="6"/>',
    happy: '<path class="eye-l" d="M40 63 Q47 51 54 63" /><path class="eye-l" d="M66 63 Q73 51 80 63" />',
    think: '<rect class="eye" x="38" y="47" width="11" height="17" rx="5.5"/><rect class="eye" x="62" y="47" width="11" height="17" rx="5.5"/>',
    work: '<rect class="eye" x="40" y="56" width="14" height="8" rx="4"/><rect class="eye" x="66" y="56" width="14" height="8" rx="4"/>',
    alert: '<circle class="eye" cx="47" cy="59" r="9"/><circle class="eye" cx="73" cy="59" r="9"/>',
    sleep: '<path class="eye-l" d="M40 60 L54 60"/><path class="eye-l" d="M66 60 L80 60"/>',
  };
  function agent(opts = {}) {
    const mood = opts.mood || "normal", size = opts.size || 120, light = opts.light || (mood === "alert" ? "#E5484D" : "#FFD24A");
    const body = opts.color || "var(--agent)";
    return `<svg class="agent mood-${mood}" viewBox="0 0 120 124" width="${size}" height="${Math.round(size * 124 / 120)}" aria-hidden="true">
      <line x1="60" y1="20" x2="60" y2="8" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
      <circle class="light" cx="60" cy="7" r="6" fill="${light}" stroke="var(--ink)" stroke-width="3"/>
      <rect x="8" y="20" width="104" height="96" rx="30" fill="${body}" stroke="var(--ink)" stroke-width="4"/>
      <rect x="22" y="36" width="76" height="50" rx="22" fill="#18181D"/>
      <g class="eyes" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="0">${eyes[mood] || eyes.normal}</g>
      <path d="M48 98 Q60 106 72 98" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
  }
  function human(opts = {}) {
    const size = opts.size || 120, c = opts.color || "var(--human)";
    return `<svg class="human" viewBox="0 0 120 124" width="${size}" height="${Math.round(size * 124 / 120)}" aria-hidden="true">
      <path d="M14 118 C14 86 34 72 60 72 C86 72 106 86 106 118 Z" fill="${c}" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="60" cy="38" r="26" fill="${c}" stroke="var(--ink)" stroke-width="4"/>
      <circle cx="51" cy="38" r="3.6" fill="var(--ink)"/><circle cx="69" cy="38" r="3.6" fill="var(--ink)"/>
      <path d="M52 48 Q60 54 68 48" fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
  }
  // 24x24 stroke icons
  const P = {
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
    test: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 5-6 4-11 8"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    loop: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
    plan: '<path d="M9 5h11M9 12h11M9 19h11"/><path d="M4 5h.01M4 12h.01M4 19h.01"/>',
    code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c4-1 6 1 6 1s2 2 1 6l-7 7-7-7z"/><circle cx="15" cy="9" r="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="4"/><path d="M12 8V4M9 13v1M15 13v1"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
    gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="M12 13l4-5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    money: '<circle cx="12" cy="12" r="9"/><path d="M15 9a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2A3.5 3.5 0 0 1 9 15M12 6v2M12 16v2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
    puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    merge: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v10M6 9c0 6 12 4 12 8"/>',
  };
  function icon(name, size = 32, cls = "") {
    const d = P[name] || P.spark;
    return `<svg class="ico ${cls}" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  }
  // blink + bob as pure functions of t
  function animateAgent(S, svg, { phase = 0, bob = 5 } = {}) {
    if (!svg) return;
    const eyesEl = svg.querySelector(".eyes");
    S.amb((t) => {
      const k = (t + phase) % 4.1;
      const blink = k < 0.14 ? 0.12 : 1;
      if (eyesEl) { eyesEl.style.transformOrigin = "60px 60px"; eyesEl.style.transform = `scaleY(${blink})`; }
      svg.style.translate = `0 ${(Math.sin((t + phase) * 2.2) * bob).toFixed(2)}px`;
    });
  }
  window.AE_ART = { agent, human, icon, animateAgent, ICONS: Object.keys(P) };
})();
