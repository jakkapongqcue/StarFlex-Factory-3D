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

    // 1. Green Front Lawn (Authentic Island Shape from Google Maps & User Annotation)
    // Runs from west fence (px: 185) along the south front fence to the main sign wall (px: 860)
    // Leaves driveway open north of py: 1260 in front of Hall 1, and curves gracefully toward Office HQ apron
    const lawnPoly = [
      pt(185, 1260),
      pt(460, 1260),
      pt(670, 1310),
      pt(780, 1360),
      pt(860, 1430),
      pt(860, 1545),
      pt(185, 1545)
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

    // 2. Ornamental Curbs and Bushes along the curving driveway border
    const borderPoints = [
      pt(185, 1260), pt(250, 1260), pt(320, 1260), pt(390, 1260), pt(460, 1260),
      pt(530, 1275), pt(600, 1290), pt(670, 1310), pt(730, 1335), pt(780, 1360),
      pt(820, 1395), pt(860, 1430), pt(860, 1490), pt(860, 1545)
    ];

    borderPoints.forEach(bp => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.7), fMats.whiteTrim);
      curb.position.set(bp.x, 0.08, bp.z);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), fMats.hedgeGreen);
      bush.position.set(bp.x, 0.28, bp.z);
      group.add(curb, bush);
    });

    // Landscaping shade trees inside the front lawn garden (matching Google Map satellite)
    const gardenTrees = [
      pt(260, 1400),
      pt(340, 1460),
      pt(480, 1380),
      pt(560, 1440),
      pt(680, 1420),
      pt(750, 1470)
    ];
    gardenTrees.forEach(tp => {
      const treeGroup = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.22, 1.6, 7),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      );
      trunk.position.y = 0.8;
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 8, 8),
        fMats.hedgeGreen
      );
      foliage.position.y = 2.2;
      foliage.scale.set(1, 0.88, 1);
      treeGroup.add(trunk, foliage);
      treeGroup.position.set(tp.x, -0.32, tp.z);
      group.add(treeGroup);
    });

    // 3. Three Tall Flagpoles (Thai National Flag in center + 2 Corporate Flags)
    const flagPositions = [
      { px: 430, py: 1510, h: 11.5, type: "corp" },
      { px: 460, py: 1510, h: 12.8, type: "thai" },
      { px: 490, py: 1510, h: 11.5, type: "corp" }
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
