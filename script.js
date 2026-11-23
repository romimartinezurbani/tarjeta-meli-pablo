(function () {
  const C = CONFIG;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fecha = new Date(C.ceremonia.fecha);

  /* ======== ÍCONOS DE LÍNEA (se dibujan al scrollear) ======== */
  const flute = '<path d="M-6 -24L-5 -8Q-5 2 0 2Q5 2 5 -8L6 -24Z"/><path d="M0 2V18M-6 18H6"/>';
  const ICONS = {
    rings: '<circle cx="24" cy="40" r="13"/><circle cx="40" cy="40" r="13"/><path d="M26 18l6-9 6 9-6 8z"/><path d="M26 18h12"/>',
    glasses: `<g transform="translate(22 34) rotate(-14)">${flute}</g><g transform="translate(42 34) rotate(14)">${flute}</g><path d="M32 6v5M24 8l2.5 4M40 8l-2.5 4"/>`,
    music: '<ellipse cx="19" cy="46" rx="6" ry="4.5"/><ellipse cx="41" cy="40" rx="6" ry="4.5"/><path d="M25 46V14M47 40V8M25 14L47 8M25 22L47 16"/>',
    hanger: '<path d="M32 27v-4c0-2 4-3 4-7a5 5 0 1 0-10 0"/><path d="M32 27L8 43a3 3 0 0 0 1.7 5.5h44.6A3 3 0 0 0 56 43z"/>',
    clip: '<rect x="14" y="12" width="36" height="44" rx="4"/><path d="M25 12V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M24 34l6 6 11-12"/>',
    gift: '<rect x="12" y="28" width="40" height="26" rx="2"/><rect x="9" y="20" width="46" height="8" rx="2"/><path d="M32 20v34"/><path d="M32 20C26 8 15 11 21 19c3 2 8 2 11 1zM32 20c6-12 17-9 11-1-3 2-8 2-11 1z"/>',
    pin: '<path d="M32 58C20 44 14 36 14 27a18 18 0 0 1 36 0c0 9-6 17-18 31z"/><circle cx="32" cy="27" r="6"/>',
    cal: '<rect x="9" y="14" width="46" height="42" rx="4"/><path d="M9 27h46M21 8v10M43 8v10"/><path d="M25 42l5 5 10-11"/>',
    insta: '<rect x="10" y="10" width="44" height="44" rx="13"/><circle cx="32" cy="32" r="10"/><circle cx="46" cy="18" r="1.2"/>',
    heart: '<path d="M32 54C8 37 8 19 20 14c6-2 11 2 12 7 1-5 6-9 12-7 12 5 12 23-12 40z"/>',
    hourglass: '<path d="M18 8h28M18 56h28M21 8l11 22L43 8M21 56l11-22 11 22M32 30v4"/>',
    chat: '<path d="M10 14a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H26L14 52V42a4 4 0 0 1-4-4z"/><path d="M22 22h20M22 30h12"/>',
    envelope: '<rect x="8" y="16" width="48" height="34" rx="4"/><path d="M8 21l24 18 24-18"/>'
  };
  $$("[data-ico]").forEach((s) => { s.setAttribute("viewBox", "0 0 64 64"); s.innerHTML = ICONS[s.dataset.ico]; });

  /* ======== ramita de línea fina ======== */
  function rng(seed) { let a = seed * 9301 + 49297; return () => ((a = (a * 16807) % 2147483647) / 2147483647); }
  function sprig(seed) {
    const r = rng(seed + 3), P = [[100, 420], [62, 300], [140, 190], [95, 30]];
    const at = (t) => { const u = 1 - t; return [0, 1].map((k) => u*u*u*P[0][k] + 3*u*u*t*P[1][k] + 3*u*t*t*P[2][k] + t*t*t*P[3][k]); };
    let out = `<path d="M${P[0]} C${P[1]} ${P[2]} ${P[3]}"/>`;
    for (let i = 0; i < 9; i++) {
      const t = 0.15 + (i / 9) * 0.82, [x, y] = at(t), side = i % 2 ? 1 : -1;
      const a = side * (40 + r() * 30), s = 0.7 + (1 - t) * 0.9;
      out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)}) scale(${s.toFixed(2)})"><path d="M0 0C18-12 20-46 0-76C-20-46-18-12 0 0Z"/><path d="M0 0V-58" opacity=".6"/></g>`;
    }
    return out;
  }
  $$("[data-sprig]").forEach((s) => { s.setAttribute("viewBox", "0 0 200 440"); s.innerHTML = sprig(+s.dataset.sprig); });

  /* ======== dibujo por trazo ======== */
  const GEO = "path,circle,ellipse,rect,line,polyline";
  function prep(root) {
    root.querySelectorAll(GEO).forEach((el) => {
      let L = 100; try { L = el.getTotalLength() || 100; } catch (_) {}
      el._L = L; el.style.strokeDasharray = L; el.style.strokeDashoffset = L;
    });
  }
  const setP = (root, p) => root.querySelectorAll(GEO).forEach((el) => { el.style.strokeDashoffset = (el._L || 0) * (1 - p); });
  function autoDraw(root, delay = 0) {
    root.querySelectorAll(GEO).forEach((el, i) => {
      el.style.transition = `stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1) ${(delay + i * 0.05).toFixed(2)}s`;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => setP(root, 1)));
  }

  /* ======== textos ======== */
  $$("[data-novia]").forEach((e) => (e.textContent = C.novia));
  $$("[data-novio]").forEach((e) => (e.textContent = C.novio));
  $$("[data-ini-novia]").forEach((e) => (e.textContent = C.novia[0]));
  $$("[data-ini-novio]").forEach((e) => (e.textContent = C.novio[0]));
  document.title = `${C.novia} & ${C.novio} · Nos casamos`;
  const F1 = "El amor nunca deja de ser.", F1R = "1 Corintios 13:8",
    F2 = "Nos elegimos un día, sin imaginar que este amor, construido en cada abrazo, en cada desafío y en cada sueño compartido, llegaría a convertirse en el regalo de Dios más grande: Nuestra Familia.";
  let fr = (C.frase || "").trim();
  if (!fr || /corintios/i.test(fr)) fr = F1;
  $("#frase").textContent = "“" + fr.replace(/^[“"]|[”"]$/g, "") + "”";
  $("#fraseRef").textContent = C.fraseRef || F1R;
  $("#frase2").textContent = "“" + (C.frase2 || F2) + "”";
  $("#footNames").textContent = `${C.novia} & ${C.novio}`;
  $("#hashtag").textContent = C.hashtag;
  const fmt = (d, o) => d.toLocaleDateString("es-AR", o);
  $("#heroDate").textContent = fmt(fecha, { day: "numeric", month: "long", year: "numeric" });
  $$("[data-split]").forEach((el) => {
    const name = C[el.dataset.split];
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = [...name].map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join("");
  });
  $("#names").setAttribute("aria-label", `${C.novia} y ${C.novio}`);

  /* invitado personalizado ?i=Nombre */
  const guest = (new URLSearchParams(location.search).get("i") || "").trim().slice(0, 80);
  if (guest) {
    $("#introGuest").hidden = false; $("#introGuest").textContent = "para " + guest;
    $("#invitadosSec").hidden = false; $("#guestName").textContent = guest; $("#rName").value = guest;
  }

  /* retrato en arco */
  const pim = new Image();
  pim.onload = () => { const a = $("#arch"); a.replaceChildren(pim); };
  pim.alt = `${C.novia} y ${C.novio}`; pim.src = C.portada;

  /* ======== lugares ======== */
  function col(el, ico, t, o) {
    const d = new Date(o.fecha), hora = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
    const dia = fmt(d, { weekday: "long", day: "numeric", month: "long" }), diaCap = dia.charAt(0).toUpperCase() + dia.slice(1);
    el.innerHTML = `<div class="badge"><svg class="ico draw" data-ico="${ico}"></svg></div>
      <span class="ribbon">${t}</span>
      <h5>Día</h5><p>${diaCap} · ${hora} hs</p>
      <h5>Lugar</h5><p><b style="font-weight:500">${o.lugar}</b><br>${o.direccion}</p>
      <div class="btn-row"><a class="btn ghost" href="${o.mapa}" target="_blank" rel="noopener">¿Cómo llegar?</a></div>`;
    const s = el.querySelector("svg"); s.setAttribute("viewBox", "0 0 64 64"); s.innerHTML = ICONS[ico];
  }
  col($("#colCeremonia"), "rings", "Ceremonia", C.ceremonia);
  col($("#colFiesta"), "glasses", "Fiesta", C.fiesta);

  /* ======== galería fija (grilla de polaroids, sin movimiento) ======== */
  const gal = $("#gallery"), lb = $("#lightbox");
  C.fotos.forEach((src, i) => {
    const d = document.createElement("figure"); d.className = "pol reveal";
    d.style.setProperty("--r", [-2.5, 2, -1.5, 2.5, -2][i % 5] + "deg"); d.style.setProperty("--d", i * 0.1 + "s");
    d.innerHTML = `<div class="ph">${i % 2 ? C.novio : C.novia} ♡</div>`; gal.appendChild(d);
    const im = new Image(); im.alt = `Foto de ${C.novia} y ${C.novio}`;
    im.onload = () => { const ph = d.querySelector(".ph"); ph.replaceChildren(im); ph.onclick = () => { lb.querySelector("img").src = src; lb.classList.add("show"); }; };
    im.src = src;
  });
  $("#timeline").innerHTML = (C.historia || []).map((h) => `<div class="tl reveal"><small>${h.cuando}</small><h4>${h.titulo}</h4><p>${h.texto}</p></div>`).join("");

  /* ======== modales ======== */
  $$("[data-modal]").forEach((b) => b.addEventListener("click", () => $("#modal-" + b.dataset.modal).classList.add("show")));
  $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m || e.target.classList.contains("x")) m.classList.remove("show"); }));
  addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".modal.show").forEach((m) => m.classList.remove("show")); });
  $("#dressTitle").textContent = C.vestimentaTitulo;
  $("#dressBody").innerHTML = C.vestimentaTexto.map((t) => `<p class="pedido"></p>`).join("");
  $$("#dressBody .pedido").forEach((p, i) => (p.textContent = C.vestimentaTexto[i]));
  const tips = C.tips || [];
  $("#tipsList").innerHTML = tips.map((t) => `<li>${t}</li>`).join("");
  if (!tips.length) $("#tipsItem").remove();
  const rg = C.regalo || {};
  if (rg.texto || rg.alias) {
    $("#regaloTxt").textContent = rg.texto || "";
    if (rg.alias) {
      $("#aliasTxt").textContent = rg.alias; $("#titularTxt").textContent = rg.titular || "";
      $("#copyAlias").addEventListener("click", async (e) => {
        try { await navigator.clipboard.writeText(rg.alias); } catch (_) {}
        e.target.textContent = "¡Copiado!"; setTimeout(() => (e.target.textContent = "Copiar alias"), 2000);
      });
    } else $("#giftItem .alias").remove();
  } else $("#giftItem").remove();

  /* ======== base de datos (Firebase · Firestore vía REST) ======== */
  const DB = C.firebase || {}, SH = C.hoja || {};
  const sheetOn = !!SH.url, fbOn = !!(DB.projectId && DB.apiKey), dbOn = sheetOn || fbOn;
  const toField = (v) => typeof v === "boolean" ? { booleanValue: v } : typeof v === "number" ? { integerValue: String(v) } : { stringValue: String(v) };
  async function saveSheet(collection, row) {
    // sin cabeceras especiales: así el navegador no pide permiso previo (CORS) y Google responde igual
    const res = await fetch(SH.url, { method: "POST", body: JSON.stringify({ hoja: collection === "rsvps" ? "invitados" : "musica", ...row }) });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || "error");
  }
  async function save(collection, row) {
    if (sheetOn) return saveSheet(collection, row);
    const fields = {};
    Object.entries(row).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== "") fields[k] = toField(v); });
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(DB.projectId)}/databases/(default)/documents/${collection}?key=${encodeURIComponent(DB.apiKey)}`;
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields }) });
    if (!res.ok) throw new Error(await res.text());
  }
  const waLink = (m) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(m)}`;
  $("#askWa").href = waLink(`¡Hola! Tengo una consulta sobre el casamiento de ${C.novia} y ${C.novio}.`);
  if (C.valorTarjeta) $("#valorTarjeta").textContent = "Valor de la tarjeta: " + C.valorTarjeta; else $("#valorTarjeta").remove();

  /* --- canción --- */
  $("#sendSong").addEventListener("click", async (e) => {
    const btn = e.currentTarget, song = $("#sSong").value.trim(), who = $("#sName").value.trim() || guest || "";
    if (!song) return $("#sSong").focus();
    const msg = $("#songMsg"); msg.textContent = ""; btn.disabled = true; btn.textContent = "Enviando…";
    try {
      if (!dbOn) { window.open(waLink(`¡Hola! Soy ${who || "un invitado"}. La canción que no puede faltar en el casamiento de ${C.novia} y ${C.novio}: 🎶 ${song}`), "_blank"); throw 0; }
      await save("canciones", { nombre: who || null, cancion: song.slice(0, 150) });
      msg.textContent = "¡Anotada! Gracias 🎶"; $("#sSong").value = "";
      setTimeout(() => { $("#modal-song").classList.remove("show"); msg.textContent = ""; }, 1800);
    } catch (err) { if (dbOn) msg.textContent = "No pudimos enviarla. Probá de nuevo en un momento."; }
    btn.disabled = false; btn.textContent = "Enviar";
  });

  /* --- confirmación --- */
  $("#rsvpTxt").textContent = `Por favor confirmanos tu asistencia antes del ${C.confirmarHasta}.`;
  $("#kidsNote").textContent = C.menuInfantil || "";
  const kidsSel = $("#rKids"), menuSel = $("#rMenu"), kidsBox = $("#kidsBox");
  kidsSel.addEventListener("change", () => {
    const k = +kidsSel.value;
    menuSel.innerHTML = Array.from({ length: k + 1 }, (_, i) => `<option>${i}</option>`).join(""); menuSel.value = k;
    kidsBox.classList.toggle("show", k > 0);
  });
  $("#rsvpForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if ($("#rWeb").value) return;                                   // anti-spam (campo trampa)
    const si = e.submitter && e.submitter.dataset.resp === "si", nombre = $("#rName").value.trim(), msg = $("#rsvpMsg");
    if (nombre.length < 2) { msg.textContent = "Escribí tu nombre y apellido."; return $("#rName").focus(); }
    const k = si ? +kidsSel.value : 0;
    const row = {
      nombre, asiste: si, adultos: si ? +$("#rAdults").value : 0, menores: k, menu_infantil: k ? +menuSel.value : 0,
      edades_menores: k ? $("#rAges").value.trim().slice(0, 120) || null : null,
      restricciones: si ? $("#rDiet").value.trim().slice(0, 300) || null : null, invitado_link: guest || null
    };
    const btns = $$("#rsvpForm button"); btns.forEach((b) => (b.disabled = true)); msg.textContent = "Guardando…";
    try {
      if (!dbOn) {
        let m = si ? `¡Hola! Soy ${nombre}. Confirmo mi asistencia 🎉 Adultos: ${row.adultos}. Menores: ${row.menores} (menú infantil: ${row.menu_infantil}).` : `¡Hola! Soy ${nombre}. No podré asistir. ¡Les deseo lo mejor!`;
        window.open(waLink(m), "_blank"); btns.forEach((b) => (b.disabled = false)); msg.textContent = ""; return;
      }
      await save("rsvps", row);
      const first = nombre.split(" ")[0];
      const resumen = si ? `Anotamos ${row.adultos} adulto${row.adultos > 1 ? "s" : ""}` + (k ? ` y ${k} menor${k > 1 ? "es" : ""}` + (row.menu_infantil ? ` (${row.menu_infantil} con menú infantil)` : "") : "") + ". ¡Nos vemos pronto!" : "Lamentamos que no puedas acompañarnos. ¡Gracias por avisarnos!";
      $("#rsvpForm").innerHTML = `<div class="thanks"><svg class="ico" viewBox="0 0 64 64">${ICONS.heart}</svg><h4>¡Gracias, ${first}!</h4><p>${resumen}</p></div>`;
      const sv = $("#rsvpForm .ico"); prep(sv); autoDraw(sv);
    } catch (err) {
      btns.forEach((b) => (b.disabled = false));
      msg.innerHTML = `No pudimos guardar tu respuesta. Probá de nuevo o <a href="${waLink("Hola, soy " + nombre + ". " + (si ? "Confirmo mi asistencia." : "No podré asistir."))}" target="_blank" rel="noopener">avisanos por WhatsApp</a>.`;
    }
  });
  const r = C.redes;
  $("#redes").innerHTML = `<a class="btn ghost" href="${r.instagramMeli}" target="_blank" rel="noopener">${C.novia}</a>
    <a class="btn ghost" href="${r.instagramPablo}" target="_blank" rel="noopener">${C.novio}</a>` +
    (r.album ? `<a class="btn" href="${r.album}" target="_blank" rel="noopener">Subí tus fotos</a>` : "");

  /* ======== contador con "roll" ======== */
  function setNum(el, v) { if (el.textContent !== String(v)) { el.textContent = v; el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip"); } }
  function tick() {
    const diff = fecha - new Date();
    if (diff <= 0) { $("#countdown").style.display = "none"; $("#cdMsg").textContent = diff > -864e5 ? "¡Hoy es el gran día!" : "¡Ya somos esposos! Gracias por acompañarnos"; return; }
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    setNum($("#cd-d"), d); setNum($("#cd-h"), String(h).padStart(2, "0")); setNum($("#cd-m"), String(m).padStart(2, "0")); setNum($("#cd-s"), String(s).padStart(2, "0"));
    $("#cdMsg").textContent = d > 0 ? `${d} días para decir “sí, acepto”` : "¡Es esta semana!";
  }
  tick(); setInterval(tick, 1000);

  /* ======== preparar trazos ======== */
  const scrub = $$(".draw");
  scrub.forEach(prep);
  $$(".sprig").forEach(prep);
  $$(".gate .sprig").forEach((s, i) => autoDraw(s, 0.2 + i * 0.4));
  $$(".gate .ring").forEach((c) => { c.style.strokeDasharray = 360; c.style.strokeDashoffset = 360; c.style.transition = "stroke-dashoffset 2.2s cubic-bezier(.4,0,.2,1) " + (c.classList.contains("r2") ? ".4s" : "0s"); requestAnimationFrame(() => requestAnimationFrame(() => (c.style.strokeDashoffset = 0))); });

  /* ======== hilo dorado ======== */
  const th1 = $("#th1"), th2 = $("#th2"), tip = $("#tip"), main = $("#main");
  const wave = (a, b) => { let d = `M50 0`; for (let i = 0; i < 6; i++) { const y = i * 166.6; d += ` C${i % 2 ? a : b} ${y + 40}, ${i % 2 ? b : a} ${y + 126}, 50 ${y + 166.6}`; } return d; };
  th1.setAttribute("d", wave(96, 4)); th2.setAttribute("d", wave(4, 96));
  const L1 = th1.getTotalLength(), L2 = th2.getTotalLength();
  [[th1, L1], [th2, L2]].forEach(([p, L]) => { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });

  /* ======== loop de scroll ======== */
  const arch = $("#arch");
  function update() {
    const vh = innerHeight;
    scrub.forEach((s) => {
      const rc = s.getBoundingClientRect(); const a = vh * 0.96, b = vh * 0.55;
      const p = clamp((a - rc.top) / (a - b));
      if (s._p !== p) { s._p = p; setP(s, p); s.classList.toggle("done", p >= 1); }
    });
    const ar = arch.getBoundingClientRect();
    arch.style.setProperty("--q", (1 - clamp((vh * 0.95 - ar.top) / (vh * 0.65))).toFixed(3));
    const max = Math.max(1, main.scrollHeight - vh), pr = clamp(scrollY / max);
    th1.style.strokeDashoffset = L1 * (1 - pr);
    th2.style.strokeDashoffset = L2 * (1 - clamp(pr * 1.08 - 0.04));
    const pt = th1.getPointAtLength(L1 * pr);
    tip.style.left = pt.x + "%"; tip.style.top = pt.y / 10 + "%"; tip.style.opacity = pr > 0.01 && pr < 0.995 ? 1 : 0;
  }
  let tk = false;
  const onScroll = () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; update(); }); } };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); update();
  if (document.fonts) document.fonts.ready.then(update);

  /* reveal */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ======== música ======== */
  const btn = $("#musicBtn"), audio = $("#audio");
  let yt = null, ytReady = false, wantPlay = false, playing = false;
  const MU = C.musica || {}, useFile = !!MU.archivo;
  if (useFile) { audio.src = MU.archivo; audio.volume = 0.7; }
  function msg(t){
    let el = document.getElementById("musicMsg");
    if(!el){ el = document.createElement("div"); el.id="musicMsg";
      el.style.cssText="position:fixed;left:50%;bottom:20px;translate:-50% 0;background:#3f574a;color:#fff;padding:.7rem 1.1rem;border-radius:999px;font:14px Jost,sans-serif;z-index:99999;max-width:90vw;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.25)";
      document.body.appendChild(el); }
    el.textContent = t; el.style.display="block";
    clearTimeout(el._t); el._t = setTimeout(()=>{ el.style.display="none"; }, 6000);
  }
  function makePlayer(){
    if (yt || useFile || !MU.youtubeId || !window.YT || !YT.Player) return;
    const pv = { autoplay: 0, controls: 0, loop: 1, playlist: MU.youtubeId, playsinline: 1, rel: 0 };
    if (/^https?:/.test(location.protocol)) pv.origin = location.origin;
    yt = new YT.Player("ytplayer", { height: "200", width: "200", videoId: MU.youtubeId, playerVars: pv,
      events: {
        onReady: () => { ytReady = true; yt.setVolume(70); if (wantPlay) yt.playVideo(); },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) yt.playVideo();
          setUI(e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING);
        },
        onAutoplayBlocked: () => { setUI(false); msg("Tocá el botón de música para activarla"); },
        onError: (e) => {
          setUI(false);
          if (location.protocol === "file:") msg("Abrí la tarjeta con Live Server o desde la web (no con doble clic)");
          else msg("No se pudo reproducir (error " + e.data + "). Probá con un archivo MP3.");
        }
      } });
  }
  window.onYouTubeIframeAPIReady = makePlayer;
  if (window.YT && YT.Player) makePlayer();
  function setUI(on) { playing = on; btn.classList.toggle("playing", on); }
  function play() { wantPlay = true; if (useFile) audio.play().then(() => setUI(true)).catch(() => {}); else if (ytReady) yt.playVideo(); else { makePlayer(); msg("Cargando música…"); } }
  function pause() { wantPlay = false; if (useFile) { audio.pause(); setUI(false); } else if (ytReady) { yt.pauseVideo(); setUI(false); } }
  btn.addEventListener("click", () => (playing || (wantPlay && !ytReady) ? pause() : play()));

  /* ======== pétalos que caen (suaves) ======== */
  {
    const cv = $("#petals"), ctx = cv.getContext("2d");
    let W, H; const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; resize(); addEventListener("resize", resize);
    const cols = ["#ecd3c8", "#f3e1da", "#e3b9ab", "#d7e3d0", "#f1e6c9", "#c9d9cd"];
    const P = Array.from({ length: reduce ? 8 : innerWidth < 600 ? 11 : 20 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight, s: 6 + Math.random() * 7, v: 0.3 + Math.random() * 0.55,
      a: Math.random() * 6.28, w: 0.008 + Math.random() * 0.015, rot: Math.random() * 6.28, rv: (Math.random() - 0.5) * 0.02,
      f: Math.random() * 6.28, fv: 0.015 + Math.random() * 0.02, c: cols[(Math.random() * cols.length) | 0]
    }));
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      P.forEach((p) => {
        p.y += p.v; p.a += p.w; p.f += p.fv; p.x += Math.sin(p.a) * 0.55; p.rot += p.rv;
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.f)));
        ctx.fillStyle = p.c; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, 6.28); ctx.fill(); ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ======== entrar ======== */
  function enter(withMusic) {
    if (withMusic) play();
    $("#gate").classList.add("open");
    document.body.classList.remove("locked");
    $$("[data-hero]").forEach((s, i) => autoDraw(s, 0.4 + i * 0.5));
    setTimeout(() => $("#gate").remove(), 1900);
    scrollTo(0, 0); update();
  }
  $("#enterMusic").addEventListener("click", () => enter(true));
  $("#enterSilent").addEventListener("click", () => enter(false));
})();
