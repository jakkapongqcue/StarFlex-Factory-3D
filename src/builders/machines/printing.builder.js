// ============================================================================
// Module: src/builders/machines/printing.builder.js
// Procedural 3D Builder for High-Speed Rotogravure Printing Lines (CAIDA, BOBST).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Printing = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  function buildGravurePress(inner, L, W, H, mats, accentMat, lightAccentMat) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(L * 0.96, 0.35, W * 0.82), mats.machineDark);
    base.position.y = 0.18;
    inner.add(base);

    const numTowers = Math.max(5, Math.min(9, Math.floor(L / 1.9)));
    const towerSpan = L * 0.72;
    for (let i = 0; i < numTowers; i++) {
      const tx = -towerSpan * 0.5 + (towerSpan * i) / (numTowers - 1);
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry((towerSpan / numTowers) * 0.68, H * 0.68, W * 0.68),
        mats.machineBody
      );
      tower.position.set(tx, H * 0.36, 0);
      tower.castShadow = true;
      addEdges(tower, 0x94a3b8, 0.6);
      inner.add(tower);

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry((towerSpan / numTowers) * 0.52, H * 0.22, W * 0.52),
        accentMat
      );
      hood.position.set(tx, H * 0.78, 0);
      inner.add(hood);
    }

    const mainPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, L * 0.84, 12),
      lightAccentMat
    );
    mainPipe.rotation.z = Math.PI / 2;
    mainPipe.position.set(0, H * 0.98, 0);
    inner.add(mainPipe);

    [-L * 0.43, L * 0.43].forEach(ex => {
      const roll = new THREE.Mesh(
        new THREE.CylinderGeometry(W * 0.26, W * 0.26, W * 0.58, 16),
        mats.filmRollWhite
      );
      roll.rotation.x = Math.PI / 2;
      roll.position.set(ex, H * 0.28, 0);
      addEdges(roll, 0xcbd5e1, 0.5);
      inner.add(roll);
    });
  }

  return {
    buildGravurePress
  };
})();
