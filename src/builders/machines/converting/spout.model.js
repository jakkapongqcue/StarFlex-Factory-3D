// ============================================================================
// Module: src/builders/machines/converting/spout.model.js
// Upgraded Procedural 3D Model for Automatic Ultrasonic Spout Inserter &
// Welder Machines (ST_SPOUT: 1SP 01-07 & South 1SP 08-09).
// Ported & optimized from StarFlexERP3D (js/machines/spout.js) with shared
// geometry, texture & material caching (machine + outfeed conveyor/pallets,
// no worker figures):
//   1. Pale sage-grey 4-door cabinet bench with recessed handles & dark deck
//   2. Vertical blue ultrasonic press pillar, chrome guide rods, dual front
//      cylinders & reciprocating titanium welding horn
//   3. Dark vibratory bowl feeder on white cylindrical base, white plastic
//      spout fitments, overhead hopper & linear feed track
//   4. Triple digital temperature/pressure controllers with red LED readouts
//   5. Green PVC outfeed conveyor, 3-ring hold-down rollers, E-Stop console,
//      articulated green HMI PC monitor, animated Hygiene spouted pouches,
//      open collection carton & shrink-wrapped 2x2x2 finished carton pallet
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.ConvertingModels = window.Starflex3D.Builders.ConvertingModels || {};

window.Starflex3D.Builders.ConvertingModels.Spout = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  let _cachedRes = null;
  let _animatedUnits = [];

  function drawRoundedRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.rect(x, y, w, h);
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
  // Procedural Canvas Textures (Hygiene Pouch Front/Back & Carton Label)
  // ---------------------------------------------------------------------------
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
    ctx.fillText("SPOUT • 500 ml", 128, 232);

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
    ctx.fillText("STARFLEX · SPOUT FG", 14, 24);
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

    const pouchFrontTex = createHygienePouchTexture();
    const pouchBackTex = createHygienePouchBackTexture();
    const boxLabelTex = createBoxLabelTexture();

    const m = {
      aluminumFrame: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.45, roughness: 0.40 }),
      darkSteel: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.30 }),
      darkDeckMat: new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.60, metalness: 0.25 }),
      bowlGraphite: new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.48, metalness: 0.32 }),
      bowlInnerMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.50, metalness: 0.25 }),
      charcoalMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.60 }),
      chromeMat: mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.65, roughness: 0.25 }),
      whiteDriveMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }),
      baseCabinetMat: new THREE.MeshStandardMaterial({ color: 0xd1dad0, roughness: 0.48 }),
      baseKickMat: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.65 }),
      pillarBlueMat: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.38, metalness: 0.25 }),
      greenBeltMat: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.62 }),
      whiteSpoutMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 }),
      kraftMat: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.85 }),
      kraftInnerMat: new THREE.MeshStandardMaterial({ color: 0x7c532e, roughness: 0.90 }),
      tapeMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 }),
      woodMat: new THREE.MeshStandardMaterial({ color: 0xb48352, roughness: 0.85 }),
      woodBlockMat: new THREE.MeshStandardMaterial({ color: 0x8d5b32, roughness: 0.88 }),
      shrinkWrapMat: new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.24,
        roughness: 0.25
      }),
      redLedMat: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      redBtnMat: new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
      yellowBtnMat: new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
      greenLedMat: new THREE.MeshBasicMaterial({ color: 0x22c55e }),
      blueBtnMat: new THREE.MeshBasicMaterial({ color: 0x2563eb }),
      screenBgMat: new THREE.MeshBasicMaterial({ color: 0x064e3b }),
      screenBarMat: new THREE.MeshBasicMaterial({ color: 0x10b981 }),
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

    const pW = 0.38;
    const pH = 0.52;
    const pD = 0.075;
    const g = {
      pouchBody: new THREE.BoxGeometry(pW, pH * 0.86, pD),
      pouchGusset: new THREE.BoxGeometry(pW * 0.94, pH * 0.12, pD * 1.5),
      pouchSeal: new THREE.BoxGeometry(pW * 1.02, pH * 0.12, pD * 0.36),
      spoutFlange: new THREE.BoxGeometry(0.11, 0.036, 0.09),
      spoutNeck: new THREE.CylinderGeometry(0.04, 0.044, 0.11, 10),
      spoutCap: new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12),
      fitmentNozzle: new THREE.CylinderGeometry(0.038, 0.038, 0.085, 8),
      fitmentFlange: new THREE.CylinderGeometry(0.07, 0.07, 0.02, 10),
      holdRing: new THREE.CylinderGeometry(0.085, 0.085, 0.035, 14)
    };

    _cachedRes = { m, g };
    return _cachedRes;
  }

  function createSpoutPouchMesh(res) {
    const { m, g } = res;
    const pW = 0.38;
    const pH = 0.52;
    const grp = new THREE.Group();

    const body = new THREE.Mesh(g.pouchBody, m.pouchBodyMats);
    body.position.y = (pH * 0.86) / 2;
    const gusset = new THREE.Mesh(g.pouchGusset, m.pouchGussetMat);
    gusset.position.y = (pH * 0.12) / 2;
    const seal = new THREE.Mesh(g.pouchSeal, m.pouchSealMat);
    seal.position.y = pH * 0.86 + (pH * 0.12) / 2;

    const spoutAssembly = new THREE.Group();
    const flange = new THREE.Mesh(g.spoutFlange, m.whiteSpoutMat);
    flange.position.y = 0.018;
    const neck = new THREE.Mesh(g.spoutNeck, m.whiteSpoutMat);
    neck.position.y = 0.072;
    const cap = new THREE.Mesh(g.spoutCap, m.whiteSpoutMat);
    cap.position.y = 0.135;
    spoutAssembly.add(flange, neck, cap);
    spoutAssembly.position.set(-pW * 0.30, pH * 0.88, 0);
    spoutAssembly.rotation.z = Math.PI * 0.18;

    grp.add(body, gusset, seal, spoutAssembly);
    return grp;
  }

  function createOpenCarton(w, h, d, res) {
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
    const inner = new THREE.Mesh(new THREE.BoxGeometry(w - t * 2, 0.008, d - t * 2), m.kraftInnerMat);
    inner.position.y = t + 0.005;
    grp.add(btm, fw, bw, lw, rw, inner);
    return grp;
  }

  function createBoxPallet(res) {
    const { m } = res;
    const grp = new THREE.Group();
    const palW = 1.9;
    const palD = 1.45;
    const palH = 0.16;

    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(palW, 0.04, palD), m.woodMat);
    topDeck.position.y = 0.14;
    grp.add(topDeck);
    [-palW * 0.42, 0, palW * 0.42].forEach(bx => {
      const runner = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, palD), m.woodBlockMat);
      runner.position.set(bx, 0.07, 0);
      grp.add(runner);
    });

    const bW = 0.84;
    const bH = 0.52;
    const bD = 0.64;
    const boxGeo = new THREE.BoxGeometry(bW, bH, bD);
    const tapeGeo = new THREE.BoxGeometry(0.13, 0.015, bD + 0.01);
    const lblGeo = new THREE.PlaneGeometry(0.32, 0.17);

    const offsetsX = [-bW * 0.52, bW * 0.52];
    const offsetsZ = [-bD * 0.52, bD * 0.52];
    for (let t = 0; t < 2; t++) {
      const baseY = palH + t * bH;
      offsetsX.forEach(ox => {
        offsetsZ.forEach(oz => {
          const carton = new THREE.Mesh(boxGeo, m.kraftMat);
          carton.position.set(ox, baseY + bH * 0.5, oz);
          const tape = new THREE.Mesh(tapeGeo, m.tapeMat);
          tape.position.set(ox, baseY + bH + 0.008, oz);
          const lbl = new THREE.Mesh(lblGeo, m.boxLabelMat);
          lbl.position.set(ox, baseY + bH * 0.52, oz + bD * 0.5 + 0.005);
          grp.add(carton, tape, lbl);
        });
      });
    }

    const totalH = 2 * bH;
    const wrap = new THREE.Mesh(new THREE.BoxGeometry(palW * 0.94, totalH, palD * 0.94), m.shrinkWrapMat);
    wrap.position.y = palH + totalH * 0.5;
    grp.add(wrap);

    return grp;
  }

  // ---------------------------------------------------------------------------
  // Build Single High-Fidelity Spout Machine (centered cleanly around 0,0,0)
  // ---------------------------------------------------------------------------
  function buildSingleSpoutMachine(idx, res) {
    const { m, g } = res;
    const wrapper = new THREE.Group();

    // Inner offset group centers visual bounds (X: [-2.60..+5.03], Z: [-2.38..+1.22])
    const mGroup = new THREE.Group();
    mGroup.position.set(-1.20, 0, 0.50);
    wrapper.add(mGroup);

    const anim = {
      phaseOffset: idx * 0.85,
      bowlOuter: null,
      rollers: [],
      hornGroup: null,
      hornBaseY: 0,
      pouches: [],
      convEndX: 4.20,
      cartonX: 4.55,
      beltY: 0.825
    };

    // 1. LOWER MACHINE BASE CABINETS (4-door pale sage-grey with dark top deck)
    const baseW = 5.2;
    const baseH = 1.32;
    const baseD = 2.4;

    const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(baseW, 0.12, baseD), m.baseKickMat);
    kickPlate.position.set(0, 0.06, 0);
    const baseBody = new THREE.Mesh(new THREE.BoxGeometry(baseW, baseH - 0.12, baseD), m.baseCabinetMat);
    baseBody.position.set(0, (baseH + 0.12) * 0.5, 0);
    addEdges(baseBody, 0x64748b, 0.35);

    const topDeck = new THREE.Mesh(new THREE.BoxGeometry(baseW + 0.08, 0.045, baseD + 0.08), m.darkDeckMat);
    topDeck.position.set(0, baseH + 0.022, 0);
    addEdges(topDeck, 0x334155, 0.45);
    mGroup.add(kickPlate, baseBody, topDeck);

    const doorWidth = baseW / 4 - 0.08;
    const doorHeight = baseH - 0.28;
    for (let d = 0; d < 4; d++) {
      const dx = -baseW / 2 + (d + 0.5) * (baseW / 4);
      const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.02), m.baseCabinetMat);
      doorPanel.position.set(dx, baseH / 2 + 0.04, baseD / 2 + 0.012);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.24, 0.03), m.darkSteel);
      handle.position.set(dx + doorWidth * 0.35, baseH / 2 + 0.18, baseD / 2 + 0.026);
      mGroup.add(doorPanel, handle);
    }

    // Small deck accessories (pneumatic manifold on left, sample cap & white label card)
    const leftManifold = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.22), m.charcoalMat);
    leftManifold.position.set(-2.05, baseH + 0.12, 0.28);
    const blueCapSample = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, 0.12), m.blueBtnMat);
    blueCapSample.position.set(-0.25, baseH + 0.09, 0.65);
    const cardSample = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.24), m.whiteSpoutMat);
    cardSample.position.set(0.15, baseH + 0.055, 0.58);
    cardSample.rotation.y = 0.42;
    mGroup.add(leftManifold, blueCapSample, cardSample);

    // 2. VIBRATORY BOWL FEEDER ASSEMBLY
    const feederX = 1.35;
    const feederZ = -0.15;
    const feederBaseY = baseH + 0.045;

    const dampRing = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.73, 0.08, 20), m.darkSteel);
    dampRing.position.set(feederX, feederBaseY + 0.04, feederZ);
    const vibDriveBase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.70, 0.78, 22), m.whiteDriveMat);
    vibDriveBase.position.set(feederX, feederBaseY + 0.39, feederZ);

    const bowlOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.00, 0.82, 0.60, 24), m.bowlGraphite);
    bowlOuter.position.set(feederX, feederBaseY + 0.78 + 0.30, feederZ);
    const bowlInner = new THREE.Mesh(new THREE.CylinderGeometry(0.90, 0.56, 0.54, 20), m.bowlInnerMat);
    bowlInner.position.set(feederX, feederBaseY + 0.78 + 0.34, feederZ);
    mGroup.add(dampRing, vibDriveBase, bowlOuter, bowlInner);
    anim.bowlOuter = bowlOuter;

    // White plastic spouts spiraling up inside the feeder bowl
    for (let s = 0; s < 14; s++) {
      const ang = s * 0.55;
      const rad = 0.58 + (s / 14) * 0.32;
      const sy = feederBaseY + 0.94 + (s / 14) * 0.36;
      const spoutFit = new THREE.Group();
      const nozzle = new THREE.Mesh(g.fitmentNozzle, m.whiteSpoutMat);
      nozzle.position.y = 0.042;
      const flange = new THREE.Mesh(g.fitmentFlange, m.whiteSpoutMat);
      flange.position.y = 0.01;
      spoutFit.add(nozzle, flange);
      spoutFit.position.set(feederX + Math.cos(ang) * rad, sy, feederZ + Math.sin(ang) * rad);
      spoutFit.rotation.y = ang + Math.PI / 2;
      mGroup.add(spoutFit);
    }

    // Overhead Bulk Supply Hopper & Support Post
    const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.18, 0.65, 16), m.bowlGraphite);
    hopper.position.set(feederX + 0.48, baseH + 1.95, feederZ - 0.40);
    const hopperChute = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.18), m.charcoalMat);
    hopperChute.position.set(feederX + 0.36, baseH + 1.62, feederZ - 0.28);
    hopperChute.rotation.z = -0.35;
    const hopperPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.95, 8), m.chromeMat);
    hopperPost.position.set(feederX + 0.48, baseH + 0.04 + 1.95 / 2, feederZ - 0.40);
    mGroup.add(hopper, hopperChute, hopperPost);

    // Linear Vibrating Feeder Track & Marching Spouts -> Left Welding Station
    const linearTrack = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.05, 0.16), m.darkSteel);
    linearTrack.position.set(feederX - 0.88, feederBaseY + 1.10, feederZ + 0.40);
    linearTrack.rotation.z = -0.06;
    linearTrack.rotation.y = 0.10;
    mGroup.add(linearTrack);

    for (let lt = 0; lt < 5; lt++) {
      const trackSpout = new THREE.Mesh(g.fitmentNozzle, m.whiteSpoutMat);
      trackSpout.position.set(
        feederX - 0.40 - lt * 0.24,
        feederBaseY + 1.12 - lt * 0.014,
        feederZ + 0.38 + lt * 0.028
      );
      mGroup.add(trackSpout);
    }

    // 3. TRIPLE DIGITAL CONTROLLERS WITH RED LED READOUTS
    const ctrlBracket = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.04), m.aluminumFrame);
    ctrlBracket.position.set(feederX + 0.75, baseH + 0.38, feederZ + 0.65);
    mGroup.add(ctrlBracket);

    [-0.16, 0, 0.16].forEach(ctrlX => {
      const ctrlBody = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.24, 0.10), m.darkSteel);
      ctrlBody.position.set(feederX + 0.75 + ctrlX, baseH + 0.38, feederZ + 0.72);
      const ledPanel = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.01), m.charcoalMat);
      ledPanel.position.set(feederX + 0.75 + ctrlX, baseH + 0.44, feederZ + 0.775);
      const redDigits = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.035, 0.006), m.redLedMat);
      redDigits.position.set(feederX + 0.75 + ctrlX, baseH + 0.44, feederZ + 0.782);
      const grnDot = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 8), m.greenLedMat);
      grnDot.rotation.x = Math.PI / 2;
      grnDot.position.set(feederX + 0.75 + ctrlX - 0.03, baseH + 0.34, feederZ + 0.78);
      mGroup.add(ctrlBody, ledPanel, redDigits, grnDot);
    });

    // 4. ULTRASONIC WELDING COLUMN & RECIPROCATING HORN (Left Workstation)
    const weldX = -0.95;
    const weldZ = 0.15;

    const slidePillar = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.65, 0.42), m.pillarBlueMat);
    slidePillar.position.set(weldX, baseH + 0.95, weldZ - 0.35);
    mGroup.add(slidePillar);

    [-0.14, 0.14].forEach(gx => {
      const guideRod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.45, 8), m.chromeMat);
      guideRod.position.set(weldX + gx, baseH + 0.95, weldZ - 0.12);
      mGroup.add(guideRod);
    });

    const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.55, 12), m.charcoalMat);
    cylBody.position.set(weldX, baseH + 1.85, weldZ - 0.12);
    mGroup.add(cylBody);

    const hornGroup = new THREE.Group();
    const hornBaseY = baseH + 0.75;
    hornGroup.position.set(weldX, hornBaseY, weldZ + 0.15);
    const booster = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.35, 12), m.charcoalMat);
    booster.position.y = 0.28;
    const titaniumHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.07, 0.38, 10), m.darkSteel);
    titaniumHorn.position.y = -0.05;
    hornGroup.add(booster, titaniumHorn);
    mGroup.add(hornGroup);
    anim.hornGroup = hornGroup;
    anim.hornBaseY = hornBaseY;

    const anvilNest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.18, 0.28), m.darkSteel);
    anvilNest.position.set(weldX, baseH + 0.09, weldZ + 0.15);
    mGroup.add(anvilNest);

    [-0.32, 0.32].forEach(cyOff => {
      const fgCyl = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.42), m.aluminumFrame);
      fgCyl.position.set(weldX + cyOff, baseH + 0.24, baseD / 2 - 0.12);
      const fgRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8), m.chromeMat);
      fgRod.rotation.x = Math.PI / 2;
      fgRod.position.set(weldX + cyOff, baseH + 0.24, baseD / 2 + 0.16);
      mGroup.add(fgCyl, fgRod);
    });

    // 5. OUTFEED GREEN FLAT BELT CONVEYOR (Running West -> East)
    const convL = 3.6;
    const convW = 0.68;
    const convH = 0.78;
    const convStartX = 0.6;
    const convCenterX = convStartX + convL / 2;
    const convCenterZ = 0.28;

    const convFrame = new THREE.Mesh(new THREE.BoxGeometry(convL, 0.12, convW), m.aluminumFrame);
    convFrame.position.set(convCenterX, convH - 0.06, convCenterZ);
    const greenBelt = new THREE.Mesh(new THREE.BoxGeometry(convL + 0.04, 0.025, convW - 0.06), m.greenBeltMat);
    greenBelt.position.set(convCenterX, convH + 0.012, convCenterZ);
    mGroup.add(convFrame, greenBelt);

    [
      [convCenterX - convL / 2 + 0.35, convCenterZ - convW / 2 + 0.08],
      [convCenterX + convL / 2 - 0.35, convCenterZ - convW / 2 + 0.08],
      [convCenterX - convL / 2 + 0.35, convCenterZ + convW / 2 - 0.08],
      [convCenterX + convL / 2 - 0.35, convCenterZ + convW / 2 - 0.08]
    ].forEach(lp => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, convH - 0.12, 0.06), m.aluminumFrame);
      leg.position.set(lp[0], (convH - 0.12) / 2, lp[1]);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.03, 10), m.darkSteel);
      foot.position.set(lp[0], 0.015, lp[1]);
      mGroup.add(leg, foot);
    });

    [-convW / 2 + 0.02, convW / 2 - 0.02].forEach(rz => {
      const sRail = new THREE.Mesh(new THREE.BoxGeometry(convL, 0.06, 0.02), m.chromeMat);
      sRail.position.set(convCenterX, convH + 0.055, convCenterZ + rz);
      mGroup.add(sRail);
    });

    // 3-Ring Hold-Down Roller Assembly + Discharge Guide Plate
    const rollerX = baseW / 2 - 0.15;
    const dischargePlate = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, convW), m.chromeMat);
    dischargePlate.position.set(rollerX - 0.22, convH + 0.06, convCenterZ);
    dischargePlate.rotation.z = -0.18;
    const crossShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, convW + 0.14, 12), m.chromeMat);
    crossShaft.rotation.x = Math.PI / 2;
    crossShaft.position.set(rollerX, convH + 0.22, convCenterZ);
    mGroup.add(dischargePlate, crossShaft);
    anim.rollers.push(crossShaft);

    [-convW / 2 - 0.05, convW / 2 + 0.05].forEach(bz => {
      const pBlock = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.06), m.darkSteel);
      pBlock.position.set(rollerX, convH + 0.22, convCenterZ + bz);
      mGroup.add(pBlock);
    });

    [-0.12, 0, 0.12].forEach(ringZ => {
      const holdRing = new THREE.Mesh(g.holdRing, m.whiteSpoutMat);
      holdRing.rotation.x = Math.PI / 2;
      holdRing.position.set(rollerX, convH + 0.22, convCenterZ + ringZ);
      mGroup.add(holdRing);
      anim.rollers.push(holdRing);
    });

    // Side Sample Spouted Pouch Display + Operator Push-Button Console (Red E-Stop)
    const samplePerch = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.22), m.chromeMat);
    samplePerch.position.set(3.40, convH + 0.02, convCenterZ + convW / 2 + 0.10);
    const samplePouch = createSpoutPouchMesh(res);
    samplePouch.position.set(3.40, convH + 0.035, convCenterZ + convW / 2 + 0.10);
    samplePouch.rotation.set(0, 0.18, 0);
    mGroup.add(samplePerch, samplePouch);

    const consolePanel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.16), m.aluminumFrame);
    consolePanel.position.set(rollerX + 0.18, convH + 0.24, convCenterZ + convW / 2 + 0.08);
    consolePanel.rotation.y = -0.32;
    const eStopBase = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 10), m.yellowBtnMat);
    eStopBase.rotation.x = Math.PI / 2;
    eStopBase.position.set(rollerX + 0.18, convH + 0.34, convCenterZ + convW / 2 + 0.18);
    const eStopBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.03, 10), m.redBtnMat);
    eStopBtn.rotation.x = Math.PI / 2;
    eStopBtn.position.set(rollerX + 0.18, convH + 0.34, convCenterZ + convW / 2 + 0.20);
    const grnBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8), m.greenLedMat);
    grnBtn.rotation.x = Math.PI / 2;
    grnBtn.position.set(rollerX + 0.18, convH + 0.22, convCenterZ + convW / 2 + 0.18);
    const bluBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 8), m.blueBtnMat);
    bluBtn.rotation.x = Math.PI / 2;
    bluBtn.position.set(rollerX + 0.18, convH + 0.14, convCenterZ + convW / 2 + 0.18);
    mGroup.add(consolePanel, eStopBase, eStopBtn, grnBtn, bluBtn);

    // 6. ARTICULATED PC MONITOR WORKSTATION (HMI Screen)
    const pcArmGroup = new THREE.Group();
    pcArmGroup.position.set(baseW / 2 + 0.15, baseH + 0.95, baseD / 2 - 0.25);

    const pcPost = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8), m.darkSteel);
    pcPost.position.set(baseW / 2 + 0.15, baseH + 0.475, baseD / 2 - 0.25);
    mGroup.add(pcPost);

    const pcArm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 8), m.darkSteel);
    pcArm1.rotation.z = Math.PI / 2;
    pcArm1.position.set(0.20, 0, 0);
    const pcArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.35, 8), m.darkSteel);
    pcArm2.position.set(0.40, 0.15, 0);
    const monitorBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.44, 0.06), m.darkSteel);
    monitorBody.position.set(0.40, 0.48, 0);
    monitorBody.rotation.y = -0.22;
    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.38), m.screenBgMat);
    screenFace.position.set(0.40, 0.48, 0.032);
    screenFace.rotation.y = -0.22;
    const ncaBar = new THREE.Mesh(new THREE.PlaneGeometry(0.60, 0.06), m.screenBarMat);
    ncaBar.position.set(0.40, 0.62, 0.035);
    ncaBar.rotation.y = -0.22;
    const kbTray = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.02, 0.24), m.darkSteel);
    kbTray.position.set(0.40, 0.22, 0.10);
    kbTray.rotation.y = -0.22;
    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.015, 0.16), m.charcoalMat);
    kbMesh.position.set(0.36, 0.23, 0.10);
    kbMesh.rotation.y = -0.22;
    pcArmGroup.add(pcArm1, pcArm2, monitorBody, screenFace, ncaBar, kbTray, kbMesh);
    mGroup.add(pcArmGroup);

    // 7. OPEN COLLECTION CARTON, ANIMATED SPOUT POUCHES & REAR BOX PALLET
    const packBox1 = createOpenCarton(0.95, 0.72, 0.85, res);
    packBox1.position.set(convCenterX + convL / 2 + 0.35, 0, convCenterZ);
    mGroup.add(packBox1);

    const spoutBeltZ = convCenterZ + 0.18;
    const packedTransforms = [
      { pos: [convCenterX + convL / 2 + 0.25, 0.20, spoutBeltZ - 0.08], rot: [-Math.PI / 2 + 0.20, 0.10, -0.15] },
      { pos: [convCenterX + convL / 2 + 0.42, 0.24, spoutBeltZ + 0.06], rot: [-Math.PI / 2 + 0.08, -0.22, 0.18] },
      { pos: [convCenterX + convL / 2 + 0.32, 0.28, spoutBeltZ],        rot: [-Math.PI / 2 - 0.10, 0.12, -0.05] }
    ];
    packedTransforms.forEach(pt => {
      const p = createSpoutPouchMesh(res);
      p.position.set(pt.pos[0], pt.pos[1], pt.pos[2]);
      p.rotation.set(pt.rot[0], pt.rot[1], pt.rot[2]);
      mGroup.add(p);
    });

    for (let i = 0; i < 4; i++) {
      const animPouch = createSpoutPouchMesh(res);
      animPouch.rotation.x = -Math.PI / 2;
      animPouch.position.set(2.30, anim.beltY, spoutBeltZ);
      mGroup.add(animPouch);
      anim.pouches.push(animPouch);
    }
    anim.beltZ = spoutBeltZ;

    // 2x2x2 Finished Carton Wooden Pallet behind Outfeed Conveyor
    const spoutPallet = createBoxPallet(res);
    spoutPallet.position.set(3.85, 0, -1.65);
    spoutPallet.rotation.y = -0.05;
    mGroup.add(spoutPallet);

    _animatedUnits.push(anim);
    return wrapper;
  }

  // ---------------------------------------------------------------------------
  // Build Blueprint-Aligned Hall 2 Spout Arrays (Center 1SP 01-07 & South 08-09)
  // ---------------------------------------------------------------------------
  function buildArray(group, r, mats, itemType) {
    const res = getSharedResources(mats);
    const pxToX = px => (px - 1050) * 0.1 - r.x;
    const pyToZ = py => (py - 760) * 0.1 - r.z;

    const stations = itemType === "spout_array_south"
      ? [
          { px: 712, py: 1070 }, // 1SP-08 (Bottom-Left West under BM 09)
          { px: 774, py: 1070 }  // 1SP-09 (Bottom-Left East under BM 09)
        ]
      : [
          { px: 782, py: 865 }, // 1SP-02
          { px: 854, py: 865 }, // 1SP-01
          { px: 734, py: 903 }, // 1SP-03
          { px: 790, py: 903 }, // 1SP-04
          { px: 846, py: 903 }, // 1SP-05
          { px: 904, py: 903 }, // 1SP-06
          { px: 962, py: 903 }  // 1SP-07
        ];

    stations.forEach((st, idx) => {
      const unit = buildSingleSpoutMachine(idx, res);
      // Scale cleanly to 4.42m x 2.52m x 2.09m so AS-1/AS-2, staggered walls, Row 1 & Row 2 fit with zero collision
      unit.scale.set(0.58, 0.70, 0.58);
      unit.position.set(pxToX(st.px), 0, pyToZ(st.py));
      group.add(unit);
    });
  }

  function resetAnimations() {
    _animatedUnits = [];
  }

  let _lastTime = 0;
  let _clock = 0;
  function updateAnimations() {
    if (_animatedUnits.length === 0) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = _lastTime ? Math.min(0.05, (now - _lastTime) * 0.001) : 0.016;
    _lastTime = now;
    _clock += dt;

    for (let ui = 0; ui < _animatedUnits.length; ui++) {
      const a = _animatedUnits[ui];
      const t = _clock + a.phaseOffset;

      if (a.hornGroup) {
        a.hornGroup.position.y = a.hornBaseY - Math.abs(Math.sin(t * 3.4)) * 0.08;
      }
      if (a.bowlOuter) {
        a.bowlOuter.rotation.y += dt * 0.45;
      }
      for (let ri = 0; ri < a.rollers.length; ri++) {
        a.rollers[ri].rotation.y -= dt * 2.2;
      }

      const startX = 2.30;
      const endX = a.convEndX;
      const cartonX = a.cartonX;
      const beltY = a.beltY;
      const dropY = 0.32;
      const count = a.pouches.length;

      for (let pi = 0; pi < count; pi++) {
        const p = a.pouches[pi];
        const u = ((t * 0.24) + pi / count) % 1.0;

        if (u < 0.74) {
          const frac = u / 0.74;
          p.position.set(startX + (endX - startX) * frac, beltY, a.beltZ);
          p.rotation.set(-Math.PI / 2, 0, -0.06);
          const s = frac < 0.08 ? 0.25 + 0.75 * (frac / 0.08) : 1.0;
          p.scale.set(s, s, s);
          p.visible = true;
        } else if (u < 0.94) {
          const frac = (u - 0.74) / 0.20;
          p.position.set(
            endX + (cartonX - endX) * frac,
            beltY - (beltY - dropY) * (frac * frac),
            a.beltZ + 0.02 * Math.sin(frac * Math.PI)
          );
          p.rotation.set(-Math.PI / 2 + 0.80 * frac, 0.12 * frac, -0.20 * frac);
          p.scale.set(1, 1, 1);
          p.visible = true;
        } else {
          const frac = (u - 0.94) / 0.06;
          const s = Math.max(0.05, 1.0 - frac * 0.95);
          p.position.set(cartonX, dropY, a.beltZ);
          p.rotation.set(-Math.PI / 2 + 0.80, 0.12, -0.20);
          p.scale.set(s, s, s);
          p.visible = frac < 0.9;
        }
      }
    }
  }

  return {
    buildArray,
    resetAnimations,
    updateAnimations
  };
})();
