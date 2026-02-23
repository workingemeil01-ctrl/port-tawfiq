(function () {
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const screens = new Map(Array.from(document.querySelectorAll(".screen")).map(s => [s.id, s]));
  const indicator = document.querySelector(".nav-indicator");

  // --------- NAV indicator positioning ----------
  function positionIndicator(activeBtn) {
    if (!indicator || !activeBtn) return;

    const nav = activeBtn.parentElement;
    const navRect = nav.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const x = btnRect.left - navRect.left; // works in RTL too
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${x}px)`;
  }

  function setActive(targetId) {
    buttons.forEach(btn => {
      const isOn = btn.dataset.target === targetId;
      btn.classList.toggle("is-active", isOn);
      btn.setAttribute("aria-selected", isOn ? "true" : "false");
      if (isOn) positionIndicator(btn);
    });

    screens.forEach((el, id) => el.classList.toggle("is-visible", id === targetId));

    // restart title animation when returning home
    if (targetId === "home") {
      const title = document.querySelector(".hero-title");
      if (title) {
        title.classList.remove("replay");
        void title.offsetWidth;
        title.classList.add("replay");
      }
    }
  }

  buttons.forEach(btn => btn.addEventListener("click", () => setActive(btn.dataset.target)));

  window.addEventListener("resize", () => {
    const active = document.querySelector(".nav-btn.is-active");
    if (active) positionIndicator(active);
  });

  // --------- Asset loader (fix broken logo / video) ----------
  function tryImage(imgEl, baseName) {
    const exts = ["", ".png", ".webp", ".jpg", ".jpeg", ".svg"];
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

  // Apply asset resolution
  const logo = document.getElementById("brandLogo");
  if (logo) tryImage(logo, logo.dataset.asset || "seuz");

  const heroVideo = document.getElementById("heroVideo");
  if (heroVideo) tryVideo(heroVideo, heroVideo.dataset.asset || "bck1");

  // Default
  setActive("home");
})();
