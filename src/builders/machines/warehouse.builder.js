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

    // 1. Film Roll End-Face Texture (Cream-white wound film layers + brown cardboard core + hollow bore)
    const endCanvas = document.createElement("canvas");
    endCanvas.width = 256;
    endCanvas.height = 256;
    const ectx = endCanvas.getContext("2d");
    const cx = 128, cy = 128;

    ectx.fillStyle = "#f8fafc";
    ectx.fillRect(0, 0, 256, 256);

    // Subtle concentric wound film rings
    for (let rad = 124; rad > 38; rad -= 3) {
      ectx.beginPath();
      ectx.arc(cx, cy, rad, 0, Math.PI * 2);
      ectx.strokeStyle = rad % 6 === 0 ? "#e2e8f0" : "#f1f5f9";
      ectx.lineWidth = 1.2;
      ectx.stroke();
    }

    // Brown Kraft paperboard core
    ectx.beginPath();
    ectx.arc(cx, cy, 38, 0, Math.PI * 2);
    ectx.fillStyle = "#854d0e";
    ectx.fill();

    // Dark hollow bore for steel hanging shaft
    ectx.beginPath();
    ectx.arc(cx, cy, 20, 0, Math.PI * 2);
    ectx.fillStyle = "#1e293b";
    ectx.fill();

    const endTex = new THREE.CanvasTexture(endCanvas);
    const endCapMat = new THREE.MeshStandardMaterial({
      map: endTex,
      roughness: 0.35,
      metalness: 0.05
    });

    // 1b. Metallized Foil / Dark Grey Film Roll End-Face Texture (matching WH-PRD photo)
    const foilCanvas = document.createElement("canvas");
    foilCanvas.width = 256;
    foilCanvas.height = 256;
    const fctx = foilCanvas.getContext("2d");

    fctx.fillStyle = "#475569";
    fctx.fillRect(0, 0, 256, 256);

    for (let rad = 124; rad > 38; rad -= 3) {
      fctx.beginPath();
      fctx.arc(cx, cy, rad, 0, Math.PI * 2);
      fctx.strokeStyle = rad % 6 === 0 ? "#64748b" : "#334155";
      fctx.lineWidth = 1.4;
      fctx.stroke();
    }

    // White/Pink QC Spec Label on the dark foil roll face (as seen in WH-PRD photo)
    fctx.fillStyle = "#fce7f3";
    fctx.fillRect(148, 86, 46, 28);
    fctx.strokeStyle = "#db2777";
    fctx.lineWidth = 2;
    fctx.strokeRect(148, 86, 46, 28);

    // Brown Kraft paperboard core
    fctx.beginPath();
    fctx.arc(cx, cy, 38, 0, Math.PI * 2);
    fctx.fillStyle = "#854d0e";
    fctx.fill();

    // Dark hollow bore for steel hanging shaft
    fctx.beginPath();
    fctx.arc(cx, cy, 20, 0, Math.PI * 2);
    fctx.fillStyle = "#0f172a";
    fctx.fill();

    const foilEndTex = new THREE.CanvasTexture(foilCanvas);
    const foilEndCapMat = new THREE.MeshStandardMaterial({
      map: foilEndTex,
      roughness: 0.28,
      metalness: 0.38
    });

    // 2. Colorful Printed Packaging Film Sleeve Textures (matching reference photo)
    const palettes = [
      { main: "#16a34a", sub: "#86efac", accent: "#14532d", foilEnd: true },  // Green "USA" packaging (prominent in WH-PRD photo)
      { main: "#db2777", sub: "#f9a8d4", accent: "#9d174d", foilEnd: true },  // Rose Pink laminated roll
      { main: "#2563eb", sub: "#38bdf8", accent: "#1e40af", foilEnd: false }, // Sky/Ocean Blue packaging
      { main: "#dc2626", sub: "#f87171", accent: "#991b1b", foilEnd: false }, // Crimson Red packaging
      { main: "#7c3aed", sub: "#c4b5fd", accent: "#5b21b6", foilEnd: true },  // Lavender/Purple packaging
      { main: "#ea580c", sub: "#fdba74", accent: "#78350f", foilEnd: true }   // Amber/Gold laminated roll
    ];

    const printedRollMats = palettes.map(pal => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const g = c.getContext("2d");

      // White/Silver film base & selvage margins
      g.fillStyle = pal.foilEnd ? "#e2e8f0" : "#f8fafc";
      g.fillRect(0, 0, 256, 256);

      // Printed web lanes (3 lanes across roll width, repeating panels around circumference)
      const lanes = [22, 96, 170];
      lanes.forEach(ly => {
        g.fillStyle = pal.main;
        g.fillRect(0, ly, 256, 62);

        for (let px = 8; px < 256; px += 64) {
          // Sub-banner graphic
          g.fillStyle = pal.sub;
          g.fillRect(px, ly + 6, 48, 22);
          // White label / nutrition box
          g.fillStyle = "#ffffff";
          g.fillRect(px + 4, ly + 32, 26, 22);
          // Accent badge
          g.fillStyle = pal.accent;
          g.fillRect(px + 34, ly + 34, 12, 18);
          // Eye-mark registration tick
          g.fillStyle = "#0f172a";
          g.fillRect(px + 54, ly + 2, 4, 10);
        }
      });

      const tex = new THREE.CanvasTexture(c);
      const sideMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.22,
        metalness: pal.foilEnd ? 0.22 : 0.10
      });
      const cap = pal.foilEnd ? foilEndCapMat : endCapMat;
      return [sideMat, cap, cap];
    });

    cachedWIPMats = {
      printedRollMats,
      royalBlueRackMat: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.45 }),
      darkBlueBraceMat: new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.4, metalness: 0.45 }),
      orangeBeamMat: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.35 }),
      steelShaftMat: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.22, metalness: 0.82 }),
      loscamRedMat: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.55, metalness: 0.1 }),
      blackPalletMat: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.1 }),
      pinkTagMat: new THREE.MeshBasicMaterial({ color: 0xf472b6 }),
      yellowTagMat: new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
      whiteCardMat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      stackerBlackMat: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.5 }),
      stackerOrangeMat: new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.3 })
    };
    return cachedWIPMats;
  }

  // Dedicated 3D Builder for WIP-RACK (Blue Structural Steel Hanging Film Roll Racks)
  function buildWIPHangingRack(group, r) {
    const wm = getWIPRollMaterials();
    const rackGroup = new THREE.Group();
    group.add(rackGroup);

    const rackL = r.w * 0.94;
    const numBays = 5;
    const bayW = rackL / numBays;
    const spanZ = 1.16; // Distance between front and back blue support rails
    const tierMidY = 1.68;
    const tierTopY = 2.88;
    const postH = 2.98;

    // 1. Two Parallel Blue Steel Hanging Rack Rows (Back Row & Center Row)
    const rackRowsZ = [-r.d * 0.28, r.d * 0.04];

    rackRowsZ.forEach((rowZ, rowIdx) => {
      const zFront = rowZ + spanZ * 0.5;
      const zBack = rowZ - spanZ * 0.5;

      // Longitudinal Blue Load Beams (Middle Tier & Top Tier, Front & Back)
      [tierMidY, tierTopY].forEach(ty => {
        [zFront, zBack].forEach(rz => {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(rackL + 0.16, 0.11, 0.09), wm.royalBlueRackMat);
          rail.position.set(0, ty, rz);
          addEdges(rail, 0x0369a1, 0.6);
          rackGroup.add(rail);
        });
      });

      // Upright Portal Columns + Crossbars + Diagonal Corner Gusset Braces
      for (let b = 0; b <= numBays; b++) {
        const bx = -rackL * 0.5 + b * bayW;

        [zFront, zBack].forEach(rz => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.10, postH, 0.10), wm.royalBlueRackMat);
          post.position.set(bx, postH * 0.5, rz);
          addEdges(post, 0x075985, 0.6);
          rackGroup.add(post);

          // Diagonal knee braces along X at middle and top tiers
          [tierMidY, tierTopY].forEach(ty => {
            if (b < numBays) {
              const braceR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), wm.darkBlueBraceMat);
              braceR.position.set(bx + 0.16, ty - 0.16, rz);
              braceR.rotation.z = -Math.PI / 4;
              rackGroup.add(braceR);
            }
            if (b > 0) {
              const braceL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), wm.darkBlueBraceMat);
              braceL.position.set(bx - 0.16, ty - 0.16, rz);
              braceL.rotation.z = Math.PI / 4;
              rackGroup.add(braceL);
            }
          });
        });

        // Cross tie-beams connecting front and back columns along Z
        [0.18, tierMidY, tierTopY - 0.06].forEach(cy => {
          const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, spanZ), wm.darkBlueBraceMat);
          tie.position.set(bx, cy, rowZ);
          rackGroup.add(tie);
        });

        // White bay location index placard on front column
        const card = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.34, 0.02), wm.whiteCardMat);
        card.position.set(bx, tierMidY - 0.25, zFront + 0.06);
        rackGroup.add(card);
      }

      // 2. Suspended Printed Jumbo Film Rolls on Steel Core Shafts (Top & Middle Tiers)
      for (let b = 0; b < numBays; b++) {
        const bayCenterX = -rackL * 0.5 + (b + 0.5) * bayW;

        [
          { y: tierTopY + 0.24, tierIdx: 1, rad: 0.39 },
          { y: tierMidY + 0.18, tierIdx: 0, rad: 0.35 }
        ].forEach(({ y, tierIdx, rad }) => {
          // Leave 1 slot open on middle tier for realism (where stacker operates)
          if (rowIdx === 1 && tierIdx === 0 && b === 2) return;

          // U-saddle brackets on blue beam
          [zFront, zBack].forEach(rz => {
            const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.12), wm.darkBlueBraceMat);
            saddle.position.set(bayCenterX, y - rad + 0.12, rz);
            rackGroup.add(saddle);
          });

          // Steel hanging core shaft bridging front & back rails
          const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.036, 0.036, spanZ + 0.32, 10),
            wm.steelShaftMat
          );
          shaft.rotation.x = Math.PI / 2;
          shaft.position.set(bayCenterX, y, rowZ);
          rackGroup.add(shaft);

          // Suspended Printed Film Roll
          const matIdx = (rowIdx * 3 + tierIdx * 2 + b) % wm.printedRollMats.length;
          const rollLen = spanZ * 0.78;
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(rad, rad, rollLen, 20),
            wm.printedRollMats[matIdx]
          );
          roll.rotation.x = Math.PI / 2;
          roll.position.set(bayCenterX, y, rowZ);
          rackGroup.add(roll);

          // Pink / Yellow QC WIP status tag on front face of roll
          const tag = new THREE.Mesh(
            new THREE.PlaneGeometry(0.16, 0.10),
            (b + tierIdx) % 2 === 0 ? wm.pinkTagMat : wm.yellowTagMat
          );
          tag.position.set(bayCenterX + rad * 0.45, y + rad * 0.2, rowZ + rollLen * 0.5 + 0.01);
          rackGroup.add(tag);
        });

        // 3. Floor Pallets under each rack bay with WIP Rolls
        const isRedPallet = (b + rowIdx) % 2 === 0;
        const pallet = new THREE.Mesh(
          new THREE.BoxGeometry(bayW * 0.84, 0.12, spanZ * 0.88),
          isRedPallet ? wm.loscamRedMat : wm.blackPalletMat
        );
        pallet.position.set(bayCenterX, 0.06, rowZ);
        rackGroup.add(pallet);

        const floorRollMat = wm.printedRollMats[(b + rowIdx + 2) % wm.printedRollMats.length];
        const floorRoll = new THREE.Mesh(
          new THREE.CylinderGeometry(0.32, 0.32, spanZ * 0.72, 18),
          floorRollMat
        );
        floorRoll.rotation.x = Math.PI / 2;
        floorRoll.position.set(bayCenterX, 0.12 + 0.32, rowZ);
        rackGroup.add(floorRoll);
      }
    });

    // 4. Foreground Pallet Staging Line (South side of WIP-RACK, matching foreground of photo)
    const frontZ = r.d * 0.35;
    for (let p = 0; p < numBays; p++) {
      const px = -rackL * 0.5 + (p + 0.5) * bayW;
      const isLoscam = p % 2 === 0;
      const fPallet = new THREE.Mesh(
        new THREE.BoxGeometry(bayW * 0.86, 0.12, 1.15),
        isLoscam ? wm.loscamRedMat : wm.blackPalletMat
      );
      fPallet.position.set(px, 0.06, frontZ);
      rackGroup.add(fPallet);

      if (p === numBays - 1) {
        // Rightmost pallet: Vertical stacked patterned rolls (like the orange/character rolls on right of photo)
        [[-0.32, -0.22], [0.32, -0.22], [-0.32, 0.24], [0.32, 0.24]].forEach(([dx, dz], vIdx) => {
          const vRoll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.24, 0.24, 0.88, 16),
            wm.printedRollMats[(vIdx + 5) % wm.printedRollMats.length]
          );
          vRoll.position.set(px + dx, 0.12 + 0.44, frontZ + dz);
          rackGroup.add(vRoll);
        });
      } else {
        // Twin horizontal printed jumbo film rolls side-by-side on pallet (Blue, Red, Purple, Green)
        [-bayW * 0.21, bayW * 0.21].forEach((dx, subIdx) => {
          const rMat = wm.printedRollMats[(p + subIdx) % wm.printedRollMats.length];
          const fRoll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.36, 0.36, 0.92, 20),
            rMat
          );
          fRoll.rotation.x = Math.PI / 2;
          fRoll.position.set(px + dx, 0.12 + 0.36, frontZ);
          rackGroup.add(fRoll);
        });
      }
    }

    // 5. Electric Walkie Roll Stacker ("DLX" Black/Orange Mast Stacker in aisle, matching photo)
    const stX = -bayW * 0.15;
    const stZ = r.d * 0.19;
    const stBase = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.42, 0.95), wm.stackerOrangeMat);
    stBase.position.set(stX, 0.22, stZ + 0.35);
    const stHood = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.35, 0.48), wm.stackerBlackMat);
    stHood.position.set(stX, 0.55, stZ + 0.45);
    rackGroup.add(stBase, stHood);

    // Dual Vertical Lift Mast
    [-0.24, 0.24].forEach(mx => {
      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.75, 0.10), wm.stackerBlackMat);
      mast.position.set(stX + mx, 1.38, stZ - 0.05);
      rackGroup.add(mast);
    });
    const mastCross = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.12), wm.stackerBlackMat);
    mastCross.position.set(stX, 2.68, stZ - 0.05);
    const tiller = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.75, 8), wm.stackerBlackMat);
    tiller.position.set(stX, 0.95, stZ + 0.78);
    tiller.rotation.x = 0.45;
    rackGroup.add(mastCross, tiller);
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
      // WH-PRD: High-Density 5-Tier Hanging Film Roll Racks (Hall 1 South)
      // Matches factory photo: Royal-Blue Upright Frames + Orange Saddle Beams +
      // Suspended Laminated/Printed Jumbo Film Rolls on Steel Pipe Shafts (5 Tiers)
      // ------------------------------------------------------------------------
      const wm = getWIPRollMaterials();
      const numRows = 3;
      const tiers = 5;
      const rackD = 1.22;
      const rackH = Math.max(H || 5.4, 5.4);
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

      const numBays = 8; // 8 closely-spaced roll bays per block (16 bays per full row)
      const bayW = (segL * 0.96) / numBays;
      const halfSpanZ = rackD * 0.44;

      for (let a = 0; a < numRows; a++) {
        const rz = rowZ[a];
        const zFront = rz + halfSpanZ;
        const zBack = rz - halfSpanZ;

        segCentersX.forEach((cx, segIdx) => {
          // 1. Blue Perforated Upright Columns & Diagonal Lattice Bracing at every bay
          for (let b = 0; b <= numBays; b++) {
            const bx = cx - segL * 0.48 + b * bayW;

            // Front & Back Blue Upright Posts
            [zFront, zBack].forEach(pz => {
              const post = new THREE.Mesh(
                new THREE.BoxGeometry(0.085, rackH, 0.085),
                wm.royalBlueRackMat
              );
              post.position.set(bx, rackH * 0.5, pz);
              group.add(post);
            });

            // Horizontal & Diagonal Blue Frame Bracing between front and back posts
            for (let t = 0; t < tiers; t++) {
              const braceY = 0.55 + t * 0.98;
              const hTie = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.05, rackD * 0.88),
                wm.darkBlueBraceMat
              );
              hTie.position.set(bx, braceY, rz);
              group.add(hTie);

              const dBrace = new THREE.Mesh(
                new THREE.BoxGeometry(0.04, 0.04, rackD * 0.95),
                wm.darkBlueBraceMat
              );
              dBrace.position.set(bx, braceY + 0.46, rz);
              dBrace.rotation.x = (t % 2 === 0 ? 1 : -1) * 0.45;
              group.add(dBrace);
            }
          }

          // 2. Five Vertical Tiers of Orange Load Beams, Saddle Brackets & Suspended Film Rolls
          for (let t = 0; t < tiers; t++) {
            const beamY = 0.62 + t * 0.98;
            const rollY = beamY + 0.16;
            const rollRad = 0.37;

            // Front & Back Orange Longitudinal Beams along X
            [zFront, zBack].forEach(bz => {
              const oBeam = new THREE.Mesh(
                new THREE.BoxGeometry(segL * 0.97, 0.10, 0.07),
                wm.orangeBeamMat
              );
              oBeam.position.set(cx, beamY, bz);
              group.add(oBeam);
            });

            // Suspended Jumbo Film Roll on Hollow Steel Pipe Shaft in each bay
            for (let b = 0; b < numBays; b++) {
              const px = cx - segL * 0.48 + (b + 0.5) * bayW;

              // Orange U-Cradle Saddle Brackets supporting the shaft on front & back beams
              [zFront, zBack].forEach(bz => {
                const bracket = new THREE.Mesh(
                  new THREE.BoxGeometry(0.16, 0.14, 0.12),
                  wm.orangeBeamMat
                );
                bracket.position.set(px, beamY + 0.09, bz);
                group.add(bracket);
              });

              // Steel Hanging Pipe Shaft passing through the roll core
              const shaft = new THREE.Mesh(
                new THREE.CylinderGeometry(0.038, 0.038, rackD + 0.16, 10),
                wm.steelShaftMat
              );
              shaft.rotation.x = Math.PI / 2;
              shaft.position.set(px, rollY, rz);
              group.add(shaft);

              // Suspended Printed & Laminated Jumbo Film Roll (No pallets or boxes)
              const matIdx = (a * 3 + t * 2 + b + segIdx) % wm.printedRollMats.length;
              const roll = new THREE.Mesh(
                new THREE.CylinderGeometry(rollRad, rollRad, rackD * 0.76, 18),
                wm.printedRollMats[matIdx]
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
