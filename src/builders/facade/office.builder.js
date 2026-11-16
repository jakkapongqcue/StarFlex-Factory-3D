// ============================================================================
// Module: src/builders/facade/office.builder.js
// Building 2 Front 2-Story Office, Divided 1F Interior Rooms & Staircase,
// Curved Arch Roof, Starflex Emblem, and Hipped-Roof Entrance Porte-Cochere.
// References: References/Front_View_3_Main_Office_Arch_Roof.jpg & Front_View_1
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Office = {
  build(fMats, state, mats) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;
    const { createHippedRoofGeometry, createStarflexLogoSignTexture } = window.Starflex3D.Builders.Facade.Common;
    const group = new THREE.Group();
    group.name = "FacadeOfficeAndPorteCochere";

    const offR = rect([674, 1098, 1018, 1190]);
    const floorY = 0.75;
    const wall1FH = 3.05; // 1F ceiling at y = 3.80m
    const offH = 7.6;

    const cutSegs = state && Array.isArray(state.cutawaySegments) ? state.cutawaySegments : null;
    const cutRoofs = state && Array.isArray(state.cutawayRoofs) ? state.cutawayRoofs : null;

    function registerSeg(obj, x1, z1, x2, z2, role, nx, nz, minY, maxY) {
      if (!cutSegs) return;
      cutSegs.push({
        obj,
        role,
        x1,
        z1,
        x2,
        z2,
        cx: (x1 + x2) * 0.5,
        cz: (z1 + z2) * 0.5,
        nx,
        nz,
        minY,
        maxY
      });
    }

    // ========================================================================
    // 1. 1ST-FLOOR CONCRETE PLINTH & INTERIOR FLOOR DECK (Always visible)
    // ========================================================================
    const plinthBase = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w, 0.72, offR.d),
      (mats && mats.slab) || fMats.whiteTrim
    );
    plinthBase.position.set(offR.x, 0.36, offR.z);
    plinthBase.receiveShadow = true;
    plinthBase.castShadow = true;
    addEdges(plinthBase, 0x475569, 0.75);
    group.add(plinthBase);

    const floorTileMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.45,
      metalness: 0.05
    });
    const floorDeck = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w - 0.14, 0.03, offR.d - 0.14),
      floorTileMat
    );
    floorDeck.position.set(offR.x, 0.735, offR.z);
    floorDeck.receiveShadow = true;
    group.add(floorDeck);

    // ========================================================================
    // 2. 1ST-FLOOR DIVIDED INTERIOR ROOMS, DOORS, RECEPTION COUNTER & STAIRS
    // ========================================================================
    const interiorGroup = new THREE.Group();
    interiorGroup.name = "OfficeHQInterior1F";
    group.add(interiorGroup);

    const partMat = (mats && mats.wallPartition) || fMats.whiteTrim;
    const doorFrameMat = fMats.charcoalFascia;
    const partH = 2.85; // y = 0.75 .. 3.60m (safely below 2F floor slab at y = 3.80m)
    const wallT = 0.14;

    function addPartition(px1, py1, px2, py2, opts = {}) {
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const rawLen = Math.hypot(dx, dz);
      if (rawLen < 0.05) return;

      const tStart = opts.trimStart ? 0.07 : 0;
      const tEnd = opts.trimEnd ? 0.07 : 0;
      const ux = dx / rawLen;
      const uz = dz / rawLen;
      const x1 = p1.x + ux * tStart;
      const z1 = p1.z + uz * tStart;
      const x2 = p2.x - ux * tEnd;
      const z2 = p2.z - uz * tEnd;
      const len = Math.hypot(x2 - x1, z2 - z1);
      if (len < 0.05) return;

      const segH = opts.h || partH;
      const yB = opts.yBase !== undefined ? opts.yBase : floorY;
      const segGrp = new THREE.Group();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, segH, wallT), partMat);
      mesh.position.set((x1 + x2) * 0.5, yB + segH * 0.5, (z1 + z2) * 0.5);
      mesh.rotation.y = -Math.atan2(dz, dx);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      addEdges(mesh, 0x475569, 0.65);
      segGrp.add(mesh);

      interiorGroup.add(segGrp);
      registerSeg(segGrp, x1, z1, x2, z2, "low_partition", 0, 0, yB, yB + segH);
    }

    function addInteriorDoor(px, py, isNSWall, swingSign = 1) {
      const p = pt(px, py);
      const doorW = 1.0;
      const doorH = 2.15;
      const jambW = 0.07;
      const dGrp = new THREE.Group();
      dGrp.position.set(p.x, floorY, p.z);
      if (isNSWall) dGrp.rotation.y = Math.PI / 2;

      // Door jambs + header lintel (flush to top of 2.85m partition wall)
      [-doorW * 0.5 + jambW * 0.5, doorW * 0.5 - jambW * 0.5].forEach(jx => {
        const jamb = new THREE.Mesh(new THREE.BoxGeometry(jambW, doorH, wallT + 0.02), doorFrameMat);
        jamb.position.set(jx, doorH * 0.5, 0);
        dGrp.add(jamb);
      });
      const lintelH = partH - doorH;
      if (lintelH > 0.05) {
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, lintelH, wallT), partMat);
        lintel.position.set(0, doorH + lintelH * 0.5, 0);
        addEdges(lintel, 0x475569, 0.55);
        dGrp.add(lintel);
      }

      // Slightly ajar door leaf with glass vision panel
      const leafW = doorW - jambW * 2 - 0.04;
      const pivot = new THREE.Group();
      pivot.position.set(-doorW * 0.5 + jambW, 0, 0);
      pivot.rotation.y = swingSign * 0.55;
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, doorH - 0.04, 0.045), fMats.whiteTrim);
      leaf.position.set(leafW * 0.5, (doorH - 0.04) * 0.5, 0);
      addEdges(leaf, 0x334155, 0.7);
      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(leafW * 0.55, doorH * 0.42, 0.055),
        fMats.reflectiveGlass
      );
      glass.position.set(leafW * 0.5, doorH * 0.62, 0);
      pivot.add(leaf, glass);
      dGrp.add(pivot);

      interiorGroup.add(dGrp);
      const halfSpan = isNSWall ? [0, doorW * 0.5] : [doorW * 0.5, 0];
      registerSeg(
        dGrp,
        p.x - halfSpan[0],
        p.z - halfSpan[1],
        p.x + halfSpan[0],
        p.z + halfSpan[1],
        "low_partition",
        0,
        0,
        floorY,
        floorY + partH
      );
    }

    // --- 2A. Divided Room Partitions matching blueprint strictly inside [674..1018, 1098..1190] ---
    // North interior line aligns just inside North 1F wall (py = 1100), South inside py = 1188
    const wallSpecs = [
      // 1) West Wing vertical wall (px = 736) separating full-depth West room [676..736]
      [736, 1100.8, 736, 1145.5, false, false],
      [736, 1155.5, 736, 1187.8, false, false],

      // 2) North Center-West row vertical dividers (px = 803, 870)
      [803, 1100.8, 803, 1144.0, false, true],
      [870, 1100.8, 870, 1144.0, false, false],

      // 3) North Center-West row South corridor wall (py = 1144, with 2 doorway gaps)
      [736, 1144, 745, 1144, true, false],
      [755, 1144, 813, 1144, false, false],
      [823, 1144, 870, 1144, false, true],

      // 4) South-West Wing enclosed room [736..793, 1157..1188]
      [793, 1157, 793, 1187.8, false, false],
      [736, 1157, 777, 1157, true, false],
      [787, 1157, 793, 1157, false, true],

      // 5) Central Stairwell East divider (px = 902)
      [902, 1100.8, 902, 1144.0, false, false],

      // 6) North-East Wing: utility strip divider (py = 1116), NE divider (px = 974), corridor (py = 1144)
      [902, 1116, 910, 1116, true, false],
      [920, 1116, 974, 1116, false, true],
      [974, 1100.8, 974, 1144.0, false, true],
      [902, 1144, 910, 1144, true, false],
      [920, 1144, 979, 1144, false, false],
      [989, 1144, 1015.8, 1144, false, false],

      // 7) South-East Wing two rooms [894..935] & [935..986] (leaving [986..1016] open East corridor)
      [894, 1157, 894, 1187.8, false, false],
      [935, 1157, 935, 1187.8, true, false],
      [986, 1157, 986, 1187.8, false, false],
      [894, 1157, 903, 1157, true, false],
      [913, 1157, 945, 1157, false, false],
      [955, 1157, 986, 1157, false, true]
    ];

    wallSpecs.forEach(([x1, y1, x2, y2, ts, te]) => {
      addPartition(x1, y1, x2, y2, { trimStart: ts, trimEnd: te });
    });

    // Interior Doors in matching openings
    [
      [736, 1150.5, true, -1],
      [750, 1144, false, 1],
      [818, 1144, false, 1],
      [782, 1157, false, -1],
      [915, 1116, false, 1],
      [915, 1144, false, 1],
      [984, 1144, false, 1],
      [908, 1157, false, -1],
      [950, 1157, false, -1]
    ].forEach(([dx, dy, isNS, sgn]) => addInteriorDoor(dx, dy, isNS, sgn));

    // --- 2B. Central Switchback U-Staircase ([871..901, 1101..1135]) ---
    const stairGrp = new THREE.Group();
    stairGrp.name = "OfficeHQStaircase1F";
    const stepBaseMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.55 });
    const railMat = fMats.charcoalFascia;

    // Mid-landing platform at North side of stairwell (y = 0.75..2.25m)
    const midLandingR = rect([871.2, 1101.0, 900.8, 1110.5]);
    const midLanding = new THREE.Mesh(
      new THREE.BoxGeometry(midLandingR.w, 1.5, midLandingR.d),
      stepBaseMat
    );
    midLanding.position.set(midLandingR.x, floorY + 0.75, midLandingR.z);
    addEdges(midLanding, 0x475569, 0.55);
    stairGrp.add(midLanding);

    const numTreads = 8;
    const runStartPy = 1134.0;
    const runEndPy = 1110.5;
    const treadDepth = (runStartPy - runEndPy) * 0.1 / numTreads;
    const risePerStep = 1.5 / numTreads;

    // West flight: goes North from foyer y=0.75 up to mid-landing y=2.25
    const westFlightX = pt(878.0, 1122).x;
    const flightW = 1.25;
    for (let s = 0; s < numTreads; s++) {
      const hStep = (s + 1) * risePerStep;
      const sz = pt(878.0, runStartPy).z - (s + 0.5) * treadDepth;
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(flightW, hStep, treadDepth + 0.02),
        stepBaseMat
      );
      step.position.set(westFlightX, floorY + hStep * 0.5, sz);
      addEdges(step, 0x64748b, 0.5);
      stairGrp.add(step);
    }

    // East flight: returns South from mid-landing y=2.25 up toward 2F y=3.70 + sloped stringers
    const eastFlightX = pt(894.0, 1122).x;
    for (let s = 0; s < numTreads; s++) {
      const hBottom = 1.5 + s * risePerStep;
      const sz = pt(894.0, runEndPy).z + (s + 0.5) * treadDepth;
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(flightW, risePerStep, treadDepth + 0.02),
        stepBaseMat
      );
      step.position.set(eastFlightX, floorY + hBottom + risePerStep * 0.5, sz);
      addEdges(step, 0x64748b, 0.5);
      stairGrp.add(step);
    }
    const runLenZ = (runStartPy - runEndPy) * 0.1;
    const stringerLen = Math.hypot(runLenZ, 1.5);
    const stringerTilt = Math.atan2(1.5, runLenZ);
    [-flightW * 0.46, flightW * 0.46].forEach(sxOff => {
      const stringer = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.22, stringerLen),
        railMat
      );
      stringer.position.set(eastFlightX + sxOff, floorY + 2.25, pt(894.0, (runStartPy + runEndPy) * 0.5).z);
      stringer.rotation.x = -stringerTilt;
      stairGrp.add(stringer);
    });

    // Center divider spine wall + slim charcoal handrail cap between flights
    const spineR = rect([885.2, 1110.5, 886.8, 1134.0]);
    const spineWall = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.9, spineR.d), partMat);
    spineWall.position.set(spineR.x, floorY + 0.95, spineR.z);
    addEdges(spineWall, 0x475569, 0.55);
    const spineCap = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, spineR.d + 0.04), railMat);
    spineCap.position.set(spineR.x, floorY + 1.93, spineR.z);
    stairGrp.add(spineWall, spineCap);
    interiorGroup.add(stairGrp);

    // --- 2C. L-Shaped Foyer Reception Counter ([838..853, 1145..1160]) ---
    const deskBaseMat = fMats.whiteTrim;
    const deskTopMat = fMats.charcoalFascia;
    [
      rect([838.0, 1145.0, 842.0, 1160.0]),
      rect([838.0, 1156.0, 853.0, 1160.0])
    ].forEach(dr => {
      const base = new THREE.Mesh(new THREE.BoxGeometry(dr.w, 1.0, dr.d), deskBaseMat);
      base.position.set(dr.x, floorY + 0.5, dr.z);
      addEdges(base, 0x64748b, 0.55);
      const top = new THREE.Mesh(new THREE.BoxGeometry(dr.w + 0.08, 0.08, dr.d + 0.08), deskTopMat);
      top.position.set(dr.x, floorY + 1.04, dr.z);
      interiorGroup.add(base, top);
    });

    // ========================================================================
    // 3. 1ST-FLOOR PERIMETER EXTERIOR WALLS (Dynamic 360° Cutaway Segments)
    // ========================================================================
    const wallTExt = 0.20;

    // 3A. North 1F Wall (slightly inset from py=1098 so zero Z-fighting with Hall 2 South wall)
    const north1F = new THREE.Group();
    const northWallZ = offR.z1 + 0.16;
    const northPanel = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w - 0.44, wall1FH, wallTExt),
      fMats.greyBlueWall
    );
    northPanel.position.set(offR.x, floorY + wall1FH * 0.5, northWallZ);
    northPanel.castShadow = true;
    northPanel.receiveShadow = true;
    addEdges(northPanel, 0xffffff, 0.7);
    north1F.add(northPanel);
    group.add(north1F);
    registerSeg(north1F, offR.x1 + 0.22, northWallZ, offR.x2 - 0.22, northWallZ, "exterior", 0, -1, floorY, floorY + wall1FH);

    // 3B. West 1F Wall (px = 674)
    const west1F = new THREE.Group();
    const westWallX = offR.x1 + 0.10;
    const westPanel = new THREE.Mesh(
      new THREE.BoxGeometry(wallTExt, wall1FH, offR.d - 0.44),
      fMats.greyBlueWall
    );
    westPanel.position.set(westWallX, floorY + wall1FH * 0.5, offR.z);
    westPanel.castShadow = true;
    westPanel.receiveShadow = true;
    addEdges(westPanel, 0xffffff, 0.7);
    west1F.add(westPanel);
    group.add(west1F);
    registerSeg(west1F, westWallX, offR.z1 + 0.22, westWallX, offR.z2 - 0.22, "exterior", -1, 0, floorY, floorY + wall1FH);

    // 3C. East 1F Wall (px = 1018)
    const east1F = new THREE.Group();
    const eastWallX = offR.x2 - 0.10;
    const eastPanel = new THREE.Mesh(
      new THREE.BoxGeometry(wallTExt, wall1FH, offR.d - 0.44),
      fMats.greyBlueWall
    );
    eastPanel.position.set(eastWallX, floorY + wall1FH * 0.5, offR.z);
    eastPanel.castShadow = true;
    eastPanel.receiveShadow = true;
    addEdges(eastPanel, 0xffffff, 0.7);
    east1F.add(eastPanel);
    group.add(east1F);
    registerSeg(east1F, eastWallX, offR.z1 + 0.22, eastWallX, offR.z2 - 0.22, "exterior", 1, 0, floorY, floorY + wall1FH);

    // 3D. South 1F Front Facade Wall (1F Pilasters, 1F Windows, Main Entrance Doors)
    const south1F = new THREE.Group();
    const southWallZ = offR.z2 - 0.10;
    const southPanel = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w, wall1FH, wallTExt),
      fMats.greyBlueWall
    );
    southPanel.position.set(offR.x, floorY + wall1FH * 0.5, southWallZ);
    southPanel.castShadow = true;
    southPanel.receiveShadow = true;
    addEdges(southPanel, 0xffffff, 0.85);
    south1F.add(southPanel);

    const numBays = 9;
    const bayW = offR.w / numBays;
    for (let i = 0; i <= numBays; i++) {
      const bx = offR.x1 + bayW * i;
      const pilaster1F = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, wall1FH, 0.22),
        fMats.whiteTrim
      );
      pilaster1F.position.set(bx, floorY + wall1FH * 0.5, offR.z2 + 0.05);
      south1F.add(pilaster1F);

      if (i < numBays) {
        if (i === 4) {
          // Main Ground Floor Glass Entrance Doors sitting on y = 0.75m landing
          const doorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(bayW * 0.88, 2.55, 0.14),
            fMats.whiteTrim
          );
          doorFrame.position.set(bx + bayW * 0.5, floorY + 1.275, offR.z2 + 0.06);
          const doorGlass = new THREE.Mesh(
            new THREE.BoxGeometry(bayW * 0.78, 2.35, 0.16),
            fMats.reflectiveGlass
          );
          doorGlass.position.set(bx + bayW * 0.5, floorY + 1.25, offR.z2 + 0.07);
          addEdges(doorGlass, 0x0284c7, 0.85);
          south1F.add(doorFrame, doorGlass);
        } else {
          const win1F = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 2.0, 0.15),
            fMats.reflectiveGlass
          );
          win1F.position.set(bx + bayW * 0.5, floorY + 1.25, offR.z2 + 0.06);
          addEdges(win1F, 0xffffff, 0.9);
          south1F.add(win1F);
        }
      }
    }
    group.add(south1F);
    registerSeg(south1F, offR.x1, southWallZ, offR.x2, southWallZ, "exterior", 0, 1, floorY, floorY + wall1FH);

    // ========================================================================
    // 4. 2ND STORY + CURVED BARREL-ARCH ROOF + LOGO (Toggled via cutawayRoofs!)
    // ========================================================================
    const upperAndRoofGroup = new THREE.Group();
    upperAndRoofGroup.name = "OfficeHQUpperAndRoof";

    const story2FloorY = 3.8;
    const story2H = offH - story2FloorY; // 3.80m (3.80..7.60m)
    const upperBody = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w, story2H, offR.d),
      fMats.greyBlueWall
    );
    upperBody.position.set(offR.x, story2FloorY + story2H * 0.5, offR.z);
    upperBody.castShadow = true;
    upperBody.receiveShadow = true;
    addEdges(upperBody, 0xffffff, 0.85);
    upperAndRoofGroup.add(upperBody);

    // Mid-floor band (at 3.8m) & top cornice band (at 7.35m)
    [story2FloorY, offH - 0.25].forEach(by => {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(offR.w + 0.18, 0.32, offR.d + 0.18),
        fMats.whiteTrim
      );
      band.position.set(offR.x, by, offR.z);
      upperAndRoofGroup.add(band);
    });

    // 2F White pilasters & 2F vertical windows
    for (let i = 0; i <= numBays; i++) {
      const bx = offR.x1 + bayW * i;
      const pilaster2F = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, story2H, 0.22),
        fMats.whiteTrim
      );
      pilaster2F.position.set(bx, story2FloorY + story2H * 0.5, offR.z2 + 0.05);
      upperAndRoofGroup.add(pilaster2F);

      if (i < numBays) {
        const win2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 2.2, 0.15),
          fMats.reflectiveGlass
        );
        win2.position.set(bx + bayW * 0.5, 5.6, offR.z2 + 0.06);
        addEdges(win2, 0xffffff, 0.9);
        upperAndRoofGroup.add(win2);
      }
    }

    // Curved Barrel-Arch Roof over 2nd floor
    const archSegments = 16;
    const archRise = 2.4;
    for (let s = 0; s < archSegments; s++) {
      const t1 = s / archSegments - 0.5;
      const t2 = (s + 1) / archSegments - 0.5;
      const x1 = offR.x + t1 * (offR.w + 1.4);
      const x2 = offR.x + t2 * (offR.w + 1.4);
      const y1 = offH + Math.cos(t1 * Math.PI) * archRise;
      const y2 = offH + Math.cos(t2 * Math.PI) * archRise;

      const segLen = Math.hypot(x2 - x1, y2 - y1);
      const segAng = Math.atan2(y2 - y1, x2 - x1);

      const archRoofSeg = new THREE.Mesh(
        new THREE.BoxGeometry(segLen + 0.08, 0.28, offR.d + 1.2),
        fMats.guardRoofTile
      );
      archRoofSeg.position.set((x1 + x2) * 0.5, (y1 + y2) * 0.5, offR.z);
      archRoofSeg.rotation.z = segAng;
      upperAndRoofGroup.add(archRoofSeg);

      const avgY = (y1 + y2) * 0.5;
      if (avgY > offH + 0.1) {
        const tymp = new THREE.Mesh(
          new THREE.BoxGeometry(Math.abs(x2 - x1) + 0.05, avgY - offH, 0.25),
          fMats.greyBlueWall
        );
        tymp.position.set((x1 + x2) * 0.5, offH + (avgY - offH) * 0.5, offR.z2 - 0.1);
        upperAndRoofGroup.add(tymp);
      }
    }

    // 3D Starflex Emblem on Center of Curved Arch Gable
    const logoTex = createStarflexLogoSignTexture({
      width: 1024,
      height: 256,
      bgHex: "#7c8ea6",
      showSubtext: false,
      whiteLetters: false,
      border: false
    });
    const gableLogo = new THREE.Mesh(
      new THREE.PlaneGeometry(6.5, 1.6),
      new THREE.MeshBasicMaterial({ map: logoTex })
    );
    gableLogo.position.set(offR.x, offH + 1.15, offR.z2 + 0.12);
    upperAndRoofGroup.add(gableLogo);

    group.add(upperAndRoofGroup);
    if (cutRoofs) cutRoofs.push(upperAndRoofGroup);

    // ========================================================================
    // 5. HIPPED-ROOF ENTRANCE PORTE-COCHERE (ซุ้มทางเข้าด้านหน้าสำนักงานใหญ่)
    // ========================================================================
    const porchR = rect([806, 1190, 886, 1255]);
    const porchH = 3.9;

    const stepMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.5 });
    const landing = new THREE.Mesh(
      new THREE.BoxGeometry(porchR.w * 0.88, 0.75, porchR.d * 0.78),
      stepMat
    );
    landing.position.set(porchR.x, 0.375, porchR.z1 + (porchR.d * 0.78) * 0.5);
    addEdges(landing, 0x9ca3af, 0.7);
    group.add(landing);

    for (let s = 1; s <= 3; s++) {
      const stepD = 0.55;
      const stepH = 0.25;
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(porchR.w * 0.88 - s * 0.15, stepH * (4 - s), stepD),
        stepMat
      );
      step.position.set(
        porchR.x,
        (stepH * (4 - s)) * 0.5,
        porchR.z1 + porchR.d * 0.78 + (s - 0.5) * stepD
      );
      addEdges(step, 0x9ca3af, 0.6);
      group.add(step);
    }

    const pillarW = 0.65;
    [-porchR.w * 0.42, porchR.w * 0.42].forEach(dx => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(pillarW, porchH, pillarW),
        fMats.stonePillar
      );
      col.position.set(porchR.x + dx, porchH * 0.5, porchR.z2 - 0.35);
      col.castShadow = true;
      addEdges(col, 0x78350f, 0.7);
      group.add(col);

      [0.2, porchH - 0.15].forEach(cy => {
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(pillarW + 0.14, 0.18, pillarW + 0.14),
          fMats.whiteTrim
        );
        cap.position.set(porchR.x + dx, cy, porchR.z2 - 0.35);
        group.add(cap);
      });

      const planter = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.35, 1.2),
        fMats.charcoalFascia
      );
      planter.position.set(porchR.x + dx + (dx > 0 ? 0.85 : -0.85), 0.175, porchR.z2 - 0.35);
      const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), fMats.hedgeGreen);
      shrub.position.set(porchR.x + dx + (dx > 0 ? 0.85 : -0.85), 0.65, porchR.z2 - 0.35);
      group.add(planter, shrub);
    });

    const frontBeam = new THREE.Mesh(
      new THREE.BoxGeometry(porchR.w * 0.94, 0.48, 0.42),
      fMats.charcoalFascia
    );
    frontBeam.position.set(porchR.x, porchH - 0.24, porchR.z2 - 0.35);
    addEdges(frontBeam, 0x1e293b, 0.8);
    group.add(frontBeam);

    [-porchR.w * 0.42, porchR.w * 0.42].forEach(dx => {
      const sideBeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.48, porchR.d - 0.4),
        fMats.charcoalFascia
      );
      sideBeam.position.set(porchR.x + dx, porchH - 0.24, (porchR.z1 + porchR.z2) * 0.5);
      addEdges(sideBeam, 0x1e293b, 0.8);
      group.add(sideBeam);
    });

    const porchBase = new THREE.Mesh(
      new THREE.BoxGeometry(porchR.w + 0.9, 0.32, porchR.d + 0.7),
      fMats.whiteTrim
    );
    porchBase.position.set(porchR.x, porchH + 0.16, porchR.z);
    addEdges(porchBase, 0x64748b, 0.7);
    group.add(porchBase);

    const hipRoofGeo = createHippedRoofGeometry(porchR.w + 0.86, porchR.d + 0.66, 1.8);
    const porchHip = new THREE.Mesh(hipRoofGeo, fMats.hipRoofTile);
    porchHip.position.set(porchR.x, porchH + 0.32, porchR.z);
    addEdges(porchHip, 0xffffff, 0.75);
    group.add(porchHip);

    // Potted plants along office plinth
    [695, 735, 775, 915, 955, 995].forEach(px => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.45, 8), fMats.charcoalFascia);
      const plant = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), fMats.hedgeGreen);
      const pp = pt(px, 1198);
      pot.position.set(pp.x, 0.225, pp.z);
      plant.position.set(pp.x, 0.58, pp.z);
      group.add(pot, plant);
    });

    // White parking stall markings on driveway in front of office
    const parkLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
    [690, 725, 760, 920, 955, 990].forEach(px => {
      const p1 = pt(px, 1205);
      const p2 = pt(px, 1255);
      const stallLine = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 5.0), parkLineMat);
      stallLine.rotation.x = -Math.PI / 2;
      stallLine.position.set((p1.x + p2.x) * 0.5, 0.02, (p1.z + p2.z) * 0.5);
      group.add(stallLine);
    });

    return group;
  }
};
