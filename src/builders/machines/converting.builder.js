// ============================================================================
// Module: src/builders/machines/converting.builder.js
// Procedural 3D Builders for Bag Making Lines (BM-01..17), Spout Applicators
// (1SP-01..07), and High-Speed Slitter Rewinders (SM, SH, 2RW).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Converting = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { BagMaking, Slitter } = window.Starflex3D.Builders.ConvertingModels;

  function buildBagMakingArray(group, r, mats, accentMat) {
    BagMaking.buildArray(group, r, mats, accentMat);
  }

  function buildSpoutArray(group, r, mats, accentMat) {
    const pxToX = px => (px - 1050) * 0.1 - r.x;
    const pyToZ = py => (py - 760) * 0.1 - r.z;

    // 7 Spout Insertion stations matching Hall 2 inner red box (Top row: 2, Bottom row: 5)
    const stations = [
      { px: 778, py: 865 }, // 1SP-02
      { px: 850, py: 865 }, // 1SP-01
      { px: 728, py: 892 }, // 1SP-03
      { px: 786, py: 892 }, // 1SP-04
      { px: 844, py: 892 }, // 1SP-05
      { px: 906, py: 892 }, // 1SP-06
      { px: 964, py: 892 }  // 1SP-07
    ];

    stations.forEach(st => {
      const mx = pxToX(st.px);
      const mz = pyToZ(st.py);

      const unit = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.55, 1.05), mats.machineBody);
      unit.position.set(mx, 0.775, mz);
      addEdges(unit, 0x64748b, 0.6);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, 0.78), accentMat);
      cap.position.set(mx, 1.76, mz);
      addEdges(cap, 0x475569, 0.45);

      // Left & Right Spout Hopper / Feeder Side Wing Tables (matching blueprint symbol)
      [-1.38, 1.38].forEach(wx => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.92, 0.80), mats.machineDark || mats.machineBody);
        wing.position.set(mx + wx, 0.46, mz);
        addEdges(wing, 0x64748b, 0.5);
        group.add(wing);
      });

      group.add(unit, cap);
    });
  }

  function buildSpoutOrSlitter(group, itemType, r, mats, accentMat) {
    if (itemType === "slitter_array" || itemType === "slitter_group") {
      Slitter.buildArray(group, itemType, r, mats, accentMat);
      return;
    }

    if (itemType === "spout_array") {
      buildSpoutArray(group, r, mats, accentMat);
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
    if (typeof Slitter.resetAnimations === "function") Slitter.resetAnimations();
  }

  function updateAnimations() {
    BagMaking.updateAnimations();
    Slitter.updateAnimations();
  }

  return {
    buildBagMakingArray,
    buildSpoutOrSlitter,
    resetAnimations,
    updateAnimations
  };
})();
