// ============================================================================
// Module: src/builders/facade/dock-facade.builder.js
// Loading Dock Courtyard Facade Architecture:
// 7-Bay Clerestory Facade, Rain Gutters, Downspouts, Cantilever Canopy,
// Hall 2 East Wall Exhaust Hoods & AC Row, Hall 4 AC Condenser Matrix.
// References: References/Loading_Dock_1_StreetView.jpg & Loading_Dock_2_CloseUp.jpg
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.DockFacade = {
  build(fMats) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;
    const { createACUnit } = window.Starflex3D.Builders.Facade.Common;
    const dockFacadeGroup = new THREE.Group();
    dockFacadeGroup.name = "LoadingDockCourtyardArchitecture";

    const dMats = {
      upperWall: new THREE.MeshStandardMaterial({ color: 0xdbe2ea, roughness: 0.55, metalness: 0.08 }),
      greenGlass: new THREE.MeshPhysicalMaterial({
        color: 0x34d399,
        roughness: 0.18,
        metalness: 0.2,
        transparent: true,
        opacity: 0.78
      }),
      darkWindow: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.4 }),
      acBody: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45, metalness: 0.15 }),
      acGrille: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.3 }),
      exhaustHood: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, metalness: 0.4 }),
      yellowPaint: new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
      orangeCone: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
    };

    // 1. 7-Bay Loading Dock Upper Clerestory Facade, Straight Gutter Eave & 8 Curved Downspouts
    const dockSpanR = rect([1062, 814, 1395, 818]);
    const dockEaveH = 8.8;
    const dockCanopyH = 4.55;
    const numDockBays = 7;
    const bayW = dockSpanR.w / numDockBays;

    // Upper exterior cladding panel
    const upperCladding = new THREE.Mesh(
      new THREE.BoxGeometry(dockSpanR.w, dockEaveH - dockCanopyH, 0.24),
      dMats.upperWall
    );
    upperCladding.position.set(dockSpanR.x, (dockEaveH + dockCanopyH) * 0.5, dockSpanR.z + 0.08);
    addEdges(upperCladding, 0x94a3b8, 0.55);
    dockFacadeGroup.add(upperCladding);

    // Straight Horizontal Roof Eave Overhang & Rain Gutter
    const eaveOverhang = new THREE.Mesh(
      new THREE.BoxGeometry(dockSpanR.w + 0.6, 0.34, 1.15),
      fMats.whiteTrim
    );
    eaveOverhang.position.set(dockSpanR.x, dockEaveH - 0.05, dockSpanR.z + 0.45);
    addEdges(eaveOverhang, 0x64748b, 0.7);
    dockFacadeGroup.add(eaveOverhang);

    // 8 White Structural Columns + Curved Downspouts
    for (let i = 0; i <= numDockBays; i++) {
      const cx = dockSpanR.x1 + i * bayW;
      const cz = dockSpanR.z + 0.22;

      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, dockEaveH - dockCanopyH, 8),
        fMats.whiteTrim
      );
      pipe.position.set(cx, (dockEaveH + dockCanopyH) * 0.5, cz + 0.08);
      dockFacadeGroup.add(pipe);

      const elbow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.85, 8),
        fMats.whiteTrim
      );
      elbow.position.set(cx, dockEaveH - 0.35, cz + 0.38);
      elbow.rotation.x = 0.78;
      dockFacadeGroup.add(elbow);

      // Per-bay upper windows & AC units
      if (i < numDockBays) {
        const bx = cx + bayW * 0.5;
        const wz = cz + 0.03;

        if (i === 0) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.15, 0.12), dMats.darkWindow);
          win.position.set(bx, 6.35, wz);
          addEdges(win, 0xffffff, 0.9);
          dockFacadeGroup.add(win);
        } else if (i === 1) {
          [-0.75, 0.55].forEach(dx => {
            const slotWin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.45, 0.12), dMats.darkWindow);
            slotWin.position.set(bx + dx, 6.65, wz);
            addEdges(slotWin, 0xffffff, 0.9);
            dockFacadeGroup.add(slotWin);
          });
          dockFacadeGroup.add(createACUnit(bx + 1.65, 6.75, wz + 0.2, 0, fMats));
          dockFacadeGroup.add(createACUnit(bx + 1.65, 5.85, wz + 0.2, 0, fMats));
        } else {
          const frame = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.22, 0.1), fMats.whiteTrim);
          frame.position.set(bx - 0.15, 6.25, wz);
          const gWin = new THREE.Mesh(new THREE.BoxGeometry(2.38, 1.06, 0.14), dMats.greenGlass);
          gWin.position.set(bx - 0.15, 6.25, wz + 0.02);
          addEdges(gWin, 0xffffff, 0.95);
          dockFacadeGroup.add(frame, gWin);

          [-0.4, 0.4].forEach(mx => {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.1, 0.16), fMats.whiteTrim);
            mullion.position.set(bx - 0.15 + mx, 6.25, wz + 0.03);
            dockFacadeGroup.add(mullion);
          });

          dockFacadeGroup.add(createACUnit(bx + 1.55, 5.95, wz + 0.2, 0, fMats));
          if (i === 6) {
            dockFacadeGroup.add(createACUnit(bx + 1.55, 6.75, wz + 0.2, 0, fMats));
          }
        }
      }
    }

    // 2. Full-Width Cantilevered Steel Loading Dock Canopy (px: 1062..1398, py: 815..874)
    const canopyR = rect([1062, 815, 1398, 874]);
    const canopyDeck = new THREE.Mesh(
      new THREE.BoxGeometry(canopyR.w, 0.22, canopyR.d),
      fMats.charcoalFascia
    );
    canopyDeck.position.set(canopyR.x, dockCanopyH, canopyR.z);
    canopyDeck.castShadow = true;
    addEdges(canopyDeck, 0x64748b, 0.7);
    dockFacadeGroup.add(canopyDeck);

    for (let i = 0; i <= numDockBays; i++) {
      const rx = dockSpanR.x1 + i * bayW;
      const rafter = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.32, canopyR.d * 0.95),
        fMats.charcoalFascia
      );
      rafter.position.set(rx, dockCanopyH - 0.2, canopyR.z);
      dockFacadeGroup.add(rafter);
    }

    // 3. Left Courtyard Wing (Hall 2 East Wall)
    const leftWallR = rect([1060, 815, 1065, 1100]);
    const leftUpperEave = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.28, leftWallR.d),
      fMats.guardRoofTile
    );
    leftUpperEave.position.set(leftWallR.x + 0.55, 10.35, leftWallR.z);
    leftUpperEave.rotation.z = -0.15;
    dockFacadeGroup.add(leftUpperEave);

    // 4 Black Angled Industrial Exhaust Fan Hoods
    for (let py = 855; py <= 1035; py += 58) {
      const hp = pt(1063, py);
      const hood = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 1.25), dMats.exhaustHood);
      hood.position.set(hp.x + 0.45, 7.8, hp.z);
      hood.rotation.z = -0.25;
      addEdges(hood, 0x52525b, 0.7);
      dockFacadeGroup.add(hood);
    }

    // Row of 8 AC Condenser Units along Left Courtyard Wall
    for (let py = 845; py <= 1080; py += 32) {
      const ap = pt(1063, py);
      dockFacadeGroup.add(createACUnit(ap.x + 0.32, 4.85, ap.z, Math.PI / 2, fMats));
    }

    // 4. Right Courtyard Wing (Hall 4 West Wall: Green Windows & 18-Unit AC Condenser Matrix)
    const rightWallX = pt(1395, 900).x;
    [845, 920, 995].forEach(py => {
      const wp = pt(1395, py);
      const rWin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 2.4), dMats.greenGlass);
      rWin.position.set(rightWallX - 0.18, 7.6, wp.z);
      addEdges(rWin, 0xffffff, 0.9);
      dockFacadeGroup.add(rWin);
    });

    for (let col = 0; col < 6; col++) {
      const py = 840 + col * 42;
      const ap = pt(1395, py);
      const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 6), fMats.whiteTrim);
      conduit.position.set(rightWallX - 0.22, 6.2, ap.z);
      dockFacadeGroup.add(conduit);

      [4.9, 5.8, 6.7].forEach(ay => {
        dockFacadeGroup.add(createACUnit(rightWallX - 0.32, ay, ap.z, -Math.PI / 2, fMats));
      });
    }

    [1090, 1125].forEach(py => {
      const ap = pt(1395, py);
      dockFacadeGroup.add(createACUnit(rightWallX - 0.32, 6.3, ap.z, -Math.PI / 2, fMats));
    });

    // 5. Courtyard Yellow Dashed Truck Guidance Lines
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let i = 0; i < 7; i++) {
      const cz = pt(1228, 885 + i * 28).z;
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 1.8), dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(pt(1228, 0).x, 0.02, cz);
      dockFacadeGroup.add(dash);
    }

    return dockFacadeGroup;
  }
};
