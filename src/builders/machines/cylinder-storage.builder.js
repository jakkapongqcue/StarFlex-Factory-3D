// ============================================================================
// Module: src/builders/machines/cylinder-storage.builder.js
// Procedural 3D Builder for Gravure Printing Cylinder Storage,
// Paper Core Pallets (แกนกระดาษ), and Corrugated Cardboard Box Pallets (กล่องกระดาษ).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.CylinderStorage = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createPalletMesh } = window.Starflex3D.Builders.Common || {};

  function createCylinderLabelTexture(cylinderCode, jobName) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 360);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 348);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 20px 'Prompt', 'Noto Sans Thai', sans-serif";
    ctx.fillText("บริษัท ยูเชง เพลท-เมคดิ้ง (ไทยแลนด์) จำกัด", 20, 36);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("Yun Cheng Plate-Making (Thailand) Co., Ltd.  Tel: 034-452167", 20, 56);

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 68);
    ctx.lineTo(500, 68);
    ctx.stroke();

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 76, 480, 160);

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

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 52px 'Caveat', 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("37600", 40, 305);
    ctx.font = "bold 44px 'Caveat', 'Comic Sans MS', cursive, sans-serif";
    ctx.fillText("A-Pro", 240, 305);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  /**
   * Procedural corrugated flat-box bundle edge texture showing densely
   * stacked brown corrugated sheets, yellow-tan flutes, and white labels.
   */
  function createCorrugatedBundleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#8a623b";
    ctx.fillRect(0, 0, 256, 384);

    // Alternating stacked flat corrugated carton layers
    const rows = 56;
    const rowH = 384 / rows;
    for (let i = 0; i < rows; i++) {
      const y = i * rowH;
      ctx.fillStyle = i % 2 === 0 ? "#9c7146" : "#78532f";
      ctx.fillRect(0, y, 256, rowH * 0.68);
      ctx.fillStyle = "#4b321b";
      ctx.fillRect(0, y + rowH * 0.68, 256, rowH * 0.32);

      // Subtle golden flute core flecks & vertical bundle notch shadows
      ctx.fillStyle = "#c49456";
      ctx.fillRect(8, y + 1, 18, rowH * 0.45);
      ctx.fillRect(230, y + 1, 18, rowH * 0.45);
    }

    // Center bundle seam shadow where folded box flaps meet
    ctx.fillStyle = "rgba(45, 25, 10, 0.35)";
    ctx.fillRect(126, 0, 4, 384);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }

  const yellowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
  const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

  function createBlueOrWoodPallet(w, d, useBlue) {
    if (!useBlue && typeof createPalletMesh === "function") {
      return createPalletMesh(w, d, 0.14, "wood");
    }
    const mat = new THREE.MeshStandardMaterial({
      color: useBlue ? 0x1d4ed8 : 0xc89d68,
      roughness: useBlue ? 0.55 : 0.85,
      metalness: 0.05
    });
    const pallet = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), mat);
    addEdges(pallet, useBlue ? 0x1e3a8a : 0x78350f, 0.5);
    return pallet;
  }

  /**
   * Builds one Paper Core Pallet (ภาพที่ 2):
   * mode: 'vertical' (standing hollow kraft tubes) | 'pyramid' (wrapped horizontal cores) | 'boxed' (sleeved cores + front carton)
   */
  function buildPaperCorePallet(mode, matsObj) {
    const { coreMat, darkBoreMat, strapMat, wrapMat, cartonMat } = matsObj;
    const pGrp = new THREE.Group();
    const palW = 1.35;
    const palD = 1.15;
    const palH = 0.14;

    const pallet = createBlueOrWoodPallet(palW, palD, mode !== "boxed");
    pallet.position.y = palH * 0.5;
    pallet.castShadow = true;
    pGrp.add(pallet);

    if (mode === "vertical") {
      const tubeR = 0.105;
      const tubeH = 1.52;
      const cols = 5;
      const rows = 4;
      const spacingX = 0.23;
      const spacingZ = 0.23;
      const tubeGeo = new THREE.CylinderGeometry(tubeR, tubeR, tubeH, 14);
      const boreGeo = new THREE.CylinderGeometry(tubeR * 0.72, tubeR * 0.72, 0.03, 12);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = (c - (cols - 1) * 0.5) * spacingX;
          const z = (r - (rows - 1) * 0.5) * spacingZ;
          const hJitter = ((c + r) % 2) * 0.04;
          const tube = new THREE.Mesh(tubeGeo, coreMat);
          tube.position.set(x, palH + (tubeH - hJitter) * 0.5, z);
          if (c === 0 || c === cols - 1 || r === rows - 1) tube.castShadow = true;
          pGrp.add(tube);

          const bore = new THREE.Mesh(boreGeo, darkBoreMat);
          bore.position.set(x, palH + tubeH - hJitter - 0.005, z);
          pGrp.add(bore);
        }
      }
      return pGrp;
    }

    if (mode === "pyramid") {
      // Horizontal hollow kraft cores stacked 4 - 3 - 2 - 1 along Z-axis + clear shrink film
      const coreR = 0.11;
      const coreLen = palD * 0.94;
      const coreGeo = new THREE.CylinderGeometry(coreR, coreR, coreLen, 14);
      const boreGeo = new THREE.CylinderGeometry(coreR * 0.72, coreR * 0.72, coreLen + 0.02, 12);
      const rowCounts = [4, 3, 2, 1];
      const rowHeightStep = coreR * 1.76;

      rowCounts.forEach((cnt, rIdx) => {
        const cy = palH + coreR + rIdx * rowHeightStep;
        for (let i = 0; i < cnt; i++) {
          const cx = (i - (cnt - 1) * 0.5) * (coreR * 2.08);
          const tube = new THREE.Mesh(coreGeo, coreMat);
          tube.rotation.x = Math.PI / 2;
          tube.position.set(cx, cy, 0);
          tube.castShadow = true;
          pGrp.add(tube);

          const bore = new THREE.Mesh(boreGeo, darkBoreMat);
          bore.rotation.x = Math.PI / 2;
          bore.position.set(cx, cy, 0);
          pGrp.add(bore);
        }
      });

      const wrapH = coreR * 2 + (rowCounts.length - 1) * rowHeightStep + 0.04;
      const wrapMesh = new THREE.Mesh(
        new THREE.BoxGeometry(palW * 0.82, wrapH, coreLen * 0.86),
        wrapMat
      );
      wrapMesh.position.set(0, palH + wrapH * 0.5, 0);
      pGrp.add(wrapMesh);
      return pGrp;
    }

    // mode === "boxed": sleeved pallet stack of horizontal hollow cores + open front core carton
    const sleeveH = 1.25;
    const coreR = 0.095;
    const coreLen = palD * 0.92;
    const coreGeo = new THREE.CylinderGeometry(coreR, coreR, coreLen, 12);
    const boreGeo = new THREE.CylinderGeometry(coreR * 0.72, coreR * 0.72, coreLen + 0.02, 10);

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cx = (c - 2) * (coreR * 2.15);
        const cy = palH + coreR + r * (coreR * 2.08);
        const tube = new THREE.Mesh(coreGeo, coreMat);
        tube.rotation.x = Math.PI / 2;
        tube.position.set(cx, cy, 0);
        pGrp.add(tube);

        if (r === 4 || c === 0 || c === 4 || r === 0) {
          const bore = new THREE.Mesh(boreGeo, darkBoreMat);
          bore.rotation.x = Math.PI / 2;
          bore.position.set(cx, cy, 0);
          pGrp.add(bore);
        }
      }
    }

    // Side cardboard retaining walls holding the stack cleanly
    [-palW * 0.44, palW * 0.44].forEach(sx => {
      const sideBoard = new THREE.Mesh(new THREE.BoxGeometry(0.05, sleeveH, coreLen * 0.92), cartonMat);
      sideBoard.position.set(sx, palH + sleeveH * 0.5, 0);
      addEdges(sideBoard, 0x5c3d21, 0.45);
      pGrp.add(sideBoard);
    });
    const wrapBand = new THREE.Mesh(new THREE.BoxGeometry(palW * 0.92, sleeveH * 0.72, coreLen * 0.75), wrapMat);
    wrapBand.position.set(0, palH + sleeveH * 0.45, 0);
    pGrp.add(wrapBand);

    // Small open front cardboard box with horizontal spare cores (Aptar-box detail from photo 2)
    const smallBox = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.46, 0.42), cartonMat);
    smallBox.position.set(0, 0.23, palD * 0.5 + 0.30);
    addEdges(smallBox, 0x5c3d21, 0.5);
    pGrp.add(smallBox);
    for (let k = 0; k < 2; k++) {
      const topCore = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.52, 12), coreMat);
      topCore.rotation.z = Math.PI / 2;
      topCore.position.set(0, 0.47, palD * 0.5 + 0.22 + k * 0.15);
      pGrp.add(topCore);
    }
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, coreLen * 0.95), strapMat);
    strap.position.set(0, palH + sleeveH * 0.9, 0);
    pGrp.add(strap);
    return pGrp;
  }

  /**
   * Builds one Corrugated Cardboard Box Stack Pallet (ภาพที่ 3):
   * Black plastic pallet + kraft slip sheet + tall stacked flat cartons + PP straps + white labels.
   */
  function buildCardboardBoxPallet(bundleH, matsObj) {
    const { blackPalletMat, slipSheetMat, bundleMat, strapMat, labelSlipMat } = matsObj;
    const bGrp = new THREE.Group();
    const palW = 1.44;
    const palD = 1.20;
    const palH = 0.16;

    // Dark black plastic pallet base
    const plasticPallet = new THREE.Mesh(new THREE.BoxGeometry(palW, palH, palD), blackPalletMat);
    plasticPallet.position.y = palH * 0.5;
    plasticPallet.castShadow = true;
    addEdges(plasticPallet, 0x0f172a, 0.65);
    bGrp.add(plasticPallet);

    // Kraft corrugated slip sheet pad atop black pallet
    const slip = new THREE.Mesh(new THREE.BoxGeometry(palW + 0.04, 0.025, palD + 0.04), slipSheetMat);
    slip.position.y = palH + 0.0125;
    bGrp.add(slip);

    // Tall strapped bundle of flat knocked-down corrugated boxes
    const stackW = palW * 0.92;
    const stackD = palD * 0.90;
    const stackMesh = new THREE.Mesh(new THREE.BoxGeometry(stackW, bundleH, stackD), bundleMat);
    stackMesh.position.y = palH + 0.025 + bundleH * 0.5;
    stackMesh.castShadow = true;
    stackMesh.receiveShadow = true;
    addEdges(stackMesh, 0x4b321b, 0.55);
    bGrp.add(stackMesh);

    // Vertical White PP Strapping Loops (left & right bands)
    [-stackW * 0.26, stackW * 0.26].forEach(sx => {
      const strapLoop = new THREE.Mesh(
        new THREE.BoxGeometry(0.032, bundleH + 0.02, stackD + 0.02),
        strapMat
      );
      strapLoop.position.set(sx, palH + 0.025 + bundleH * 0.5, 0);
      bGrp.add(strapLoop);
    });

    // White A4/A5 job spec slips taped to front (+Z) & side (+X) faces (staggered like photo 3)
    [
      { x: -stackW * 0.24, y: palH + bundleH * 0.84, z: stackD * 0.5 + 0.022 },
      { x: stackW * 0.22, y: palH + bundleH * 0.72, z: stackD * 0.5 + 0.022 },
      { x: -stackW * 0.20, y: palH + bundleH * 0.52, z: stackD * 0.5 + 0.022 }
    ].forEach(sp => {
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.17), labelSlipMat);
      sheet.position.set(sp.x, sp.y, sp.z);
      bGrp.add(sheet);
    });

    const sideSheet = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.16), labelSlipMat);
    sideSheet.rotation.y = Math.PI / 2;
    sideSheet.position.set(stackW * 0.5 + 0.022, palH + bundleH * 0.66, 0.12);
    bGrp.add(sideSheet);

    return bGrp;
  }

  function buildCylinderStorage(group, r, H, mats) {
    const halfW = r.w * 0.5;
    const halfD = r.d * 0.5;

    const kraftCardboardMat = new THREE.MeshStandardMaterial({
      color: 0xbfa074,
      roughness: 0.88,
      metalness: 0.04
    });
    const darkTapeMat = new THREE.MeshStandardMaterial({
      color: 0x8b653a,
      roughness: 0.7
    });
    const steelCoreMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.85
    });

    const labelTex1 = createCylinderLabelTexture("C128125-04", "A-Pro Fish & Meat Mix (FGF)");
    const labelTex2 = createCylinderLabelTexture("C142008-01", "Cat Food Katsu 8kg (Stand-up Pouch)");
    const labelMat1 = new THREE.MeshBasicMaterial({ map: labelTex1 });
    const labelMat2 = new THREE.MeshBasicMaterial({ map: labelTex2 });

    const cylGroup = new THREE.Group();
    group.add(cylGroup);

    // 1. Clean Concrete Floor Pad
    const floorPad = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.98, 0.04, r.d * 0.98),
      mats.slab
    );
    floorPad.position.y = 0.02;
    cylGroup.add(floorPad);

    // 2. DENSE CYLINDER ARRAYS CLUSTERED TOGETHER (ขยับ 2 กลุ่มฝั่งซ้ายมาวางชิด 2 กลุ่มฝั่งกลาง-ขวา)
    const cylRadius = 0.155;
    const cylH = 1.35;
    const pitchX = 0.34;
    const pitchZ = 0.34;

    const cylGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, cylH, 16);
    const coreTopGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 10);
    const rimGeo = new THREE.CylinderGeometry(cylRadius * 1.01, cylRadius * 1.01, 0.08, 16);
    const tapeGeo = new THREE.CylinderGeometry(cylRadius * 1.01, cylRadius * 1.01, 0.06, 16);
    const labelGeo = new THREE.PlaneGeometry(0.24, 0.30);

    // Clustered blocks on central-east side (x in [-4.4 .. +3.8]), freeing west wing for pallets
    const blockConfigs = [
      { startX: -4.25, startZ: -halfD * 0.58, cols: 11, rows: 4 }, // North-west-of-cluster block (44)
      { startX: -4.25, startZ:  halfD * 0.18, cols: 11, rows: 4 }, // South-west-of-cluster block (44)
      { startX: -0.15, startZ: -halfD * 0.58, cols: 12, rows: 4 }, // North-east-of-cluster block (48)
      { startX: -0.15, startZ:  halfD * 0.18, cols: 12, rows: 4 }  // South-east-of-cluster block (48)
    ];

    blockConfigs.forEach((cfg, bIdx) => {
      for (let c = 0; c < cfg.cols; c++) {
        for (let rIdx = 0; rIdx < cfg.rows; rIdx++) {
          const cx = cfg.startX + c * pitchX;
          const cz = cfg.startZ + rIdx * pitchZ;

          const cylBody = new THREE.Mesh(cylGeo, kraftCardboardMat);
          cylBody.position.set(cx, 0.04 + cylH * 0.5, cz);
          cylBody.castShadow = true;
          cylGroup.add(cylBody);

          const coreTop = new THREE.Mesh(coreTopGeo, steelCoreMat);
          coreTop.position.set(cx, 0.04 + cylH + 0.04, cz);
          cylGroup.add(coreTop);

          const topRim = new THREE.Mesh(rimGeo, darkTapeMat);
          topRim.position.set(cx, 0.04 + cylH - 0.04, cz);
          cylGroup.add(topRim);

          const botTape = new THREE.Mesh(tapeGeo, darkTapeMat);
          botTape.position.set(cx, 0.04 + 0.22, cz);
          cylGroup.add(botTape);

          const isFrontRow = rIdx === cfg.rows - 1;
          const isBackRow = rIdx === 0;
          if (isFrontRow || isBackRow || (c % 3 === 0)) {
            const labelMat = (bIdx + c + rIdx) % 2 === 0 ? labelMat1 : labelMat2;
            const labelPlane = new THREE.Mesh(labelGeo, labelMat);
            const labelZOffset = isBackRow ? -(cylRadius + 0.005) : (cylRadius + 0.005);
            labelPlane.position.set(cx, 0.04 + cylH * 0.65, cz + labelZOffset);
            if (isBackRow) labelPlane.rotation.y = Math.PI;
            cylGroup.add(labelPlane);
          }
        }
      }
    });

    // 3. Single East Cylinder Transport Trolley (คงเฉพาะรถเข็นฝั่งขวา เอาคันซ้ายและอ่างล้างสีดำออกตามกากบาท)
    const trolleyGroup = new THREE.Group();
    trolleyGroup.name = "CylinderTrolleyEast";
    trolleyGroup.position.set(halfW * 0.42, 0.04, 0);

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.8), yellowMat);
    chassis.position.y = 0.22;
    trolleyGroup.add(chassis);

    const vBlock = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.18, 0.6), darkSteelMat);
    vBlock.position.y = 0.38;
    trolleyGroup.add(vBlock);

    const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12);
    [[-0.65, -0.32], [0.65, -0.32], [-0.65, 0.32], [0.65, 0.32]].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, darkSteelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.1, wz);
      trolleyGroup.add(wheel);
    });

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.85, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
    );
    handle.position.set(0.8, 0.65, 0);
    trolleyGroup.add(handle);
    cylGroup.add(trolleyGroup);

    // 4. Paper Core Pallets (ภาพที่ 2: Pallet ใส่แกนกระดาษ) in freed NW bay
    const paperCoreGroup = new THREE.Group();
    paperCoreGroup.name = "PaperCorePallets";
    const coreMats = {
      coreMat: new THREE.MeshStandardMaterial({ color: 0xb68a52, roughness: 0.82 }),
      darkBoreMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }),
      strapMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }),
      cartonMat: new THREE.MeshStandardMaterial({ color: 0xc29b61, roughness: 0.85 }),
      wrapMat: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.2,
        transparent: true,
        opacity: 0.24
      })
    };

    [
      { x: -12.3, z: -4.1, mode: "vertical", rotY: 0.0 },
      { x:  -9.4, z: -4.1, mode: "vertical", rotY: 0.04 },
      { x: -12.3, z: -1.7, mode: "pyramid",  rotY: -0.02 },
      { x:  -9.4, z: -1.7, mode: "boxed",    rotY: 0.0 }
    ].forEach(cfg => {
      const pal = buildPaperCorePallet(cfg.mode, coreMats);
      pal.position.set(cfg.x, 0.04, cfg.z);
      pal.rotation.y = cfg.rotY;
      paperCoreGroup.add(pal);
    });
    cylGroup.add(paperCoreGroup);

    // 5. Cardboard Box Pallets (ภาพที่ 3: Pallet แผนกกล่องกระดาษ) paired in freed SW bay
    const boxPalletGroup = new THREE.Group();
    boxPalletGroup.name = "CardboardBoxPallets";
    const bundleTex = createCorrugatedBundleTexture();
    const cardboardMats = {
      blackPalletMat: new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.65, metalness: 0.1 }),
      slipSheetMat: new THREE.MeshStandardMaterial({ color: 0xd1b38a, roughness: 0.85 }),
      bundleMat: new THREE.MeshStandardMaterial({ map: bundleTex, roughness: 0.88 }),
      strapMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
      labelSlipMat: new THREE.MeshBasicMaterial({ color: 0xffffff })
    };

    [
      { x: -12.3, z: 1.8, h: 1.58, rotY: 0.01 },
      { x:  -9.4, z: 1.8, h: 1.44, rotY: -0.03 },
      { x: -12.3, z: 4.3, h: 1.62, rotY: -0.01 },
      { x:  -9.4, z: 4.3, h: 1.50, rotY: 0.02 }
    ].forEach(cfg => {
      const pal = buildCardboardBoxPallet(cfg.h, cardboardMats);
      pal.position.set(cfg.x, 0.04, cfg.z);
      pal.rotation.y = cfg.rotY;
      boxPalletGroup.add(pal);
    });
    cylGroup.add(boxPalletGroup);
  }

  return {
    buildCylinderStorage
  };
})();
