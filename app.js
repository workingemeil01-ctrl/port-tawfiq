(function () {
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const screens = new Map(Array.from(document.querySelectorAll(".screen")).map(s => [s.id, s]));
  const indicator = document.querySelector(".nav-indicator");

  // ---------- NAV indicator ----------
  function positionIndicator(activeBtn) {
    if (!indicator || !activeBtn) return;
    const nav = activeBtn.parentElement;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const x = btnRect.left - navRect.left;
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${x}px)`;
  }

  function restartTitleAnimation() {
    const stroke = document.querySelector(".t-stroke");
    const fill = document.querySelector(".t-fill");
    if (!stroke || !fill) return;

    stroke.style.animation = "none";
    fill.style.animation = "none";
    void stroke.offsetWidth; // force reflow
    stroke.style.animation = "";
    fill.style.animation = "";
  }

  function setActive(targetId) {
    buttons.forEach(btn => {
      const isOn = btn.dataset.target === targetId;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", isOn ? "true" : "false");
      if (isOn) positionIndicator(btn);
    });

    screens.forEach((el, id) => el.classList.toggle("is-visible", id === targetId));

    if (targetId === "home") restartTitleAnimation();
  }

  buttons.forEach(btn => btn.addEventListener("click", () => setActive(btn.dataset.target)));

  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-btn.is-active");
    if (active) positionIndicator(active);
    resizeParticlesCanvas();
  });

  // ---------- Asset loader (logo/video) ----------
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

  // ---------- Particles (lightweight) ----------
  const canvas = document.getElementById("particles");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let W = 0, H = 0, DPR = 1;
  let particles = [];
  const COUNT = 44; // خفيف على iPhone

  function resizeParticlesCanvas() {
    if (!canvas || !ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(window.innerWidth * DPR);
    H = Math.floor(window.innerHeight * DPR);
    canvas.width = W;
    canvas.height = H;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    if (!canvas || !ctx) return;
    particles = Array.from({ length: COUNT }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1.1, 2.6) * DPR,
      vx: rand(-0.18, 0.18) * DPR,
      vy: rand(-0.12, 0.12) * DPR,
      a: rand(0.08, 0.22)
    }));
  }

  function stepParticles() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, W, H);

    // رسم dots خفيفة
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

    requestAnimationFrame(stepParticles);
  }

  // Start
  resizeParticlesCanvas();
  initParticles();
  stepParticles();

  // Default view
  setActive("home");
})();
