// ============================================================================
// Module: src/builders/machines.builder.js
// Modular procedural 3D equipment builders for Gravure Presses, Blown Film
// Tower, Extrusion Lines, Laminators, Ovens, Bag Making Lines, Pallet Racks,
// Loading Dock Trucks, and Office/Utility blocks.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Machines = (function () {
  const { rect, addEdges } = window.Starflex3D.Coords;

  function buildGravurePress(inner, L, W, H, mats, accentMat, lightAccentMat) {
    const base = new THREE.Mesh(new THREE.BoxGeometry(L * 0.96, 0.35, W * 0.82), mats.machineDark);
    base.position.y = 0.18;
    inner.add(base);

    const numTowers = Math.max(5, Math.min(9, Math.floor(L / 1.9)));
    const towerSpan = L * 0.72;
    for (let i = 0; i < numTowers; i++) {
      const tx = -towerSpan * 0.5 + (towerSpan * i) / (numTowers - 1);
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry((towerSpan / numTowers) * 0.68, H * 0.68, W * 0.68),
        mats.machineBody
      );
      tower.position.set(tx, H * 0.36, 0);
      tower.castShadow = true;
      addEdges(tower, 0x94a3b8, 0.6);
      inner.add(tower);

      const hood = new THREE.Mesh(
        new THREE.BoxGeometry((towerSpan / numTowers) * 0.52, H * 0.22, W * 0.52),
        accentMat
      );
      hood.position.set(tx, H * 0.78, 0);
      inner.add(hood);
    }

    const mainPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, L * 0.84, 12),
      lightAccentMat
    );
    mainPipe.rotation.z = Math.PI / 2;
    mainPipe.position.set(0, H * 0.98, 0);
    inner.add(mainPipe);

    [-L * 0.43, L * 0.43].forEach(ex => {
      const roll = new THREE.Mesh(
        new THREE.CylinderGeometry(W * 0.26, W * 0.26, W * 0.58, 16),
        mats.filmRollWhite
      );
      roll.rotation.x = Math.PI / 2;
      roll.position.set(ex, H * 0.28, 0);
      addEdges(roll, 0xcbd5e1, 0.5);
      inner.add(roll);
    });
  }

  function buildBlowFilmTower(inner, L, W, H, mats, accentMat) {
    const frameW = L * 0.78;
    const frameD = W * 0.78;
    [0.2, H * 0.36, H * 0.68, H * 0.95].forEach((py, idx) => {
      const plat = new THREE.Mesh(
        new THREE.BoxGeometry(frameW, 0.18, frameD),
        idx === 0 ? mats.machineDark : mats.steelColumn
      );
      plat.position.y = py;
      addEdges(plat, 0x475569, 0.7);
      inner.add(plat);
    });

    [-frameW * 0.46, frameW * 0.46].forEach(cx => {
      [-frameD * 0.46, frameD * 0.46].forEach(cz => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.28, H, 0.28), mats.steelColumn);
        col.position.set(cx, H * 0.5, cz);
        inner.add(col);
      });
    });

    const dieHead = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, 1.5, 20), accentMat);
    dieHead.position.set(0, 1.0, 0);
    inner.add(dieHead);

    const bubble = new THREE.Mesh(
      new THREE.CylinderGeometry(1.45, 0.95, H * 0.72, 24, 1, true),
      mats.filmBubble
    );
    bubble.position.set(0, 1.6 + H * 0.36, 0);
    inner.add(bubble);

    const nip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, frameD * 0.65, 12),
      mats.chromeRoll
    );
    nip.rotation.x = Math.PI / 2;
    nip.position.set(0, H * 0.92, 0);
    inner.add(nip);
  }

  function buildExtrusionLine(inner, L, W, H, mats, accentMat, lightAccentMat) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(L * 0.92, H * 0.45, W * 0.55), mats.machineBody);
    bed.position.y = H * 0.25;
    addEdges(bed, 0x94a3b8, 0.6);
    inner.add(bed);

    [-L * 0.18, L * 0.18].forEach(ex => {
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, W * 0.88), accentMat);
      barrel.position.set(ex, H * 0.35, 0);
      const hopper = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.4, 12), mats.chromeRoll);
      hopper.rotation.x = Math.PI;
      hopper.position.set(ex, H * 0.78, W * 0.26);
      inner.add(barrel, hopper);
    });

    const hood = new THREE.Mesh(new THREE.BoxGeometry(L * 0.76, H * 0.22, W * 0.48), lightAccentMat);
    hood.position.set(0, H * 0.72, 0);
    addEdges(hood, 0x0284c7, 0.6);
    inner.add(hood);
  }

  function buildLaminator(inner, L, W, H, mats, accentMat) {
    [-L * 0.32, L * 0.32].forEach(sx => {
      const st = new THREE.Mesh(new THREE.BoxGeometry(L * 0.24, H * 0.62, W * 0.72), mats.machineBody);
      st.position.set(sx, H * 0.31, 0);
      addEdges(st, 0x94a3b8, 0.6);
      inner.add(st);
    });

    const tunnel = new THREE.Mesh(new THREE.BoxGeometry(L * 0.85, H * 0.32, W * 0.64), accentMat);
    tunnel.position.set(0, H * 0.76, 0);
    addEdges(tunnel, 0xb45309, 0.6);
    inner.add(tunnel);

    [-L * 0.44, 0, L * 0.44].forEach(rx => {
      const roll = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, W * 0.56, 14),
        mats.filmRollWhite
      );
      roll.rotation.x = Math.PI / 2;
      roll.position.set(rx, 0.85, 0);
      inner.add(roll);
    });
  }

  function buildOvenChamber(inner, L, W, H, accentMat) {
    const chamber = new THREE.Mesh(
      new THREE.BoxGeometry(L * 0.94, H * 0.82, W * 0.9),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45, metalness: 0.2 })
    );
    chamber.position.y = H * 0.41;
    addEdges(chamber, 0xd97706, 0.75);
    inner.add(chamber);

    const stack = new THREE.Mesh(new THREE.BoxGeometry(L * 0.55, H * 0.22, W * 0.5), accentMat);
    stack.position.y = H * 0.92;
    inner.add(stack);
  }

  function buildBagMakingArray(group, r, mats, accentMat) {
    const numLines = 14;
    for (let i = 0; i < numLines; i++) {
      const lx = -r.w * 0.46 + (r.w * 0.92 * i) / (numLines - 1);
      const lineLen = r.d * (i === 13 ? 0.95 : i % 3 === 0 ? 0.84 : 0.74);

      const bmBody = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, lineLen), mats.machineBody);
      bmBody.position.set(lx, 0.68, -r.d * 0.05);
      addEdges(bmBody, 0x94a3b8, 0.55);
      group.add(bmBody);

      const sealer = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.65, 2.2), accentMat);
      sealer.position.set(lx, 1.65, -r.d * 0.12);
      group.add(sealer);

      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.95, 12), mats.filmRollWhite);
      roll.rotation.z = Math.PI / 2;
      roll.position.set(lx, 0.8, -lineLen * 0.48);
      group.add(roll);
    }
  }

  function buildSpoutOrSlitter(group, itemType, r, mats, accentMat) {
    const cols = itemType === "slitter_array" ? 8 : itemType === "spout_array" ? 5 : 2;
    const rows = itemType === "slitter_array" ? 2 : itemType === "spout_array" ? 2 : 1;
    for (let c = 0; c < cols; c++) {
      for (let rw = 0; rw < rows; rw++) {
        const mx = cols === 1 ? 0 : -r.w * 0.42 + (r.w * 0.84 * c) / (cols - 1);
        const mz = rows === 1 ? 0 : -r.d * 0.28 + (r.d * 0.56 * rw) / (rows - 1);
        const unit = new THREE.Mesh(
          new THREE.BoxGeometry(Math.min(2.1, (r.w / cols) * 0.72), 1.6, Math.min(2.0, (r.d / rows) * 0.68)),
          mats.machineBody
        );
        unit.position.set(mx, 0.8, mz);
        addEdges(unit, 0x64748b, 0.6);

        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(Math.min(1.6, (r.w / cols) * 0.55), 0.45, Math.min(1.4, (r.d / rows) * 0.5)),
          accentMat
        );
        cap.position.set(mx, 1.82, mz);
        group.add(unit, cap);
      }
    }
  }

  function buildPalletRacks(group, itemType, r, H, mats) {
    const numAisles = itemType === "staging_racks" ? 1 : 6;
    const tiers = itemType === "highbay_racks" ? 4 : 3;
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });

    for (let a = 0; a < numAisles; a++) {
      const rx = numAisles === 1 ? 0 : -r.w * 0.43 + (r.w * 0.86 * a) / (numAisles - 1);
      const rackW = numAisles === 1 ? r.w * 0.75 : 2.2;
      const rackD = r.d * 0.92;

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(rackW, H, rackD),
        new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.35 })
      );
      frame.position.set(rx, H * 0.5, 0);
      group.add(frame);

      for (let t = 1; t <= tiers; t++) {
        const ty = (H * t) / (tiers + 0.3);
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.96, 0.14, rackD * 0.98), beamMat);
        shelf.position.set(rx, ty, 0);
        group.add(shelf);

        const numPallets = Math.max(3, Math.floor(rackD / 2.6));
        for (let p = 0; p < numPallets; p++) {
          const pz = -rackD * 0.42 + (rackD * 0.84 * p) / (numPallets - 1);
          const isRoll = (a + t + p) % 2 === 0;
          const cargo = isRoll
            ? new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, rackW * 0.72, 10), mats.filmRollWhite)
            : new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.76, 0.85, 1.3), mats.cartonBox);
          if (isRoll) cargo.rotation.z = Math.PI / 2;
          cargo.position.set(rx, ty + 0.52, pz);
          group.add(cargo);
        }
      }
    }
  }

  function buildLoadingDockTrucks(group, r, mats) {
    // Local coordinates: North wall (py=815) is at z = -r.d * 0.5
    // West edge (px=1062) is at x = -r.w * 0.5, East edge (px=1395) is at x = +r.w * 0.5
    const wallZ = -r.d * 0.5;
    const westX = -r.w * 0.5;
    const numBays = 7;
    const bayW = r.w / numBays;
    const dockH = 1.25;
    const dockDepth = 4.65;

    const ldMats = {
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

    // 1. Raised White Concrete Loading Dock Platform (ชานชาลาคอนกรีตยกพื้นสูงสีขาว 1.25m)
    const platW = r.w * 0.88;
    const platX = westX + r.w * 0.54;
    const platZ = wallZ + dockDepth * 0.5;
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(platW, dockH, dockDepth),
      ldMats.whiteConcrete
    );
    platform.position.set(platX, dockH * 0.5, platZ);
    platform.receiveShadow = true;
    platform.castShadow = true;
    addEdges(platform, 0x94a3b8, 0.75);
    group.add(platform);

    // Black Rubber Dock Bumpers along the front face of the white dock platform
    const bumperCount = 14;
    for (let b = 0; b < bumperCount; b++) {
      const bx = platX - platW * 0.46 + (platW * 0.92 * b) / (bumperCount - 1);
      const vBumper = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.58, 0.16),
        ldMats.rubberBumper
      );
      vBumper.position.set(bx, dockH * 0.58, wallZ + dockDepth + 0.08);
      group.add(vBumper);
    }

    // Left-end concrete access steps + black tubular safety handrail (หน้าห้องควบคุมท่าโหลด)
    for (let st = 0; st < 3; st++) {
      const stepMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, (dockH * (st + 1)) / 3, 0.65),
        ldMats.whiteConcrete
      );
      stepMesh.position.set(westX + bayW * 0.85, (dockH * (st + 1)) / 6, wallZ + 1.2 + st * 0.65);
      addEdges(stepMesh, 0x94a3b8, 0.6);
      group.add(stepMesh);
    }
    const railW = bayW * 1.45;
    const railX = westX + bayW * 1.55;
    const topRail = new THREE.Mesh(new THREE.BoxGeometry(railW, 0.06, 0.06), ldMats.rubberBumper);
    topRail.position.set(railX, dockH + 0.95, wallZ + dockDepth - 0.12);
    const midRail = new THREE.Mesh(new THREE.BoxGeometry(railW, 0.05, 0.05), ldMats.rubberBumper);
    midRail.position.set(railX, dockH + 0.5, wallZ + dockDepth - 0.12);
    group.add(topRail, midRail);
    for (let p = 0; p <= 4; p++) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.0, 0.06), ldMats.rubberBumper);
      post.position.set(railX - railW * 0.5 + (railW * p) / 4, dockH + 0.5, wallZ + dockDepth - 0.12);
      group.add(post);
    }

    // 2. Lower Dock Wall Details across the 7 Bays (Entrance, White Booth, 4 Dark Shutters & 1 Orange High-Speed Door)
    for (let i = 0; i < numBays; i++) {
      const bx = westX + (i + 0.5) * bayW;

      if (i === 0) {
        // Bay 1 (Leftmost): Personnel Glass Entrance Door + Red Digital LED Clock Sign
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.35, 0.18), ldMats.darkGlass);
        door.position.set(bx, 1.2, wallZ + 0.25);
        addEdges(door, 0xffffff, 0.9);
        const ledSign = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.36, 0.14), ldMats.redLed);
        ledSign.position.set(bx, 3.65, wallZ + 0.28);
        group.add(door, ledSign);
      } else if (i === 1) {
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
        const doorW = 3.35;
        const doorH = 3.05;
        const shutter = new THREE.Mesh(
          new THREE.BoxGeometry(doorW, doorH, 0.22),
          isOrangeDoor ? ldMats.orangeHighSpeed : ldMats.darkShutter
        );
        shutter.position.set(bx, dockH + doorH * 0.5, wallZ + 0.25);
        addEdges(shutter, 0x0f172a, 0.85);
        group.add(shutter);

        // White/Blue horizontal vision stripe on the Orange High-Speed Door (Loading_Dock_2!)
        if (isOrangeDoor) {
          const visionBand = new THREE.Mesh(
            new THREE.BoxGeometry(doorW * 0.96, 0.42, 0.26),
            ldMats.whiteConcrete
          );
          visionBand.position.set(bx, dockH + 0.95, wallZ + 0.25);
          const bottomSkirt = new THREE.Mesh(
            new THREE.BoxGeometry(doorW * 0.96, 0.55, 0.25),
            ldMats.forkliftCyan
          );
          bottomSkirt.position.set(bx, dockH + 0.35, wallZ + 0.25);
          group.add(visionBand, bottomSkirt);
        }

        // Black dock shelter side pads & top header around each dock door
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

    // Tall Stacks of Red Plastic Pallets on Bay 7 (Right end of the platform — Loading_Dock_2!)
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

    // 4. Blue & Black Electric Counterbalance Forklift in front of the Orange High-Speed Door!
    const flGroup = new THREE.Group();
    const flBody = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 2.05), ldMats.forkliftCyan);
    flBody.position.set(0, 0.6, 0);
    addEdges(flBody, 0x0369a1, 0.8);
    const flRear = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.05, 0.65), ldMats.rubberBumper);
    flRear.position.set(0, 0.65, 0.85);
    const flCage = new THREE.Mesh(
      new THREE.BoxGeometry(1.12, 1.15, 1.25),
      new THREE.MeshBasicMaterial({ color: 0x0f172a, wireframe: true })
    );
    flCage.position.set(0, 1.65, 0.15);
    const flMast = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.35, 0.16), ldMats.rubberBumper);
    flMast.position.set(0, 1.25, -1.08);
    flGroup.add(flBody, flRear, flCage, flMast);
    flGroup.position.set(westX + bayW * 5.38, 0, wallZ + dockDepth + 1.35);
    flGroup.rotation.y = 0.28;
    group.add(flGroup);

    // 5. Authentic Courtyard Vehicles (matching Loading_Dock_1 & Loading_Dock_2!)
    // 5A. Black Pickup Truck with High Silver Box Canopy on the right end of the dock (Bay 7)
    const blkPickup = new THREE.Group();
    const bpCab = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.65, 2.3), ldMats.carBlack);
    bpCab.position.set(0, 0.95, -1.1);
    const bpBox = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.25, 2.7), ldMats.silverCanopy);
    bpBox.position.set(0, 1.35, 1.35);
    addEdges(bpBox, 0x64748b, 0.7);
    blkPickup.add(bpCab, bpBox);
    blkPickup.position.set(westX + bayW * 6.35, 0, wallZ + dockDepth + 2.55);
    blkPickup.rotation.y = -0.52;
    group.add(blkPickup);

    // 5B. White 6-Wheel Box Truck with slatted cargo body on the right side of the courtyard
    const boxTruck = new THREE.Group();
    const btCab = new THREE.Mesh(new THREE.BoxGeometry(2.25, 2.45, 1.95), ldMats.boothWhite);
    btCab.position.set(0, 1.35, -3.2);
    addEdges(btCab, 0x64748b, 0.75);
    const btCargo = new THREE.Mesh(new THREE.BoxGeometry(2.38, 2.95, 5.4), ldMats.whiteConcrete);
    btCargo.position.set(0, 1.75, 0.55);
    addEdges(btCargo, 0x475569, 0.85);
    const btSkirt = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.32, 5.42), ldMats.redPallet);
    btSkirt.position.set(0, 0.45, 0.55);
    boxTruck.add(btCab, btCargo, btSkirt);
    boxTruck.position.set(westX + r.w - 2.6, 0, wallZ + 15.2);
    group.add(boxTruck);

    // 5C. White 4-Door Pickup Truck with White Carryboy Canopy parked perpendicular on the left (Loading_Dock_2 left foreground!)
    const whtPickup = new THREE.Group();
    const wpBody = new THREE.Mesh(new THREE.BoxGeometry(5.1, 1.1, 1.92), ldMats.boothWhite);
    wpBody.position.set(0, 0.75, 0);
    const wpTop = new THREE.Mesh(new THREE.BoxGeometry(3.55, 0.78, 1.82), ldMats.boothWhite);
    wpTop.position.set(-0.68, 1.62, 0);
    const wpWins = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.58, 1.86), ldMats.darkGlass);
    wpWins.position.set(-0.68, 1.62, 0);
    addEdges(wpBody, 0x94a3b8, 0.7);
    addEdges(wpTop, 0x94a3b8, 0.7);
    whtPickup.add(wpBody, wpTop, wpWins);
    whtPickup.position.set(westX + 3.4, 0, wallZ + 14.8);
    group.add(whtPickup);

    // 5D. 2 Black/Dark Sedans parked under the Left Side Canopy (Loading_Dock_1 & Loading_Dock_2)
    [8.2, 11.4].forEach(dz => {
      const car = new THREE.Group();
      const cLower = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.85, 1.8), ldMats.carBlack);
      cLower.position.set(0, 0.55, 0);
      const cCabin = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.65, 1.62), ldMats.darkShutter);
      cCabin.position.set(-0.2, 1.25, 0);
      addEdges(cLower, 0x52525b, 0.6);
      car.add(cLower, cCabin);
      car.position.set(westX + 3.2, 0, wallZ + dz);
      group.add(car);
    });
  }

  function buildRoomBlock(group, itemType, r, H, mats, catColor, accentMat) {
    const boxH = Math.min(H, 4.5);
    const roomMesh = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.94, boxH, r.d * 0.94),
      itemType === "hq_office" ? mats.officeGlass : mats.wallPartition
    );
    roomMesh.position.y = boxH * 0.5;
    addEdges(roomMesh, catColor, 0.65);
    group.add(roomMesh);

    const header = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.95, 0.26, r.d * 0.95), accentMat);
    header.position.y = boxH + 0.13;
    group.add(header);
  }

  function build(scene, mats, state) {
    const items = window.Starflex3D.Data.items;
    const categories = window.Starflex3D.Categories;

    const itemsGroup = new THREE.Group();
    itemsGroup.name = "MachinesAndZones";

    items.forEach(item => {
      const cat = categories[item.category] || categories.office_utility;
      const r = rect(item.bounds);
      const group = new THREE.Group();
      group.position.set(r.x, 0, r.z);
      group.userData = { item, category: cat, rect: r };

      const accentMat = new THREE.MeshStandardMaterial({
        color: cat.color,
        roughness: 0.32,
        metalness: 0.35
      });
      const lightAccentMat = new THREE.MeshStandardMaterial({
        color: cat.accent,
        roughness: 0.35,
        metalness: 0.25
      });

      const isNS = item.orientation === "NS" || r.d > r.w * 1.25;
      const L = isNS ? r.d : r.w;
      const W = isNS ? r.w : r.d;
      const H = item.height || 4.0;

      const inner = new THREE.Group();
      if (isNS) inner.rotation.y = Math.PI / 2;

      switch (item.type) {
        case "gravure_press":
          buildGravurePress(inner, L, W, H, mats, accentMat, lightAccentMat);
          break;
        case "blow_film_tower":
          buildBlowFilmTower(inner, L, W, H, mats, accentMat);
          break;
        case "extrusion_line":
          buildExtrusionLine(inner, L, W, H, mats, accentMat, lightAccentMat);
          break;
        case "laminator":
        case "converting_group":
          buildLaminator(inner, L, W, H, mats, accentMat);
          break;
        case "oven_chamber":
        case "burner_unit":
          buildOvenChamber(inner, L, W, H, accentMat);
          break;
        case "bag_making_array":
          buildBagMakingArray(group, r, mats, accentMat);
          break;
        case "spout_array":
        case "slitter_array":
        case "slitter_group":
          buildSpoutOrSlitter(group, item.type, r, mats, accentMat);
          break;
        case "highbay_racks":
        case "rack_zone":
        case "staging_racks":
        case "hanging_rack":
          buildPalletRacks(group, item.type, r, H, mats);
          break;
        case "loading_dock":
          buildLoadingDockTrucks(group, r, mats);
          break;
        default:
          buildRoomBlock(group, item.type, r, H, mats, cat.color, accentMat);
          break;
      }

      group.add(inner);
      itemsGroup.add(group);
      state.itemMeshes.set(item.id, group);
    });

    scene.add(itemsGroup);
    return itemsGroup;
  }

  return { build };
})();
