// --- YouTube IFrame API: un player controlable por pista -----------------
const ytPlayers = {};
let ytApiReady = false;
const onYtReadyQueue = [];

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
  onYtReadyQueue.forEach((fn) => fn());
  onYtReadyQueue.length = 0;
};

(function loadYtApi() {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

function initPlayers() {
  document.querySelectorAll(".yt-player").forEach((el) => {
    const trackEl = el.closest(".track");
    const videoId = el.dataset.videoId;
    if (!trackEl || !videoId) return;

    const player = new YT.Player(el, {
      videoId,
      playerVars: { rel: 0 },
    });
    ytPlayers[trackEl.id] = player;
  });
}

if (ytApiReady) {
  initPlayers();
} else {
  onYtReadyQueue.push(initPlayers);
}

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

// --- Modo karaoke (uno por pista, sincronizado con el player) ------------
const karaokeState = new WeakMap();

function stopKaraoke(trackEl) {
  const state = karaokeState.get(trackEl);
  if (state && state.timer) {
    clearInterval(state.timer);
    state.timer = null;
    state.playBtn.textContent = "▶ Reproducir canción + karaoke";
  }
  const player = ytPlayers[trackEl.id];
  if (player && typeof player.pauseVideo === "function") {
    player.pauseVideo();
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

      let lineMs = LINE_MS;
      const player = ytPlayers[trackEl.id];
      if (player && typeof player.seekTo === "function") {
        player.seekTo(0, true);
        player.playVideo();
        const duration = player.getDuration();
        if (duration > 0) {
          // Reparte las líneas a lo largo de la duración real del video,
          // así el karaoke termina justo cuando termina la canción.
          lineMs = (duration * 1000) / state.lines.length;
        }
      }

      state.idx = -1;
      step();
      state.timer = setInterval(step, lineMs);
      playBtn.textContent = "⏸ Sonando…";
    });

    resetBtn.addEventListener("click", () => {
      stopKaraoke(trackEl);
      clearActive();
      state.idx = -1;
      const player = ytPlayers[trackEl.id];
      if (player && typeof player.seekTo === "function") {
        player.seekTo(0, true);
      }
      state.lines[0].scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
})();
