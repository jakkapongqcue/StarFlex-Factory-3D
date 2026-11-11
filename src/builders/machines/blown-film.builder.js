// ============================================================================
// Module: src/builders/machines/blown-film.builder.js
// Procedural 3D Builder for the High-Tower Blown Film Extrusion Line (1BF-01).
// Ported from StarFlexERP3D.github.io/js/machines/blown-film.js.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.BlownFilm = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  function buildBlowFilmTower(inner, L, W, H, mats, accentMat) {
    const whiteSteel = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const darkSteel = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const charcoalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const slateMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.25 });
    const blueAccentMat = new THREE.MeshLambertMaterial({ color: 0x1e40af });
    const slatMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const whiteBubbleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.60,
      roughness: 0.22,
      metalness: 0.05
    });
    const whiteWebMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    function createFilmWebSpan(x1, y1, x2, y2, zCenter, webWidth, colorHex = 0xffffff, opacityVal = 0.95) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const webMat = new THREE.MeshLambertMaterial({
        color: colorHex,
        transparent: opacityVal !== undefined && opacityVal < 1.0,
        opacity: opacityVal !== undefined ? opacityVal : 0.88,
        side: THREE.DoubleSide
      });
      const webMesh = new THREE.Mesh(new THREE.BoxGeometry(len, 0.035, webWidth), webMat);
      webMesh.position.set((x1 + x2) * 0.5, (y1 + y2) * 0.5, zCenter);
      webMesh.rotation.z = angle;
      return webMesh;
    }

    function createActiveFilmRollAssembly(radius, width, filmColorHex = 0xffffff, stripeColorHex = 0xf1f5f9, coreColorHex = 0x1e293b) {
      const rollAssembly = new THREE.Group();
      rollAssembly.rotation.x = Math.PI / 2;

      const bodyMat = new THREE.MeshLambertMaterial({ color: filmColorHex });
      const stripeMat = new THREE.MeshLambertMaterial({ color: stripeColorHex });
      const coreMat = new THREE.MeshLambertMaterial({ color: coreColorHex });
      const hubMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.3 });

      const rollBody = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 24), bodyMat);
      rollAssembly.add(rollBody);

      const coreShaft = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.30, radius * 0.30, width + 0.36, 16), coreMat);
      rollAssembly.add(coreShaft);

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.11, width - 0.06, 0.06), stripeMat);
        bar.position.set(Math.cos(angle) * (radius + 0.015), 0, Math.sin(angle) * (radius + 0.015));
        bar.rotation.y = -angle;
        rollAssembly.add(bar);
      }

      [-width / 2 - 0.03, width / 2 + 0.03].forEach(function (yEnd) {
        const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.75, 0.04, 0.14), hubMat);
        spoke1.position.y = yEnd;
        rollAssembly.add(spoke1);

        const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, radius * 1.75), stripeMat);
        spoke2.position.y = yEnd;
        rollAssembly.add(spoke2);
      });

      return { group: rollAssembly, bodyMesh: rollBody };
    }

    function createSingleResinSack(len = 1.05, wid = 0.60, hgt = 0.20) {
      const sackGrp = new THREE.Group();
      const topMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
      const sideMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
      const btmMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      const boxMaterials = [sideMat, sideMat, topMat, btmMat, sideMat, sideMat];
      const seamMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
      const tapeMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });

      const bodyBox = new THREE.Mesh(new THREE.BoxGeometry(len * 0.94, hgt * 0.88, wid * 0.90), boxMaterials);
      bodyBox.position.y = hgt * 0.5;
      sackGrp.add(bodyBox);

      const sideGeo = new THREE.CylinderGeometry(hgt * 0.44, hgt * 0.44, len * 0.86, 8);
      const side1 = new THREE.Mesh(sideGeo, sideMat);
      side1.rotation.z = Math.PI / 2;
      side1.position.set(0, hgt * 0.5, wid * 0.42);
      sackGrp.add(side1);

      const side2 = new THREE.Mesh(sideGeo, sideMat);
      side2.rotation.z = Math.PI / 2;
      side2.position.set(0, hgt * 0.5, -wid * 0.42);
      sackGrp.add(side2);

      const seamGeo = new THREE.BoxGeometry(len * 0.04, hgt * 0.35, wid * 0.88);
      const seamL = new THREE.Mesh(seamGeo, seamMat);
      seamL.position.set(-len * 0.485, hgt * 0.5, 0);
      sackGrp.add(seamL);

      const seamR = new THREE.Mesh(seamGeo, seamMat);
      seamR.position.set(len * 0.485, hgt * 0.5, 0);
      sackGrp.add(seamR);

      const tapeGeo = new THREE.BoxGeometry(len * 0.02, hgt * 0.42, wid * 0.90);
      const tapeL = new THREE.Mesh(tapeGeo, tapeMat);
      tapeL.position.set(-len * 0.495, hgt * 0.5, 0);
      sackGrp.add(tapeL);

      const tapeR = new THREE.Mesh(tapeGeo, tapeMat);
      tapeR.position.set(len * 0.495, hgt * 0.5, 0);
      sackGrp.add(tapeR);

      return sackGrp;
    }

    // 1. Tower Structure (4 Vertical Columns & Mezzanine Deck)
    const colPositions = [
      [-1.3, -2.1],
      [2.3, -2.1],
      [-1.3, 1.3],
      [2.3, 1.3]
    ];
    colPositions.forEach(function (p) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.24, 9.6, 0.24), whiteSteel);
      col.position.set(p[0], 4.8, p[1]);
      addEdges(col, 0x94a3b8, 0.6);
      inner.add(col);
    });

    // Top Mezzanine Haul-Off Platform Deck (y = 8.8)
    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 3.6), whiteSteel);
    topDeck.position.set(0.5, 8.8, -0.4);
    addEdges(topDeck, 0x94a3b8, 0.6);
    inner.add(topDeck);

    // Top Deck Safety Handrails (Royal Blue)
    const frontRail = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.9, 0.08), blueAccentMat);
    frontRail.position.set(0.5, 9.35, 1.36);
    inner.add(frontRail);
    const backRail = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.9, 0.08), blueAccentMat);
    backRail.position.set(0.5, 9.35, -2.16);
    inner.add(backRail);
    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 3.6), blueAccentMat);
    rightRail.position.set(2.36, 9.35, -0.4);
    inner.add(rightRail);

    // 2. Extrusion Die Head & Aerodynamic Air Ring (Center Base x = 0.5, z = -0.4)
    const diePedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.55, 20), slateMat);
    diePedestal.position.set(0.5, 0.35, -0.4);
    inner.add(diePedestal);

    const dieHead = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.65, 20), darkSteel);
    dieHead.position.set(0.5, 0.85, -0.4);
    inner.add(dieHead);

    // High-Efficiency Dual-Lip Air Ring (Cooling Ring in Royal Blue with silver air lip)
    const airRingBody = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.25, 0.42, 24), blueAccentMat);
    airRingBody.position.set(0.5, 1.25, -0.4);
    inner.add(airRingBody);

    const airRingLip = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.20, 0.12, 24), chromeMat);
    airRingLip.position.set(0.5, 1.48, -0.4);
    inner.add(airRingLip);

    // 4 Circular Air Distribution Blower Inlets
    for (let a = 0; a < 4; a++) {
      const ang = (a * Math.PI) / 2 + Math.PI / 4;
      const inlet = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 12), chromeMat);
      inlet.rotation.z = Math.PI / 2;
      inlet.rotation.y = ang;
      inlet.position.set(0.5 + Math.cos(ang) * 1.35, 1.25, -0.4 + Math.sin(ang) * 1.35);
      inner.add(inlet);
    }

    // 3. Lower Stabilization Cage & Spiral Helix (Above Air Ring y = 1.6 to 3.8)
    [1.85, 2.75, 3.65].forEach(function (yRing) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.05, 8, 20), blueAccentMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0.5, yRing, -0.4);
      inner.add(ring);
    });

    for (let r = 0; r < 8; r++) {
      const rAng = (r * Math.PI) / 4;
      const vRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.9, 10), chromeMat);
      vRoller.position.set(0.5 + Math.cos(rAng) * 1.08, 2.75, -0.4 + Math.sin(rAng) * 1.08);
      inner.add(vRoller);
    }

    const spiralHelix = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 1.8, 16, 1, true),
      new THREE.MeshLambertMaterial({
        color: 0x1e40af,
        wireframe: true
      })
    );
    spiralHelix.position.set(0.5, 2.75, -0.4);
    inner.add(spiralHelix);

    // 4. Mid-Level Motorized Calibration Basket (IBC Sizing Cage y = 4.4 to 6.2)
    const calibFrame1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 2.5), whiteSteel);
    calibFrame1.position.set(0.5, 4.6, -0.4);
    inner.add(calibFrame1);

    const calibFrame2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 2.5), whiteSteel);
    calibFrame2.position.set(0.5, 5.8, -0.4);
    inner.add(calibFrame2);

    for (let arm = 0; arm < 8; arm++) {
      const aAng = (arm * Math.PI) / 4;
      const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.08), blueAccentMat);
      armMesh.position.set(0.5 + Math.cos(aAng) * 1.05, 5.2, -0.4 + Math.sin(aAng) * 1.05);
      armMesh.rotation.y = -aAng;
      inner.add(armMesh);

      const cRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 10), chromeMat);
      cRoller.position.set(0.5 + Math.cos(aAng) * 0.88, 5.2, -0.4 + Math.sin(aAng) * 0.88);
      inner.add(cRoller);
    }

    // Ultrasonic Thickness Gauge Track Ring
    const gaugeTrack = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.06, 8, 24), blueAccentMat);
    gaugeTrack.rotation.x = Math.PI / 2;
    gaugeTrack.position.set(0.5, 6.4, -0.4);
    inner.add(gaugeTrack);

    const sensorHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.32), darkSteel);
    sensorHead.position.set(0.5 + 1.22, 6.4, -0.4);
    inner.add(sensorHead);

    // 5. Translucent White Tubular Film Bubble
    const bubbleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.88, 0.94, 7.3, 24, 1, true),
      whiteBubbleMat
    );
    bubbleMesh.position.set(0.5, 5.15, -0.4);
    inner.add(bubbleMesh);

    // 6. Top Haul-off Unit: A-Frame Collapsing Boards & Nip Rollers (y = 7.3 to 9.4)
    const boardLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 1.8), whiteSteel);
    boardLeft.position.set(0.05, 7.95, -0.4);
    boardLeft.rotation.z = -0.32;
    inner.add(boardLeft);

    const boardRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 1.8), whiteSteel);
    boardRight.position.set(0.95, 7.95, -0.4);
    boardRight.rotation.z = 0.32;
    inner.add(boardRight);

    for (let s = -0.65; s <= 0.65; s += 0.28) {
      const slatL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.7), slatMat);
      slatL.position.set(0.12, 7.95 + s, -0.4);
      slatL.rotation.z = -0.32;
      inner.add(slatL);

      const slatR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.7), slatMat);
      slatR.position.set(0.88, 7.95 + s, -0.4);
      slatR.rotation.z = 0.32;
      inner.add(slatR);
    }

    // Top Haul-off Driven Nip Rollers
    const nip1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.0, 14), chromeMat);
    nip1.rotation.x = Math.PI / 2;
    nip1.position.set(0.38, 9.15, -0.4);
    inner.add(nip1);

    const nip2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.0, 14), darkSteel);
    nip2.rotation.x = Math.PI / 2;
    nip2.position.set(0.62, 9.15, -0.4);
    inner.add(nip2);

    const haulOffMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.55, 12), blueAccentMat);
    haulOffMotor.position.set(0.5, 9.75, 0.85);
    inner.add(haulOffMotor);

    // 7. Descending Vertical Zig-Zag Dancer Web Path
    const topWebBridge = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.95), whiteWebMat);
    topWebBridge.rotation.x = Math.PI / 2;
    topWebBridge.position.set(-0.65, 9.25, -0.4);
    inner.add(topWebBridge);

    [-1.6, -2.4].forEach(function (lx) {
      const upright = new THREE.Mesh(new THREE.BoxGeometry(0.16, 6.8, 0.16), whiteSteel);
      upright.position.set(lx, 5.8, -1.45);
      inner.add(upright);
      const uprightFront = new THREE.Mesh(new THREE.BoxGeometry(0.16, 6.8, 0.16), whiteSteel);
      uprightFront.position.set(lx, 5.8, 0.65);
      inner.add(uprightFront);
    });

    const zigZagLevels = [8.2, 7.0, 5.8, 4.6, 3.4];
    const zigZagXs = [-1.75, -2.25, -1.75, -2.25, -1.75];

    for (let z = 0; z < zigZagLevels.length; z++) {
      const zzRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.0, 12), chromeMat);
      zzRoller.rotation.x = Math.PI / 2;
      zzRoller.position.set(zigZagXs[z], zigZagLevels[z], -0.4);
      inner.add(zzRoller);
    }

    const webSeg1 = createFilmWebSpan(-0.65, 9.25, -1.75, 8.2, -0.4, 1.9, 0xffffff, 0.95);
    const webSeg2 = createFilmWebSpan(-1.75, 8.2, -2.25, 7.0, -0.4, 1.9, 0xffffff, 0.95);
    const webSeg3 = createFilmWebSpan(-2.25, 7.0, -1.75, 5.8, -0.4, 1.9, 0xffffff, 0.95);
    const webSeg4 = createFilmWebSpan(-1.75, 5.8, -2.25, 4.6, -0.4, 1.9, 0xffffff, 0.95);
    const webSeg5 = createFilmWebSpan(-2.25, 4.6, -1.75, 3.4, -0.4, 1.9, 0xffffff, 0.95);
    const webSeg6 = createFilmWebSpan(-1.75, 3.4, -3.2, 1.75, -0.4, 1.9, 0xffffff, 0.95);
    inner.add(webSeg1, webSeg2, webSeg3, webSeg4, webSeg5, webSeg6);

    const dancerBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.65, 2.2), slateMat);
    dancerBox.position.set(-2.0, 2.2, -0.4);
    inner.add(dancerBox);

    // 8. Dual Turret Surface Winder Station (Left Side x = -3.8, z = -0.4)
    [-1.5, 0.7].forEach(function (wz) {
      const sideCab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.32), whiteSteel);
      sideCab.position.set(-3.8, 1.3, wz);
      addEdges(sideCab, 0x94a3b8, 0.6);
      inner.add(sideCab);

      const blueAccent = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.62, 0.34), blueAccentMat);
      blueAccent.position.set(-2.65, 1.3, wz);
      inner.add(blueAccent);

      const blueAccentBack = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.62, 0.34), blueAccentMat);
      blueAccentBack.position.set(-4.95, 1.3, wz);
      inner.add(blueAccentBack);
    });

    const winderBed = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.32, 2.4), slateMat);
    winderBed.position.set(-3.8, 0.16, -0.4);
    addEdges(winderBed, 0x64748b, 0.6);
    inner.add(winderBed);

    const hmiConsole = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.12), darkSteel);
    hmiConsole.position.set(-2.55, 1.6, 0.88);
    inner.add(hmiConsole);
    const hmiScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.48),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    hmiScreen.position.set(-2.55, 1.6, 0.95);
    inner.add(hmiScreen);

    const layOnRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.05, 14), darkSteel);
    layOnRoller.rotation.x = Math.PI / 2;
    layOnRoller.position.set(-2.95, 1.45, -0.4);
    inner.add(layOnRoller);

    const standbyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.15, 12), chromeMat);
    standbyShaft.rotation.x = Math.PI / 2;
    standbyShaft.position.set(-4.5, 2.1, -0.4);
    inner.add(standbyShaft);

    // Active Wound Blown Film Roll (Pure White)
    const woundRoll = createActiveFilmRollAssembly(0.72, 1.95, 0xffffff, 0xf1f5f9, 0x1e293b);
    woundRoll.group.position.set(-3.8, 1.35, -0.4);
    inner.add(woundRoll.group);

    // 9. Co-Extrusion System: 3 Parallel Extruders & Dosing Feeder Towers (Right Side)
    const extBaseBed = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 3.2), slateMat);
    extBaseBed.position.set(3.7, 0.14, -0.4);
    addEdges(extBaseBed, 0x64748b, 0.6);
    inner.add(extBaseBed);

    const barrelZs = [-1.45, -0.4, 0.65];
    barrelZs.forEach(function (bz) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.6, 16), blueAccentMat);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(3.2, 0.72, bz);
      inner.add(barrel);

      for (let hb = 2.2; hb <= 4.2; hb += 0.5) {
        const hRing = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.08, 14), chromeMat);
        hRing.rotation.z = Math.PI / 2;
        hRing.position.set(hb, 0.72, bz);
        inner.add(hRing);
      }

      const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.85, 0.55), darkSteel);
      gearbox.position.set(4.8, 0.75, bz);
      inner.add(gearbox);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.75, 14), charcoalMat);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(5.5, 0.75, bz);
      inner.add(motor);

      const throat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.35, 12), blueAccentMat);
      throat.position.set(3.8, 1.05, bz);
      inner.add(throat);

      const mainBlender = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.65, 14), chromeMat);
      mainBlender.position.set(3.8, 1.55, bz);
      inner.add(mainBlender);

      const feederOffsets = [
        [-0.12, -0.12],
        [0.12, -0.12],
        [-0.12, 0.12],
        [0.12, 0.12]
      ];
      feederOffsets.forEach(function (fo) {
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.85, 10), chromeMat);
        tube.position.set(3.8 + fo[0], 2.3, bz + fo[1]);
        inner.add(tube);
        const tubeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 10), blueAccentMat);
        tubeCap.position.set(3.8 + fo[0], 2.76, bz + fo[1]);
        inner.add(tubeCap);
      });

      const meltPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 12), chromeMat);
      meltPipe.rotation.z = Math.PI / 2;
      const pipeZMid = (bz + -0.4) / 2;
      meltPipe.position.set(1.3, 0.78, pipeZMid);
      meltPipe.rotation.y = Math.atan2(-0.4 - bz, 0.5 - 1.9);
      inner.add(meltPipe);
    });

    // 10. 3 Horizontal Resin Bags Stacked
    const sackStackGroup = new THREE.Group();
    sackStackGroup.position.set(3.8, 0.0, 1.9);

    const sack1 = createSingleResinSack(1.05, 0.60, 0.20);
    sack1.position.set(-0.55, 0.0, 0.0);
    sack1.rotation.y = 0.05;
    sackStackGroup.add(sack1);

    const sack2 = createSingleResinSack(1.05, 0.60, 0.20);
    sack2.position.set(0.55, 0.0, 0.08);
    sack2.rotation.y = -0.06;
    sackStackGroup.add(sack2);

    const sack3 = createSingleResinSack(1.05, 0.60, 0.20);
    sack3.position.set(0.02, 0.20, 0.04);
    sack3.rotation.y = 0.02;
    sackStackGroup.add(sack3);

    inner.add(sackStackGroup);
  }

  return {
    buildBlowFilmTower
  };
})();
