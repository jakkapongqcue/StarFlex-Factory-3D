// ============================================================================
// Module: src/builders/machines/laminating/bobst-lb09.model.js
// Procedural 3D Model for BOBST VISIONLAM 800 (1LB-09 / LB-09):
//   - Twin-Archway Multi-Station Studio Configuration matching LB-09 photo
//   - Left unwind enclosure (with sight window) + metallic gray coating module (2x2 windows)
//   - Twin chamfered off-white front cabinets forming open central walk-through archway
//   - Cantilevered angled HMI touchscreen console & E-Stop on right central cabinet
//   - Open multi-roller chrome nip bay + slim right pillar with amber beacon & 3 safety decals
//   - Continuous overhead bridge (spanning left end to right pillar) with VISIONLAM 800 & BOBST
//   - Independent lower far-right rewinder turret station (no overhead bridge)
//   - Patterned blue-and-white packaging film web running overhead into nip and across to rewinder
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.LaminatingModels = window.Starflex3D.Builders.LaminatingModels || {};

window.Starflex3D.Builders.LaminatingModels.BobstLB09 = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createWebRibbon } = window.Starflex3D.Builders.MachineCommon;
  const {
    createBobstMaterials,
    getBobstHeaderTexture,
    getBobstHMITexture
  } = window.Starflex3D.Builders.LaminatingModels.Common;

  function build(inner, L, W, H, mats, item) {
    const machineCode = (item && item.code) ? item.code : "1LB-09";
    const m = createBobstMaterials(mats);

    // Reference footprint dimensions
    const bedW = L * 0.96;
    const bedD = W * 0.88;
    const bedH = 0.12;

    // Subtle dark base plinth rails under cabinets
    const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(bedW, bedH, bedD), m.plinthMat);
    basePlinth.position.y = bedH * 0.5;
    addEdges(basePlinth, 0x1e293b, 0.7);
    inner.add(basePlinth);

    const frontZ = W * 0.24;
    const rearZ = -W * 0.22;
    const midZ = (frontZ + rearZ) * 0.5;

    // -------------------------------------------------------------------------
    // 1. LEFT END UNWIND & COATING MODULE (x = -0.47*L to -0.29*L)
    // -------------------------------------------------------------------------
    const leftH = H * 0.64;

    // 1A. Far-left white unwind block with black-framed horizontal sight glass
    const unwindX = -L * 0.43;
    const unwindW = L * 0.085;
    const unwindBlock = new THREE.Mesh(
      new THREE.BoxGeometry(unwindW, leftH, W * 0.62),
      m.studioWhiteMat
    );
    unwindBlock.position.set(unwindX, bedH + leftH * 0.5, midZ + 0.25);
    addEdges(unwindBlock, 0x94a3b8, 0.6);
    inner.add(unwindBlock);

    // Viewing window cutout frame + glass + white inner roll visible inside
    const winW = unwindW * 0.72;
    const winH = leftH * 0.22;
    const winY = bedH + leftH * 0.46;
    const winZ = midZ + 0.25 + (W * 0.62) * 0.5;

    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.08, winH + 0.08, 0.05), m.darkFrameMat);
    winFrame.position.set(unwindX, winY, winZ + 0.01);
    const winGlass = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.03), m.glassWindowMat);
    winGlass.position.set(unwindX, winY, winZ + 0.025);
    const innerUnwindRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, winW * 0.85, 16),
      m.clearFilmMat
    );
    innerUnwindRoll.rotation.z = Math.PI / 2;
    innerUnwindRoll.position.set(unwindX, winY, winZ - 0.04);
    inner.add(winFrame, winGlass, innerUnwindRoll);

    // Vertical metallic gray accent trim between unwind and coating bay
    const trimCol = new THREE.Mesh(new THREE.BoxGeometry(0.18, leftH, W * 0.64), m.midGrayMat);
    trimCol.position.set(-L * 0.375, bedH + leftH * 0.5, midZ + 0.25);
    inner.add(trimCol);

    // 1B. Coating Enclosure Tower with 2x2 grid of 4 glass inspection windows
    const coatX = -L * 0.325;
    const coatW = L * 0.09;
    const coatH = leftH * 0.88;
    const coatBlock = new THREE.Mesh(
      new THREE.BoxGeometry(coatW, coatH, W * 0.56),
      m.midGrayMat
    );
    coatBlock.position.set(coatX, bedH + coatH * 0.5, midZ + 0.15);
    addEdges(coatBlock, 0x475569, 0.6);
    inner.add(coatBlock);

    const coatFrontZ = midZ + 0.15 + (W * 0.56) * 0.5;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const cwX = coatX - 0.18 + c * 0.36;
        const cwY = bedH + coatH * 0.36 + r * 0.34;
        const smallFrame = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.04), m.darkFrameMat);
        smallFrame.position.set(cwX, cwY, coatFrontZ + 0.01);
        const smallGlass = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.03), m.glassWindowMat);
        smallGlass.position.set(cwX, cwY, coatFrontZ + 0.022);
        inner.add(smallFrame, smallGlass);
      }
    }

    // -------------------------------------------------------------------------
    // 2. TWIN CHAMFERED CENTRAL CABINETS FORMING OPEN CENTRAL ARCHWAY
    // -------------------------------------------------------------------------
    const cabW = L * 0.135;
    const cabH = H * 0.50;
    const cabD = W * 0.44;
    const cabZ = frontZ - 0.05;

    function buildChamferedCabinet(cx, flankSide) {
      const cabGroup = new THREE.Group();
      cabGroup.position.set(cx, bedH, cabZ);
      inner.add(cabGroup);

      const mainCab = new THREE.Mesh(new THREE.BoxGeometry(cabW, cabH, cabD), m.studioWhiteMat);
      mainCab.position.y = cabH * 0.5;
      mainCab.castShadow = true;
      addEdges(mainCab, 0x94a3b8, 0.6);
      cabGroup.add(mainCab);

      // Chamfered side cheeks
      const wingW = 0.12;
      [-cabW * 0.5 - wingW * 0.5, cabW * 0.5 + wingW * 0.5].forEach(wx => {
        const cheek = new THREE.Mesh(new THREE.BoxGeometry(wingW, cabH * 0.96, cabD * 0.86), m.studioWhiteMat);
        cheek.position.set(wx, cabH * 0.5, -0.05);
        addEdges(cheek, 0x94a3b8, 0.5);
        cabGroup.add(cheek);
      });

      // Signature vertical center door seam down front face
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.015, cabH * 0.92, 0.02), m.midGrayMat);
      seam.position.set(0, cabH * 0.5, cabD * 0.5 + 0.005);
      cabGroup.add(seam);

      // Perforated dark gray electrical louver rack on archway-facing flank
      const rackX = flankSide * (cabW * 0.5 + wingW + 0.08);
      const rack = new THREE.Mesh(new THREE.BoxGeometry(0.16, cabH * 0.68, cabD * 0.72), m.darkFrameMat);
      rack.position.set(rackX, cabH * 0.52, -0.10);
      addEdges(rack, 0x1e293b, 0.6);
      cabGroup.add(rack);

      return cabGroup;
    }

    // Left Central Cabinet (flank faces right +1 into central archway)
    buildChamferedCabinet(-L * 0.20, 1);

    // Right Central Cabinet (flank faces left -1 into central archway)
    const rightCabGroup = buildChamferedCabinet(L * 0.10, -1);

    // Mounted Cantilevered Angled HMI Touchscreen + E-Stop on Right Central Cabinet
    const hmiArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.28), m.chromeMat);
    hmiArm.position.set(0.10, cabH * 0.52, cabD * 0.5 + 0.10);
    rightCabGroup.add(hmiArm);

    const hmiTilt = new THREE.Group();
    hmiTilt.position.set(0.10, cabH * 0.52, cabD * 0.5 + 0.26);
    hmiTilt.rotation.x = -0.35; // Angled upward for standing operator
    rightCabGroup.add(hmiTilt);

    const panelW = 0.68;
    const panelH = 0.44;
    const panelHousing = new THREE.Mesh(new THREE.BoxGeometry(panelW, panelH, 0.06), m.studioWhiteMat);
    addEdges(panelHousing, 0x64748b, 0.6);
    hmiTilt.add(panelHousing);

    // Upper slim pushbutton bar with red E-Stop mushroom
    const eStop = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.04, 12), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    eStop.rotation.x = Math.PI / 2;
    eStop.position.set(-panelW * 0.25, panelH * 0.36, 0.04);
    const startBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 12), m.safetyGreenMat);
    startBtn.rotation.x = Math.PI / 2;
    startBtn.position.set(-panelW * 0.12, panelH * 0.36, 0.04);
    hmiTilt.add(eStop, startBtn);

    const hmiTex = getBobstHMITexture("BOPP 20µm / CPP 25µm");
    if (hmiTex) {
      const hmiPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(panelW * 0.88, panelH * 0.64),
        new THREE.MeshBasicMaterial({ map: hmiTex })
      );
      hmiPlane.position.set(0, -panelH * 0.10, 0.034);
      hmiTilt.add(hmiPlane);
    }

    // Rear Archway Crossbars (visible inside central open bay)
    const archBack = new THREE.Mesh(new THREE.BoxGeometry(L * 0.35, 0.22, 0.20), m.darkFrameMat);
    archBack.position.set(-L * 0.05, bedH + cabH * 0.72, rearZ);
    inner.add(archBack);

    // -------------------------------------------------------------------------
    // 3. RIGHT MULTI-ROLLER CHROME NIP BAY & SLIM PILLAR (x = +0.18*L to +0.29*L)
    // -------------------------------------------------------------------------
    const nipX = L * 0.21;
    const nipRollW = W * 0.44;
    for (let nr = 0; nr < 4; nr++) {
      const roller = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, nipRollW, 18),
        m.chromeMat
      );
      roller.rotation.x = Math.PI / 2;
      roller.position.set(nipX, bedH + 0.55 + nr * 0.44, midZ + 0.15);
      addEdges(roller, 0xcbd5e1, 0.35);
      inner.add(roller);
    }

    // Slim Right Pillar Column
    const pillarX = L * 0.265;
    const pillarW = L * 0.048;
    const pillarH = leftH;
    const rightPillar = new THREE.Mesh(
      new THREE.BoxGeometry(pillarW, pillarH, W * 0.48),
      m.studioWhiteMat
    );
    rightPillar.position.set(pillarX, bedH + pillarH * 0.5, frontZ - 0.10);
    addEdges(rightPillar, 0x94a3b8, 0.6);
    inner.add(rightPillar);

    // Amber Safety Beacon mounted near top of Slim Right Pillar
    const pillarFrontZ = frontZ - 0.10 + (W * 0.48) * 0.5;
    const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), m.chromeMat);
    beaconBase.position.set(pillarX, bedH + pillarH * 0.88, pillarFrontZ + 0.04);
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.12, 12), m.beaconOrangeMat);
    beacon.position.set(pillarX, bedH + pillarH * 0.88 + 0.08, pillarFrontZ + 0.04);
    inner.add(beaconBase, beacon);

    // Three circular colorful safety / PPE decals on front face of Slim Pillar
    const decalColors = [0x0284c7, 0xfacc15, 0x1d4ed8];
    decalColors.forEach((col, di) => {
      const decal = new THREE.Mesh(
        new THREE.CircleGeometry(0.045, 16),
        new THREE.MeshBasicMaterial({ color: col })
      );
      decal.position.set(pillarX - 0.11 + di * 0.11, bedH + pillarH * 0.34, pillarFrontZ + 0.012);
      inner.add(decal);
    });

    // -------------------------------------------------------------------------
    // 4. CONTINUOUS OVERHEAD DRYING BRIDGE (Spans x = -0.47*L to +0.29*L only!)
    // -------------------------------------------------------------------------
    const bridgeStartX = -L * 0.475;
    const bridgeEndX = L * 0.29;
    const bridgeL = bridgeEndX - bridgeStartX;
    const bridgeCenterX = (bridgeStartX + bridgeEndX) * 0.5;
    const bridgeBottomY = bedH + leftH;
    const bridgeH = H * 0.19;
    const bridgeY = bridgeBottomY + bridgeH * 0.5;
    const bridgeD = W * 0.72;

    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(bridgeCenterX, bridgeY, midZ + 0.10);
    inner.add(bridgeGroup);

    const bridgeBody = new THREE.Mesh(
      new THREE.BoxGeometry(bridgeL, bridgeH, bridgeD),
      m.studioWhiteMat
    );
    bridgeBody.castShadow = true;
    addEdges(bridgeBody, 0x94a3b8, 0.6);
    bridgeGroup.add(bridgeBody);

    // High-resolution STUDIO VISIONLAM 800 + BOBST + 1LB-09 Fascia Texture
    const headerTex = getBobstHeaderTexture(machineCode, "lb09");
    if (headerTex) {
      const headerPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(bridgeL * 0.995, bridgeH * 0.94),
        new THREE.MeshBasicMaterial({ map: headerTex })
      );
      headerPlane.position.set(0, 0, bridgeD * 0.5 + 0.012);
      bridgeGroup.add(headerPlane);
    }

    // Subtle under-bridge LED inspection strip lights
    for (let li = -1; li <= 1; li++) {
      const ledBar = new THREE.Mesh(
        new THREE.BoxGeometry(bridgeL * 0.22, 0.04, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xf8fafc })
      );
      ledBar.position.set(li * (bridgeL * 0.30), -bridgeH * 0.5 - 0.01, bridgeD * 0.20);
      bridgeGroup.add(ledBar);
    }

    // -------------------------------------------------------------------------
    // 5. FAR-RIGHT INDEPENDENT REWINDER TURRET MODULE (x = +0.31*L to +0.48*L)
    // Lower profile chassis, NO overhead bridge above it (exact match to photo!)
    // -------------------------------------------------------------------------
    const rewindH = H * 0.54;
    const rewindMechX = L * 0.35;
    const rewindMechW = L * 0.085;

    // Dark gray mechanical rewinder frame on left half of rewinder module
    const rewindMech = new THREE.Mesh(
      new THREE.BoxGeometry(rewindMechW, rewindH * 0.78, W * 0.54),
      m.midGrayMat
    );
    rewindMech.position.set(rewindMechX, bedH + (rewindH * 0.78) * 0.5, midZ + 0.10);
    addEdges(rewindMech, 0x475569, 0.6);
    inner.add(rewindMech);

    // Upper chrome winding drum + lay-on arm atop mechanical frame
    const topWindingRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, W * 0.48, 18),
      m.chromeMat
    );
    topWindingRoll.rotation.x = Math.PI / 2;
    topWindingRoll.position.set(rewindMechX, bedH + rewindH * 0.86, midZ + 0.10);
    inner.add(topWindingRoll);

    // Active Rewound Printed Blue-and-White Roll inside Rewinder
    const rewoundRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, nipRollW * 0.90, 24),
      m.bluePatternWebMat
    );
    rewoundRoll.rotation.x = Math.PI / 2;
    rewoundRoll.position.set(rewindMechX + 0.12, bedH + rewindH * 0.55, midZ + 0.10);
    addEdges(rewoundRoll, 0x0284c7, 0.5);
    inner.add(rewoundRoll);

    // Far-right clean chamfered white terminal enclosure capping off the machine
    const endCapX = L * 0.44;
    const endCapW = L * 0.095;
    const endCap = new THREE.Mesh(
      new THREE.BoxGeometry(endCapW, cabH, cabD),
      m.studioWhiteMat
    );
    endCap.position.set(endCapX, bedH + cabH * 0.5, cabZ);
    endCap.castShadow = true;
    addEdges(endCap, 0x94a3b8, 0.6);
    inner.add(endCap);

    // Vertical center seam on far-right terminal cabinet
    const endSeam = new THREE.Mesh(new THREE.BoxGeometry(0.015, cabH * 0.92, 0.02), m.midGrayMat);
    endSeam.position.set(endCapX, bedH + cabH * 0.5, cabZ + cabD * 0.5 + 0.005);
    inner.add(endSeam);

    // -------------------------------------------------------------------------
    // 7. BLUE-AND-WHITE PATTERNED PACKAGING FILM WEB ROUTING
    // Threads horizontally under bridge, cascades diagonally over nip rollers,
    // and travels across gap into far-right turret rewinder!
    // -------------------------------------------------------------------------
    const webW = nipRollW * 0.88;
    const webZ = midZ + 0.15;
    const bridgeWebY = bridgeBottomY - 0.16;

    // Guide rollers for blue web overhead transition
    const guideCoords = [
      { x: -L * 0.25, y: bridgeWebY },
      { x: L * 0.16, y: bridgeWebY },
      { x: nipX, y: bedH + 1.87 },
      { x: nipX + 0.38, y: bedH + 1.50 }
    ];
    guideCoords.forEach(gc => {
      const gRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, webW + 0.10, 12), m.chromeMat);
      gRoll.rotation.x = Math.PI / 2;
      gRoll.position.set(gc.x, gc.y, webZ);
      inner.add(gRoll);
    });

    // Segment 1: Horizontal patterned web running from unwind under bridge to nip drop
    const wp0 = { x: coatX, y: bridgeWebY, z: webZ };
    const wp1 = { x: L * 0.16, y: bridgeWebY, z: webZ };
    inner.add(createWebRibbon(wp0, wp1, webW, m.bluePatternWebMat));

    // Segment 2: Cascade diagonally down into multi-roller chrome nip bay
    const wp2 = { x: nipX, y: bedH + 1.87, z: webZ };
    inner.add(createWebRibbon(wp1, wp2, webW, m.bluePatternWebMat));

    // Segment 3: Vertical wrap through chrome nip stack
    const wp3 = { x: nipX, y: bedH + 1.00, z: webZ };
    inner.add(createWebRibbon(wp2, wp3, webW, m.bluePatternWebMat));

    // Segment 4: Exit diagonal across open span into far-right rewinder turret
    const wp4 = { x: rewindMechX, y: bedH + rewindH * 0.86, z: webZ };
    inner.add(createWebRibbon(wp3, wp4, webW, m.bluePatternWebMat));
  }

  return { build };
})();
