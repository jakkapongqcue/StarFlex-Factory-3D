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
    // 4. ปลายทาง: ห้องสุขอนามัยก่อนเข้าไลน์ผลิต (Hygiene & Air Shower Anteroom)
    //    - ขนาดห้องกว้าง 10.0m ยาวไปทางตะวันออกเสมอกำแพงห้องเปลี่ยนชุด (East wall at px = 1156)
    //    - อ่างล้างมือรูปตัว L อยู่ทางขวามือ (East & South-East walls)
    //    - ประตู Air Shower ออกทางทิศตะวันตกเข้าสู่ไลน์ผลิต (ประตูขังคนเป่าลมไล่ฝุ่น)
    //    - ประตูธรรมดาออกทางทิศเหนือสู่โถงทางเดิน
    //    - ไม่ใส่ป้ายหน้าห้องตามความต้องการของผู้ใช้งาน
    // ========================================================================
    const hygW = 10.0; // Spans from Corridor 6 west edge (px: 1056) to Locker room east wall (px: 1156)
    const hygD = 8.0;  // Length along Z (py: 320..400)
    const hygH = 3.3;
    const hygZ = -floorD * 0.5 + hygD * 0.5;
    // Walkway center is px = 1079; room center is px = 1106 -> offset along X is +2.7m
    const hygGroup = new THREE.Group();
    hygGroup.position.set(2.7, 0, hygZ);
    walkGroup.add(hygGroup);

    const cleanWallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
    const cleanFloorMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.25 });
    const stainlessMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.2 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 });
    const blueFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const greenFrameMat = new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.5, roughness: 0.3 });
    const visionGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.55
    });

    // 4A. Cleanroom Floor Slab (พื้นคลีนรูมสีฟ้าอ่อน ปลอดเชื้อ กว้าง 10.0m x 8.0m)
    const hygFloor = new THREE.Mesh(new THREE.BoxGeometry(hygW - 0.05, 0.04, hygD - 0.05), cleanFloorMat);
    hygFloor.position.y = 0.02;
    hygGroup.add(hygFloor);

    // 4B. Cleanroom Ceiling & Inset LED Panel Lights
    const hygCeiling = new THREE.Mesh(new THREE.BoxGeometry(hygW + 0.1, 0.18, hygD + 0.1), cleanWallMat);
    hygCeiling.position.y = hygH + 0.09;
    hygGroup.add(hygCeiling);

    [-3.2, -1.0, 1.2, 3.4].forEach(lx => {
      [-2.4, 0.0, 2.4].forEach(lz => {
        const led = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        led.rotation.x = Math.PI / 2;
        led.position.set(lx, hygH - 0.01, lz);
        hygGroup.add(led);
      });
    });

    // 4C. Middle Structural Steel Columns along Corridor boundary (x = -0.4m, corresponding to px = 1102)
    const midColX = -0.4;
    [-hygD * 0.5, 0, hygD * 0.5].forEach(cz => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, hygH, 0.46),
        mats.steelColumn || new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 })
      );
      col.position.set(midColX, hygH * 0.5, cz);
      addEdges(col, 0x475569, 0.8);
      hygGroup.add(col);
    });

    // 4D. South Wall (+Z = +4.0m): Entrance from White Walkway (Corridor 6)
    // Walkway center is aligned at x = -2.7m; NO FRONT SIGNBOARD per user instruction
    const southWallZ = hygD * 0.5 - 0.07;
    const sDoorX = -2.7;
    const sDoorW = 2.0;
    const sDoorH = 2.4;

    // Wall left of entrance door (x: -5.0m .. -3.7m)
    const sWallLeftW = Math.max(0.1, (sDoorX - sDoorW * 0.5) - (-hygW * 0.5));
    const sWallLeft = new THREE.Mesh(new THREE.BoxGeometry(sWallLeftW, hygH, 0.14), cleanWallMat);
    sWallLeft.position.set(-hygW * 0.5 + sWallLeftW * 0.5, hygH * 0.5, southWallZ);
    addEdges(sWallLeft, 0x94a3b8, 0.5);
    hygGroup.add(sWallLeft);

    // Wall right of entrance door (x: -1.7m .. +5.0m, spans across middle column behind L-sink return)
    const sWallRightW = Math.max(0.1, (hygW * 0.5) - (sDoorX + sDoorW * 0.5));
    const sWallRight = new THREE.Mesh(new THREE.BoxGeometry(sWallRightW, hygH, 0.14), cleanWallMat);
    sWallRight.position.set(hygW * 0.5 - sWallRightW * 0.5, hygH * 0.5, southWallZ);
    addEdges(sWallRight, 0x94a3b8, 0.5);
    hygGroup.add(sWallRight);

    // Header wall above South door
    const sWallTop = new THREE.Mesh(new THREE.BoxGeometry(sDoorW, hygH - sDoorH, 0.14), cleanWallMat);
    sWallTop.position.set(sDoorX, sDoorH + (hygH - sDoorH) * 0.5, southWallZ);
    hygGroup.add(sWallTop);

    // South Entrance Double Glass Door (no sign above)
    const sDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(sDoorW, sDoorH, 0.16), blueFrameMat);
    sDoorFrame.position.set(sDoorX, sDoorH * 0.5, southWallZ);
    addEdges(sDoorFrame, 0x38bdf8, 0.7);
    hygGroup.add(sDoorFrame);

    [-sDoorW * 0.25, sDoorW * 0.25].forEach(dx => {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(sDoorW * 0.46, sDoorH - 0.08, 0.06), visionGlassMat);
      leaf.position.set(sDoorX + dx, sDoorH * 0.5, southWallZ);
      addEdges(leaf, 0xffffff, 0.9);
      const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), stainlessMat);
      pushBar.position.set(sDoorX + dx + (dx > 0 ? -0.32 : 0.32), 1.15, southWallZ + 0.05);
      hygGroup.add(leaf, pushBar);
    });

    // 4E. East Wall (+X = +5.0m): Flush with Locker Room East Wall (px = 1156)
    const eastWallX = hygW * 0.5 - 0.07;
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, hygD), cleanWallMat);
    eastWall.position.set(eastWallX, hygH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.6);
    hygGroup.add(eastWall);

    const eastWin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 2.6), visionGlassMat);
    eastWin.position.set(eastWallX, 1.9, -1.8);
    addEdges(eastWin, 0xffffff, 0.8);
    hygGroup.add(eastWin);

    // --- L-SHAPED SINK COUNTER ON THE RIGHT (East + South-East) ---
    // "ใหนห้องนั้นมีอ้างข้างมืออยู่ทางขวาเป็นรูปตัว L"
    const lSinkGroup = new THREE.Group();
    hygGroup.add(lSinkGroup);

    // Arm 1: Main Arm along East wall (+X)
    const arm1L = 5.2; // length along Z
    const arm1W = 0.68;
    const arm1Z = 0.6;  // spans from south wall to z = -2.0
    const arm1X = eastWallX - arm1W * 0.5 - 0.07;
    const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(arm1W, 0.85, arm1L), stainlessMat);
    arm1Mesh.position.set(arm1X, 0.425, arm1Z);
    addEdges(arm1Mesh, 0x64748b, 0.7);
    lSinkGroup.add(arm1Mesh);

    // Arm 2: Return Arm along South wall (+Z) forming the "L"
    const arm2L = 3.6; // length along X
    const arm2W = 0.68;
    const arm2Z = southWallZ - arm2W * 0.5 - 0.07;
    const arm2X = arm1X - arm1W * 0.5 - arm2L * 0.5;
    const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(arm2L, 0.85, arm2W), stainlessMat);
    arm2Mesh.position.set(arm2X, 0.425, arm2Z);
    addEdges(arm2Mesh, 0x64748b, 0.7);
    lSinkGroup.add(arm2Mesh);

    // Stainless splashbacks / mirrors along the L walls
    const splashEast = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.75, arm1L), visionGlassMat);
    splashEast.position.set(eastWallX - 0.09, 1.25, arm1Z);
    addEdges(splashEast, 0x38bdf8, 0.6);
    lSinkGroup.add(splashEast);

    const splashSouth = new THREE.Mesh(new THREE.BoxGeometry(arm2L + arm1W, 0.75, 0.04), visionGlassMat);
    splashSouth.position.set(arm2X + arm1W * 0.5, 1.25, southWallZ - 0.09);
    addEdges(splashSouth, 0x38bdf8, 0.6);
    lSinkGroup.add(splashSouth);

    // 4 Sinks + Faucets + Soap Dispensers on Arm 1 (East wall)
    [-1.8, -0.6, 0.6, 1.8].forEach(fz => {
      const basin = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.18, 0.58),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
      );
      basin.position.set(arm1X, 0.85, arm1Z + fz);
      lSinkGroup.add(basin);

      const faucetPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8), chromeMat);
      faucetPipe.position.set(arm1X + 0.2, 1.02, arm1Z + fz);
      const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.03), chromeMat);
      faucetSpout.position.set(arm1X + 0.13, 1.15, arm1Z + fz);
      lSinkGroup.add(faucetPipe, faucetSpout);

      const dispenser = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.24, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.2, roughness: 0.3 })
      );
      dispenser.position.set(eastWallX - 0.11, 1.35, arm1Z + fz);
      lSinkGroup.add(dispenser);
    });

    // 2 Sinks + Dispensers on Arm 2 (South wall return)
    [-0.9, 0.6].forEach(fx => {
      const basinS = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.18, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
      );
      basinS.position.set(arm2X + fx, 0.85, arm2Z);
      const faucetS = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8), chromeMat);
      faucetS.position.set(arm2X + fx, 1.02, arm2Z + 0.2);
      const dispenserS = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.24, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.2, roughness: 0.3 })
      );
      dispenserS.position.set(arm2X + fx, 1.35, southWallZ - 0.11);
      lSinkGroup.add(basinS, faucetS, dispenserS);
    });

    // High-speed automatic hand dryers on East wall north of sink
    [-2.4].forEach(dz => {
      const dryer = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.44, 0.32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      dryer.position.set(eastWallX - 0.15, 1.25, dz);
      addEdges(dryer, 0x94a3b8, 0.7);
      lSinkGroup.add(dryer);
    });

    // 4F. West Wall (-X = -5.0m): Air Shower Booth into Production Line
    // "มีประตูออกทางทิศตะวันตก (ประตูที่ขังคน แล้วมีพัดลมมาเป่า)"
    const westWallX = -hygW * 0.5 + 0.07;
    const asCenterZ = -0.6;
    const asW = 1.8;  // length along Z
    const asD = 1.8;  // depth along X (passes through West wall directly into Hall 2 production area)
    const asH = 2.65;

    // West wall sections around the Air Shower
    const wWallNorthL = Math.max(0.2, (asCenterZ - asW * 0.5) - (-hygD * 0.5));
    const wWallNorth = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, wWallNorthL), cleanWallMat);
    wWallNorth.position.set(westWallX, hygH * 0.5, -hygD * 0.5 + wWallNorthL * 0.5);
    addEdges(wWallNorth, 0x94a3b8, 0.6);
    hygGroup.add(wWallNorth);

    const wWallSouthL = Math.max(0.2, (hygD * 0.5) - (asCenterZ + asW * 0.5));
    const wWallSouth = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, wWallSouthL), cleanWallMat);
    wWallSouth.position.set(westWallX, hygH * 0.5, hygD * 0.5 - wWallSouthL * 0.5);
    addEdges(wWallSouth, 0x94a3b8, 0.6);
    hygGroup.add(wWallSouth);

    const wWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH - asH, asW), cleanWallMat);
    wWallTop.position.set(westWallX, asH + (hygH - asH) * 0.5, asCenterZ);
    hygGroup.add(wWallTop);

    // --- AIR SHOWER BOOTH CABIN ---
    const airShowerGroup = new THREE.Group();
    airShowerGroup.position.set(westWallX, 0, asCenterZ);
    hygGroup.add(airShowerGroup);

    // Stainless structural chamber walls
    [-asW * 0.45, asW * 0.45].forEach(sz => {
      const asSideWall = new THREE.Mesh(new THREE.BoxGeometry(asD, asH, 0.16), stainlessMat);
      asSideWall.position.set(0, asH * 0.5, sz);
      addEdges(asSideWall, 0x64748b, 0.8);
      airShowerGroup.add(asSideWall);

      // Jet nozzles array (16 high-velocity circular nozzles on each side, total 32 nozzles)
      for (let nx = -asD * 0.35; nx <= asD * 0.35; nx += 0.28) {
        for (let ny = 0.75; ny <= 2.2; ny += 0.45) {
          const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.06, 8),
            new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.1 })
          );
          nozzle.rotation.x = Math.PI / 2;
          nozzle.position.set(nx, ny, sz + (sz > 0 ? -0.09 : 0.09));
          airShowerGroup.add(nozzle);
        }
      }
    });

    // Air Shower Top HEPA Fan / Blower Casing ("มีพัดลมมาเป่า")
    const asBlowerTop = new THREE.Mesh(new THREE.BoxGeometry(asD + 0.1, 0.38, asW), stainlessMat);
    asBlowerTop.position.set(0, asH + 0.19, 0);
    addEdges(asBlowerTop, 0x475569, 0.8);
    airShowerGroup.add(asBlowerTop);

    // Fan circular intake grilles on top
    [-asD * 0.24, asD * 0.24].forEach(fx => {
      const fanGrille = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.06, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
      );
      fanGrille.position.set(fx, asH + 0.41, 0);
      airShowerGroup.add(fanGrille);
    });

    // Anti-dust sticky mat inside
    const asFloorMat = new THREE.Mesh(
      new THREE.PlaneGeometry(asD * 0.75, asW * 0.75),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 })
    );
    asFloorMat.rotation.x = -Math.PI / 2;
    asFloorMat.position.y = 0.035;
    airShowerGroup.add(asFloorMat);

    // Inner Door (East door, entering from hygiene room)
    const inDoorX = asD * 0.5;
    const inDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, asH, asW * 0.8), blueFrameMat);
    inDoorFrame.position.set(inDoorX, asH * 0.5, 0);
    addEdges(inDoorFrame, 0x38bdf8, 0.8);
    const inDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.04, asH - 0.15, asW * 0.72), visionGlassMat);
    inDoorLeaf.position.set(inDoorX, asH * 0.5, 0);
    addEdges(inDoorLeaf, 0xffffff, 0.9);
    airShowerGroup.add(inDoorFrame, inDoorLeaf);

    // Outer Door (West door, exiting directly into Hall 2 production line)
    // "มีประตูออกทางทิศตะวันตก (ประตูที่ขังคน แล้วมีพัดลมมาเป่า)"
    const outDoorX = -asD * 0.5;
    const outDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, asH, asW * 0.8), blueFrameMat);
    outDoorFrame.position.set(outDoorX, asH * 0.5, 0);
    addEdges(outDoorFrame, 0x38bdf8, 0.8);
    const outDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.04, asH - 0.15, asW * 0.72), visionGlassMat);
    outDoorLeaf.position.set(outDoorX, asH * 0.5, 0);
    addEdges(outDoorLeaf, 0xffffff, 0.9);
    airShowerGroup.add(outDoorFrame, outDoorLeaf);

    // Air Shower Status Beacon
    const asBeacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.22, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.9 })
    );
    asBeacon.position.set(inDoorX - 0.1, asH + 0.35, 0);
    airShowerGroup.add(asBeacon);

    // 4G. North Wall (-Z = -4.0m): Regular Exit Door ("และทิศเหนือ (ประตูธรรมดา)")
    const northWallZ = -hygD * 0.5 + 0.07;
    const nDoorX = 2.2; // In East bay, matching the blueprint arrow leading North to area 3
    const nDoorW = 1.7;
    const nDoorH = 2.4;

    // Wall sections around North Door
    const nWallLeftW = Math.max(0.2, (nDoorX - nDoorW * 0.5) - (-hygW * 0.5));
    const nWallLeft = new THREE.Mesh(new THREE.BoxGeometry(nWallLeftW, hygH, 0.14), cleanWallMat);
    nWallLeft.position.set(-hygW * 0.5 + nWallLeftW * 0.5, hygH * 0.5, northWallZ);
    addEdges(nWallLeft, 0x94a3b8, 0.6);
    hygGroup.add(nWallLeft);

    const nWallRightW = Math.max(0.2, (hygW * 0.5) - (nDoorX + nDoorW * 0.5));
    const nWallRight = new THREE.Mesh(new THREE.BoxGeometry(nWallRightW, hygH, 0.14), cleanWallMat);
    nWallRight.position.set(hygW * 0.5 - nWallRightW * 0.5, hygH * 0.5, northWallZ);
    addEdges(nWallRight, 0x94a3b8, 0.6);
    hygGroup.add(nWallRight);

    const nWallTop = new THREE.Mesh(new THREE.BoxGeometry(nDoorW, hygH - nDoorH, 0.14), cleanWallMat);
    nWallTop.position.set(nDoorX, nDoorH + (hygH - nDoorH) * 0.5, northWallZ);
    hygGroup.add(nWallTop);

    // Regular North Door Frame & Leaf (No exterior header sign)
    const nDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(nDoorW, nDoorH, 0.16), greenFrameMat);
    nDoorFrame.position.set(nDoorX, nDoorH * 0.5, northWallZ);
    addEdges(nDoorFrame, 0x34d399, 0.8);
    hygGroup.add(nDoorFrame);

    const nDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(nDoorW - 0.1, nDoorH - 0.08, 0.06), visionGlassMat);
    nDoorLeaf.position.set(nDoorX, nDoorH * 0.5, northWallZ);
    addEdges(nDoorLeaf, 0xffffff, 0.9);
    const nDoorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), stainlessMat);
    nDoorHandle.position.set(nDoorX + (nDoorW * 0.35), 1.15, northWallZ + 0.05);
    hygGroup.add(nDoorLeaf, nDoorHandle);

    // 4H. Cleanroom Step-Over Stainless Bench & Sticky Mats
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 2.2), stainlessMat);
    bench.position.set(-1.4, 0.225, 1.2);
    addEdges(bench, 0x475569, 0.6);
    hygGroup.add(bench);

    // Floor sticky mat in front of North exit door
    const nStickyMat = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 })
    );
    nStickyMat.rotation.x = -Math.PI / 2;
    nStickyMat.position.set(nDoorX, 0.035, northWallZ + 0.8);
    hygGroup.add(nStickyMat);
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
