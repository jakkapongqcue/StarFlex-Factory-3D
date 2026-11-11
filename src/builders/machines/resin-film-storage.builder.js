// ============================================================================
// Module: src/builders/machines/resin-film-storage.builder.js
// Procedural 3D Builders for:
// 1. Position 1: White Film Roll Storage Racks (2 parallel rack rows)
// 2. Position 2: Polymer Resin Pellet Sack Storage Pallets (Authentic 25kg sacks)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.ResinFilmStorage = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.MachineCommon;

  let _cachedResinSackTexture = null;
  let _cachedResinSackMaterials = null;

  function getResinSackTexture() {
    if (_cachedResinSackTexture) return _cachedResinSackTexture;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // 1. Woven Polymer Sack body (clean virgin poly white)
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 512, 512);

    // Fine woven polypropylene crosshatch texture
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }

    // 2. High-visibility Royal Blue brand band
    const bandGrad = ctx.createLinearGradient(0, 130, 0, 270);
    bandGrad.addColorStop(0, "#1d4ed8");
    bandGrad.addColorStop(1, "#1e40af");
    ctx.fillStyle = bandGrad;
    ctx.fillRect(24, 130, 464, 140);

    // Sky-blue accent stripe
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(24, 270, 464, 14);

    // Product Grade Heading
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("POLYMER RESIN", 256, 178);

    ctx.font = 'bold 19px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = "#bae6fd";
    ctx.fillText("VIRGIN PELLETS • BLOWN FILM GRADE", 256, 225);

    // 3. Technical Markings
    ctx.fillStyle = "#0f172a";
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText("NET WT. 25.0 KG (55.1 LBS)", 256, 335);

    ctx.fillStyle = "#475569";
    ctx.font = "15px monospace";
    ctx.fillText("LOT: 2026-HDPE-9942A | MFI: 2.1 g/10min", 256, 375);
    ctx.fillText("STARFLEX CO., LTD. • [PE-HD 02]", 256, 405);

    // 4. Seam crepe tape and stitch lines
    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(10, 10, 18, 492);
    ctx.fillRect(484, 10, 18, 492);

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(19, 14); ctx.lineTo(19, 498);
    ctx.moveTo(493, 14); ctx.lineTo(493, 498);
    ctx.stroke();
    ctx.setLineDash([]);

    _cachedResinSackTexture = new THREE.CanvasTexture(canvas);
    return _cachedResinSackTexture;
  }

  function getResinSackMaterials() {
    if (_cachedResinSackMaterials) return _cachedResinSackMaterials;
    const tex = getResinSackTexture();
    const topMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.05 });
    const sideMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 });
    const btmMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
    // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
    const boxMaterials = [sideMat, sideMat, topMat, btmMat, sideMat, sideMat];
    const seamMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 });
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });

    _cachedResinSackMaterials = {
      box: boxMaterials,
      side: sideMat,
      seam: seamMat,
      tape: tapeMat
    };
    return _cachedResinSackMaterials;
  }

  function createSingleResinSack(len, wid, hgt) {
    len = len || 1.15;
    wid = wid || 0.65;
    hgt = hgt || 0.22;

    const sMats = getResinSackMaterials();
    const sackGrp = new THREE.Group();

    // Main cushion core
    const bodyBox = new THREE.Mesh(new THREE.BoxGeometry(len * 0.94, hgt * 0.88, wid * 0.90), sMats.box);
    bodyBox.position.y = hgt * 0.5;
    sackGrp.add(bodyBox);

    // Pillowed rounded bulging sides
    const sideGeo = new THREE.CylinderGeometry(hgt * 0.44, hgt * 0.44, len * 0.86, 8);
    const side1 = new THREE.Mesh(sideGeo, sMats.side);
    side1.rotation.z = Math.PI / 2;
    side1.position.set(0, hgt * 0.5, wid * 0.42);
    sackGrp.add(side1);

    const side2 = new THREE.Mesh(sideGeo, sMats.side);
    side2.rotation.z = Math.PI / 2;
    side2.position.set(0, hgt * 0.5, -wid * 0.42);
    sackGrp.add(side2);

    // Pinched sewn end seams
    const seamGeo = new THREE.BoxGeometry(len * 0.04, hgt * 0.35, wid * 0.88);
    const seamL = new THREE.Mesh(seamGeo, sMats.seam);
    seamL.position.set(-len * 0.485, hgt * 0.5, 0);
    sackGrp.add(seamL);

    const seamR = new THREE.Mesh(seamGeo, sMats.seam);
    seamR.position.set(len * 0.485, hgt * 0.5, 0);
    sackGrp.add(seamR);

    // Blue industrial crepe stitch tape
    const tapeGeo = new THREE.BoxGeometry(len * 0.02, hgt * 0.42, wid * 0.90);
    const tapeL = new THREE.Mesh(tapeGeo, sMats.tape);
    tapeL.position.set(-len * 0.495, hgt * 0.5, 0);
    sackGrp.add(tapeL);

    const tapeR = new THREE.Mesh(tapeGeo, sMats.tape);
    tapeR.position.set(len * 0.495, hgt * 0.5, 0);
    sackGrp.add(tapeR);

    return sackGrp;
  }

  function createPalletBaseMesh(palletW, palletD) {
    palletW = palletW || 1.8;
    palletD = palletD || 1.4;
    const palGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });

    // Top deck board
    const deck = new THREE.Mesh(new THREE.BoxGeometry(palletW, 0.045, palletD), woodMat);
    deck.position.y = 0.12;
    palGroup.add(deck);

    // 3 Stringer runner blocks
    [-palletW * 0.42, 0, palletW * 0.42].forEach(bx => {
      const runner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, palletD), woodMat);
      runner.position.set(bx, 0.05, 0);
      palGroup.add(runner);
    });

    return palGroup;
  }

  function buildResinSackPalletLayers(parentGroup, baseHeight) {
    baseHeight = baseHeight !== undefined ? baseHeight : 0.145;
    const len = 1.15;
    const wid = 0.65;
    const hgt = 0.22;

    // Layer 1: 4 sacks horizontal along X
    [-0.34, 0.34].forEach(x => {
      [-0.42, 0.42].forEach(z => {
        const s = createSingleResinSack(len, wid, hgt);
        s.position.set(x, baseHeight, z);
        parentGroup.add(s);
      });
    });

    // Layer 2: 4 sacks cross-stacked horizontal along Z (rotated 90 deg)
    [-0.42, 0.42].forEach(x => {
      [-0.34, 0.34].forEach(z => {
        const s = createSingleResinSack(len, wid, hgt);
        s.rotation.y = Math.PI / 2;
        s.position.set(x, baseHeight + hgt, z);
        parentGroup.add(s);
      });
    });

    // Layer 3: 4 sacks horizontal along X
    [-0.34, 0.34].forEach(x => {
      [-0.42, 0.42].forEach(z => {
        const s = createSingleResinSack(len, wid, hgt);
        s.position.set(x, baseHeight + hgt * 2, z);
        parentGroup.add(s);
      });
    });

    // Layer 4: 2 sacks on top
    [-0.30, 0.30].forEach(z => {
      const s = createSingleResinSack(len, wid, hgt);
      s.rotation.y = Math.PI / 2;
      s.position.set(0, baseHeight + hgt * 3, z);
      parentGroup.add(s);
    });

    return parentGroup;
  }

  function createVerticalFilmRoll(x, z, r, h, colorHex) {
    const rollGrp = new THREE.Group();
    rollGrp.position.set(x, 0, z);

    const whiteRollMat = new THREE.MeshStandardMaterial({
      color: colorHex || 0xf8fafc,
      roughness: 0.28,
      metalness: 0.1
    });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 24), whiteRollMat);
    body.position.y = h * 0.5;
    body.castShadow = true;
    rollGrp.add(body);

    const hole = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.32, r * 0.32, 0.04, 16), coreMat);
    hole.position.y = h + 0.01;
    rollGrp.add(hole);

    return rollGrp;
  }

  // =========================================================================
  // 1. POSITION 1: WHITE FILM ROLL STORAGE RACKS (2 Parallel Rack Lines)
  // ม้วนฟิล์มสีขาววางขวางกับแนว Rack (Cylinder axis across rack depth along X)
  // =========================================================================
  function buildFilmRollRacks(group, r, H, mats) {
    const rackH = Math.min(H, 5.2);
    const rowLen = r.d * 0.88;
    const rowDepth = 1.85;
    const bluePostMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.3 });
    const orangeBeamMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35, metalness: 0.2 });
    const whiteRollMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.1 });
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    // 2 Parallel Rack Rows (West Row at x = -r.w * 0.28, East Row at x = +r.w * 0.28)
    const rowXPositions = [-r.w * 0.28, r.w * 0.28];
    const numBays = 5;
    const bayLen = rowLen / numBays;
    const tierHeights = [1.15, 2.65, 4.15];

    rowXPositions.forEach(rx => {
      const rackRow = new THREE.Group();
      rackRow.position.set(rx, 0, 0);

      // Upright Posts along Z (both sides of the rack depth)
      for (let b = 0; b <= numBays; b++) {
        const pz = -rowLen * 0.5 + b * bayLen;
        [-rowDepth * 0.5, rowDepth * 0.5].forEach(dx => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, rackH, 0.18), bluePostMat);
          post.position.set(dx, rackH * 0.5, pz);
          addEdges(post, 0x0369a1, 0.5);
          rackRow.add(post);
        });

        // Cross bracing between the two posts
        [rackH * 0.35, rackH * 0.7].forEach(hy => {
          const brace = new THREE.Mesh(new THREE.BoxGeometry(rowDepth, 0.08, 0.08), bluePostMat);
          brace.position.set(0, hy, pz);
          rackRow.add(brace);
        });
      }

      // Horizontal Load Beams & Crosswise Film Rolls (วางขวางกับ Rack)
      tierHeights.forEach(by => {
        // Front & Back orange beams along Z
        [-rowDepth * 0.5, rowDepth * 0.5].forEach(dx => {
          const beam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, rowLen), orangeBeamMat);
          beam.position.set(dx, by, 0);
          rackRow.add(beam);
        });

        // In each bay, place multiple white film rolls oriented TRANSVERSELY (วางขวาง: length across X)
        for (let b = 0; b < numBays; b++) {
          const bz = -rowLen * 0.5 + (b + 0.5) * bayLen;
          const rollRadius = 0.44;
          const rollLength = rowDepth * 0.92; // Spans across the front & back beams
          const rollsPerBay = 3;

          for (let k = 0; k < rollsPerBay; k++) {
            const rollZ = bz - bayLen * 0.30 + k * (bayLen * 0.30);
            const roll = new THREE.Mesh(
              new THREE.CylinderGeometry(rollRadius, rollRadius, rollLength, 20),
              whiteRollMat
            );
            // Rotate along Z so the cylinder lies along X (วางขวางกับแนว Rack)
            roll.rotation.z = Math.PI / 2;
            roll.position.set(0, by + rollRadius + 0.05, rollZ);
            addEdges(roll, 0xcbd5e1, 0.5);
            rackRow.add(roll);

            // Dark hollow core discs on both circular ends facing aisle (-X and +X)
            [-rollLength * 0.5 - 0.01, rollLength * 0.5 + 0.01].forEach(endX => {
              const coreDisc = new THREE.Mesh(new THREE.CircleGeometry(rollRadius * 0.32, 16), coreMat);
              coreDisc.position.set(endX, by + rollRadius + 0.05, rollZ);
              coreDisc.rotation.y = endX > 0 ? Math.PI / 2 : -Math.PI / 2;
              rackRow.add(coreDisc);
            });
          }
        }
      });

      // Ground level under each bay: additional rolls resting on wooden pallet floor supports
      for (let b = 0; b < numBays; b++) {
        const bz = -rowLen * 0.5 + (b + 0.5) * bayLen;
        const rollRadius = 0.44;
        const rollLength = rowDepth * 0.92;
        [-bayLen * 0.24, bayLen * 0.24].forEach(offZ => {
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(rollRadius, rollRadius, rollLength, 20),
            whiteRollMat
          );
          roll.rotation.z = Math.PI / 2;
          roll.position.set(0, rollRadius + 0.02, bz + offZ);
          addEdges(roll, 0xcbd5e1, 0.5);
          rackRow.add(roll);
        });
      }

      // Standing vertical rolls at ends of the rack aisle
      [-rowLen * 0.5 - 1.2, rowLen * 0.5 + 1.2].forEach(endZ => {
        const vRoll = createVerticalFilmRoll(0, endZ, 0.65, 2.2, 0xf8fafc);
        rackRow.add(vRoll);
      });

      group.add(rackRow);
    });

    // Signboard for Position 1
    const sign = createSignboardMesh(
      4.2,
      0.65,
      "ชั้นวางเก็บม้วนฟิล์มสีขาว (2 แถว)",
      "WHITE FILM ROLL STORAGE RACKS",
      "#0284c7",
      "#ffffff",
      "#38bdf8"
    );
    sign.position.set(0, rackH + 0.6, -rowLen * 0.5);
    group.add(sign);
  }

  // =========================================================================
  // 2. POSITION 2: RESIN SACK STORAGE RACKS (2 Parallel Rack Lines - ไม่ตีกรอบสีเหลือง)
  // =========================================================================
  function buildResinStorage(group, r, H, mats) {
    const rackH = Math.min(H, 5.2);
    const rowLen = r.d * 0.88;
    const rowDepth = 1.85;
    const bluePostMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.3 });
    const orangeBeamMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35, metalness: 0.2 });

    // 2 Parallel Rack Rows for Resin Storage (West Row and East Row)
    // หมายเหตุ: ไม่ตีกรอบสีเหลืองบนพื้นตามที่ผู้ใช้สั่ง
    const rowXPositions = [-r.w * 0.28, r.w * 0.28];
    const numBays = 5;
    const bayLen = rowLen / numBays;
    const tierHeights = [1.15, 2.65, 4.15];

    rowXPositions.forEach((rx, rowIdx) => {
      const rackRow = new THREE.Group();
      rackRow.position.set(rx, 0, 0);

      // Upright Posts along Z (both sides of the rack depth)
      for (let b = 0; b <= numBays; b++) {
        const pz = -rowLen * 0.5 + b * bayLen;
        [-rowDepth * 0.5, rowDepth * 0.5].forEach(dx => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, rackH, 0.18), bluePostMat);
          post.position.set(dx, rackH * 0.5, pz);
          addEdges(post, 0x0369a1, 0.5);
          rackRow.add(post);
        });

        // Cross bracing between posts
        [rackH * 0.35, rackH * 0.7].forEach(hy => {
          const brace = new THREE.Mesh(new THREE.BoxGeometry(rowDepth, 0.08, 0.08), bluePostMat);
          brace.position.set(0, hy, pz);
          rackRow.add(brace);
        });
      }

      // Horizontal Load Beams on front & back
      tierHeights.forEach(by => {
        [-rowDepth * 0.5, rowDepth * 0.5].forEach(dx => {
          const beam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, rowLen), orangeBeamMat);
          beam.position.set(dx, by, 0);
          rackRow.add(beam);
        });

        // On each tier in each bay: place stored material
        for (let b = 0; b < numBays; b++) {
          const bz = -rowLen * 0.5 + (b + 0.5) * bayLen;

          if ((b + rowIdx) % 3 === 2) {
            // Bay with standing vertical film rolls on pallet (matching reference image)
            const pal = createPalletBaseMesh(1.8, 1.4);
            pal.position.set(0, by + 0.02, bz);
            rackRow.add(pal);

            [-0.36, 0.36].forEach(rollZ => {
              const rollMesh = createVerticalFilmRoll(0, bz + rollZ, 0.48, 1.25, 0xf8fafc);
              rollMesh.position.y = by + 0.14;
              rackRow.add(rollMesh);
            });
          } else {
            // Bay with pallet of stacked 25kg Polymer Resin Sacks (Starflex Brand)
            const pal = createPalletBaseMesh(1.8, 1.4);
            pal.position.set(0, by + 0.02, bz);
            buildResinSackPalletLayers(pal, 0.145);
            rackRow.add(pal);
          }
        }
      });

      // Ground level under each bay
      for (let b = 0; b < numBays; b++) {
        const bz = -rowLen * 0.5 + (b + 0.5) * bayLen;
        if (b % 2 === 0) {
          const pal = createPalletBaseMesh(1.8, 1.4);
          pal.position.set(0, 0, bz);
          buildResinSackPalletLayers(pal, 0.145);
          rackRow.add(pal);
        } else {
          const pal = createPalletBaseMesh(1.8, 1.4);
          pal.position.set(0, 0, bz);
          rackRow.add(pal);
          [-0.36, 0.36].forEach(rollZ => {
            const rollMesh = createVerticalFilmRoll(0, bz + rollZ, 0.52, 1.35, 0xf8fafc);
            rollMesh.position.y = 0.14;
            rackRow.add(rollMesh);
          });
        }
      }

      group.add(rackRow);
    });

    // Signboard for Position 2
    const sign = createSignboardMesh(
      4.2,
      0.65,
      "ชั้นวางเก็บถุงกระสอบเรซิน (2 แถว)",
      "RESIN & RAW FILMS STORAGE RACKS",
      "#1e40af",
      "#ffffff",
      "#60a5fa"
    );
    sign.position.set(0, rackH + 0.6, -rowLen * 0.5);
    group.add(sign);
  }

  return {
    buildFilmRollRacks,
    buildResinStorage
  };
})();
