// ============================================================================
// Module: src/builders/machines/facilities.builder.js
// Procedural 3D Builders for Employee Locker / Gowning Rooms (Yellow & Blue),
// Restrooms & Staircase blocks, and Production Safety Walkway Corridor.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Facilities = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.MachineCommon;

  function buildLockerRoom(group, r, H, mats, themeColor, title, subtitle) {
    const roomH = Math.min(H, 3.5);
    const wallThick = 0.14;
    const accentMat = new THREE.MeshStandardMaterial({
      color: themeColor,
      roughness: 0.35,
      metalness: 0.25
    });

    const roomGroup = new THREE.Group();
    group.add(roomGroup);

    // Clean floor slab (sits directly on elevated factory floor +1.25m)
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.04, r.d * 0.98),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 })
    );
    floor.position.y = 0.02;
    roomGroup.add(floor);

    // Wall Material
    const wallMat = mats.wallPartition || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });

    // Perimeter Walls:
    // East wall (+X, facing highbay racks)
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, r.d * 0.98), wallMat);
    eastWall.position.set(r.w * 0.49 - wallThick * 0.5, roomH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.5);
    roomGroup.add(eastWall);

    // North wall (-Z)
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, roomH, wallThick), wallMat);
    northWall.position.set(0, roomH * 0.5, -r.d * 0.49 + wallThick * 0.5);
    addEdges(northWall, 0x94a3b8, 0.5);
    roomGroup.add(northWall);

    // South wall (+Z)
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, roomH, wallThick), wallMat);
    southWall.position.set(0, roomH * 0.5, r.d * 0.49 - wallThick * 0.5);
    addEdges(southWall, 0x94a3b8, 0.5);
    roomGroup.add(southWall);

    // West wall (-X, corridor side) with central double door opening
    const doorOpeningW = 1.8;
    const doorOpeningH = 2.4;
    const sideWallLen = Math.max(0.5, (r.d * 0.98 - doorOpeningW) * 0.5);

    // West north segment
    const westNorth = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, sideWallLen), wallMat);
    westNorth.position.set(-r.w * 0.49 + wallThick * 0.5, roomH * 0.5, -(doorOpeningW * 0.5 + sideWallLen * 0.5));
    addEdges(westNorth, 0x94a3b8, 0.5);
    roomGroup.add(westNorth);

    // West south segment
    const westSouth = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, sideWallLen), wallMat);
    westSouth.position.set(-r.w * 0.49 + wallThick * 0.5, roomH * 0.5, doorOpeningW * 0.5 + sideWallLen * 0.5);
    addEdges(westSouth, 0x94a3b8, 0.5);
    roomGroup.add(westSouth);

    // Lintel above door
    const lintelH = roomH - doorOpeningH;
    if (lintelH > 0.05) {
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(wallThick, lintelH, doorOpeningW), wallMat);
      lintel.position.set(-r.w * 0.49 + wallThick * 0.5, doorOpeningH + lintelH * 0.5, 0);
      roomGroup.add(lintel);
    }

    // Door top frame
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, doorOpeningW), accentMat);
    frameTop.position.set(-r.w * 0.49 + wallThick * 0.5, doorOpeningH - 0.06, 0);
    roomGroup.add(frameTop);

    // Double swing cleanroom doors (slightly ajar so inside is visible)
    [-1, 1].forEach(side => {
      const doorLeaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, doorOpeningH * 0.96, (doorOpeningW * 0.5) * 0.94),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      // inspection window
      const win = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, 0.8, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.6 })
      );
      win.position.set(0, 0.2, 0);
      doorLeaf.add(win);
      // door handle
      const hdl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
      );
      hdl.position.set(0.04, -0.1, -side * 0.3);
      doorLeaf.add(hdl);

      doorLeaf.position.set(
        -r.w * 0.49 + 0.1,
        doorOpeningH * 0.48,
        side * (doorOpeningW * 0.25)
      );
      doorLeaf.rotation.y = side * 0.2;
      roomGroup.add(doorLeaf);
    });

    // Overhead Signboard mounted on west wall above door facing corridor
    const sign = createSignboardMesh(
      2.1,
      0.46,
      title,
      subtitle,
      themeColor === 0xf59e0b ? "#d97706" : "#1d4ed8",
      "#ffffff",
      "#ffffff"
    );
    sign.position.set(-r.w * 0.49 - 0.05, Math.min(roomH - 0.28, 2.75), 0);
    sign.rotation.y = -Math.PI / 2;
    roomGroup.add(sign);

    // Roof Header Ribbon Trim in themeColor
    const header = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.99, 0.22, r.d * 0.99), accentMat);
    header.position.y = roomH + 0.11;
    roomGroup.add(header);

    // Interior Rows (5 horizontal rows as shown in blueprint!)
    const numRows = 5;
    for (let i = 0; i < numRows; i++) {
      const zPos = -r.d * 0.36 + (r.d * 0.72 * i) / (numRows - 1);

      // Stainless steel changing bench in center
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(r.w * 0.38, 0.45, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.25 })
      );
      bench.position.set(-r.w * 0.06, 0.225, zPos);
      addEdges(bench, 0x475569, 0.4);
      roomGroup.add(bench);

      // Steel Locker Unit Bank on +X wall
      const locker = new THREE.Mesh(
        new THREE.BoxGeometry(r.w * 0.26, 2.1, 0.58),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.3 })
      );
      locker.position.set(r.w * 0.32, 1.05, zPos);
      roomGroup.add(locker);

      // Locker door panel with themeColor accent
      const doorPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 2.02, 0.54),
        accentMat
      );
      doorPanel.position.set(r.w * 0.32 - r.w * 0.13 - 0.015, 1.05, zPos);
      roomGroup.add(doorPanel);
    }

    // Step-over cleanroom demarcation bench (Z-Barrier) near entry
    const stepOver = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.4, doorOpeningW * 0.8),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    );
    stepOver.position.set(-r.w * 0.32, 0.2, 0);
    roomGroup.add(stepOver);
  }

  function buildStairsAndRestrooms(group, r, H, mats) {
    const roomH = Math.min(H, 3.6);
    const wallThick = 0.14;
    const wallMat = mats.wallPartition || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });

    const utilGroup = new THREE.Group();
    group.add(utilGroup);

    // Base floor (sits directly on elevated factory floor +1.25m)
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.04, r.d * 0.98),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    );
    floor.position.y = 0.02;
    utilGroup.add(floor);

    // Divider wall between Stairs and Restrooms (at z = 0)
    const divWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, roomH, wallThick), wallMat);
    divWall.position.set(0, roomH * 0.5, 0);
    addEdges(divWall, 0x94a3b8, 0.5);
    utilGroup.add(divWall);

    // East perimeter wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, r.d * 0.98), wallMat);
    eastWall.position.set(r.w * 0.49 - wallThick * 0.5, roomH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.5);
    utilGroup.add(eastWall);

    // North perimeter wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, roomH, wallThick), wallMat);
    northWall.position.set(0, roomH * 0.5, -r.d * 0.49 + wallThick * 0.5);
    addEdges(northWall, 0x94a3b8, 0.5);
    utilGroup.add(northWall);

    // --- STAIRCASE (z: -r.d*0.48 .. 0) ---
    const landingH = 2.8;
    const landing = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.6, 0.15, r.d * 0.18),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 })
    );
    landing.position.set(r.w * 0.15, landingH, -r.d * 0.38);
    utilGroup.add(landing);

    const numSteps = 12;
    const stepDepth = (r.d * 0.32) / numSteps;
    const stepHeight = landingH / numSteps;
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.4 });
    const nosingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    for (let s = 0; s < numSteps; s++) {
      const sy = (s + 0.5) * stepHeight;
      const sz = -r.d * 0.28 + s * stepDepth;
      const step = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.45, stepHeight * 0.95, stepDepth * 0.98), stepMat);
      step.position.set(-r.w * 0.05, sy, sz);
      utilGroup.add(step);

      const nose = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.45, 0.03, 0.04), nosingMat);
      nose.position.set(-r.w * 0.05, sy + stepHeight * 0.48, sz + stepDepth * 0.46);
      utilGroup.add(nose);
    }

    const railMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, Math.hypot(landingH, r.d * 0.32), 8),
      railMat
    );
    rail.position.set(-r.w * 0.28, landingH * 0.5 + 0.85, -r.d * 0.12);
    rail.rotation.x = Math.atan2(r.d * 0.32, landingH);
    utilGroup.add(rail);

    const stairSign = createSignboardMesh(1.6, 0.4, "ทางขึ้นลงบันได", "STAIRWAY TO 2F", "#0284c7", "#ffffff", "#38bdf8");
    stairSign.position.set(-r.w * 0.49 - 0.05, 2.4, -r.d * 0.22);
    stairSign.rotation.y = -Math.PI / 2;
    utilGroup.add(stairSign);

    // --- RESTROOMS (z: 0 .. +r.d*0.48) ---
    const southWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, roomH, wallThick), wallMat);
    southWall.position.set(0, roomH * 0.5, r.d * 0.49 - wallThick * 0.5);
    addEdges(southWall, 0x94a3b8, 0.5);
    utilGroup.add(southWall);

    const westRestroomWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, r.d * 0.48), wallMat);
    westRestroomWall.position.set(-r.w * 0.49 + wallThick * 0.5, roomH * 0.5, r.d * 0.24);
    utilGroup.add(westRestroomWall);

    const menSign = createSignboardMesh(0.9, 0.35, "🚹 ห้องน้ำชาย", "MENS WC", "#1d4ed8", "#ffffff", "#60a5fa");
    menSign.position.set(-r.w * 0.49 - 0.05, 2.1, r.d * 0.13);
    menSign.rotation.y = -Math.PI / 2;
    utilGroup.add(menSign);

    const womenSign = createSignboardMesh(0.9, 0.35, "🚺 ห้องน้ำหญิง", "LADIES WC", "#db2777", "#ffffff", "#f472b6");
    womenSign.position.set(-r.w * 0.49 - 0.05, 2.1, r.d * 0.35);
    womenSign.rotation.y = -Math.PI / 2;
    utilGroup.add(womenSign);
  }

  function buildProductionWalkway(group, r, H, mats) {
    const floorW = r.w * 0.96;
    const floorD = r.d * 0.99;
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.45 });
    const yellowStripeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const redPathMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const walkGroup = new THREE.Group();
    group.add(walkGroup);

    // Green walkway floor (sits directly on elevated factory floor +1.25m, flush with Loading Dock)
    const walkFloor = new THREE.Mesh(new THREE.BoxGeometry(floorW, 0.03, floorD), greenMat);
    walkFloor.position.y = 0.015;
    walkGroup.add(walkFloor);

    // Yellow safety borders along East and West edges
    const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.032, floorD), yellowStripeMat);
    leftStripe.position.set(-floorW * 0.5 + 0.06, 0.016, 0);
    walkGroup.add(leftStripe);

    const rightStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.032, floorD), yellowStripeMat);
    rightStripe.position.set(floorW * 0.5 - 0.06, 0.016, 0);
    walkGroup.add(rightStripe);

    // RED ARROW PATH (Exact path indicated by user!)
    // North intersection where path branches: z = -r.d * 0.38 (py ≈ 340)
    const splitZ = -r.d * 0.38;
    const pathWidth = 0.38;
    const pathThick = 0.036;

    // Main south straight red path: from south (z = +r.d * 0.46) up to splitZ
    const straightLen = (r.d * 0.46) - splitZ;
    const straightPath = new THREE.Mesh(
      new THREE.BoxGeometry(pathWidth, pathThick, straightLen),
      redPathMat
    );
    straightPath.position.set(0, 0.018, splitZ + straightLen * 0.5);
    walkGroup.add(straightPath);

    // Red chevron arrows pointing North along the walkway
    const numArrows = 6;
    for (let a = 0; a < numArrows; a++) {
      const az = splitZ + straightLen * 0.12 + (straightLen * 0.76 * a) / (numArrows - 1);
      const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.65, 3), redPathMat);
      arrowHead.rotation.x = -Math.PI / 2;
      arrowHead.position.set(0, 0.022, az);
      walkGroup.add(arrowHead);
    }

    // Branch 1 (West Arrow): Turns 90° West into Door 1 (Finished Goods Area)
    const branchWestLen = floorW * 0.5;
    const westBranch = new THREE.Mesh(
      new THREE.BoxGeometry(branchWestLen, pathThick, pathWidth),
      redPathMat
    );
    westBranch.position.set(-branchWestLen * 0.5, 0.018, splitZ);
    walkGroup.add(westBranch);

    const westArrow = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 3), redPathMat);
    westArrow.rotation.z = Math.PI / 2;
    westArrow.position.set(-branchWestLen * 0.85, 0.022, splitZ);
    walkGroup.add(westArrow);

    // Branch 2 (North Arrow): Continues straight North into Door 2 (Production Line)
    const northLen = Math.abs(-r.d * 0.48 - splitZ);
    const northBranch = new THREE.Mesh(
      new THREE.BoxGeometry(pathWidth, pathThick, northLen),
      redPathMat
    );
    northBranch.position.set(0, 0.018, splitZ - northLen * 0.5);
    walkGroup.add(northBranch);

    const northArrow = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.7, 3), redPathMat);
    northArrow.rotation.x = -Math.PI / 2;
    northArrow.position.set(0, 0.022, -r.d * 0.46);
    walkGroup.add(northArrow);

    // 6 Planter Pots (แนวต้นไม้ 6 กระถาง beside SW5 Office)
    const potMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.35 });

    for (let p = 0; p < 6; p++) {
      const potZ = 0.0 + (r.d * 0.22 * p) / 5;
      const potX = -floorW * 0.42;

      const pot = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.55), potMat);
      pot.position.set(potX, 0.3, potZ);
      walkGroup.add(pot);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.9, 8), stemMat);
      trunk.position.set(potX, 0.9, potZ);
      walkGroup.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), leafMat);
      crown.position.set(potX, 1.45, potZ);
      crown.scale.set(1.0, 1.3, 1.0);
      walkGroup.add(crown);
    }

    // DOOR 1 (WEST DOOR): Entrance to Finished Goods / คลังสินค้า
    const door1Z = splitZ;
    const door1X = -floorW * 0.5;
    const door1Group = new THREE.Group();
    door1Group.position.set(door1X, 0, door1Z);

    const portalFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.2, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 })
    );
    portalFrame.position.y = 1.6;
    door1Group.add(portalFrame);

    const doorMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.65 });
    [-0.6, 0.6].forEach(offsetZ => {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.4, 1.1), doorMat);
      leaf.position.set(0, 1.25, offsetZ);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.4), glassMat);
      glass.position.set(0, 0.25, 0);
      leaf.add(glass);

      const pushBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
      );
      pushBar.position.set(0.05, -0.15, 0);
      leaf.add(pushBar);

      door1Group.add(leaf);
    });

    const sign1 = createSignboardMesh(
      2.5,
      0.55,
      "คลังสินค้าสำเร็จรูป",
      "FINISHED GOODS AREA",
      "#0369a1",
      "#ffffff",
      "#38bdf8"
    );
    sign1.position.set(0.12, 2.85, 0);
    sign1.rotation.y = Math.PI / 2;
    door1Group.add(sign1);

    walkGroup.add(door1Group);

    // DOOR 2 (NORTH DOOR): Entrance to Production Line / สายการผลิต
    const door2Z = -r.d * 0.48;
    const door2Group = new THREE.Group();
    door2Group.position.set(0, 0, door2Z);

    const portalNorth = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 3.4, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.6, roughness: 0.3 })
    );
    portalNorth.position.y = 1.7;
    door2Group.add(portalNorth);

    const shutter = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2.6, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    shutter.position.y = 1.35;
    door2Group.add(shutter);

    const hazardMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.25), hazardMat);
    topStrip.position.y = 2.75;
    door2Group.add(topStrip);

    const sign2 = createSignboardMesh(
      2.9,
      0.58,
      "ทางเข้าสายการผลิต",
      "PRODUCTION LINE ENTRANCE",
      "#b91c1c",
      "#ffffff",
      "#fca5a5"
    );
    sign2.position.set(0, 3.1, 0.12);
    door2Group.add(sign2);

    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.2, 12),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.8 })
    );
    beacon.position.set(0, 3.5, 0);
    door2Group.add(beacon);

    walkGroup.add(door2Group);
  }

  return {
    buildLockerRoom,
    buildStairsAndRestrooms,
    buildProductionWalkway
  };
})();
