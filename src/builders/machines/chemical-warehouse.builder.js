// ============================================================================
// Module: src/builders/machines/chemical-warehouse.builder.js
// Procedural 3D Builders for North Exterior Yard Facilities:
//   - 14 · โรงกลั่นตัวทำละลาย (Solvent Distillation Room)
//   - 15 · โรงผสม Solvent + ห้องน้ำ (Solvent Mixing Room & North Restroom)
//   - 20 · อาคารจัดเก็บสารเคมี 1 & โรงคัดแยกขยะ / อาคารจัดเก็บสารเคมี 2
//   - 13 · สถานีถังก๊าซ LPG (LPG Bulk Tank Station - 2 Bullet Tanks)
//   - 5  · คลังจัดเก็บวัตถุดิบ (Raw Material Storage Warehouse)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.ChemicalWarehouse = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.MachineCommon;

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

    // 2. Dark Base Skirt & Main Walls
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.98, 0.55, d * 0.98), baseMat);
    baseMesh.position.set(0, 0.28 + 0.275, zOffset);
    addEdges(baseMesh, 0x1e293b, 0.6);
    bldgGroup.add(baseMesh);

    const mainWallH = eaveH - 0.55;
    const wallsMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, mainWallH, d * 0.96), wallMat);
    wallsMesh.position.set(0, 0.55 + mainWallH * 0.5, zOffset);
    addEdges(wallsMesh, 0x94a3b8, 0.6);
    bldgGroup.add(wallsMesh);

    // 3. West & East Gable Tympanums
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
      bldgGroup.add(tympanum);

      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.55, Math.min(1.8, d * 0.35)), darkSteelMat);
      louver.position.set(gx + (gx > 0 ? 0.04 : -0.04), (eaveH + ridgeH) * 0.5 - 0.08, zOffset);
      addEdges(louver, 0x64748b, 0.6);
      bldgGroup.add(louver);
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
    bldgGroup.add(northSlope);

    const southSlope = new THREE.Mesh(new THREE.BoxGeometry(roofLenX, 0.14, slopeD), roofMat);
    southSlope.position.set(0, (eaveH + ridgeH) * 0.5 + 0.06, zOffset + runZ * 0.5);
    southSlope.rotation.x = slopeAngle;
    addEdges(southSlope, 0x1e293b, 0.65);
    bldgGroup.add(southSlope);

    const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(roofLenX, 0.14, 0.48), darkSteelMat);
    ridgeCap.position.set(0, ridgeH + 0.07, zOffset);
    bldgGroup.add(ridgeCap);
  }

  // Helper: Add South Roller Shutter Door with Yellow Safety Frame & Canopy
  function addSouthShutterDoor(bldgGroup, dx, southWallZ, doorW = 2.8, doorH = 2.8) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.15), shutterMat);
    door.position.set(dx, doorH * 0.5 + 0.28, southWallZ + 0.05);
    addEdges(door, 0x0369a1, 0.7);
    bldgGroup.add(door);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.28, doorH + 0.2, 0.18), yellowMat);
    trim.position.set(dx, (doorH + 0.2) * 0.5 + 0.2, southWallZ + 0.06);
    addEdges(trim, 0xb45309, 0.6);
    bldgGroup.add(trim);

    const canopy = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.7, 0.12, 1.4), darkSteelMat);
    canopy.position.set(dx, doorH + 0.55, southWallZ + 0.7);
    addEdges(canopy, 0x0f172a, 0.7);
    bldgGroup.add(canopy);
  }

  // Helper: Add Roof Ventilator Turbines along X
  function addRoofVentilators(bldgGroup, xPositions, ridgeH, zOffset = 0) {
    xPositions.forEach(vx => {
      const ventBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.42, 10), darkSteelMat);
      ventBase.position.set(vx, ridgeH + 0.28, zOffset);
      const ventBall = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), stainlessMat);
      ventBall.position.set(vx, ridgeH + 0.52, zOffset);
      bldgGroup.add(ventBase, ventBall);
    });
  }

  // ==========================================================================
  // 1.Zone 14: โรงกลั่นตัวทำละลาย (Solvent Distillation Room)
  // ==========================================================================
  function buildSolventDistillation(group, r, H) {
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const eaveH = 3.3;
    const ridgeH = H || 4.2;
    buildGabledShellEW(bldgGroup, r.w, r.d, eaveH, ridgeH, 0);
    addRoofVentilators(bldgGroup, [0], ridgeH, 0);

    const southWallZ = r.d * 0.48;
    addSouthShutterDoor(bldgGroup, 0, southWallZ, 2.0, 2.4);

    // Distillation Equipment Inside
    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.1, 14), stainlessMat);
    kettle.position.set(-r.w * 0.18, 0.3 + 1.05, -r.d * 0.12);
    addEdges(kettle, 0x475569, 0.5);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.65, 14, 10), stainlessMat);
    dome.position.set(-r.w * 0.18, 0.3 + 2.1, -r.d * 0.12);
    const condenser = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.6, 12), stainlessMat);
    condenser.position.set(r.w * 0.18, 0.3 + 1.2, -r.d * 0.12);
    const recvDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.9, 12), drumBlueMat);
    recvDrum.position.set(r.w * 0.18, 0.3 + 0.45, r.d * 0.18);
    bldgGroup.add(kettle, dome, condenser, recvDrum);

    const sign = createSignboardMesh("14 · โรงกลั่นตัวทำละลาย", "SOLVENT DISTILLATION", 3.6, 0.72, 0x0284c7);
    sign.position.set(0, 3.05, southWallZ + 0.08);
    bldgGroup.add(sign);
  }

  // ==========================================================================
  // 2. Zone 15: โรงผสม Solvent + ห้องน้ำฝั่งเหนือ (Solvent Mixing & North Restroom)
  // ==========================================================================
  function buildSolventMixing(group, r, H) {
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
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 2.0, 14), stainlessMat);
      tank.position.set(tx, 0.3 + 1.0, -r.d * 0.12);
      addEdges(tank, 0x475569, 0.5);
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.55, 10), drumBlueMat);
      motor.position.set(tx, 0.3 + 2.28, -r.d * 0.12);
      bldgGroup.add(tank, motor);
    });

    const sign = createSignboardMesh("15 · โรงผสม SOLVENT", "SOLVENT MIXING ROOM", 4.4, 0.78, 0x0284c7);
    sign.position.set(0, 3.25, southWallZ + 0.08);
    bldgGroup.add(sign);

    // Attached North Restroom ("ห้องน้ำ" directly north of 15 in blueprint)
    const wcW = r.w * 0.88;
    const wcD = 3.2;
    const wcH = 3.0;
    const wcZ = -r.d * 0.5 - wcD * 0.5 - 0.6;

    const wcBody = new THREE.Mesh(new THREE.BoxGeometry(wcW, wcH, wcD), wallMat);
    wcBody.position.set(0, wcH * 0.5, wcZ);
    addEdges(wcBody, 0x94a3b8, 0.6);
    const wcRoof = new THREE.Mesh(new THREE.BoxGeometry(wcW + 0.4, 0.18, wcD + 0.4), roofMat);
    wcRoof.position.set(0, wcH + 0.09, wcZ);
    addEdges(wcRoof, 0x1e293b, 0.6);
    const wcSign = createSignboardMesh("ห้องน้ำ", "RESTROOM", 2.4, 0.55, 0x0f766e);
    wcSign.position.set(0, wcH - 0.45, wcZ + wcD * 0.5 + 0.06);
    bldgGroup.add(wcBody, wcRoof, wcSign);
  }

  // ==========================================================================
  // 3. Zone 13: สถานีถังก๊าซ LPG (LPG Bulk Tank Station - 2 White Bullet Tanks)
  // ==========================================================================
  function buildLPGStation(group, r, H) {
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const halfW = r.w * 0.5;
    const halfD = r.d * 0.5;

    // 1. Bright Orange-Yellow Safety Base Pad (matches yellow LPG box in layout)
    const padBase = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.32, r.d * 0.98),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45, metalness: 0.1 })
    );
    padBase.position.y = 0.16;
    addEdges(padBase, 0xb45309, 0.8);
    bldgGroup.add(padBase);

    const innerPad = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.88, 0.06, r.d * 0.86),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    );
    innerPad.position.y = 0.35;
    bldgGroup.add(innerPad);

    // 2. 3-Sided Concrete Fire Blast Wall (West, North, East)
    const wallH = 3.2;
    const wallThick = 0.25;
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, r.d * 0.96), wallMat);
    westWall.position.set(-halfW * 0.96, wallH * 0.5 + 0.3, 0);
    addEdges(westWall, 0x64748b, 0.6);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, r.d * 0.96), wallMat);
    eastWall.position.set(halfW * 0.96, wallH * 0.5 + 0.3, 0);
    addEdges(eastWall, 0x64748b, 0.6);

    const northWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.96, wallH, wallThick), wallMat);
    northWall.position.set(0, wallH * 0.5 + 0.3, -halfD * 0.96);
    addEdges(northWall, 0x64748b, 0.6);
    bldgGroup.add(westWall, eastWall, northWall);

    // South Safety Bollards along front
    for (let i = -4; i <= 4; i++) {
      const bx = (i / 4) * (halfW * 0.82);
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.0, 8), curbMat);
      bollard.position.set(bx, 0.8, halfD * 0.92);
      addEdges(bollard, 0x1e293b, 0.5);
      bldgGroup.add(bollard);
    }

    // 3. Two Horizontal White Cylindrical LPG Bullet Tanks (oriented North-South)
    const lpgWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.3 });
    const tankRadius = 1.05;
    const cylLen = r.d * 0.48;
    const tankY = 0.38 + 0.65 + tankRadius;

    [-r.w * 0.22, r.w * 0.22].forEach(tx => {
      // 2 Concrete Saddle Cradles under each tank
      [-cylLen * 0.32, cylLen * 0.32].forEach(sz => {
        const saddle = new THREE.Mesh(new THREE.BoxGeometry(tankRadius * 1.7, 0.75, 0.45), baseMat);
        saddle.position.set(tx, 0.38 + 0.375, sz);
        addEdges(saddle, 0x0f172a, 0.6);
        bldgGroup.add(saddle);
      });

      // Main Cylinder Body (rotated along Z axis)
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(tankRadius, tankRadius, cylLen, 20), lpgWhiteMat);
      cyl.rotation.x = Math.PI / 2;
      cyl.position.set(tx, tankY, 0);
      addEdges(cyl, 0x94a3b8, 0.4);
      bldgGroup.add(cyl);

      // Hemispherical End Caps (North & South domes)
      [-cylLen * 0.5, cylLen * 0.5].forEach(ez => {
        const dome = new THREE.Mesh(new THREE.SphereGeometry(tankRadius, 20, 14), lpgWhiteMat);
        dome.position.set(tx, tankY, ez);
        bldgGroup.add(dome);
      });

      // Red Flammable Hazard Band around center of tank
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(tankRadius + 0.02, tankRadius + 0.02, 0.45, 20),
        redSafetyMat
      );
      band.rotation.x = Math.PI / 2;
      band.position.set(tx, tankY, 0);
      bldgGroup.add(band);

      // Top Pressure Relief Valves & Manhole Dome
      const manhole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.35, 12), stainlessMat);
      manhole.position.set(tx, tankY + tankRadius + 0.15, -0.4);
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8), redSafetyMat);
      valve.position.set(tx, tankY + tankRadius + 0.25, 0.5);
      bldgGroup.add(manhole, valve);
    });

    // 4. Overhead Red Fire-Water Deluge Sprinkler Frame
    const delugeY = tankY + tankRadius + 0.85;
    const delugeTopBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, r.w * 0.72, 8), redSafetyMat);
    delugeTopBar.rotation.z = Math.PI / 2;
    delugeTopBar.position.set(0, delugeY, 0);
    bldgGroup.add(delugeTopBar);

    [-r.w * 0.22, r.w * 0.22].forEach(tx => {
      const delugeBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, cylLen + 1.4, 8), redSafetyMat);
      delugeBranch.rotation.x = Math.PI / 2;
      delugeBranch.position.set(tx, delugeY, 0);
      bldgGroup.add(delugeBranch);
    });

    // 5. Signboard on North Blast Wall
    const sign = createSignboardMesh(
      "13 · สถานีถังก๊าซ LPG (ไวไฟอันตราย)",
      "LPG BULK STORAGE STATION - NO SMOKING",
      5.4,
      0.85,
      0xdc2626
    );
    sign.position.set(0, wallH + 0.45, -halfD * 0.92);
    bldgGroup.add(sign);
  }

  // ==========================================================================
  // 4. Zone 5: คลังจัดเก็บวัตถุดิบ (Raw Material Storage Warehouse)
  // ==========================================================================
  function buildRawMaterialWarehouse(group, r, H, mats) {
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
      "5 · คลังจัดเก็บวัตถุดิบ",
      "RAW MATERIAL STORAGE WAREHOUSE",
      5.2,
      0.88,
      0x15803d
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

  // ==========================================================================
  // 5. Zone 20: อาคารจัดเก็บสารเคมี 1 (+ โรงคัดแยกขยะ) & อาคารจัดเก็บสารเคมี 2
  // ==========================================================================
  function buildChemicalWarehouse(group, r, H, mats, item) {
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const eaveH = 4.2;
    const ridgeH = H || 5.6;
    const halfW = r.w * 0.5;
    const halfD = r.d * 0.5;
    const isZone20A = item && item.id === "chem_storage_building";

    if (isZone20A) {
      // Zone 20A has North Waste Sorting Bay ("โรงคัดแยกขยะ") + Main Chemical Storage + East Flammable Bay
      const wasteD = r.d * 0.28;
      const mainD = r.d - wasteD;
      const mainZ = wasteD * 0.5;
      const wasteZ = -halfD + wasteD * 0.5;

      // Main South Chemical Warehouse Shell
      buildGabledShellEW(bldgGroup, r.w, mainD, eaveH, ridgeH, mainZ);
      addRoofVentilators(bldgGroup, [-r.w * 0.32, 0, r.w * 0.32], ridgeH, mainZ);

      // North Waste Sorting Shed Annex ("โรงคัดแยกขยะ")
      const shedH = 3.5;
      const shedFloor = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, 0.26, wasteD), floorSlabMat);
      shedFloor.position.set(0, 0.13, wasteZ);
      const shedWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.96, shedH, wasteD * 0.96), wallMat);
      shedWall.position.set(0, shedH * 0.5, wasteZ);
      addEdges(shedWall, 0x94a3b8, 0.6);
      const shedRoof = new THREE.Mesh(new THREE.BoxGeometry(r.w + 0.5, 0.14, wasteD + 0.4), roofMat);
      shedRoof.position.set(0, shedH + 0.07, wasteZ);
      addEdges(shedRoof, 0x1e293b, 0.65);
      bldgGroup.add(shedFloor, shedWall, shedRoof);

      // Color-coded Waste & Recycle Bins along North Waste Sorting Bay
      const binColors = [0x1d4ed8, 0xfacc15, 0x16a34a, 0xdc2626, 0x1d4ed8, 0xfacc15];
      binColors.forEach((col, idx) => {
        const bx = -r.w * 0.35 + (r.w * 0.70 * idx) / (binColors.length - 1);
        const bin = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 1.25, 1.0),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 })
        );
        bin.position.set(bx, 0.26 + 0.625, wasteZ);
        addEdges(bin, 0x0f172a, 0.5);
        bldgGroup.add(bin);
      });

      const wasteSign = createSignboardMesh("20 · โรงคัดแยกขยะ", "WASTE SORTING & RECYCLE", 4.6, 0.75, 0x15803d);
      wasteSign.rotation.y = Math.PI;
      wasteSign.position.set(0, shedH - 0.45, -halfD - 0.06);
      bldgGroup.add(wasteSign);

      // South Doors & Signboard on Main Chemical Section
      const southWallZ = halfD * 0.96;
      [-r.w * 0.25, r.w * 0.18].forEach(dx => {
        addSouthShutterDoor(bldgGroup, dx, southWallZ, 3.0, 2.9);
      });

      const sign = createSignboardMesh(
        "20 · อาคารจัดเก็บสารเคมี 1 และของเหลวไวไฟ",
        "CHEMICAL STORAGE 1 & FLAMMABLE LIQUIDS",
        6.2,
        0.88,
        0xdc2626
      );
      sign.position.set(0, 3.55, southWallZ + 0.08);
      bldgGroup.add(sign);
    } else {
      // Zone 20B: Long East-West Chemical Storage 2 behind Hall 2
      buildGabledShellEW(bldgGroup, r.w, r.d, eaveH, ridgeH, 0);
      addRoofVentilators(bldgGroup, [-r.w * 0.36, -r.w * 0.12, r.w * 0.12, r.w * 0.36], ridgeH, 0);

      const southWallZ = halfD * 0.96;
      [-r.w * 0.30, 0, r.w * 0.30].forEach(dx => {
        addSouthShutterDoor(bldgGroup, dx, southWallZ, 3.0, 2.9);
      });

      const sign = createSignboardMesh(
        "20 · อาคารจัดเก็บสารเคมี 2 (HAZCHEM)",
        "CHEMICAL & SOLVENT STORAGE WAREHOUSE 2",
        6.0,
        0.88,
        0xdc2626
      );
      sign.position.set(0, 3.55, southWallZ + 0.08);
      bldgGroup.add(sign);
    }

    // Populate Interior with 200L Chemical Drums & 1,000L IBC Totes
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const numPallets = Math.max(4, Math.floor(r.w / 4.2));
    for (let p = 0; p < numPallets; p++) {
      const px = -r.w * 0.38 + (r.w * 0.76 * p) / Math.max(1, numPallets - 1);
      const palletZ = isZone20A ? r.d * 0.05 : -halfD * 0.22;

      const spPallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.4), curbMat);
      spPallet.position.set(px, 0.3 + 0.11, palletZ);
      const grate = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 1.36), grateMat);
      grate.position.set(px, 0.3 + 0.24, palletZ);
      bldgGroup.add(spPallet, grate);

      [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([dx, dz], dIdx) => {
        const mat = (p + dIdx) % 3 === 0 ? drumRedMat : (p + dIdx) % 2 === 0 ? drumBlueMat : drumGreenMat;
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.92, 12), mat);
        drum.position.set(px + dx, 0.3 + 0.26 + 0.46, palletZ + dz);
        addEdges(drum, 0x0f172a, 0.4);
        bldgGroup.add(drum);
      });
    }
  }

  return {
    buildChemicalWarehouse,
    buildSolventDistillation,
    buildSolventMixing,
    buildLPGStation,
    buildRawMaterialWarehouse
  };
})();
