// ============================================================================
// Module: src/builders/facilities/restrooms-stairs.builder.js
// Procedural 3D Builder for Staircase to 2F & Restrooms (WC Mens/Ladies).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facilities = window.Starflex3D.Builders.Facilities || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};

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

  window.Starflex3D.Builders.Facilities.buildStairsAndRestrooms = buildStairsAndRestrooms;
})();
