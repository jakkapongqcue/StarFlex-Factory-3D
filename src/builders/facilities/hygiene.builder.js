// ============================================================================
// Module: src/builders/facilities/hygiene.builder.js
// Procedural 3D Builder for Hygiene Room & Air Shower Anteroom (WALK-HYGIENE).
// Features: Open-top visual inspection framing, L-shaped sink counter, 
// 32-nozzle Air Shower booth with HEPA blowers, North exit door, step-over bench.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facilities = window.Starflex3D.Builders.Facilities || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;

  function buildHygieneRoom(walkGroup, floorD, mats) {
    const hygW = 10.0; // Spans from Corridor 6 west edge (px: 1056) to Locker room east wall (px: 1156)
    const hygD = 8.0;  // Length along Z (py: 320..400)
    const hygH = 3.3;
    const hygZ = -floorD * 0.5 + hygD * 0.5;

    // Walkway center is px = 1079; room center is px = 1106 -> offset along X is +2.7m
    const hygGroup = new THREE.Group();
    hygGroup.position.set(2.7, 0, hygZ);
    walkGroup.add(hygGroup);

    const cleanWallMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.25,
      metalness: 0.05,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const cleanFloorMat = new THREE.MeshStandardMaterial({ color: 0x7e8b9b, roughness: 0.45, metalness: 0.06 });
    const stainlessMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.2 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 });
    const blueFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const greenFrameMat = new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.5, roughness: 0.3 });
    const visionGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.55
    });

    // 1. Cleanroom Floor Slab (พื้นห้องสุขอนามัยสีเทา กว้าง 10.0m x 8.0m)
    const hygFloor = new THREE.Mesh(new THREE.BoxGeometry(hygW - 0.05, 0.04, hygD - 0.05), cleanFloorMat);
    hygFloor.position.y = 0.02;
    addEdges(hygFloor, 0x475569, 0.75);
    hygGroup.add(hygFloor);

    // 2. Open Top Architectural Framing & Interior Lighting (มองเห็นภายในห้องสุขอนามัยได้ชัดเจนทุกมุม)
    const hygFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 });
    const topBeams = [
      { w: hygW, h: 0.14, d: 0.16, x: 0, z: hygD * 0.5 - 0.07 },
      { w: hygW, h: 0.14, d: 0.16, x: 0, z: -hygD * 0.5 + 0.07 },
      { w: 0.16, h: 0.14, d: hygD, x: hygW * 0.5 - 0.07, z: 0 },
      { w: 0.16, h: 0.14, d: hygD, x: -hygW * 0.5 + 0.07, z: 0 }
    ];
    topBeams.forEach(b => {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), hygFrameMat);
      beam.position.set(b.x, hygH + 0.07, b.z);
      addEdges(beam, 0x38bdf8, 0.7);
      hygGroup.add(beam);
    });

    // Interior illumination so interior sinks & air shower are bright and clearly visible
    const hygInteriorLight = new THREE.PointLight(0xffffff, 0.9, 18);
    hygInteriorLight.position.set(0, 2.8, 0);
    hygGroup.add(hygInteriorLight);

    // 3. Middle Structural Steel Columns along Corridor boundary (x = -0.4m, corresponding to px = 1102)
    const midColX = -0.4;
    [-hygD * 0.5, 0, hygD * 0.5].forEach(cz => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, hygH, 0.46),
        mats.steelColumn || new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 })
      );
      col.position.set(midColX, hygH * 0.5, cz);
      addEdges(col, 0x475569, 0.8);
      hygGroup.add(col);
    });

    // 4. South Wall (+Z = +4.0m): Entrance from White Walkway (Corridor 6)
    // Walkway center is aligned at x = -2.7m; NO FRONT SIGNBOARD per user instruction
    const southWallZ = hygD * 0.5 - 0.07;
    const sDoorX = -2.7;
    const sDoorW = 2.0;
    const sDoorH = 2.4;

    // Wall left of entrance door (x: -5.0m .. -3.7m)
    const sWallLeftW = Math.max(0.1, (sDoorX - sDoorW * 0.5) - (-hygW * 0.5));
    const sWallLeft = new THREE.Mesh(new THREE.BoxGeometry(sWallLeftW, hygH, 0.14), cleanWallMat);
    sWallLeft.position.set(-hygW * 0.5 + sWallLeftW * 0.5, hygH * 0.5, southWallZ);
    addEdges(sWallLeft, 0x94a3b8, 0.5);
    hygGroup.add(sWallLeft);

    // Wall right of entrance door (x: -1.7m .. +5.0m, spans across middle column behind L-sink return)
    const sWallRightW = Math.max(0.1, (hygW * 0.5) - (sDoorX + sDoorW * 0.5));
    const sWallRight = new THREE.Mesh(new THREE.BoxGeometry(sWallRightW, hygH, 0.14), cleanWallMat);
    sWallRight.position.set(hygW * 0.5 - sWallRightW * 0.5, hygH * 0.5, southWallZ);
    addEdges(sWallRight, 0x94a3b8, 0.5);
    hygGroup.add(sWallRight);

    // Header wall above South door
    const sWallTop = new THREE.Mesh(new THREE.BoxGeometry(sDoorW, hygH - sDoorH, 0.14), cleanWallMat);
    sWallTop.position.set(sDoorX, sDoorH + (hygH - sDoorH) * 0.5, southWallZ);
    hygGroup.add(sWallTop);

    // South Entrance Double Glass Door (no sign above)
    const sDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(sDoorW, sDoorH, 0.16), blueFrameMat);
    sDoorFrame.position.set(sDoorX, sDoorH * 0.5, southWallZ);
    addEdges(sDoorFrame, 0x38bdf8, 0.7);
    hygGroup.add(sDoorFrame);

    [-sDoorW * 0.25, sDoorW * 0.25].forEach(dx => {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(sDoorW * 0.46, sDoorH - 0.08, 0.06), visionGlassMat);
      leaf.position.set(sDoorX + dx, sDoorH * 0.5, southWallZ);
      addEdges(leaf, 0xffffff, 0.9);
      const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8), stainlessMat);
      pushBar.position.set(sDoorX + dx + (dx > 0 ? -0.32 : 0.32), 1.15, southWallZ + 0.05);
      hygGroup.add(leaf, pushBar);
    });

    // 5. East Wall (+X = +5.0m): Flush with Locker Room East Wall (px = 1156)
    const eastWallX = hygW * 0.5 - 0.07;
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, hygD), cleanWallMat);
    eastWall.position.set(eastWallX, hygH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.6);
    hygGroup.add(eastWall);

    const eastWin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 2.6), visionGlassMat);
    eastWin.position.set(eastWallX, 1.9, -1.8);
    addEdges(eastWin, 0xffffff, 0.8);
    hygGroup.add(eastWin);

    // --- L-SHAPED SINK COUNTER ON THE RIGHT (East + South-East) ---
    const lSinkGroup = new THREE.Group();
    hygGroup.add(lSinkGroup);

    // Arm 1: Main Arm along East wall (+X)
    const arm1L = 5.2; // length along Z
    const arm1W = 0.68;
    const arm1Z = 0.6;  // spans from south wall to z = -2.0
    const arm1X = eastWallX - arm1W * 0.5 - 0.07;
    const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(arm1W, 0.85, arm1L), stainlessMat);
    arm1Mesh.position.set(arm1X, 0.425, arm1Z);
    addEdges(arm1Mesh, 0x64748b, 0.7);
    lSinkGroup.add(arm1Mesh);

    // Arm 2: Return Arm along South wall (+Z) forming the "L"
    const arm2L = 3.6; // length along X
    const arm2W = 0.68;
    const arm2Z = southWallZ - arm2W * 0.5 - 0.07;
    const arm2X = arm1X - arm1W * 0.5 - arm2L * 0.5;
    const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(arm2L, 0.85, arm2W), stainlessMat);
    arm2Mesh.position.set(arm2X, 0.425, arm2Z);
    addEdges(arm2Mesh, 0x64748b, 0.7);
    lSinkGroup.add(arm2Mesh);

    // Stainless splashbacks / mirrors along the L walls
    const splashEast = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.75, arm1L), visionGlassMat);
    splashEast.position.set(eastWallX - 0.09, 1.25, arm1Z);
    addEdges(splashEast, 0x38bdf8, 0.6);
    lSinkGroup.add(splashEast);

    const splashSouth = new THREE.Mesh(new THREE.BoxGeometry(arm2L + arm1W, 0.75, 0.04), visionGlassMat);
    splashSouth.position.set(arm2X + arm1W * 0.5, 1.25, southWallZ - 0.09);
    addEdges(splashSouth, 0x38bdf8, 0.6);
    lSinkGroup.add(splashSouth);

    // 4 Sinks + Faucets + Soap Dispensers on Arm 1 (East wall)
    [-1.8, -0.6, 0.6, 1.8].forEach(fz => {
      const basin = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.18, 0.58),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
      );
      basin.position.set(arm1X, 0.85, arm1Z + fz);
      lSinkGroup.add(basin);

      const faucetPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8), chromeMat);
      faucetPipe.position.set(arm1X + 0.2, 1.02, arm1Z + fz);
      const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.03), chromeMat);
      faucetSpout.position.set(arm1X + 0.13, 1.15, arm1Z + fz);
      lSinkGroup.add(faucetPipe, faucetSpout);

      const dispenser = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.24, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.2, roughness: 0.3 })
      );
      dispenser.position.set(eastWallX - 0.11, 1.35, arm1Z + fz);
      lSinkGroup.add(dispenser);
    });

    // 2 Sinks + Dispensers on Arm 2 (South wall return)
    [-0.9, 0.6].forEach(fx => {
      const basinS = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.18, 0.48),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
      );
      basinS.position.set(arm2X + fx, 0.85, arm2Z);
      const faucetS = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8), chromeMat);
      faucetS.position.set(arm2X + fx, 1.02, arm2Z + 0.2);
      const dispenserS = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.24, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.2, roughness: 0.3 })
      );
      dispenserS.position.set(arm2X + fx, 1.35, southWallZ - 0.11);
      lSinkGroup.add(basinS, faucetS, dispenserS);
    });

    // High-speed automatic hand dryers on East wall north of sink
    [-2.4].forEach(dz => {
      const dryer = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.44, 0.32),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
      );
      dryer.position.set(eastWallX - 0.15, 1.25, dz);
      addEdges(dryer, 0x94a3b8, 0.7);
      lSinkGroup.add(dryer);
    });

    // 6. West Wall (-X = -5.0m): Air Shower Booth into Production Line
    const westWallX = -hygW * 0.5 + 0.07;
    const asCenterZ = -0.6;
    const asW = 1.8;  // length along Z
    const asD = 1.8;  // depth along X
    const asH = 2.65;

    // West wall sections around the Air Shower
    const wWallNorthL = Math.max(0.2, (asCenterZ - asW * 0.5) - (-hygD * 0.5));
    const wWallNorth = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, wWallNorthL), cleanWallMat);
    wWallNorth.position.set(westWallX, hygH * 0.5, -hygD * 0.5 + wWallNorthL * 0.5);
    addEdges(wWallNorth, 0x94a3b8, 0.6);
    hygGroup.add(wWallNorth);

    const wWallSouthL = Math.max(0.2, (hygD * 0.5) - (asCenterZ + asW * 0.5));
    const wWallSouth = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH, wWallSouthL), cleanWallMat);
    wWallSouth.position.set(westWallX, hygH * 0.5, hygD * 0.5 - wWallSouthL * 0.5);
    addEdges(wWallSouth, 0x94a3b8, 0.6);
    hygGroup.add(wWallSouth);

    const wWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.14, hygH - asH, asW), cleanWallMat);
    wWallTop.position.set(westWallX, asH + (hygH - asH) * 0.5, asCenterZ);
    hygGroup.add(wWallTop);

    // --- AIR SHOWER BOOTH CABIN ---
    const airShowerGroup = new THREE.Group();
    airShowerGroup.position.set(westWallX, 0, asCenterZ);
    hygGroup.add(airShowerGroup);

    // Stainless structural chamber walls
    [-asW * 0.45, asW * 0.45].forEach(sz => {
      const asSideWall = new THREE.Mesh(new THREE.BoxGeometry(asD, asH, 0.16), stainlessMat);
      asSideWall.position.set(0, asH * 0.5, sz);
      addEdges(asSideWall, 0x64748b, 0.8);
      airShowerGroup.add(asSideWall);

      // Jet nozzles array (16 high-velocity circular nozzles on each side, total 32 nozzles)
      for (let nx = -asD * 0.35; nx <= asD * 0.35; nx += 0.28) {
        for (let ny = 0.75; ny <= 2.2; ny += 0.45) {
          const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 0.06, 8),
            new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.1 })
          );
          nozzle.rotation.x = Math.PI / 2;
          nozzle.position.set(nx, ny, sz + (sz > 0 ? -0.09 : 0.09));
          airShowerGroup.add(nozzle);
        }
      }
    });

    // Air Shower Top HEPA Fan / Blower Casing
    const asBlowerTop = new THREE.Mesh(new THREE.BoxGeometry(asD + 0.1, 0.38, asW), stainlessMat);
    asBlowerTop.position.set(0, asH + 0.19, 0);
    addEdges(asBlowerTop, 0x475569, 0.8);
    airShowerGroup.add(asBlowerTop);

    // Fan circular intake grilles on top
    [-asD * 0.24, asD * 0.24].forEach(fx => {
      const fanGrille = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.06, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
      );
      fanGrille.position.set(fx, asH + 0.41, 0);
      airShowerGroup.add(fanGrille);
    });

    // Anti-dust sticky mat inside
    const asFloorMat = new THREE.Mesh(
      new THREE.PlaneGeometry(asD * 0.75, asW * 0.75),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 })
    );
    asFloorMat.rotation.x = -Math.PI / 2;
    asFloorMat.position.y = 0.035;
    airShowerGroup.add(asFloorMat);

    // Inner Door (East door, entering from hygiene room)
    const inDoorX = asD * 0.5;
    const inDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, asH, asW * 0.8), blueFrameMat);
    inDoorFrame.position.set(inDoorX, asH * 0.5, 0);
    addEdges(inDoorFrame, 0x38bdf8, 0.8);
    const inDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.04, asH - 0.15, asW * 0.72), visionGlassMat);
    inDoorLeaf.position.set(inDoorX, asH * 0.5, 0);
    addEdges(inDoorLeaf, 0xffffff, 0.9);
    airShowerGroup.add(inDoorFrame, inDoorLeaf);

    // Outer Door (West door, exiting directly into Hall 2 production line)
    const outDoorX = -asD * 0.5;
    const outDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, asH, asW * 0.8), blueFrameMat);
    outDoorFrame.position.set(outDoorX, asH * 0.5, 0);
    addEdges(outDoorFrame, 0x38bdf8, 0.8);
    const outDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.04, asH - 0.15, asW * 0.72), visionGlassMat);
    outDoorLeaf.position.set(outDoorX, asH * 0.5, 0);
    addEdges(outDoorLeaf, 0xffffff, 0.9);
    airShowerGroup.add(outDoorFrame, outDoorLeaf);

    // Air Shower Status Beacon
    const asBeacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.22, 10),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.9 })
    );
    asBeacon.position.set(inDoorX - 0.1, asH + 0.35, 0);
    airShowerGroup.add(asBeacon);

    // 7. North Wall (-Z = -4.0m): Regular Exit Door
    const northWallZ = -hygD * 0.5 + 0.07;
    const nDoorX = 2.2;
    const nDoorW = 1.7;
    const nDoorH = 2.4;

    // Wall sections around North Door
    const nWallLeftW = Math.max(0.2, (nDoorX - nDoorW * 0.5) - (-hygW * 0.5));
    const nWallLeft = new THREE.Mesh(new THREE.BoxGeometry(nWallLeftW, hygH, 0.14), cleanWallMat);
    nWallLeft.position.set(-hygW * 0.5 + nWallLeftW * 0.5, hygH * 0.5, northWallZ);
    addEdges(nWallLeft, 0x94a3b8, 0.6);
    hygGroup.add(nWallLeft);

    const nWallRightW = Math.max(0.2, (hygW * 0.5) - (nDoorX + nDoorW * 0.5));
    const nWallRight = new THREE.Mesh(new THREE.BoxGeometry(nWallRightW, hygH, 0.14), cleanWallMat);
    nWallRight.position.set(hygW * 0.5 - nWallRightW * 0.5, hygH * 0.5, northWallZ);
    addEdges(nWallRight, 0x94a3b8, 0.6);
    hygGroup.add(nWallRight);

    const nWallTop = new THREE.Mesh(new THREE.BoxGeometry(nDoorW, hygH - nDoorH, 0.14), cleanWallMat);
    nWallTop.position.set(nDoorX, nDoorH + (hygH - nDoorH) * 0.5, northWallZ);
    hygGroup.add(nWallTop);

    const nDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(nDoorW, nDoorH, 0.16), greenFrameMat);
    nDoorFrame.position.set(nDoorX, nDoorH * 0.5, northWallZ);
    addEdges(nDoorFrame, 0x34d399, 0.8);
    hygGroup.add(nDoorFrame);

    const nDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(nDoorW - 0.1, nDoorH - 0.08, 0.06), visionGlassMat);
    nDoorLeaf.position.set(nDoorX, nDoorH * 0.5, northWallZ);
    addEdges(nDoorLeaf, 0xffffff, 0.9);
    const nDoorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), stainlessMat);
    nDoorHandle.position.set(nDoorX + (nDoorW * 0.35), 1.15, northWallZ + 0.05);
    hygGroup.add(nDoorLeaf, nDoorHandle);

    // 8. Cleanroom Step-Over Stainless Bench & Sticky Mats
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 2.2), stainlessMat);
    bench.position.set(-1.4, 0.225, 1.2);
    addEdges(bench, 0x475569, 0.6);
    hygGroup.add(bench);

    const nStickyMat = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 })
    );
    nStickyMat.rotation.x = -Math.PI / 2;
    nStickyMat.position.set(nDoorX, 0.035, northWallZ + 0.8);
    hygGroup.add(nStickyMat);
  }

  window.Starflex3D.Builders.Facilities.buildHygieneRoom = buildHygieneRoom;
})();
