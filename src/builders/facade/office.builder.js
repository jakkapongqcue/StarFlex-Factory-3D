// ============================================================================
// Module: src/builders/facade/office.builder.js
// Building 2 Front 2-Story Office, Curved Arch Roof, Starflex Emblem,
// and Hipped-Roof Entrance Porte-Cochere with Stone Columns & Spirit House.
// References: References/Front_View_3_Main_Office_Arch_Roof.jpg & Front_View_1
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Office = {
  build(fMats) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;
    const { createHippedRoofGeometry, createStarflexLogoSignTexture } = window.Starflex3D.Builders.Facade.Common;
    const group = new THREE.Group();
    group.name = "FacadeOfficeAndPorteCochere";

    // ========================================================================
    // 1. 2-STORY GREY-BLUE OFFICE WALL BODY WITH WHITE GRID FRAMING
    // ========================================================================
    const offR = rect([674, 1098, 1018, 1190]);
    const offH = 7.6;

    const offBody = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w, offH, offR.d),
      fMats.greyBlueWall
    );
    offBody.position.set(offR.x, offH * 0.5, offR.z);
    offBody.castShadow = true;
    offBody.receiveShadow = true;
    addEdges(offBody, 0xffffff, 0.85);
    group.add(offBody);

    // White horizontal mid-floor band & top cornice band
    [offH * 0.5, offH - 0.25].forEach(by => {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(offR.w + 0.18, 0.32, offR.d + 0.18),
        fMats.whiteTrim
      );
      band.position.set(offR.x, by, offR.z);
      group.add(band);
    });

    // White vertical pilasters & vertical window slots across the South facade
    const numBays = 9;
    for (let i = 0; i <= numBays; i++) {
      const bx = offR.x1 + (offR.w * i) / numBays;
      const pilaster = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, offH, 0.22),
        fMats.whiteTrim
      );
      pilaster.position.set(bx, offH * 0.5, offR.z2 + 0.05);
      group.add(pilaster);

      if (i < numBays) {
        if (i === 4) {
          // Main Ground Floor Glass Entrance Doors at center bay
          const bayW = offR.w / numBays;
          const doorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(bayW * 0.88, 2.8, 0.14),
            fMats.whiteTrim
          );
          doorFrame.position.set(bx + bayW * 0.5, 1.4, offR.z2 + 0.06);
          const doorGlass = new THREE.Mesh(
            new THREE.BoxGeometry(bayW * 0.78, 2.5, 0.16),
            fMats.reflectiveGlass
          );
          doorGlass.position.set(bx + bayW * 0.5, 1.4, offR.z2 + 0.07);
          addEdges(doorGlass, 0x0284c7, 0.85);
          group.add(doorFrame, doorGlass);

          // 2nd floor window above entrance
          const win2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 2.2, 0.15),
            fMats.reflectiveGlass
          );
          win2.position.set(bx + bayW * 0.5, 5.6, offR.z2 + 0.06);
          addEdges(win2, 0xffffff, 0.9);
          group.add(win2);
        } else {
          // 1st & 2nd floor vertical windows
          [1.9, 5.6].forEach(wy => {
            const win = new THREE.Mesh(
              new THREE.BoxGeometry(0.65, 2.2, 0.15),
              fMats.reflectiveGlass
            );
            win.position.set(bx + (offR.w / numBays) * 0.5, wy, offR.z2 + 0.06);
            addEdges(win, 0xffffff, 0.9);
            group.add(win);
          });
        }
      }
    }

    // ========================================================================
    // 2. CURVED BARREL-ARCH ROOF OVER OFFICE BUILDING (Images 1 & 3)
    // ========================================================================
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
      group.add(archRoofSeg);

      // Curved grey tympanum front wall fill under the arch
      const avgY = (y1 + y2) * 0.5;
      if (avgY > offH + 0.1) {
        const tymp = new THREE.Mesh(
          new THREE.BoxGeometry(Math.abs(x2 - x1) + 0.05, avgY - offH, 0.25),
          fMats.greyBlueWall
        );
        tymp.position.set((x1 + x2) * 0.5, offH + (avgY - offH) * 0.5, offR.z2 - 0.1);
        group.add(tymp);
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
    group.add(gableLogo);

    // ========================================================================
    // 3. HIPPED-ROOF ENTRANCE PORTE-COCHERE (ซุ้มทางเข้าด้านหน้าสำนักงานใหญ่)
    // ========================================================================
    const porchR = rect([806, 1190, 886, 1255]);
    const porchH = 3.9;

    // Raised concrete landing & wide 3-tread entrance stairs
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

    // 2 Sturdy Stone-Clad Front Columns
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

      // Cornice capital & base trim
      [0.2, porchH - 0.15].forEach(cy => {
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(pillarW + 0.14, 0.18, pillarW + 0.14),
          fMats.whiteTrim
        );
        cap.position.set(porchR.x + dx, cy, porchR.z2 - 0.35);
        group.add(cap);
      });

      // Flanking shrub planters
      const planter = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.35, 1.2),
        fMats.charcoalFascia
      );
      planter.position.set(porchR.x + dx + (dx > 0 ? 0.85 : -0.85), 0.175, porchR.z2 - 0.35);
      const shrub = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10), fMats.hedgeGreen);
      shrub.position.set(porchR.x + dx + (dx > 0 ? 0.85 : -0.85), 0.65, porchR.z2 - 0.35);
      group.add(planter, shrub);
    });

    // Dark-charcoal horizontal arch beam
    const frontBeam = new THREE.Mesh(
      new THREE.BoxGeometry(porchR.w * 0.94, 0.48, 0.42),
      fMats.charcoalFascia
    );
    frontBeam.position.set(porchR.x, porchH - 0.24, porchR.z2 - 0.35);
    addEdges(frontBeam, 0x1e293b, 0.8);
    group.add(frontBeam);

    // Side tie-beams connecting pillars to office wall
    [-porchR.w * 0.42, porchR.w * 0.42].forEach(dx => {
      const sideBeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.48, porchR.d - 0.4),
        fMats.charcoalFascia
      );
      sideBeam.position.set(porchR.x + dx, porchH - 0.24, (porchR.z1 + porchR.z2) * 0.5);
      addEdges(sideBeam, 0x1e293b, 0.8);
      group.add(sideBeam);
    });

    // White cornice fascia base trim
    const porchBase = new THREE.Mesh(
      new THREE.BoxGeometry(porchR.w + 0.9, 0.32, porchR.d + 0.7),
      fMats.whiteTrim
    );
    porchBase.position.set(porchR.x, porchH + 0.16, porchR.z);
    addEdges(porchBase, 0x64748b, 0.7);
    group.add(porchBase);

    // Rectangular Hipped Roof
    const hipRoofGeo = createHippedRoofGeometry(porchR.w + 0.86, porchR.d + 0.66, 1.8);
    const porchHip = new THREE.Mesh(hipRoofGeo, fMats.hipRoofTile);
    porchHip.position.set(porchR.x, porchH + 0.32, porchR.z);
    addEdges(porchHip, 0xffffff, 0.75);
    group.add(porchHip);

    // Golden Spirit House (ศาลพระภูมิสีทอง) on the right of entrance (Image 1 & 3)
    const shrinePos = pt(965, 1225);
    const shrinePedestal = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.4), fMats.whiteTrim);
    shrinePedestal.position.set(shrinePos.x, 0.45, shrinePos.z);
    const shrineTop = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.5, 4), fMats.goldLamp);
    shrineTop.position.set(shrinePos.x, 1.65, shrinePos.z);
    shrineTop.rotation.y = Math.PI / 4;
    group.add(shrinePedestal, shrineTop);

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
