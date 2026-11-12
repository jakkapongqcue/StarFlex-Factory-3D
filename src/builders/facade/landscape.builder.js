// ============================================================================
// Module: src/builders/facade/landscape.builder.js
// Front Lawn, Curbs, Ornamental Shrubs & 3 Flagpoles (Thai & Corporate Flags)
// References: References/Front_View_3_Main_Office_Arch_Roof.jpg & Front_View_1
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Landscape = {
  build(fMats) {
    const { pt, rect } = window.Starflex3D.Coords;
    const group = new THREE.Group();
    group.name = "FacadeLandscape";

    // 1. Green Front Lawn (Polygon shape conforming to diagonal road / fence line)
    // Vertices:
    // NW: pt(140, 1150)
    // NE: pt(460, 1150)
    // SE: pt(460, 1530)
    // S-Diagonal to Sign Wall: pt(690, 1560)
    // SW-Corner: pt(140, 1780)
    const lawnPoly = [
      pt(140, 1150),
      pt(460, 1150),
      pt(460, 1530),
      pt(690, 1555),
      pt(140, 1775)
    ];

    const lawnShape = new THREE.Shape();
    lawnShape.moveTo(lawnPoly[0].x, -lawnPoly[0].z);
    for (let i = 1; i < lawnPoly.length; i++) {
      lawnShape.lineTo(lawnPoly[i].x, -lawnPoly[i].z);
    }
    lawnShape.closePath();

    const lawnGeo = new THREE.ShapeGeometry(lawnShape);
    const lawnMesh = new THREE.Mesh(lawnGeo, fMats.lawnGreen);
    lawnMesh.rotation.x = -Math.PI / 2;
    lawnMesh.position.y = -0.32;
    lawnMesh.receiveShadow = true;
    group.add(lawnMesh);

    // 2. Ornamental bushes and trees along the driveway and perimeter
    for (let py = 1170; py <= 1520; py += 35) {
      const bp = pt(460, py);
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.7), fMats.whiteTrim);
      curb.position.set(bp.x, 0.08, bp.z);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), fMats.hedgeGreen);
      bush.position.set(bp.x, 0.28, bp.z);
      group.add(curb, bush);
    }

    // Bushes along the rear lawn boundary (py: 1150)
    for (let px = 150; px < 460; px += 40) {
      const bp = pt(px, 1150);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), fMats.hedgeGreen);
      bush.position.set(bp.x, 0.25, bp.z);
      group.add(bush);
    }

    // Trees along the diagonal southwest front fence line (matching satellite foliage)
    for (let t = 0.08; t <= 0.92; t += 0.12) {
      const px = 140 + (690 - 140) * t;
      const py = 1775 + (1555 - 1775) * t;
      const tp = pt(px, py);
      // Offset slightly inward from fence line into lawn
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.2, 1.4, 7),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      );
      trunk.position.y = 0.7;
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 8, 8),
        fMats.hedgeGreen
      );
      foliage.position.y = 1.9;
      foliage.scale.set(1, 0.85, 1);
      treeGroup.add(trunk, foliage);
      treeGroup.position.set(tp.x + 1.2, -0.32, tp.z - 1.2);
      group.add(treeGroup);
    }

    // 3. Three Tall Flagpoles (Thai National Flag in center + 2 Corporate Flags)
    const flagPositions = [
      { px: 375, py: 1510, h: 11.5, type: "corp" },
      { px: 405, py: 1510, h: 12.8, type: "thai" },
      { px: 435, py: 1510, h: 11.5, type: "corp" }
    ];

    flagPositions.forEach(fp => {
      const p = pt(fp.px, fp.py);
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.11, fp.h, 8),
        fMats.whiteTrim
      );
      pole.position.set(p.x, fp.h * 0.5, p.z);
      pole.castShadow = true;
      group.add(pole);

      // Canvas Flag Cloth
      const flagCanvas = document.createElement("canvas");
      flagCanvas.width = 128;
      flagCanvas.height = 84;
      const fg = flagCanvas.getContext("2d");
      if (fp.type === "thai") {
        const stripes = ["#ef4444", "#ffffff", "#1e3a8a", "#1e3a8a", "#ffffff", "#ef4444"];
        stripes.forEach((col, i) => {
          fg.fillStyle = col;
          fg.fillRect(0, (i * 84) / 6, 128, 84 / 6 + 1);
        });
      } else {
        fg.fillStyle = "#ffffff";
        fg.fillRect(0, 0, 128, 84);
        fg.fillStyle = "#1d4ed8";
        fg.beginPath();
        fg.arc(64, 42, 20, 0, Math.PI * 2);
        fg.fill();
      }

      const flagTex = new THREE.CanvasTexture(flagCanvas);
      const flagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.35),
        new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide })
      );
      flagMesh.position.set(p.x + 1.1, fp.h - 0.8, p.z);
      group.add(flagMesh);
    });

    return group;
  }
};
