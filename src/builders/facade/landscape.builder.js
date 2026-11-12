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

    // 1. Green Front Lawn (Exact shape conforming to user's green line annotation)
    // Vertices:
    // 1. (185, 1145) - West fence, leaving ~4.7m driveway north of it along Hall 1
    // 2. (590, 1175) - Runs east along driveway in front of Hall 1
    // 3. (670, 1340) - Diagonally steps down to clear the west side of Office HQ
    // 4. (1040, 1400) - Runs east in front of Office HQ & Porte-Cochere
    // 5. (1040, 1555) - Turns 90 degrees south to the front fence before the Gate
    // 6. (185, 1555) - Follows the front fence back to the west corner
    const lawnPoly = [
      pt(185, 1145),
      pt(590, 1175),
      pt(670, 1340),
      pt(1040, 1400),
      pt(1040, 1555),
      pt(185, 1555)
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

    // 2. Ornamental Curbs and Bushes along the green border boundary
    const borderPoints = [];
    function addSegPoints(pA, pB, count) {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        borderPoints.push(pt(pA[0] + (pB[0] - pA[0]) * t, pA[1] + (pB[1] - pA[1]) * t));
      }
    }
    addSegPoints([185, 1145], [590, 1175], 10);
    addSegPoints([590, 1175], [670, 1340], 5);
    addSegPoints([670, 1340], [1040, 1400], 10);
    addSegPoints([1040, 1400], [1040, 1555], 5);

    borderPoints.forEach(bp => {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.16, 0.7), fMats.whiteTrim);
      curb.position.set(bp.x, 0.08, bp.z);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), fMats.hedgeGreen);
      bush.position.set(bp.x, 0.28, bp.z);
      group.add(curb, bush);
    });

    // Landscaping shade trees inside the front lawn (matching circles in user's diagram)
    const gardenTrees = [
      pt(260, 1350),
      pt(360, 1450),
      pt(520, 1400),
      pt(620, 1440),
      pt(750, 1460),
      pt(830, 1500)
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
    // Located in front right of the lawn island behind the STARFLEX sign wall (matching user's orange flag drawing)
    const flagPositions = [
      { px: 870, py: 1515, h: 11.5, type: "corp" },
      { px: 910, py: 1505, h: 12.8, type: "thai" },
      { px: 950, py: 1515, h: 11.5, type: "corp" }
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
