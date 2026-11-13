// ============================================================================
// Module: src/builders/machines/converting.builder.js
// Procedural 3D Builders for Bag Making Lines (BM-01..17), Spout Applicators
// (1SP-01..07), and High-Speed Slitter Rewinders (SM, SH, 2RW).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Converting = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { BagMaking, Spout, Slitter } = window.Starflex3D.Builders.ConvertingModels;

  function buildBagMakingArray(group, r, mats, accentMat) {
    BagMaking.buildArray(group, r, mats, accentMat);
  }

  function buildSpoutOrSlitter(group, itemType, r, mats, accentMat) {
    if (itemType === "slitter_array" || itemType === "slitter_group") {
      Slitter.buildArray(group, itemType, r, mats, accentMat);
      return;
    }

    if (itemType === "spout_array" || itemType === "spout_array_south") {
      Spout.buildArray(group, r, mats, itemType);
      return;
    }

    // Original boxy Inspection & Rewinder group (Hall 1: SH 02, SH 03, SM 14, SM 05)
    const cols = 2;
    const rows = 1;
    for (let c = 0; c < cols; c++) {
      for (let rw = 0; rw < rows; rw++) {
        const mx = cols === 1 ? 0 : -r.w * 0.42 + (r.w * 0.84 * c) / (cols - 1);
        const mz = rows === 1 ? 0 : -r.d * 0.28 + (r.d * 0.56 * rw) / (rows - 1);
        const unit = new THREE.Mesh(
          new THREE.BoxGeometry(Math.min(2.1, (r.w / cols) * 0.72), 1.6, Math.min(2.0, (r.d / rows) * 0.68)),
          mats.machineBody
        );
        unit.position.set(mx, 0.8, mz);
        addEdges(unit, 0x64748b, 0.6);

        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(Math.min(1.6, (r.w / cols) * 0.55), 0.45, Math.min(1.4, (r.d / rows) * 0.5)),
          accentMat
        );
        cap.position.set(mx, 1.82, mz);
        group.add(unit, cap);
      }
    }
  }

  function resetAnimations() {
    if (typeof BagMaking.resetAnimations === "function") BagMaking.resetAnimations();
    if (typeof Spout.resetAnimations === "function") Spout.resetAnimations();
    if (typeof Slitter.resetAnimations === "function") Slitter.resetAnimations();
  }

  function updateAnimations() {
    BagMaking.updateAnimations();
    Spout.updateAnimations();
    Slitter.updateAnimations();
  }

  return {
    buildBagMakingArray,
    buildSpoutOrSlitter,
    resetAnimations,
    updateAnimations
  };
})();
