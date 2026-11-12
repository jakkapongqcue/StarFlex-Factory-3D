// ============================================================================
// Module: src/builders/facade/guardhouse.builder.js
// Perimeter Fences, Globe Lamps, Blue "STARFLEX" Sign Wall, In/Out Sliding Gates,
// Blue "ttb" ATM Booth & Hipped-Roof Security Guardhouse with Red/White Curb.
// References: References/Front_View_1_Gate_and_Main_Office.jpg & Front_View_2
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Guardhouse = {
  build(fMats) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;
    const { createHippedRoofGeometry, createStarflexLogoSignTexture } = window.Starflex3D.Builders.Facade.Common;
    const group = new THREE.Group();
    group.name = "FacadeGuardhouseAndGates";

    // 1. Perimeter Fence Runs with Gold Globe Lamps
    function buildFenceRun(px1, py1, px2, py2, stepPx = 55) {
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      // Lower concrete wall + upper rail
      const lowWall = new THREE.Mesh(new THREE.BoxGeometry(len, 0.95, 0.22), fMats.greyBlueWall);
      lowWall.position.set((p1.x + p2.x) * 0.5, 0.48, (p1.z + p2.z) * 0.5);
      lowWall.rotation.y = -angle;
      addEdges(lowWall, 0xffffff, 0.7);
      group.add(lowWall);

      const topRail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.14), fMats.whiteTrim);
      topRail.position.set((p1.x + p2.x) * 0.5, 1.85, (p1.z + p2.z) * 0.5);
      topRail.rotation.y = -angle;
      group.add(topRail);

      // Posts + Gold Globe Lamps
      const distPx = Math.hypot(px2 - px1, py2 - py1);
      const numPosts = Math.max(2, Math.round(distPx / stepPx));
      for (let i = 0; i <= numPosts; i++) {
        const t = i / numPosts;
        const fx = p1.x + dx * t;
        const fz = p1.z + dz * t;

        const post = new THREE.Mesh(new THREE.BoxGeometry(0.36, 2.05, 0.36), fMats.whiteTrim);
        post.position.set(fx, 1.02, fz);
        group.add(post);

        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), fMats.goldLamp);
        globe.position.set(fx, 2.2, fz);
        group.add(globe);
      }
    }

    // West Front Fence (px: 185..820, py = 1560) & West Return Fence (px = 185, py: 1098..1560)
    buildFenceRun(185, 1560, 820, 1560, 52);
    buildFenceRun(185, 1098, 185, 1560, 52);

    // East Front Fence (px: 1450..2035, py = 1560) & East Return Fence (px = 2035, py: 1080..1560)
    buildFenceRun(1450, 1560, 2035, 1560, 52);
    buildFenceRun(2035, 1560, 2035, 1080, 52);

    // 2. Royal-Blue "STARFLEX PUBLIC COMPANY LIMITED" Sign Wall
    // Shifted east directly in front of the 3 Flagpoles (px: 820..1000)
    const signR = rect([820, 1552, 1000, 1568]);
    const signBase = new THREE.Mesh(new THREE.BoxGeometry(signR.w, 0.65, 0.48), fMats.stonePillar);
    signBase.position.set(signR.x, 0.32, signR.z);
    const signWall = new THREE.Mesh(new THREE.BoxGeometry(signR.w, 1.6, 0.38), fMats.blueSign);
    signWall.position.set(signR.x, 1.45, signR.z);
    addEdges(signWall, 0xffffff, 0.85);

    const mainSignTex = createStarflexLogoSignTexture({
      width: 2048,
      height: 256,
      bgHex: "#143a75",
      showSubtext: true,
      whiteLetters: true,
      border: true
    });
    const signFace = new THREE.Mesh(
      new THREE.PlaneGeometry(signR.w * 0.94, 1.35),
      new THREE.MeshBasicMaterial({ map: mainSignTex })
    );
    signFace.position.set(signR.x, 1.45, signR.z + 0.21);
    group.add(signBase, signWall, signFace);

    // 3. Main Entrance "In" Sliding Gate (px: 1000..1145, py: 1560)
    const gateInR = rect([1000, 1558, 1145, 1564]);
    const gateInMesh = new THREE.Mesh(
      new THREE.BoxGeometry(gateInR.w, 1.75, 0.16),
      fMats.whiteTrim
    );
    gateInMesh.position.set(gateInR.x, 0.9, gateInR.z);
    addEdges(gateInMesh, 0x64748b, 0.8);
    group.add(gateInMesh);

    // 4. Blue "ttb" ATM Booth at Main Gate Entrance
    const atmR = rect([1140, 1546, 1165, 1572]);
    const atmBody = new THREE.Mesh(new THREE.BoxGeometry(atmR.w, 2.5, atmR.d), fMats.blueBrand);
    atmBody.position.set(atmR.x, 1.25, atmR.z);
    addEdges(atmBody, 0xffffff, 0.8);
    const atmHeader = new THREE.Mesh(
      new THREE.BoxGeometry(atmR.w + 0.16, 0.42, atmR.d + 0.16),
      fMats.whiteTrim
    );
    atmHeader.position.set(atmR.x, 2.55, atmR.z);
    const atmAccent = new THREE.Mesh(
      new THREE.BoxGeometry(atmR.w * 0.5, 0.22, 0.08),
      fMats.ttbOrange
    );
    atmAccent.position.set(atmR.x, 2.55, atmR.z + atmR.d * 0.55);
    group.add(atmBody, atmHeader, atmAccent);

    // 5. Hipped-Roof Security Guardhouse Pavilion (px: 1165..1295, py: 1445..1560)
    const ghR = rect([1165, 1445, 1295, 1560]);
    const ghWallH = 3.1;
    const ghBody = new THREE.Mesh(
      new THREE.BoxGeometry(ghR.w, ghWallH, ghR.d),
      fMats.whiteTrim
    );
    ghBody.position.set(ghR.x, ghWallH * 0.5, ghR.z);
    addEdges(ghBody, 0x64748b, 0.7);

    // Inspection Window on West face
    const ghWinWest = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, ghR.d * 0.65), fMats.darkWindow);
    ghWinWest.position.set(ghR.x1 + 0.06, 1.6, ghR.z);
    addEdges(ghWinWest, 0xffffff, 0.9);
    group.add(ghWinWest);

    // Rectangular Hipped Roof
    const ghRoofGeo = createHippedRoofGeometry(ghR.w + 1.2, ghR.d + 1.2, 2.2);
    const ghRoof = new THREE.Mesh(ghRoofGeo, fMats.guardRoofTile);
    ghRoof.position.set(ghR.x, ghWallH, ghR.z);
    addEdges(ghRoof, 0x475569, 0.7);

    // Driveway Inspection Awning
    const ghAwning = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.18, ghR.d * 0.95),
      fMats.guardRoofTile
    );
    ghAwning.position.set(ghR.x1 - 1.5, 2.65, ghR.z);
    ghAwning.rotation.z = 0.18;
    addEdges(ghAwning, 0x475569, 0.6);

    // Red-and-White Painted Curb around Guardhouse Island
    const curbW = ghR.w + 3.8;
    const curbD = ghR.d + 1.2;
    const curbPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(curbW, 0.22, curbD),
      fMats.whiteTrim
    );
    curbPlinth.position.set(ghR.x - 1.4, 0.11, ghR.z);
    addEdges(curbPlinth, 0xdc2626, 0.85);

    // Red and White Curb Stripes
    const curbSegs = 10;
    for (let c = 0; c < curbSegs; c++) {
      const cz = ghR.z - curbD * 0.5 + (curbD * (c + 0.5)) / curbSegs;
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.24, (curbD / curbSegs) * 0.92),
        c % 2 === 0 ? new THREE.MeshLambertMaterial({ color: 0xdc2626 }) : fMats.whiteTrim
      );
      stripe.position.set(ghR.x - 1.4 - curbW * 0.5, 0.12, cz);
      group.add(stripe);
    }

    group.add(ghBody, ghRoof, ghAwning, curbPlinth);

    // 6. Main Exit "Out" Sliding Gate (px: 1295..1450, py: 1560)
    const gateOutR = rect([1295, 1558, 1450, 1564]);
    const gateOutMesh = new THREE.Mesh(
      new THREE.BoxGeometry(gateOutR.w, 1.75, 0.16),
      fMats.whiteTrim
    );
    gateOutMesh.position.set(gateOutR.x, 0.9, gateOutR.z);
    addEdges(gateOutMesh, 0x64748b, 0.8);
    group.add(gateOutMesh);

    return group;
  }
};
