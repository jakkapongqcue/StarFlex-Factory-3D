// ============================================================================
// Module: src/builders/machines/warehouse.builder.js
// Procedural 3D Builders for Selective High-Bay Warehouse Pallet Racks,
// Central Warehouse Long Racks (EW), Staging Racks, and Film Roll Storage.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Warehouse = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  let cachedWIPMats = null;

  function getWIPRollMaterials() {
    if (cachedWIPMats) return cachedWIPMats;

    const endCapLightMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4, metalness: 0.05 });
    const endCapGreyMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.35, metalness: 0.25 });

    // Clean solid-color materials for film rolls (no patterns / no canvas textures)
    const rollColors = [
      { hex: 0x22c55e, darkEnd: true },  // Green
      { hex: 0xf472b6, darkEnd: true },  // Pink
      { hex: 0x38bdf8, darkEnd: false }, // Sky Blue
      { hex: 0xa78bfa, darkEnd: true },  // Purple
      { hex: 0xf87171, darkEnd: false }, // Red
      { hex: 0xfbbf24, darkEnd: false }  // Amber
    ];

    const solidRollMats = rollColors.map(c => {
      const sideMat = new THREE.MeshStandardMaterial({ color: c.hex, roughness: 0.3, metalness: 0.1 });
      const cap = c.darkEnd ? endCapGreyMat : endCapLightMat;
      return [sideMat, cap, cap];
    });

    cachedWIPMats = {
      solidRollMats,
      royalBlueRackMat: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.35 }),
      orangeBeamMat: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4, metalness: 0.3 }),
      steelShaftMat: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.7 }),
      loscamRedMat: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 }),
      blackPalletMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 })
    };
    return cachedWIPMats;
  }

  // Simplified 3D Builder for WIP-RACK (Clean Blue Hanging Frame + Solid Color Rolls)
  function buildWIPHangingRack(group, r) {
    const wm = getWIPRollMaterials();
    const rackGroup = new THREE.Group();
    group.add(rackGroup);

    const rackL = r.w * 0.92;
    const numBays = 4;
    const bayW = rackL / numBays;
    const spanZ = 1.15;
    const tierMidY = 1.65;
    const tierTopY = 2.85;
    const postH = 2.95;

    const rackRowsZ = [-r.d * 0.25, r.d * 0.12];

    rackRowsZ.forEach((rowZ, rowIdx) => {
      const zFront = rowZ + spanZ * 0.5;
      const zBack = rowZ - spanZ * 0.5;

      // Longitudinal Blue Load Beams
      [tierMidY, tierTopY].forEach(ty => {
        [zFront, zBack].forEach(rz => {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(rackL, 0.10, 0.08), wm.royalBlueRackMat);
          rail.position.set(0, ty, rz);
          rackGroup.add(rail);
        });
      });

      // Upright Columns & Top/Mid Tie Bars
      for (let b = 0; b <= numBays; b++) {
        const bx = -rackL * 0.5 + b * bayW;
        [zFront, zBack].forEach(rz => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, postH, 0.09), wm.royalBlueRackMat);
          post.position.set(bx, postH * 0.5, rz);
          rackGroup.add(post);
        });
        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, spanZ), wm.royalBlueRackMat);
        tie.position.set(bx, tierTopY, rowZ);
        rackGroup.add(tie);
      }

      // Suspended Solid-Color Film Rolls on Steel Shafts
      for (let b = 0; b < numBays; b++) {
        const bayCenterX = -rackL * 0.5 + (b + 0.5) * bayW;

        [
          { y: tierTopY + 0.22, tierIdx: 1, rad: 0.36 },
          { y: tierMidY + 0.18, tierIdx: 0, rad: 0.33 }
        ].forEach(({ y, tierIdx, rad }) => {
          const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, spanZ + 0.2, 8),
            wm.steelShaftMat
          );
          shaft.rotation.x = Math.PI / 2;
          shaft.position.set(bayCenterX, y, rowZ);
          rackGroup.add(shaft);

          const matIdx = (rowIdx * 2 + tierIdx + b) % wm.solidRollMats.length;
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(rad, rad, spanZ * 0.76, 12),
            wm.solidRollMats[matIdx]
          );
          roll.rotation.x = Math.PI / 2;
          roll.position.set(bayCenterX, y, rowZ);
          rackGroup.add(roll);
        });

        // Simple Floor Pallet & Roll underneath
        const pallet = new THREE.Mesh(
          new THREE.BoxGeometry(bayW * 0.8, 0.10, spanZ * 0.85),
          (b + rowIdx) % 2 === 0 ? wm.loscamRedMat : wm.blackPalletMat
        );
        pallet.position.set(bayCenterX, 0.05, rowZ);
        rackGroup.add(pallet);

        const floorRoll = new THREE.Mesh(
          new THREE.CylinderGeometry(0.30, 0.30, spanZ * 0.70, 12),
          wm.solidRollMats[(b + rowIdx + 3) % wm.solidRollMats.length]
        );
        floorRoll.rotation.x = Math.PI / 2;
        floorRoll.position.set(bayCenterX, 0.10 + 0.30, rowZ);
        rackGroup.add(floorRoll);
      }
    });
  }

  function buildPalletRacks(group, itemOrType, r, H, mats) {
    const item = typeof itemOrType === "object" ? itemOrType : { type: itemOrType };
    const itemType = item.type;
    const isEW = item.orientation === "EW" || itemType === "warehouse_racks" || itemType === "warehouse_zone";
    const isWHPRD = item.code === "WH-PRD" || item.id === "wh_prd_hall1";

    if (itemType === "hanging_rack" || item.code === "WIP-RACK") {
      buildWIPHangingRack(group, r, H, mats);
      return;
    }

    const beamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });
    const bluePostMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.3 });
    const wireFrameMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.35 });

    if (isWHPRD) {
      // ------------------------------------------------------------------------
      // WH-PRD: Simplified Hanging Film Roll Racks (3 Rows × 4 Tiers, Solid Colors)
      // ------------------------------------------------------------------------
      const wm = getWIPRollMaterials();
      const numRows = 3;
      const tiers = 4;
      const rackD = 1.20;
      const rackH = H || 4.8;
      const crossWalkW = 2.4;
      const segL = (r.w * 0.94 - crossWalkW) * 0.5;
      const segCentersX = [
        -(crossWalkW * 0.5 + segL * 0.5),
        +(crossWalkW * 0.5 + segL * 0.5)
      ];

      const rowZ = [
        -r.d * 0.5 + rackD * 0.5 + 0.12, // North Row
        0,                                // Center Row
        r.d * 0.5 - rackD * 0.5 - 0.12   // South Row
      ];

      const numBays = 6;
      const bayW = (segL * 0.96) / numBays;
      const halfSpanZ = rackD * 0.44;

      for (let a = 0; a < numRows; a++) {
        const rz = rowZ[a];
        const zFront = rz + halfSpanZ;
        const zBack = rz - halfSpanZ;

        segCentersX.forEach((cx, segIdx) => {
          // Simple Blue Upright Posts
          for (let b = 0; b <= numBays; b++) {
            const bx = cx - segL * 0.48 + b * bayW;
            const postFrame = new THREE.Mesh(
              new THREE.BoxGeometry(0.08, rackH, rackD * 0.94),
              wm.royalBlueRackMat
            );
            postFrame.position.set(bx, rackH * 0.5, rz);
            group.add(postFrame);
          }

          // Orange Horizontal Beams & Suspended Solid-Color Film Rolls
          for (let t = 0; t < tiers; t++) {
            const beamY = 0.65 + t * 1.12;
            const rollY = beamY + 0.15;

            [zFront, zBack].forEach(bz => {
              const oBeam = new THREE.Mesh(
                new THREE.BoxGeometry(segL * 0.97, 0.10, 0.07),
                wm.orangeBeamMat
              );
              oBeam.position.set(cx, beamY, bz);
              group.add(oBeam);
            });

            for (let b = 0; b < numBays; b++) {
              const px = cx - segL * 0.48 + (b + 0.5) * bayW;

              const shaft = new THREE.Mesh(
                new THREE.CylinderGeometry(0.035, 0.035, rackD + 0.12, 8),
                wm.steelShaftMat
              );
              shaft.rotation.x = Math.PI / 2;
              shaft.position.set(px, rollY, rz);
              group.add(shaft);

              const matIdx = (a * 2 + t + b + segIdx) % wm.solidRollMats.length;
              const roll = new THREE.Mesh(
                new THREE.CylinderGeometry(0.36, 0.36, rackD * 0.74, 12),
                wm.solidRollMats[matIdx]
              );
              roll.rotation.x = Math.PI / 2;
              roll.position.set(px, rollY, rz);
              group.add(roll);
            }
          }
        });
      }
      return;
    }

    if (isEW && itemType !== "hanging_rack") {
      // ------------------------------------------------------------------------
      // East-West Long Racks (e.g. WH-MAIN Central Warehouse)
      // Lengthwise rows running along X with forklift aisles along Z
      // ------------------------------------------------------------------------
      const numRows = Math.max(4, Math.round(r.d / 3.8));
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
        const z1 = -r.d * 0.38 + (r.d * 0.76 * i) / (numRows - 1);
        const z2 = -r.d * 0.38 + (r.d * 0.76 * (i + 1)) / (numRows - 1);
        const aisleZ = (z1 + z2) * 0.5;
        const aisleLine = new THREE.Mesh(new THREE.PlaneGeometry(rackL * 0.92, 0.10), floorLineMat);
        aisleLine.rotation.x = -Math.PI / 2;
        aisleLine.position.set(0, 0.02, aisleZ);
        group.add(aisleLine);
      }

      for (let a = 0; a < numRows; a++) {
        const rz = -r.d * 0.38 + (r.d * 0.76 * a) / (numRows - 1);

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
