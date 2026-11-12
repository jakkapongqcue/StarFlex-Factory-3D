// ============================================================================
// Module: src/builders/facilities/walkway.builder.js
// Procedural 3D Builder for Production Walkway & Finished Goods Access (WALK-PROD).
// Integrates with Hygiene Room (src/builders/facilities/hygiene.builder.js).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facilities = window.Starflex3D.Builders.Facilities || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};

  function buildProductionWalkway(group, r, H, mats) {
    const floorW = r.w * 0.96;
    const floorD = r.d * 0.99;
    const grayWalkMat = new THREE.MeshStandardMaterial({ color: 0x7e8b9b, roughness: 0.75, metalness: 0.06 });
    const yellowStripeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

    const walkGroup = new THREE.Group();
    group.add(walkGroup);

    // 1. Industrial Gray Walkway Floor (พื้นทางเดินเข้าสู่อาคารสีเทา - sits directly on elevated floor +1.25m)
    const walkFloor = new THREE.Mesh(new THREE.BoxGeometry(floorW, 0.03, floorD), grayWalkMat);
    walkFloor.position.y = 0.015;
    walkFloor.receiveShadow = true;
    addEdges(walkFloor, 0x475569, 0.75);
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

    // 3. ปลายทาง: ห้องสุขอนามัยก่อนเข้าไลน์ผลิต (Hygiene & Air Shower Anteroom)
    if (typeof window.Starflex3D.Builders.Facilities.buildHygieneRoom === "function") {
      window.Starflex3D.Builders.Facilities.buildHygieneRoom(walkGroup, floorD, mats);
    }
  }

  window.Starflex3D.Builders.Facilities.buildProductionWalkway = buildProductionWalkway;
})();
