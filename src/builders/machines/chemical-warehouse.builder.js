// ============================================================================
// Module: src/builders/machines/chemical-warehouse.builder.js
// Procedural 3D Builder for Exterior Chemical & Solvent Storage Warehouse
// (อาคารจัดเก็บสารเคมีและวัตถุไวไฟภายนอกโรงงาน พร้อมหลังคาจั่วและระบบกักเก็บสารเคมี)
// Supports both Horizontal (East-West) and Vertical (North-South) layouts
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.ChemicalWarehouse = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.MachineCommon;

  function buildChemicalWarehouse(group, r, H, mats) {
    const eaveH = 4.2;
    const ridgeH = H || 5.6;
    const halfW = r.w * 0.5;
    const halfD = r.d * 0.5;
    const isLongX = r.w >= r.d; // true for East-West horizontal layout

    // Materials
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.45,
      metalness: 0.15
    });
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.38,
      metalness: 0.32
    });
    const shutterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.4
    });
    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35
    });
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5
    });

    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    // 1. Concrete Floor Slab & Spill Containment Floor (at y = 0.15)
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.28, r.d * 0.98),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 })
    );
    floor.position.y = 0.14;
    addEdges(floor, 0x64748b, 0.6);
    bldgGroup.add(floor);

    // Spill Containment Bund Curb (Yellow-black curb around interior perimeter)
    const curbThick = 0.16;
    const curbH = 0.22;
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    [-halfW * 0.92, halfW * 0.92].forEach(cx => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(curbThick, curbH, r.d * 0.92), curbMat);
      c.position.set(cx, 0.28 + curbH * 0.5, 0);
      bldgGroup.add(c);
    });
    [-halfD * 0.92, halfD * 0.92].forEach(cz => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.92, curbH, curbThick), curbMat);
      c.position.set(0, 0.28 + curbH * 0.5, cz);
      bldgGroup.add(c);
    });

    // 2. Exterior Walls (up to eave height 4.2m)
    // Dark base skirt (0.6m high)
    const baseMesh = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.6, r.d * 0.98),
      baseMat
    );
    baseMesh.position.y = 0.3 + 0.3;
    addEdges(baseMesh, 0x1e293b, 0.6);
    bldgGroup.add(baseMesh);

    // Main wall body (eaveH - 0.6)
    const mainWallH = eaveH - 0.6;
    const wallsMesh = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.96, mainWallH, r.d * 0.96),
      wallMat
    );
    wallsMesh.position.y = 0.6 + mainWallH * 0.5;
    addEdges(wallsMesh, 0x94a3b8, 0.6);
    bldgGroup.add(wallsMesh);

    if (isLongX) {
      // =====================================================================
      // HORIZONTAL EAST-WEST ORIENTATION (Ridge runs along X)
      // =====================================================================
      // 3. South Wall Entrances & Doors (facing factory Hall 1 for forklift loading)
      const doorW = 3.2;
      const doorH = 3.0;
      [-r.w * 0.24, r.w * 0.24].forEach(dx => {
        const door = new THREE.Mesh(
          new THREE.BoxGeometry(doorW, doorH, 0.15),
          shutterMat
        );
        door.position.set(dx, doorH * 0.5 + 0.3, halfD * 0.485);
        addEdges(door, 0x0369a1, 0.7);
        bldgGroup.add(door);

        const trim = new THREE.Mesh(
          new THREE.BoxGeometry(doorW + 0.3, doorH + 0.2, 0.2),
          yellowMat
        );
        trim.position.set(dx, (doorH + 0.2) * 0.5 + 0.2, halfD * 0.48);
        addEdges(trim, 0xb45309, 0.6);
        bldgGroup.add(trim);

        const canopy = new THREE.Mesh(
          new THREE.BoxGeometry(doorW + 0.8, 0.12, 1.6),
          darkSteelMat
        );
        canopy.position.set(dx, doorH + 0.6, halfD * 0.48 + 0.8);
        addEdges(canopy, 0x0f172a, 0.7);
        bldgGroup.add(canopy);
      });

      // Signboard centered between doors on South wall
      const sign = createSignboardMesh(
        "HAZCHEM - อาคารจัดเก็บสารเคมีและวัตถุไวไฟ",
        "CHEMICAL & SOLVENT STORAGE WAREHOUSE",
        5.2,
        0.9,
        0xdc2626
      );
      sign.position.set(0, 3.4, halfD * 0.49 + 0.08);
      bldgGroup.add(sign);

      // 4. West & East Gable End Walls (Triangular Tympanums)
      [-halfW * 0.48, halfW * 0.48].forEach(gx => {
        const tympanumShape = new THREE.Shape();
        tympanumShape.moveTo(-halfD * 0.48, eaveH);
        tympanumShape.lineTo(0, ridgeH);
        tympanumShape.lineTo(halfD * 0.48, eaveH);
        tympanumShape.closePath();

        const extrudeSettings = { depth: 0.14, bevelEnabled: false };
        const tympanumGeo = new THREE.ExtrudeGeometry(tympanumShape, extrudeSettings);
        tympanumGeo.rotateY(Math.PI / 2);
        const tympanum = new THREE.Mesh(tympanumGeo, wallMat);
        tympanum.position.set(gx + (gx > 0 ? -0.07 : 0.07), 0, 0);
        bldgGroup.add(tympanum);

        const louver = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.65, 1.8),
          darkSteelMat
        );
        louver.position.set(gx, (eaveH + ridgeH) * 0.5 - 0.1, 0);
        addEdges(louver, 0x64748b, 0.6);
        bldgGroup.add(louver);
      });

      // 5. Sloped Gable Roof (Two sloping planes running East-West)
      const slopeD = Math.sqrt(Math.pow(halfD * 0.55, 2) + Math.pow(ridgeH - eaveH, 2)) + 0.4;
      const roofLenX = r.w * 1.02;
      const slopeAngle = Math.atan2(ridgeH - eaveH, halfD * 0.5);

      // North Slope (-Z)
      const northSlope = new THREE.Mesh(
        new THREE.BoxGeometry(roofLenX, 0.14, slopeD),
        roofMat
      );
      northSlope.position.set(0, (eaveH + ridgeH) * 0.5 + 0.06, -halfD * 0.26);
      northSlope.rotation.x = -slopeAngle;
      addEdges(northSlope, 0x1e293b, 0.65);
      bldgGroup.add(northSlope);

      // South Slope (+Z)
      const southSlope = new THREE.Mesh(
        new THREE.BoxGeometry(roofLenX, 0.14, slopeD),
        roofMat
      );
      southSlope.position.set(0, (eaveH + ridgeH) * 0.5 + 0.06, halfD * 0.26);
      southSlope.rotation.x = slopeAngle;
      addEdges(southSlope, 0x1e293b, 0.65);
      bldgGroup.add(southSlope);

      // Apex Ridge Cap along X
      const ridgeCap = new THREE.Mesh(
        new THREE.BoxGeometry(roofLenX, 0.14, 0.45),
        darkSteelMat
      );
      ridgeCap.position.set(0, ridgeH + 0.08, 0);
      bldgGroup.add(ridgeCap);

      // Industrial Gravity Roof Exhaust Ventilators along X ridge
      [-r.w * 0.35, -r.w * 0.12, r.w * 0.12, r.w * 0.35].forEach(vx => {
        const ventBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.36, 0.45, 12),
          darkSteelMat
        );
        ventBase.position.set(vx, ridgeH + 0.3, 0);
        const ventBall = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 12, 10),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 })
        );
        ventBall.position.set(vx, ridgeH + 0.55, 0);
        bldgGroup.add(ventBase, ventBall);
      });

      // 6. Chemical Drums & IBC Totes Inside
      const drumBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.2 });
      const drumGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35, metalness: 0.2 });
      const spillPalletMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const grateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

      // Drum Pallet Stations along North wall (-Z)
      [-r.w * 0.35, -r.w * 0.18, 0, r.w * 0.18, r.w * 0.35].forEach((px, pIdx) => {
        const palletZ = -halfD * 0.28;
        const spPallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.4), spillPalletMat);
        spPallet.position.set(px, 0.3 + 0.11, palletZ);
        const grate = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 1.36), grateMat);
        grate.position.set(px, 0.3 + 0.24, palletZ);
        bldgGroup.add(spPallet, grate);

        [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([dx, dz], dIdx) => {
          const mat = (pIdx + dIdx) % 2 === 0 ? drumBlueMat : drumGreenMat;
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.92, 12), mat);
          drum.position.set(px + dx, 0.3 + 0.26 + 0.46, palletZ + dz);
          addEdges(drum, 0x0f172a, 0.4);
          bldgGroup.add(drum);

          const bung = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8),
            new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 })
          );
          bung.position.set(px + dx + 0.12, 0.3 + 0.26 + 0.93, palletZ + dz);
          bldgGroup.add(bung);
        });
      });

      // 1,000L IBC Tote Tanks along South wall corners
      const ibcTankMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85
      });
      const ibcCageMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true
      });

      [-r.w * 0.38, r.w * 0.38].forEach(ix => {
        const ibcZ = halfD * 0.15;
        const ibcBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.2), spillPalletMat);
        ibcBase.position.set(ix, 0.3 + 0.06, ibcZ);
        const ibcBottle = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 1.05), ibcTankMat);
        ibcBottle.position.set(ix, 0.3 + 0.12 + 0.52, ibcZ);
        const ibcCage = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.12, 1.12), ibcCageMat);
        ibcCage.position.set(ix, 0.3 + 0.12 + 0.52, ibcZ);
        bldgGroup.add(ibcBase, ibcBottle, ibcCage);
      });

      // Safety Emergency Shower & Eye Wash Station
      const greenPipeMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
      const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), greenPipeMat);
      showerPipe.position.set(0, 0.3 + 1.2, -halfD * 0.3);
      const showerHead = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.12, 10), yellowMat);
      showerHead.position.set(0, 0.3 + 2.38, -halfD * 0.3 + 0.22);
      showerHead.rotation.x = Math.PI;
      const eyewashBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.14, 10), yellowMat);
      eyewashBowl.position.set(0, 0.3 + 1.1, -halfD * 0.3 + 0.18);
      bldgGroup.add(showerPipe, showerHead, eyewashBowl);

    } else {
      // =====================================================================
      // VERTICAL NORTH-SOUTH ORIENTATION (Ridge runs along Z)
      // =====================================================================
      // 3. East Wall Entrances & Doors (facing factory Hall 1 for forklift loading)
      const doorW = 2.4;
      const doorH = 3.0;
      [-r.d * 0.24, r.d * 0.24].forEach((dz) => {
        const door = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, doorH, doorW),
          shutterMat
        );
        door.position.set(halfW * 0.485, doorH * 0.5 + 0.3, dz);
        addEdges(door, 0x0369a1, 0.7);
        bldgGroup.add(door);

        const trim = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, doorH + 0.2, doorW + 0.3),
          yellowMat
        );
        trim.position.set(halfW * 0.48, (doorH + 0.2) * 0.5 + 0.2, dz);
        addEdges(trim, 0xb45309, 0.6);
        bldgGroup.add(trim);

        const canopy = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.12, doorW + 0.8),
          darkSteelMat
        );
        canopy.position.set(halfW * 0.48 + 0.8, doorH + 0.6, dz);
        addEdges(canopy, 0x0f172a, 0.7);
        bldgGroup.add(canopy);
      });

      const sign = createSignboardMesh(
        "HAZCHEM - อาคารจัดเก็บสารเคมีและวัตถุไวไฟ",
        "CHEMICAL & SOLVENT STORAGE WAREHOUSE",
        4.8,
        0.9,
        0xdc2626
      );
      sign.rotation.y = Math.PI / 2;
      sign.position.set(halfW * 0.49 + 0.08, 3.4, 0);
      bldgGroup.add(sign);

      // 4. North & South Gable End Walls (Triangular Tympanums)
      [-halfD * 0.48, halfD * 0.48].forEach(gz => {
        const tympanumShape = new THREE.Shape();
        tympanumShape.moveTo(-halfW * 0.48, eaveH);
        tympanumShape.lineTo(0, ridgeH);
        tympanumShape.lineTo(halfW * 0.48, eaveH);
        tympanumShape.closePath();

        const extrudeSettings = { depth: 0.14, bevelEnabled: false };
        const tympanumGeo = new THREE.ExtrudeGeometry(tympanumShape, extrudeSettings);
        const tympanum = new THREE.Mesh(tympanumGeo, wallMat);
        tympanum.position.set(0, 0, gz - 0.07);
        bldgGroup.add(tympanum);

        const louver = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 0.65, 0.2),
          darkSteelMat
        );
        louver.position.set(0, (eaveH + ridgeH) * 0.5 - 0.1, gz);
        addEdges(louver, 0x64748b, 0.6);
        bldgGroup.add(louver);
      });

      // 5. Sloped Gable Roof (Two sloping planes running North-South)
      const slopeW = Math.sqrt(Math.pow(halfW * 0.55, 2) + Math.pow(ridgeH - eaveH, 2)) + 0.4;
      const roofLen = r.d * 1.02;
      const slopeAngle = Math.atan2(ridgeH - eaveH, halfW * 0.5);

      const westSlope = new THREE.Mesh(
        new THREE.BoxGeometry(slopeW, 0.14, roofLen),
        roofMat
      );
      westSlope.position.set(-halfW * 0.26, (eaveH + ridgeH) * 0.5 + 0.06, 0);
      westSlope.rotation.z = slopeAngle;
      addEdges(westSlope, 0x1e293b, 0.65);
      bldgGroup.add(westSlope);

      const eastSlope = new THREE.Mesh(
        new THREE.BoxGeometry(slopeW, 0.14, roofLen),
        roofMat
      );
      eastSlope.position.set(halfW * 0.26, (eaveH + ridgeH) * 0.5 + 0.06, 0);
      eastSlope.rotation.z = -slopeAngle;
      addEdges(eastSlope, 0x1e293b, 0.65);
      bldgGroup.add(eastSlope);

      const ridgeCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.14, roofLen),
        darkSteelMat
      );
      ridgeCap.position.set(0, ridgeH + 0.08, 0);
      bldgGroup.add(ridgeCap);

      [-r.d * 0.32, 0, r.d * 0.32].forEach(vz => {
        const ventBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.36, 0.45, 12),
          darkSteelMat
        );
        ventBase.position.set(0, ridgeH + 0.3, vz);
        const ventBall = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 12, 10),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 })
        );
        ventBall.position.set(0, ridgeH + 0.55, vz);
        bldgGroup.add(ventBase, ventBall);
      });

      // 6. Chemical Drums & IBC Totes Inside
      const drumBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.2 });
      const drumGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35, metalness: 0.2 });
      const spillPalletMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
      const grateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

      [-r.d * 0.35, -r.d * 0.15, r.d * 0.05, r.d * 0.25].forEach((pz, pIdx) => {
        const palletX = -halfW * 0.28;
        const spPallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.4), spillPalletMat);
        spPallet.position.set(palletX, 0.3 + 0.11, pz);
        const grate = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 1.36), grateMat);
        grate.position.set(palletX, 0.3 + 0.24, pz);
        bldgGroup.add(spPallet, grate);

        [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([dx, dz], dIdx) => {
          const mat = (pIdx + dIdx) % 2 === 0 ? drumBlueMat : drumGreenMat;
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.92, 12), mat);
          drum.position.set(palletX + dx, 0.3 + 0.26 + 0.46, pz + dz);
          addEdges(drum, 0x0f172a, 0.4);
          bldgGroup.add(drum);

          const bung = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8),
            new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 })
          );
          bung.position.set(palletX + dx + 0.12, 0.3 + 0.26 + 0.93, pz + dz);
          bldgGroup.add(bung);
        });
      });

      const ibcTankMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85
      });
      const ibcCageMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true
      });

      [-r.d * 0.32, r.d * 0.32].forEach((iz) => {
        const ibcX = halfW * 0.15;
        const ibcBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 1.2), spillPalletMat);
        ibcBase.position.set(ibcX, 0.3 + 0.06, iz);
        const ibcBottle = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 1.05), ibcTankMat);
        ibcBottle.position.set(ibcX, 0.3 + 0.12 + 0.52, iz);
        const ibcCage = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.12, 1.12), ibcCageMat);
        ibcCage.position.set(ibcX, 0.3 + 0.12 + 0.52, iz);
        bldgGroup.add(ibcBase, ibcBottle, ibcCage);
      });

      const greenPipeMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
      const showerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), greenPipeMat);
      showerPipe.position.set(halfW * 0.32, 0.3 + 1.2, 0);
      const showerHead = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.12, 10), yellowMat);
      showerHead.position.set(halfW * 0.32, 0.3 + 2.38, 0.22);
      showerHead.rotation.x = Math.PI;
      const eyewashBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.14, 10), yellowMat);
      eyewashBowl.position.set(halfW * 0.32, 0.3 + 1.1, 0.18);
      bldgGroup.add(showerPipe, showerHead, eyewashBowl);
    }
  }

  return {
    buildChemicalWarehouse
  };
})();
