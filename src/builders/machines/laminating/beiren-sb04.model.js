// ============================================================================
// Module: src/builders/machines/laminating/beiren-sb04.model.js
// Procedural 3D Model for Shaanxi Beiren SLII400 Dry Laminating Line (SB-04):
//   - Overhead drying tunnel bridge with signature black left fascia cap
//     (Shaanxi Beiren logo) + white/dark-trim bridge fascia ("SLII400")
//   - Front 3-digit Red LED speed display ("000") + touchscreen & gauge pillar
//   - Coating bay with twin glass inspection doors & exposed teal/chrome nip rollers
//   - Left & Middle & Far-Right raised-plinth gray double-door cabinets
//     with vertical black center strips, amber beacons, & "SLII400" text
//   - Left unwind roll with dark acrylic safety shield & right exposed turret arms
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.LaminatingModels = window.Starflex3D.Builders.LaminatingModels || {};

window.Starflex3D.Builders.LaminatingModels.BeirenSB04 = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createWebRibbon } = window.Starflex3D.Builders.MachineCommon;

  let _cachedBridgeTex = null;
  function getBeirenBridgeTexture() {
    if (_cachedBridgeTex) return _cachedBridgeTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Right main bridge: Off-white studio top + dark charcoal bottom trim
    ctx.fillStyle = "#eef2f6";
    ctx.fillRect(0, 0, 1024, 128);
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 102, 1024, 26);

    // Left Signature Black Overhang Cap
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 295, 128);
    ctx.fillStyle = "#475569";
    ctx.fillRect(295, 0, 4, 128);

    // Shaanxi Beiren Logo (Geometric emblem + text) on black cap
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(46, 62);
    ctx.lineTo(74, 46);
    ctx.lineTo(102, 62);
    ctx.lineTo(74, 78);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 26px "Segoe UI", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("BEIREN", 116, 50);
    ctx.font = 'bold 13px "Segoe UI", sans-serif';
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("SHAANXI BEIREN", 116, 76);

    // Blue ID badge next to left column
    ctx.fillStyle = "#0284c7";
    if (typeof ctx.roundRect === "function") {
      ctx.beginPath();
      ctx.roundRect(350, 32, 108, 44, 6);
      ctx.fill();
    } else {
      ctx.fillRect(350, 32, 108, 44);
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 24px "Montserrat", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("SB-04", 404, 55);

    // Prominent "SLII400" typography on right fascia
    ctx.fillStyle = "#1e293b";
    ctx.font = 'bold 42px "Georgia", "Times New Roman", serif';
    ctx.textAlign = "right";
    ctx.fillText("SLII400", 920, 62);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedBridgeTex = tex;
    return tex;
  }

  let _cachedSpeedTex = null;
  function getBeirenSpeedDisplayTexture() {
    if (_cachedSpeedTex) return _cachedSpeedTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 128, 80);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 124, 76);

    ctx.fillStyle = "#ef4444";
    ctx.font = 'bold 42px "Consolas", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("000", 64, 42);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedSpeedTex = tex;
    return tex;
  }

  let _cachedPillarTex = null;
  function getBeirenControlPillarTexture() {
    if (_cachedPillarTex) return _cachedPillarTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#eef2f6";
    ctx.fillRect(0, 0, 160, 360);

    // Top Touchscreen HMI frame
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(24, 24, 112, 92);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(30, 30, 100, 80);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(36, 40, 88, 12);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(36, 62, 54, 8);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(36, 80, 72, 10);

    // Lower Gauge & Pushbutton Plate
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(24, 134, 112, 160);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 134, 112, 160);

    // 3 Pressure Gauges
    for (let g = 0; g < 3; g++) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(46 + g * 34, 162, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Colorful Pushbuttons & E-Stop
    const btnCols = ["#ef4444", "#22c55e", "#f59e0b", "#38bdf8", "#dc2626", "#1e293b"];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = btnCols[r * 3 + c];
        ctx.beginPath();
        ctx.arc(46 + c * 34, 215 + r * 38, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    _cachedPillarTex = tex;
    return tex;
  }

  let _cachedSLTextTex = null;
  function getSLII400DoorBadgeTexture() {
    if (_cachedSLTextTex) return _cachedSLTextTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 42px "Georgia", "Times New Roman", serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SLII400", 128, 32);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedSLTextTex = tex;
    return tex;
  }

  function build(inner, L, W, H, mats) {
    // Materials matching Shaanxi Beiren SLII400 aesthetic
    const offWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xeef2f6,
      roughness: 0.38,
      metalness: 0.12
    });
    const steelGrayMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.45,
      metalness: 0.30
    });
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.25
    });
    const chromeMat = mats.chromeRoll || new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.12,
      metalness: 0.95
    });
    const tealNipMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6, // Iconic mint-teal rubber coating cylinder in photo
      roughness: 0.45,
      metalness: 0.1
    });
    const maroonRollMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.5,
      metalness: 0.15
    });
    const kraftRollMat = new THREE.MeshStandardMaterial({
      color: 0xd6bfa2, // Tan/kraft substrate roll on left unwind
      roughness: 0.45,
      metalness: 0.08
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.40,
      roughness: 0.1,
      metalness: 0.1
    });
    const safetyAcrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.72,
      roughness: 0.2
    });
    const beaconOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.7
    });
    const filmWebMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.25,
      metalness: 0.15,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    const frontZ = W * 0.24;
    const rearZ = -W * 0.18;
    const midZ = 0;

    // Helper: Build Beiren gray/white double-door plinth cabinet with vertical black divider & amber beacon
    function buildDoubleDoorCabinet(cx, cz, cw, ch, cd, showBadge = false, withBeacon = true) {
      const cabGroup = new THREE.Group();
      cabGroup.position.set(cx, 0, cz);
      inner.add(cabGroup);

      // Raised off-white base plinth
      const plinthH = 0.18;
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(cw + 0.12, plinthH, cd + 0.10), offWhiteMat);
      plinth.position.y = plinthH * 0.5;
      addEdges(plinth, 0x94a3b8, 0.5);
      cabGroup.add(plinth);

      // Off-white outer housing surround
      const surround = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, cd), offWhiteMat);
      surround.position.y = plinthH + ch * 0.5;
      surround.castShadow = true;
      addEdges(surround, 0x94a3b8, 0.6);
      cabGroup.add(surround);

      // Sleek medium steel-gray double doors recessed on front face
      const doorW = cw * 0.86;
      const doorH = ch * 0.90;
      const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.03), steelGrayMat);
      doorPanel.position.set(0, plinthH + ch * 0.5, cd * 0.5 + 0.01);
      cabGroup.add(doorPanel);

      // Signature vertical black center accent handle strip
      const centerBar = new THREE.Mesh(new THREE.BoxGeometry(0.10, doorH * 0.98, 0.045), darkTrimMat);
      centerBar.position.set(0, plinthH + ch * 0.5, cd * 0.5 + 0.02);
      cabGroup.add(centerBar);

      // Horizontal door seam line
      const midSeam = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.015, 0.04), darkTrimMat);
      midSeam.position.set(0, plinthH + ch * 0.55, cd * 0.5 + 0.02);
      cabGroup.add(midSeam);

      if (showBadge) {
        const badgeTex = getSLII400DoorBadgeTexture();
        if (badgeTex) {
          const badgePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(doorW * 0.36, 0.14),
            new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })
          );
          badgePlane.position.set(-doorW * 0.26, plinthH + ch * 0.34, cd * 0.5 + 0.032);
          cabGroup.add(badgePlane);
        }
      }

      if (withBeacon) {
        const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 10), chromeMat);
        bBase.position.set(-cw * 0.32, plinthH + ch + 0.025, cd * 0.35);
        const bDome = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.13, 12), beaconOrangeMat);
        bDome.position.set(-cw * 0.32, plinthH + ch + 0.11, cd * 0.35);
        cabGroup.add(bBase, bDome);
      }

      return cabGroup;
    }

    // -------------------------------------------------------------------------
    // 1. LEFT UNWIND ROLL, DARK SAFETY SHIELD & STANDALONE SLII400 CABINET
    // -------------------------------------------------------------------------
    const leftCabX = -L * 0.36;
    const leftCabW = L * 0.14;
    const leftCabH = 1.85;
    const leftCabD = W * 0.46;
    buildDoubleDoorCabinet(leftCabX, frontZ, leftCabW, leftCabH, leftCabD, true, true);

    // Unwind Roll & Dark Safety Shield behind/left of standalone cabinet
    const unwindX = -L * 0.44;
    const unwindRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, W * 0.44, 24),
      kraftRollMat
    );
    unwindRoll.rotation.x = Math.PI / 2;
    unwindRoll.position.set(unwindX, 1.35, midZ - 0.15);
    addEdges(unwindRoll, 0x94a3b8, 0.4);
    inner.add(unwindRoll);

    // Dark tinted safety enclosure shield at far left edge
    const safetyShield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.35, W * 0.55), safetyAcrylicMat);
    safetyShield.position.set(-L * 0.48, 0.85, midZ - 0.15);
    addEdges(safetyShield, 0x0f172a, 0.6);
    inner.add(safetyShield);

    // -------------------------------------------------------------------------
    // 2. OVERHEAD DRYING TUNNEL BRIDGE (x = -0.31*L to +0.34*L)
    // -------------------------------------------------------------------------
    const bridgeStartX = -L * 0.31;
    const bridgeEndX = L * 0.34;
    const bridgeL = bridgeEndX - bridgeStartX;
    const bridgeCenterX = (bridgeStartX + bridgeEndX) * 0.5;
    const bridgeBottomY = H * 0.68;
    const bridgeH = H * 0.20;
    const bridgeY = bridgeBottomY + bridgeH * 0.5;
    const bridgeD = W * 0.72;

    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(bridgeCenterX, bridgeY, midZ);
    inner.add(bridgeGroup);

    const bridgeBody = new THREE.Mesh(new THREE.BoxGeometry(bridgeL, bridgeH, bridgeD), offWhiteMat);
    bridgeBody.castShadow = true;
    addEdges(bridgeBody, 0x94a3b8, 0.6);
    bridgeGroup.add(bridgeBody);

    // Front Fascia Texture (Black Beiren Left Cap + SLII400)
    const bridgeTex = getBeirenBridgeTexture();
    if (bridgeTex) {
      const fascia = new THREE.Mesh(
        new THREE.PlaneGeometry(bridgeL * 0.995, bridgeH * 0.96),
        new THREE.MeshBasicMaterial({ map: bridgeTex })
      );
      fascia.position.set(0, 0, bridgeD * 0.5 + 0.012);
      bridgeGroup.add(fascia);
    }

    // Bright Under-Bridge White LED Strip Lights
    [-bridgeL * 0.25, bridgeL * 0.22].forEach(lx => {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(bridgeL * 0.34, 0.04, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      led.position.set(lx, -bridgeH * 0.5 - 0.01, bridgeD * 0.25);
      bridgeGroup.add(led);
    });

    // -------------------------------------------------------------------------
    // 3. COATING BAY & EXPOSED TEAL/CHROME NIP ROLLERS + MAIN CONTROL PILLAR
    // -------------------------------------------------------------------------
    const pillarH = bridgeBottomY;
    const coatX = -L * 0.19;

    // Coating housing upper block with 2 large glass inspection doors
    const coatCab = new THREE.Mesh(new THREE.BoxGeometry(L * 0.14, pillarH * 0.52, W * 0.56), steelGrayMat);
    coatCab.position.set(coatX, pillarH * 0.72, midZ);
    addEdges(coatCab, 0x475569, 0.6);
    inner.add(coatCab);

    const coatFrontZ = midZ + (W * 0.56) * 0.5;
    [-0.28, 0.28].forEach(dx => {
      const gFrame = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.62, 0.04), darkTrimMat);
      gFrame.position.set(coatX + dx, pillarH * 0.72, coatFrontZ + 0.01);
      const gPane = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.54, 0.025), glassMat);
      gPane.position.set(coatX + dx, pillarH * 0.72, coatFrontZ + 0.022);
      inner.add(gFrame, gPane);
    });

    // Lower Open Nip Stack in front of coating unit:
    // High-mirror Chrome Cylinder (bottom) + Teal Rubber Nip Roller (middle) + Maroon Roller (top)
    const nipW = W * 0.48;
    const botChromeRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, nipW, 20), chromeMat);
    botChromeRoll.rotation.x = Math.PI / 2;
    botChromeRoll.position.set(coatX, 0.48, midZ);

    const tealNipRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, nipW, 20), tealNipMat);
    tealNipRoll.rotation.x = Math.PI / 2;
    tealNipRoll.position.set(coatX, 0.82, midZ + 0.04);

    const topMaroonRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, nipW, 16), maroonRollMat);
    topMaroonRoll.rotation.x = Math.PI / 2;
    topMaroonRoll.position.set(coatX, 1.15, midZ - 0.04);
    inner.add(botChromeRoll, tealNipRoll, topMaroonRoll);

    // Main Central Control Pillar (-0.06*L) with Red "000" LED & Touchscreen HMI
    const mainPillarX = -L * 0.06;
    const mainPillarW = 0.88;
    const mainPillarD = W * 0.62;
    const mainPillar = new THREE.Mesh(
      new THREE.BoxGeometry(mainPillarW, pillarH, mainPillarD),
      offWhiteMat
    );
    mainPillar.position.set(mainPillarX, pillarH * 0.5, midZ + 0.08);
    mainPillar.castShadow = true;
    addEdges(mainPillar, 0x94a3b8, 0.6);
    inner.add(mainPillar);

    const mpFrontZ = midZ + 0.08 + mainPillarD * 0.5;
    const speedTex = getBeirenSpeedDisplayTexture();
    if (speedTex) {
      const speedMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.42, 0.24),
        new THREE.MeshBasicMaterial({ map: speedTex })
      );
      speedMesh.position.set(mainPillarX, pillarH * 0.90, mpFrontZ + 0.015);
      inner.add(speedMesh);
    }

    const pillarTex = getBeirenControlPillarTexture();
    if (pillarTex) {
      const ctrlMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(mainPillarW * 0.72, pillarH * 0.56),
        new THREE.MeshBasicMaterial({ map: pillarTex })
      );
      ctrlMesh.position.set(mainPillarX, pillarH * 0.52, mpFrontZ + 0.015);
      inner.add(ctrlMesh);
    }

    // -------------------------------------------------------------------------
    // 4. MIDDLE OPEN ROLLER BAY & MIDDLE FOREGROUND DOUBLE-DOOR CABINET
    // -------------------------------------------------------------------------
    // Horizontal chrome idler rollers inside central/right bay
    [L * 0.06, L * 0.19].forEach(rx => {
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const roller = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, nipW, 14),
          chromeMat
        );
        roller.rotation.x = Math.PI / 2;
        roller.position.set(rx, 0.65 + rIdx * 0.55, midZ - 0.10);
        inner.add(roller);
      }
    });

    // Middle foreground double-door cabinet
    const midCabX = L * 0.12;
    buildDoubleDoorCabinet(midCabX, frontZ, L * 0.12, 1.48, W * 0.36, false, true);

    // -------------------------------------------------------------------------
    // 5. RIGHT SUPPORT PILLAR, EXPOSED TURRET ARMS & FAR-RIGHT CABINET
    // -------------------------------------------------------------------------
    const rightPillarX = L * 0.295;
    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, pillarH, W * 0.58),
      offWhiteMat
    );
    rightPillar.position.set(rightPillarX, pillarH * 0.5, midZ + 0.06);
    addEdges(rightPillar, 0x94a3b8, 0.6);
    inner.add(rightPillar);

    // Exposed Far-Right Rewinder Turret Arms + Yellow Guide Frame
    const rewindX = L * 0.385;
    const rewindRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, W * 0.40, 20),
      chromeMat
    );
    rewindRoll.rotation.x = Math.PI / 2;
    rewindRoll.position.set(rewindX, 1.15, midZ);
    inner.add(rewindRoll);

    const yellowBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.07, W * 0.44),
      beaconOrangeMat
    );
    yellowBar.position.set(rewindX, 1.15, midZ);
    inner.add(yellowBar);

    // Far-Right Standalone End Cabinet (matching photo right edge)
    const farRightX = L * 0.455;
    buildDoubleDoorCabinet(farRightX, frontZ * 0.5, L * 0.08, 1.38, W * 0.34, false, true);

    // -------------------------------------------------------------------------
    // 6. CONTINUOUS FILM WEB PATH THROUGH BRIDGE & NIP ROLLERS
    // -------------------------------------------------------------------------
    const webW = nipW * 0.88;
    const wp0 = { x: unwindX, y: 1.71, z: midZ - 0.10 };
    const wp1 = { x: coatX, y: 1.00, z: midZ };
    const wp2 = { x: coatX, y: bridgeBottomY - 0.12, z: midZ };
    const wp3 = { x: rightPillarX, y: bridgeBottomY - 0.12, z: midZ };
    const wp4 = { x: rewindX, y: 1.47, z: midZ };

    inner.add(createWebRibbon(wp0, wp1, webW, filmWebMat));
    inner.add(createWebRibbon(wp1, wp2, webW, filmWebMat));
    inner.add(createWebRibbon(wp2, wp3, webW, filmWebMat));
    inner.add(createWebRibbon(wp3, wp4, webW, filmWebMat));
  }

  return { build };
})();
