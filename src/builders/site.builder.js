// ============================================================================
// Module: src/builders/site.builder.js
// Builds the clean architectural studio grid, dashed site boundary, roads,
// raised concrete floor slabs, 1:1 blueprint/satellite overlays, blue ramps,
// green entrance canopies, and landscaping trees.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Site = {
  build(scene, mats, state) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;
    const meta = window.Starflex3D.Config.meta;

    const siteGroup = new THREE.Group();
    siteGroup.name = "SiteAndFloors";

    // 1. Infinite-style clean white studio grid (matching Reference Image 4)
    const gridHelper = new THREE.GridHelper(420, 84, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.set(10, -0.46, 5);
    siteGroup.add(gridHelper);

    // 2. Dashed Property Boundary Line
    const boundaryPts = [
      pt(30, 45),
      pt(2080, 45),
      pt(2080, 1575),
      pt(30, 1575),
      pt(30, 45)
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

    // 3. Internal Roads, Truck Courtyard & Gate Approach Slab
    const courtyardRects = [
      [1062, 815, 1410, 1430], // Central Truck Loading Courtyard
      [185, 1098, 674, 1170],  // West Front Driveway along Hall 1 (parallel 7.2m corridor to py = 1170)
      [1040, 1150, 1680, 1565],// Front East internal driveway & Parking
      [590, 1170, 1040, 1340], // Office HQ front apron connecting west driveway to central courtyard
      [1018, 1098, 1062, 1150],// Office Nook Apron connecting to driveway
      [1000, 1430, 1455, 1575],// Main gate In/Out entrance & exit road approach
      [200, 45, 1062, 247]     // North Rear Service Yard & Asphalt Road behind Hall 1 & Hall 2
    ];
    courtyardRects.forEach(b => {
      const r = rect(b);
      const geo = new THREE.BoxGeometry(r.w, 0.12, r.d);
      const mesh = new THREE.Mesh(geo, mats.road);
      mesh.position.set(r.x, -0.38, r.z);
      mesh.receiveShadow = true;
      siteGroup.add(mesh);
    });

    // 4. Raised Architectural Concrete Plinths for Each Building Section
    // Main Factory Interior Floor is elevated at +1.25m (level with loading dock!)
    const dockElevH = 1.25;

    const factoryInteriorSections = [
      [200, 247, 1062, 1098],  // Hall 1 & Hall 2 main factory slab
      [1062, 247, 1498, 815],  // Hall 3 High-Bay Warehouse interior floor (Dock at 815+ handled by LoadingDock builder)
      [1498, 247, 1895, 1148], // Hall 4 East Plant (Blow Film, Printing, Lamination)
      [1395, 765, 1498, 1230], // Hall 4 West Ramp Corridor
      [1395, 1148, 1705, 1235],// Hall 4 South Shipping Bay
      [1895, 490, 1950, 545],  // East MDB Room
      [1895, 885, 1968, 1055]  // East Oven Room
    ];

    factoryInteriorSections.forEach(b => {
      const r = rect(b);
      const slabGeo = new THREE.BoxGeometry(r.w, dockElevH, r.d);
      const slabMesh = new THREE.Mesh(slabGeo, mats.slab);
      slabMesh.position.set(r.x, dockElevH * 0.5, r.z);
      slabMesh.receiveShadow = true;
      addEdges(slabMesh, 0x94a3b8, 0.7);
      siteGroup.add(slabMesh);
    });

    const exteriorAuxSections = [
      { bounds: [1940, 78, 2038, 198],    h: 0.35, y: 0.175 }, // NE Pump Room
      { bounds: [240, 80, 540, 190],      h: 0.30, y: 0.15 }   // North Chemical Storage Building Plinth
    ];

    exteriorAuxSections.forEach(sec => {
      const r = rect(sec.bounds);
      const slabGeo = new THREE.BoxGeometry(r.w, sec.h, r.d);
      const slabMesh = new THREE.Mesh(slabGeo, mats.slab);
      slabMesh.position.set(r.x, sec.y, r.z);
      slabMesh.receiveShadow = true;
      addEdges(slabMesh, 0xcbd5e1, 0.7);
      siteGroup.add(slabMesh);
    });

    // 5. Exact 1:1 Blueprint Texture Overlay Plane & Satellite Ground Plane
    const bpW = meta.blueprintWidth * meta.scale;
    const bpD = meta.blueprintHeight * meta.scale;
    const bpCenterX = (meta.blueprintWidth * 0.5 - meta.centerX) * meta.scale;
    const bpCenterZ = (meta.blueprintHeight * 0.5 - meta.centerY) * meta.scale;

    const blueprintPlaneGeo = new THREE.PlaneGeometry(bpW, bpD);
    const blueprintPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const blueprintPlane = new THREE.Mesh(blueprintPlaneGeo, blueprintPlaneMat);
    blueprintPlane.rotation.x = -Math.PI / 2;
    blueprintPlane.position.set(bpCenterX, -0.34, bpCenterZ);
    blueprintPlane.visible = false;
    siteGroup.add(blueprintPlane);
    state.blueprintPlane = blueprintPlane;

    // Load embedded base64 textures from window.STARFLEX_TEXTURES
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
    }

    // 6. 5 Blue Forklift Ramps ("ทางขึ้นลง" - Sloped connection from ground to elevated factory floor +1.25m)
    const blueRamps = [
      { bounds: [1102, 665, 1158, 712], dir: "N" }, // Ramp 1 (Center)
      { bounds: [1445, 755, 1492, 838], dir: "S" }, // Ramp 2 (East Hall N)
      { bounds: [1425, 948, 1470, 1005], dir: "S" },// Ramp 3 (East Hall M)
      { bounds: [1470, 980, 1530, 1055], dir: "S" },// Ramp 4 (East Hall S1)
      { bounds: [1470, 1068, 1530, 1140], dir: "S" }// Ramp 5 (East Hall S2)
    ];
    blueRamps.forEach(rampDef => {
      const r = rect(rampDef.bounds);
      const isLongZ = r.d >= r.w;
      const run = isLongZ ? r.d : r.w;
      const width = isLongZ ? r.w : r.d;

      const shape = new THREE.Shape();
      if (rampDef.dir === "N") {
        // Slopes up toward North (-Z)
        shape.moveTo(0, 0);
        shape.lineTo(0, dockElevH);
        shape.lineTo(run, 0);
      } else {
        // Slopes up toward South (+Z)
        shape.moveTo(0, 0);
        shape.lineTo(run, dockElevH);
        shape.lineTo(run, 0);
      }
      shape.closePath();

      const extrudeGeo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
      if (isLongZ) {
        extrudeGeo.rotateY(-Math.PI / 2);
      }
      const rampMesh = new THREE.Mesh(extrudeGeo, mats.rampBlue);
      rampMesh.position.set(
        isLongZ ? r.x + width * 0.5 : r.x - run * 0.5,
        0,
        isLongZ ? r.z - run * 0.5 : r.z - width * 0.5
      );
      addEdges(rampMesh, 0x1d4ed8, 0.8);
      siteGroup.add(rampMesh);
    });

    // 7. Green Shipping Canopies (SE Shipping bays)
    const greenCanopies = [
      [1440, 1230, 1492, 1290],// SE Shipping Canopy Left
      [1550, 1230, 1602, 1290] // SE Shipping Canopy Right
    ];
    greenCanopies.forEach(b => {
      const r = rect(b);
      const canGroup = new THREE.Group();
      const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.25, r.d), mats.canopyGreen);
      roofMesh.position.set(r.x, 3.6, r.z);
      addEdges(roofMesh, 0x047857, 0.8);
      canGroup.add(roofMesh);

      [-r.w * 0.42, r.w * 0.42].forEach(dx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8), mats.steelColumn);
        col.position.set(r.x + dx, 1.8, r.z + r.d * 0.4);
        canGroup.add(col);
      });
      siteGroup.add(canGroup);
    });



    scene.add(siteGroup);
    return siteGroup;
  }
};
