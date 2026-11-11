// ============================================================================
// Module: src/builders/machines/warehouse.builder.js
// Procedural 3D Builders for Selective High-Bay Warehouse Pallet Racks,
// Central Warehouse Long Racks (EW), Staging Racks, and Film Roll Storage.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Warehouse = (function () {
  function buildPalletRacks(group, itemOrType, r, H, mats) {
    const item = typeof itemOrType === "object" ? itemOrType : { type: itemOrType };
    const itemType = item.type;
    const isEW = item.orientation === "EW" || itemType === "warehouse_racks" || itemType === "warehouse_zone";

    const beamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });
    const bluePostMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.3 });
    const wireFrameMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.35 });

    if (isEW && itemType !== "hanging_rack") {
      // ------------------------------------------------------------------------
      // East-West Long Racks (e.g. WH-MAIN Central Warehouse)
      // 4 lengthwise rows running along X with forklift aisles along Z
      // ------------------------------------------------------------------------
      const numRows = 4;
      const tiers = 4;
      const rackL = r.w * 0.94;
      const rackD = 2.0;

      // Floor markings: outer boundary lines
      const floorLineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.75 });
      [-r.d * 0.46, r.d * 0.46].forEach(bz => {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(r.w * 0.96, 0.12), floorLineMat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.02, bz);
        group.add(line);
      });
      [-r.w * 0.48, r.w * 0.48].forEach(bx => {
        const line = new THREE.Mesh(new THREE.PlaneGeometry(0.12, r.d * 0.92), floorLineMat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(bx, 0.02, 0);
        group.add(line);
      });

      // Driving aisle centerlines between rack rows
      for (let i = 0; i < numRows - 1; i++) {
        const z1 = -r.d * 0.36 + (r.d * 0.72 * i) / (numRows - 1);
        const z2 = -r.d * 0.36 + (r.d * 0.72 * (i + 1)) / (numRows - 1);
        const aisleZ = (z1 + z2) * 0.5;
        const aisleLine = new THREE.Mesh(new THREE.PlaneGeometry(rackL * 0.92, 0.10), floorLineMat);
        aisleLine.rotation.x = -Math.PI / 2;
        aisleLine.position.set(0, 0.02, aisleZ);
        group.add(aisleLine);
      }

      for (let a = 0; a < numRows; a++) {
        const rz = -r.d * 0.36 + (r.d * 0.72 * a) / (numRows - 1);

        // Bounding wireframe
        const frame = new THREE.Mesh(new THREE.BoxGeometry(rackL, H, rackD), wireFrameMat);
        frame.position.set(0, H * 0.5, rz);
        group.add(frame);

        // Upright ladder columns along the rack length
        const numBays = Math.max(6, Math.floor(rackL / 2.4));
        for (let b = 0; b <= numBays; b++) {
          const bx = -rackL * 0.48 + (rackL * 0.96 * b) / numBays;
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, H, rackD * 0.98), bluePostMat);
          post.position.set(bx, H * 0.5, rz);
          group.add(post);
        }

        // Tiers (horizontal orange beams)
        for (let t = 1; t <= tiers; t++) {
          const ty = 0.5 + ((H - 1.45) * (t - 1)) / Math.max(1, tiers - 1);
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackL * 0.98, 0.12, rackD * 0.96), beamMat);
          shelf.position.set(0, ty, rz);
          group.add(shelf);

          // Cargo in each bay along X
          for (let b = 0; b < numBays; b++) {
            const px = -rackL * 0.48 + (rackL * 0.96 * (b + 0.5)) / numBays;

            // Wooden pallet base
            const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.10, rackD * 0.78), mats.palletWood);
            pallet.position.set(px, ty + 0.05, rz);
            group.add(pallet);

            const isRoll = (a + t + b) % 2 === 0;
            if (isRoll) {
              const roll = new THREE.Mesh(
                new THREE.CylinderGeometry(0.42, 0.42, rackD * 0.70, 14),
                mats.filmRollWhite
              );
              roll.rotation.x = Math.PI / 2;
              roll.position.set(px, ty + 0.47, rz);
              group.add(roll);
            } else {
              const carton = new THREE.Mesh(
                new THREE.BoxGeometry(1.2, 0.80, rackD * 0.74),
                mats.cartonBox
              );
              carton.position.set(px, ty + 0.45, rz);
              group.add(carton);
            }
          }
        }
      }
      return;
    }

    // ------------------------------------------------------------------------
    // North-South Pallet Racks (e.g. FG-AREA, High-Bay Racks North & South)
    // ------------------------------------------------------------------------
    const numAisles = itemType === "staging_racks" || itemType === "hanging_rack" ? 1 : 6;
    const tiers = itemType === "highbay_racks" ? 4 : 3;

    for (let a = 0; a < numAisles; a++) {
      const rx = numAisles === 1 ? 0 : -r.w * 0.43 + (r.w * 0.86 * a) / (numAisles - 1);
      const rackW = numAisles === 1 ? r.w * 0.75 : 2.2;
      const rackD = r.d * 0.92;

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(rackW, H, rackD),
        wireFrameMat
      );
      frame.position.set(rx, H * 0.5, 0);
      group.add(frame);

      for (let t = 1; t <= tiers; t++) {
        const ty = 0.5 + ((H - 1.45) * (t - 1)) / Math.max(1, tiers - 1);
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.96, 0.12, rackD * 0.98), beamMat);
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
          cargo.position.set(rx, ty + 0.50, pz);
          group.add(cargo);
        }
      }
    }
  }

  return {
    buildPalletRacks
  };
})();
