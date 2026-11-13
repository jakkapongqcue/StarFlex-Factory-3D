// ============================================================================
// Module: src/ui/tour.ui.js
// Manages switching between Explore ("สำรวจ") and Guided Tour ("ทัวร์") modes.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Tour = {
  STEP_DURATION_MS: 5000,

  setAppMode(state, mode) {
    state.mode = mode;
    document.getElementById("tab-explore").classList.toggle("active", mode === "explore");
    document.getElementById("tab-tour").classList.toggle("active", mode === "tour");
    document.getElementById("tour-card").classList.toggle("hidden", mode !== "tour");
    document.body.classList.toggle("mode-tour", mode === "tour");

    if (mode === "tour") {
      // Keep scene clean during Tour (hide detail panel & component drawer)
      const detailCard = document.getElementById("detail-card");
      const compDrawer = document.getElementById("components-drawer");
      if (detailCard) detailCard.classList.add("hidden");
      if (compDrawer) compDrawer.classList.add("hidden");
      this.pause(state);
      this.goToStep(state, 0);
    } else {
      this.pause(state);
      window.Starflex3D.UI.Inspector.clearSelection(state);
      window.Starflex3D.UI.Toolbar.resetCamera(state);
    }
  },

  _renderProgressBar(state, steps) {
    const bar = document.getElementById("tour-progress-bar");
    if (!bar) return;

    if (bar.children.length !== steps.length) {
      bar.innerHTML = "";
      steps.forEach((_, idx) => {
        const seg = document.createElement("button");
        seg.type = "button";
        seg.className = "tour-seg";
        seg.title = `ขั้นตอนที่ ${idx + 1}`;
        seg.innerHTML = `<span class="tour-seg-fill"></span>`;
        seg.addEventListener("click", () => this.goToStep(state, idx));
        bar.appendChild(seg);
      });
    }

    const segs = bar.children;
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      const fill = seg.firstElementChild;
      seg.classList.toggle("done", i < state.tourIndex);
      seg.classList.toggle("active", i === state.tourIndex);
      if (fill) {
        if (i < state.tourIndex) {
          fill.style.width = "100%";
        } else if (i === state.tourIndex) {
          fill.style.width = state.isTourPlaying ? "0%" : "100%";
        } else {
          fill.style.width = "0%";
        }
      }
    }
  },

  _updatePlayButton(state) {
    const btn = document.getElementById("btn-tour-play");
    const icon = document.getElementById("tour-play-icon");
    const label = document.getElementById("tour-play-label");
    if (!btn || !icon || !label) return;

    const playing = !!state.isTourPlaying;
    btn.classList.toggle("playing", playing);
    icon.innerHTML = playing
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>`;
    label.textContent = playing ? "หยุดชั่วคราว" : "เล่นอัตโนมัติ";
  },

  play(state) {
    state.isTourPlaying = true;
    state.tourLastTick = performance.now();
    this._updatePlayButton(state);
    this._syncActiveFill(state);
  },

  pause(state) {
    state.isTourPlaying = false;
    state.tourLastTick = 0;
    this._updatePlayButton(state);
    this._syncActiveFill(state);
  },

  togglePlay(state) {
    if (state.isTourPlaying) {
      this.pause(state);
    } else {
      this.play(state);
    }
  },

  _syncActiveFill(state) {
    const bar = document.getElementById("tour-progress-bar");
    if (!bar) return;
    const activeSeg = bar.children[state.tourIndex];
    const fill = activeSeg && activeSeg.firstElementChild;
    if (!fill) return;
    if (state.isTourPlaying || state.tourElapsedMs > 0) {
      const pct = Math.min(100, Math.max(0, (state.tourElapsedMs / this.STEP_DURATION_MS) * 100));
      fill.style.width = `${pct.toFixed(1)}%`;
    } else {
      fill.style.width = "100%";
    }
  },

  tick(state) {
    if (state.mode !== "tour" || !state.isTourPlaying) return;
    const now = performance.now();
    const dt = state.tourLastTick ? Math.min(100, now - state.tourLastTick) : 0;
    state.tourLastTick = now;
    state.tourElapsedMs = (state.tourElapsedMs || 0) + dt;
    this._syncActiveFill(state);

    if (state.tourElapsedMs >= this.STEP_DURATION_MS) {
      this.nextStep(state);
    }
  },

  goToStep(state, idx) {
    const steps = window.Starflex3D.Data.tourSteps;
    const { pt } = window.Starflex3D.Coords;

    state.tourIndex = (idx + steps.length) % steps.length;
    state.tourElapsedMs = 0;
    state.tourLastTick = state.isTourPlaying ? performance.now() : 0;
    const step = steps[state.tourIndex];

    this._renderProgressBar(state, steps);
    this._updatePlayButton(state);

    document.getElementById("tour-step-badge").textContent = `${state.tourIndex + 1}/${steps.length}`;
    document.getElementById("tour-tag").textContent = step.tag || "PROCESS";
    document.getElementById("tour-title").textContent = step.title;
    document.getElementById("tour-desc").textContent = step.description;

    const chipsEl = document.getElementById("tour-chips");
    if (chipsEl) {
      chipsEl.innerHTML = "";
      (step.flowChips || []).forEach(chipText => {
        const span = document.createElement("span");
        span.className = "tour-chip";
        span.textContent = chipText;
        chipsEl.appendChild(span);
      });
    }

    const w = pt(step.targetPx[0], step.targetPx[1]);
    window.Starflex3D.SceneManager.flyTo(
      state,
      new THREE.Vector3(w.x, 2, w.z),
      new THREE.Vector3(w.x + step.camOffset[0], step.camOffset[1], w.z + step.camOffset[2])
    );

    if (step.highlightId) {
      window.Starflex3D.UI.Inspector.selectItem(state, step.highlightId, false, false);
    } else {
      window.Starflex3D.UI.Inspector.clearSelection(state);
    }
  },

  nextStep(state) {
    this.goToStep(state, state.tourIndex + 1);
  },

  prevStep(state) {
    this.goToStep(state, state.tourIndex - 1);
  }
};
