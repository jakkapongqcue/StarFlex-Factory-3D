// ============================================================================
// Module: src/builders/north-yard/solvent-facilities.builder.js
// Procedural 3D Builders for Solvent Facilities in North Exterior Yard:
//   - 14 · โรงกลั่นตัวทำละลาย (Solvent Distillation Room)
//   - 15 · โรงผสม Solvent + ห้องน้ำฝั่งเหนือ (Solvent Mixing & North Restroom)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.NorthYard = window.Starflex3D.Builders.NorthYard || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};
  const NYCommon = window.Starflex3D.Builders.NorthYard.Common;

  // 1. Zone 14: โรงกลั่นตัวทำละลาย (Solvent Distillation Room)
  function buildSolventDistillation(group, r, H) {
    const { mats, buildGabledShellEW, addSouthShutterDoor, addRoofVentilators } = NYCommon;
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const eaveH = 3.3;
    const ridgeH = H || 4.2;
    buildGabledShellEW(bldgGroup, r.w, r.d, eaveH, ridgeH, 0);
    addRoofVentilators(bldgGroup, [0], ridgeH, 0);

    const southWallZ = r.d * 0.48;
    addSouthShutterDoor(bldgGroup, 0, southWallZ, 2.0, 2.4);

    // Distillation Equipment Inside
    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.1, 14), mats.stainlessMat);
    kettle.position.set(-r.w * 0.18, 0.3 + 1.05, -r.d * 0.12);
    addEdges(kettle, 0x475569, 0.5);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 14, 10), mats.stainlessMat);
    dome.position.set(-r.w * 0.18, 0.3 + 2.1, -r.d * 0.12);
    const condenser = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.6, 12), mats.stainlessMat);
    condenser.position.set(r.w * 0.18, 0.3 + 1.2, -r.d * 0.12);
    const recvDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.9, 12), mats.drumBlueMat);
    recvDrum.position.set(r.w * 0.18, 0.3 + 0.45, r.d * 0.18);
    bldgGroup.add(kettle, dome, condenser, recvDrum);

    const sign = createSignboardMesh(3.6, 0.72, "14 · โรงกลั่นตัวทำละลาย", "SOLVENT DISTILLATION", "#0284c7");
    sign.position.set(0, 3.05, southWallZ + 0.08);
    (bldgGroup.userData.southWallObj || bldgGroup).add(sign);
  }

  // 2. Zone 15: โรงผสม Solvent + ห้องน้ำฝั่งเหนือ (Solvent Mixing & North Restroom)
  function buildSolventMixing(group, r, H) {
    const { mats, buildGabledShellEW, addSouthShutterDoor, addRoofVentilators } = NYCommon;
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const eaveH = 3.6;
    const ridgeH = H || 4.6;
    buildGabledShellEW(bldgGroup, r.w, r.d, eaveH, ridgeH, 0);
    addRoofVentilators(bldgGroup, [-r.w * 0.22, r.w * 0.22], ridgeH, 0);

    const southWallZ = r.d * 0.48;
    addSouthShutterDoor(bldgGroup, 0, southWallZ, 2.4, 2.6);

    // 2 Stainless Steel Solvent Mixing Tanks with Agitators inside
    [-r.w * 0.22, r.w * 0.22].forEach(tx => {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 2.0, 14), mats.stainlessMat);
      tank.position.set(tx, 0.3 + 1.0, -r.d * 0.12);
      addEdges(tank, 0x475569, 0.5);
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.55, 10), mats.drumBlueMat);
      motor.position.set(tx, 0.3 + 2.28, -r.d * 0.12);
      bldgGroup.add(tank, motor);
    });

    const sign = createSignboardMesh(4.4, 0.78, "15 · โรงผสม SOLVENT", "SOLVENT MIXING ROOM", "#0284c7");
    sign.position.set(0, 3.25, southWallZ + 0.08);
    (bldgGroup.userData.southWallObj || bldgGroup).add(sign);

    // Attached North Restroom ("ห้องน้ำ" directly north of 15 in blueprint)
    const wcW = r.w * 0.88;
    const wcD = 3.2;
    const wcH = 3.0;
    const wcZ = -r.d * 0.5 - wcD * 0.5 - 0.6;

    const wcBody = new THREE.Mesh(new THREE.BoxGeometry(wcW, wcH, wcD), mats.wallMat);
    wcBody.position.set(0, wcH * 0.5, wcZ);
    addEdges(wcBody, 0x94a3b8, 0.6);
    const wcRoof = new THREE.Mesh(new THREE.BoxGeometry(wcW + 0.4, 0.18, wcD + 0.4), mats.roofMat);
    wcRoof.position.set(0, wcH + 0.09, wcZ);
    addEdges(wcRoof, 0x1e293b, 0.6);
    const wcSign = createSignboardMesh(2.4, 0.55, "ห้องน้ำ", "RESTROOM", "#0f766e");
    wcSign.position.set(0, wcH - 0.45, wcZ + wcD * 0.5 + 0.06);
    bldgGroup.add(wcBody, wcRoof, wcSign);
  }

  window.Starflex3D.Builders.NorthYard.buildSolventDistillation = buildSolventDistillation;
  window.Starflex3D.Builders.NorthYard.buildSolventMixing = buildSolventMixing;
})();
