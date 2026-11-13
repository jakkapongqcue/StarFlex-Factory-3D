// ============================================================================
// Module: src/builders/architecture.builder.js
// Builds the cutaway building shells, steel H-columns, internal partitions,
// curved barrel-arch roof trusses & solar PV arrays, AND complete watertight
// exterior walls + curved arch gable tympanums (หน้าจั่วโค้งปิดทึบ) so that
// when the exterior/roof is closed, zero interior machines leak through gaps.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Architecture = {
  build(scene, mats, state) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;

    const archGroup = new THREE.Group();
    archGroup.name = "CutawayArchitecture";

    // 4 Directional Exterior Wall Groups for Dynamic 360° View Cut-away
    const wallsNorth = new THREE.Group();
    wallsNorth.name = "WallsNorth";
    const wallsSouth = new THREE.Group();
    wallsSouth.name = "WallsSouth";
    const wallsWest = new THREE.Group();
    wallsWest.name = "WallsWest";
    const wallsEast = new THREE.Group();
    wallsEast.name = "WallsEast";

    const partitionWallsGroup = new THREE.Group();
    partitionWallsGroup.name = "PartitionWalls";
    const roofTrussGroup = new THREE.Group();
    roofTrussGroup.name = "RoofTrusses";
    const roofShellGroup = new THREE.Group();
    roofShellGroup.name = "RoofShells";

    state.archGroups = {
      wallsNorth,
      wallsSouth,
      wallsWest,
      wallsEast,
      backWallsGroup: wallsNorth,
      frontWallsGroup: wallsSouth,
      partitionWallsGroup,
      roofTrussGroup,
      roofShellGroup
    };

    state.cutawaySegments = [];
    state.cutawayRoofs = [];
    state.cutawayObstacles = [];
    state.northCutSlices = [];

    function registerCutSegment(obj, px1, py1, px2, py2, h, role, nx = 0, nz = 0, yBase = 0) {
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      state.cutawaySegments.push({
        obj,
        role,
        x1: p1.x,
        z1: p1.z,
        x2: p2.x,
        z2: p2.z,
        cx: (p1.x + p2.x) * 0.5,
        cz: (p1.z + p2.z) * 0.5,
        nx,
        nz,
        minY: yBase,
        maxY: yBase + h
      });
    }

    // Helper: create structural wall segment with vertical steel H-columns & cutaway tracking
    function addWallSegment(px1, py1, px2, py2, h, targetGroup, mat, addColumns = true, colStep = 65, cutCfg = null) {
      const segGroup = new THREE.Group();
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      // Trim shared internal joints slightly inside the 0.46m H-column to avoid Z-fighting
      const trimStart = cutCfg && cutCfg.trimStart ? 0.02 : 0;
      const trimEnd = cutCfg && cutCfg.trimEnd ? 0.02 : 0;
      const meshLen = Math.max(0.05, len - trimStart - trimEnd);
      const shiftT = len > 0.001 ? ((trimStart - trimEnd) * 0.5) / len : 0;

      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(meshLen, h, 0.3), mat);
      wallMesh.position.set(
        (p1.x + p2.x) * 0.5 + dx * shiftT,
        h * 0.5,
        (p1.z + p2.z) * 0.5 + dz * shiftT
      );
      wallMesh.rotation.y = -angle;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      addEdges(wallMesh, 0x94a3b8, 0.55);
      segGroup.add(wallMesh);

      if (addColumns) {
        const distPx = Math.hypot(px2 - px1, py2 - py1);
        const steps = Math.max(1, Math.round(distPx / colStep));
        const startI = cutCfg && cutCfg.skipStartCol ? 1 : 0;
        for (let i = startI; i <= steps; i++) {
          const t = i / steps;
          const colMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.46, h + 0.15, 0.46),
            mats.steelColumn
          );
          colMesh.position.set(p1.x + dx * t, h * 0.5, p1.z + dz * t);
          colMesh.castShadow = true;
          segGroup.add(colMesh);
        }
      }

      targetGroup.add(segGroup);
      if (cutCfg && cutCfg.role) {
        registerCutSegment(
          segGroup,
          px1,
          py1,
          px2,
          py2,
          h,
          cutCfg.role,
          cutCfg.nx || 0,
          cutCfg.nz || 0,
          cutCfg.yBase || 0
        );
      }
      return segGroup;
    }

    // Helper: subdivide a continuous wall line along exact blueprint waypoints for fine-grained cutaway
    function addWallChain(points, h, targetGroup, mat, addColumns, colStep, role, nx = 0, nz = 0) {
      for (let i = 0; i < points.length - 1; i++) {
        const [ax, ay] = points[i];
        const [bx, by] = points[i + 1];
        addWallSegment(ax, ay, bx, by, h, targetGroup, mat, addColumns, colStep, {
          role,
          nx,
          nz,
          skipStartCol: i > 0,
          trimStart: i > 0,
          trimEnd: i < points.length - 2
        });
      }
    }

    // Helper: add a flat roof cap over an auxiliary room/annex
    function addFlatRoofCap(px1, py1, px2, py2, h, targetGroup, mat) {
      const r = rect([px1, py1, px2, py2]);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(r.w + 0.3, 0.24, r.d + 0.3), mat);
      cap.position.set(r.x, h + 0.12, r.z);
      addEdges(cap, 0x64748b, 0.5);
      targetGroup.add(cap);
    }

    // ========================================================================
    // 1. BACK (NORTH) & OUTER SIDE STRUCTURAL WALLS
    // ========================================================================
    // North Back Wall of Halls 1, 2, 3, 4 (py = 247)
    addWallChain([[200, 247], [416, 247], [632, 247], [847, 247], [1062, 247]], 10.5, wallsNorth, mats.wallSolid, true, 65, "exterior", 0, -1);
    addWallChain([[1062, 247], [1280, 247], [1498, 247]], 8.8, wallsNorth, mats.wallSolid, true, 65, "exterior", 0, -1);
    addWallSegment(1498, 247, 1755, 247, 12.8, wallsNorth, mats.wallSolid, true, 65, { role: "exterior", nx: 0, nz: -1 });

    // West Outer Wall of Hall 1 (px = 200, py: 247..1098)
    addWallChain([[200, 247], [200, 672], [200, 1098]], 10.5, wallsWest, mats.wallSolid, true, 65, "exterior", -1, 0);

    // East Outer Wall of Hall 4 + East MDB Room (px = 1895)
    addWallChain([[1895, 465], [1895, 782], [1895, 1100]], 12.8, wallsEast, mats.wallSolid, true, 65, "exterior", 1, 0);
    addWallSegment(1895, 490, 1950, 490, 4.5, wallsNorth, mats.wallSolid, false, 65, { role: "exterior", nx: 0, nz: -1 });
    addWallSegment(1950, 490, 1950, 545, 4.5, wallsEast, mats.wallSolid, false, 65, { role: "exterior", nx: 1, nz: 0 });
    addWallSegment(1895, 545, 1950, 545, 4.5, wallsSouth, mats.wallSolid, false, 65, { role: "exterior", nx: 0, nz: 1 });

    // Pump Room Walls
    addWallSegment(1940, 78, 2038, 78, 5.2, wallsNorth, mats.wallSolid, true, 50, { role: "exterior", nx: 0, nz: -1 });
    addWallSegment(1940, 78, 1940, 198, 5.2, wallsWest, mats.wallSolid, false, 50, { role: "exterior", nx: -1, nz: 0 });
    addWallSegment(2038, 78, 2038, 198, 5.2, wallsEast, mats.wallSolid, false, 50, { role: "exterior", nx: 1, nz: 0 });
    addWallSegment(1940, 198, 2038, 198, 5.2, wallsSouth, mats.wallCutawayFront, false, 50, { role: "exterior", nx: 0, nz: 1 });
    addFlatRoofCap(1940, 78, 2038, 198, 5.2, roofShellGroup, mats.roofSheet);

    // ========================================================================
    // 2. INTERNAL PARTITION WALLS & STRUCTURAL COLUMNS (Low/Stepped in Cutaway Mode)
    // ========================================================================
    const hall1EastWalls = [
      { py1: 247, py2: 395, h: 7.2 }, // Circle 1: North Maintenance & Cylinder Area
      { py1: 448, py2: 602, h: 7.2 }, // Circle 2: PT-03 / PT-04 Printing Burners
      { py1: 648, py2: 803, h: 7.2 }, // Circle 3: ET-02 / SW3 / SB-01 Lamination
      { py1: 851, py2: 904, h: 7.2 }  // Circle 4: SB-04 / Oven Room Area
    ];

    hall1EastWalls.forEach(w => {
      addWallSegment(632, w.py1, 632, w.py2, w.h, partitionWallsGroup, mats.wallPartition, true, 50, { role: "partition" });
    });

    // Structural portal columns along the open passage bay at px = 632 to support roof trusses
    [967].forEach(py => {
      const pCol = pt(632, py);
      const colMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 7.35, 0.46),
        mats.steelColumn
      );
      colMesh.position.set(pCol.x, 7.2 * 0.5, pCol.z);
      colMesh.castShadow = true;
      partitionWallsGroup.add(colMesh);
      registerCutSegment(colMesh, 632, py - 2, 632, py + 2, 7.35, "partition");
    });

    // 3 Partition Wall Segments along px = 674 (Hall 2 West dividing walls)
    const hall2WestWalls = [
      { py1: 348, py2: 542, h: 6.2 },     // Circle 1: WH-MAIN Warehouse
      { py1: 615, py2: 851.5, h: 4.8 },   // Circle 2a: Finish Good & BM line -> AS-1 North jamb
      { py1: 874.5, py2: 896.5, h: 4.8 }, // Circle 2b: Pier between AS-1 & AS-2 doorways
      { py1: 919.5, py2: 1015, h: 4.8 },  // Circle 2c: AS-2 South jamb -> South passage
      { py1: 1035, py2: 1098, h: 3.6 }    // Circle 3: South Office / Fire Exit corridor
    ];

    hall2WestWalls.forEach(w => {
      addWallSegment(674, w.py1, 674, w.py2, w.h, partitionWallsGroup, mats.wallPartition, true, 60, { role: "partition" });
    });

    // Overhead wall lintels above the 2 Hall 2 Air Shower doorway openings (y = 4.40..4.80m, clearing 4.36m beacons)
    [863, 908].forEach(lintelPy => {
      const lp = pt(674, lintelPy);
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.40, 1.82), mats.wallPartition);
      lintel.position.set(lp.x, 4.60, lp.z);
      lintel.castShadow = true;
      lintel.receiveShadow = true;
      addEdges(lintel, 0x94a3b8, 0.55);
      partitionWallsGroup.add(lintel);
      registerCutSegment(lintel, 674, lintelPy - 9, 674, lintelPy + 9, 0.40, "partition", 0, 0, 4.40);
    });

    // Partition between Hall 2 and Hall 3 corridor (px = 1062) with opening for Finished Goods double doors (py: 330..365)
    addWallSegment(1062, 247, 1062, 330, 7.2, partitionWallsGroup, mats.wallPartition, true, 75, { role: "partition" });
    addWallChain([[1062, 365], [1062, 558], [1062, 750]], 7.2, partitionWallsGroup, mats.wallPartition, true, 75, "partition");
    addWallSegment(1062, 750, 1062, 815, 4.2, partitionWallsGroup, mats.wallPartition, true, 75, { role: "partition" });

    addWallSegment(1640, 247, 1640, 545, 7.8, partitionWallsGroup, mats.wallPartition, true, 75, { role: "partition" });
    addWallSegment(1640, 545, 1895, 545, 6.0, partitionWallsGroup, mats.wallPartition, true, 75, { role: "partition" });

    const lowPartitions = [
      [890, 247, 890, 326], [890, 326, 1062, 326],
      [738, 398, 995, 398], [738, 540, 995, 540], [738, 398, 738, 540], [995, 398, 995, 540],
      // Hall 2 Air Shower & Spout Zone staggered divider walls (h = 2.8m -> 1.55m above factory floor)
      [676.5, 875.5, 755, 875.5], // Line 1: Right south of AS-1, east of px=674 pier column
      [720, 884.5, 990, 884.5],   // Line 2: Divides Row 1 (1SP-01/02) from Row 2 (1SP-03..07)
      // Finish Good Area South Partition & 2-Room East Corner Annex (h = 2.8m)
      // - South divider [675.5..994] seals FG Racks flush to Left Room West wall (px=978) and leaves a 1.85m South entrance [994..1012.5] into Left Room
      // - Continuous North wall [976.5..1060.5, 678], Left West wall [978, 679.5..734.5], Center divider [1014] with 1.6m doorway [700..716], Right South wall [1012.5..1060.5, 736]
      [675.5, 736, 994, 736],
      [1012.5, 736, 1060.5, 736],
      [978, 679.5, 978, 734.5],
      [976.5, 678, 1060.5, 678],
      [1014, 679.5, 1014, 700],
      [1014, 716, 1014, 734.5],
      // Hall 2 South Rooms: LAB Inno [826..854], PUR [854..922], Training [922..1062]
      [824.5, 1048, 920.5, 1048],
      [826, 1049.5, 826, 1096.5],
      [854, 1049.5, 854, 1096.5],
      [922, 1018.5, 922, 1096.5],
      [923.5, 1020, 1060.5, 1020],
      [1102, 712, 1402, 712], [1102, 815, 1402, 815],
      [1498, 880, 1895, 880], [1498, 1055, 1895, 1055]
    ];
    lowPartitions.forEach(seg => {
      addWallSegment(seg[0], seg[1], seg[2], seg[3], 2.8, partitionWallsGroup, mats.wallPartition, false, 65, { role: "low_partition" });
    });

    // ========================================================================
    // 3. COMPLETE FRONT & SIDE EXTERIOR ENCLOSURE WALLS (Sealing Circles 1–4!)
    // ========================================================================
    // Circle 1 & Circle 2: Full-height South front wall across BOTH Hall 1 & Hall 2 (px: 200..1062, py = 1098)
    addWallSegment(200, 1098, 632, 1098, 10.5, wallsSouth, mats.wallCutawayFront, true, 65, { role: "exterior", nx: 0, nz: 1 });
    addWallSegment(632, 1098, 1062, 1098, 10.5, wallsSouth, mats.wallCutawayFront, true, 65, { role: "exterior", nx: 0, nz: 1, skipStartCol: true, trimStart: true });

    // East outer wall of Hall 2 facing the central loading courtyard (px = 1062, py: 815..1098)
    addWallSegment(1062, 815, 1062, 1098, 10.5, wallsEast, mats.wallCutawayFront, true, 65, { role: "exterior", nx: 1, nz: 0 });

    // Circle 3: Full-height South wall of Hall 3 High-Bay Warehouse at py = 815 (px: 1062..1498)
    // Note: Keep py > 815 open for the raised Loading Dock platform & cantilevered canopy!
    addWallSegment(1062, 815, 1498, 815, 8.8, wallsSouth, mats.wallCutawayFront, true, 48, { role: "exterior", nx: 0, nz: 1 });

    // Circle 4: Full-height South & internal partitions of Hall 4 East Plant (px: 1498..1895, py = 1100)
    addWallSegment(1498, 1100, 1895, 1100, 12.8, wallsSouth, mats.wallCutawayFront, true, 65, { role: "exterior", nx: 0, nz: 1 });
    addWallChain([[1498, 247], [1498, 465], [1498, 680], [1498, 880], [1498, 1100]], 12.8, partitionWallsGroup, mats.wallPartition, true, 65, "partition");

    // West Courtyard Wall & Sloped Solar Roof Extension of Hall 4 (px: 1395..1498, py: 765..1100)
    // Matches the right side of Loading_Dock_2_CloseUp.jpg where Hall 4's solar roof slopes down to px = 1395!
    addWallSegment(1395, 765, 1498, 765, 10.5, wallsNorth, mats.wallCutawayFront, false, 65, { role: "exterior", nx: 0, nz: -1 });
    addWallChain([[1395, 765], [1395, 932], [1395, 1100]], 10.5, wallsWest, mats.wallCutawayFront, true, 55, "exterior", -1, 0);
    addWallSegment(1395, 1100, 1498, 1100, 10.5, wallsSouth, mats.wallCutawayFront, false, 65, { role: "exterior", nx: 0, nz: 1 });
    {
      const westSlopeR = rect([1395, 765, 1498, 1100]);
      const slopeW = Math.hypot(westSlopeR.w, 2.3);
      const slopeAng = Math.atan2(2.3, westSlopeR.w);
      const slopeRoof = new THREE.Mesh(
        new THREE.BoxGeometry(slopeW + 0.6, 0.22, westSlopeR.d + 0.4),
        mats.roofSheet
      );
      slopeRoof.position.set(westSlopeR.x, 11.65, westSlopeR.z);
      slopeRoof.rotation.z = slopeAng;
      roofShellGroup.add(slopeRoof);

      const slopeSolar = new THREE.Mesh(
        new THREE.BoxGeometry(slopeW * 0.88, 0.1, westSlopeR.d * 0.9),
        mats.solarPanel
      );
      slopeSolar.position.set(westSlopeR.x, 11.82, westSlopeR.z);
      slopeSolar.rotation.z = slopeAng;
      roofShellGroup.add(slopeSolar);

      // Seal triangular front & back gables under the sloped roof extension
      const triFillFront = new THREE.Mesh(
        new THREE.BoxGeometry(westSlopeR.w, 2.3, 0.3),
        mats.wallCutawayFront
      );
      triFillFront.position.set(westSlopeR.x, 10.5 + 1.15, westSlopeR.z2);
      wallsSouth.add(triFillFront);
      registerCutSegment(triFillFront, 1395, 1100, 1498, 1100, 2.3, "exterior", 0, 1, 10.5);

      const triFillBack = new THREE.Mesh(
        new THREE.BoxGeometry(westSlopeR.w, 2.3, 0.3),
        mats.wallSolid
      );
      triFillBack.position.set(westSlopeR.x, 10.5 + 1.15, westSlopeR.z1);
      wallsNorth.add(triFillBack);
      registerCutSegment(triFillBack, 1395, 765, 1498, 765, 2.3, "exterior", 0, -1, 10.5);
    }

    // East MDB Room Roof Cap
    addFlatRoofCap(1895, 490, 1950, 545, 4.5, roofShellGroup, mats.roofSheet);

    // NE High-Bay Blow Film Penthouse Full 4-Sided Enclosure + Roof Cap (px: 1755..1895, py: 247..465)
    addWallSegment(1755, 247, 1895, 247, 16.2, wallsNorth, mats.wallSolid, false, 65, { role: "exterior", nx: 0, nz: -1 });
    addWallSegment(1895, 247, 1895, 465, 16.2, wallsEast, mats.wallSolid, false, 65, { role: "exterior", nx: 1, nz: 0 });
    addWallSegment(1755, 247, 1755, 465, 16.2, wallsWest, mats.wallCutawayFront, false, 65, { role: "exterior", nx: -1, nz: 0 });
    addWallSegment(1755, 465, 1895, 465, 16.2, wallsSouth, mats.wallCutawayFront, false, 65, { role: "exterior", nx: 0, nz: 1 });
    addFlatRoofCap(1755, 247, 1895, 465, 16.2, roofShellGroup, mats.roofSheet);

    // Shared materials for North cutaway roof edge slices
    const cutDeckMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.2 });
    const cutSolarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.25, metalness: 0.65 });
    const cutMonMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.45 });

    // ========================================================================
    // 4. CURVED BARREL-ARCH ROOFS + SOLID FRONT/BACK ARCH GABLE TYMPANUMS!
    // ========================================================================
    function buildCurvedArchSpan(px1, px2, py1, py2, eaveH, archRise, solarCols = 2, hasMonitor = false) {
      const r = rect([px1, py1, px2, py2]);
      const archSegs = 12;

      const backTympGroup = new THREE.Group();
      const frontTympGroup = new THREE.Group();
      const northSliceGroup = new THREE.Group();
      wallsNorth.add(backTympGroup);
      wallsSouth.add(frontTympGroup);
      roofTrussGroup.add(northSliceGroup);

      registerCutSegment(backTympGroup, px1, py1, px2, py1, archRise, "exterior", 0, -1, eaveH);
      registerCutSegment(frontTympGroup, px1, py2, px2, py2, archRise, "exterior", 0, 1, eaveH);
      state.northCutSlices.push({
        obj: northSliceGroup,
        cx: r.x,
        cz: r.z1 + 4.25,
        z1: r.z1,
        x1: r.x1,
        x2: r.x2
      });

      // 4A. Curved Steel Portal Trusses along N-S every ~14m
      const numTrusses = 6;
      for (let t = 0; t <= numTrusses; t++) {
        const z = r.z1 + (r.d * t) / numTrusses;
        const pts = [];
        for (let s = 0; s <= archSegs; s++) {
          const u = s / archSegs - 0.5;
          const x = r.x + u * r.w;
          const y = eaveH + Math.cos(u * Math.PI) * archRise;
          pts.push(new THREE.Vector3(x, y, z));
        }
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 })
        );
        roofTrussGroup.add(line);
      }

      // 4B. Curved Roof Segments + North/South Arch Gable Tympanum Walls!
      const cutDepth = Math.min(8.5, r.d * 0.11);
      for (let s = 0; s < archSegs; s++) {
        const u1 = s / archSegs - 0.5;
        const u2 = (s + 1) / archSegs - 0.5;
        const x1 = r.x + u1 * r.w;
        const x2 = r.x + u2 * r.w;
        const y1 = eaveH + Math.cos(u1 * Math.PI) * archRise;
        const y2 = eaveH + Math.cos(u2 * Math.PI) * archRise;

        const segW = Math.abs(x2 - x1);
        const segLen = Math.hypot(x2 - x1, y2 - y1);
        const segAng = Math.atan2(y2 - y1, x2 - x1);
        const midX = (x1 + x2) * 0.5;
        const midY = (y1 + y2) * 0.5;

        // Full length curved roof sheet
        const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(segLen + 0.08, 0.16, r.d + 0.4), mats.roofSheet);
        deckMesh.position.set(midX, midY, r.z);
        deckMesh.rotation.z = segAng;
        roofShellGroup.add(deckMesh);

        // SEAL ARCH GABLE TYMPANUMS (หน้าจั่วโค้งด้านหน้าและด้านหลังอาคาร!)
        const tympH = Math.max(0.15, midY - eaveH + 0.15);
        // 1) North Back Arch Gable Tympanum
        const backTymp = new THREE.Mesh(
          new THREE.BoxGeometry(segW + 0.06, tympH, 0.32),
          mats.wallSolid
        );
        backTymp.position.set(midX, eaveH + tympH * 0.5 - 0.08, r.z1);
        addEdges(backTymp, 0x94a3b8, 0.4);
        backTympGroup.add(backTymp);

        // 2) South Front Arch Gable Tympanum (Closes the semi-circular gap under every arch roof!)
        const frontTymp = new THREE.Mesh(
          new THREE.BoxGeometry(segW + 0.06, tympH, 0.32),
          mats.wallCutawayFront
        );
        frontTymp.position.set(midX, eaveH + tympH * 0.5 - 0.08, r.z2);
        addEdges(frontTymp, 0x94a3b8, 0.45);
        frontTympGroup.add(frontTymp);

        // North-edge Cutaway Slice of the Curved Arch Roof (Visible in Cutaway Mode)
        const cutDeck = new THREE.Mesh(
          new THREE.BoxGeometry(segLen + 0.05, 0.18, cutDepth),
          cutDeckMat
        );
        cutDeck.position.set(midX, midY, r.z1 + cutDepth * 0.5);
        cutDeck.rotation.z = segAng;
        northSliceGroup.add(cutDeck);

        // Solar PV panels
        const isWalkway = solarCols === 2 && (s === 0 || s === 5 || s === 6 || s === 11);
        if (!isWalkway) {
          const solarMesh = new THREE.Mesh(
            new THREE.BoxGeometry(segLen * 0.92, 0.08, r.d * 0.88),
            mats.solarPanel
          );
          solarMesh.position.set(midX, midY + 0.15, r.z);
          solarMesh.rotation.z = segAng;
          roofShellGroup.add(solarMesh);

          const cutSolar = new THREE.Mesh(
            new THREE.BoxGeometry(segLen * 0.92, 0.1, cutDepth * 0.82),
            cutSolarMat
          );
          cutSolar.position.set(midX, midY + 0.15, r.z1 + cutDepth * 0.5);
          cutSolar.rotation.z = segAng;
          northSliceGroup.add(cutSolar);
        }
      }

      // 4C. Raised Central Roof Monitor (for Hall 4 East Plant)
      if (hasMonitor) {
        const monW = r.w * 0.26;
        const monH = 1.45;
        const ridgeY = eaveH + archRise;
        const monMesh = new THREE.Mesh(new THREE.BoxGeometry(monW, monH, r.d * 0.72), mats.roofSheet);
        monMesh.position.set(r.x, ridgeY + monH * 0.4, r.z);
        addEdges(monMesh, 0x475569, 0.5);
        roofShellGroup.add(monMesh);

        const monSolar = new THREE.Mesh(new THREE.BoxGeometry(monW * 0.85, 0.1, r.d * 0.68), mats.solarPanel);
        monSolar.position.set(r.x, ridgeY + monH * 0.92, r.z);
        roofShellGroup.add(monSolar);

        const cutMon = new THREE.Mesh(
          new THREE.BoxGeometry(monW, monH, 8.5),
          cutMonMat
        );
        cutMon.position.set(r.x, ridgeY + monH * 0.4, r.z1 + 4.25);
        addEdges(cutMon, 0x475569, 0.7);
        northSliceGroup.add(cutMon);
      }
    }

    // Build all 4 Hall Curved Barrel-Arch Roofs + Sealed Gable Tympanums
    buildCurvedArchSpan(200, 632, 247, 1098, 10.5, 2.5, 2, false);
    buildCurvedArchSpan(632, 1062, 247, 1098, 10.5, 2.5, 2, false);
    buildCurvedArchSpan(1062, 1498, 247, 815, 8.8, 0.55, 2, false);
    buildCurvedArchSpan(1498, 1895, 247, 1100, 12.8, 2.8, 2, true);

    archGroup.add(
      wallsNorth,
      wallsSouth,
      wallsWest,
      wallsEast,
      partitionWallsGroup,
      roofTrussGroup,
      roofShellGroup
    );
    scene.add(archGroup);
    return archGroup;
  }
};
