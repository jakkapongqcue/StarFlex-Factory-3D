// ============================================================================
// Starflex 3D Factory Procedural Geometry & Cutaway Architecture Builder
// Inspired by the clean white architectural cutaway style of "Fusion Plant 3D"
// while adhering 1:1 to Starflex Plant Layout & Google Maps roof structure.
// ============================================================================

window.StarflexBuilder = (function () {
  const DATA = window.STARFLEX_DATA;
  const CX = DATA.meta.centerX; // 1050
  const CY = DATA.meta.centerY; // 760
  const S = DATA.meta.scale;    // 0.1 (10px = 1m)

  // Convert blueprint pixel point (px, py) -> 3D world (x, z)
  function pt(px, py) {
    return {
      x: (px - CX) * S,
      z: (py - CY) * S
    };
  }

  // Convert blueprint pixel rectangle [px1, py1, px2, py2] -> 3D center & size
  function rect(b) {
    const w = Math.abs(b[2] - b[0]) * S;
    const d = Math.abs(b[3] - b[1]) * S;
    const x = ((b[0] + b[2]) * 0.5 - CX) * S;
    const z = ((b[1] + b[3]) * 0.5 - CY) * S;
    return { x, z, w, d, x1: (b[0] - CX) * S, z1: (b[1] - CY) * S, x2: (b[2] - CX) * S, z2: (b[3] - CY) * S };
  }

  // Helper to add crisp architectural edge lines to a mesh
  function addEdges(mesh, color = 0x94a3b8, opacity = 0.45) {
    const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity })
    );
    mesh.add(line);
    return line;
  }

  // Shared materials cache
  function createMaterials(clippingPlanes) {
    const clipProps = clippingPlanes ? { clippingPlanes, clipShadows: true } : {};
    return {
      slab: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85, metalness: 0.05 }),
      slabEdge: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8, metalness: 0.08 }),
      road: new THREE.MeshStandardMaterial({ color: 0xeef2f6, roughness: 0.9, metalness: 0.02 }),
      wallSolid: new THREE.MeshStandardMaterial({
        color: 0xe9eef5,
        roughness: 0.65,
        metalness: 0.1,
        side: THREE.DoubleSide,
        ...clipProps
      }),
      wallPartition: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.7,
        metalness: 0.08,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        ...clipProps
      }),
      wallCutawayFront: new THREE.MeshStandardMaterial({
        color: 0xdbeafe,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.0, // Hidden in cutaway mode, visible in X-ray / Full mode
        side: THREE.DoubleSide,
        ...clipProps
      }),
      steelColumn: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.45,
        metalness: 0.55,
        ...clipProps
      }),
      trussSteel: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85,
        ...clipProps
      }),
      roofSheet: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.5,
        metalness: 0.25,
        transparent: true,
        opacity: 0.0, // Controlled by roof mode
        side: THREE.DoubleSide,
        ...clipProps
      }),
      solarPanel: new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        roughness: 0.25,
        metalness: 0.65,
        transparent: true,
        opacity: 0.0, // Controlled by roof mode
        ...clipProps
      }),
      officeGlass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.38,
        ...clipProps
      }),
      canopyGreen: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.72,
        ...clipProps
      }),
      rampBlue: new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.5,
        metalness: 0.15
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.35,
        metalness: 0.4,
        ...clipProps
      }),
      machineBody: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.4,
        metalness: 0.3,
        ...clipProps
      }),
      machineDark: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.45,
        metalness: 0.6,
        ...clipProps
      }),
      chromeRoll: new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.2,
        metalness: 0.85,
        ...clipProps
      }),
      filmRollWhite: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1,
        ...clipProps
      }),
      filmBubble: new THREE.MeshPhysicalMaterial({
        color: 0x7dd3fc,
        roughness: 0.1,
        metalness: 0.05,
        transparent: true,
        opacity: 0.52,
        side: THREE.DoubleSide,
        ...clipProps
      }),
      palletWood: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.75,
        metalness: 0.05,
        ...clipProps
      }),
      cartonBox: new THREE.MeshStandardMaterial({
        color: 0xfde68a,
        roughness: 0.7,
        metalness: 0.05,
        ...clipProps
      })
    };
  }

  // ==========================================================================
  // 1. BUILD SITE BASE, ARCHITECTURAL GRID, DASHED PERIMETER & FLOOR SLABS
  // ==========================================================================
  function buildSiteAndFloors(scene, mats, state) {
    const siteGroup = new THREE.Group();
    siteGroup.name = "SiteAndFloors";

    // 1A. Infinite-style clean white studio grid (like Image 4)
    const gridHelper = new THREE.GridHelper(420, 84, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.set(10, -0.46, 5);
    siteGroup.add(gridHelper);

    // 1B. Dashed Property Boundary Line (referencing the red site boundary in Google Map overlay)
    const boundaryPts = [
      pt(120, 45),
      pt(2080, 45),
      pt(2080, 1575),
      pt(120, 1575),
      pt(120, 45)
    ].map(p => new THREE.Vector3(p.x, -0.38, p.z));
    const boundaryGeo = new THREE.BufferGeometry().setFromPoints(boundaryPts);
    const boundaryMat = new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 2.2,
      gapSize: 1.4,
      linewidth: 1
    });
    const boundaryLine = new THREE.Line(boundaryGeo, boundaryMat);
    boundaryLine.computeLineDistances();
    siteGroup.add(boundaryLine);

    // 1C. Internal Roads, Truck Courtyard & Gate Approach Slab
    const courtyardRects = [
      [1062, 815, 1410, 1430], // Central Truck Loading Courtyard
      [650, 1235, 1680, 1430], // Front East-West internal driveway
      [1160, 1430, 1320, 1570] // Main gate entrance road by Guardhouse
    ];
    courtyardRects.forEach(b => {
      const r = rect(b);
      const geo = new THREE.BoxGeometry(r.w, 0.12, r.d);
      const mesh = new THREE.Mesh(geo, mats.road);
      mesh.position.set(r.x, -0.38, r.z);
      mesh.receiveShadow = true;
      siteGroup.add(mesh);
    });

    // 1D. Raised Architectural Concrete Plinths for Each Building Section
    const floorSections = [
      [200, 247, 1062, 1098],  // Hall 1 & Hall 2 main slab
      [674, 1098, 1018, 1190], // Front 2-Story VIP/Admin Office Wing
      [1062, 247, 1498, 898],  // Hall 3 High-Bay Warehouse & Covered Dock
      [1498, 247, 1895, 1148], // Hall 4 East Plant (Blow Film, Printing, Lamination)
      [1395, 765, 1498, 1230], // Hall 4 West Ramp Corridor
      [1395, 1148, 1705, 1235],// Hall 4 South Shipping Bay
      [1895, 490, 1950, 545],  // East MDB Room
      [1895, 885, 1968, 1055], // East Oven Room
      [1940, 78, 2038, 198],   // NE Pump Room
      [1185, 1430, 1292, 1560] // South Security Guardhouse
    ];

    floorSections.forEach(b => {
      const r = rect(b);
      const slabGeo = new THREE.BoxGeometry(r.w, 0.44, r.d);
      const slabMesh = new THREE.Mesh(slabGeo, mats.slab);
      slabMesh.position.set(r.x, -0.22, r.z);
      slabMesh.receiveShadow = true;
      addEdges(slabMesh, 0xcbd5e1, 0.7);
      siteGroup.add(slabMesh);
    });

    // 1E. Exact 1:1 Blueprint Texture Overlay Plane & Satellite Ground Plane
    const bpW = DATA.meta.blueprintWidth * S;  // 234.0m
    const bpD = DATA.meta.blueprintHeight * S; // 159.0m
    const bpCenterX = (DATA.meta.blueprintWidth * 0.5 - CX) * S;  // +12.0m
    const bpCenterZ = (DATA.meta.blueprintHeight * 0.5 - CY) * S; // +3.5m

    const blueprintPlaneGeo = new THREE.PlaneGeometry(bpW, bpD);
    const blueprintPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.32, // Subtle architectural blueprint lines on floor by default!
      depthWrite: false
    });
    const blueprintPlane = new THREE.Mesh(blueprintPlaneGeo, blueprintPlaneMat);
    blueprintPlane.rotation.x = -Math.PI / 2;
    blueprintPlane.position.set(bpCenterX, 0.015, bpCenterZ);
    siteGroup.add(blueprintPlane);
    state.blueprintPlane = blueprintPlane;

    // Load embedded textures from window.STARFLEX_TEXTURES if available
    if (window.STARFLEX_TEXTURES) {
      const loadDataTex = (dataUrl, cb) => {
        const img = new Image();
        const tex = new THREE.Texture(img);
        tex.anisotropy = 8;
        img.onload = () => {
          tex.needsUpdate = true;
          if (cb) cb(tex);
          if (window.__triggerRender) window.__triggerRender();
        };
        img.src = dataUrl;
        return tex;
      };
      if (window.STARFLEX_TEXTURES.layout) {
        loadDataTex(window.STARFLEX_TEXTURES.layout, tex => {
          state.textures.layout = tex;
          blueprintPlaneMat.map = tex;
          blueprintPlaneMat.needsUpdate = true;
        });
      }
      if (window.STARFLEX_TEXTURES.overlay) {
        loadDataTex(window.STARFLEX_TEXTURES.overlay, tex => {
          state.textures.overlay = tex;
        });
      }
      if (window.STARFLEX_TEXTURES.satellite) {
        loadDataTex(window.STARFLEX_TEXTURES.satellite, tex => {
          state.textures.satellite = tex;
        });
      }
    }

    // Satellite plane (aligned & rotated +26.3 deg so the satellite factory matches our 3D model!)
    const satPlaneGeo = new THREE.PlaneGeometry(315, 187);
    const satPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const satPlane = new THREE.Mesh(satPlaneGeo, satPlaneMat);
    satPlane.rotation.x = -Math.PI / 2;
    satPlane.rotation.z = -0.455; // Matches the angle in "Starflex from google map over Layout.png"
    satPlane.position.set(16.0, -0.34, -2.0);
    satPlane.visible = false;
    siteGroup.add(satPlane);
    state.satPlane = satPlane;

    // 1F. 5 Blue Forklift Ramps ("ทางขึ้นลง") from Blueprint
    const blueRamps = [
      { bounds: [1102, 665, 1158, 712], slopeDir: "S" }, // Ramp 1 (Center)
      { bounds: [1445, 755, 1492, 838], slopeDir: "W" }, // Ramp 2 (East Hall N)
      { bounds: [1425, 948, 1470, 1005], slopeDir: "W" },// Ramp 3 (East Hall M)
      { bounds: [1470, 980, 1530, 1055], slopeDir: "W" },// Ramp 4 (East Hall S1)
      { bounds: [1470, 1068, 1530, 1140], slopeDir: "W" }// Ramp 5 (East Hall S2)
    ];
    blueRamps.forEach(rmp => {
      const r = rect(rmp.bounds);
      const rampGeo = new THREE.BoxGeometry(r.w, 0.22, r.d);
      const rampMesh = new THREE.Mesh(rampGeo, mats.rampBlue);
      rampMesh.position.set(r.x, 0.11, r.z);
      addEdges(rampMesh, 0x1d4ed8, 0.8);
      siteGroup.add(rampMesh);
    });

    // 1G. Green Entrance / Shipping Canopies (from Blueprint green hatched boxes)
    const greenCanopies = [
      [842, 1190, 884, 1234],  // Front VIP Office Canopy
      [1440, 1230, 1492, 1290],// SE Shipping Canopy Left
      [1550, 1230, 1602, 1290] // SE Shipping Canopy Right
    ];
    greenCanopies.forEach(b => {
      const r = rect(b);
      const canGroup = new THREE.Group();
      const roofGeo = new THREE.BoxGeometry(r.w, 0.25, r.d);
      const roofMesh = new THREE.Mesh(roofGeo, mats.canopyGreen);
      roofMesh.position.set(r.x, 3.6, r.z);
      addEdges(roofMesh, 0x047857, 0.8);
      canGroup.add(roofMesh);
      // 2 front support pillars
      [-r.w * 0.42, r.w * 0.42].forEach(dx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8), mats.steelColumn);
        col.position.set(r.x + dx, 1.8, r.z + r.d * 0.4);
        canGroup.add(col);
      });
      siteGroup.add(canGroup);
    });

    // 1H. Row of 7 Green Trees along Central Passage (px: 1095, py: 495..705)
    for (let py = 500; py <= 700; py += 33) {
      const p = pt(1095, py);
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.18, 1.2, 7),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      );
      trunk.position.y = 0.6;
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 })
      );
      foliage.position.y = 1.65;
      foliage.scale.set(1, 0.85, 1);
      tree.add(trunk, foliage);
      tree.position.set(p.x, 0, p.z);
      siteGroup.add(tree);
    }

    scene.add(siteGroup);
    return siteGroup;
  }

  // ==========================================================================
  // 2. BUILD CUTAWAY ARCHITECTURAL SHELL, COLUMNS, TRUSSES & SOLAR ROOFS
  // ==========================================================================
  function buildCutawayArchitecture(scene, mats, state) {
    const archGroup = new THREE.Group();
    archGroup.name = "CutawayArchitecture";

    const backWallsGroup = new THREE.Group();     // Always visible in Cutaway/X-ray/Full
    const partitionWallsGroup = new THREE.Group();// Internal walls & low room partitions
    const frontWallsGroup = new THREE.Group();    // Cutaway front walls (hidden in Cutaway mode)
    const roofTrussGroup = new THREE.Group();     // Exposed steel trusses (visible in Cutaway)
    const roofShellGroup = new THREE.Group();     // Roof metal deck + Solar PV panels

    state.archGroups = {
      backWallsGroup,
      partitionWallsGroup,
      frontWallsGroup,
      roofTrussGroup,
      roofShellGroup
    };

    // Helper: create a structural wall segment with vertical cladding ribs & H-columns
    function addWallSegment(px1, py1, px2, py2, h, targetGroup, mat, addColumns = true, colStep = 65) {
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);
      const thickness = 0.28;

      const wallGeo = new THREE.BoxGeometry(len, h, thickness);
      const wallMesh = new THREE.Mesh(wallGeo, mat);
      wallMesh.position.set((p1.x + p2.x) * 0.5, h * 0.5, (p1.z + p2.z) * 0.5);
      wallMesh.rotation.y = -angle;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      addEdges(wallMesh, 0x94a3b8, 0.55);
      targetGroup.add(wallMesh);

      // Add vertical steel H-columns along structural walls (like Image 4)
      if (addColumns) {
        const distPx = Math.hypot(px2 - px1, py2 - py1);
        const steps = Math.max(1, Math.round(distPx / colStep));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const cx = p1.x + dx * t;
          const cz = p1.z + dz * t;
          const colGeo = new THREE.BoxGeometry(0.46, h + 0.15, 0.46);
          const colMesh = new THREE.Mesh(colGeo, mats.steelColumn);
          colMesh.position.set(cx, h * 0.5, cz);
          colMesh.castShadow = true;
          targetGroup.add(colMesh);
        }
      }
    }

    // ----------------------------------------------------------------------
    // 2A. BACK & SIDE STRUCTURAL WALLS (Always visible in Cutaway Mode like Image 4!)
    // ----------------------------------------------------------------------
    // North Back Wall spanning Hall 1, Hall 2, Hall 3, Hall 4 (px: 200..1895, py: 247)
    addWallSegment(200, 247, 1062, 247, 10.5, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1062, 247, 1498, 247, 11.2, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1498, 247, 1895, 247, 12.8, backWallsGroup, mats.wallSolid, true, 65);

    // West Outer Wall of Hall 1 (px: 200, py: 247..1098)
    addWallSegment(200, 247, 200, 1098, 10.5, backWallsGroup, mats.wallSolid, true, 65);

    // East Outer Wall of Hall 4 (px: 1895, py: 247..1148) + MDB & Oven Room walls
    addWallSegment(1895, 247, 1895, 490, 12.8, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1895, 490, 1950, 490, 4.5, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1950, 490, 1950, 545, 4.5, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1895, 545, 1895, 885, 12.8, backWallsGroup, mats.wallSolid, true, 65);
    addWallSegment(1895, 885, 1968, 885, 4.8, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1968, 885, 1968, 1055, 4.8, backWallsGroup, mats.wallSolid, false);

    // Pump Room & Guardhouse Back/Side Cutaway Shells
    addWallSegment(1940, 78, 2038, 78, 5.2, backWallsGroup, mats.wallSolid, true, 50);
    addWallSegment(1940, 78, 1940, 198, 5.2, backWallsGroup, mats.wallSolid, false);
    addWallSegment(2038, 78, 2038, 198, 5.2, backWallsGroup, mats.wallSolid, false);

    addWallSegment(1185, 1430, 1292, 1430, 3.8, backWallsGroup, mats.wallSolid, false);
    addWallSegment(1185, 1430, 1185, 1560, 3.8, backWallsGroup, mats.wallSolid, false);

    // ----------------------------------------------------------------------
    // 2B. INTERNAL STRUCTURAL & PARTITION WALLS (Semi-height / Cutaway height so interior is clear)
    // ----------------------------------------------------------------------
    // Main dividing wall between Hall 1 & Hall 2 (px: 632 & 674) — stepped cutaway height (6.5m N -> 3.8m S)
    addWallSegment(632, 247, 632, 700, 6.2, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(632, 700, 632, 1098, 3.6, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(674, 247, 674, 700, 6.2, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(674, 700, 674, 1098, 3.6, partitionWallsGroup, mats.wallPartition, true, 75);

    // Dividing wall between Hall 2 and Hall 3 Warehouse (px: 1062)
    addWallSegment(1062, 247, 1062, 750, 7.2, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(1062, 750, 1062, 1098, 4.2, partitionWallsGroup, mats.wallPartition, true, 75);

    // Dividing wall between Hall 3 Warehouse and Hall 4 East Plant (px: 1498 / 1640)
    addWallSegment(1498, 247, 1498, 760, 7.8, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(1640, 247, 1640, 545, 7.8, partitionWallsGroup, mats.wallPartition, true, 75);
    addWallSegment(1640, 545, 1895, 545, 6.0, partitionWallsGroup, mats.wallPartition, true, 75);

    // Low internal room partition walls (2.8m cutaway walls for offices, prep rooms, restrooms)
    const lowPartitions = [
      // Hall 1 North Prep Rooms
      [278, 315, 552, 315],
      [395, 247, 395, 315],
      [520, 247, 520, 382],
      // Hall 1 South QA / Office strip
      [200, 1048, 590, 1048],
      // Hall 2 North ALU & Cylinder room
      [890, 247, 890, 326],
      [890, 326, 1062, 326],
      // Hall 2 Enclosed Warehouse walls
      [738, 398, 995, 398],
      [738, 540, 995, 540],
      [738, 398, 738, 540],
      [995, 398, 995, 540],
      // Hall 2 South Offices & Front VIP Office partitions
      [674, 1048, 922, 1048],
      [674, 1098, 1018, 1098],
      // Hall 3 Restrooms & Dock passage
      [1102, 712, 1402, 712],
      [1102, 815, 1402, 815],
      // Hall 4 Bobst / Fuji Kikai South Partition
      [1498, 880, 1895, 880],
      [1498, 1055, 1895, 1055]
    ];
    lowPartitions.forEach(seg => {
      addWallSegment(seg[0], seg[1], seg[2], seg[3], 2.8, partitionWallsGroup, mats.wallPartition, false);
    });

    // ----------------------------------------------------------------------
    // 2C. FRONT / SOUTH EXTERIOR WALLS (Cutaway by default; shown in X-Ray & Full Exterior modes)
    // ----------------------------------------------------------------------
    addWallSegment(200, 1098, 674, 1098, 10.5, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(674, 1190, 1018, 1190, 8.2, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(674, 1098, 674, 1190, 8.2, frontWallsGroup, mats.wallCutawayFront, false);
    addWallSegment(1018, 1098, 1018, 1190, 8.2, frontWallsGroup, mats.wallCutawayFront, false);
    addWallSegment(1062, 815, 1498, 815, 11.2, frontWallsGroup, mats.wallCutawayFront, true, 65);
    addWallSegment(1498, 1148, 1895, 1148, 12.8, frontWallsGroup, mats.wallCutawayFront, true, 65);

    // ----------------------------------------------------------------------
    // 2D. EXPOSED STRUCTURAL STEEL ROOF TRUSSES & REAL SOLAR ROOF SHELL
    //     (Referencing the exact roof profile from Google Maps!)
    // ----------------------------------------------------------------------
    // Helper to build a pitched steel truss + optional roof deck & solar PV array
    function buildGableSpan(px1, px2, py1, py2, eaveH, ridgeH, hasMonitor = false) {
      const r = rect([px1, py1, px2, py2]);
      const halfW = r.w * 0.5;

      // 1. Structural Steel Portal Trusses along N-S every ~14m
      const numTrusses = 6;
      for (let i = 0; i <= numTrusses; i++) {
        const z = r.z1 + (r.d * i) / numTrusses;
        const pts = [
          new THREE.Vector3(r.x1, eaveH, z),
          new THREE.Vector3(r.x, ridgeH, z),
          new THREE.Vector3(r.x2, eaveH, z),
          new THREE.Vector3(r.x1, eaveH, z)
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.55 })
        );
        roofTrussGroup.add(line);
      }

      // 2. Sloped Roof Panels & Solar PV Arrays (for X-Ray & Full Real Roof Modes,
      //    plus a neat cutaway strip at the North back edge in Cutaway mode!)
      const slopeLen = Math.hypot(halfW, ridgeH - eaveH);
      const slopeAngle = Math.atan2(ridgeH - eaveH, halfW);

      [-1, 1].forEach(side => {
        // Full roof slope mesh (controlled by roof mode)
        const deckGeo = new THREE.BoxGeometry(slopeLen, 0.14, r.d);
        const deckMesh = new THREE.Mesh(deckGeo, mats.roofSheet);
        deckMesh.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5, r.z);
        deckMesh.rotation.z = -side * slopeAngle;
        addEdges(deckMesh, 0x64748b, 0.35);
        roofShellGroup.add(deckMesh);

        // Solar PV Panel Array on top of slope (dark blue solar cells from Google Maps!)
        const solarGeo = new THREE.BoxGeometry(slopeLen * 0.84, 0.08, r.d * 0.88);
        const solarMesh = new THREE.Mesh(solarGeo, mats.solarPanel);
        solarMesh.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5 + 0.14, r.z);
        solarMesh.rotation.z = -side * slopeAngle;
        addEdges(solarMesh, 0x38bdf8, 0.4);
        roofShellGroup.add(solarMesh);

        // Cutaway North-Edge Architectural Roof Overhang (10% depth at North wall so in
        // Cutaway mode you can see the real roof profile & solar panels sliced open!)
        const cutDepth = Math.min(8.5, r.d * 0.11);
        const cutDeckGeo = new THREE.BoxGeometry(slopeLen, 0.16, cutDepth);
        const cutDeckMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.2 });
        const cutDeck = new THREE.Mesh(cutDeckGeo, cutDeckMat);
        cutDeck.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5, r.z1 + cutDepth * 0.5);
        cutDeck.rotation.z = -side * slopeAngle;
        addEdges(cutDeck, 0x64748b, 0.65);
        roofTrussGroup.add(cutDeck);

        const cutSolarGeo = new THREE.BoxGeometry(slopeLen * 0.84, 0.1, cutDepth * 0.82);
        const cutSolarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.25, metalness: 0.65 });
        const cutSolar = new THREE.Mesh(cutSolarGeo, cutSolarMat);
        cutSolar.position.set(r.x + side * (halfW * 0.5), (eaveH + ridgeH) * 0.5 + 0.14, r.z1 + cutDepth * 0.5);
        cutSolar.rotation.z = -side * slopeAngle;
        addEdges(cutSolar, 0x38bdf8, 0.6);
        roofTrussGroup.add(cutSolar);
      });

      // 3. Raised Central Roof Monitor (for Hall 4 East Plant - clearly seen in Google Maps!)
      if (hasMonitor) {
        const monW = r.w * 0.28;
        const monH = 1.65;
        const monGeo = new THREE.BoxGeometry(monW, monH, r.d * 0.72);
        const monMesh = new THREE.Mesh(monGeo, mats.roofSheet);
        monMesh.position.set(r.x, ridgeH + monH * 0.4, r.z);
        addEdges(monMesh, 0x475569, 0.5);
        roofShellGroup.add(monMesh);

        // Monitor solar strip
        const monSolar = new THREE.Mesh(
          new THREE.BoxGeometry(monW * 0.85, 0.1, r.d * 0.68),
          mats.solarPanel
        );
        monSolar.position.set(r.x, ridgeH + monH * 0.92, r.z);
        roofShellGroup.add(monSolar);

        // Cutaway slice of the monitor at the North edge
        const cutMon = new THREE.Mesh(
          new THREE.BoxGeometry(monW, monH, 8.5),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.45 })
        );
        cutMon.position.set(r.x, ridgeH + monH * 0.4, r.z1 + 4.25);
        addEdges(cutMon, 0x475569, 0.7);
        roofTrussGroup.add(cutMon);
      }
    }

    // Build the 4 Solar Gable Spans of Hall 1 & Hall 2 (matching Google Maps left 4-column solar roof!)
    buildGableSpan(200, 416, 247, 1098, 10.5, 12.1, false);
    buildGableSpan(416, 632, 247, 1098, 10.5, 12.1, false);
    buildGableSpan(632, 847, 247, 1098, 10.5, 12.1, false);
    buildGableSpan(847, 1062, 247, 1098, 10.5, 12.1, false);

    // Build Hall 3 Central High-Bay Warehouse Roof (2 spans with solar panels)
    buildGableSpan(1062, 1280, 247, 815, 11.2, 12.5, false);
    buildGableSpan(1280, 1498, 247, 815, 11.2, 12.5, false);

    // Build Hall 4 East Plant Roof (Wide span with Raised Central Monitor & Solar Panels!)
    buildGableSpan(1498, 1895, 247, 1148, 12.8, 14.8, true);

    // ----------------------------------------------------------------------
    // 2E. OVERHEAD YELLOW BRIDGE CRANES (เครนเหนือศีรษะสีเหลือง เหมือนในภาพตัวอย่างที่ 4!)
    // ----------------------------------------------------------------------
    function addBridgeCrane(px1, px2, py, height) {
      const p1 = pt(px1, py);
      const p2 = pt(px2, py);
      const span = Math.abs(p2.x - p1.x);
      const cx = (p1.x + p2.x) * 0.5;
      const cz = p1.z;

      const crane = new THREE.Group();
      // Double yellow box girders
      [-0.45, 0.45].forEach(dz => {
        const girder = new THREE.Mesh(
          new THREE.BoxGeometry(span, 0.55, 0.32),
          mats.craneYellow
        );
        girder.position.set(cx, height, cz + dz);
        addEdges(girder, 0xa16207, 0.7);
        crane.add(girder);
      });
      // End trucks
      [-span * 0.49, span * 0.49].forEach(dx => {
        const truck = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.65, 1.6),
          mats.machineDark
        );
        truck.position.set(cx + dx, height, cz);
        crane.add(truck);
      });
      // Hoist trolley & hook cable
      const trolley = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.6, 1.3),
        mats.machineDark
      );
      trolley.position.set(cx + span * 0.12, height - 0.35, cz);
      const hookBlock = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.5, 0.45),
        mats.craneYellow
      );
      hookBlock.position.set(cx + span * 0.12, height - 2.6, cz);
      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6),
        mats.steelColumn
      );
      cable.position.set(cx + span * 0.12, height - 1.5, cz);
      crane.add(trolley, hookBlock, cable);
      archGroup.add(crane);
    }

    addBridgeCrane(215, 618, 415, 8.8);  // Hall 1 Printing Crane
    addBridgeCrane(215, 618, 760, 8.8);  // Hall 1 Extrusion Crane
    addBridgeCrane(685, 1045, 600, 8.8); // Hall 2 FG Warehouse Crane
    addBridgeCrane(1515, 1880, 690, 10.6);// Hall 4 East Plant Heavy Crane

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

  // ==========================================================================
  // 3. BUILD DETAILED 3D INDUSTRIAL MACHINES, RACKS, OFFICES & LOGISTICS
  // ==========================================================================
  function buildMachinesAndZones(scene, mats, state) {
    const itemsGroup = new THREE.Group();
    itemsGroup.name = "MachinesAndZones";

    DATA.items.forEach(item => {
      const cat = DATA.categories[item.category] || DATA.categories.office_utility;
      const r = rect(item.bounds);
      const group = new THREE.Group();
      group.position.set(r.x, 0, r.z);
      group.userData = { item, category: cat, rect: r };

      const accentMat = new THREE.MeshStandardMaterial({
        color: cat.color,
        roughness: 0.32,
        metalness: 0.35
      });
      const lightAccentMat = new THREE.MeshStandardMaterial({
        color: cat.accent,
        roughness: 0.35,
        metalness: 0.25
      });

      const isNS = item.orientation === "NS" || r.d > r.w * 1.25;
      const L = isNS ? r.d : r.w; // Machine major length
      const W = isNS ? r.w : r.d; // Machine cross width
      const H = item.height || 4.0;

      const inner = new THREE.Group();
      if (isNS) inner.rotation.y = Math.PI / 2;

      // --------------------------------------------------------------------
      // TYPE A: GRAVURE PRINTING PRESS (Multi-tower + Purple Overhead Manifold like Image 4!)
      // --------------------------------------------------------------------
      if (item.type === "gravure_press") {
        // Base plinth
        const base = new THREE.Mesh(new THREE.BoxGeometry(L * 0.96, 0.35, W * 0.82), mats.machineDark);
        base.position.y = 0.18;
        inner.add(base);

        // 8 Print Units along the length
        const numTowers = Math.max(5, Math.min(9, Math.floor(L / 1.9)));
        const towerSpan = L * 0.72;
        for (let i = 0; i < numTowers; i++) {
          const tx = -towerSpan * 0.5 + (towerSpan * i) / (numTowers - 1);
          const tower = new THREE.Mesh(
            new THREE.BoxGeometry(towerSpan / numTowers * 0.68, H * 0.68, W * 0.68),
            mats.machineBody
          );
          tower.position.set(tx, H * 0.36, 0);
          tower.castShadow = true;
          addEdges(tower, 0x94a3b8, 0.6);
          inner.add(tower);

          // Individual drying hood cap on top of each station
          const hood = new THREE.Mesh(
            new THREE.BoxGeometry(towerSpan / numTowers * 0.52, H * 0.22, W * 0.52),
            accentMat
          );
          hood.position.set(tx, H * 0.78, 0);
          inner.add(hood);
        }

        // Overhead Main Exhaust Manifold Pipe + Drop Risers (like the purple manifold in Image 4!)
        const mainPipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, L * 0.84, 12),
          lightAccentMat
        );
        mainPipe.rotation.z = Math.PI / 2;
        mainPipe.position.set(0, H * 0.98, 0);
        inner.add(mainPipe);

        // Unwind & Rewind Film Roll Stands at both ends
        [-L * 0.43, L * 0.43].forEach(ex => {
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(W * 0.26, W * 0.26, W * 0.58, 16),
            mats.filmRollWhite
          );
          roll.rotation.x = Math.PI / 2;
          roll.position.set(ex, H * 0.28, 0);
          addEdges(roll, 0xcbd5e1, 0.5);
          inner.add(roll);
        });
      }

      // --------------------------------------------------------------------
      // TYPE B: BLOWN FILM EXTRUSION TOWER (02 BLOW FILM 1BF-01 — 3-Story High-Bay Tower!)
      // --------------------------------------------------------------------
      else if (item.type === "blow_film_tower") {
        // 3-story structural steel frame with platforms
        const frameW = L * 0.78;
        const frameD = W * 0.78;
        [0.2, H * 0.36, H * 0.68, H * 0.95].forEach((py, idx) => {
          const plat = new THREE.Mesh(
            new THREE.BoxGeometry(frameW, 0.18, frameD),
            idx === 0 ? mats.machineDark : mats.steelColumn
          );
          plat.position.y = py;
          addEdges(plat, 0x475569, 0.7);
          inner.add(plat);
        });
        // 4 corner columns of the tower
        [-frameW * 0.46, frameW * 0.46].forEach(cx => {
          [-frameD * 0.46, frameD * 0.46].forEach(cz => {
            const col = new THREE.Mesh(
              new THREE.BoxGeometry(0.28, H, 0.28),
              mats.steelColumn
            );
            col.position.set(cx, H * 0.5, cz);
            inner.add(col);
          });
        });
        // Base Extruders + Circular Die Head
        const dieHead = new THREE.Mesh(
          new THREE.CylinderGeometry(1.1, 1.35, 1.5, 20),
          accentMat
        );
        dieHead.position.set(0, 1.0, 0);
        inner.add(dieHead);

        // Translucent Glowing Film Bubble rising vertically through the tower!
        const bubble = new THREE.Mesh(
          new THREE.CylinderGeometry(1.45, 0.95, H * 0.72, 24, 1, true),
          mats.filmBubble
        );
        bubble.position.set(0, 1.6 + H * 0.36, 0);
        inner.add(bubble);

        // Top Nip Rollers
        const nip = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, frameD * 0.65, 12),
          mats.chromeRoll
        );
        nip.rotation.x = Math.PI / 2;
        nip.position.set(0, H * 0.92, 0);
        inner.add(nip);
      }

      // --------------------------------------------------------------------
      // TYPE C: EXTRUSION LAMINATION LINE (ET-02, 07 Extrusion)
      // --------------------------------------------------------------------
      else if (item.type === "extrusion_line") {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(L * 0.92, H * 0.45, W * 0.55), mats.machineBody);
        bed.position.y = H * 0.25;
        addEdges(bed, 0x94a3b8, 0.6);
        inner.add(bed);

        // Twin Extruder Barrels + Resin Hoppers sticking out
        [-L * 0.18, L * 0.18].forEach(ex => {
          const barrel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, W * 0.88), accentMat);
          barrel.position.set(ex, H * 0.35, 0);
          const hopper = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.4, 12), mats.chromeRoll);
          hopper.rotation.x = Math.PI;
          hopper.position.set(ex, H * 0.78, W * 0.26);
          inner.add(barrel, hopper);
        });

        // Overhead Hood & Ducting
        const hood = new THREE.Mesh(new THREE.BoxGeometry(L * 0.76, H * 0.22, W * 0.48), lightAccentMat);
        hood.position.set(0, H * 0.72, 0);
        addEdges(hood, 0x0284c7, 0.6);
        inner.add(hood);
      }

      // --------------------------------------------------------------------
      // TYPE D: LAMINATOR & DRYING TUNNEL (Bobst, Comaxi, Fuji Kikai, SB/SL)
      // --------------------------------------------------------------------
      else if (item.type === "laminator" || item.type === "converting_group") {
        // Left & Right Coating / Laminating Stations
        [-L * 0.32, L * 0.32].forEach(sx => {
          const st = new THREE.Mesh(new THREE.BoxGeometry(L * 0.24, H * 0.62, W * 0.72), mats.machineBody);
          st.position.set(sx, H * 0.31, 0);
          addEdges(st, 0x94a3b8, 0.6);
          inner.add(st);
        });
        // Elevated Drying Tunnel Bridge on top
        const tunnel = new THREE.Mesh(new THREE.BoxGeometry(L * 0.85, H * 0.32, W * 0.64), accentMat);
        tunnel.position.set(0, H * 0.76, 0);
        addEdges(tunnel, 0xb45309, 0.6);
        inner.add(tunnel);

        // Film Rolls
        [-L * 0.44, 0, L * 0.44].forEach(rx => {
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.48, 0.48, W * 0.56, 14),
            mats.filmRollWhite
          );
          roll.rotation.x = Math.PI / 2;
          roll.position.set(rx, 0.85, 0);
          inner.add(roll);
        });
      }

      // --------------------------------------------------------------------
      // TYPE E: THERMAL CURING OVEN CHAMBER (OVEN ROOM AREA & East Oven Room)
      // --------------------------------------------------------------------
      else if (item.type === "oven_chamber" || item.type === "burner_unit") {
        const chamber = new THREE.Mesh(
          new THREE.BoxGeometry(L * 0.94, H * 0.82, W * 0.9),
          new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45, metalness: 0.2 })
        );
        chamber.position.y = H * 0.41;
        addEdges(chamber, 0xd97706, 0.75);
        inner.add(chamber);

        // Top thermal blower stack
        const stack = new THREE.Mesh(new THREE.BoxGeometry(L * 0.55, H * 0.22, W * 0.5), accentMat);
        stack.position.y = H * 0.92;
        inner.add(stack);
      }

      // --------------------------------------------------------------------
      // TYPE F: 14 PARALLEL BAG MAKING LINES (BM 04–17 in Hall 2!)
      // --------------------------------------------------------------------
      else if (item.type === "bag_making_array") {
        // Render all 14 distinct parallel vertical BM lines from the blueprint!
        const numLines = 14;
        for (let i = 0; i < numLines; i++) {
          const lx = -r.w * 0.46 + (r.w * 0.92 * i) / (numLines - 1);
          const lineLen = r.d * (i === 13 ? 0.95 : i % 3 === 0 ? 0.84 : 0.74);

          const bmBody = new THREE.Mesh(
            new THREE.BoxGeometry(1.15, 1.35, lineLen),
            mats.machineBody
          );
          bmBody.position.set(lx, 0.68, -r.d * 0.05);
          addEdges(bmBody, 0x94a3b8, 0.55);
          group.add(bmBody);

          // Green sealing bridge on each BM line
          const sealer = new THREE.Mesh(
            new THREE.BoxGeometry(1.25, 0.65, 2.2),
            accentMat
          );
          sealer.position.set(lx, 1.65, -r.d * 0.12);
          group.add(sealer);

          // Film roll at North unwind end of each BM line
          const roll = new THREE.Mesh(
            new THREE.CylinderGeometry(0.42, 0.42, 0.95, 12),
            mats.filmRollWhite
          );
          roll.rotation.z = Math.PI / 2;
          roll.position.set(lx, 0.8, -lineLen * 0.48);
          group.add(roll);
        }
      }

      // --------------------------------------------------------------------
      // TYPE G: SPOUT INSERTION (1SP 01–07) & SLITTER REWINDERS (SM 01–20)
      // --------------------------------------------------------------------
      else if (item.type === "spout_array" || item.type === "slitter_array" || item.type === "slitter_group") {
        const cols = item.type === "slitter_array" ? 8 : item.type === "spout_array" ? 5 : 2;
        const rows = item.type === "slitter_array" ? 2 : item.type === "spout_array" ? 2 : 1;
        for (let c = 0; c < cols; c++) {
          for (let rw = 0; rw < rows; rw++) {
            const mx = (cols === 1 ? 0 : -r.w * 0.42 + (r.w * 0.84 * c) / (cols - 1));
            const mz = (rows === 1 ? 0 : -r.d * 0.28 + (r.d * 0.56 * rw) / (rows - 1));
            const unit = new THREE.Mesh(
              new THREE.BoxGeometry(Math.min(2.1, r.w / cols * 0.72), 1.6, Math.min(2.0, r.d / rows * 0.68)),
              mats.machineBody
            );
            unit.position.set(mx, 0.8, mz);
            addEdges(unit, 0x64748b, 0.6);
            const cap = new THREE.Mesh(
              new THREE.BoxGeometry(Math.min(1.6, r.w / cols * 0.55), 0.45, Math.min(1.4, r.d / rows * 0.5)),
              accentMat
            );
            cap.position.set(mx, 1.82, mz);
            group.add(unit, cap);
          }
        }
      }

      // --------------------------------------------------------------------
      // TYPE H: HIGH-BAY PALLET RACKS & FINISHED GOODS RACKS
      // --------------------------------------------------------------------
      else if (item.type === "highbay_racks" || item.type === "rack_zone" || item.type === "staging_racks" || item.type === "hanging_rack") {
        const numAisles = item.type === "staging_racks" ? 1 : 6;
        const tiers = item.type === "highbay_racks" ? 4 : 3;
        const rackMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.5 });
        const beamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });

        for (let a = 0; a < numAisles; a++) {
          const rx = numAisles === 1 ? 0 : -r.w * 0.43 + (r.w * 0.86 * a) / (numAisles - 1);
          const rackW = numAisles === 1 ? r.w * 0.75 : 2.2;
          const rackD = r.d * 0.92;

          // Upright frame
          const frame = new THREE.Mesh(
            new THREE.BoxGeometry(rackW, H, rackD),
            new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.35 })
          );
          frame.position.set(rx, H * 0.5, 0);
          group.add(frame);

          // Horizontal orange load beams + pallets/boxes on each tier
          for (let t = 1; t <= tiers; t++) {
            const ty = (H * t) / (tiers + 0.3);
            const shelf = new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.96, 0.14, rackD * 0.98), beamMat);
            shelf.position.set(rx, ty, 0);
            group.add(shelf);

            // Populate with pallet boxes & white film rolls
            const numPallets = Math.max(3, Math.floor(rackD / 2.6));
            for (let p = 0; p < numPallets; p++) {
              const pz = -rackD * 0.42 + (rackD * 0.84 * p) / (numPallets - 1);
              const isRoll = (a + t + p) % 2 === 0;
              const cargo = isRoll
                ? new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, rackW * 0.72, 10), mats.filmRollWhite)
                : new THREE.Mesh(new THREE.BoxGeometry(rackW * 0.76, 0.85, 1.3), mats.cartonBox);
              if (isRoll) cargo.rotation.z = Math.PI / 2;
              cargo.position.set(rx, ty + 0.52, pz);
              group.add(cargo);
            }
          }
        }
      }

      // --------------------------------------------------------------------
      // TYPE I: LOADING DOCK & 3 SEMI-TRAILER TRUCKS (ตรงตามสัญลักษณ์รถในผัง!)
      // --------------------------------------------------------------------
      else if (item.type === "loading_dock") {
        // 3 Delivery Trucks parked at the loading bay (px: 1095..1162, py: 845..888)
        [-10.5, -8.2, -5.9].forEach(tx => {
          const truck = new THREE.Group();
          // White trailer container
          const trailer = new THREE.Mesh(
            new THREE.BoxGeometry(1.75, 2.5, 4.2),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
          );
          trailer.position.set(tx, 1.55, r.d * 0.25);
          addEdges(trailer, 0x94a3b8, 0.7);
          // Blue cab
          const cab = new THREE.Mesh(
            new THREE.BoxGeometry(1.65, 1.9, 1.4),
            new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 })
          );
          cab.position.set(tx, 1.25, r.d * 0.25 + 2.9);
          addEdges(cab, 0x1e40af, 0.7);
          truck.add(trailer, cab);
          group.add(truck);
        });
      }

      // --------------------------------------------------------------------
      // TYPE J: OFFICES, LABS, WAREHOUSE ROOMS, PUMP ROOM & GUARDHOUSE
      // --------------------------------------------------------------------
      else {
        const boxH = Math.min(H, 4.5);
        const roomMesh = new THREE.Mesh(
          new THREE.BoxGeometry(r.w * 0.94, boxH, r.d * 0.94),
          item.type === "hq_office" ? mats.officeGlass : mats.wallPartition
        );
        roomMesh.position.y = boxH * 0.5;
        addEdges(roomMesh, cat.color, 0.65);
        group.add(roomMesh);

        // Roof / Header Accent Strip
        const header = new THREE.Mesh(
          new THREE.BoxGeometry(r.w * 0.95, 0.26, r.d * 0.95),
          accentMat
        );
        header.position.y = boxH + 0.13;
        group.add(header);
      }

      group.add(inner);
      itemsGroup.add(group);
      state.itemMeshes.set(item.id, group);
    });

    scene.add(itemsGroup);
    return itemsGroup;
  }

  // ==========================================================================
  // 4. BUILD ANIMATED 3D PROCESS FLOW CONDUITS (เส้นสายการผลิต 3 มิติ)
  // ==========================================================================
  function buildProcessFlows(scene, state) {
    const flowGroup = new THREE.Group();
    flowGroup.name = "ProcessFlows";
    state.flowParticles = [];

    DATA.processFlows.forEach(flow => {
      const pts3D = flow.points.map(p => {
        const w = pt(p[0], p[1]);
        return new THREE.Vector3(w.x, 1.35, w.z);
      });

      const curve = new THREE.CatmullRomCurve3(pts3D, false, "catmullrom", 0.12);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.22, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: flow.color,
        emissive: flow.color,
        emissiveIntensity: 0.25,
        roughness: 0.3,
        transparent: true,
        opacity: 0.78
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      flowGroup.add(tubeMesh);

      // Animated glowing pulse spheres traveling along each production flow path
      for (let i = 0; i < 4; i++) {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(0.72, 12, 12),
          new THREE.MeshBasicMaterial({ color: flow.color, transparent: true, opacity: 0.55 })
        );
        sphere.add(halo);
        flowGroup.add(sphere);
        state.flowParticles.push({
          mesh: sphere,
          curve,
          t: i / 4,
          speed: 0.0018
        });
      }
    });

    scene.add(flowGroup);
    state.flowGroup = flowGroup;
    return flowGroup;
  }

  return {
    pt,
    rect,
    createMaterials,
    buildSiteAndFloors,
    buildCutawayArchitecture,
    buildMachinesAndZones,
    buildProcessFlows
  };
})();
