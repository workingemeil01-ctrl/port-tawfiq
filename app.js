(function () {
  // ---- assets: logo + video (يحاول أكتر من امتداد) ----
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
      videoEl.src = `${baseName}${exts[i++]}`;
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

  // ---- rotating testimonial ----
  const reviews = [
    { text: '"إقامة ممتازة ومكان هادي جدًا."', by: "— Ahmed" },
    { text: '"النضافة ممتازة والإطلالة تحفة."', by: "— Sarah K." },
    { text: '"سهل الحجز والتعامل راقي."', by: "— Omar" },
  ];

  let r = 0;
  const reviewText = document.getElementById("reviewText");
  const reviewBy = document.getElementById("reviewBy");

  function swapReview() {
    if (!reviewText || !reviewBy) return;
    r = (r + 1) % reviews.length;

    reviewText.style.opacity = "0";
    reviewBy.style.opacity = "0";

    setTimeout(() => {
      reviewText.textContent = reviews[r].text;
      reviewBy.textContent = reviews[r].by;
      reviewText.style.opacity = "1";
      reviewBy.style.opacity = "1";
    }, 220);
  }

  if (reviewText && reviewBy) {
    reviewText.style.transition = "opacity .22s ease";
    reviewBy.style.transition = "opacity .22s ease";
    setInterval(swapReview, 4200);
  }

  // ---- particles خفيفة ----
  const canvas = document.getElementById("particles");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let W = 0, H = 0, DPR = 1;
  let particles = [];
  const COUNT = 46; // خفيف

  function resize() {
    if (!canvas || !ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(window.innerWidth * DPR);
    H = Math.floor(window.innerHeight * DPR);
    canvas.width = W;
    canvas.height = H;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

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
})();
