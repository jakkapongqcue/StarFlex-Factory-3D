// ============================================================================
// Module: src/builders/machines/laminating/bobst-lb10.model.js
// Procedural 3D Model for BOBST NOVALAM D 800 / NOVALAM 800 (LB-10):
//   - Faithfully models both front (NOVALAM 800) & 3/4 rear/side (NOVA D 800 LAMINATOR) views
//   - Wide open central walk-through archway under beveled white drying bridge
//   - Front: NOVALAM 800 + [LB-10] + ■ BOBST; Rear: NOVA D 800 LAMINATOR; Ends: ■ BOBST
//   - Under-bridge chrome drying roller bed & recessed LED lights
//   - Left bay: Console block (HMI + viewing window), 2-door gray enclosure, white archway pillar,
//     & inner multi-roller chrome nip stack with translucent white substrate film roll
//   - Right bay: Amber beacon cabinet with flush HMI & E-Stop strip, open mechanical roller bay,
//     rear 3-door chamfered cabinet, & outer cast-gray turret with glossy printed pouch film roll
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.LaminatingModels = window.Starflex3D.Builders.LaminatingModels || {};

window.Starflex3D.Builders.LaminatingModels.BobstLB10 = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createWebRibbon } = window.Starflex3D.Builders.MachineCommon;
  const {
    createBobstMaterials,
    getBobstHeaderTexture,
    getBobstEndLogoTexture,
    getBobstHMITexture
  } = window.Starflex3D.Builders.LaminatingModels.Common;

  function addCautionTriangle(parent, x, y, z, rotY = 0) {
    const tri = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.14, 3),
      new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    );
    tri.rotation.y = rotY;
    tri.position.set(x, y, z);
    parent.add(tri);
  }

  function build(inner, L, W, H, mats, item) {
    const machineCode = (item && item.code) ? item.code : "LB-10";
    const m = createBobstMaterials(mats);

    const bedH = 0.10;
    const frontZ = W * 0.24;
    const rearZ = -W * 0.24;
    const midZ = 0;

    // -------------------------------------------------------------------------
    // 1. SPLIT BASE PLINTHS (Keeping Central Walk-Through Archway Open!)
    // -------------------------------------------------------------------------
    [-L * 0.34, L * 0.34].forEach(bx => {
      const subBed = new THREE.Mesh(new THREE.BoxGeometry(L * 0.30, bedH, W * 0.88), m.plinthMat);
      subBed.position.set(bx, bedH * 0.5, midZ);
      addEdges(subBed, 0x1e293b, 0.6);
      inner.add(subBed);
    });

    // -------------------------------------------------------------------------
    // 2. BEVELED OVERHEAD DRYING BRIDGE & UNDER-BRIDGE CHROME ROLLER BED
    // -------------------------------------------------------------------------
    const bridgeStartX = -L * 0.43;
    const bridgeEndX = L * 0.45;
    const bridgeL = bridgeEndX - bridgeStartX;
    const bridgeCenterX = (bridgeStartX + bridgeEndX) * 0.5;
    const bridgeBottomY = H * 0.62;
    const bridgeH = H * 0.19;
    const bridgeY = bridgeBottomY + bridgeH * 0.5;
    const bridgeD = W * 0.72;

    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(bridgeCenterX, bridgeY, midZ);
    inner.add(bridgeGroup);

    const bridgeBody = new THREE.Mesh(
      new THREE.BoxGeometry(bridgeL, bridgeH, bridgeD),
      m.studioWhiteMat
    );
    bridgeBody.castShadow = true;
    addEdges(bridgeBody, 0x94a3b8, 0.6);
    bridgeGroup.add(bridgeBody);

    // Front Fascia (+Z): NOVALAM 800 + [LB-10] + ■ BOBST
    const frontHeaderTex = getBobstHeaderTexture(machineCode, "lb10");
    if (frontHeaderTex) {
      const frontPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(bridgeL * 0.995, bridgeH * 0.94),
        new THREE.MeshBasicMaterial({ map: frontHeaderTex })
      );
      frontPlane.position.set(0, 0, bridgeD * 0.5 + 0.012);
      bridgeGroup.add(frontPlane);
    }

    // Rear Fascia (-Z): NOVA D 800 LAMINATOR + ■ BOBST (Image 2)
    const rearHeaderTex = getBobstHeaderTexture(machineCode, "rear_d800");
    if (rearHeaderTex) {
      const rearPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(bridgeL * 0.995, bridgeH * 0.94),
        new THREE.MeshBasicMaterial({ map: rearHeaderTex })
      );
      rearPlane.rotation.y = Math.PI;
      rearPlane.position.set(0, 0, -bridgeD * 0.5 - 0.012);
      bridgeGroup.add(rearPlane);
    }

    // Both End Caps (-X and +X): ■ BOBST Logo (Image 2)
    const endLogoTex = getBobstEndLogoTexture();
    if (endLogoTex) {
      const endLogoMat = new THREE.MeshBasicMaterial({ map: endLogoTex });
      [-1, 1].forEach(dir => {
        const endPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(bridgeD * 0.92, bridgeH * 0.90),
          endLogoMat
        );
        endPlane.rotation.y = dir * (Math.PI / 2);
        endPlane.position.set(dir * (bridgeL * 0.5 + 0.012), 0, 0);
        bridgeGroup.add(endPlane);
      });
    }

    // Exposed Under-Bridge Chrome Drying Support Rollers + White LED Work Light
    const underBedSpan = L * 0.36;
    const numUnderRolls = 10;
    for (let r = 0; r < numUnderRolls; r++) {
      const rx = -underBedSpan * 0.45 + (r * underBedSpan * 0.90) / (numUnderRolls - 1);
      const uRoll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, bridgeD * 0.65, 10),
        m.chromeMat
      );
      uRoll.rotation.x = Math.PI / 2;
      uRoll.position.set(rx - bridgeCenterX, -bridgeH * 0.5 - 0.03, 0);
      bridgeGroup.add(uRoll);
    }

    const underLed = new THREE.Mesh(
      new THREE.BoxGeometry(L * 0.32, 0.03, 0.14),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc })
    );
    underLed.position.set(-bridgeCenterX, -bridgeH * 0.5 - 0.01, bridgeD * 0.32);
    bridgeGroup.add(underLed);

    // -------------------------------------------------------------------------
    // 3. LEFT STATION (Console Block + 2-Door Gray Enclosure + Inner Nip Rollers)
    // -------------------------------------------------------------------------
    const towerH = bridgeBottomY - bedH;

    // 4A. Far-left White Upright Console Block (top HMI + lower glass viewing window)
    const leftBlockX = -L * 0.40;
    const leftBlockW = L * 0.085;
    const leftBlockD = W * 0.58;
    const leftBlock = new THREE.Mesh(
      new THREE.BoxGeometry(leftBlockW, towerH, leftBlockD),
      m.studioWhiteMat
    );
    leftBlock.position.set(leftBlockX, bedH + towerH * 0.5, midZ + 0.20);
    addEdges(leftBlock, 0x94a3b8, 0.6);
    inner.add(leftBlock);

    const lbFrontZ = midZ + 0.20 + leftBlockD * 0.5;
    const lbHmiTex = getBobstHMITexture("BOPP / CPP · COATER");
    if (lbHmiTex) {
      const lbHmi = new THREE.Mesh(
        new THREE.PlaneGeometry(leftBlockW * 0.72, 0.34),
        new THREE.MeshBasicMaterial({ map: lbHmiTex })
      );
      lbHmi.position.set(leftBlockX, bedH + towerH * 0.72, lbFrontZ + 0.015);
      inner.add(lbHmi);
    }

    // Black-framed viewing window below screen on left console
    const sightW = leftBlockW * 0.72;
    const sightH = 0.36;
    const sightY = bedH + towerH * 0.38;
    const sightFrame = new THREE.Mesh(new THREE.BoxGeometry(sightW + 0.06, sightH + 0.06, 0.04), m.darkFrameMat);
    sightFrame.position.set(leftBlockX, sightY, lbFrontZ + 0.01);
    const sightGlass = new THREE.Mesh(new THREE.BoxGeometry(sightW, sightH, 0.025), m.glassWindowMat);
    sightGlass.position.set(leftBlockX, sightY, lbFrontZ + 0.025);
    inner.add(sightFrame, sightGlass);

    // 4B. Metallic Gray Enclosure Bay with 2 Side-by-Side Glass Doors
    const grayBayX = -L * 0.315;
    const grayBayW = L * 0.09;
    const grayBayH = towerH * 0.90;
    const grayBay = new THREE.Mesh(
      new THREE.BoxGeometry(grayBayW, grayBayH, W * 0.52),
      m.midGrayMat
    );
    grayBay.position.set(grayBayX, bedH + grayBayH * 0.5, midZ + 0.12);
    addEdges(grayBay, 0x475569, 0.6);
    inner.add(grayBay);

    const gbFrontZ = midZ + 0.12 + (W * 0.52) * 0.5;
    [-0.22, 0.22].forEach(dx => {
      const dFrame = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.48, 0.04), m.darkFrameMat);
      dFrame.position.set(grayBayX + dx, bedH + grayBayH * 0.56, gbFrontZ + 0.01);
      const dGlass = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.42, 0.025), m.glassWindowMat);
      dGlass.position.set(grayBayX + dx, bedH + grayBayH * 0.56, gbFrontZ + 0.022);
      inner.add(dFrame, dGlass);
    });

    // 4C. Left Central White Archway Column (+Z side, flanking central opening)
    const leftPillarX = -L * 0.225;
    const pillarW = 0.54;
    const leftPillar = new THREE.Mesh(
      new THREE.BoxGeometry(pillarW, towerH, W * 0.54),
      m.studioWhiteMat
    );
    leftPillar.position.set(leftPillarX, bedH + towerH * 0.5, midZ + 0.14);
    leftPillar.castShadow = true;
    addEdges(leftPillar, 0x94a3b8, 0.6);
    inner.add(leftPillar);
    addCautionTriangle(inner, leftPillarX, bedH + towerH * 0.42, midZ + 0.14 + (W * 0.54) * 0.5 + 0.015);

    // 4D. Exposed Inner-Left Chrome Roller Stack & Translucent White Film Roll
    // (Visible inside the open central archway, matching Images 1 & 2)
    const innerLeftX = -L * 0.17;
    const rollWidth = W * 0.42;
    const whiteRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, rollWidth, 24),
      m.clearFilmMat
    );
    whiteRoll.rotation.x = Math.PI / 2;
    whiteRoll.position.set(innerLeftX, bedH + 0.58, midZ);
    addEdges(whiteRoll, 0xcbd5e1, 0.45);
    inner.add(whiteRoll);

    for (let cr = 0; cr < 3; cr++) {
      const cRoll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, rollWidth, 16),
        m.chromeMat
      );
      cRoll.rotation.x = Math.PI / 2;
      cRoll.position.set(innerLeftX, bedH + 1.30 + cr * 0.38, midZ);
      inner.add(cRoll);
    }

    // Clear substrate film web rising vertically from white roll into overhead bridge
    const pLeftBottom = { x: innerLeftX, y: bedH + 0.94, z: midZ };
    const pLeftTop = { x: innerLeftX, y: bridgeBottomY - 0.10, z: midZ };
    inner.add(createWebRibbon(pLeftBottom, pLeftTop, rollWidth * 0.92, m.clearFilmMat));

    // Tilted auxiliary touchscreen pedestal tucked inside right corner of central archway (Image 2)
    const auxPedestal = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.18, 0.36), m.studioWhiteMat);
    auxPedestal.rotation.z = -0.5;
    auxPedestal.position.set(L * 0.175, bedH + 0.95, frontZ * 0.35);
    inner.add(auxPedestal);

    // -------------------------------------------------------------------------
    // 5. RIGHT STATION (Amber Beacon Cabinet + Open Roller Bay + Rear 3-Door Cab + Exposed Turret)
    // -------------------------------------------------------------------------
    // 5A. Right Central White Cabinet Tower (Amber beacon + button strip + flush HMI)
    const rightCabX = L * 0.22;
    const rightCabW = L * 0.11;
    const rightCabD = W * 0.44;
    const rightCabZ = frontZ - 0.10;

    const rightCab = new THREE.Mesh(
      new THREE.BoxGeometry(rightCabW, towerH, rightCabD),
      m.studioWhiteMat
    );
    rightCab.position.set(rightCabX, bedH + towerH * 0.5, rightCabZ);
    rightCab.castShadow = true;
    addEdges(rightCab, 0x94a3b8, 0.6);
    inner.add(rightCab);

    const rcFrontZ = rightCabZ + rightCabD * 0.5;

    // Amber safety beacon on top-left corner of Right Cabinet
    const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12), m.chromeMat);
    bBase.position.set(rightCabX - rightCabW * 0.30, bedH + towerH + 0.025, rcFrontZ - 0.15);
    const bDome = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.13, 12), m.beaconOrangeMat);
    bDome.position.set(rightCabX - rightCabW * 0.30, bedH + towerH + 0.11, rcFrontZ - 0.15);
    inner.add(bBase, bDome);

    // Flush widescreen touchscreen HMI + Horizontal button strip directly above screen
    const rcHmiTex = getBobstHMITexture("MET-PET 12µm / LLDPE 35µm");
    if (rcHmiTex) {
      const rcScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(rightCabW * 0.66, 0.42),
        new THREE.MeshBasicMaterial({ map: rcHmiTex })
      );
      rcScreen.position.set(rightCabX + 0.05, bedH + towerH * 0.56, rcFrontZ + 0.015);
      inner.add(rcScreen);
    }

    // Horizontal button bar above screen
    const btnColors = [0xdc2626, 0x22c55e, 0x38bdf8, 0xf59e0b, 0x1e293b];
    btnColors.forEach((col, bi) => {
      const btn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.02, 10),
        new THREE.MeshBasicMaterial({ color: col })
      );
      btn.rotation.x = Math.PI / 2;
      btn.position.set(rightCabX - 0.22 + bi * 0.11, bedH + towerH * 0.72, rcFrontZ + 0.015);
      inner.add(btn);
    });
    addCautionTriangle(inner, rightCabX, bedH + towerH * 0.34, rcFrontZ + 0.015);

    // 5B. Far-Right Slim White Front End Column
    const farRightColX = L * 0.415;
    const farRightCol = new THREE.Mesh(
      new THREE.BoxGeometry(0.50, towerH, rightCabD * 0.85),
      m.studioWhiteMat
    );
    farRightCol.position.set(farRightColX, bedH + towerH * 0.5, rightCabZ);
    addEdges(farRightCol, 0x94a3b8, 0.6);
    inner.add(farRightCol);
    addCautionTriangle(inner, farRightColX, bedH + towerH * 0.42, rightCabZ + (rightCabD * 0.85) * 0.5 + 0.015);

    // 5C. Exposed Mechanical Nip & Wire-Mesh Guard Bay (between Right Cab & Far-Right Col)
    const meshGuardX = L * 0.32;
    const guardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(L * 0.09, towerH * 0.75, 0.06),
      m.darkFrameMat
    );
    guardFrame.position.set(meshGuardX, bedH + towerH * 0.38, rcFrontZ - 0.35);
    inner.add(guardFrame);

    for (let mr = 0; mr < 3; mr++) {
      const mRoll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.10, W * 0.36, 14),
        m.chromeMat
      );
      mRoll.rotation.x = Math.PI / 2;
      mRoll.position.set(meshGuardX, bedH + 0.65 + mr * 0.50, midZ);
      inner.add(mRoll);
    }

    // 5D. Rear 3-Door Chamfered Electrical Cabinet (-Z side, Image 2)
    const rearCabX = L * 0.31;
    const rearCabW = L * 0.16;
    const rearCabD = W * 0.36;
    const rearCab = new THREE.Mesh(
      new THREE.BoxGeometry(rearCabW, towerH, rearCabD),
      m.studioWhiteMat
    );
    rearCab.position.set(rearCabX, bedH + towerH * 0.5, rearZ + 0.15);
    addEdges(rearCab, 0x94a3b8, 0.6);
    inner.add(rearCab);

    // Vertical panel door seams & black T-latches on rear cabinet
    const rcBackZ = rearZ + 0.15 - rearCabD * 0.5;
    [-rearCabW * 0.16, rearCabW * 0.16].forEach(sx => {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.015, towerH * 0.88, 0.02), m.midGrayMat);
      seam.position.set(rearCabX + sx, bedH + towerH * 0.5, rcBackZ - 0.008);
      inner.add(seam);
    });

    // -------------------------------------------------------------------------
    // 6. OUTER RIGHT EXPOSED TURRET & GLOSSY PRINTED PACKAGING ROLL (+X end, Image 2!)
    // -------------------------------------------------------------------------
    const turretX = L * 0.445;
    const turretSidePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, towerH * 0.88, W * 0.58),
      m.midGrayMat
    );
    turretSidePlate.position.set(turretX, bedH + towerH * 0.44, midZ - 0.15);
    addEdges(turretSidePlate, 0x475569, 0.6);
    inner.add(turretSidePlate);

    // Glossy silver/yellow/charcoal printed packaging film roll at bottom spindle
    const printedRoll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.36, rollWidth, 24),
      m.printedGoldMat
    );
    printedRoll.rotation.x = Math.PI / 2;
    printedRoll.position.set(turretX + 0.16, bedH + 0.54, rearZ * 0.25);
    addEdges(printedRoll, 0xd97706, 0.45);
    inner.add(printedRoll);

    // Upper mirror-chrome guide & coating rollers on outer turret
    for (let tr = 0; tr < 3; tr++) {
      const tRoll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.10, 0.10, rollWidth, 14),
        m.chromeMat
      );
      tRoll.rotation.x = Math.PI / 2;
      tRoll.position.set(turretX + 0.12, bedH + 1.25 + tr * 0.42, rearZ * 0.25);
      inner.add(tRoll);
    }

    // Printed web rising vertically UP from outer bottom roll to top turret rollers
    const pTurretBot = { x: turretX + 0.16, y: bedH + 0.90, z: rearZ * 0.25 };
    const pTurretTop = { x: turretX + 0.12, y: bedH + 2.15, z: rearZ * 0.25 };
    inner.add(createWebRibbon(pTurretBot, pTurretTop, rollWidth * 0.92, m.printedGoldMat));

    // Horizontal printed web returning under bridge ceiling across machine
    const pBridgeEntry = { x: bridgeStartX + 0.8, y: bridgeBottomY - 0.10, z: midZ };
    const pBridgeExit = { x: bridgeEndX - 0.8, y: bridgeBottomY - 0.10, z: midZ };
    inner.add(createWebRibbon(pBridgeEntry, pBridgeExit, rollWidth * 0.90, m.printedGoldMat));
  }

  return { build };
})();
