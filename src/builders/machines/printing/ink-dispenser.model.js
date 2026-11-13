// ============================================================================
// Module: src/builders/machines/printing/ink-dispenser.model.js
// Procedural 3D Model for Ink Pumping Station & Ink Mixing Cleanroom (INK-DISP).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.PrintingModels = window.Starflex3D.Builders.PrintingModels || {};

window.Starflex3D.Builders.PrintingModels.InkDispenser = (function () {
  const { addEdges } = window.Starflex3D.Coords;
  function buildInkDispenserStation(group, r, H, mats) {
    const stationGroup = new THREE.Group();
    group.add(stationGroup);

    const roomH = 2.4;
    const totalW = r.w; // 11.6m
    const totalD = r.d; // 4.6m

    // Split: West = Drum Pump Station (width ~6.6m), East = Ink Dispensing Room (width ~5.0m)
    const roomW = 5.0;
    const drumStationW = totalW - roomW; // 6.6m
    const drumStartX = -totalW * 0.5;
    const drumEndX = drumStartX + drumStationW; // +0.8m
    const roomStartX = drumEndX;
    const roomEndX = totalW * 0.5;
    const roomCenterX = (roomStartX + roomEndX) * 0.5;

    // Materials
    const drumBlueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.3 });
    const drumRimMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.4 });
    const pumpBlackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
    const stainlessMat = mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });
    const strutGalvMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.35 });
    const orangeHoseMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const blackHoseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const yellowCurbMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const floorGrayMat = new THREE.MeshStandardMaterial({ color: 0x7e8b9b, roughness: 0.65 });
    const cleanFloorMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const wallMat = mats.wallPartition || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.1 });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35 });

    // 1A. Drum Pumping Station Floor (West side)
    const drumFloor = new THREE.Mesh(new THREE.BoxGeometry(drumStationW - 0.08, 0.03, totalD - 0.08), floorGrayMat);
    drumFloor.position.set(drumStartX + drumStationW * 0.5, 0.015, 0);
    addEdges(drumFloor, 0x475569, 0.7);
    stationGroup.add(drumFloor);

    // Yellow spill containment curb around drum area
    const curbH = 0.14;
    const curbThick = 0.10;
    const curbWest = new THREE.Mesh(new THREE.BoxGeometry(curbThick, curbH, totalD), yellowCurbMat);
    curbWest.position.set(drumStartX + curbThick * 0.5, curbH * 0.5, 0);
    const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(drumStationW, curbH, curbThick), yellowCurbMat);
    curbNorth.position.set(drumStartX + drumStationW * 0.5, curbH * 0.5, -totalD * 0.5 + curbThick * 0.5);
    const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(drumStationW, curbH, curbThick), yellowCurbMat);
    curbSouth.position.set(drumStartX + drumStationW * 0.5, curbH * 0.5, totalD * 0.5 - curbThick * 0.5);
    stationGroup.add(curbWest, curbNorth, curbSouth);

    // 1B. Two Rows of 5 Blue Ink Drums with Pneumatic Pumps (Total 10 Units)
    const drumRows = [-totalD * 0.25, totalD * 0.25];
    const drumsPerRow = 5;
    const drumPitch = (drumStationW - 1.2) / (drumsPerRow - 1);
    const drumR = 0.29;
    const drumH = 0.88;

    drumRows.forEach((rz) => {
      const beam1 = new THREE.Mesh(new THREE.BoxGeometry(drumStationW - 0.4, 0.08, 0.08), strutGalvMat);
      beam1.position.set(drumStartX + drumStationW * 0.5, 1.20, rz);
      const beam2 = new THREE.Mesh(new THREE.BoxGeometry(drumStationW - 0.4, 0.08, 0.08), strutGalvMat);
      beam2.position.set(drumStartX + drumStationW * 0.5, 2.10, rz);
      stationGroup.add(beam1, beam2);

      for (let pIdx = 0; pIdx <= drumsPerRow; pIdx++) {
        const px = drumStartX + 0.6 + pIdx * drumPitch - drumPitch * 0.5;
        if (px >= drumStartX && px <= drumEndX) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 0.08), strutGalvMat);
          post.position.set(px, 1.6, rz);
          addEdges(post, 0x64748b, 0.6);
          stationGroup.add(post);
        }
      }

      for (let d = 0; d < drumsPerRow; d++) {
        const dx = drumStartX + 0.6 + d * drumPitch;

        const drum = new THREE.Mesh(new THREE.CylinderGeometry(drumR, drumR, drumH, 16), drumBlueMat);
        drum.position.set(dx, drumH * 0.5 + 0.03, rz);
        addEdges(drum, 0x1e3a8a, 0.5);
        stationGroup.add(drum);

        [-drumH * 0.46, drumH * 0.46].forEach(ry => {
          const rim = new THREE.Mesh(new THREE.CylinderGeometry(drumR + 0.015, drumR + 0.015, 0.03, 16), drumRimMat);
          rim.position.set(dx, drumH * 0.5 + 0.03 + ry, rz);
          stationGroup.add(rim);
        });

        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(0.24, 0.32),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        label.position.set(dx, drumH * 0.55 + 0.03, rz + (rz > 0 ? drumR + 0.01 : -drumR - 0.01));
        if (rz < 0) label.rotation.y = Math.PI;
        stationGroup.add(label);

        const pumpY = 1.25;
        const pumpBody = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.28, 0.18), pumpBlackMat);
        pumpBody.position.set(dx, pumpY, rz);
        addEdges(pumpBody, 0x0f172a, 0.6);

        [-0.14, 0.14].forEach(bx => {
          const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12), pumpBlackMat);
          bell.rotation.z = Math.PI / 2;
          bell.position.set(dx + bx, pumpY, rz);
          stationGroup.add(bell);
        });
        stationGroup.add(pumpBody);

        const dampY = pumpY + 0.28;
        const dampCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.32, 12), stainlessMat);
        dampCyl.position.set(dx, dampY, rz);
        const dampDome = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), stainlessMat);
        dampDome.position.set(dx, dampY + 0.16, rz);
        stationGroup.add(dampCyl, dampDome);

        const suctionPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8), stainlessMat);
        suctionPipe.position.set(dx, pumpY - 0.24, rz + (rz > 0 ? 0.14 : -0.14));
        stationGroup.add(suctionPipe);

        const suctionHose = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.24, 8), blackHoseMat);
        suctionHose.position.set(dx, drumH + 0.12, rz + (rz > 0 ? 0.14 : -0.14));
        stationGroup.add(suctionHose);

        const airHose = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.34, 8), orangeHoseMat);
        airHose.position.set(dx + 0.18, pumpY - 0.12, rz);
        stationGroup.add(airHose);

        const riserPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.3, 8), stainlessMat);
        riserPipe.position.set(dx, pumpY + 0.95, rz);
        stationGroup.add(riserPipe);
      }
    });

    // Overhead Stainless Steel Pipe Manifold Rack
    const manifoldY = 2.95;
    const numPipes = 6;
    const pipeSpanZ = totalD * 0.65;
    for (let pi = 0; pi < numPipes; pi++) {
      const pz = -pipeSpanZ * 0.5 + (pi * pipeSpanZ) / (numPipes - 1);
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, drumStationW, 8),
        stainlessMat
      );
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(drumStartX + drumStationW * 0.5, manifoldY + (pi % 2) * 0.15, pz);
      stationGroup.add(pipe);
    }

    for (let hx = drumStartX + 1.0; hx <= drumEndX - 0.5; hx += 1.8) {
      const hanger = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, pipeSpanZ + 0.3), strutGalvMat);
      hanger.position.set(hx, manifoldY - 0.06, 0);
      stationGroup.add(hanger);
    }

    // =========================================================================
    // 2. INK MIXING ROOM (East Side, width = 5.0m, depth = 4.6m, height = 2.4m)
    // =========================================================================
    const roomGroup = new THREE.Group();
    roomGroup.position.set(roomCenterX, 0, 0);
    stationGroup.add(roomGroup);

    const wallThick = 0.12;
    const halfRW = roomW * 0.5;
    const halfRD = totalD * 0.5;

    // Clean Epoxy Floor Slab with Yellow Perimeter Safety Border
    const roomFloor = new THREE.Mesh(new THREE.BoxGeometry(roomW - 0.04, 0.04, totalD - 0.04), cleanFloorMat);
    roomFloor.position.y = 0.02;
    addEdges(roomFloor, 0x94a3b8, 0.5);
    roomGroup.add(roomFloor);

    // North Perimeter Wall
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, roomH, wallThick), wallMat);
    northWall.position.set(0, roomH * 0.5, -halfRD + wallThick * 0.5);
    addEdges(northWall, 0x94a3b8, 0.5);
    roomGroup.add(northWall);

    // East Perimeter Wall
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, totalD), wallMat);
    eastWall.position.set(halfRW - wallThick * 0.5, roomH * 0.5, 0);
    addEdges(eastWall, 0x94a3b8, 0.5);
    roomGroup.add(eastWall);

    // West Divider Wall (between room and drum station)
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThick, roomH, totalD), wallMat);
    westWall.position.set(-halfRW + wallThick * 0.5, roomH * 0.5, 0);
    addEdges(westWall, 0x94a3b8, 0.5);
    roomGroup.add(westWall);

    // SOUTH FRONT WALL (Panoramic Cleanroom Glass Wall with Blue Framing)
    const southZ = halfRD - wallThick * 0.5;
    const glassWallW = roomW - 1.4;
    const glassWallX = -0.7;

    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(glassWallW, roomH * 0.88, 0.04), glassMat);
    glassFront.position.set(glassWallX, roomH * 0.44 + 0.12, southZ);
    addEdges(glassFront, 0x38bdf8, 0.6);
    roomGroup.add(glassFront);

    const baseCurb = new THREE.Mesh(new THREE.BoxGeometry(glassWallW, 0.12, 0.08), doorFrameMat);
    baseCurb.position.set(glassWallX, 0.06, southZ);
    roomGroup.add(baseCurb);

    const topHeader = new THREE.Mesh(new THREE.BoxGeometry(glassWallW, 0.16, 0.08), doorFrameMat);
    topHeader.position.set(glassWallX, roomH - 0.08, southZ);
    roomGroup.add(topHeader);

    // Front Glass Entrance Door
    const doorX = halfRW - 0.7;
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.2, roomH, 0.12), doorFrameMat);
    doorFrame.position.set(doorX, roomH * 0.5, southZ);
    addEdges(doorFrame, 0x0284c7, 0.6);
    roomGroup.add(doorFrame);

    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.0, roomH - 0.15, 0.04), glassMat);
    doorLeaf.position.set(doorX, (roomH - 0.15) * 0.5, southZ);
    addEdges(doorLeaf, 0xffffff, 0.7);
    roomGroup.add(doorLeaf);

    // Interior Cleanroom Ceiling Lighting
    const roomLight = new THREE.PointLight(0xffffff, 0.85, 12);
    roomLight.position.set(0, 2.2, 0);
    roomGroup.add(roomLight);

    // 2B. INDUSTRIAL INK MIXING TANKS WITH PNEUMATIC AGITATORS (ถังกวนผสมหมึกพิมพ์)
    const tankPositions = [
      { x: -1.2, z: -0.6 },
      { x: -1.2, z: 0.7 }
    ];

    tankPositions.forEach((pos) => {
      const tankGroup = new THREE.Group();
      tankGroup.position.set(pos.x, 0, pos.z);
      roomGroup.add(tankGroup);

      const tankR = 0.42;
      const tankH = 0.85;
      const legH = 0.35;

      for (let l = 0; l < 3; l++) {
        const lang = (l * Math.PI * 2) / 3;
        const lx = Math.cos(lang) * (tankR * 0.85);
        const lz = Math.sin(lang) * (tankR * 0.85);
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, legH, 8), stainlessMat);
        leg.position.set(lx, legH * 0.5, lz);
        tankGroup.add(leg);
      }

      const tank = new THREE.Mesh(new THREE.CylinderGeometry(tankR, tankR, tankH, 20), stainlessMat);
      tank.position.y = legH + tankH * 0.5;
      addEdges(tank, 0x64748b, 0.5);
      tankGroup.add(tank);

      const lid = new THREE.Mesh(new THREE.CylinderGeometry(tankR + 0.02, tankR + 0.02, 0.04, 20), stainlessMat);
      lid.position.y = legH + tankH + 0.02;
      tankGroup.add(lid);

      const motorY = legH + tankH + 0.18;
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.28, 12), pumpBlackMat);
      motor.position.y = motorY;
      addEdges(motor, 0x0f172a, 0.6);
      tankGroup.add(motor);

      const valve = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), doorFrameMat);
      valve.position.set(0.12, motorY + 0.08, 0);
      tankGroup.add(valve);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 8), stainlessMat);
      shaft.position.y = legH + tankH - 0.15;
      tankGroup.add(shaft);

      const impeller = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.06), stainlessMat);
      impeller.position.y = legH + 0.25;
      tankGroup.add(impeller);

      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8), stainlessMat);
      pipe.position.set(-tankR * 0.6, legH + tankH + 0.15, 0);
      tankGroup.add(pipe);
    });

    // 2C. 20L COLOR INK PAILS ON WOODEN PALLET (ถังสีผสมสำเร็จ 20 ลิตร)
    const pailGroup = new THREE.Group();
    pailGroup.position.set(0.2, 0, 0.8);
    roomGroup.add(pailGroup);

    const palletBase = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.9), strutGalvMat);
    palletBase.position.y = 0.06;
    pailGroup.add(palletBase);

    const pailColors = [0x0284c7, 0xdb2777, 0xfacc15, 0x1e293b];
    const pailR = 0.15;
    const pailH = 0.38;
    const pailCoords = [
      { x: -0.25, z: -0.22, col: pailColors[0] },
      { x: 0.25, z: -0.22, col: pailColors[1] },
      { x: -0.25, z: 0.22, col: pailColors[2] },
      { x: 0.25, z: 0.22, col: pailColors[3] }
    ];

    pailCoords.forEach(pc => {
      const pBody = new THREE.Mesh(
        new THREE.CylinderGeometry(pailR, pailR * 0.9, pailH, 14),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
      );
      pBody.position.set(pc.x, 0.12 + pailH * 0.5, pc.z);
      pailGroup.add(pBody);

      const pLid = new THREE.Mesh(
        new THREE.CylinderGeometry(pailR + 0.01, pailR + 0.01, 0.04, 14),
        new THREE.MeshStandardMaterial({ color: pc.col, roughness: 0.35 })
      );
      pLid.position.set(pc.x, 0.12 + pailH + 0.02, pc.z);
      pailGroup.add(pLid);
    });

    // 2D. QUALITY CONTROL & VISCOSITY LAB BENCH
    const benchGroup = new THREE.Group();
    benchGroup.position.set(halfRW - 0.55, 0, -0.2);
    roomGroup.add(benchGroup);

    const benchL = 2.4;
    const benchW = 0.70;
    const benchH = 0.85;

    const bench = new THREE.Mesh(new THREE.BoxGeometry(benchW, benchH, benchL), stainlessMat);
    bench.position.set(0, benchH * 0.5, 0);
    addEdges(bench, 0x64748b, 0.6);
    benchGroup.add(bench);

    const balance = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.30), darkMetalMat);
    balance.position.set(0, benchH + 0.06, -benchL * 0.28);
    benchGroup.add(balance);

    const balPan = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12), stainlessMat);
    balPan.position.set(0, benchH + 0.13, -benchL * 0.28);
    benchGroup.add(balPan);

    const zahnStand = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28, 8), stainlessMat);
    zahnStand.position.set(0.12, benchH + 0.14, 0);
    const zahnCup = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.07, 10), stainlessMat);
    zahnCup.position.set(0.05, benchH + 0.20, 0);
    benchGroup.add(zahnStand, zahnCup);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.36, 0.48), pumpBlackMat);
    monitor.position.set(0, benchH + 0.40, benchL * 0.25);
    benchGroup.add(monitor);

    const monScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.32),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    monScreen.position.set(-0.028, benchH + 0.40, benchL * 0.25);
    monScreen.rotation.y = -Math.PI / 2;
    benchGroup.add(monScreen);
  }


  return {
    build: buildInkDispenserStation
  };
})();
