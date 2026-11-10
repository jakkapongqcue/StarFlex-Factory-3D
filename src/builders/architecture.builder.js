// ============================================================================
// Module: src/builders/architecture.builder.js
// Builds the cutaway building shells, steel H-columns, internal partitions,
// curved barrel-arch roof trusses & solar PV arrays (matching the real
// street-view & Google Maps photos), Central Loading Dock facade,
// NE High-Bay Blow Film Penthouse, and overhead yellow bridge cranes.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Architecture = {
  build(scene, mats, state) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;

    const archGroup = new THREE.Group();
    archGroup.name = "CutawayArchitecture";

    const backWallsGroup = new THREE.Group();
    const partitionWallsGroup = new THREE.Group();
    const frontWallsGroup = new THREE.Group();
    const roofTrussGroup = new THREE.Group();
    const roofShellGroup = new THREE.Group();

    state.archGroups = {
      backWallsGroup,
      partitionWallsGroup,
      frontWallsGroup,
      roofTrussGroup,
      roofShellGroup
    };

    // Helper: create structural wall segment with vertical steel H-columns
    function addWallSegment(px1, py1, px2, py2, h, targetGroup, mat, addColumns = true, colStep = 65) {
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.28), mat);
      wallMesh.position.set((p1.x + p2.x) * 0.5, h * 0.5, (p1.z + p2.z) * 0.5);
      wallMesh.rotation.y = -angle;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      addEdges(wallMesh, 0x94a3b8, 0.55);
      targetGroup.add(wallMesh);

      if (addColumns) {
        const distPx = Math.hypot(px2 - px1, py2 - py1);
        const steps = Math.max(1, Math.round(distPx / colStep));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const colMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.46, h + 0.15, 0.46),
            mats.steelColumn
          );
          colMesh.position.set(p1.x + dx * t, h * 0.5, p1.z + dz * t);
          colMesh.castShadow = true;
          targetGroup.add(colMesh);
        }
      }
    }

    // 1. Back & Outer Side Structural Walls (Visible in Cutaway Mode)
    addWallSegment(200, 247, 1062, 247, 10.5, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1062, 247, 1498, 247, 11.2, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1498, 247, 1895, 247, 12.8, backWallsGroup, mats.wallSolid, true, 65);

    addWallSegment(200, 247, 200, 1098, 10.5, backWallsGroup, mats.wallSolid, true, 65);

    addWallSegment(1895, 247, 1895, 490, 14.5, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1895, 490, 1950, 490, 4.5, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1950, 490, 1950, 545, 4.5, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1895, 545, 1895, 885, 12.8, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1895, 885, 1968, 885, 4.8, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1968, 885, 1968, 1055, 4.8, backWallsGroup, mats.wallSolid, false);

    // High-Bay Blow Film Tower Back/Side Penthouse Enclosure (Visible in Image 5 at NE corner!)
    addWallSegment(1755, 247, 1895, 247, 16.2, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1895, 247, 1895, 465, 16.2, backWallsGroup, mats.wallSolid, false);

    // Pump Room Back/Side Walls
    addWallSegment(1940, 78, 2038, 78, 5.2, backWallsGroup, mats.wallSolid, true, 50);
    addWallSegment(1940, 78, 1940, 198, 5.2, backWallsGroup, mats.wallSolid, false);
    addWallSegment(2038, 78, 2038, 198, 5.2, backWallsGroup, mats.wallSolid, false);

    // Central Loading Dock Upper Fascia & Clerestory Window Band (Images 1 & 2 background)
    const dockFasciaR = rect([1062, 810, 1398, 822]);
    const dockUpperBeam = new THREE.Mesh(
      new THREE.BoxGeometry(dockFasciaR.w, 2.4, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.55 })
    );
    dockUpperBeam.position.set(dockFasciaR.x, 7.6, dockFasciaR.z);
    addEdges(dockUpperBeam, 0x475569, 0.65);
    backWallsGroup.add(dockUpperBeam);

    // 2. Stepped Internal Partition Walls
    addWallSegment(632, 247, 632, 700, 6.2, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(632, 700, 632, 1098, 3.6, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(674, 247, 674, 700, 6.2, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(674, 700, 674, 1098, 3.6, partitionWallsGroup, mats.wallPartition, true, 75);

    addWallSegment(1062, 247, 1062, 750, 7.2, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(1062, 750, 1062, 1098, 4.2, partitionWallsGroup, mats.wallPartition, true, 75);

    addWallSegment(1498, 247, 1498, 760, 7.8, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(1640, 247, 1640, 545, 7.8, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(1640, 545, 1895, 545, 6.0, partitionWallsGroup, mats.wallPartition, true, 75);

    const lowPartitions = [
      [278, 315, 552, 315], [395, 247, 395, 315], [520, 247, 520, 382],
      [200, 1048, 590, 1048], [890, 247, 890, 326], [890, 326, 1062, 326],
      [738, 398, 995, 398], [738, 540, 995, 540], [738, 398, 738, 540], [995, 398, 995, 540],
      [674, 1048, 922, 1048], [674, 1098, 1018, 1098],
      [1102, 712, 1402, 712], [1102, 815, 1402, 815],
      [1498, 880, 1895, 880], [1498, 1055, 1895, 1055]
    ];
    lowPartitions.forEach(seg => {
      addWallSegment(seg[0], seg[1], seg[2], seg[3], 2.8, partitionWallsGroup, mats.wallPartition, false);
    });

    // 3. Front / South Hall Walls (For X-Ray & Full Real Structure Modes)
    addWallSegment(200, 1098, 674, 1098, 10.5, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(1062, 815, 1498, 815, 11.2, frontWallsGroup, mats.wallCutawayFront, true, 65);

    // 4. Curved Barrel-Arch Roof Trusses & Solar PV Arrays (Matching Images 1–5 + Google Maps!)
    function buildCurvedArchSpan(px1, px2, py1, py2, eaveH, archRise, solarCols = 2, hasMonitor = false) {
      const r = rect([px1, py1, px2, py2]);
      const archSegs = 12;

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

      // 4B. Curved Roof Segments + North Cutaway Slice + Solar PV Panels
      const cutDepth = Math.min(8.5, r.d * 0.11);
      for (let s = 0; s < archSegs; s++) {
        const u1 = s / archSegs - 0.5;
        const u2 = (s + 1) / archSegs - 0.5;
        const x1 = r.x + u1 * r.w;
        const x2 = r.x + u2 * r.w;
        const y1 = eaveH + Math.cos(u1 * Math.PI) * archRise;
        const y2 = eaveH + Math.cos(u2 * Math.PI) * archRise;

        const segLen = Math.hypot(x2 - x1, y2 - y1);
        const segAng = Math.atan2(y2 - y1, x2 - x1);
        const midX = (x1 + x2) * 0.5;
        const midY = (y1 + y2) * 0.5;

        // Full length curved roof sheet (for X-Ray & Full modes)
        const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(segLen + 0.05, 0.14, r.d), mats.roofSheet);
        deckMesh.position.set(midX, midY, r.z);
        deckMesh.rotation.z = segAng;
        roofShellGroup.add(deckMesh);

        // North-edge Cutaway Slice of the Curved Arch Roof (Always visible in Cutaway Mode!)
        const cutDeck = new THREE.Mesh(
          new THREE.BoxGeometry(segLen + 0.05, 0.18, cutDepth),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.2 })
        );
        cutDeck.position.set(midX, midY, r.z1 + cutDepth * 0.5);
        cutDeck.rotation.z = segAng;
        roofTrussGroup.add(cutDeck);

        // Solar PV panels on the inner segments (leaving maintenance walkways between columns)
        const isWalkway = solarCols === 2 && (s === 0 || s === 5 || s === 6 || s === 11);
        if (!isWalkway) {
          const solarMesh = new THREE.Mesh(
            new THREE.BoxGeometry(segLen * 0.92, 0.08, r.d * 0.88),
            mats.solarPanel
          );
          solarMesh.position.set(midX, midY + 0.14, r.z);
          solarMesh.rotation.z = segAng;
          roofShellGroup.add(solarMesh);

          const cutSolar = new THREE.Mesh(
            new THREE.BoxGeometry(segLen * 0.92, 0.1, cutDepth * 0.82),
            new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.25, metalness: 0.65 })
          );
          cutSolar.position.set(midX, midY + 0.14, r.z1 + cutDepth * 0.5);
          cutSolar.rotation.z = segAng;
          roofTrussGroup.add(cutSolar);
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
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.45 })
        );
        cutMon.position.set(r.x, ridgeY + monH * 0.4, r.z1 + 4.25);
        addEdges(cutMon, 0x475569, 0.7);
        roofTrussGroup.add(cutMon);
      }
    }

    // Hall 1 Curved Barrel-Arch Roof (2 Solar Columns — Image 1 & 3 left building)
    buildCurvedArchSpan(200, 632, 247, 1098, 10.5, 2.5, 2, false);

    // Hall 2 Curved Barrel-Arch Roof (2 Solar Columns — Image 1 & 3 center-left building)
    buildCurvedArchSpan(632, 1062, 247, 1098, 10.5, 2.5, 2, false);

    // Hall 3 Central High-Bay Warehouse Roof
    buildCurvedArchSpan(1062, 1498, 247, 815, 11.2, 1.6, 2, false);

    // Hall 4 East Plant Large White Curved Barrel-Arch Roof + Central Monitor (Images 2, 4, 5)
    buildCurvedArchSpan(1498, 1895, 247, 1100, 12.8, 2.8, 2, true);

    // 5. Overhead Yellow Bridge Cranes
    function addBridgeCrane(px1, px2, py, height) {
      const p1 = pt(px1, py);
      const p2 = pt(px2, py);
      const span = Math.abs(p2.x - p1.x);
      const cx = (p1.x + p2.x) * 0.5;
      const cz = p1.z;

      const crane = new THREE.Group();
      [-0.45, 0.45].forEach(dz => {
        const girder = new THREE.Mesh(new THREE.BoxGeometry(span, 0.55, 0.32), mats.craneYellow);
        girder.position.set(cx, height, cz + dz);
        addEdges(girder, 0xa16207, 0.7);
        crane.add(girder);
      });
      [-span * 0.49, span * 0.49].forEach(dx => {
        const truck = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 1.6), mats.machineDark);
        truck.position.set(cx + dx, height, cz);
        crane.add(truck);
      });
      const trolley = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.3), mats.machineDark);
      trolley.position.set(cx + span * 0.12, height - 0.35, cz);
      const hookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.45), mats.craneYellow);
      hookBlock.position.set(cx + span * 0.12, height - 2.6, cz);
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), mats.steelColumn);
      cable.position.set(cx + span * 0.12, height - 1.5, cz);
      crane.add(trolley, hookBlock, cable);
      archGroup.add(crane);
    }

    addBridgeCrane(215, 618, 415, 8.8);
    addBridgeCrane(215, 618, 760, 8.8);
    addBridgeCrane(685, 1045, 600, 8.8);
    addBridgeCrane(1515, 1880, 690, 10.6);

    archGroup.add(
      backWallsGroup,
      partitionWallsGroup,
      frontWallsGroup,
      roofTrussGroup,
      roofShellGroup
    );
    scene.add(archGroup);
    return archGroup;
  }
};
