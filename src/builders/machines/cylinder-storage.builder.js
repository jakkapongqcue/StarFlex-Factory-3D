// ============================================================================
// Module: src/builders/machines/cylinder-storage.builder.js
// Procedural 3D Builder for Gravure Printing Cylinder Storage Area
// (คลังจัดเก็บลูกกลิ้งแม่พิมพ์กราเวียร์แนวตั้ง วางชิดกันหนาแน่น ไม่ใส่พาเลท ไม่มีเส้นเหลือง ไม่มีผนังกั้น)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.CylinderStorage = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.MachineCommon;

  /**
   * Create authentic Gravure Cylinder Spec Sheet / Delivery Card texture
   * exactly matching the user's uploaded reference photograph.
   */
  function createCylinderLabelTexture(cylinderCode, jobName) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    // White label background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 360);

    // Outer border
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 348);

    // Header company text
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 20px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("บริษัท ยูเชง เพลท-เมคดิ้ง (ไทยแลนด์) จำกัด", 20, 36);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Yun Cheng Plate-Making (Thailand) Co., Ltd.  Tel: 034-452167", 20, 56);

    // Separator line
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 68);
    ctx.lineTo(500, 68);
    ctx.stroke();

    // Data table box
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 76, 480, 160);

    // Grid lines inside table
    [116, 156, 196].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(496, y);
      ctx.stroke();
    });
    [140, 280, 380].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, 76);
      ctx.lineTo(x, 236);
      ctx.stroke();
    });

    // Table text
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("ลูกค้า:", 24, 102);
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("Star Flex Public Co., Ltd.", 148, 102);

    ctx.fillStyle = "#1e293b";
    ctx.font = "14px sans-serif";
    ctx.fillText("ชื่องาน:", 24, 142);
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(jobName || "A-Pro Fish & Meat Mix (Pouch)", 148, 142);

    ctx.font = "13px sans-serif";
    ctx.fillText("รหัสเพลท:", 24, 182);
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(cylinderCode || "C128125-04", 148, 182);
    ctx.font = "13px sans-serif";
    ctx.fillText("ไดมิเตอร์:", 290, 182);
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("229.24", 390, 182);

    ctx.font = "13px sans-serif";
    ctx.fillText("รอบพิมพ์:", 24, 222);
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("720 mm", 148, 222);
    ctx.font = "13px sans-serif";
    ctx.fillText("ความยาว:", 290, 222);
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("1,250 mm", 390, 222);

    // Hand-written marker text below label (like in photo: "37600 A-Pro")
    ctx.fillStyle = "#1e3a8a"; // Blue permanent marker
    ctx.font = "bold 52px 'Caveat', 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("37600", 40, 305);
    ctx.font = "bold 44px 'Caveat', 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("A-Pro", 240, 305);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  function buildCylinderStorage(group, r, H, mats) {
    const halfW = r.w * 0.5;
    const halfD = r.d * 0.5;

    // Materials
    const kraftCardboardMat = new THREE.MeshStandardMaterial({
      color: 0xbfa074, // Authentic Kraft paper brown
      roughness: 0.88,
      metalness: 0.04
    });
    const darkTapeMat = new THREE.MeshStandardMaterial({
      color: 0x8b653a, // Kraft packaging tape
      roughness: 0.7
    });
    const steelCoreMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Chrome / steel cylinder core
      roughness: 0.25,
      metalness: 0.85
    });
    const stainlessMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.28,
      metalness: 0.8
    });

    const labelTex1 = createCylinderLabelTexture("C128125-04", "A-Pro Fish & Meat Mix (FGF)");
    const labelTex2 = createCylinderLabelTexture("C142008-01", "Cat Food Katsu 8kg (Stand-up Pouch)");
    const labelMat1 = new THREE.MeshBasicMaterial({ map: labelTex1 });
    const labelMat2 = new THREE.MeshBasicMaterial({ map: labelTex2 });

    const cylGroup = new THREE.Group();
    group.add(cylGroup);

    // 1. Clean Concrete Floor Pad (No yellow lines, no dividing borders)
    const floorPad = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.04, r.d * 0.98),
      mats.slab
    );
    floorPad.position.y = 0.02;
    cylGroup.add(floorPad);

    // 2. DENSE CYLINDER ARRAYS (วางชิดกันติดๆ กันเป็นกลุ่ม ไม่ใส่พาเลท ตั้งตรงบนพื้นโรงงาน)
    const cylRadius = 0.155; // Diameter 31 cm
    const cylH = 1.35;       // Height 1.35m
    const pitchX = 0.34;     // Spacing: tightly touching side-by-side with 2.5cm clearance
    const pitchZ = 0.34;

    // 4 Large Dense Storage Blocks across East-West & North-South
    const blockConfigs = [
      { startX: -halfW * 0.78, startZ: -halfD * 0.58, cols: 11, rows: 4 }, // Northwest block (44 cylinders)
      { startX: -halfW * 0.78, startZ:  halfD * 0.18, cols: 11, rows: 4 }, // Southwest block (44 cylinders)
      { startX: -halfW * 0.08, startZ: -halfD * 0.58, cols: 12, rows: 4 }, // North-central block (48 cylinders)
      { startX: -halfW * 0.08, startZ:  halfD * 0.18, cols: 12, rows: 4 }  // South-central block (48 cylinders)
    ];

    blockConfigs.forEach((cfg, bIdx) => {
      for (let c = 0; c < cfg.cols; c++) {
        for (let rIdx = 0; rIdx < cfg.rows; rIdx++) {
          const cx = cfg.startX + c * pitchX;
          const cz = cfg.startZ + rIdx * pitchZ;

          // Main cylindrical kraft-cardboard body standing directly on floor (no pallet!)
          const cylBody = new THREE.Mesh(
            new THREE.CylinderGeometry(cylRadius, cylRadius, cylH, 16),
            kraftCardboardMat
          );
          cylBody.position.set(cx, 0.04 + cylH * 0.5, cz);
          cylBody.castShadow = true;
          cylGroup.add(cylBody);

          // Shiny chrome cylinder core sticking out of top center
          const coreTop = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.06, 0.12, 10),
            steelCoreMat
          );
          coreTop.position.set(cx, 0.04 + cylH + 0.04, cz);
          cylGroup.add(coreTop);

          // Top tape seal
          const topRim = new THREE.Mesh(
            new THREE.CylinderGeometry(cylRadius * 1.01, cylRadius * 1.01, 0.08, 16),
            darkTapeMat
          );
          topRim.position.set(cx, 0.04 + cylH - 0.04, cz);
          cylGroup.add(topRim);

          // Bottom tape seal
          const botTape = new THREE.Mesh(
            new THREE.CylinderGeometry(cylRadius * 1.01, cylRadius * 1.01, 0.06, 16),
            darkTapeMat
          );
          botTape.position.set(cx, 0.04 + 0.22, cz);
          cylGroup.add(botTape);

          // White Spec Sheet / Delivery Card label (attached to front-facing cylinders)
          const isFrontRow = rIdx === cfg.rows - 1;
          const isBackRow = rIdx === 0;
          if (isFrontRow || isBackRow || (c % 3 === 0)) {
            const labelMat = (bIdx + c + rIdx) % 2 === 0 ? labelMat1 : labelMat2;
            const labelPlane = new THREE.Mesh(
              new THREE.PlaneGeometry(0.24, 0.30),
              labelMat
            );
            const labelZOffset = isBackRow ? -(cylRadius + 0.005) : (cylRadius + 0.005);
            labelPlane.position.set(cx, 0.04 + cylH * 0.65, cz + labelZOffset);
            if (isBackRow) labelPlane.rotation.y = Math.PI;
            cylGroup.add(labelPlane);
          }
        }
      }
    });

    // 3. Cylinder Wash Basin & Ultrasonic Cleaning Station (at far East corner)
    const washX = halfW * 0.82;
    const washZ = -halfD * 0.2;
    const washBasin = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.85, 1.2),
      stainlessMat
    );
    washBasin.position.set(washX, 0.85 * 0.5 + 0.04, washZ);
    addEdges(washBasin, 0x475569, 0.7);
    cylGroup.add(washBasin);

    const washHood = new THREE.Mesh(
      new THREE.BoxGeometry(2.36, 0.6, 0.12),
      stainlessMat
    );
    washHood.position.set(washX, 0.85 + 0.3 + 0.04, washZ - 0.54);
    cylGroup.add(washHood);

    // 4. Cylinder Transport Trolleys (รถเข็นลูกกลิ้งแม่พิมพ์ 2 คัน)
    [-halfW * 0.42, halfW * 0.42].forEach((tx) => {
      const trolleyGroup = new THREE.Group();
      trolleyGroup.position.set(tx, 0.04, 0);

      // Chassis
      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.14, 0.8),
        yellowMat
      );
      chassis.position.y = 0.22;
      trolleyGroup.add(chassis);

      // Cradle V-block for cylinder
      const vBlock = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.18, 0.6),
        darkSteelMat
      );
      vBlock.position.y = 0.38;
      trolleyGroup.add(vBlock);

      // Wheels
      [[-0.65, -0.32], [0.65, -0.32], [-0.65, 0.32], [0.65, 0.32]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12),
          darkSteelMat
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.1, wz);
        trolleyGroup.add(wheel);
      });

      // Push handle
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.85, 0.7),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
      );
      handle.position.set(0.8, 0.65, 0);
      trolleyGroup.add(handle);

      cylGroup.add(trolleyGroup);
    });

    // 5. Signboard
    const sign = createSignboardMesh(
      5.2,
      0.9,
      "คลังจัดเก็บลูกกลิ้งแม่พิมพ์กราเวียร์ (CYLINDER STORAGE)",
      "GRAVURE PRINTING CYLINDERS STOCK",
      "#7c3aed",
      "#ffffff",
      "#a78bfa"
    );
    sign.position.set(0, 3.2, -halfD * 0.48);
    cylGroup.add(sign);
  }

  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
  const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

  return {
    buildCylinderStorage
  };
})();
