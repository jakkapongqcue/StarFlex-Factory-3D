// ============================================================================
// Module: src/builders/architecture.builder.js
// Builds the cutaway building shells, steel H-columns, internal partitions,
// exposed roof trusses, rooftop Solar PV arrays (matching Google Maps),
// and overhead yellow bridge cranes.
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

    addWallSegment(1895, 247, 1895, 490, 12.8, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1895, 490, 1950, 490, 4.5, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1950, 490, 1950, 545, 4.5, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1895, 545, 1895, 885, 12.8, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1895, 885, 1968, 885, 4.8, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1968, 885, 1968, 1055, 4.8, backWallsGroup, mats.wallSolid, false);

    // Auxiliary Buildings Back/Side Walls
    addWallSegment(1940, 78, 2038, 78, 5.2, backWallsGroup, mats.wallSolid, true, 50);
    addWallSegment(1940, 78, 1940, 198, 5.2, backWallsGroup, mats.wallSolid, false);
    addWallSegment(2038, 78, 2038, 198, 5.2, backWallsGroup, mats.wallSolid, false);

    addWallSegment(1185, 1430, 1292, 1430, 3.8, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1185, 1430, 1185, 1560, 3.8, backWallsGroup, mats.wallSolid, false);

    // 2. Stepped Internal Partition Walls (Cutaway height for unobstructed interior view)
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

    // 3. Front / South Exterior Walls (For X-Ray & Full Real Structure Modes)
    addWallSegment(200, 1098, 674, 1098, 10.5, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(674, 1190, 1018, 1190, 8.2, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(674, 1098, 674, 1190, 8.2, frontWallsGroup, mats.wallCutawayFront, false);
    addWallSegment(1018, 1098, 1018, 1190, 8.2, frontWallsGroup, mats.wallCutawayFront, false);
    addWallSegment(1062, 815, 1498, 815, 11.2, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(1498, 1148, 1895, 1148, 12.8, frontWallsGroup, mats.wallCutawayFront, true, 65);

    // 4. Roof Trusses & Rooftop Solar PV Arrays (Referenced to Google Maps)
    function buildGableSpan(px1, px2, py1, py2, eaveH, ridgeH, hasMonitor = false) {
      const r = rect([px1, py1, px2, py2]);
      const halfW = r.w * 0.5;

      const numTrusses = 6;
      for (let i = 0; i <= numTrusses; i++) {
        const z = r.z1 + (r.d * i) / numTrusses;
        const pts = [
          new THREE.Vector3(r.x1, eaveH, z),
          new THREE.Vector3(r.x, ridgeH, z),
          new THREE.Vector3(r.x2, eaveH, z),
          new THREE.Vector3(r.x1, eaveH, z)
        ];
        const line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.55 })
        );
        roofTrussGroup.add(line);
      }

      const slopeLen = Math.hypot(halfW, ridgeH - eaveH);
      const slopeAngle = Math.atan2(ridgeH - eaveH, halfW);

      [-1, 1].forEach(side => {
        const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(slopeLen, 0.14, r.d), mats.roofSheet);
        deckMesh.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5, r.z);
        deckMesh.rotation.z = -side * slopeAngle;
        addEdges(deckMesh, 0x64748b, 0.35);
        roofShellGroup.add(deckMesh);

        const solarMesh = new THREE.Mesh(new THREE.BoxGeometry(slopeLen * 0.84, 0.08, r.d * 0.88), mats.solarPanel);
        solarMesh.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5 + 0.14, r.z);
        solarMesh.rotation.z = -side * slopeAngle;
        addEdges(solarMesh, 0x38bdf8, 0.4);
        roofShellGroup.add(solarMesh);

        // North-edge cutaway roof slice
        const cutDepth = Math.min(8.5, r.d * 0.11);
        const cutDeck = new THREE.Mesh(
          new THREE.BoxGeometry(slopeLen, 0.16, cutDepth),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.2 })
        );
        cutDeck.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5, r.z1 + cutDepth * 0.5);
        cutDeck.rotation.z = -side * slopeAngle;
        addEdges(cutDeck, 0x64748b, 0.65);
        roofTrussGroup.add(cutDeck);

        const cutSolar = new THREE.Mesh(
          new THREE.BoxGeometry(slopeLen * 0.84, 0.1, cutDepth * 0.82),
          new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.25, metalness: 0.65 })
        );
        cutSolar.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5 + 0.14, r.z1 + cutDepth * 0.5);
        cutSolar.rotation.z = -side * slopeAngle;
        addEdges(cutSolar, 0x38bdf8, 0.6);
        roofTrussGroup.add(cutSolar);
      });

      if (hasMonitor) {
        const monW = r.w * 0.28;
        const monH = 1.65;
        const monMesh = new THREE.Mesh(new THREE.BoxGeometry(monW, monH, r.d * 0.72), mats.roofSheet);
        monMesh.position.set(r.x, ridgeH + monH * 0.4, r.z);
        addEdges(monMesh, 0x475569, 0.5);
        roofShellGroup.add(monMesh);

        const monSolar = new THREE.Mesh(new THREE.BoxGeometry(monW * 0.85, 0.1, r.d * 0.68), mats.solarPanel);
        monSolar.position.set(r.x, ridgeH + monH * 0.92, r.z);
        roofShellGroup.add(monSolar);

        const cutMon = new THREE.Mesh(
          new THREE.BoxGeometry(monW, monH, 8.5),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.45 })
        );
        cutMon.position.set(r.x, ridgeH + monH * 0.4, r.z1 + 4.25);
        addEdges(cutMon, 0x475569, 0.7);
        roofTrussGroup.add(cutMon);
      }
    }

    // 4-Span Solar Roof (Hall 1 & Hall 2)
    buildGableSpan(200, 416, 247, 1098, 10.5, 12.1, false);
    buildGableSpan(416, 632, 247, 1098, 10.5, 12.1, false);
    buildGableSpan(632, 847, 247, 1098, 10.5, 12.1, false);
    buildGableSpan(847, 1062, 247, 1098, 10.5, 12.1, false);

    // 2-Span High-Bay Warehouse Roof (Hall 3)
    buildGableSpan(1062, 1280, 247, 815, 11.2, 12.5, false);
    buildGableSpan(1280, 1498, 247, 815, 11.2, 12.5, false);

    // East High-Bay Monitor Roof (Hall 4)
    buildGableSpan(1498, 1895, 247, 1148, 12.8, 14.8, true);

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
