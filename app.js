(function () {
  // ---- assets: logo + video (tries multiple extensions) ----
  function tryImage(imgEl, baseName) {
    const exts = [".png", ".webp", ".jpg", ".jpeg", ".svg"];
    let i = 0;

    const next = () => {
      if (i >= exts.length) return;
      imgEl.src = `${baseName}${exts[i++]}`;
    };

    imgEl.onerror = next;
    next();
  }

  function tryVideo(videoEl, baseName) {
    const exts = [".mp4", ".mov", ".webm"];
    let i = 0;

    const setSource = () => {
      if (i >= exts.length) return;
      const url = `${baseName}${exts[i++]}`;
      videoEl.src = url;
      const p = videoEl.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    videoEl.addEventListener("error", setSource);
    setSource();
  }

  const logo = document.getElementById("brandLogo");
  if (logo) tryImage(logo, logo.dataset.asset || "seuz");

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) tryVideo(heroVideo, heroVideo.dataset.asset || "bck1");

  // ---- tabs: highlight active on click + smooth scroll ----
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const sections = tabs
    .map(t => document.querySelector(t.getAttribute("href")))
    .filter(Boolean);

  function setActiveTab(hash) {
    tabs.forEach(t => t.classList.toggle("is-active", t.getAttribute("href") === hash));
  }

  tabs.forEach(t => {
    t.addEventListener("click", (e) => {
      const hash = t.getAttribute("href");
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash);
      setActiveTab(hash);
    });
  });

  // update active tab while scrolling
  const header = document.querySelector(".header");
  const headerH = () => (header ? header.getBoundingClientRect().height : 0);

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    const id = "#" + visible.target.id;
    setActiveTab(id);
  }, {
    root: null,
    rootMargin: () => `-${Math.round(headerH())}px 0px -60% 0px`,
    threshold: [0.2, 0.35, 0.5, 0.7]
  });

  sections.forEach(s => obs.observe(s));

  // ---- particles (lightweight) ----
  const canvas = document.getElementById("particles");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let W = 0, H = 0, DPR = 1;
  let particles = [];
  const COUNT = 46;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function resize() {
    if (!canvas || !ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(window.innerWidth * DPR);
    H = Math.floor(window.innerHeight * DPR);
    canvas.width = W;
    canvas.height = H;
  }

  function init() {
    if (!canvas || !ctx) return;
    particles = Array.from({ length: COUNT }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1.2, 2.6) * DPR,
      vx: rand(-0.18, 0.18) * DPR,
      vy: rand(-0.10, 0.10) * DPR,
      a: rand(0.06, 0.18)
    }));
  }

  function tick() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  resize();
  init();
  tick();
  window.addEventListener("resize", () => { resize(); init(); });

  // ---- later: WhatsApp link (placeholder now) ----
  // لما تيجي تربطه بواتساب هنغير href بتاع #waBtn
})();
