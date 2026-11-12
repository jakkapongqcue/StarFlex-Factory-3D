// ============================================================================
// Module: src/builders/machines/printing.builder.js
// Procedural 3D Builder for High-Speed Rotogravure Printing Lines (CAIDA, BOBST, BEIREN, XINDA)
// and Ink Dispensing / Mixing Cleanroom Station.
// Faithfully models:
//   - 9-Color printing stations (Units 01..09) with streamlined metallic columns,
//     signature blue accent bands ("ใส่ลายสีฟ้า"), HMI digital touchscreens & station numbers
//   - INFEED: 100% unobstructed pure white raw film roll ("มีม้วน film สีขาวที่ infeed")
//     with solid DoubleSide ribbon web rising UP into overhead bridge, running across top, and feeding DOWN into Unit 01
//   - OUTFEED: 100% unobstructed vibrant pink film roll ("outfeed เป็นสีชมพู") immediately after Unit 09,
//     with printed pink web rising UP from Unit 09 and dropping DOWN into the pink roll (rear-mounted turret arm, no front obstruction)
//   - MASTER CONSOLE: Located at far right end, overlooking outfeed roll and the entire line
//   - PORTAL FRAME & BRIDGE: Full-length continuous overhead bridge with corner structural columns,
//     rooftop catwalk handrails, ladder, and Z-fighting-free 2nd-tier dryer tower
//   - INK MIXING ROOM (ห้องผสมหมึก): Panoramic cleanroom glass wall, 2 stainless mixing tanks with pneumatic
//     agitators, 20L color pails on mini pallet, formulation balance, Zahn viscosity cup, and lab bench
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Printing = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  // Helper to build 100% visible, orientation-proof film web ribbons
  function createWebRibbon(p1, p2, width, material) {
    const halfW = width * 0.5;
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      p1.x, p1.y, p1.z - halfW,
      p1.x, p1.y, p1.z + halfW,
      p2.x, p2.y, p2.z - halfW,

      p2.x, p2.y, p2.z - halfW,
      p1.x, p1.y, p1.z + halfW,
      p2.x, p2.y, p2.z + halfW
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    return new THREE.Mesh(geom, material);
  }

  const _cachedPanelTextures = {};
  function getUnitPanelTexture(unitNum) {
    if (_cachedPanelTextures[unitNum]) return _cachedPanelTextures[unitNum];
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Sleek metallic silver/light-gray body
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Beveled side highlights
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 6, canvas.height);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(canvas.width - 6, 0, 6, canvas.height);

    // Top section: Touchscreen HMI Bezel
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(12, 16, 104, 76);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(16, 20, 96, 68);

    // Live display metrics
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(22, 28, 48, 6);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(22, 40, 60, 7);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(22, 52, 74, 7);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 12px "Consolas", monospace';
    ctx.fillText("SF", 82, 42);

    // Middle Signature BLUE ACCENT BAND ("ใส่ลายสีฟ้า")
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 110, canvas.width, 76);
    // Cyan neon top/bottom highlight borders
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(0, 110, canvas.width, 4);
    ctx.fillRect(0, 182, canvas.width, 4);

    // Format unit as 2 digits: "01", "02", ... "09" (matching Starflex factory photo)
    const unitStr = String(unitNum).padStart(2, "0");
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 48px "Montserrat", "Segoe UI", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(unitStr, 64, 148);

    // Lower Push Button / Keypad Module
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(12, 206, 104, 76);

    const btnColors = ["#22c55e", "#ef4444", "#f59e0b", "#38bdf8", "#e2e8f0", "#94a3b8"];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = btnColors[r * 3 + c];
        ctx.beginPath();
        ctx.arc(28 + c * 36, 226 + r * 34, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bottom air ventilation slats
    ctx.fillStyle = "#64748b";
    for (let v = 0; v < 4; v++) {
      ctx.fillRect(24, 294 + v * 5, 80, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    _cachedPanelTextures[unitNum] = tex;
    return tex;
  }

  let _cachedMasterHMITexture = null;
  function getMasterHMITexture() {
    if (_cachedMasterHMITexture) return _cachedMasterHMITexture;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    // Header bar
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(12, 10, 488, 36);
    ctx.fillStyle = "#38bdf8";
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText("STARFLEX HIGH-SPEED ROTOGRAVURE · MASTER CONSOLE", 24, 34);

    // Left Screen: Web Tension & Oscilloscope Curve
    ctx.fillStyle = "#0369a1";
    ctx.fillRect(12, 54, 238, 140);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(22, 140);
    ctx.lineTo(60, 108);
    ctx.lineTo(110, 126);
    ctx.lineTo(160, 84);
    ctx.lineTo(220, 96);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 15px "Consolas", monospace';
    ctx.fillText("LINE SPEED: 380 m/min", 24, 172);

    // Right Screen: Register Control & Dryer Zones
    ctx.fillStyle = "#0f2e46";
    ctx.fillRect(262, 54, 238, 140);

    ctx.fillStyle = "#38bdf8";
    ctx.font = 'bold 13px "Consolas", monospace';
    ctx.fillText("COLOR REGISTER: ΔE < 0.6", 274, 82);
    ctx.fillText("DRYER TUNNEL: 75°C - 85°C", 274, 112);
    ctx.fillText("INFEED TENSION: 220 N", 274, 142);
    ctx.fillText("REEL TENSION: 195 N", 274, 172);

    // Online status bar
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(12, 204, 488, 42);
    ctx.fillStyle = "#0f172a";
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText("● SYSTEM ONLINE · 9 UNITS SYNCED · HIGH SPEED RUN", 24, 231);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedMasterHMITexture = tex;
    return tex;
  }

  let _cachedFasciaBrandTexture = null;
  function getFasciaBrandTexture() {
    if (_cachedFasciaBrandTexture) return _cachedFasciaBrandTexture;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "rgba(15, 23, 42, 0.0)";
    ctx.fillRect(0, 0, 512, 64);

    // Starflex Logo in Cyan/Blue
    ctx.fillStyle = "#0284c7";
    ctx.font = 'bold 34px "Montserrat", "Segoe UI", sans-serif';
    ctx.fillText("STARFLEX", 16, 44);

    // Subtitle in crisp white
    ctx.fillStyle = "#f8fafc";
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText("HIGH-SPEED GRAVURE", 195, 42);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedFasciaBrandTexture = tex;
    return tex;
  }

  function buildGravurePress(inner, L, W, H, mats, accentMat, lightAccentMat) {
    // High-tech PBR Materials
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.18 });
    const whiteConsoleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.08 });
    const blueAccentMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.25 });
    const darkBridgeMat = new THREE.MeshStandardMaterial({ color: 0x1e2532, roughness: 0.55, metalness: 0.25 });
    const darkBaseMat = mats.machineDark || new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.65 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.4 });
    const chromeMat = mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.12 });
    const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const ladderMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6, roughness: 0.35 });
    const skirtNavyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4, metalness: 0.25 });

    // Film Rolls Materials:
    const whiteInfeedFilmMat = mats.filmRollWhite || new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.22,
      metalness: 0.05
    });
    const pinkOutfeedFilmMat = new THREE.MeshStandardMaterial({
      color: 0xec4899, // Vibrant glossy printed packaging pink
      roughness: 0.20,
      metalness: 0.15
    });

    // Web Materials (DoubleSide, highly visible):
    const whiteInfeedWebMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const pinkOutfeedWebMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.25,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    // 1. Heavy Machine Foundation Base Plinth
    const baseH = 0.28;
    const baseW = L * 0.98;
    const baseD = W * 0.86;
    const base = new THREE.Mesh(new THREE.BoxGeometry(baseW, baseH, baseD), darkBaseMat);
    base.position.set(0, baseH * 0.5, 0);
    base.receiveShadow = true;
    addEdges(base, 0x0f172a, 0.7);
    inner.add(base);

    // Recessed cable tray / service trench along front edge
    const cableTray = new THREE.Mesh(new THREE.BoxGeometry(baseW * 0.96, 0.06, 0.14), darkMetalMat);
    cableTray.position.set(0, baseH + 0.03, baseD * 0.48);
    inner.add(cableTray);

    // Geometry layout positions
    const unitCenterZ = -W * 0.04;
    const bridgeY = H * 0.72;
    const infeedRollX = -baseW * 0.38;
    const printSpanStartX = -baseW * 0.28;
    const printSpanEndX = baseW * 0.18;
    const printSpan = printSpanEndX - printSpanStartX;
    const numUnits = 9; // Fixed exactly 9 printing stations
    const unitPitch = printSpan / numUnits;
    const unitW = unitPitch * 0.72;
    const unitH = H * 0.56;
    const unitD = W * 0.68;

    const outfeedRollX = printSpanEndX + 1.15;
    const consoleX = baseW * 0.38;

    // 2. Corner Structural Portal Columns (เฟรมเหล็กเสาหลัก 4 มุม ตามภาพร่างเส้นสีฟ้าของผู้ใช้)
    const colH = bridgeY - baseH;
    const colY = baseH + colH * 0.5;
    const cornerCols = [
      { x: -baseW * 0.48, z: unitCenterZ + unitD * 0.54 },
      { x: -baseW * 0.48, z: unitCenterZ - unitD * 0.54 },
      { x: baseW * 0.48, z: unitCenterZ + unitD * 0.54 },
      { x: baseW * 0.48, z: unitCenterZ - unitD * 0.54 }
    ];

    cornerCols.forEach(cc => {
      const pCol = new THREE.Mesh(new THREE.BoxGeometry(0.16, colH, 0.16), darkBridgeMat);
      pCol.position.set(cc.x, colY, cc.z);
      addEdges(pCol, 0x0284c7, 0.7);
      inner.add(pCol);

      // Top corner diagonal bracket / knee brace
      const braceSign = cc.x < 0 ? 1 : -1;
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.10), blueAccentMat);
      brace.position.set(cc.x + braceSign * 0.20, bridgeY - 0.12, cc.z);
      brace.rotation.z = braceSign * 0.45;
      inner.add(brace);
    });

    // 3. 9-Color Printing Unit Towers (ลดเป็น 9 สี: Units 01..09)
    for (let i = 0; i < numUnits; i++) {
      const ux = printSpanStartX + (i + 0.5) * unitPitch;
      const unitGroup = new THREE.Group();
      unitGroup.position.set(ux, 0, unitCenterZ);
      inner.add(unitGroup);

      // Main Vertical Column Body in Silver Metallic
      const colBody = new THREE.Mesh(new THREE.BoxGeometry(unitW, unitH, unitD), silverMat);
      colBody.position.y = baseH + unitH * 0.5;
      colBody.castShadow = true;
      addEdges(colBody, 0x94a3b8, 0.6);
      unitGroup.add(colBody);

      // Tapered / Beveled Lower Front Skirt in Deep Industrial Navy
      const skirtW = unitW * 0.94;
      const skirtH = 0.45;
      const skirtD = 0.16;
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(skirtW, skirtH, skirtD), skirtNavyMat);
      skirt.position.set(0, baseH + skirtH * 0.5, unitD * 0.5 + skirtD * 0.5);
      addEdges(skirt, 0x0284c7, 0.6);
      unitGroup.add(skirt);

      // Digital Touchscreen HMI Panel + Station Number Plate with BLUE STRIPE ("ใส่ลายสีฟ้า" 01..09)
      const panelTex = getUnitPanelTexture(i + 1);
      if (panelTex) {
        const panelMat = new THREE.MeshBasicMaterial({ map: panelTex });
        const panelMesh = new THREE.Mesh(new THREE.PlaneGeometry(unitW * 0.84, unitH * 0.68), panelMat);
        panelMesh.position.set(0, baseH + unitH * 0.56, unitD * 0.5 + 0.015);
        unitGroup.add(panelMesh);
      }

      // Top Signal Beacon Stack Light
      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 8), ledGreenMat);
      beacon.position.set(0, baseH + unitH + 0.09, unitD * 0.5 - 0.08);
      unitGroup.add(beacon);

      // Inking & Printing System in the inter-unit gap (between current and next unit)
      if (i < numUnits - 1) {
        const gapX = ux + unitPitch * 0.5;
        const gapGroup = new THREE.Group();
        gapGroup.position.set(gapX, 0, unitCenterZ);
        inner.add(gapGroup);

        // Stainless Ink Pan / Fountain Basin
        const inkPan = new THREE.Mesh(new THREE.BoxGeometry(unitPitch * 0.42, 0.22, unitD * 0.72), darkMetalMat);
        inkPan.position.y = baseH + 0.14;
        addEdges(inkPan, 0x475569, 0.5);
        gapGroup.add(inkPan);

        // Chrome Gravure Cylinder
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, unitD * 0.62, 16), chromeMat);
        cyl.rotation.x = Math.PI / 2;
        cyl.position.y = baseH + 0.38;
        addEdges(cyl, 0x94a3b8, 0.4);
        gapGroup.add(cyl);

        // Rubber Impression Roller
        const impRoll = new THREE.Mesh(
          new THREE.CylinderGeometry(0.20, 0.20, unitD * 0.58, 14),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
        );
        impRoll.rotation.x = Math.PI / 2;
        impRoll.position.y = baseH + 0.74;
        gapGroup.add(impRoll);

        // Web Guide Idler Roller
        const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, unitD * 0.58, 10), chromeMat);
        idler.rotation.x = Math.PI / 2;
        idler.position.set(0, baseH + unitH * 0.88, 0);
        gapGroup.add(idler);
      }
    }

    // 4. INFEED SECTION (Left End, "In"): ม้วนฟิล์มสีขาวเปิดโล่ง 100% ไม่มีเสาหน้ามาบดบัง
    const infeedRollR = 0.56;
    const infeedRollW = unitD * 0.70;
    const infeedRollY = baseH + 0.88;

    const infeedGroup = new THREE.Group();
    infeedGroup.position.set(infeedRollX, 0, unitCenterZ);
    inner.add(infeedGroup);

    // Rear-Mounted Turret Arm (-Z side only) -> ด้านหน้าโล่ง 100% ให้เห็นม้วนฟิล์มเต็มใบ
    const infeedArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.25, 0.18), darkMetalMat);
    infeedArm.position.set(-0.08, baseH + 0.62, -infeedRollW * 0.52);
    addEdges(infeedArm, 0x475569, 0.6);
    infeedGroup.add(infeedArm);

    const infeedHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16), chromeMat);
    infeedHub.rotation.x = Math.PI / 2;
    infeedHub.position.set(-0.08, infeedRollY, -infeedRollW * 0.52);
    infeedGroup.add(infeedHub);

    // Unprinted Pure WHITE Raw Film Roll ("มีม้วน film สีขาวที่ infeed")
    const infeedRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(infeedRollR, infeedRollR, infeedRollW, 28),
      whiteInfeedFilmMat
    );
    infeedRoll.rotation.x = Math.PI / 2;
    infeedRoll.position.set(-0.08, infeedRollY, 0);
    addEdges(infeedRoll, 0xcbd5e1, 0.6);
    infeedGroup.add(infeedRoll);

    // Front decorative spindle chuck
    const infeedFrontChuck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16), chromeMat);
    infeedFrontChuck.rotation.x = Math.PI / 2;
    infeedFrontChuck.position.set(-0.08, infeedRollY, infeedRollW * 0.51);
    infeedGroup.add(infeedFrontChuck);

    // 5. OUTFEED SECTION (Right End, "Out"): ม้วนสีชมพูอยู่ต่อจาก Unit 09 ทันที เปิดโล่ง 100% ไม่มีเสาหน้ามาบดบัง
    const pinkRollR = 0.56;
    const pinkRollW = unitD * 0.70;
    const pinkRollY = baseH + 0.88;

    const outfeedGroup = new THREE.Group();
    outfeedGroup.position.set(outfeedRollX, 0, unitCenterZ);
    inner.add(outfeedGroup);

    // Rear-Mounted Turret Arm (-Z side only) -> ด้านหน้าโล่ง 100% ไม่บดบังม้วนสีชมพู
    const outfeedArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.25, 0.18), darkMetalMat);
    outfeedArm.position.set(0.08, baseH + 0.62, -pinkRollW * 0.52);
    addEdges(outfeedArm, 0x475569, 0.6);
    outfeedGroup.add(outfeedArm);

    const outfeedHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16), chromeMat);
    outfeedHub.rotation.x = Math.PI / 2;
    outfeedHub.position.set(0.08, pinkRollY, -pinkRollW * 0.52);
    outfeedGroup.add(outfeedHub);

    // Finished Printed Glossy PINK Packaging Film Roll ("ส่วน out feet เป็นสีชมพู")
    const pinkRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(pinkRollR, pinkRollR, pinkRollW, 28),
      pinkOutfeedFilmMat
    );
    pinkRoll.rotation.x = Math.PI / 2;
    pinkRoll.position.set(0.08, pinkRollY, 0);
    addEdges(pinkRoll, 0xbe185d, 0.6);
    outfeedGroup.add(pinkRoll);

    // Front decorative spindle chuck
    const pinkFrontChuck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16), chromeMat);
    pinkFrontChuck.rotation.x = Math.PI / 2;
    pinkFrontChuck.position.set(0.08, pinkRollY, pinkRollW * 0.51);
    outfeedGroup.add(pinkFrontChuck);

    // 6. MASTER OPERATOR CONSOLE KIOSK (ย้ายมาอยู่ขวาสุด ถัดจากม้วน Outfeed สีชมพู)
    const consoleGroup = new THREE.Group();
    consoleGroup.position.set(consoleX, 0, unitCenterZ);
    inner.add(consoleGroup);

    const consoleW = 1.25;
    const consoleH = H * 0.78;
    const consoleD = unitD * 0.82;

    const consoleCol = new THREE.Mesh(new THREE.BoxGeometry(consoleW, consoleH, consoleD), whiteConsoleMat);
    consoleCol.position.set(0, baseH + consoleH * 0.5, 0);
    addEdges(consoleCol, 0x94a3b8, 0.6);
    consoleGroup.add(consoleCol);

    // Master HMI Dual Widescreen Display (Starflex blue telemetry)
    const masterHMITex = getMasterHMITexture();
    if (masterHMITex) {
      const hmiMat = new THREE.MeshBasicMaterial({ map: masterHMITex });
      const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(consoleW * 0.82, consoleW * 0.46), hmiMat);
      screen1.position.set(0, baseH + consoleH * 0.74, consoleD * 0.5 + 0.02);
      consoleGroup.add(screen1);

      const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(consoleW * 0.82, consoleW * 0.46), hmiMat);
      screen2.position.set(0, baseH + consoleH * 0.46, consoleD * 0.5 + 0.02);
      consoleGroup.add(screen2);
    }

    // Slanted Operator Desk Panel
    const deskPanel = new THREE.Mesh(
      new THREE.BoxGeometry(consoleW * 0.88, 0.24, 0.36),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 })
    );
    deskPanel.position.set(0, baseH + consoleH * 0.24, consoleD * 0.5 + 0.14);
    deskPanel.rotation.x = 0.35;
    addEdges(deskPanel, 0x0284c7, 0.6);
    consoleGroup.add(deskPanel);

    // Electrical Drive Cabinet Behind Kiosk
    const driveCab = new THREE.Mesh(new THREE.BoxGeometry(consoleW * 0.92, H * 0.75, 0.45), darkBridgeMat);
    driveCab.position.set(0, baseH + (H * 0.75) * 0.5, -consoleD * 0.5 - 0.24);
    addEdges(driveCab, 0x64748b, 0.6);
    consoleGroup.add(driveCab);

    // Catwalk Access Ladder at Far Right End
    const ladderX = baseW * 0.49;
    const ladderTopY = bridgeY + (H * 0.28) * 0.5 + 0.04;
    const ladderH = ladderTopY - baseH;
    const ladderW = 0.48;

    [-ladderW * 0.5, ladderW * 0.5].forEach(lz => {
      const stringer = new THREE.Mesh(new THREE.BoxGeometry(0.04, ladderH, 0.06), ladderMat);
      stringer.position.set(ladderX, baseH + ladderH * 0.5, unitCenterZ + lz);
      inner.add(stringer);
    });

    const numRungs = Math.floor(ladderH / 0.30);
    for (let r = 1; r <= numRungs; r++) {
      const rungY = baseH + r * (ladderH / (numRungs + 1));
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, ladderW, 8), ladderMat);
      rung.rotation.x = Math.PI / 2;
      rung.position.set(ladderX, rungY, unitCenterZ);
      inner.add(rung);
    }

    // =========================================================================
    // 7. CONTINUOUS FILM WEB PATH ("ม้วน film infeed ขึ้นไปข้างบน และ ลงมา ตอน outfeed")
    // DoubleSide mesh ribbons generating 100% visible, orientation-proof webs
    // =========================================================================
    const webW = unitD * 0.52;
    const overheadWebY = bridgeY - 0.20;
    const printCylWebY = baseH + 0.56;

    // Overhead Infeed Guide Rollers
    const infeedTopRoller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, webW + 0.10, 14), chromeMat);
    infeedTopRoller1.rotation.x = Math.PI / 2;
    infeedTopRoller1.position.set(infeedRollX + 0.50, overheadWebY, unitCenterZ);
    inner.add(infeedTopRoller1);

    const infeedTopRoller2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, webW + 0.10, 14), chromeMat);
    infeedTopRoller2.rotation.x = Math.PI / 2;
    infeedTopRoller2.position.set(printSpanStartX, overheadWebY, unitCenterZ);
    inner.add(infeedTopRoller2);

    // A1: White Film Web rises UP from roll to overhead roller 1 (ตามลูกศรสีแดงของผู้ใช้)
    const p0 = { x: infeedRollX - 0.08, y: infeedRollY + infeedRollR, z: unitCenterZ };
    const p1 = { x: infeedRollX + 0.50, y: overheadWebY, z: unitCenterZ };
    inner.add(createWebRibbon(p0, p1, webW, whiteInfeedWebMat));

    // A2: Horizontal White Web under bridge from roller 1 to roller 2
    const p2 = { x: printSpanStartX, y: overheadWebY, z: unitCenterZ };
    inner.add(createWebRibbon(p1, p2, webW, whiteInfeedWebMat));

    // A3: White Web drops DOWN into Unit 01 printing cylinder!
    const p3 = { x: printSpanStartX, y: printCylWebY, z: unitCenterZ };
    inner.add(createWebRibbon(p2, p3, webW, whiteInfeedWebMat));

    // B: Horizontal Printing Web across Units 01..09
    const midX = (printSpanStartX + printSpanEndX) * 0.5;
    const pMid = { x: midX, y: printCylWebY, z: unitCenterZ };
    const p4 = { x: printSpanEndX, y: printCylWebY, z: unitCenterZ };

    // Early units: white web
    inner.add(createWebRibbon(p3, pMid, webW, whiteInfeedWebMat));
    // Late units: printed pink web
    inner.add(createWebRibbon(pMid, p4, webW, pinkOutfeedWebMat));

    // C: Outfeed Web rises UP from Unit 09 and drops DOWN into the Pink Roll!
    const outfeedTopRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, webW + 0.10, 14), chromeMat);
    outfeedTopRoller.rotation.x = Math.PI / 2;
    outfeedTopRoller.position.set(outfeedRollX + 0.08, overheadWebY, unitCenterZ);
    inner.add(outfeedTopRoller);

    // C1: Printed Pink Web rises UP from Unit 09 exit to overhead roller
    const p5 = { x: outfeedRollX + 0.08, y: overheadWebY, z: unitCenterZ };
    inner.add(createWebRibbon(p4, p5, webW, pinkOutfeedWebMat));

    // C2: Printed Pink Web drops DOWN into the Pink Roll!
    const p6 = { x: outfeedRollX + 0.08, y: pinkRollY + pinkRollR, z: unitCenterZ };
    inner.add(createWebRibbon(p5, p6, webW, pinkOutfeedWebMat));

    // =========================================================================
    // 8. CONTINUOUS OVERHEAD DRYER BRIDGE (Dark Graphite with BLUE ACCENT)
    // Spans the full length of baseW matching the user's blue structural sketch
    // =========================================================================
    const bridgeL = baseW;
    const bridgeW = unitD * 1.15;
    const bridgeH = H * 0.28;

    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(0, bridgeY, unitCenterZ);
    inner.add(bridgeGroup);

    // Continuous Dark Graphite Modular Housing
    const bridgeBody = new THREE.Mesh(new THREE.BoxGeometry(bridgeL, bridgeH, bridgeW), darkBridgeMat);
    bridgeBody.castShadow = true;
    addEdges(bridgeBody, 0x475569, 0.6);
    bridgeGroup.add(bridgeBody);

    // Front Cantilever Nose
    const canopyNose = new THREE.Mesh(new THREE.BoxGeometry(bridgeL * 0.99, bridgeH * 0.85, 0.22), darkBridgeMat);
    canopyNose.position.set(0, -bridgeH * 0.05, bridgeW * 0.5 + 0.11);
    addEdges(canopyNose, 0x475569, 0.6);
    bridgeGroup.add(canopyNose);

    // Modular dryer chamber seams & ventilation louvers for the 9 units along front face
    for (let u = 0; u < numUnits; u++) {
      const chamberX = printSpanStartX + (u + 0.5) * unitPitch;
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(unitPitch * 0.65, bridgeH * 0.22, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
      );
      louver.position.set(chamberX, 0, bridgeW * 0.5 + 0.23);
      bridgeGroup.add(louver);
    }

    // Brand Label on Front Cantilever Nose in Blue & White
    const fasciaBrandTex = getFasciaBrandTexture();
    if (fasciaBrandTex) {
      const brandMat = new THREE.MeshBasicMaterial({ map: fasciaBrandTex, transparent: true });
      const brandMesh = new THREE.Mesh(new THREE.PlaneGeometry(Math.min(4.8, bridgeL * 0.35), 0.58), brandMat);
      brandMesh.position.set(printSpanStartX + printSpan * 0.45, -bridgeH * 0.05, bridgeW * 0.5 + 0.24);
      bridgeGroup.add(brandMesh);
    }

    // Signature Continuous BLUE ACCENT BAND along top perimeter edge ("ใส่ลายสีฟ้า")
    const blueBandH = 0.12;
    const blueBand = new THREE.Mesh(
      new THREE.BoxGeometry(bridgeL * 1.002, blueBandH, bridgeW + 0.48),
      blueAccentMat
    );
    blueBand.position.set(0, bridgeH * 0.5 - blueBandH * 0.5 - 0.01, 0.12);
    addEdges(blueBand, 0x0284c7, 0.8);
    bridgeGroup.add(blueBand);

    // Upper Tinted Glass Observation / Dryer Windows along front face
    const winCount = numUnits + 2;
    const winSpan = bridgeL * 0.88;
    for (let w = 0; w < winCount; w++) {
      const wx = -winSpan * 0.5 + (w + 0.5) * (winSpan / winCount);
      const win = new THREE.Mesh(
        new THREE.BoxGeometry((winSpan / winCount) * 0.82, bridgeH * 0.48, 0.04),
        new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          transparent: true,
          opacity: 0.65,
          roughness: 0.2,
          metalness: 0.5
        })
      );
      win.position.set(wx, 0.02, bridgeW * 0.5 + 0.23);
      addEdges(win, 0x38bdf8, 0.5);
      bridgeGroup.add(win);
    }

    // =========================================================================
    // 9. RAISED 2ND-TIER EXTENDED DRYER TOWER (ZERO Z-FIGHTING / NO FLICKERING!)
    // แก้ไขกระพริบที่เครื่องจักร printing: ยกฝาครอบสีฟ้าขึ้นอย่างอิสระ ปราศจากพื้นผิวทับซ้อน
    // =========================================================================
    const towerW = Math.min(3.0, bridgeL * 0.20);
    const towerH = 0.70;
    const towerD = bridgeW * 0.85;
    const towerX = printSpanEndX - towerW * 0.35;
    const towerBottomY = bridgeH * 0.5 + 0.05;
    const towerY = towerBottomY + towerH * 0.5;

    const towerBody = new THREE.Mesh(new THREE.BoxGeometry(towerW, towerH, towerD), darkBridgeMat);
    towerBody.position.set(towerX, towerY, 0.12);
    addEdges(towerBody, 0x475569, 0.6);
    bridgeGroup.add(towerBody);

    // ฝาครอบหลังคาด้านบนสีฟ้าชิ้นเดี่ยว ยกขึ้นเหนือตัวกล่อง 5mm ไร้ Z-fighting 100%
    const capH = 0.06;
    const towerCap = new THREE.Mesh(new THREE.BoxGeometry(towerW + 0.06, capH, towerD + 0.06), blueAccentMat);
    towerCap.position.set(towerX, towerBottomY + towerH + capH * 0.5 + 0.005, 0.12);
    addEdges(towerCap, 0x0284c7, 0.8);
    bridgeGroup.add(towerCap);

    // Vertical guide rollers inside tower
    [-towerW * 0.25, 0, towerW * 0.25].forEach(rx => {
      const tRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, towerD * 0.75, 10), chromeMat);
      tRoller.rotation.x = Math.PI / 2;
      tRoller.position.set(towerX + rx, towerY, 0.12);
      bridgeGroup.add(tRoller);
    });

    // 10. Top Catwalk Safety Handrails (Full length along top roof of machine)
    const roofY = bridgeH * 0.5;
    const railH = 0.65;
    const railPerimL = bridgeL * 0.98;
    const railPerimW = bridgeW + 0.38;

    // Catwalk non-slip floor deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(railPerimL, 0.04, railPerimW), darkMetalMat);
    deck.position.set(0, roofY + 0.02, 0.12);
    bridgeGroup.add(deck);

    // Vertical Posts along front and rear roof edges
    const postSpacing = 1.6;
    const numPostsX = Math.floor(railPerimL / postSpacing);
    [-railPerimW * 0.5, railPerimW * 0.5].forEach(pz => {
      for (let pi = 0; pi <= numPostsX; pi++) {
        const px = -railPerimL * 0.5 + (pi * railPerimL) / numPostsX;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, railH, 8), darkMetalMat);
        post.position.set(px, roofY + railH * 0.5 + 0.04, 0.12 + pz);
        bridgeGroup.add(post);
      }

      // Top horizontal handrail with BLUE accent
      const topRail = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, railPerimL, 8), blueAccentMat);
      topRail.rotation.z = Math.PI / 2;
      topRail.position.set(0, roofY + railH + 0.04, 0.12 + pz);
      bridgeGroup.add(topRail);

      // Mid horizontal knee rail
      const midRail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, railPerimL, 8), darkMetalMat);
      midRail.rotation.z = Math.PI / 2;
      midRail.position.set(0, roofY + railH * 0.5 + 0.04, 0.12 + pz);
      bridgeGroup.add(midRail);
    });

    // End handrails on Left and Right sides
    [-railPerimL * 0.5, railPerimL * 0.5].forEach(px => {
      const endTopRail = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, railPerimW, 8), blueAccentMat);
      endTopRail.rotation.x = Math.PI / 2;
      endTopRail.position.set(px, roofY + railH + 0.04, 0.12);
      bridgeGroup.add(endTopRail);
    });

    // Top Exhaust Air Duct Stacks
    [-bridgeL * 0.28, 0, bridgeL * 0.28].forEach(dx => {
      const stack = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.55, 12),
        chromeMat
      );
      stack.position.set(dx, roofY + 0.32, -bridgeW * 0.22);
      addEdges(stack, 0x64748b, 0.5);
      bridgeGroup.add(stack);
    });
  }

  // =========================================================================
  // Ink Dispenser Station & Ink Mixing Cleanroom Builder
  // แก้ไขห้องผสมหมึก:
  //   - West Side: 2 parallel rows of 5 blue 200L ink drums (10 drums total)
  //   - East Side: "Ink Mixing Room" (ห้องผสมหมึก)
  //     * ถอดป้ายชื่อสีฟ้าและเครื่องหมุนกระบอกออกทั้งหมด
  //     * ผนังด้านหน้ากระจกคลีนรูมบานกว้าง มองเห็นอุปกรณ์และกระบวนการภายในชัดเจน
  //     * ติดตั้งถังกวนผสมสแตนเลส 2 ถัง พร้อมมอเตอร์กวนลมและใบพัดสแตนเลส (Pneumatic Agitators)
  //     * ถังหมึกผสมสำเร็จขนาด 20L บนพาเลท
  //     * แท่นชั่งดิจิทัลและโต๊ะแล็บตรวจสอบความหนืด (Zahn Cup) และค่าเฉดสี
  // =========================================================================
  function buildInkDispenserStation(group, r, H, mats) {
    const stationGroup = new THREE.Group();
    group.add(stationGroup);

    const roomH = 2.4;
    const totalW = r.w; // 11.6m
    const totalD = r.d; // 4.6m

    // Split: West = Drum Pump Station (width ~6.6m), East = Ink Dispensing Room (width ~5.0m)
    const roomW = 5.0;
    const drumStationW = totalW - roomW; // 6.6m
    const drumStartX = -totalW * 0.5;
    const drumEndX = drumStartX + drumStationW; // +0.8m
    const roomStartX = drumEndX;
    const roomEndX = totalW * 0.5;
    const roomCenterX = (roomStartX + roomEndX) * 0.5;

    // Materials
    const drumBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.3 });
    const drumRimMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.4 });
    const pumpBlackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
    const stainlessMat = mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
    const strutGalvMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.35 });
    const orangeHoseMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const blackHoseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const yellowCurbMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const floorGrayMat = new THREE.MeshStandardMaterial({ color: 0x7e8b9b, roughness: 0.65 });
    const cleanFloorMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const wallMat = mats.wallPartition || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.1 });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });

    // 1A. Drum Pumping Station Floor (West side)
    const drumFloor = new THREE.Mesh(new THREE.BoxGeometry(drumStationW - 0.08, 0.03, totalD - 0.08), floorGrayMat);
    drumFloor.position.set(drumStartX + drumStationW * 0.5, 0.015, 0);
    addEdges(drumFloor, 0x475569, 0.7);
    stationGroup.add(drumFloor);

    // Yellow spill containment curb around drum area
    const curbH = 0.14;
    const curbThick = 0.10;
    const curbWest = new THREE.Mesh(new THREE.BoxGeometry(curbThick, curbH, totalD), yellowCurbMat);
    curbWest.position.set(drumStartX + curbThick * 0.5, curbH * 0.5, 0);
    const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(drumStationW, curbH, curbThick), yellowCurbMat);
    curbNorth.position.set(drumStartX + drumStationW * 0.5, curbH * 0.5, -totalD * 0.5 + curbThick * 0.5);
    const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(drumStationW, curbH, curbThick), yellowCurbMat);
    curbSouth.position.set(drumStartX + drumStationW * 0.5, curbH * 0.5, totalD * 0.5 - curbThick * 0.5);
    stationGroup.add(curbWest, curbNorth, curbSouth);

    // 1B. Two Rows of 5 Blue Ink Drums with Pneumatic Pumps (Total 10 Units)
    const drumRows = [-totalD * 0.25, totalD * 0.25];
    const drumsPerRow = 5;
    const drumPitch = (drumStationW - 1.2) / (drumsPerRow - 1);
    const drumR = 0.29;
    const drumH = 0.88;

    drumRows.forEach((rz) => {
      const beam1 = new THREE.Mesh(new THREE.BoxGeometry(drumStationW - 0.4, 0.08, 0.08), strutGalvMat);
      beam1.position.set(drumStartX + drumStationW * 0.5, 1.20, rz);
      const beam2 = new THREE.Mesh(new THREE.BoxGeometry(drumStationW - 0.4, 0.08, 0.08), strutGalvMat);
      beam2.position.set(drumStartX + drumStationW * 0.5, 2.10, rz);
      stationGroup.add(beam1, beam2);

      for (let pIdx = 0; pIdx <= drumsPerRow; pIdx++) {
        const px = drumStartX + 0.6 + pIdx * drumPitch - drumPitch * 0.5;
        if (px >= drumStartX && px <= drumEndX) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 0.08), strutGalvMat);
          post.position.set(px, 1.6, rz);
          addEdges(post, 0x64748b, 0.6);
          stationGroup.add(post);
        }
      }

      for (let d = 0; d < drumsPerRow; d++) {
        const dx = drumStartX + 0.6 + d * drumPitch;

        const drum = new THREE.Mesh(new THREE.CylinderGeometry(drumR, drumR, drumH, 16), drumBlueMat);
        drum.position.set(dx, drumH * 0.5 + 0.03, rz);
        addEdges(drum, 0x1e3a8a, 0.5);
        stationGroup.add(drum);

        [-drumH * 0.46, drumH * 0.46].forEach(ry => {
          const rim = new THREE.Mesh(new THREE.CylinderGeometry(drumR + 0.015, drumR + 0.015, 0.03, 16), drumRimMat);
          rim.position.set(dx, drumH * 0.5 + 0.03 + ry, rz);
          stationGroup.add(rim);
        });

        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(0.24, 0.32),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        label.position.set(dx, drumH * 0.55 + 0.03, rz + (rz > 0 ? drumR + 0.01 : -drumR - 0.01));
        if (rz < 0) label.rotation.y = Math.PI;
        stationGroup.add(label);

        const pumpY = 1.25;
        const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.28, 0.18), pumpBlackMat);
        pumpBody.position.set(dx, pumpY, rz);
        addEdges(pumpBody, 0x0f172a, 0.6);

        [-0.14, 0.14].forEach(bx => {
          const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), pumpBlackMat);
          bell.rotation.z = Math.PI / 2;
          bell.position.set(dx + bx, pumpY, rz);
          stationGroup.add(bell);
        });
        stationGroup.add(pumpBody);

        const dampY = pumpY + 0.28;
        const dampCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.32, 12), stainlessMat);
        dampCyl.position.set(dx, dampY, rz);
        const dampDome = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), stainlessMat);
        dampDome.position.set(dx, dampY + 0.16, rz);
        stationGroup.add(dampCyl, dampDome);

        const suctionPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8), stainlessMat);
        suctionPipe.position.set(dx, pumpY - 0.24, rz + (rz > 0 ? 0.14 : -0.14));
        stationGroup.add(suctionPipe);

        const suctionHose = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 8), blackHoseMat);
        suctionHose.position.set(dx, drumH + 0.12, rz + (rz > 0 ? 0.14 : -0.14));
        stationGroup.add(suctionHose);

        const airHose = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 8), orangeHoseMat);
        airHose.position.set(dx + 0.18, pumpY - 0.12, rz);
        stationGroup.add(airHose);

        const riserPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.3, 8), stainlessMat);
        riserPipe.position.set(dx, pumpY + 0.95, rz);
        stationGroup.add(riserPipe);
      }
    });

    // Overhead Stainless Steel Pipe Manifold Rack
    const manifoldY = 2.95;
    const numPipes = 6;
    const pipeSpanZ = totalD * 0.65;
    for (let pi = 0; pi < numPipes; pi++) {
      const pz = -pipeSpanZ * 0.5 + (pi * pipeSpanZ) / (numPipes - 1);
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, drumStationW, 8),
        stainlessMat
      );
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(drumStartX + drumStationW * 0.5, manifoldY + (pi % 2) * 0.15, pz);
      stationGroup.add(pipe);
    }

    for (let hx = drumStartX + 1.0; hx <= drumEndX - 0.5; hx += 1.8) {
      const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, pipeSpanZ + 0.3), strutGalvMat);
      hanger.position.set(hx, manifoldY - 0.06, 0);
      stationGroup.add(hanger);
    }

    // =========================================================================
    // 2. INK MIXING ROOM (East Side, width = 5.0m, depth = 4.6m, height = 2.4m)
    // =========================================================================
    const roomGroup = new THREE.Group();
    roomGroup.position.set(roomCenterX, 0, 0);
    stationGroup.add(roomGroup);

    const wallThick = 0.12;
    const halfRW = roomW * 0.5;
    const halfRD = totalD * 0.5;

    // Clean Epoxy Floor Slab with Yellow Perimeter Safety Border
    const roomFloor = new THREE.Mesh(new THREE.BoxGeometry(roomW - 0.04, 0.04, totalD - 0.04), cleanFloorMat);
    roomFloor.position.y = 0.02;
    addEdges(roomFloor, 0x94a3b8, 0.5);
    roomGroup.add(roomFloor);

    // North Perimeter Wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, roomH, wallThick), wallMat);
    northWall.position.set(0, roomH * 0.5, -halfRD + wallThick * 0.5);
    addEdges(northWall, 0x94a3b8, 0.5);
    roomGroup.add(northWall);

    // East Perimeter Wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, totalD), wallMat);
    eastWall.position.set(halfRW - wallThick * 0.5, roomH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.5);
    roomGroup.add(eastWall);

    // West Divider Wall (between room and drum station)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, totalD), wallMat);
    westWall.position.set(-halfRW + wallThick * 0.5, roomH * 0.5, 0);
    addEdges(westWall, 0x94a3b8, 0.5);
    roomGroup.add(westWall);

    // SOUTH FRONT WALL (Panoramic Cleanroom Glass Wall with Blue Framing)
    const southZ = halfRD - wallThick * 0.5;
    const glassWallW = roomW - 1.4;
    const glassWallX = -0.7;

    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(glassWallW, roomH * 0.88, 0.04), glassMat);
    glassFront.position.set(glassWallX, roomH * 0.44 + 0.12, southZ);
    addEdges(glassFront, 0x38bdf8, 0.6);
    roomGroup.add(glassFront);

    const baseCurb = new THREE.Mesh(new THREE.BoxGeometry(glassWallW, 0.12, 0.08), doorFrameMat);
    baseCurb.position.set(glassWallX, 0.06, southZ);
    roomGroup.add(baseCurb);

    const topHeader = new THREE.Mesh(new THREE.BoxGeometry(glassWallW, 0.16, 0.08), doorFrameMat);
    topHeader.position.set(glassWallX, roomH - 0.08, southZ);
    roomGroup.add(topHeader);

    // Front Glass Entrance Door
    const doorX = halfRW - 0.7;
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, roomH, 0.12), doorFrameMat);
    doorFrame.position.set(doorX, roomH * 0.5, southZ);
    addEdges(doorFrame, 0x0284c7, 0.6);
    roomGroup.add(doorFrame);

    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.0, roomH - 0.15, 0.04), glassMat);
    doorLeaf.position.set(doorX, (roomH - 0.15) * 0.5, southZ);
    addEdges(doorLeaf, 0xffffff, 0.7);
    roomGroup.add(doorLeaf);

    // Interior Cleanroom Ceiling Lighting
    const roomLight = new THREE.PointLight(0xffffff, 0.85, 12);
    roomLight.position.set(0, 2.2, 0);
    roomGroup.add(roomLight);

    // 2B. INDUSTRIAL INK MIXING TANKS WITH PNEUMATIC AGITATORS (ถังกวนผสมหมึกพิมพ์)
    const tankPositions = [
      { x: -1.2, z: -0.6 },
      { x: -1.2, z: 0.7 }
    ];

    tankPositions.forEach((pos) => {
      const tankGroup = new THREE.Group();
      tankGroup.position.set(pos.x, 0, pos.z);
      roomGroup.add(tankGroup);

      const tankR = 0.42;
      const tankH = 0.85;
      const legH = 0.35;

      for (let l = 0; l < 3; l++) {
        const lang = (l * Math.PI * 2) / 3;
        const lx = Math.cos(lang) * (tankR * 0.85);
        const lz = Math.sin(lang) * (tankR * 0.85);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, legH, 8), stainlessMat);
        leg.position.set(lx, legH * 0.5, lz);
        tankGroup.add(leg);
      }

      const tank = new THREE.Mesh(new THREE.CylinderGeometry(tankR, tankR, tankH, 20), stainlessMat);
      tank.position.y = legH + tankH * 0.5;
      addEdges(tank, 0x64748b, 0.5);
      tankGroup.add(tank);

      const lid = new THREE.Mesh(new THREE.CylinderGeometry(tankR + 0.02, tankR + 0.02, 0.04, 20), stainlessMat);
      lid.position.y = legH + tankH + 0.02;
      tankGroup.add(lid);

      const motorY = legH + tankH + 0.18;
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.28, 12), pumpBlackMat);
      motor.position.y = motorY;
      addEdges(motor, 0x0f172a, 0.6);
      tankGroup.add(motor);

      const valve = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), doorFrameMat);
      valve.position.set(0.12, motorY + 0.08, 0);
      tankGroup.add(valve);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8), stainlessMat);
      shaft.position.y = legH + tankH - 0.15;
      tankGroup.add(shaft);

      const impeller = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.06), stainlessMat);
      impeller.position.y = legH + 0.25;
      tankGroup.add(impeller);

      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), stainlessMat);
      pipe.position.set(-tankR * 0.6, legH + tankH + 0.15, 0);
      tankGroup.add(pipe);
    });

    // 2C. 20L COLOR INK PAILS ON WOODEN PALLET (ถังสีผสมสำเร็จ 20 ลิตร)
    const pailGroup = new THREE.Group();
    pailGroup.position.set(0.2, 0, 0.8);
    roomGroup.add(pailGroup);

    const palletBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.9), strutGalvMat);
    palletBase.position.y = 0.06;
    pailGroup.add(palletBase);

    const pailColors = [0x0284c7, 0xdb2777, 0xfacc15, 0x1e293b];
    const pailR = 0.15;
    const pailH = 0.38;
    const pailCoords = [
      { x: -0.25, z: -0.22, col: pailColors[0] },
      { x: 0.25, z: -0.22, col: pailColors[1] },
      { x: -0.25, z: 0.22, col: pailColors[2] },
      { x: 0.25, z: 0.22, col: pailColors[3] }
    ];

    pailCoords.forEach(pc => {
      const pBody = new THREE.Mesh(
        new THREE.CylinderGeometry(pailR, pailR * 0.9, pailH, 14),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
      );
      pBody.position.set(pc.x, 0.12 + pailH * 0.5, pc.z);
      pailGroup.add(pBody);

      const pLid = new THREE.Mesh(
        new THREE.CylinderGeometry(pailR + 0.01, pailR + 0.01, 0.04, 14),
        new THREE.MeshStandardMaterial({ color: pc.col, roughness: 0.35 })
      );
      pLid.position.set(pc.x, 0.12 + pailH + 0.02, pc.z);
      pailGroup.add(pLid);
    });

    // 2D. QUALITY CONTROL & VISCOSITY LAB BENCH
    const benchGroup = new THREE.Group();
    benchGroup.position.set(halfRW - 0.55, 0, -0.2);
    roomGroup.add(benchGroup);

    const benchL = 2.4;
    const benchW = 0.70;
    const benchH = 0.85;

    const bench = new THREE.Mesh(new THREE.BoxGeometry(benchW, benchH, benchL), stainlessMat);
    bench.position.set(0, benchH * 0.5, 0);
    addEdges(bench, 0x64748b, 0.6);
    benchGroup.add(bench);

    const balance = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.30), darkMetalMat);
    balance.position.set(0, benchH + 0.06, -benchL * 0.28);
    benchGroup.add(balance);

    const balPan = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12), stainlessMat);
    balPan.position.set(0, benchH + 0.13, -benchL * 0.28);
    benchGroup.add(balPan);

    const zahnStand = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28, 8), stainlessMat);
    zahnStand.position.set(0.12, benchH + 0.14, 0);
    const zahnCup = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.07, 10), stainlessMat);
    zahnCup.position.set(0.05, benchH + 0.20, 0);
    benchGroup.add(zahnStand, zahnCup);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.48), pumpBlackMat);
    monitor.position.set(0, benchH + 0.40, benchL * 0.25);
    benchGroup.add(monitor);

    const monScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.32),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    monScreen.position.set(-0.028, benchH + 0.40, benchL * 0.25);
    monScreen.rotation.y = -Math.PI / 2;
    benchGroup.add(monScreen);
  }

  return {
    buildGravurePress,
    buildInkDispenserStation
  };
})();
