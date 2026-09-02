// --- Playlist tabs -------------------------------------------------------
(function initTabs() {
  const tabs = document.querySelectorAll(".track-tab");
  const tracks = document.querySelectorAll(".track");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = `track-${tab.dataset.track}`;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      tracks.forEach((track) => {
        const isTarget = track.id === targetId;
        track.classList.toggle("active", isTarget);
        if (!isTarget) stopKaraoke(track);
      });
    });
  });
})();

// --- Modo karaoke (uno por pista) ----------------------------------------
const karaokeState = new WeakMap();

function stopKaraoke(trackEl) {
  const state = karaokeState.get(trackEl);
  if (state && state.timer) {
    clearInterval(state.timer);
    state.timer = null;
    state.playBtn.textContent = "▶ Reproducir modo karaoke";
  }
}

(function initKaraoke() {
  const LINE_MS = 2400;

  document.querySelectorAll(".track").forEach((trackEl) => {
    const lines = trackEl.querySelectorAll(".karaoke-line");
    const playBtn = trackEl.querySelector(".karaoke-play");
    const resetBtn = trackEl.querySelector(".karaoke-reset");
    if (!lines.length || !playBtn || !resetBtn) return;

    const state = { lines, playBtn, idx: -1, timer: null };
    karaokeState.set(trackEl, state);

    function clearActive() {
      state.lines.forEach((line) => line.classList.remove("active"));
    }

    function step() {
      clearActive();
      state.idx += 1;
      if (state.idx >= state.lines.length) {
        stopKaraoke(trackEl);
        return;
      }
      state.lines[state.idx].classList.add("active");
      state.lines[state.idx].scrollIntoView({ behavior: "smooth", block: "center" });
    }

    playBtn.addEventListener("click", () => {
      if (state.timer) {
        stopKaraoke(trackEl);
        return;
      }
      stopKaraoke(trackEl);
      state.idx = -1;
      step();
      state.timer = setInterval(step, LINE_MS);
      playBtn.textContent = "⏸ Cantando…";
    });

    resetBtn.addEventListener("click", () => {
      stopKaraoke(trackEl);
      clearActive();
      state.idx = -1;
      state.lines[0].scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
})();
