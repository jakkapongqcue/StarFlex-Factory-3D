// ============================================================================
// Module: src/builders/facilities/locker-rooms.builder.js
// Procedural 3D Builder for Gowning / Locker Rooms (Blue & Yellow Zones).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facilities = window.Starflex3D.Builders.Facilities || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common;

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

  window.Starflex3D.Builders.Facilities.buildLockerRoom = buildLockerRoom;
})();
