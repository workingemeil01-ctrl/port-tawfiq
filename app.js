(function () {
  const buttons = Array.from(document.querySelectorAll(".nav-btn"));
  const screens = new Map(
    Array.from(document.querySelectorAll(".screen")).map(s => [s.id, s])
  );

  function setActive(targetId) {
    // buttons state
    buttons.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.target === targetId);
    });

    // screens state
    screens.forEach((el, id) => {
      el.classList.toggle("is-visible", id === targetId);
    });

    // restart draw animation when returning to home
    if (targetId === "home") {
      const stroke = document.querySelector(".t-stroke");
      const fill = document.querySelector(".t-fill");
      if (stroke && fill) {
        stroke.style.animation = "none";
        fill.style.animation = "none";
        // force reflow
        void stroke.offsetWidth;
        stroke.style.animation = "";
        fill.style.animation = "";
      }
    }
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => setActive(btn.dataset.target));
  });

  // Default
  setActive("home");
})();