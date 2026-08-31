// --- Modo karaoke ("Enjoy") -------------------------------------------
(function initKaraoke() {
  const lines = document.querySelectorAll(".karaoke-line");
  const playBtn = document.getElementById("karaoke-play");
  const resetBtn = document.getElementById("karaoke-reset");
  if (!lines.length || !playBtn || !resetBtn) return;

  const LINE_MS = 2400;
  let idx = -1;
  let timer = null;

  function clearActive() {
    lines.forEach((line) => line.classList.remove("active"));
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    playBtn.textContent = "▶ Reproducir modo karaoke";
  }

  function step() {
    clearActive();
    idx += 1;
    if (idx >= lines.length) {
      stop();
      return;
    }
    lines[idx].classList.add("active");
    lines[idx].scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function start() {
    stop();
    idx = -1;
    step();
    timer = setInterval(step, LINE_MS);
    playBtn.textContent = "⏸ Cantando…";
  }

  playBtn.addEventListener("click", () => {
    if (timer) {
      stop();
    } else {
      start();
    }
  });

  resetBtn.addEventListener("click", () => {
    stop();
    clearActive();
    idx = -1;
    lines[0].scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
