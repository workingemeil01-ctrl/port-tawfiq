(() => {
  // ====== Drawer ======
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawerOverlay");
  const openBtn = document.getElementById("openDrawer");
  const closeBtn = document.getElementById("closeDrawer");

  const openDrawer = () => {
    drawer.classList.add("isOpen");
    overlay.classList.add("isOpen");
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    drawer.classList.remove("isOpen");
    overlay.classList.remove("isOpen");
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openBtn?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  document.querySelectorAll(".drawerLink").forEach(a => {
    a.addEventListener("click", () => closeDrawer());
  });

  // ====== Assets (logo + video) ======
  function tryImage(imgEl, base) {
    const exts = [".png", ".webp", ".jpg", ".jpeg", ".svg"];
    let i = 0;
    const next = () => {
      if (i >= exts.length) return;
      imgEl.src = `${base}${exts[i++]}`;
    };
    imgEl.onerror = next;
    next();
  }

  function tryVideo(videoEl, base) {
    const exts = [".mp4", ".mov", ".webm"];
    let i = 0;
    const setSrc = () => {
      if (i >= exts.length) return;
      videoEl.src = `${base}${exts[i++]}`;
      const p = videoEl.play();
      if (p?.catch) p.catch(() => {});
    };
    videoEl.addEventListener("error", setSrc);
    setSrc();
  }

  const brandLogo = document.getElementById("brandLogo");
  if (brandLogo) tryImage(brandLogo, brandLogo.dataset.asset || "seuz");

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) tryVideo(heroVideo, heroVideo.dataset.asset || "bck1");

  // ====== WhatsApp link (placeholder دلوقتي) ======
  // لما تبقى جاهز، حط رقمك بصيغة دولية:
  // const waLink = "https://wa.me/201064800205";
  const waLink = "#";

  const waFab = document.getElementById("waFab");
  const bookNow = document.getElementById("bookNow");
  if (waFab) waFab.href = waLink;
  if (bookNow) bookNow.href = waLink;

  // ====== Soft dust particles ======
  const canvas = document.getElementById("dust");
  const ctx = canvas?.getContext("2d");

  let W = 0, H = 0, DPR = 1;
  let dots = [];
  const COUNT = 42;

  const rand = (a,b)=> Math.random()*(b-a)+a;

  function resize(){
    if(!canvas || !ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(innerWidth * DPR);
    H = Math.floor(innerHeight * DPR);
    canvas.width = W;
    canvas.height = H;
  }

  function init(){
    if(!ctx) return;
    dots = Array.from({length: COUNT}, () => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1.2, 2.6) * DPR,
      vx: rand(-0.10, 0.10) * DPR,
      vy: rand(-0.06, 0.06) * DPR,
      a: rand(0.05, 0.14)
    }));
  }

  function tick(){
    if(!ctx) return;
    ctx.clearRect(0,0,W,H);

    for(const p of dots){
      p.x += p.vx;
      p.y += p.vy;

      if(p.x < -10) p.x = W + 10;
      if(p.x > W + 10) p.x = -10;
      if(p.y < -10) p.y = H + 10;
      if(p.y > H + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(90,70,50,${p.a})`; // بني خفيف
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  resize();
  init();
  tick();
  addEventListener("resize", () => { resize(); init(); });
})();
