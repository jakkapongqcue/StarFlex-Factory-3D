// ============================================================================
// Module: src/builders/north-yard/north-yard.common.js
// Shared materials and architectural geometry helpers for North Exterior Yard:
// Gabled industrial shells, roller shutter doors, roof ventilators.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.NorthYard = window.Starflex3D.Builders.NorthYard || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;

  // Shared Industrial Materials
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45, metalness: 0.15 });
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.38, metalness: 0.32 });
  const shutterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.4 });
  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
  const curbMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const stainlessMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.25, metalness: 0.75 });
  const floorSlabMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 });
  const redSafetyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
  const drumBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.2 });
  const drumGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35, metalness: 0.2 });
  const drumRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.2 });

  // Helper: Build standard gabled industrial shell (East-West ridge)
  function buildGabledShellEW(bldgGroup, w, d, eaveH, ridgeH, zOffset = 0) {
    const halfW = w * 0.5;
    const halfD = d * 0.5;

    // 1. Floor Slab
    const floor = new THREE.Mesh(new THREE.BoxGeometry(w * 0.98, 0.28, d * 0.98), floorSlabMat);
    floor.position.set(0, 0.14, zOffset);
    addEdges(floor, 0x64748b, 0.6);
    bldgGroup.add(floor);

    // Spill containment curb
    const curbThick = 0.14;
    const curbH = 0.20;
    [-halfW * 0.92, halfW * 0.92].forEach(cx => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(curbThick, curbH, d * 0.92), curbMat);
      c.position.set(cx, 0.28 + curbH * 0.5, zOffset);
      bldgGroup.add(c);
    });
    [-halfD * 0.92, halfD * 0.92].forEach(cz => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, curbH, curbThick), curbMat);
      c.position.set(0, 0.28 + curbH * 0.5, zOffset + cz);
      bldgGroup.add(c);
    });

    // 2. Dark Base Skirt & Per-Side Cutaway Wall Panels (N, S, E, W)
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.98, 0.55, d * 0.98), baseMat);
    baseMesh.position.set(0, 0.28 + 0.275, zOffset);
    addEdges(baseMesh, 0x1e293b, 0.6);
    bldgGroup.add(baseMesh);

    const innerW = w * 0.96;
    const innerD = d * 0.96;
    const mainWallH = Math.max(0.4, eaveH - 0.55);
    const wallY = 0.55 + mainWallH * 0.5;
    const wallT = 0.16;

    const northWallGrp = new THREE.Group();
    const southWallGrp = new THREE.Group();
    const westWallGrp = new THREE.Group();
    const eastWallGrp = new THREE.Group();
    const roofGrp = new THREE.Group();
    bldgGroup.add(northWallGrp, southWallGrp, westWallGrp, eastWallGrp, roofGrp);

    const nMesh = new THREE.Mesh(new THREE.BoxGeometry(innerW, mainWallH, wallT), wallMat);
    nMesh.position.set(0, wallY, zOffset - innerD * 0.5 + wallT * 0.5);
    addEdges(nMesh, 0x94a3b8, 0.6);
    northWallGrp.add(nMesh);

    const sMesh = new THREE.Mesh(new THREE.BoxGeometry(innerW, mainWallH, wallT), wallMat);
    sMesh.position.set(0, wallY, zOffset + innerD * 0.5 - wallT * 0.5);
    addEdges(sMesh, 0x94a3b8, 0.6);
    southWallGrp.add(sMesh);

    const sideD = Math.max(0.2, innerD - wallT * 2 - 0.02);
    const wMesh = new THREE.Mesh(new THREE.BoxGeometry(wallT, mainWallH, sideD), wallMat);
    wMesh.position.set(-innerW * 0.5 + wallT * 0.5, wallY, zOffset);
    addEdges(wMesh, 0x94a3b8, 0.6);
    westWallGrp.add(wMesh);

    const eMesh = new THREE.Mesh(new THREE.BoxGeometry(wallT, mainWallH, sideD), wallMat);
    eMesh.position.set(innerW * 0.5 - wallT * 0.5, wallY, zOffset);
    addEdges(eMesh, 0x94a3b8, 0.6);
    eastWallGrp.add(eMesh);

    // Expose attach targets & register local cutaway geometry
    bldgGroup.userData.southWallObj = southWallGrp;
    bldgGroup.userData.northWallObj = northWallGrp;
    bldgGroup.userData.roofObj = roofGrp;
    bldgGroup.userData.cutawayMeta = bldgGroup.userData.cutawayMeta || { walls: [], roofs: [] };
    bldgGroup.userData.cutawayMeta.walls.push(
      { obj: northWallGrp, x1: -innerW * 0.5, z1: zOffset - innerD * 0.5, x2: innerW * 0.5, z2: zOffset - innerD * 0.5, nx: 0, nz: -1, minY: 0.55, maxY: eaveH },
      { obj: southWallGrp, x1: -innerW * 0.5, z1: zOffset + innerD * 0.5, x2: innerW * 0.5, z2: zOffset + innerD * 0.5, nx: 0, nz: 1, minY: 0.55, maxY: eaveH },
      { obj: westWallGrp, x1: -innerW * 0.5, z1: zOffset - innerD * 0.5, x2: -innerW * 0.5, z2: zOffset + innerD * 0.5, nx: -1, nz: 0, minY: 0.55, maxY: eaveH },
      { obj: eastWallGrp, x1: innerW * 0.5, z1: zOffset - innerD * 0.5, x2: innerW * 0.5, z2: zOffset + innerD * 0.5, nx: 1, nz: 0, minY: 0.55, maxY: eaveH }
    );
    bldgGroup.userData.cutawayMeta.roofs.push(roofGrp);

    // 3. West & East Gable Tympanums (move cleanly with roofGrp in cutaway)
    const gableX = halfW * 0.96;
    [-gableX + 0.07, gableX - 0.07].forEach(gx => {
      const tympanumShape = new THREE.Shape();
      tympanumShape.moveTo(-halfD * 0.96, eaveH);
      tympanumShape.lineTo(0, ridgeH - 0.02);
      tympanumShape.lineTo(halfD * 0.96, eaveH);
      tympanumShape.closePath();

      const tympanumGeo = new THREE.ExtrudeGeometry(tympanumShape, { depth: 0.14, bevelEnabled: false });
      tympanumGeo.rotateY(Math.PI / 2);
      const tympanum = new THREE.Mesh(tympanumGeo, wallMat);
      tympanum.position.set(gx + (gx > 0 ? -0.07 : 0.07), 0, zOffset);
      roofGrp.add(tympanum);

      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, Math.min(1.8, d * 0.35)), darkSteelMat);
      louver.position.set(gx + (gx > 0 ? 0.04 : -0.04), (eaveH + ridgeH) * 0.5 - 0.08, zOffset);
      addEdges(louver, 0x64748b, 0.6);
      roofGrp.add(louver);
    });

    // 4. Two Sloped Gable Roof Planes
    const overhangZ = 0.4;
    const overhangX = 0.4;
    const runZ = halfD + overhangZ;
    const riseH = ridgeH - eaveH;
    const slopeD = Math.hypot(runZ, riseH);
    const slopeAngle = Math.atan2(riseH, runZ);
    const roofLenX = w + overhangX * 2;

    const northSlope = new THREE.Mesh(new THREE.BoxGeometry(roofLenX, 0.14, slopeD), roofMat);
    northSlope.position.set(0, (eaveH + ridgeH) * 0.5 + 0.06, zOffset - runZ * 0.5);
    northSlope.rotation.x = -slopeAngle;
    addEdges(northSlope, 0x1e293b, 0.65);
    roofGrp.add(northSlope);

    const southSlope = new THREE.Mesh(new THREE.BoxGeometry(roofLenX, 0.14, slopeD), roofMat);
    southSlope.position.set(0, (eaveH + ridgeH) * 0.5 + 0.06, zOffset + runZ * 0.5);
    southSlope.rotation.x = slopeAngle;
    addEdges(southSlope, 0x1e293b, 0.65);
    roofGrp.add(southSlope);

    const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(roofLenX, 0.14, 0.48), darkSteelMat);
    ridgeCap.position.set(0, ridgeH + 0.07, zOffset);
    roofGrp.add(ridgeCap);
  }

  // Helper: Add South Roller Shutter Door with Yellow Safety Frame & Canopy
  function addSouthShutterDoor(bldgGroup, dx, southWallZ, doorW = 2.8, doorH = 2.8) {
    const target = (bldgGroup.userData && bldgGroup.userData.southWallObj) || bldgGroup;
    const door = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.15), shutterMat);
    door.position.set(dx, doorH * 0.5 + 0.28, southWallZ + 0.05);
    addEdges(door, 0x0369a1, 0.7);
    target.add(door);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.28, doorH + 0.2, 0.18), yellowMat);
    trim.position.set(dx, (doorH + 0.2) * 0.5 + 0.2, southWallZ + 0.06);
    addEdges(trim, 0xb45309, 0.6);
    target.add(trim);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.7, 0.12, 1.4), darkSteelMat);
    canopy.position.set(dx, doorH + 0.55, southWallZ + 0.7);
    addEdges(canopy, 0x0f172a, 0.7);
    target.add(canopy);
  }

  // Helper: Add Roof Ventilator Turbines along X
  function addRoofVentilators(bldgGroup, xPositions, ridgeH, zOffset = 0) {
    const target = (bldgGroup.userData && bldgGroup.userData.roofObj) || bldgGroup;
    xPositions.forEach(vx => {
      const ventBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.42, 10), darkSteelMat);
      ventBase.position.set(vx, ridgeH + 0.28, zOffset);
      const ventBall = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), stainlessMat);
      ventBall.position.set(vx, ridgeH + 0.52, zOffset);
      target.add(ventBase, ventBall);
    });
  }

  window.Starflex3D.Builders.NorthYard.Common = {
    mats: {
      wallMat,
      baseMat,
      roofMat,
      shutterMat,
      yellowMat,
      curbMat,
      darkSteelMat,
      stainlessMat,
      floorSlabMat,
      redSafetyMat,
      drumBlueMat,
      drumGreenMat,
      drumRedMat
    },
    buildGabledShellEW,
    addSouthShutterDoor,
    addRoofVentilators
  };
})();
