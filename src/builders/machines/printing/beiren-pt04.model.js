// ============================================================================
// Module: src/builders/machines/printing/beiren-pt04.model.js
// Procedural 3D Model for Beiren PT-04 9-Color Rotogravure Printing Press:
//   - Light-gray chassis & upper drying bridge with signature teal lower skirt
//     and elevated teal continuous top perimeter guardrail
//   - Rooftop open web-guide gantry roller frames & red digital "000" LED readout
//   - 9 upright light-gray printing towers with analog gauges & recessed cylinder bays
//   - Right-side Master HMI Control Tower + waist-high slanted operator desk
//   - Exposed right turret with metallic silver/foil jumbo roll, upper orange bar,
//     curved black hoses, and semi-transparent orange perforated safety mesh gates
//   - Left unwind station with white film roll and matching orange safety mesh guard
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.PrintingModels = window.Starflex3D.Builders.PrintingModels || {};

window.Starflex3D.Builders.PrintingModels.BeirenPT04 = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createWebRibbon } = window.Starflex3D.Builders.MachineCommon;

  const _unitTextures = {};
  let _masterTowerTex = null;
  let _deskPanelTex = null;
  let _ledReadoutTex = null;
  let _orangeMeshTex = null;
  let _bridgeBadgeTex = null;

  function getBeirenUnitTexture(unitNum) {
    if (_unitTextures[unitNum]) return _unitTextures[unitNum];
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Clean Beiren light gray enamel face
    ctx.fillStyle = "#dce3ea";
    ctx.fillRect(0, 0, 128, 384);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 124, 380);

    // Upper recessed charcoal control module
    ctx.fillStyle = "#334155";
    ctx.fillRect(14, 18, 100, 122);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 18, 100, 122);

    // 3 circular pressure gauges
    for (let g = 0; g < 3; g++) {
      const gx = 32 + g * 32;
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(gx, 38, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, 38);
      ctx.lineTo(gx + 5, 32);
      ctx.stroke();
    }

    // Small LED meter & station number tag
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(22, 58, 48, 22);
    ctx.fillStyle = "#ef4444";
    ctx.font = 'bold 13px "Consolas", monospace';
    ctx.fillText("075", 32, 74);

    ctx.fillStyle = "#0e7490";
    ctx.fillRect(76, 58, 30, 22);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(String(unitNum).padStart(2, "0"), 91, 74);
    ctx.textAlign = "left";

    // Two rows of pushbuttons
    const btnColors = ["#22c55e", "#ef4444", "#cbd5e1", "#eab308", "#38bdf8", "#cbd5e1"];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = btnColors[r * 3 + c];
        ctx.beginPath();
        ctx.arc(34 + c * 30, 100 + r * 22, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Lower electrical cabinet door seam & twin silver latches
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(14, 158, 100, 206);
    ctx.fillStyle = "#475569";
    ctx.fillRect(22, 174, 34, 14);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(102, 238, 6, 18);
    ctx.fillRect(102, 276, 6, 18);

    const tex = new THREE.CanvasTexture(canvas);
    _unitTextures[unitNum] = tex;
    return tex;
  }

  function getMasterTowerTexture() {
    if (_masterTowerTex) return _masterTowerTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 192;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 192, 384);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 188, 380);

    // Top 4 analog/digital meters
    for (let m = 0; m < 4; m++) {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(20 + m * 40, 26, 32, 26);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(24 + m * 40, 30, 24, 18);
    }

    // Center recessed touchscreen HMI
    ctx.fillStyle = "#475569";
    ctx.fillRect(28, 72, 136, 98);
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(38, 82, 116, 78);
    ctx.fillStyle = "#bae6fd";
    ctx.font = 'bold 12px "Consolas", monospace';
    ctx.fillText("BEIREN PT-04", 48, 104);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(48, 114, 96, 8);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(48, 130, 74, 8);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(48, 144, 58, 8);

    // Control switch & pushbutton cluster below HMI
    ctx.fillStyle = "#334155";
    ctx.fillRect(28, 184, 136, 56);
    const cols = ["#22c55e", "#ef4444", "#facc15", "#e2e8f0", "#0ea5e9"];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = cols[i];
      ctx.beginPath();
      ctx.arc(46 + i * 25, 204, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.arc(46 + i * 25, 224, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lower cabinet panel outline & latch
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 256, 152, 114);
    ctx.fillStyle = "#475569";
    ctx.fillRect(156, 294, 8, 22);

    _masterTowerTex = new THREE.CanvasTexture(canvas);
    return _masterTowerTex;
  }

  function getSlantedDeskTexture() {
    if (_deskPanelTex) return _deskPanelTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#334155";
    ctx.fillRect(14, 14, 228, 100);

    const colors = ["#ef4444", "#22c55e", "#facc15", "#38bdf8", "#f8fafc", "#f97316"];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        ctx.fillStyle = colors[(r * 3 + c) % colors.length];
        ctx.beginPath();
        ctx.arc(38 + c * 36, 44 + r * 38, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    _deskPanelTex = new THREE.CanvasTexture(canvas);
    return _deskPanelTex;
  }

  function getRedLEDTexture() {
    if (_ledReadoutTex) return _ledReadoutTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, 256, 96);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    ctx.strokeRect(3, 3, 250, 90);

    ctx.fillStyle = "#ef4444";
    ctx.font = 'bold 60px "Consolas", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("000", 128, 52);

    _ledReadoutTex = new THREE.CanvasTexture(canvas);
    return _ledReadoutTex;
  }

  function getBridgeBadgeTexture(code) {
    if (_bridgeBadgeTex) return _bridgeBadgeTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0e7490";
    ctx.fillRect(0, 0, 384, 64);
    ctx.fillStyle = "#155e75";
    ctx.fillRect(6, 6, 372, 52);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.textBaseline = "middle";
    ctx.fillText("SHAANXI BEIREN", 20, 34);
    ctx.fillStyle = "#f97316";
    ctx.fillRect(272, 12, 98, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(code || "PT-04", 321, 34);

    _bridgeBadgeTex = new THREE.CanvasTexture(canvas);
    return _bridgeBadgeTex;
  }

  function getOrangeMeshGateTexture() {
    if (_orangeMeshTex) return _orangeMeshTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 256, 256);

    // Semi-transparent orange perforated mesh fill
    ctx.fillStyle = "rgba(234, 88, 12, 0.34)";
    ctx.fillRect(14, 14, 228, 228);

    // Perforated industrial grid lines
    ctx.strokeStyle = "rgba(234, 88, 12, 0.85)";
    ctx.lineWidth = 2;
    const step = 16;
    for (let x = 16; x < 242; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 14);
      ctx.lineTo(x, 242);
      ctx.stroke();
    }
    for (let y = 16; y < 242; y += step) {
      ctx.beginPath();
      ctx.moveTo(14, y);
      ctx.lineTo(242, y);
      ctx.stroke();
    }

    // Thick solid safety-orange tubular outer frame
    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 18;
    ctx.strokeRect(9, 9, 238, 238);

    _orangeMeshTex = new THREE.CanvasTexture(canvas);
    return _orangeMeshTex;
  }

  function createMaterials(mats) {
    return {
      bodyGrayMat: new THREE.MeshStandardMaterial({ color: 0xdce3ea, roughness: 0.34, metalness: 0.14 }),
      lightGrayMat: new THREE.MeshStandardMaterial({ color: 0xe8edf2, roughness: 0.30, metalness: 0.10 }),
      tealMat: new THREE.MeshStandardMaterial({ color: 0x0e7490, roughness: 0.32, metalness: 0.22 }),
      darkSteelMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.50, metalness: 0.40 }),
      baseFootMat: mats.machineDark || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 }),
      chromeMat: mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.92, roughness: 0.14 }),
      orangeSafetyMat: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.20 }),
      foilRollMat: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.18, metalness: 0.65 }),
      whiteRollMat: mats.filmRollWhite || new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.05 }),
      hoseMat: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.70, metalness: 0.15 }),
      webWhiteMat: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.28,
        metalness: 0.08,
        side: THREE.DoubleSide
      }),
      webSilverMat: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.22,
        metalness: 0.45,
        side: THREE.DoubleSide
      })
    };
  }

  function addMeshGate(parent, x, y, z, w, h, rotY, gateMat, postMat) {
    const gate = new THREE.Group();
    gate.position.set(x, y, z);
    gate.rotation.y = rotY;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), gateMat);
    gate.add(panel);
    // Vertical hinge post on one edge
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, h + 0.06, 0.06), postMat);
    post.position.set(-w * 0.5, 0, 0);
    gate.add(post);
    parent.add(gate);
  }

  function build(inner, L, W, H, mats, item) {
    const machineCode = (item && item.code) ? item.code : "PT-04";
    const m = createMaterials(mats);

    const meshGateTex = getOrangeMeshGateTexture();
    const meshGateMat = meshGateTex
      ? new THREE.MeshBasicMaterial({ map: meshGateTex, transparent: true, side: THREE.DoubleSide })
      : m.orangeSafetyMat;

    const bedH = 0.14;
    const baseW = L * 0.97;
    const unitZ = -W * 0.04;
    const unitD = W * 0.62;
    const frontZ = unitZ + unitD * 0.5;
    const rearZ = unitZ - unitD * 0.5;

    // -------------------------------------------------------------------------
    // 1. FLOOR MOUNTING RAILS / FOUNDATION PLINTHS
    // -------------------------------------------------------------------------
    const floorPlinth = new THREE.Mesh(new THREE.BoxGeometry(baseW, bedH, unitD * 1.12), m.baseFootMat);
    floorPlinth.position.set(0, bedH * 0.5, unitZ);
    floorPlinth.receiveShadow = true;
    addEdges(floorPlinth, 0x0f172a, 0.65);
    inner.add(floorPlinth);

    // -------------------------------------------------------------------------
    // 2. 9 PRINTING UNIT TOWERS + MASTER HMI TOWER (#10) + INTER-UNIT BAYS
    // -------------------------------------------------------------------------
    const bridgeBottomY = H * 0.64;
    const towerH = bridgeBottomY - bedH;
    const numUnits = 9;
    const printStartX = -L * 0.34;
    const printEndX = L * 0.15;
    const unitPitch = (printEndX - printStartX) / numUnits;
    const unitW = unitPitch * 0.64;

    for (let i = 0; i < numUnits; i++) {
      const ux = printStartX + (i + 0.5) * unitPitch;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(unitW, towerH, unitD), m.bodyGrayMat);
      tower.position.set(ux, bedH + towerH * 0.5, unitZ);
      tower.castShadow = true;
      addEdges(tower, 0x94a3b8, 0.6);
      inner.add(tower);

      const uTex = getBeirenUnitTexture(i + 1);
      if (uTex) {
        const panel = new THREE.Mesh(
          new THREE.PlaneGeometry(unitW * 0.90, towerH * 0.92),
          new THREE.MeshBasicMaterial({ map: uTex })
        );
        panel.position.set(ux, bedH + towerH * 0.5, frontZ + 0.015);
        inner.add(panel);
      }

      // Bolted charcoal foot pad on front edge
      const foot = new THREE.Mesh(new THREE.BoxGeometry(unitW * 1.06, 0.12, 0.14), m.baseFootMat);
      foot.position.set(ux, bedH + 0.06, frontZ + 0.06);
      inner.add(foot);

      // Inter-unit gravure cylinder, ink fountain & idler roller bay
      if (i < numUnits - 1) {
        const gapX = ux + unitPitch * 0.5;
        const inkTrough = new THREE.Mesh(new THREE.BoxGeometry(unitPitch * 0.32, 0.24, unitD * 0.72), m.darkSteelMat);
        inkTrough.position.set(gapX, bedH + 0.22, unitZ);
        const gravureCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, unitD * 0.66, 14), m.chromeMat);
        gravureCyl.rotation.x = Math.PI / 2;
        gravureCyl.position.set(gapX, bedH + 0.48, unitZ);
        const topIdler = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, unitD * 0.62, 10), m.chromeMat);
        topIdler.rotation.x = Math.PI / 2;
        topIdler.position.set(gapX, bedH + towerH * 0.76, unitZ);
        inner.add(inkTrough, gravureCyl, topIdler);
      }
    }

    // Master Control Tower (wider light-gray tower to the right of Unit 09)
    const masterX = L * 0.225;
    const masterW = L * 0.075;
    const masterD = unitD * 1.04;
    const masterCab = new THREE.Mesh(new THREE.BoxGeometry(masterW, towerH, masterD), m.lightGrayMat);
    masterCab.position.set(masterX, bedH + towerH * 0.5, unitZ + 0.05);
    masterCab.castShadow = true;
    addEdges(masterCab, 0x94a3b8, 0.6);
    inner.add(masterCab);

    const mTex = getMasterTowerTexture();
    if (mTex) {
      const mPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(masterW * 0.90, towerH * 0.92),
        new THREE.MeshBasicMaterial({ map: mTex })
      );
      mPlane.position.set(masterX, bedH + towerH * 0.5, unitZ + 0.05 + masterD * 0.5 + 0.015);
      inner.add(mPlane);
    }

    // -------------------------------------------------------------------------
    // 3. FREESTANDING WAIST-HIGH SLANTED OPERATOR CONTROL DESK (Foreground Right)
    // -------------------------------------------------------------------------
    const deskX = L * 0.295;
    const deskW = L * 0.055;
    const deskH = towerH * 0.48;
    const deskD = unitD * 0.42;
    const deskZ = frontZ + deskD * 0.42;

    const deskBody = new THREE.Mesh(new THREE.BoxGeometry(deskW, deskH, deskD), m.lightGrayMat);
    deskBody.position.set(deskX, bedH + deskH * 0.5, deskZ);
    deskBody.castShadow = true;
    addEdges(deskBody, 0x94a3b8, 0.6);
    inner.add(deskBody);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(deskW * 0.96, 0.16, deskD * 0.90), m.darkSteelMat);
    deskTop.position.set(deskX, bedH + deskH + 0.06, deskZ);
    deskTop.rotation.x = 0.28;
    addEdges(deskTop, 0x475569, 0.5);
    inner.add(deskTop);

    const dTex = getSlantedDeskTexture();
    if (dTex) {
      const dPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(deskW * 0.88, deskD * 0.78),
        new THREE.MeshBasicMaterial({ map: dTex })
      );
      dPlane.rotation.x = -Math.PI / 2 + 0.28;
      dPlane.position.set(deskX, bedH + deskH + 0.15, deskZ + 0.02);
      inner.add(dPlane);
    }

    // -------------------------------------------------------------------------
    // 4. OVERHEAD DRYING BRIDGE + TEAL LOWER SKIRT + ELEVATED TEAL TOP GUARDRAIL
    // -------------------------------------------------------------------------
    const bridgeStartX = -L * 0.44;
    const bridgeEndX = L * 0.47;
    const bridgeL = bridgeEndX - bridgeStartX;
    const bridgeCenterX = (bridgeStartX + bridgeEndX) * 0.5;
    const skirtH = 0.22;
    const boxH = H * 0.14;
    const bridgeD = unitD * 1.18;

    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(bridgeCenterX, bridgeBottomY, unitZ);
    inner.add(bridgeGroup);

    // Signature Thick Teal Lower Fascia Skirt
    const lowerSkirt = new THREE.Mesh(
      new THREE.BoxGeometry(bridgeL + 0.06, skirtH, bridgeD + 0.06),
      m.tealMat
    );
    lowerSkirt.position.y = skirtH * 0.5;
    lowerSkirt.castShadow = true;
    addEdges(lowerSkirt, 0x155e75, 0.7);
    bridgeGroup.add(lowerSkirt);

    // Light-Gray Main Dryer Bridge Enclosure sitting cleanly above teal skirt
    const upperBox = new THREE.Mesh(
      new THREE.BoxGeometry(bridgeL, boxH, bridgeD),
      m.lightGrayMat
    );
    upperBox.position.y = skirtH + boxH * 0.5 + 0.005;
    upperBox.castShadow = true;
    addEdges(upperBox, 0x94a3b8, 0.6);
    bridgeGroup.add(upperBox);

    // Glowing Red "000" LED Speed Display + SHAANXI BEIREN / PT-04 Nameplate on Teal Skirt
    const ledTex = getRedLEDTexture();
    if (ledTex) {
      const ledPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.56, skirtH * 0.78),
        new THREE.MeshBasicMaterial({ map: ledTex })
      );
      ledPlane.position.set(-bridgeL * 0.10, skirtH * 0.5, (bridgeD + 0.06) * 0.5 + 0.015);
      bridgeGroup.add(ledPlane);
    }

    const badgeTex = getBridgeBadgeTexture(machineCode);
    if (badgeTex) {
      const badgePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.75, skirtH * 0.80),
        new THREE.MeshBasicMaterial({ map: badgeTex })
      );
      badgePlane.position.set(bridgeL * 0.18, skirtH * 0.5, (bridgeD + 0.06) * 0.5 + 0.015);
      bridgeGroup.add(badgePlane);
    }

    // Elevated Teal Top Perimeter Guardrail Band supported by stanchion posts
    const bridgeDeckY = skirtH + boxH + 0.005;
    const topBandOffsetY = 0.52;
    const topBandH = 0.14;
    const railD = bridgeD + 0.04;

    // Front & rear teal top rail beams + ends wrapping perimeter cleanly
    const railZ = railD * 0.5;
    [-railZ, railZ].forEach(rz => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(bridgeL + 0.04, topBandH, 0.07), m.tealMat);
      beam.position.set(0, bridgeDeckY + topBandOffsetY, rz);
      addEdges(beam, 0x155e75, 0.6);
      bridgeGroup.add(beam);

      const postCount = 9;
      for (let pi = 0; pi < postCount; pi++) {
        const px = -bridgeL * 0.46 + (pi * (bridgeL * 0.92)) / (postCount - 1);
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, topBandOffsetY, 0.06), m.bodyGrayMat);
        post.position.set(px, bridgeDeckY + topBandOffsetY * 0.5, rz * 0.96);
        bridgeGroup.add(post);
      }
    });

    [-bridgeL * 0.5, bridgeL * 0.5].forEach(rx => {
      const endBeam = new THREE.Mesh(new THREE.BoxGeometry(0.07, topBandH, railD + 0.04), m.tealMat);
      endBeam.position.set(rx, bridgeDeckY + topBandOffsetY, 0);
      addEdges(endBeam, 0x155e75, 0.6);
      bridgeGroup.add(endBeam);
    });

    // Rooftop Overhead Web-Guide Gantry Roller Stands (matching roof silhouettes in photo)
    const numRoofStands = 6;
    for (let rs = 0; rs < numRoofStands; rs++) {
      const rx = -bridgeL * 0.40 + (rs * (bridgeL * 0.82)) / (numRoofStands - 1);
      [-railD * 0.28, railD * 0.28].forEach(sz => {
        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.08), m.bodyGrayMat);
        bracket.position.set(rx, bridgeDeckY + 0.18, sz);
        addEdges(bracket, 0x94a3b8, 0.5);
        bridgeGroup.add(bracket);
      });
      const rRoller = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.085, railD * 0.58, 12),
        m.whiteRollMat
      );
      rRoller.rotation.x = Math.PI / 2;
      rRoller.position.set(rx, bridgeDeckY + 0.34, 0);
      bridgeGroup.add(rRoller);
    }

    // -------------------------------------------------------------------------
    // 5. RIGHT EXPOSED TURRET REWINDER + ORANGE PERFORATED MESH GATES
    // -------------------------------------------------------------------------
    const turretX = L * 0.395;
    const foilRollR = 0.43;
    const foilRollW = unitD * 0.68;
    const foilRollY = bedH + 0.88;

    // Rear & Right cast-gray turret side frames + floor connecting bar
    const rearArm = new THREE.Mesh(new THREE.BoxGeometry(1.10, 1.40, 0.18), m.bodyGrayMat);
    rearArm.position.set(turretX, bedH + 0.70, rearZ + 0.12);
    const farRightFrame = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.45, unitD * 0.86), m.bodyGrayMat);
    farRightFrame.position.set(L * 0.465, bedH + 0.72, unitZ);
    const turretFloorTie = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.12, unitD * 0.74), m.bodyGrayMat);
    turretFloorTie.position.set(turretX, bedH + 0.06, unitZ);
    inner.add(rearArm, farRightFrame, turretFloorTie);

    // Metallic Silver / Foil Jumbo Film Roll clearly exposed in turret
    const jumboFoilRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(foilRollR, foilRollR, foilRollW, 28),
      m.foilRollMat
    );
    jumboFoilRoll.rotation.x = Math.PI / 2;
    jumboFoilRoll.position.set(turretX, foilRollY, unitZ);
    addEdges(jumboFoilRoll, 0x64748b, 0.45);
    inner.add(jumboFoilRoll);

    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, foilRollW + 0.38, 16),
      m.darkSteelMat
    );
    spindle.rotation.x = Math.PI / 2;
    spindle.position.set(turretX, foilRollY, unitZ);
    inner.add(spindle);

    // Secondary white nip roller & upper orange guide arm above foil roll
    const upperWhiteRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, foilRollW * 0.96, 16),
      m.whiteRollMat
    );
    upperWhiteRoll.rotation.x = Math.PI / 2;
    upperWhiteRoll.position.set(turretX - 0.34, foilRollY + 0.46, unitZ);
    inner.add(upperWhiteRoll);

    const orangePivotArm = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.10, foilRollW * 0.92),
      m.orangeSafetyMat
    );
    orangePivotArm.position.set(turretX - 0.25, bridgeBottomY - 0.56, unitZ);
    addEdges(orangePivotArm, 0x9a3412, 0.5);
    inner.add(orangePivotArm);

    const topTurretChrome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, foilRollW * 0.96, 14),
      m.chromeMat
    );
    topTurretChrome.rotation.x = Math.PI / 2;
    topTurretChrome.position.set(turretX - 0.25, bridgeBottomY - 0.26, unitZ);
    inner.add(topTurretChrome);

    // Curved dark hydraulic/pneumatic flexible hoses dropping from bridge corner
    [-0.12, 0.12].forEach(hz => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(turretX - 0.50, bridgeBottomY - 0.04, unitZ + hz),
        new THREE.Vector3(turretX + 0.20, bridgeBottomY - 0.26, unitZ + 0.18 + hz),
        new THREE.Vector3(turretX + 0.15, bridgeBottomY - 0.58, unitZ + hz)
      );
      const hose = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.032, 8, false), m.hoseMat);
      inner.add(hose);
    });

    // Twin Orange Perforated Safety Mesh Swinging Gates flanking right turret
    const gateH = 1.24;
    const gateY = bedH + gateH * 0.5 + 0.04;
    addMeshGate(inner, turretX - 0.42, gateY, frontZ + 0.12, 0.85, gateH, 0.12, meshGateMat, m.orangeSafetyMat);
    addMeshGate(inner, L * 0.465, gateY, frontZ + 0.04, 0.72, gateH, -0.35, meshGateMat, m.orangeSafetyMat);

    // -------------------------------------------------------------------------
    // 6. LEFT UNWIND STATION (White Film Roll + Orange Perforated Mesh Guard)
    // -------------------------------------------------------------------------
    const unwindX = -L * 0.415;
    const unwindR = 0.42;
    const unwindY = bedH + 0.84;

    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.35, unitD * 0.84), m.bodyGrayMat);
    leftFrame.position.set(-L * 0.465, bedH + 0.68, unitZ);
    inner.add(leftFrame);

    const whiteInfeedRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(unwindR, unwindR, foilRollW, 24),
      m.whiteRollMat
    );
    whiteInfeedRoll.rotation.x = Math.PI / 2;
    whiteInfeedRoll.position.set(unwindX, unwindY, unitZ);
    addEdges(whiteInfeedRoll, 0xcbd5e1, 0.5);
    inner.add(whiteInfeedRoll);

    // Mini front orange safety gate on far-left unwind end (visible in left of photo)
    addMeshGate(inner, unwindX - 0.18, gateY - 0.08, frontZ + 0.08, 0.74, gateH * 0.86, -0.06, meshGateMat, m.orangeSafetyMat);

    // -------------------------------------------------------------------------
    // 7. CONTINUOUS FILM WEB PATH (Unwind -> Bridge -> Printing -> Foil Turret)
    // -------------------------------------------------------------------------
    const webW = foilRollW * 0.82;
    const bridgeWebY = bridgeBottomY - 0.18;
    const printWebY = bedH + 0.54;

    const wp0 = { x: unwindX, y: unwindY + unwindR, z: unitZ };
    const wp1 = { x: printStartX, y: bridgeWebY, z: unitZ };
    const wp2 = { x: printStartX, y: printWebY, z: unitZ };
    const wp3 = { x: printEndX, y: printWebY, z: unitZ };
    const wp4 = { x: turretX - 0.25, y: bridgeBottomY - 0.26, z: unitZ };
    const wp5 = { x: turretX, y: foilRollY + foilRollR, z: unitZ };

    inner.add(
      createWebRibbon(wp0, wp1, webW, m.webWhiteMat),
      createWebRibbon(wp1, wp2, webW, m.webWhiteMat),
      createWebRibbon(wp2, wp3, webW, m.webSilverMat),
      createWebRibbon(wp3, wp4, webW, m.webSilverMat),
      createWebRibbon(wp4, wp5, webW, m.webSilverMat)
    );
  }

  return { build };
})();
