// ============================================================================
// Module: src/builders/north-yard/raw-material.builder.js
// Procedural 3D Builder for Zone 5: คลังจัดเก็บวัตถุดิบ (Raw Material Storage).
// Features: Gabled industrial warehouse shell, selective pallet racks,
// jumbo film rolls, carton boxes and forklift access shutters.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.NorthYard = window.Starflex3D.Builders.NorthYard || {};

(function () {
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};
  const NYCommon = window.Starflex3D.Builders.NorthYard.Common;

  function buildRawMaterialWarehouse(group, r, H, mats) {
    const { buildGabledShellEW, addSouthShutterDoor, addRoofVentilators } = NYCommon;
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const eaveH = 4.5;
    const ridgeH = H || 6.2;
    buildGabledShellEW(bldgGroup, r.w, r.d, eaveH, ridgeH, 0);
    addRoofVentilators(bldgGroup, [-r.w * 0.28, 0, r.w * 0.28], ridgeH, 0);

    const southWallZ = r.d * 0.48;
    [-r.w * 0.24, r.w * 0.24].forEach(dx => {
      addSouthShutterDoor(bldgGroup, dx, southWallZ, 2.8, 3.0);
    });

    const sign = createSignboardMesh(
      5.2,
      0.88,
      "5 · คลังจัดเก็บวัตถุดิบ",
      "RAW MATERIAL STORAGE WAREHOUSE",
      "#15803d"
    );
    sign.position.set(0, 3.65, southWallZ + 0.08);
    bldgGroup.add(sign);

    // Interior Selective Pallet Racks with Raw Material Rolls & Cartons
    const rackRows = [-r.d * 0.26, 0, r.d * 0.22];
    const rackL = r.w * 0.82;
    const rackD = 1.3;
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const postMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });

    rackRows.forEach((rz, rIdx) => {
      [1.2, 2.4, 3.6].forEach((ty, tIdx) => {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(rackL, 0.1, rackD), beamMat);
        beam.position.set(0, ty, rz);
        bldgGroup.add(beam);

        for (let b = -2; b <= 2; b++) {
          const bx = b * (rackL / 5);
          const isRoll = (rIdx + tIdx + b) % 2 === 0;
          const cargo = isRoll
            ? new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.0, 12), mats.filmRollWhite)
            : new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.72, 1.0), mats.cartonBox);
          if (isRoll) cargo.rotation.x = Math.PI / 2;
          cargo.position.set(bx, ty + 0.42, rz);
          bldgGroup.add(cargo);
        }
      });

      [-rackL * 0.48, -rackL * 0.16, rackL * 0.16, rackL * 0.48].forEach(px => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.0, rackD), postMat);
        post.position.set(px, 2.0, rz);
        bldgGroup.add(post);
      });
    });
  }

  window.Starflex3D.Builders.NorthYard.buildRawMaterialWarehouse = buildRawMaterialWarehouse;
})();
