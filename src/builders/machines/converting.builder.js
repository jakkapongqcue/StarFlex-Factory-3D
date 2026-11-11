// ============================================================================
// Module: src/builders/machines/converting.builder.js
// Procedural 3D Builders for Bag Making Lines (BM-01..17), Spout Applicators
// (1SP-01..07), and High-Speed Slitter Rewinders (SM, SH, 2RW).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Converting = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  function buildBagMakingArray(group, r, mats, accentMat) {
    const numLines = 14;
    for (let i = 0; i < numLines; i++) {
      const lx = -r.w * 0.46 + (r.w * 0.92 * i) / (numLines - 1);
      const lineLen = r.d * (i === 13 ? 0.95 : i % 3 === 0 ? 0.84 : 0.74);

      const bmBody = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, lineLen), mats.machineBody);
      bmBody.position.set(lx, 0.68, -r.d * 0.05);
      addEdges(bmBody, 0x94a3b8, 0.55);
      group.add(bmBody);

      const sealer = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.65, 2.2), accentMat);
      sealer.position.set(lx, 1.65, -r.d * 0.12);
      group.add(sealer);

      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.95, 12), mats.filmRollWhite);
      roll.rotation.z = Math.PI / 2;
      roll.position.set(lx, 0.8, -lineLen * 0.48);
      group.add(roll);
    }
  }

  function buildSpoutOrSlitter(group, itemType, r, mats, accentMat) {
    const cols = itemType === "slitter_array" ? 8 : itemType === "spout_array" ? 5 : 2;
    const rows = itemType === "slitter_array" ? 2 : itemType === "spout_array" ? 2 : 1;
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

  return {
    buildBagMakingArray,
    buildSpoutOrSlitter
  };
})();
