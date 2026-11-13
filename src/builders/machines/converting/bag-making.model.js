// ============================================================================
// Module: src/builders/machines/converting/bag-making.model.js
// Upgraded Procedural 3D Model for Stand-Up Pouch Bag Making Lines (BM 04–17):
// Ported & optimized from StarFlexERP3D (js/machines/bag.js) with shared
// geometry/material caching so all 14 lines render smoothly at 60 FPS:
//   1. Unwind Stand & 6x2 Festoon Tension Dancer Tower (Hygiene Jumbo Roll)
//   2. Integrated V-Plow Forming Assembly & Gusset Tucking Frame
//   3. Brushed Stainless Sealing Bed & 4 Reciprocating Heat-Sealing Stations
//   4. Rotary Edge-Trim Slitter, Scrap Hose & Guillotine Cutter Hood
//   5. Green PVC Outfeed Conveyor, Swing-Arm HMI, Spaced Hygiene Pouches,
//      Open Collection Carton & Inline Shrink-Wrapped Box Pallet
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.ConvertingModels = window.Starflex3D.Builders.ConvertingModels || {};

window.Starflex3D.Builders.ConvertingModels.BagMaking = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  let _cachedRes = null;
  let _animatedLines = [];

  function drawRoundedRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
    }
  }

  function safeEllipse(ctx, x, y, rx, ry, rot, a0, a1) {
    if (ctx.ellipse) {
      ctx.ellipse(x, y, rx, ry, rot, a0, a1);
    } else {
      ctx.arc(x, y, Math.max(rx, ry), a0, a1);
    }
  }

  function safeBezier(ctx, cp1x, cp1y, cp2x, cp2y, x, y) {
    if (ctx.bezierCurveTo) {
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  // ---------------------------------------------------------------------------
  // Procedural Canvas Textures (Hygiene Gravure Film Web, Pouch Front/Back, Label)
  // ---------------------------------------------------------------------------
  function createHygieneFilmTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const uw = 512;
    const h = 512;
    for (let u = 0; u < 2; u++) {
      const ox = u * uw;

      // Back panel (rich magenta)
      const gradBack = ctx.createLinearGradient(ox, 0, ox + 230, 0);
      gradBack.addColorStop(0, "#831843");
      gradBack.addColorStop(0.5, "#be185d");
      gradBack.addColorStop(1, "#9d174d");
      ctx.fillStyle = gradBack;
      ctx.fillRect(ox, 0, 230, h);

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      safeEllipse(ctx, ox + 115, 68, 55, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e3a8a";
      ctx.font = 'bold 16px "Segoe UI", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("ไฮยีน", ox + 115, 72);

      // White barcode block
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(ox + 25, 330, 180, 85);
      ctx.fillStyle = "#0f172a";
      for (let b = 0; b < 24; b++) {
        if (b % 2 === 0) ctx.fillRect(ox + 38 + b * 6, 342, 3, 48);
      }

      // Gold divider ribbon
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(ox + 226, 0, 16, h);

      // Front panel (sky blue -> pearlescent white -> soft pink)
      const gradFront = ctx.createLinearGradient(ox + 242, 0, ox + 512, h);
      gradFront.addColorStop(0, "#0284c7");
      gradFront.addColorStop(0.35, "#38bdf8");
      gradFront.addColorStop(0.65, "#f0f9ff");
      gradFront.addColorStop(1, "#fbcfe8");
      ctx.fillStyle = gradFront;
      ctx.fillRect(ox + 242, 0, 270, h);

      // Decorative white silky wave
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(ox + 242, 140);
      safeBezier(ctx, ox + 320, 180, ox + 420, 110, ox + 512, 190);
      ctx.lineTo(ox + 512, 380);
      safeBezier(ctx, ox + 420, 310, ox + 320, 390, ox + 242, 330);
      ctx.closePath();
      ctx.fill();

      // Bottom magenta wave
      ctx.fillStyle = "#be185d";
      ctx.beginPath();
      ctx.moveTo(ox + 242, 390);
      safeBezier(ctx, ox + 340, 430, ox + 440, 370, ox + 512, 440);
      ctx.lineTo(ox + 512, h);
      ctx.lineTo(ox + 242, h);
      ctx.closePath();
      ctx.fill();

      // Script title + floral accents
      ctx.fillStyle = "#172554";
      ctx.font = 'bold italic 42px Georgia, serif';
      ctx.textAlign = "center";
      ctx.fillText("Hygiene", ox + 382, 115);

      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(ox + 458, 205, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(ox + 355, 240, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#db2777";
      ctx.beginPath();
      ctx.arc(ox + 395, 258, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      safeEllipse(ctx, ox + 315, 240, 14, 7, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Registration eye-marks & CMYK blocks
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(ox + 14, 7, 10, 6);
      ctx.fillRect(ox + uw - 24, 7, 10, 6);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }

  function createHygienePouchTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradFront = ctx.createLinearGradient(0, 0, 256, 256);
    gradFront.addColorStop(0, "#0284c7");
    gradFront.addColorStop(0.35, "#38bdf8");
    gradFront.addColorStop(0.7, "#fdf2f8");
    gradFront.addColorStop(1, "#fbcfe8");
    ctx.fillStyle = gradFront;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(0, 60);
    safeBezier(ctx, 80, 80, 170, 45, 256, 90);
    ctx.lineTo(256, 185);
    safeBezier(ctx, 170, 150, 80, 195, 0, 160);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#be185d";
    ctx.beginPath();
    ctx.moveTo(0, 190);
    safeBezier(ctx, 85, 215, 175, 175, 256, 215);
    ctx.lineTo(256, 256);
    ctx.lineTo(0, 256);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#172554";
    ctx.font = 'bold italic 26px Georgia, serif';
    ctx.textAlign = "center";
    ctx.fillText("Hygiene", 128, 60);

    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(112, 128, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(208, 108, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    drawRoundedRect(ctx, 78, 218, 100, 22, 11);
    ctx.fill();
    ctx.fillStyle = "#be185d";
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText("REFILL • 500 ml", 128, 232);

    return new THREE.CanvasTexture(canvas);
  }

  function createHygienePouchBackTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#be185d";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(32, 160, 192, 54);
    ctx.fillStyle = "#0f172a";
    for (let i = 0; i < 20; i++) {
      if (i % 2 === 0) ctx.fillRect(48 + i * 8, 168, 4, 34);
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("Hygiene EXPERT CARE", 128, 42);

    return new THREE.CanvasTexture(canvas);
  }

  function createBoxLabelTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, 256, 36);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.fillText("STARFLEX · FG POUCH", 14, 24);
    ctx.fillStyle = "#0f172a";
    ctx.font = '12px monospace';
    ctx.fillText("PACKED: 500ml x 24", 14, 68);
    for (let i = 0; i < 22; i++) {
      if (i % 2 === 0) ctx.fillRect(16 + i * 9, 86, 5, 28);
    }

    return new THREE.CanvasTexture(canvas);
  }

  function getSharedResources(mats) {
    if (_cachedRes) return _cachedRes;

    const filmTex = createHygieneFilmTexture();
    const pouchFrontTex = createHygienePouchTexture();
    const pouchBackTex = createHygienePouchBackTexture();
    const boxLabelTex = createBoxLabelTexture();

    const m = {
      stainlessSteel: new THREE.MeshStandardMaterial({ color: 0xdbe2ea, roughness: 0.35, metalness: 0.35 }),
      brushedSteel: new THREE.MeshStandardMaterial({ color: 0xeef2f6, roughness: 0.28, metalness: 0.42 }),
      darkSteel: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.55, metalness: 0.35 }),
      frameBlack: new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.65, metalness: 0.25 }),
      chromeMat: mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.18 }),
      bronzeRollMat: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.55 }),
      brassMat: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35, metalness: 0.50 }),
      rubberBlack: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.80 }),
      conveyorGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 }),
      blueBaffleMat: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45 }),
      staticBarBlue: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.40 }),
      orangeSealMat: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.42 }),
      whiteArmMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }),
      yellowHoseMat: new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.55 }),
      redMat: new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
      greenBtnMat: new THREE.MeshBasicMaterial({ color: 0x16a34a }),
      kraftMat: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.85 }),
      kraftInnerMat: new THREE.MeshStandardMaterial({ color: 0x7c532e, roughness: 0.90 }),
      tapeMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 }),
      shrinkWrapMat: new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.26,
        roughness: 0.25
      }),
      woodMat: new THREE.MeshStandardMaterial({ color: 0xb48352, roughness: 0.85 }),
      printedWebMat: filmTex
        ? new THREE.MeshStandardMaterial({ map: filmTex, roughness: 0.32, metalness: 0.12, side: THREE.DoubleSide })
        : new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.32, side: THREE.DoubleSide }),
      silverFoilWebMat: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.25,
        metalness: 0.45,
        side: THREE.DoubleSide
      }),
      rollBodyMat: filmTex
        ? [
            new THREE.MeshStandardMaterial({ map: filmTex, roughness: 0.28, metalness: 0.12 }),
            new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.45 }),
            new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.45 })
          ]
        : new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.35 }),
      pouchBodyMats: [
        new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.28, metalness: 0.20 }),
        new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.28, metalness: 0.20 }),
        new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.28, metalness: 0.20 }),
        new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.28, metalness: 0.20 }),
        pouchFrontTex
          ? new THREE.MeshStandardMaterial({ map: pouchFrontTex, roughness: 0.28, metalness: 0.12 })
          : new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35 }),
        pouchBackTex
          ? new THREE.MeshStandardMaterial({ map: pouchBackTex, roughness: 0.28, metalness: 0.12 })
          : new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.35 })
      ],
      pouchGussetMat: new THREE.MeshStandardMaterial({ color: 0x9f1239, roughness: 0.45 }),
      pouchSealMat: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 }),
      boxLabelMat: boxLabelTex
        ? new THREE.MeshBasicMaterial({ map: boxLabelTex })
        : new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    };

    // Shared Pouch & Roll Geometries to minimize GPU memory across 14 machines
    const g = {
      pouchBody: new THREE.BoxGeometry(0.32, 0.44 * 0.86, 0.05),
      pouchGusset: new THREE.BoxGeometry(0.32 * 0.94, 0.44 * 0.12, 0.05 * 1.5),
      pouchSeal: new THREE.BoxGeometry(0.32 * 1.02, 0.44 * 0.12, 0.05 * 0.36),
      festoonRoll: new THREE.CylinderGeometry(0.036, 0.036, 1.54, 10),
      handwheelRim: new THREE.TorusGeometry(0.095, 0.018, 8, 16),
      springCoil: new THREE.CylinderGeometry(0.042, 0.042, 0.18, 10)
    };

    _cachedRes = { m, g };
    return _cachedRes;
  }

  function createPouchMesh(res) {
    const { m, g } = res;
    const pouchH = 0.44;
    const pouchGroup = new THREE.Group();

    const body = new THREE.Mesh(g.pouchBody, m.pouchBodyMats);
    body.position.y = (pouchH * 0.86) / 2;
    const gusset = new THREE.Mesh(g.pouchGusset, m.pouchGussetMat);
    gusset.position.y = (pouchH * 0.12) / 2;
    const topSeal = new THREE.Mesh(g.pouchSeal, m.pouchSealMat);
    topSeal.position.y = pouchH * 0.86 + (pouchH * 0.12) / 2;

    pouchGroup.add(body, gusset, topSeal);
    return pouchGroup;
  }

  function createFilmRollAssembly(radius, width, res) {
    const { m } = res;
    const grp = new THREE.Group();
    grp.rotation.x = Math.PI / 2;

    const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 20), m.rollBodyMat);
    const core = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.30, radius * 0.30, width + 0.36, 12),
      m.frameBlack
    );
    grp.add(body, core);

    [-width / 2 - 0.03, width / 2 + 0.03].forEach(yEnd => {
      const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.72, 0.04, 0.13), m.chromeMat);
      spoke1.position.y = yEnd;
      const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.04, radius * 1.72), m.brassMat);
      spoke2.position.y = yEnd;
      grp.add(spoke1, spoke2);
    });

    return grp;
  }

  function createOpenCollectionCarton(w, h, d, res) {
    const { m } = res;
    const grp = new THREE.Group();
    const t = 0.05;
    const btm = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), m.kraftMat);
    btm.position.y = t / 2;
    const fbGeo = new THREE.BoxGeometry(w, h - t, t);
    const fw = new THREE.Mesh(fbGeo, m.kraftMat);
    fw.position.set(0, t + (h - t) / 2, d / 2 - t / 2);
    const bw = new THREE.Mesh(fbGeo, m.kraftMat);
    bw.position.set(0, t + (h - t) / 2, -d / 2 + t / 2);
    const lrGeo = new THREE.BoxGeometry(t, h - t, d - t * 2);
    const lw = new THREE.Mesh(lrGeo, m.kraftMat);
    lw.position.set(-w / 2 + t / 2, t + (h - t) / 2, 0);
    const rw = new THREE.Mesh(lrGeo, m.kraftMat);
    rw.position.set(w / 2 - t / 2, t + (h - t) / 2, 0);
    const innerLiner = new THREE.Mesh(new THREE.BoxGeometry(w - t * 2, 0.006, d - t * 2), m.kraftInnerMat);
    innerLiner.position.y = t + 0.004;

    grp.add(btm, fw, bw, lw, rw, innerLiner);
    return grp;
  }

  function createCompactBoxPallet(res) {
    const { m } = res;
    const grp = new THREE.Group();
    const palW = 1.16;
    const palD = 1.16;

    const palletBase = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.14, palD), m.woodMat);
    palletBase.position.y = 0.07;
    addEdges(palletBase, 0x78350f, 0.45);
    grp.add(palletBase);

    const boxW = 0.52;
    const boxH = 0.44;
    const boxD = 0.52;
    for (let tier = 0; tier < 2; tier++) {
      const y = 0.14 + tier * boxH + boxH * 0.5;
      [-0.27, 0.27].forEach(bx => {
        [-0.27, 0.27].forEach(bz => {
          const box = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, boxD), m.kraftMat);
          box.position.set(bx, y, bz);
          addEdges(box, 0x92400e, 0.35);
          const tape = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.012, boxD + 0.01), m.tapeMat);
          tape.position.set(bx, y + boxH * 0.5 + 0.006, bz);
          grp.add(box, tape);
        });
      });
    }

    const wrap = new THREE.Mesh(new THREE.BoxGeometry(palW - 0.04, boxH * 2 + 0.04, palD - 0.04), m.shrinkWrapMat);
    wrap.position.y = 0.14 + boxH;
    grp.add(wrap);

    return grp;
  }

  // ---------------------------------------------------------------------------
  // Single Stand-Up Pouch Bag Making Line (Local coords match bag.js: -X -> +X)
  // ---------------------------------------------------------------------------
  function buildSingleBagLine(lineIdx, res) {
    const { m, g } = res;
    const mGroup = new THREE.Group();

    const anim = {
      phaseOffset: lineIdx * 0.21,
      rolls: [],
      endRoller: null,
      dancerCarriage: null,
      dancerBaseY: 0.68,
      sealHeads: [],
      sealBaseY: 1.12,
      guillotineBlade: null,
      bladeBaseY: 1.04,
      pouches: []
    };

    // STAGE 1: Unwind Stand & Festoon Tension Dancer Tower (x = -5.0 to -2.7)
    const unwindGroup = new THREE.Group();
    const towerW = 1.72;
    const halfW = towerW / 2;

    [-halfW + 0.06, halfW - 0.06].forEach(fz => {
      const rearTower = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.48, 0.08), m.frameBlack);
      rearTower.position.set(-3.25, 1.24, fz);
      const guideRod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 2.25, 8), m.chromeMat);
      guideRod.position.set(-3.05, 1.20, fz + (fz > 0 ? 0.06 : -0.06));
      const upperStep = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.78, 0.08), m.frameBlack);
      upperStep.position.set(-4.15, 1.26, fz);
      const lowerStep = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.80, 0.08), m.frameBlack);
      lowerStep.position.set(-4.30, 0.46, fz);
      const sideHole = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.09, 10), m.brassMat);
      sideHole.rotation.x = Math.PI / 2;
      sideHole.position.set(-3.95, 1.45, fz);
      unwindGroup.add(rearTower, guideRod, upperStep, lowerStep, sideHole);
    });

    // Upper black bridge beam with 5 lightening holes
    const holeBridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.30, towerW - 0.08), m.frameBlack);
    holeBridge.position.set(-2.78, 2.22, 0);
    unwindGroup.add(holeBridge);
    [-0.60, -0.30, 0.0, 0.30, 0.60].forEach(hz => {
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.13, 12), m.darkSteel);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(-2.78, 2.22, hz);
      const holeCore = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.14, 10), m.chromeMat);
      holeCore.rotation.x = Math.PI / 2;
      holeCore.position.set(-2.78, 2.22, hz);
      unwindGroup.add(rim, holeCore);
    });

    // Upper Jumbo Master Printed Hygiene Roll & Lower Secondary Gusset Roll
    const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, towerW + 0.16, 12), m.chromeMat);
    mainShaft.rotation.x = Math.PI / 2;
    mainShaft.position.set(-4.35, 1.52, 0);
    const jumboRoll = createFilmRollAssembly(0.55, 1.36, res);
    jumboRoll.position.set(-4.35, 1.52, 0);
    unwindGroup.add(mainShaft, jumboRoll);
    anim.rolls.push(jumboRoll);

    const lowerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, towerW + 0.18, 10), m.darkSteel);
    lowerShaft.rotation.x = Math.PI / 2;
    lowerShaft.position.set(-4.48, 0.50, 0);
    const secondaryRoll = createFilmRollAssembly(0.22, 0.92, res);
    secondaryRoll.position.set(-4.48, 0.50, 0);
    unwindGroup.add(lowerShaft, secondaryRoll);
    anim.rolls.push(secondaryRoll);

    // 6x2 Festoon Tension Dancer Accumulator Bank
    const festoonXPositions = [-3.62, -3.48, -3.34, -3.20, -3.06, -2.92];
    const dancerCarriage = new THREE.Group();
    dancerCarriage.position.set(0, 0.68, 0);
    festoonXPositions.forEach((rx, idx) => {
      const upRoll = new THREE.Mesh(g.festoonRoll, idx % 2 === 0 ? m.bronzeRollMat : m.chromeMat);
      upRoll.rotation.x = Math.PI / 2;
      upRoll.position.set(rx, 2.16, 0);
      unwindGroup.add(upRoll);

      const lowRoll = new THREE.Mesh(g.festoonRoll, m.bronzeRollMat);
      lowRoll.rotation.x = Math.PI / 2;
      lowRoll.position.set(rx, 0, 0);
      dancerCarriage.add(lowRoll);

      const spanMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 1.48, 1.34),
        idx % 2 === 0 ? m.silverFoilWebMat : m.printedWebMat
      );
      spanMesh.position.set(rx, 1.42, 0);
      unwindGroup.add(spanMesh);
    });
    unwindGroup.add(dancerCarriage);
    anim.dancerCarriage = dancerCarriage;

    const infeedWebUpper = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.010, 1.34), m.printedWebMat);
    infeedWebUpper.position.set(-3.98, 2.11, 0);
    infeedWebUpper.rotation.z = 0.13;
    const infeedWebLower = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.008, 0.90), m.silverFoilWebMat);
    infeedWebLower.position.set(-4.05, 0.70, 0);
    infeedWebLower.rotation.z = -0.04;
    unwindGroup.add(infeedWebUpper, infeedWebLower);

    // Side-mounted stainless control box + buttons + rubber nip rollers + sensor
    const unwindCtrlBox = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.52, 0.22), m.brushedSteel);
    unwindCtrlBox.position.set(-3.88, 0.58, halfW + 0.08);
    addEdges(unwindCtrlBox, 0x64748b, 0.5);
    unwindGroup.add(unwindCtrlBox);

    [-0.20, -0.08, 0.04, 0.16].forEach((bx, bIdx) => {
      const btn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.025, 8),
        bIdx === 0 ? m.greenBtnMat : (bIdx === 1 ? m.redMat : m.darkSteel)
      );
      btn.position.set(-3.88 + bx, 0.85, halfW + 0.09);
      unwindGroup.add(btn);
    });

    [1.12, 1.24].forEach(ny => {
      const nipRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.42, 12), m.rubberBlack);
      nipRoll.rotation.x = Math.PI / 2;
      nipRoll.position.set(-2.75, ny, 0);
      unwindGroup.add(nipRoll);
    });
    const sensorBlock = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.10), m.yellowHoseMat);
    sensorBlock.position.set(-2.62, 1.28, 0.42);
    unwindGroup.add(sensorBlock);
    mGroup.add(unwindGroup);

    // STAGE 2: Integrated Forming Frame & Triangular V-Plow Folder (x = -2.75 to -1.15)
    const formingGroup = new THREE.Group();
    const formFrameW = 1.38;
    [-formFrameW / 2 + 0.05, formFrameW / 2 - 0.05].forEach(rz => {
      const lowerRail = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.10, 0.08), m.frameBlack);
      lowerRail.position.set(-1.95, 0.05, rz);
      const midRail = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.09, 0.08), m.frameBlack);
      midRail.position.set(-1.95, 0.84, rz);
      const centerPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.45, 0.08), m.frameBlack);
      centerPost.position.set(-1.95, 0.725, rz);
      formingGroup.add(lowerRail, midRail, centerPost);
    });

    [-2.35, -1.25].forEach((gx, gIdx) => {
      const gRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, formFrameW - 0.12, 10), m.chromeMat);
      gRoll.rotation.x = Math.PI / 2;
      gRoll.position.set(gx, gIdx === 0 ? 1.15 : 1.00, 0);
      formingGroup.add(gRoll);
    });

    const vPlowPlate = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.025, 0.86), m.brushedSteel);
    vPlowPlate.position.set(-1.95, 1.08, 0);
    vPlowPlate.rotation.z = -0.10;
    formingGroup.add(vPlowPlate);

    [-1, 1].forEach(sideSign => {
      const foldBar = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.045, 0.045), m.chromeMat);
      foldBar.position.set(-1.95, 1.12, sideSign * 0.54);
      foldBar.rotation.y = sideSign * 0.16;
      foldBar.rotation.z = -0.10;
      const tuckDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.02, 12), m.brushedSteel);
      tuckDisc.position.set(-1.65, 1.05, sideSign * 0.46);
      formingGroup.add(foldBar, tuckDisc);
    });

    const formingWebTop = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.012, 1.06), m.printedWebMat);
    formingWebTop.position.set(-1.95, 1.11, 0);
    formingWebTop.rotation.z = -0.10;
    const formingWebBottom = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.010, 0.88), m.silverFoilWebMat);
    formingWebBottom.position.set(-1.95, 0.99, 0);
    formingWebBottom.rotation.z = 0.02;
    formingGroup.add(formingWebTop, formingWebBottom);
    mGroup.add(formingGroup);

    // STAGE 3: Modular Stainless Bed & 4 Heat-Sealing / Cooling Stations
    const sealSectionGroup = new THREE.Group();
    const bedLen = 3.55;
    const bedW = 1.38;
    const bedH = 0.84;
    const bedCenterX = 0.55;

    const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(bedLen, 0.08, bedW - 0.06), m.frameBlack);
    kickPlate.position.set(bedCenterX, 0.04, 0);
    const mainBed = new THREE.Mesh(new THREE.BoxGeometry(bedLen, bedH - 0.08, bedW), m.stainlessSteel);
    mainBed.position.set(bedCenterX, 0.46, 0);
    addEdges(mainBed, 0x64748b, 0.5);
    sealSectionGroup.add(kickPlate, mainBed);

    [-0.75, 0.05, 0.85, 1.65].forEach(dx => {
      const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.58, 0.02), m.brushedSteel);
      doorPanel.position.set(dx, 0.44, bedW / 2 + 0.015);
      const latch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.10, 0.03), m.chromeMat);
      latch.position.set(dx + 0.28, 0.44, bedW / 2 + 0.03);
      sealSectionGroup.add(doorPanel, latch);
    });

    const mainPouchWeb = new THREE.Mesh(new THREE.BoxGeometry(3.45, 0.018, 0.86), m.printedWebMat);
    mainPouchWeb.position.set(0.50, bedH + 0.14, 0);
    sealSectionGroup.add(mainPouchWeb);

    [-0.85, -0.25, 0.35, 0.95].forEach((sx, sIdx) => {
      [-0.56, 0.56].forEach(sz => {
        const upright = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.56, 0.08), m.darkSteel);
        upright.position.set(sx, bedH + 0.28, sz);
        sealSectionGroup.add(upright);
      });

      const sealHead = new THREE.Group();
      sealHead.position.set(sx, bedH + 0.28, 0);
      const upperBeam = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 1.18), m.frameBlack);
      upperBeam.position.y = 0.08;
      const sealJaw = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 1.02),
        sIdx === 3 ? m.brushedSteel : m.orangeSealMat
      );
      sealJaw.position.y = -0.04;
      sealHead.add(upperBeam, sealJaw);

      [-0.42, 0.42].forEach(spz => {
        const springCoil = new THREE.Mesh(g.springCoil, m.chromeMat);
        springCoil.position.set(0, 0.25, spz);
        const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), m.frameBlack);
        topCap.position.set(0, 0.35, spz);
        sealHead.add(springCoil, topCap);
      });

      sealSectionGroup.add(sealHead);
      anim.sealHeads.push(sealHead);

      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(sx, bedH + 0.16, bedW / 2 + 0.12);
      const wheelRim = new THREE.Mesh(g.handwheelRim, m.frameBlack);
      const spoke1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.018), m.frameBlack);
      const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.18, 0.018), m.frameBlack);
      wheelGroup.add(wheelRim, spoke1, spoke2);
      sealSectionGroup.add(wheelGroup);
    });
    mGroup.add(sealSectionGroup);

    // STAGE 4: Edge-Trim Slitter, Scrap Extraction & Guillotine Cutter Hood
    const trimCutGroup = new THREE.Group();
    const slitterShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.16, 10), m.chromeMat);
    slitterShaft.rotation.x = Math.PI / 2;
    slitterShaft.position.set(1.48, bedH + 0.22, 0);
    trimCutGroup.add(slitterShaft);

    [-0.44, 0.44].forEach(tz => {
      const knifeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 12), m.chromeMat);
      knifeDisc.rotation.x = Math.PI / 2;
      knifeDisc.position.set(1.48, bedH + 0.20, tz);
      const trimStrip = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.008, 0.045), m.printedWebMat);
      trimStrip.position.set(1.56, bedH + 0.04, tz * 1.08);
      trimStrip.rotation.z = -0.65;
      trimCutGroup.add(knifeDisc, trimStrip);
    });

    const suctionHose = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.68, 10), m.yellowHoseMat);
    suctionHose.position.set(1.52, 0.58, -bedW / 2 - 0.10);
    suctionHose.rotation.x = -0.25;
    const scrapBin = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.52, 12), m.darkSteel);
    scrapBin.position.set(1.52, 0.26, -bedW / 2 - 0.22);
    trimCutGroup.add(suctionHose, scrapBin);

    const cutterHood = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 1.24), m.brushedSteel);
    cutterHood.position.set(1.96, bedH + 0.28, 0);
    addEdges(cutterHood, 0x64748b, 0.5);
    const cutterSideBox = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.20), m.stainlessSteel);
    cutterSideBox.position.set(1.98, bedH + 0.24, bedW / 2 + 0.08);
    trimCutGroup.add(cutterHood, cutterSideBox);

    [bedH + 0.32, bedH + 0.18].forEach(ky => {
      const blackKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.04, 10), m.frameBlack);
      blackKnob.rotation.x = Math.PI / 2;
      blackKnob.position.set(2.04, ky, bedW / 2 + 0.19);
      trimCutGroup.add(blackKnob);
    });

    const guillotineBlade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 1.08), m.chromeMat);
    guillotineBlade.position.set(2.18, bedH + 0.20, 0);
    const blueStaticBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.045, 1.18), m.staticBarBlue);
    blueStaticBar.position.set(2.29, bedH + 0.24, 0);
    trimCutGroup.add(guillotineBlade, blueStaticBar);
    anim.guillotineBlade = guillotineBlade;
    mGroup.add(trimCutGroup);

    // STAGE 5: Green Belt Outfeed Conveyor, Blue Baffles, Swing-Arm HMI & Spaced Pouches
    const outfeedGroup = new THREE.Group();
    const convH = 0.80;

    // Articulated Swing-Arm & Vertical HMI + Red Beacon
    const swingArmGroup = new THREE.Group();
    swingArmGroup.position.set(2.38, convH, bedW / 2 + 0.06);
    const armPost = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.56, 0.11), m.whiteArmMat);
    armPost.position.set(0, 0.28, 0);
    const jointCap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 10), m.frameBlack);
    jointCap.position.set(0, 0.57, 0);
    const horizArm = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.09, 0.09), m.whiteArmMat);
    horizArm.position.set(0.26, 0.52, -0.10);
    horizArm.rotation.y = 0.28;
    const hmiCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.56, 0.24), m.whiteArmMat);
    hmiCabinet.position.set(0.54, 0.82, -0.18);
    addEdges(hmiCabinet, 0x64748b, 0.5);
    const hmiBezel = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.50, 0.02), m.darkSteel);
    hmiBezel.position.set(0.54, 0.82, -0.055);
    const redBeacon = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 10), m.redMat);
    redBeacon.position.set(0, 0.72, 0);
    swingArmGroup.add(armPost, jointCap, horizArm, hmiCabinet, hmiBezel, redBeacon);
    outfeedGroup.add(swingArmGroup);

    // Elastic green transfer cords
    const cordRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.88, 10), m.darkSteel);
    cordRoller.rotation.x = Math.PI / 2;
    cordRoller.position.set(2.72, convH + 0.04, -0.05);
    outfeedGroup.add(cordRoller);
    [-0.28, -0.14, 0.0, 0.14, 0.28].forEach(cz => {
      const greenCord = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.016), m.conveyorGreen);
      greenCord.position.set(2.50, convH + 0.08, cz - 0.05);
      outfeedGroup.add(greenCord);
    });

    // Stainless Outfeed Table & Green PVC Conveyor Belt
    const tableLen = 2.25;
    const tableW = 1.24;
    const tableCenterX = 3.48;
    const stainlessTable = new THREE.Mesh(new THREE.BoxGeometry(tableLen, 0.06, tableW), m.brushedSteel);
    stainlessTable.position.set(tableCenterX, convH - 0.03, 0);
    addEdges(stainlessTable, 0x64748b, 0.45);
    const tableSupport = new THREE.Mesh(new THREE.BoxGeometry(tableLen - 0.2, convH - 0.06, tableW - 0.25), m.stainlessSteel);
    tableSupport.position.set(tableCenterX, (convH - 0.06) / 2, 0);
    const greenBelt = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.022, 0.66), m.conveyorGreen);
    greenBelt.position.set(3.64, convH + 0.012, -0.05);
    const endRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.70, 10), m.chromeMat);
    endRoller.rotation.x = Math.PI / 2;
    endRoller.position.set(4.60, convH, -0.05);
    outfeedGroup.add(stainlessTable, tableSupport, greenBelt, endRoller);
    anim.endRoller = endRoller;

    // Bright Blue Guide Baffles
    [-0.37, 0.27].forEach(bz => {
      const vWall = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.20, 0.016), m.blueBaffleMat);
      vWall.position.set(2.92, convH + 0.11, bz);
      const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.015, 0.09), m.blueBaffleMat);
      baseFoot.position.set(2.92, convH + 0.015, bz);
      outfeedGroup.add(vWall, baseFoot);
    });

    // White open-top sample carton on front-left table ledge + upright sample pouch
    const wBoxBody = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.30, 0.28), m.whiteArmMat);
    wBoxBody.position.set(2.65, convH + 0.16, 0.46);
    const wBoxInner = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.28, 0.24), m.kraftInnerMat);
    wBoxInner.position.set(2.65, convH + 0.18, 0.46);
    outfeedGroup.add(wBoxBody, wBoxInner);

    const samplePouch = createPouchMesh(res);
    samplePouch.position.set(3.85, convH + 0.048, 0.44);
    samplePouch.rotation.y = 0.15;
    outfeedGroup.add(samplePouch);

    // Open Kraft Collection Carton at Conveyor End holding accumulated pouches
    const endCartonStand = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.24, 0.85), m.darkSteel);
    endCartonStand.position.set(5.02, 0.12, -0.05);
    const openCarton = createOpenCollectionCarton(0.78, 0.52, 0.88, res);
    openCarton.position.set(5.02, 0.24, -0.05);
    outfeedGroup.add(endCartonStand, openCarton);

    const inCarton = createPouchMesh(res);
    inCarton.rotation.set(-Math.PI / 2 + 0.18, 0.12, -0.15);
    inCarton.position.set(5.00, 0.33, 0.16);
    outfeedGroup.add(inCarton);

    // 3 Spaced Hygiene Pouches travelling down the green conveyor belt
    const pouchH = 0.44;
    const beltCenterZ = -0.05 + pouchH / 2;
    const startBeltX = 2.65;
    const endBeltX = 4.45;
    for (let pi = 0; pi < 3; pi++) {
      const pMesh = createPouchMesh(res);
      const frac = (pi + 0.3) / 3;
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(startBeltX + (endBeltX - startBeltX) * frac, convH + 0.048, beltCenterZ);
      outfeedGroup.add(pMesh);
      anim.pouches.push(pMesh);
    }

    // Compact Inline Shrink-Wrapped Box Pallet at end of line (stays inside lane width!)
    const endPallet = createCompactBoxPallet(res);
    endPallet.position.set(6.08, 0, -0.05);
    outfeedGroup.add(endPallet);

    mGroup.add(outfeedGroup);
    _animatedLines.push(anim);
    return mGroup;
  }

  // ---------------------------------------------------------------------------
  // Compact Spout Cap Die-Cutting Machine ("เครื่องตัดฝา Spout", col 2 next to BM 14)
  // ---------------------------------------------------------------------------
  function buildSpoutCutter(res) {
    const m = res.m;
    const gGroup = new THREE.Group();

    const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.92, 5.4), m.stainlessSteel);
    baseFrame.position.set(0, 0.46, 0);
    addEdges(baseFrame, 0x64748b, 0.55);
    gGroup.add(baseFrame);

    // Die-Cutting Press Arch with Blue Safety Trim & Polycarbonate Guard
    const pressHousing = new THREE.Mesh(new THREE.BoxGeometry(1.36, 1.15, 1.85), m.brushedSteel);
    pressHousing.position.set(0, 1.48, -0.35);
    addEdges(pressHousing, 0x475569, 0.6);
    gGroup.add(pressHousing);

    const pressAccent = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.24, 1.92), m.staticBarBlue);
    pressAccent.position.set(0, 2.08, -0.35);
    addEdges(pressAccent, 0x0369a1, 0.6);
    gGroup.add(pressAccent);

    const guardGlass = new THREE.Mesh(new THREE.BoxGeometry(1.40, 0.62, 1.25), m.shrinkWrapMat);
    guardGlass.position.set(0, 1.38, -0.35);
    gGroup.add(guardGlass);

    // Spout Reel Unwind Stand at South (+Z) end
    [-0.55, 0.55].forEach(sx => {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.10, 1.35, 0.45), m.darkSteel);
      stand.position.set(sx, 0.68, 2.35);
      gGroup.add(stand);
    });
    const capReel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.96, 16), m.whiteArmMat);
    capReel.rotation.z = Math.PI / 2;
    capReel.position.set(0, 1.18, 2.35);
    gGroup.add(capReel);

    // Output Conveyor & Collection Bin at North (-Z) end
    const chuteBelt = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 1.55), m.conveyorGreen);
    chuteBelt.position.set(0, 0.96, -2.05);
    const collectBin = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.65, 0.78), m.blueBaffleMat);
    collectBin.position.set(0, 0.34, -2.85);
    addEdges(collectBin, 0x1d4ed8, 0.5);
    gGroup.add(chuteBelt, collectBin);

    // Side HMI Touch Console
    const hmiScreen = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.46), m.frameBlack);
    hmiScreen.position.set(0.76, 1.48, 0.72);
    gGroup.add(hmiScreen);

    return gGroup;
  }

  // ---------------------------------------------------------------------------
  // Build Blueprint-Aligned Hall 2 Bag Making Lines + Spout Cutter (Rotated 180°)
  // ---------------------------------------------------------------------------
  function buildArray(group, r, mats) {
    const res = getSharedResources(mats);
    const pxToX = px => (px - 1050) * 0.1 - r.x;
    const pyToZ = py => (py - 760) * 0.1 - r.z;

    // Blueprint order Left -> Right strictly inside Hall 2 room walls (px = 674..1062)
    const lineSpecs = [
      { kind: "bag",          px: 688,  pyN: 746, pyS: 844 }, // BM 14 (westmost, safely east of px=674 wall)
      { kind: "spout_cutter", px: 716,  pyN: 774, pyS: 842 }, // เครื่องตัดฝา Spout
      { kind: "bag",          px: 744,  pyN: 746, pyS: 844 }, // BM 15
      { kind: "bag",          px: 769,  pyN: 746, pyS: 828 }, // BM 12
      { kind: "bag",          px: 794,  pyN: 746, pyS: 828 }, // BM 11
      { kind: "bag",          px: 819,  pyN: 746, pyS: 828 }, // BM 17
      { kind: "bag",          px: 844,  pyN: 746, pyS: 848 }, // BM 16
      { kind: "bag",          px: 869,  pyN: 746, pyS: 828 }, // BM 04
      { kind: "bag",          px: 894,  pyN: 746, pyS: 854 }, // BM 13
      { kind: "bag",          px: 919,  pyN: 746, pyS: 854 }, // BM 05
      { kind: "bag",          px: 944,  pyN: 746, pyS: 828 }, // BM 06
      { kind: "bag",          px: 969,  pyN: 746, pyS: 828 }, // BM 07
      { kind: "bag",          px: 994,  pyN: 746, pyS: 854 }, // BM 08
      { kind: "bag",          px: 1042, pyN: 746, pyS: 890 }  // BM 10 (longest, safely west of px=1062 wall)
    ];

    // Local X span of buildSingleBagLine: Unwind = -4.78 .. Outfeed = +6.56 (11.34m)
    const LOCAL_UNWIND_X = -4.78;
    const LOCAL_OUTFEED_X = 6.56;
    const BASE_LEN = LOCAL_OUTFEED_X - LOCAL_UNWIND_X;
    const lateralScale = 0.72;

    let bagIdx = 0;
    lineSpecs.forEach(spec => {
      const lx = pxToX(spec.px);
      const zN = pyToZ(spec.pyN);
      const zS = pyToZ(spec.pyS);

      if (spec.kind === "spout_cutter") {
        const cutter = buildSpoutCutter(res);
        cutter.position.set(lx, 0, (zN + zS) * 0.5);
        group.add(cutter);
        return;
      }

      const bagLine = buildSingleBagLine(bagIdx++, res);
      const lengthScale = (zS - zN) / BASE_LEN;
      bagLine.scale.set(lengthScale, 1.06, lateralScale);

      // Rotated 180° (+90° around Y): Outfeed Conveyor (+X) faces North (-Z), Unwind (-X) faces South (+Z)
      bagLine.rotation.y = Math.PI / 2;
      bagLine.position.set(lx, 0, zN + LOCAL_OUTFEED_X * lengthScale);
      group.add(bagLine);
    });

    // Small L-shaped inspection / staging bench between BM 08 and BM 10 per blueprint
    const benchX = pxToX(1017);
    const benchZ = pyToZ(856);
    const benchTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 3.6), res.m.brushedSteel);
    benchTop.position.set(benchX, 0.425, benchZ);
    const benchWing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 0.9), res.m.brushedSteel);
    benchWing.position.set(benchX + 0.65, 0.425, benchZ + 1.35);
    addEdges(benchTop, 0x64748b, 0.5);
    addEdges(benchWing, 0x64748b, 0.5);
    group.add(benchTop, benchWing);
  }

  function buildSingle(idx, mats) {
    const res = getSharedResources(mats);
    return buildSingleBagLine(idx, res);
  }

  function resetAnimations() {
    _animatedLines = [];
  }

  let _lastAnimTime = 0;
  let _animClock = 0;
  function updateAnimations() {
    if (_animatedLines.length === 0) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = _lastAnimTime ? Math.min(0.05, (now - _lastAnimTime) * 0.001) : 0.016;
    _lastAnimTime = now;
    _animClock += dt;

    for (let li = 0; li < _animatedLines.length; li++) {
      const a = _animatedLines[li];
      const t = _animClock + a.phaseOffset;

      for (let ri = 0; ri < a.rolls.length; ri++) {
        a.rolls[ri].rotation.y += dt * 1.1;
      }
      if (a.endRoller) a.endRoller.rotation.y -= dt * 2.4;
      if (a.dancerCarriage) a.dancerCarriage.position.y = a.dancerBaseY + Math.sin(t * 2.4) * 0.06;

      const stamp = Math.abs(Math.sin(t * 3.2)) * 0.035;
      for (let si = 0; si < a.sealHeads.length; si++) {
        a.sealHeads[si].position.y = a.sealBaseY - stamp;
      }
      if (a.guillotineBlade) a.guillotineBlade.position.y = a.bladeBaseY - stamp * 1.4;

      // Glide 3 spaced Hygiene pouches along green conveyor belt
      const startX = 2.65;
      const endX = 4.45;
      for (let pi = 0; pi < a.pouches.length; pi++) {
        const u = ((t * 0.24) + pi / a.pouches.length) % 1.0;
        a.pouches[pi].position.x = startX + (endX - startX) * u;
      }
    }
  }

  return {
    buildArray,
    buildSingle,
    resetAnimations,
    updateAnimations
  };
})();
