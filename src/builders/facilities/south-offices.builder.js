// ============================================================================
// Module: src/builders/facilities/south-offices.builder.js
// Procedural 3D Builder for Hall 1 South Office Suite.
// Models individual office rooms along the south wall of Hall 1:
// SW2 (MPN), Spare Parts, Data Entry SW, Production Office SW, QA SW, QA Lab.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facilities = window.Starflex3D.Builders.Facilities || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};

  function buildHall1SouthOffice(group, item, r, H, mats) {
    const roomH = Math.min(H, 3.5);
    const wallThick = 0.12;
    const roomGroup = new THREE.Group();
    group.add(roomGroup);

    // 1. Clean Epoxy Flooring
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
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

  window.Starflex3D.Builders.Facilities.buildHall1SouthOffice = buildHall1SouthOffice;
})();
