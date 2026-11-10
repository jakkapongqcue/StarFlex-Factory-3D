// ============================================================================
// Module: src/ui/tour.ui.js
// Manages switching between Explore ("สำรวจ") and Guided Tour ("ทัวร์") modes.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Tour = {
  setAppMode(state, mode) {
    state.mode = mode;
    document.getElementById("tab-explore").classList.toggle("active", mode === "explore");
    document.getElementById("tab-tour").classList.toggle("active", mode === "tour");
    document.getElementById("tour-card").classList.toggle("hidden", mode !== "tour");

    if (mode === "tour") {
      this.goToStep(state, 0);
    } else {
      window.Starflex3D.UI.Inspector.clearSelection(state);
      window.Starflex3D.UI.Toolbar.resetCamera(state);
    }
  },

  goToStep(state, idx) {
    const steps = window.Starflex3D.Data.tourSteps;
    const { pt } = window.Starflex3D.Coords;

    state.tourIndex = (idx + steps.length) % steps.length;
    const step = steps[state.tourIndex];

    document.getElementById("tour-step-num").textContent =
      `สายการผลิต Starflex · ขั้นตอนที่ ${state.tourIndex + 1} จาก ${steps.length}`;
    document.getElementById("tour-title").textContent = step.title;
    document.getElementById("tour-sub").textContent = step.subtitle;
    document.getElementById("tour-desc").textContent = step.description;
    document.getElementById("tour-dots").textContent = `${state.tourIndex + 1} / ${steps.length}`;

    const w = pt(step.targetPx[0], step.targetPx[1]);
    window.Starflex3D.SceneManager.flyTo(
      state,
      new THREE.Vector3(w.x, 2, w.z),
      new THREE.Vector3(w.x + step.camOffset[0], step.camOffset[1], w.z + step.camOffset[2])
    );

    if (step.highlightId) {
      window.Starflex3D.UI.Inspector.selectItem(state, step.highlightId, false);
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
