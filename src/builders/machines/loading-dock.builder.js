// ============================================================================
// Module: src/builders/machines/loading-dock.builder.js
// Procedural 3D Builder for the Loading Dock, Raised Platforms, Entrance
// Stairs & Sloped Vehicle Ramp, Double Doors, and Starflex Logistics Trucks.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.LoadingDock = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.MachineCommon;

  function createContainerTruckMesh(options) {
    if (window.Starflex3D.Builders.Common && typeof window.Starflex3D.Builders.Common.createContainerTruckMesh === "function") {
      return window.Starflex3D.Builders.Common.createContainerTruckMesh(options);
    }
    return new THREE.Group();
  }

  function buildLoadingDockTrucks(group, r, mats) {
    const wallZ = -r.d * 0.5;
    const westX = -r.w * 0.5;
    const numBays = 7;
    const bayW = r.w / numBays;
    const dockH = 1.25;
    const dockDepth = 4.65;

    const ldMats = {
      concreteGray: new THREE.MeshStandardMaterial({ color: 0x7e8b9b, roughness: 0.65, metalness: 0.05 }),
      whiteConcrete: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65, metalness: 0.05 }),
      rubberBumper: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.1 }),
      darkShutter: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.35 }),
      orangeHighSpeed: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.15 }),
      boothWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1 }),
      darkGlass: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.18, metalness: 0.4 }),
      redLed: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.75,
        roughness: 0.2
      }),
      redPallet: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55 }),
      forkliftCyan: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.25 }),
      carBlack: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.25, metalness: 0.5 }),
      silverCanopy: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35, metalness: 0.45 })
    };

    // 1. Raised White Concrete Loading Dock Platform across Bays 2..7 (ชานชาลาคอนกรีตยกพื้นสูงสีขาว 1.25m)
    const mainPlatW = r.w - bayW;
    const mainPlatX = westX + bayW + mainPlatW * 0.5;
    const mainPlatZ = wallZ + dockDepth * 0.5;
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(mainPlatW, dockH, dockDepth),
      ldMats.concreteGray
    );
    platform.position.set(mainPlatX, dockH * 0.5, mainPlatZ);
    platform.receiveShadow = true;
    platform.castShadow = true;
    addEdges(platform, 0x475569, 0.75);
    group.add(platform);

    // Black Rubber Dock Bumpers along the front face of Bays 2..7
    const bumperCount = 12;
    for (let b = 0; b < bumperCount; b++) {
      const bx = mainPlatX - mainPlatW * 0.46 + (mainPlatW * 0.92 * b) / (bumperCount - 1);
      const vBumper = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.58, 0.16),
        ldMats.rubberBumper
      );
      vBumper.position.set(bx, dockH * 0.58, wallZ + dockDepth + 0.08);
      group.add(vBumper);
    }

    // =========================================================================
    // BAY 1: FACTORY ENTRANCE - RAISED LANDING, 2 DOORS, STAIRS & SLOPED RAMP
    // =========================================================================
    const landingW = bayW;
    const landingD = 2.6;
    const landingX = westX + bayW * 0.5;
    const landingZ = wallZ + landingD * 0.5;

    // 1A. Raised Entrance Landing Platform (level with dock and factory interior: dockH = 1.25m)
    const entranceLanding = new THREE.Mesh(
      new THREE.BoxGeometry(landingW, dockH, landingD),
      ldMats.concreteGray
    );
    entranceLanding.position.set(landingX, dockH * 0.5, landingZ);
    addEdges(entranceLanding, 0x475569, 0.75);
    group.add(entranceLanding);

    // 1B. ประตู 2 บาน (Double Entrance Doors sitting on the raised floor at dockH = 1.25m)
    const doorFrameW = 2.45;
    const doorFrameH = 2.6;
    const doorPortal = new THREE.Mesh(
      new THREE.BoxGeometry(doorFrameW, doorFrameH, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.3 })
    );
    doorPortal.position.set(landingX, dockH + doorFrameH * 0.5, wallZ + 0.12);
    group.add(doorPortal);

    // Two door leaves (บานซ้าย & บานขวา)
    const leafW = (doorFrameW - 0.2) * 0.5;
    const leafH = doorFrameH - 0.2;
    [-1, 1].forEach(side => {
      const leafX = landingX + side * (leafW * 0.5 + 0.02);
      const doorLeaf = new THREE.Mesh(
        new THREE.BoxGeometry(leafW, leafH, 0.06),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      doorLeaf.position.set(leafX, dockH + leafH * 0.5 + 0.08, wallZ + 0.14);

      // Large inspection glass window
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(leafW * 0.65, leafH * 0.62, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.6, roughness: 0.1 })
      );
      glass.position.set(0, 0.22, 0);
      doorLeaf.add(glass);

      // Stainless steel push/pull handle
      const hdl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.85, 8),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 })
      );
      hdl.position.set(-side * (leafW * 0.35), 0, 0.06);
      doorLeaf.add(hdl);

      group.add(doorLeaf);
    });

    // Overhead illuminated signboard
    const entranceSign = createSignboardMesh(
      2.5,
      0.48,
      "ทางเข้าโรงงาน",
      "FACTORY ENTRANCE",
      "#0284c7",
      "#ffffff",
      "#38bdf8"
    );
    entranceSign.position.set(landingX, dockH + doorFrameH + 0.3, wallZ + 0.18);
    group.add(entranceSign);

    // Red LED Clock / Security Display
    const ledSign = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.32, 0.12), ldMats.redLed);
    ledSign.position.set(landingX, dockH + doorFrameH + 0.75, wallZ + 0.18);
    group.add(ledSign);

    // 1C. บันไดทางเข้าหลัก (Main Entrance Stairs - descending from Landing down to ground level)
    // มีเฉพาะบันไดพร้อมแก้มบันได (Cheek Walls / Stringers) ซ้าย-ขวา ตามภาพสเก็ตช์
    const stairW = bayW - 0.48;
    const stairRun = 3.5;
    const numStairSteps = 7;
    const stepH = dockH / numStairSteps;
    const stepD = stairRun / numStairSteps;
    const stairStartX = landingX;
    const stairStartZ = wallZ + landingD;
    const stringerThick = 0.24;

    // Side Cheek Walls / Stringers (ครีบข้างบันไดคอนกรีตสองฝั่ง ซ้าย-ขวา)
    const cheekMat = ldMats.whiteConcrete;
    [-stairW * 0.5 - stringerThick * 0.5, stairW * 0.5 + stringerThick * 0.5].forEach(sx => {
      const cheekShape = new THREE.Shape();
      cheekShape.moveTo(0, 0);
      cheekShape.lineTo(0, dockH + 0.18);
      cheekShape.lineTo(stairRun + 0.15, 0.18);
      cheekShape.lineTo(stairRun + 0.15, 0);
      cheekShape.closePath();

      const cheekGeo = new THREE.ExtrudeGeometry(cheekShape, { depth: stringerThick, bevelEnabled: false });
      cheekGeo.rotateY(Math.PI / 2);
      const cheekMesh = new THREE.Mesh(cheekGeo, cheekMat);
      cheekMesh.position.set(stairStartX + sx - stringerThick * 0.5, 0, stairStartZ);
      cheekMesh.castShadow = true;
      cheekMesh.receiveShadow = true;
      addEdges(cheekMesh, 0x94a3b8, 0.7);
      group.add(cheekMesh);
    });

    // Step treads & risers with yellow safety non-slip nosing
    const nosingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let s = 0; s < numStairSteps; s++) {
      const currentH = (numStairSteps - s) * stepH;
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stairW, currentH, stepD * 1.02),
        ldMats.whiteConcrete
      );
      stepMesh.position.set(
        stairStartX,
        currentH * 0.5,
        stairStartZ + (s + 0.5) * stepD
      );
      stepMesh.receiveShadow = true;
      addEdges(stepMesh, 0x94a3b8, 0.6);
      group.add(stepMesh);

      // Yellow safety nosing along the edge of each step
      const nose = new THREE.Mesh(new THREE.BoxGeometry(stairW, 0.025, 0.06), nosingMat);
      nose.position.set(
        stairStartX,
        currentH + 0.013,
        stairStartZ + (s + 1) * stepD - 0.03
      );
      group.add(nose);
    }

    // Yellow safety floor line at the bottom of the stairs
    const bottomLine = new THREE.Mesh(
      new THREE.PlaneGeometry(stairW + 0.6, 0.14),
      nosingMat
    );
    bottomLine.rotation.x = -Math.PI / 2;
    bottomLine.position.set(stairStartX, 0.015, stairStartZ + stairRun + 0.25);
    group.add(bottomLine);

    // Handrails mounted on the left and right cheek walls
    // Slanted rails slope downwards along stair incline: rotation.x = -Math.atan2(stairRun, dockH)
    [-stairW * 0.5 - stringerThick * 0.5, stairW * 0.5 + stringerThick * 0.5].forEach(offX => {
      // Slanted top handrail
      const railMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, Math.hypot(dockH, stairRun), 8),
        ldMats.rubberBumper
      );
      railMesh.position.set(stairStartX + offX, dockH * 0.5 + 0.95, stairStartZ + stairRun * 0.5);
      railMesh.rotation.x = -Math.atan2(stairRun, dockH);
      group.add(railMesh);

      // Slanted intermediate mid-rail
      const midRail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, Math.hypot(dockH, stairRun), 8),
        ldMats.rubberBumper
      );
      midRail.position.set(stairStartX + offX, dockH * 0.5 + 0.52, stairStartZ + stairRun * 0.5);
      midRail.rotation.x = -Math.atan2(stairRun, dockH);
      group.add(midRail);

      // Vertical stanchion posts
      [0.15, stairRun * 0.5, stairRun - 0.15].forEach(postZ => {
        const postH = 0.95;
        const postY = dockH - (postZ / stairRun) * dockH + postH * 0.5 + 0.1;
        const postMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, postH, 0.05), ldMats.rubberBumper);
        postMesh.position.set(stairStartX + offX, postY, stairStartZ + postZ);
        group.add(postMesh);
      });
    });

    // 1D. Handrail in front of dock platform at Bay 2 (contained within Bay 2, without overhanging into stairs)
    const railW = bayW - 0.25;
    const railX = westX + bayW + bayW * 0.5;
    const topRail = new THREE.Mesh(new THREE.BoxGeometry(railW, 0.06, 0.06), ldMats.rubberBumper);
    topRail.position.set(railX, dockH + 0.95, wallZ + dockDepth - 0.12);
    const midRail = new THREE.Mesh(new THREE.BoxGeometry(railW, 0.05, 0.05), ldMats.rubberBumper);
    midRail.position.set(railX, dockH + 0.5, wallZ + dockDepth - 0.12);
    group.add(topRail, midRail);
    for (let p = 0; p <= 3; p++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), ldMats.rubberBumper);
      post.position.set(railX - railW * 0.5 + (railW * p) / 3, dockH + 0.5, wallZ + dockDepth - 0.12);
      group.add(post);
    }

    // 2. Lower Dock Wall Details across the 7 Bays (White Booth, 4 Dark Shutters & 1 Orange High-Speed Door)
    for (let i = 1; i < numBays; i++) {
      const bx = westX + (i + 0.5) * bayW;

      if (i === 1) {
        // Bay 2: White Modular Dock Control Office Booth sitting on the raised dock platform!
        const boothW = 3.55;
        const boothH = 2.55;
        const boothD = 2.5;
        const boothZ = wallZ + boothD * 0.5 + 0.35;
        const booth = new THREE.Mesh(
          new THREE.BoxGeometry(boothW, boothH, boothD),
          ldMats.boothWhite
        );
        booth.position.set(bx, dockH + boothH * 0.5, boothZ);
        booth.castShadow = true;
        addEdges(booth, 0x64748b, 0.8);
        group.add(booth);

        // 4 vertical dark-tinted windows on the front face of the white dock booth
        for (let w = 0; w < 4; w++) {
          const wx = bx - boothW * 0.36 + (boothW * 0.72 * w) / 3;
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.15, 0.08), ldMats.darkGlass);
          win.position.set(wx, dockH + 1.48, boothZ + boothD * 0.5 + 0.02);
          addEdges(win, 0xffffff, 0.9);
          group.add(win);
        }
        // Small AC unit on top of the white dock booth
        const roofAc = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.65), ldMats.whiteConcrete);
        roofAc.position.set(bx + 0.5, dockH + boothH + 0.22, boothZ);
        addEdges(roofAc, 0x64748b, 0.7);
        group.add(roofAc);
      } else {
        // Bays 3..7 (5 Dock Roller Shutter Doors: Bays 3,4,5,7 = Dark Shutter; Bay 6 (i===5) = Orange-Red High-Speed Door!)
        const isOrangeDoor = i === 5;
        const doorW = 3.65;
        const doorH = 3.65;
        const shutter = new THREE.Mesh(
          new THREE.BoxGeometry(doorW, doorH, 0.18),
          isOrangeDoor ? ldMats.orangeHighSpeed : ldMats.darkShutter
        );
        shutter.position.set(bx, dockH + doorH * 0.5, wallZ + 0.25);
        addEdges(shutter, isOrangeDoor ? 0xc2410c : 0x0f172a, 0.85);
        group.add(shutter);

        if (isOrangeDoor) {
          const visionBand = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.85, 0.55, 0.22), ldMats.darkGlass);
          visionBand.position.set(bx, dockH + 1.85, wallZ + 0.25);
          const bottomSkirt = new THREE.Mesh(
            new THREE.BoxGeometry(doorW * 0.98, 0.45, 0.22),
            ldMats.forkliftCyan
          );
          bottomSkirt.position.set(bx, dockH + 0.35, wallZ + 0.25);
          group.add(visionBand, bottomSkirt);
        }

        [-doorW * 0.54, doorW * 0.54].forEach(dx => {
          const pad = new THREE.Mesh(new THREE.BoxGeometry(0.28, doorH + 0.2, 0.38), ldMats.rubberBumper);
          pad.position.set(bx + dx, dockH + doorH * 0.5, wallZ + 0.3);
          group.add(pad);
        });
      }
    }

    // 3. Staged Pallets of Brown Cardboard Cartons across Bays 3, 4, 5 on the Raised Platform
    const palletCount = 11;
    const startPx = westX + bayW * 2.15;
    const spanPx = bayW * 2.75;
    for (let p = 0; p < palletCount; p++) {
      const px = startPx + (spanPx * p) / (palletCount - 1);
      const pz = wallZ + 2.85 + (p % 2) * 0.45;
      const boxH = 0.85 + ((p * 3) % 4) * 0.28;

      const palletBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 1.1), ldMats.rubberBumper);
      palletBase.position.set(px, dockH + 0.07, pz);
      const carton = new THREE.Mesh(new THREE.BoxGeometry(1.02, boxH, 1.02), mats.cartonBox);
      carton.position.set(px, dockH + 0.14 + boxH * 0.5, pz);
      addEdges(carton, 0x92400e, 0.7);
      group.add(palletBase, carton);
    }

    // Tall Stacks of Red Plastic Pallets on Bay 7
    [-0.55, 0.65].forEach((dx, idx) => {
      const stackH = idx === 0 ? 1.85 : 1.35;
      const redStack = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, stackH, 1.15),
        ldMats.redPallet
      );
      redStack.position.set(westX + bayW * 6.45 + dx, dockH + stackH * 0.5, wallZ + 2.5);
      addEdges(redStack, 0x7f1d1d, 0.75);
      group.add(redStack);
    });

    // 4. Official Starflex Logistics Container Trucks
    [
      { bayIdx: 2.5, doorRatio: 0.0 },
      { bayIdx: 4.0, doorRatio: 0.0 },
      { bayIdx: 5.5, doorRatio: 1.0 }
    ].forEach(cfg => {
      const truck = createContainerTruckMesh();
      if (truck.userData && typeof truck.userData.setDoorOpenRatio === "function") {
        truck.userData.setDoorOpenRatio(cfg.doorRatio);
      }
      truck.scale.set(0.5, 0.5, 0.5);
      truck.position.set(westX + bayW * cfg.bayIdx, 0, wallZ + dockDepth + 2.95);
      group.add(truck);
    });
  }

  return {
    buildLoadingDockTrucks,
    createContainerTruckMesh
  };
})();
