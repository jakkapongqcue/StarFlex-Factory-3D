// ============================================================================
// Module: src/builders/north-yard/lpg-station.builder.js
// Procedural 3D Builder for Zone 13: สถานีถังก๊าซ LPG (LPG Bulk Tank Station).
// Features: 2 White bullet tanks, saddle supports, fire-water deluge pipe system,
// 3-sided reinforced fire blast wall, bollards and hazchem signboards.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.NorthYard = window.Starflex3D.Builders.NorthYard || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};
  const NYCommon = window.Starflex3D.Builders.NorthYard.Common;

  function buildLPGStation(group, r, H) {
    const { mats } = NYCommon;
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
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, r.d * 0.96), mats.wallMat);
    westWall.position.set(-halfW * 0.96, wallH * 0.5 + 0.3, 0);
    addEdges(westWall, 0x64748b, 0.6);

    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallH, r.d * 0.96), mats.wallMat);
    eastWall.position.set(halfW * 0.96, wallH * 0.5 + 0.3, 0);
    addEdges(eastWall, 0x64748b, 0.6);

    const northWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.96, wallH, wallThick), mats.wallMat);
    northWall.position.set(0, wallH * 0.5 + 0.3, -halfD * 0.96);
    addEdges(northWall, 0x64748b, 0.6);
    bldgGroup.add(westWall, eastWall, northWall);

    // South Safety Bollards along front
    for (let i = -4; i <= 4; i++) {
      const bx = (i / 4) * (halfW * 0.82);
      const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.0, 8), mats.curbMat);
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
        const saddle = new THREE.Mesh(new THREE.BoxGeometry(tankRadius * 1.7, 0.75, 0.45), mats.baseMat);
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
        mats.redSafetyMat
      );
      band.rotation.x = Math.PI / 2;
      band.position.set(tx, tankY, 0);
      bldgGroup.add(band);

      // Top Pressure Relief Valves & Manhole Dome
      const manhole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.35, 12), mats.stainlessMat);
      manhole.position.set(tx, tankY + tankRadius + 0.15, -0.4);
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8), mats.redSafetyMat);
      valve.position.set(tx, tankY + tankRadius + 0.25, 0.5);
      bldgGroup.add(manhole, valve);
    });

    // 4. Overhead Red Fire-Water Deluge Sprinkler Frame
    const delugeY = tankY + tankRadius + 0.85;
    const delugeTopBar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, r.w * 0.72, 8), mats.redSafetyMat);
    delugeTopBar.rotation.z = Math.PI / 2;
    delugeTopBar.position.set(0, delugeY, 0);
    bldgGroup.add(delugeTopBar);

    [-r.w * 0.22, r.w * 0.22].forEach(tx => {
      const delugeBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, cylLen + 1.4, 8), mats.redSafetyMat);
      delugeBranch.rotation.x = Math.PI / 2;
      delugeBranch.position.set(tx, delugeY, 0);
      bldgGroup.add(delugeBranch);
    });

    // 5. Signboard on North Blast Wall
    const sign = createSignboardMesh(
      5.4,
      0.85,
      "13 · สถานีถังก๊าซ LPG (ไวไฟอันตราย)",
      "LPG BULK STORAGE STATION - NO SMOKING",
      "#dc2626"
    );
    sign.position.set(0, wallH + 0.45, -halfD * 0.92);
    bldgGroup.add(sign);
  }

  window.Starflex3D.Builders.NorthYard.buildLPGStation = buildLPGStation;
})();
