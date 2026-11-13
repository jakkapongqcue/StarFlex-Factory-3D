// ============================================================================
// Module: src/builders/machines/laminating/extrusion-oven.model.js
// Procedural 3D Models for Extrusion Lines, Generic Laminators, and Ovens.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.LaminatingModels = window.Starflex3D.Builders.LaminatingModels || {};

window.Starflex3D.Builders.LaminatingModels.ExtrusionOven = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  function buildExtrusionLine(inner, L, W, H, mats, accentMat, lightAccentMat) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(L * 0.92, H * 0.45, W * 0.55), mats.machineBody);
    bed.position.y = H * 0.25;
    addEdges(bed, 0x94a3b8, 0.6);
    inner.add(bed);

    [-L * 0.18, L * 0.18].forEach(ex => {
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, W * 0.88), accentMat);
      barrel.position.set(ex, H * 0.35, 0);
      const hopper = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.4, 12), mats.chromeRoll);
      hopper.rotation.x = Math.PI;
      hopper.position.set(ex, H * 0.78, W * 0.26);
      inner.add(barrel, hopper);
    });

    const hood = new THREE.Mesh(new THREE.BoxGeometry(L * 0.76, H * 0.22, W * 0.48), lightAccentMat);
    hood.position.set(0, H * 0.72, 0);
    addEdges(hood, 0x0284c7, 0.6);
    inner.add(hood);
  }

  function buildGenericLaminator(inner, L, W, H, mats, accentMat) {
    [-L * 0.32, L * 0.32].forEach(sx => {
      const st = new THREE.Mesh(new THREE.BoxGeometry(L * 0.24, H * 0.62, W * 0.72), mats.machineBody);
      st.position.set(sx, H * 0.31, 0);
      addEdges(st, 0x94a3b8, 0.6);
      inner.add(st);
    });

    const tunnel = new THREE.Mesh(new THREE.BoxGeometry(L * 0.85, H * 0.32, W * 0.64), accentMat);
    tunnel.position.set(0, H * 0.76, 0);
    addEdges(tunnel, 0xb45309, 0.6);
    inner.add(tunnel);

    [-L * 0.44, 0, L * 0.44].forEach(rx => {
      const roll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, W * 0.56, 14),
        mats.filmRollWhite
      );
      roll.rotation.x = Math.PI / 2;
      roll.position.set(rx, 0.85, 0);
      inner.add(roll);
    });
  }

  function buildOvenChamber(inner, L, W, H, accentMat) {
    const chamber = new THREE.Mesh(
      new THREE.BoxGeometry(L * 0.94, H * 0.82, W * 0.9),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45, metalness: 0.2 })
    );
    chamber.position.y = H * 0.41;
    addEdges(chamber, 0xd97706, 0.75);
    inner.add(chamber);

    const stack = new THREE.Mesh(new THREE.BoxGeometry(L * 0.55, H * 0.22, W * 0.5), accentMat);
    stack.position.y = H * 0.92;
    inner.add(stack);
  }

  return {
    buildExtrusionLine,
    buildGenericLaminator,
    buildOvenChamber
  };
})();
