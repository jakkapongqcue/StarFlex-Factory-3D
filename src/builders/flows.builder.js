// ============================================================================
// Module: src/builders/flows.builder.js
// Builds animated 3D process flow conduits and glowing pulse particles.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Flows = {
  build(scene, state) {
    const { pt } = window.Starflex3D.Coords;
    const flows = window.Starflex3D.Data.processFlows;

    const flowGroup = new THREE.Group();
    flowGroup.name = "ProcessFlows";
    state.flowParticles = [];

    flows.forEach(flow => {
      const pts3D = flow.points.map(p => {
        const w = pt(p[0], p[1]);
        return new THREE.Vector3(w.x, 1.35, w.z);
      });

      const curve = new THREE.CatmullRomCurve3(pts3D, false, "catmullrom", 0.12);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.22, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: flow.color,
        emissive: flow.color,
        emissiveIntensity: 0.25,
        roughness: 0.3,
        transparent: true,
        opacity: 0.78
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      flowGroup.add(tubeMesh);

      for (let i = 0; i < 4; i++) {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.72, 12, 12),
          new THREE.MeshBasicMaterial({ color: flow.color, transparent: true, opacity: 0.55 })
        );
        sphere.add(halo);
        flowGroup.add(sphere);

        state.flowParticles.push({
          mesh: sphere,
          curve,
          t: i / 4,
          speed: 0.0018
        });
      }
    });

    scene.add(flowGroup);
    state.flowGroup = flowGroup;
    return flowGroup;
  },

  updateParticles(state) {
    if (!state.showFlows || !state.flowParticles || state.flowParticles.length === 0) return;
    state.flowParticles.forEach(fp => {
      fp.t = (fp.t + fp.speed) % 1.0;
      const pos = fp.curve.getPointAt(fp.t);
      fp.mesh.position.copy(pos);
    });
  }
};
