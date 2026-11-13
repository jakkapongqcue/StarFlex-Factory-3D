// ============================================================================
// Module: src/builders/machines/converting/slitter.model.js
// Upgraded Procedural 3D Model for High-Speed Duplex Slitter Rewinders (VENUS III)
// Ported & optimized from StarFlexERP3D (js/machines/slit.js) with shared
// textures, materials & geometries across all Slitter zones (Hall 1 & Hall 2):
//   - Left Column: Touchscreen HMI console, E-Stop mushroom, grab handle & decals
//   - Right Column: Vertical blue "VENUS III" branding, Shaft [1]/[2] badges, swivel foot
//   - Top Tapered Canopy Hood with under-hood LED task light & diagonal rear struts
//   - Front Output: Dual stationary chrome friction shafts + 2 rotating Hygiene slit rolls
//     with mechanical swing arms, pneumatic cylinders & rubber lay-on contact rollers
//   - Center Bridge: Rotary slitter shear blades, micrometer dials & edge-trim chutes
//   - Rear Input: Hydraulic lift arms, disc brakes & large Master Unwind Hygiene roll
//   - Foreground: 3-tier pallet of slit film rolls with kraft cardboard interlayers
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.ConvertingModels = window.Starflex3D.Builders.ConvertingModels || {};

window.Starflex3D.Builders.ConvertingModels.Slitter = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  let _cachedRes = null;
  let _animatedSlitters = [];

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

  // ---------------------------------------------------------------------------
  // Procedural Canvas Textures
  // ---------------------------------------------------------------------------
  function createVenusRightColTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 256, 1024);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 1016);

    ctx.save();
    ctx.translate(138, 492);
    ctx.rotate(-Math.PI / 2);
    ctx.font = 'bold 54px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = "#0284c7";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VENUS III", 0, 0);
    ctx.restore();

    // Vertical red precision optical guide line
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(18, 120, 6, 780);

    // Shaft position badges [1] & [2]
    [
      { y: 270, label: "1" },
      { y: 600, label: "2" }
    ].forEach(b => {
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      drawRoundedRect(ctx, 40, b.y, 48, 48, 8);
      ctx.fill();
      ctx.font = 'bold 32px "Segoe UI", sans-serif';
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.label, 64, b.y + 24);
    });

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(40, 780, 80, 50);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(48, 790, 64, 12);

    return new THREE.CanvasTexture(canvas);
  }

  function createSlitHmiTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#020617";
    ctx.fillRect(20, 20, 472, 310);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(20, 20, 472, 44);
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("STARFLEX VENUS III · SLITTER", 34, 50);

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    drawRoundedRect(ctx, 390, 28, 88, 28, 6);
    ctx.fill();
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.fillText("AUTO OK", 400, 48);

    ctx.font = 'bold 42px "Consolas", monospace';
    ctx.fillStyle = "#0ea5e9";
    ctx.fillText("450 m/min", 36, 120);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(36, 170, 210, 65);
    ctx.fillRect(266, 170, 210, 65);
    ctx.fillStyle = "#38bdf8";
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText("UNWIND: 240 N", 46, 208);
    ctx.fillText("REWIND: 185 N", 276, 208);

    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(36, 290);
    for (let x = 36; x < 476; x += 20) {
      ctx.lineTo(x, 285 + Math.sin(x * 0.08) * 12);
    }
    ctx.stroke();

    ctx.fillStyle = "#334155";
    ctx.fillRect(20, 345, 472, 145);
    [
      { x: 80, c: "#10b981" },
      { x: 160, c: "#0f172a" },
      { x: 240, c: "#f59e0b" }
    ].forEach(b => {
      ctx.fillStyle = b.c;
      ctx.beginPath();
      ctx.arc(b.x, 415, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    return new THREE.CanvasTexture(canvas);
  }

  function createWarningDecalTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.moveTo(64, 12);
    ctx.lineTo(120, 112);
    ctx.lineTo(8, 112);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.font = 'bold 54px Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", 64, 76);

    return new THREE.CanvasTexture(canvas);
  }

  function createSlitterFilmTexture() {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    for (let u = 0; u < 2; u++) {
      const ox = u * 256;
      ctx.fillStyle = "#9d174d";
      ctx.fillRect(ox, 0, 116, 256);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(ox + 16, 165, 84, 42);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(ox + 114, 0, 8, 256);

      const gradFront = ctx.createLinearGradient(ox + 122, 0, ox + 256, 256);
      gradFront.addColorStop(0, "#0284c7");
      gradFront.addColorStop(0.4, "#38bdf8");
      gradFront.addColorStop(0.7, "#fdf2f8");
      gradFront.addColorStop(1, "#fbcfe8");
      ctx.fillStyle = gradFront;
      ctx.fillRect(ox + 122, 0, 134, 256);

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      safeEllipse(ctx, ox + 190, 130, 56, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#be185d";
      ctx.fillRect(ox + 122, 206, 134, 50);

      ctx.fillStyle = "#172554";
      ctx.font = 'bold italic 22px Georgia, serif';
      ctx.textAlign = "center";
      ctx.fillText("Hygiene", ox + 190, 62);

      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(ox + 185, 132, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }

  function getSharedResources(mats) {
    if (_cachedRes) return _cachedRes;

    const venusColTex = createVenusRightColTexture();
    const hmiTex = createSlitHmiTexture();
    const warnTex = createWarningDecalTexture();
    const filmTex = createSlitterFilmTexture();

    const upRollSideMat = filmTex
      ? new THREE.MeshStandardMaterial({ map: filmTex, roughness: 0.28, metalness: 0.12 })
      : new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.30 });
    const upRollFaceMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.45 });

    const m = {
      whiteSteel: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.12 }),
      frameGrey: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.45, metalness: 0.30 }),
      darkSteel: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.50, metalness: 0.35 }),
      charcoalMat: mats.machineDark || new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.65 }),
      chromeMat: mats.chromeRoll || new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.18 }),
      rubberMat: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 }),
      yellowArmMat: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.40 }),
      bronzeMat: new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.60, roughness: 0.35 }),
      redMat: new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
      taskLightMat: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      woodMat: new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.85 }),
      woodBlockMat: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 }),
      kraftSheetMat: new THREE.MeshStandardMaterial({ color: 0xc89d68, roughness: 0.88 }),
      filmWebMat: filmTex
        ? new THREE.MeshStandardMaterial({ map: filmTex, roughness: 0.28, metalness: 0.12, side: THREE.DoubleSide })
        : new THREE.MeshStandardMaterial({ color: 0xec4899, side: THREE.DoubleSide }),
      rollMaterials: [upRollSideMat, upRollFaceMat, upRollFaceMat],
      venusDecalMat: venusColTex
        ? new THREE.MeshBasicMaterial({ map: venusColTex, transparent: true })
        : new THREE.MeshBasicMaterial({ color: 0x0284c7 }),
      hmiMat: hmiTex
        ? new THREE.MeshBasicMaterial({ map: hmiTex })
        : new THREE.MeshBasicMaterial({ color: 0x0284c7 }),
      warnMat: warnTex
        ? new THREE.MeshBasicMaterial({ map: warnTex, transparent: true })
        : new THREE.MeshBasicMaterial({ color: 0xfacc15 })
    };

    const g = {
      frictionRing: new THREE.CylinderGeometry(0.105, 0.105, 0.06, 10),
      slitRoll: new THREE.CylinderGeometry(0.38, 0.38, 0.78, 20),
      masterRoll: new THREE.CylinderGeometry(0.65, 0.65, 2.40, 22),
      stackRoll: new THREE.CylinderGeometry(0.30, 0.30, 0.42, 16),
      stackCore: new THREE.CylinderGeometry(0.10, 0.10, 0.425, 10),
      swingArm: new THREE.BoxGeometry(0.06, 0.62, 0.48),
      layonRoller: new THREE.CylinderGeometry(0.065, 0.065, 0.84, 12),
      cardboardSheet: new THREE.BoxGeometry(1.66, 0.025, 1.66)
    };

    _cachedRes = { m, g };
    return _cachedRes;
  }

  // ---------------------------------------------------------------------------
  // Single High-Speed Duplex Slitter Rewinder (VENUS III)
  // ---------------------------------------------------------------------------
  function buildSingleSlitter(idx, res) {
    const { m, g } = res;
    const mGroup = new THREE.Group();
    const anim = { rolls: [] };

    // 1. Machine Foundation Slab & Precision Rails
    const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.22, 3.6), m.charcoalMat);
    baseSlab.position.set(0, 0.11, -0.2);
    addEdges(baseSlab, 0x1e293b, 0.6);
    mGroup.add(baseSlab);

    [0.95, 1.15].forEach(rz => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.4, 10), m.chromeMat);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, 0.12, rz);
      mGroup.add(rail);
    });

    // 2. Left Column (Touchscreen HMI, E-Stop, Grab Handle) & Right Column ("VENUS III")
    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.35, 1.8), m.whiteSteel);
    leftCol.position.set(-2.35, 1.78, 0);
    addEdges(leftCol, 0x94a3b8, 0.55);
    const leftInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 1.6), m.frameGrey);
    leftInner.position.set(-1.95, 1.78, 0);
    mGroup.add(leftCol, leftInner);

    const hmiBezel = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.04), m.darkSteel);
    hmiBezel.position.set(-2.35, 2.25, 0.91);
    const hmiDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.58), m.hmiMat);
    hmiDisplay.position.set(-2.35, 2.25, 0.935);
    mGroup.add(hmiBezel, hmiDisplay);

    const estopCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 12), m.yellowArmMat);
    estopCollar.rotation.x = Math.PI / 2;
    estopCollar.position.set(-2.15, 1.80, 0.92);
    const estopKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12), m.redMat);
    estopKnob.rotation.x = Math.PI / 2;
    estopKnob.position.set(-2.15, 1.80, 0.94);
    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.44, 8), m.chromeMat);
    handleBar.rotation.z = Math.PI / 2;
    handleBar.position.set(-2.35, 1.45, 0.94);
    mGroup.add(estopCollar, estopKnob, handleBar);

    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.35, 1.8), m.whiteSteel);
    rightCol.position.set(2.35, 1.78, 0);
    addEdges(rightCol, 0x94a3b8, 0.55);
    const rightInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 1.6), m.frameGrey);
    rightInner.position.set(1.95, 1.78, 0);
    const rightColDecal = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 3.2), m.venusDecalMat);
    rightColDecal.position.set(2.35, 1.78, 0.91);
    mGroup.add(rightCol, rightInner, rightColDecal);

    // Bottom swivel socket on Right Column
    const swivelBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.18, 12), m.darkSteel);
    swivelBase.position.set(1.95, 0.18, 1.15);
    const swivelCup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12, 10), m.bronzeMat);
    swivelCup.position.set(1.95, 0.26, 1.15);
    mGroup.add(swivelBase, swivelCup);

    // 3. Top Tapered Canopy Hood + Task Light + Rear Struts
    const hoodGroup = new THREE.Group();
    hoodGroup.position.set(0, 3.48, 0.35);
    const hoodMain = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.42, 1.2), m.whiteSteel);
    addEdges(hoodMain, 0x94a3b8, 0.5);
    const hoodLip = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.14, 0.45), m.whiteSteel);
    hoodLip.position.set(0, 0.14, 0.45);
    hoodLip.rotation.x = 0.35;
    const taskLight = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 0.18), m.taskLightMat);
    taskLight.position.set(0, -0.21, 0.15);
    hoodGroup.add(hoodMain, hoodLip, taskLight);
    mGroup.add(hoodGroup);

    [-1.95, 1.95].forEach(sx => {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 1.35), m.frameGrey);
      strut.position.set(sx, 3.42, -0.35);
      strut.rotation.x = -0.32;
      mGroup.add(strut);
    });

    // 4. Dual Output Rewind Shafts + 2 Rotating Hygiene Slit Rolls + Lay-On Swing Arms
    const rollWidth = 0.78;
    const shaftLength = 3.9;

    [1.50, 2.10].forEach(ry => {
      const guideRail = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.08, 0.06), m.darkSteel);
      guideRail.position.set(0, ry, -0.05);
      mGroup.add(guideRail);
    });

    const stations = [
      { y: 2.35, z: 0.42, rollX: 0.65, dir: 1 },
      { y: 1.25, z: 0.65, rollX: -0.65, dir: -1 }
    ];

    stations.forEach(st => {
      const shaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, shaftLength, 12), m.chromeMat);
      shaftCore.rotation.z = Math.PI / 2;
      shaftCore.position.set(0, st.y, st.z);
      mGroup.add(shaftCore);

      for (let sx = -1.62; sx <= 1.62; sx += 0.36) {
        if (sx >= st.rollX - rollWidth / 2 && sx <= st.rollX + rollWidth / 2) continue;
        const ring = new THREE.Mesh(g.frictionRing, m.chromeMat);
        ring.rotation.z = Math.PI / 2;
        ring.position.set(sx, st.y, st.z);
        mGroup.add(ring);
      }

      const rollGroup = new THREE.Group();
      rollGroup.position.set(st.rollX, st.y, st.z);
      rollGroup.rotation.z = Math.PI / 2;
      const rollSpinGroup = new THREE.Group();
      const rollMesh = new THREE.Mesh(g.slitRoll, m.rollMaterials);
      rollSpinGroup.add(rollMesh);
      [-rollWidth / 2 - 0.02, rollWidth / 2 + 0.02].forEach(cy => {
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 12), m.chromeMat);
        collar.position.y = cy;
        rollSpinGroup.add(collar);
      });
      rollGroup.add(rollSpinGroup);
      mGroup.add(rollGroup);
      anim.rolls.push(rollSpinGroup);

      // Lay-On Swing Arms + Contact Roller
      const layonGroup = new THREE.Group();
      layonGroup.position.set(st.rollX, st.y, 0);
      [-rollWidth / 2 - 0.08, rollWidth / 2 + 0.08].forEach(ax => {
        const arm = new THREE.Mesh(g.swingArm, m.frameGrey);
        arm.position.set(ax, st.dir * 0.28, st.dir > 0 ? 0.24 : 0.42);
        arm.rotation.x = -st.dir * 0.42;
        const cylBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 8), m.darkSteel);
        cylBody.position.set(ax, st.dir * 0.50, st.dir > 0 ? 0.05 : 0.20);
        cylBody.rotation.x = -st.dir * 0.85;
        layonGroup.add(arm, cylBody);
      });
      const contactRoller = new THREE.Mesh(g.layonRoller, m.rubberMat);
      contactRoller.rotation.z = Math.PI / 2;
      contactRoller.position.set(0, st.dir * 0.44, st.z);
      layonGroup.add(contactRoller);
      mGroup.add(layonGroup);
    });

    [1.75, 2.05].forEach(gy => {
      const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 3.8, 12), m.rubberMat);
      idler.rotation.z = Math.PI / 2;
      idler.position.set(0, gy, 0.12);
      mGroup.add(idler);
    });

    // 5. Intermediate Bridge & Rotary Slitter Knives
    [-1.94, 1.94].forEach(cx => {
      const sidePlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.2, 1.8), m.frameGrey);
      sidePlate.position.set(cx, 1.55, -0.65);
      mGroup.add(sidePlate);
    });

    const anvilShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.8, 12), m.darkSteel);
    anvilShaft.rotation.z = Math.PI / 2;
    anvilShaft.position.set(0, 1.85, -0.22);
    mGroup.add(anvilShaft);

    [-0.65, 0, 0.65].forEach(kx => {
      const blade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.035, 14), m.chromeMat);
      blade.rotation.z = Math.PI / 2;
      blade.position.set(kx, 1.95, -0.22);
      const holder = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.18), m.darkSteel);
      holder.position.set(kx, 2.12, -0.22);
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8), m.bronzeMat);
      dial.position.set(kx, 2.28, -0.22);
      mGroup.add(blade, holder, dial);
    });

    // 6. Rear Input Master Unwind Roll + Hydraulic Lift Arms + Disc Brakes
    [-1.52, 1.52].forEach(ux => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.15, 1.45), m.frameGrey);
      arm.position.set(ux, 1.35, -1.25);
      const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 14), m.darkSteel);
      brakeDisc.rotation.z = Math.PI / 2;
      brakeDisc.position.set(ux + (ux > 0 ? 0.16 : -0.16), 1.65, -1.55);
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.26), m.yellowArmMat);
      caliper.position.set(ux + (ux > 0 ? 0.16 : -0.16), 1.95, -1.55);
      mGroup.add(arm, brakeDisc, caliper);
    });

    const masterCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.85, 12), m.darkSteel);
    masterCore.rotation.z = Math.PI / 2;
    masterCore.position.set(0, 1.65, -1.55);
    mGroup.add(masterCore);

    const masterRollGroup = new THREE.Group();
    masterRollGroup.position.set(0, 1.65, -1.55);
    masterRollGroup.rotation.z = Math.PI / 2;
    const masterSpinGroup = new THREE.Group();
    const masterRollMesh = new THREE.Mesh(g.masterRoll, m.rollMaterials);
    masterSpinGroup.add(masterRollMesh);
    [-1.22, 1.22].forEach(cy => {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 14), m.chromeMat);
      disc.position.y = cy;
      masterSpinGroup.add(disc);
    });
    masterRollGroup.add(masterSpinGroup);
    mGroup.add(masterRollGroup);
    anim.rolls.push(masterSpinGroup);

    // Running Printed Film Webs (Unwind -> Slitter -> Upper & Lower Rewind Rolls)
    const webTop = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.015, 1.25), m.filmWebMat);
    webTop.position.set(0, 2.32, -0.85);
    webTop.rotation.x = 0.25;
    const webUpper = new THREE.Mesh(new THREE.BoxGeometry(rollWidth, 0.012, 0.55), m.filmWebMat);
    webUpper.position.set(0.65, 2.10, 0.18);
    webUpper.rotation.x = 0.65;
    const webLower = new THREE.Mesh(new THREE.BoxGeometry(rollWidth, 0.012, 0.72), m.filmWebMat);
    webLower.position.set(-0.65, 1.55, 0.25);
    webLower.rotation.x = -0.55;
    mGroup.add(webTop, webUpper, webLower);

    // 7. Foreground Square Pallet with 3 Tiers of Slit Film Rolls & Cardboard Interlayers
    const palX = 1.45;
    const palZ = 2.65;
    const palletSize = 1.72;
    const palH = 0.16;

    const palletDeck = new THREE.Mesh(new THREE.BoxGeometry(palletSize, 0.08, palletSize), m.woodMat);
    palletDeck.position.set(palX, 0.12, palZ);
    mGroup.add(palletDeck);
    [-0.68, 0, 0.68].forEach(bx => {
      const runner = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, palletSize), m.woodBlockMat);
      runner.position.set(palX + bx, 0.04, palZ);
      mGroup.add(runner);
    });

    let curY = palH;
    const gridOffsets = [-0.42, 0.42];
    for (let tier = 0; tier < 3; tier++) {
      const sheet = new THREE.Mesh(g.cardboardSheet, m.kraftSheetMat);
      sheet.position.set(palX, curY + 0.0125, palZ);
      mGroup.add(sheet);
      curY += 0.025;

      const rollY = curY + 0.21;
      gridOffsets.forEach((ox, rIdx) => {
        gridOffsets.forEach((oz, cIdx) => {
          const sRoll = new THREE.Mesh(g.stackRoll, m.rollMaterials);
          sRoll.position.set(palX + ox, rollY, palZ + oz);
          sRoll.rotation.y = idx + tier * 1.8 + rIdx * 2.2 + cIdx * 1.4;
          const sCore = new THREE.Mesh(g.stackCore, m.darkSteel);
          sCore.position.set(palX + ox, rollY, palZ + oz);
          mGroup.add(sRoll, sCore);
        });
      });
      curY += 0.42;
    }

    _animatedSlitters.push(anim);
    return mGroup;
  }

  // ---------------------------------------------------------------------------
  // Build Slitter Array / Group within Zone Bounds
  // ---------------------------------------------------------------------------
  function buildArray(group, itemType, r, mats) {
    const res = getSharedResources(mats);
    if (itemType === "slitter_group") {
      // Hall 4 Blown Film Rewinder Group (03 · REW)
      const count = 4;
      for (let i = 0; i < count; i++) {
        const mx = -r.w * 0.375 + (r.w * 0.75 * i) / (count - 1);
        const slitter = buildSingleSlitter(i, res);
        slitter.scale.set(0.43, 0.62, 0.46);
        slitter.position.set(mx, 0, -0.35);
        group.add(slitter);
      }
      return;
    }

    // Hall 2 Slitter Zone + Right-Side Group + Horizontal BM 09 (Blueprint Aligned)
    const pxToX = px => (px - 1050) * 0.1 - r.x;
    const pyToZ = py => (py - 760) * 0.1 - r.z;

    const slitterPlacements = [
      // Bottom Red Box — Top Row (Left -> Right, safely east of px=674 wall)
      { px: 694,  py: 946, s: 0.48 }, // SM 01
      { px: 740,  py: 946, s: 0.48 }, // 2SM 17
      { px: 782,  py: 946, s: 0.48 }, // SM 15
      { px: 816,  py: 946, s: 0.48 }, // SM 06
      { px: 850,  py: 946, s: 0.48 }, // 1SM 19
      { px: 884,  py: 946, s: 0.48 }, // 1SM 20
      { px: 918,  py: 946, s: 0.48 }, // SM 11
      { px: 952,  py: 946, s: 0.48 }, // SM 12
      // Bottom Red Box — Second Row (under 1SM 19)
      { px: 850,  py: 994, s: 0.46 }, // 2RW 18
      // Right Side Outside Red Box (above Training, safely west of px=1062 wall)
      { px: 1040, py: 918, s: 0.40 }, // SH 01
      { px: 1004, py: 932, s: 0.42 }, // SM 08
      { px: 1004, py: 966, s: 0.42 }, // SM 07
      { px: 1030, py: 996, s: 0.40 }  // SM13
    ];

    slitterPlacements.forEach((p, idx) => {
      const slitter = buildSingleSlitter(idx, res);
      slitter.scale.set(p.s, Math.min(0.64, p.s + 0.14), p.s);
      slitter.position.set(pxToX(p.px), 0, pyToZ(p.py));
      group.add(slitter);
    });

    // Horizontal BM 09 Bag Making Line at Bottom-Left inside Bottom Red Box (left edge >= px 688)
    const BagMaking = window.Starflex3D.Builders.ConvertingModels.BagMaking;
    if (BagMaking && typeof BagMaking.buildSingle === "function") {
      const bm09 = BagMaking.buildSingle(13, mats);
      const lenScale = 0.72;
      bm09.scale.set(lenScale, 0.94, 0.74);
      // Unwind local left edge at -4.78*lenScale -> placed so left end sits at px = 688 (safely inside px=674 wall)
      bm09.position.set(pxToX(688) + 4.78 * lenScale, 0, pyToZ(1024));
      group.add(bm09);
    }
  }

  function resetAnimations() {
    _animatedSlitters = [];
  }

  let _lastSlitTime = 0;
  function updateAnimations() {
    if (_animatedSlitters.length === 0) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = _lastSlitTime ? Math.min(0.05, (now - _lastSlitTime) * 0.001) : 0.016;
    _lastSlitTime = now;

    for (let i = 0; i < _animatedSlitters.length; i++) {
      const rolls = _animatedSlitters[i].rolls;
      for (let ri = 0; ri < rolls.length; ri++) {
        // Spin strictly around CylinderGeometry's local Y shaft axis (-dt feeds web forward +Z)
        rolls[ri].rotation.y -= dt * (ri === 2 ? 0.9 : 1.5);
      }
    }
  }

  return {
    buildArray,
    resetAnimations,
    updateAnimations
  };
})();
