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
    const whiteFloorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.05 });
    const yellowStripeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

    const walkGroup = new THREE.Group();
    group.add(walkGroup);

    // 1. Clean White Walkway Floor (ไม่มีเส้นสีแดง - sits directly on elevated floor +1.25m)
    const walkFloor = new THREE.Mesh(new THREE.BoxGeometry(floorW, 0.03, floorD), whiteFloorMat);
    walkFloor.position.y = 0.015;
    walkFloor.receiveShadow = true;
    walkGroup.add(walkFloor);

    // Yellow safety borders along East and West edges
    const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.032, floorD), yellowStripeMat);
    leftStripe.position.set(-floorW * 0.5 + 0.06, 0.016, 0);
    walkGroup.add(leftStripe);

    const rightStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.032, floorD), yellowStripeMat);
    rightStripe.position.set(floorW * 0.5 - 0.06, 0.016, 0);
    walkGroup.add(rightStripe);

    // 2. West Door: Entrance to Finished Goods / คลังสินค้าสำเร็จรูป
    const doorWestZ = -r.d * 0.38;
    const doorWestX = -floorW * 0.5;
    const doorWestGroup = new THREE.Group();
    doorWestGroup.position.set(doorWestX, 0, doorWestZ);

    const portalFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.2, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.3 })
    );
    portalFrame.position.y = 1.6;
    doorWestGroup.add(portalFrame);

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

      doorWestGroup.add(leaf);
    });

    const signWest = createSignboardMesh(
      2.5,
      0.55,
      "คลังสินค้าสำเร็จรูป",
      "FINISHED GOODS AREA",
      "#0369a1",
      "#ffffff",
      "#38bdf8"
    );
    signWest.position.set(0.12, 2.85, 0);
    signWest.rotation.y = Math.PI / 2;
    doorWestGroup.add(signWest);
    walkGroup.add(doorWestGroup);

    // ========================================================================
    // 4. ปลายทาง: ห้องสำหรับทำความสะอาดก่อนเข้าไลน์ผลิต (Air Shower & Hygiene Anteroom)
    //    พร้อม 2 ประตูเข้าสู่สายการผลิต (Door 1 & Door 2 into Production Line)
    // ========================================================================
    const hygW = floorW;
    const hygD = 6.8;
    const hygH = 3.3;
    const hygZ = -floorD * 0.5 + hygD * 0.5;

    const hygGroup = new THREE.Group();
    hygGroup.position.set(0, 0, hygZ);
    walkGroup.add(hygGroup);

    const cleanWallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const cleanFloorMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.25 });
    const stainlessMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.2 });
    const blueFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const greenFrameMat = new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.5, roughness: 0.3 });
    const visionGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.55
    });

    // 4A. Cleanroom Floor Slab (พื้นคลีนรูมสีฟ้าอ่อน ปลอดเชื้อ)
    const hygFloor = new THREE.Mesh(new THREE.BoxGeometry(hygW - 0.05, 0.04, hygD - 0.05), cleanFloorMat);
    hygFloor.position.y = 0.02;
    hygGroup.add(hygFloor);

    // 4B. Cleanroom Ceiling & Inset LED Panel Lights
    const hygCeiling = new THREE.Mesh(new THREE.BoxGeometry(hygW + 0.1, 0.18, hygD + 0.1), cleanWallMat);
    hygCeiling.position.y = hygH + 0.09;
    hygGroup.add(hygCeiling);

    [-hygW * 0.26, hygW * 0.26].forEach(lx => {
      [-hygD * 0.25, hygD * 0.25].forEach(lz => {
        const led = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        led.rotation.x = Math.PI / 2;
        led.position.set(lx, hygH - 0.01, lz);
        hygGroup.add(led);
      });
    });

    // 4C. Perimeter Cleanroom Walls (ผนังไอโซวอลล์คลีนรูมสีขาว)
    // East wall (+X) with vision observation window
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, hygD), cleanWallMat);
    eastWall.position.set(hygW * 0.5 - 0.07, hygH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.6);
    hygGroup.add(eastWall);

    const eastWin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 2.4), visionGlassMat);
    eastWin.position.set(hygW * 0.5 - 0.07, 1.8, 0);
    addEdges(eastWin, 0xffffff, 0.8);
    hygGroup.add(eastWin);

    // West wall (-X)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, hygD), cleanWallMat);
    westWall.position.set(-hygW * 0.5 + 0.07, hygH * 0.5, 0);
    addEdges(westWall, 0x94a3b8, 0.6);
    hygGroup.add(westWall);

    // 4D. South Entrance Wall (facing the white walkway, at +Z): Double Glass Door + Sign
    const southWallZ = hygD * 0.5 - 0.07;
    // Left & right wall pillars of South wall
    [-hygW * 0.38, hygW * 0.38].forEach(sx => {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(hygW * 0.24, hygH, 0.14), cleanWallMat);
      sp.position.set(sx, hygH * 0.5, southWallZ);
      addEdges(sp, 0x94a3b8, 0.5);
      hygGroup.add(sp);
    });
    // Header wall above South door
    const southTopWall = new THREE.Mesh(new THREE.BoxGeometry(hygW * 0.52, hygH - 2.5, 0.14), cleanWallMat);
    southTopWall.position.set(0, 2.5 + (hygH - 2.5) * 0.5, southWallZ);
    hygGroup.add(southTopWall);

    // South Entrance Double Glass Door into Cleaning Room
    const sDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.5, 0.16), blueFrameMat);
    sDoorFrame.position.set(0, 1.25, southWallZ);
    addEdges(sDoorFrame, 0x38bdf8, 0.7);
    hygGroup.add(sDoorFrame);

    [-0.52, 0.52].forEach(dx => {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.98, 2.38, 0.08), visionGlassMat);
      leaf.position.set(dx, 1.25, southWallZ);
      addEdges(leaf, 0xffffff, 0.9);
      const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), stainlessMat);
      pushBar.position.set(dx > 0 ? -0.38 : 0.38, 1.15, 0.06);
      leaf.add(pushBar);
      hygGroup.add(leaf);
    });

    // Illuminated Header Signboard for the Cleaning Room
    const roomSign = createSignboardMesh(
      3.4,
      0.58,
      "ห้องทำความสะอาดสุขอนามัย (Air Shower)",
      "HYGIENE & SANITIZATION ROOM",
      "#0284c7",
      "#ffffff",
      "#38bdf8"
    );
    roomSign.position.set(0, 2.85, southWallZ + 0.12);
    hygGroup.add(roomSign);

    // 4E. Interior Sanitizing & Cleaning Equipment (อุปกรณ์ทำความสะอาดภายใน)
    // 1) Air Shower Booth (ตู้เป่าลมแอร์ชาวเวอร์)
    const airShowerGroup = new THREE.Group();
    airShowerGroup.position.set(0, 0, 0.8);

    const asFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 1.6), stainlessMat);
    asFrameL.position.set(-1.0, 1.3, 0);
    const asFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.6, 1.6), stainlessMat);
    asFrameR.position.set(1.0, 1.3, 0);
    const asTop = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.35, 1.6), stainlessMat);
    asTop.position.set(0, 2.75, 0);
    airShowerGroup.add(asFrameL, asFrameR, asTop);

    // Circular air jet nozzles on side walls
    for (let nz = -0.55; nz <= 0.55; nz += 0.36) {
      for (let ny = 0.8; ny <= 2.2; ny += 0.45) {
        [-0.86, 0.86].forEach(nx => {
          const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 })
          );
          nozzle.rotation.z = Math.PI / 2;
          nozzle.position.set(nx, ny, nz);
          airShowerGroup.add(nozzle);
        });
      }
    }

    // Air Shower overhead sensor & status beacon
    const asBeacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.8 })
    );
    asBeacon.position.set(0, 3.0, 0);
    airShowerGroup.add(asBeacon);
    hygGroup.add(airShowerGroup);

    // 2) Automated Handwashing & Sanitizing Sink Counter (อ่างล้างมือฆ่าเชื้อสแตนเลส)
    const sinkCounter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 0.55), stainlessMat);
    sinkCounter.position.set(-hygW * 0.5 + 0.38, 0.425, -1.2);
    addEdges(sinkCounter, 0x64748b, 0.7);
    hygGroup.add(sinkCounter);

    // 2 Faucets & Dispensers
    [-0.45, 0.45].forEach(fx => {
      const faucet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.28, 8),
        stainlessMat
      );
      faucet.position.set(-hygW * 0.5 + 0.38 + fx, 0.95, -1.2);
      const dispenser = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.28, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      dispenser.position.set(-hygW * 0.5 + 0.15, 1.4, -1.2 + fx * 0.8);
      hygGroup.add(faucet, dispenser);
    });

    // 3) High-Speed Hand Dryers on East wall
    [-1.0, -1.6].forEach(dz => {
      const dryer = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.38, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      dryer.position.set(hygW * 0.5 - 0.18, 1.35, dz);
      addEdges(dryer, 0x94a3b8, 0.7);
      hygGroup.add(dryer);
    });

    // 4) Cleanroom Step-Over Stainless Bench (ม้านั่งสแตนเลสเปลี่ยนรองเท้า)
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 1.8), stainlessMat);
    bench.position.set(0, 0.225, -0.6);
    addEdges(bench, 0x475569, 0.6);
    hygGroup.add(bench);

    // 5) Blue Sticky Mats (แผ่นกาวดักฝุ่นก่อนถึงประตู)
    [-hygW * 0.26, hygW * 0.26].forEach(mx => {
      const stickyMat = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 })
      );
      stickyMat.rotation.x = -Math.PI / 2;
      stickyMat.position.set(mx, 0.045, -hygD * 0.5 + 1.2);
      hygGroup.add(stickyMat);
    });

    // ========================================================================
    // 4F. สองประตูเข้าสู่ LINE ผลิต (TWO DOORS ENTERING THE PRODUCTION LINE)
    // ========================================================================
    const northWallZ = -hygD * 0.5 + 0.07;

    // Center divider pillar between Door 1 and Door 2
    const centerPillar = new THREE.Mesh(new THREE.BoxGeometry(0.48, hygH, 0.14), cleanWallMat);
    centerPillar.position.set(0, hygH * 0.5, northWallZ);
    addEdges(centerPillar, 0x94a3b8, 0.6);
    hygGroup.add(centerPillar);

    // Outer edge pillars (left & right of doors)
    [-hygW * 0.5 + 0.18, hygW * 0.5 - 0.18].forEach(px => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.36, hygH, 0.14), cleanWallMat);
      pillar.position.set(px, hygH * 0.5, northWallZ);
      addEdges(pillar, 0x94a3b8, 0.6);
      hygGroup.add(pillar);
    });

    // Wall header above both North doors
    const northHeader = new THREE.Mesh(new THREE.BoxGeometry(hygW, hygH - 2.5, 0.14), cleanWallMat);
    northHeader.position.set(0, 2.5 + (hygH - 2.5) * 0.5, northWallZ);
    hygGroup.add(northHeader);

    // --- DOOR 1 (ประตูที่ 1 ฝั่งซ้าย: เข้าไลน์ผลิต Line 1) ---
    const door1X = -hygW * 0.26;
    const door1Frame = new THREE.Mesh(new THREE.BoxGeometry(1.68, 2.5, 0.16), blueFrameMat);
    door1Frame.position.set(door1X, 1.25, northWallZ);
    addEdges(door1Frame, 0x38bdf8, 0.8);
    hygGroup.add(door1Frame);

    const door1Leaf = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.38, 0.06), visionGlassMat);
    door1Leaf.position.set(door1X, 1.25, northWallZ);
    addEdges(door1Leaf, 0xffffff, 0.9);
    const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), stainlessMat);
    bar1.position.set(0.35, 1.15, 0.05);
    door1Leaf.add(bar1);
    hygGroup.add(door1Leaf);

    const signDoor1 = createSignboardMesh(
      1.75,
      0.48,
      "ประตู 1: เข้าสายการผลิต",
      "DOOR 1 · PRODUCTION LINE",
      "#0284c7",
      "#ffffff",
      "#38bdf8"
    );
    signDoor1.position.set(door1X, 2.78, northWallZ - 0.1);
    signDoor1.rotation.y = Math.PI; // Faces into line
    const signDoor1In = signDoor1.clone();
    signDoor1In.rotation.y = 0;
    signDoor1In.position.set(door1X, 2.78, northWallZ + 0.1);
    hygGroup.add(signDoor1, signDoor1In);

    const beacon1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.18, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.85 })
    );
    beacon1.position.set(door1X, 3.12, northWallZ);
    hygGroup.add(beacon1);

    // --- DOOR 2 (ประตูที่ 2 ฝั่งขวา: เข้าไลน์ผลิต Line 2) ---
    const door2X = hygW * 0.26;
    const door2Frame = new THREE.Mesh(new THREE.BoxGeometry(1.68, 2.5, 0.16), greenFrameMat);
    door2Frame.position.set(door2X, 1.25, northWallZ);
    addEdges(door2Frame, 0x34d399, 0.8);
    hygGroup.add(door2Frame);

    const door2Leaf = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.38, 0.06), visionGlassMat);
    door2Leaf.position.set(door2X, 1.25, northWallZ);
    addEdges(door2Leaf, 0xffffff, 0.9);
    const bar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), stainlessMat);
    bar2.position.set(-0.35, 1.15, 0.05);
    door2Leaf.add(bar2);
    hygGroup.add(door2Leaf);

    const signDoor2 = createSignboardMesh(
      1.75,
      0.48,
      "ประตู 2: เข้าสายการผลิต",
      "DOOR 2 · PRODUCTION LINE",
      "#059669",
      "#ffffff",
      "#6ee7b7"
    );
    signDoor2.position.set(door2X, 2.78, northWallZ - 0.1);
    signDoor2.rotation.y = Math.PI; // Faces into line
    const signDoor2In = signDoor2.clone();
    signDoor2In.rotation.y = 0;
    signDoor2In.position.set(door2X, 2.78, northWallZ + 0.1);
    hygGroup.add(signDoor2, signDoor2In);

    const beacon2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.18, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.85 })
    );
    beacon2.position.set(door2X, 3.12, northWallZ);
    hygGroup.add(beacon2);
  }

  // ========================================================================
  // Hall 1 South Office Suite Builder
  // Models individual rooms along the south wall of Hall 1:
  // SW2 (MPN), Spare Parts, Data Entry SW, Production Office SW, QA SW, QA Lab, Fire Exit
  // ========================================================================
  function buildHall1SouthOffice(group, item, r, H, mats) {
    const roomH = Math.min(H, 3.5);
    const wallThick = 0.12;
    const roomGroup = new THREE.Group();
    group.add(roomGroup);

    // 1. Clean Epoxy Flooring
    const floorMat = new THREE.MeshStandardMaterial({
      color: item.id === "off_h1_fire_exit" ? 0xef4444 : 0xe2e8f0,
      roughness: 0.35
    });
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.04, r.d * 0.98),
      floorMat
    );
    floor.position.y = 0.02;
    roomGroup.add(floor);

    // Wall Material
    const wallMat = mats.wallPartition || new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.55
    });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });

    // West Partition Wall
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, r.d * 0.98), wallMat);
    westWall.position.set(-r.w * 0.49 + wallThick * 0.5, roomH * 0.5, 0);
    addEdges(westWall, 0x94a3b8, 0.4);
    roomGroup.add(westWall);

    // East Partition Wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, r.d * 0.98), wallMat);
    eastWall.position.set(r.w * 0.49 - wallThick * 0.5, roomH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.4);
    roomGroup.add(eastWall);

    // North Wall facing the Hall 1 Production Line (-Z)
    // Front partition with vision glass window & door opening
    const northZ = -r.d * 0.49 + wallThick * 0.5;
    const doorW = 1.1;
    const doorH = 2.3;

    if (item.id === "off_h1_fire_exit") {
      // Emergency Exit: Double panic exit doors
      const exitDoor = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.85, 2.4, 0.08), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
      exitDoor.position.set(0, 1.2, northZ);
      addEdges(exitDoor, 0x991b1b, 0.8);
      roomGroup.add(exitDoor);

      const exitSign = createSignboardMesh(
        Math.min(r.w * 0.9, 1.8),
        0.38,
        "ทางหนีไฟ FIRE EXIT",
        "EMERGENCY EXIT",
        "#dc2626",
        "#ffffff",
        "#fca5a5"
      );
      exitSign.position.set(0, 2.7, northZ - 0.08);
      exitSign.rotation.y = Math.PI;
      roomGroup.add(exitSign);
    } else {
      // Standard Office Room: Solid base + Vision Glass Window + Entrance Door
      const baseWallH = 1.0;
      const glassH = 1.35;
      const topWallH = roomH - (baseWallH + glassH);

      // Door placed on the right side of the room front
      const remainingW = Math.max(0.6, r.w * 0.96 - doorW);
      const wallCenterX = -doorW * 0.5;

      // Base wall under window
      const baseWall = new THREE.Mesh(new THREE.BoxGeometry(remainingW, baseWallH, wallThick), wallMat);
      baseWall.position.set(wallCenterX, baseWallH * 0.5, northZ);
      addEdges(baseWall, 0x94a3b8, 0.4);
      roomGroup.add(baseWall);

      // Vision glass window
      const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(remainingW * 0.96, glassH, 0.04), glassMat);
      windowGlass.position.set(wallCenterX, baseWallH + glassH * 0.5, northZ);
      addEdges(windowGlass, 0x60a5fa, 0.6);
      roomGroup.add(windowGlass);

      // Top wall above window
      if (topWallH > 0.1) {
        const topWall = new THREE.Mesh(new THREE.BoxGeometry(remainingW, topWallH, wallThick), wallMat);
        topWall.position.set(wallCenterX, baseWallH + glassH + topWallH * 0.5, northZ);
        roomGroup.add(topWall);
      }

      // Entrance Door
      const doorX = r.w * 0.48 - doorW * 0.5;
      const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.92, doorH, 0.05), doorFrameMat);
      doorLeaf.position.set(doorX, doorH * 0.5, northZ);
      addEdges(doorLeaf, 0x64748b, 0.5);
      roomGroup.add(doorLeaf);

      // Door glass insert
      const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.45, doorH * 0.45, 0.06), glassMat);
      doorGlass.position.set(doorX, doorH * 0.62, northZ);
      roomGroup.add(doorGlass);

      // Lintel above door
      const doorLintelH = roomH - doorH;
      if (doorLintelH > 0.05) {
        const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorLintelH, wallThick), wallMat);
        doorLintel.position.set(doorX, doorH + doorLintelH * 0.5, northZ);
        roomGroup.add(doorLintel);
      }

      // Overhead Signboard facing Hall 1 Production Line
      const signW = Math.min(Math.max(r.w * 0.7, 1.8), 3.2);
      const signMesh = createSignboardMesh(
        signW,
        0.42,
        item.code,
        item.specs || item.name,
        "#1e293b",
        "#ffffff",
        "#38bdf8"
      );
      signMesh.position.set(0, Math.min(roomH - 0.25, 3.1), northZ - 0.08);
      signMesh.rotation.y = Math.PI; // Face outwards toward production hall
      roomGroup.add(signMesh);
    }
  }

  return {
    buildLockerRoom,
    buildStairsAndRestrooms,
    buildProductionWalkway,
    buildHall1SouthOffice
  };
})();
