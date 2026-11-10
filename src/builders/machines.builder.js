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

  function buildLoadingDockTrucks(group, r) {
    [-10.5, -8.2, -5.9].forEach(tx => {
      const truck = new THREE.Group();
      const trailer = new THREE.Mesh(
        new THREE.BoxGeometry(1.75, 2.5, 4.2),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      );
      trailer.position.set(tx, 1.55, r.d * 0.25);
      addEdges(trailer, 0x94a3b8, 0.7);

      const cab = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 1.9, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 })
      );
      cab.position.set(tx, 1.25, r.d * 0.25 + 2.9);
      addEdges(cab, 0x1e40af, 0.7);
      truck.add(trailer, cab);
      group.add(truck);
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
          buildLoadingDockTrucks(group, r);
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
