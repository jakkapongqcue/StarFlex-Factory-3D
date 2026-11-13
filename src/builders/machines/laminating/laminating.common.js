// ============================================================================
// Module: src/builders/machines/laminating/laminating.common.js
// Shared PBR materials and Canvas textures for Laminating machine models
// (BOBST VISIONLAM 800 LB-10 & 1LB-09).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.LaminatingModels = window.Starflex3D.Builders.LaminatingModels || {};

window.Starflex3D.Builders.LaminatingModels.Common = (function () {
  const _cachedHeaderTextures = {};
  const _cachedHMITextures = {};
  let _cachedPBTex = null;
  let _cachedGoldFilmTex = null;
  let _cachedBlueFilmTex = null;

  /**
   * Shared PBR material set for Bobst Laminator enclosures & mechanics
   */
  function createBobstMaterials(mats) {
    return {
      offWhiteMat: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.40,
        metalness: 0.16
      }),
      studioWhiteMat: new THREE.MeshStandardMaterial({
        color: 0xeef2f6,
        roughness: 0.35,
        metalness: 0.12
      }),
      midGrayMat: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.45,
        metalness: 0.35
      }),
      darkFrameMat: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.55,
        metalness: 0.28
      }),
      plinthMat: mats.machineDark || new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.75,
        metalness: 0.12
      }),
      chromeMat: mats.chromeRoll || new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.12,
        metalness: 0.95
      }),
      rubberMat: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.85,
        metalness: 0.05
      }),
      beaconOrangeMat: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0xd97706,
        emissiveIntensity: 0.65
      }),
      ductGalvMat: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.38,
        metalness: 0.65
      }),
      safetyGreenMat: new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        emissive: 0x16a34a,
        emissiveIntensity: 0.8
      }),
      glassWindowMat: new THREE.MeshPhysicalMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.42,
        roughness: 0.1,
        metalness: 0.1
      }),
      printedGoldMat: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.35,
        side: THREE.DoubleSide,
        map: getPrintedGoldFilmTexture() || undefined
      }),
      bluePatternWebMat: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.22,
        metalness: 0.15,
        side: THREE.DoubleSide,
        map: getBluePatternFilmTexture() || undefined
      }),
      clearFilmMat: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      })
    };
  }

  function getBobstHeaderTexture(machineCode, variant = "lb10") {
    const code = machineCode || "LB-10";
    const key = `${variant}_${code}`;
    if (_cachedHeaderTextures[key]) return _cachedHeaderTextures[key];
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (variant === "lb09") {
      // Studio off-white fascia matching 1LB-09 photo
      ctx.fillStyle = "#eef2f6";
      ctx.fillRect(0, 0, 1024, 128);

      // Subtle top/bottom chamfer lines & vertical module seam
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 5);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, 122, 1024, 6);
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(365, 6, 3, 116);

      // Left model branding: "VISION" bold + "LAM 800" regular
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      ctx.font = 'bold 34px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.fillText("VISION", 62, 56);
      ctx.fillStyle = "#334155";
      ctx.font = '500 34px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.fillText("LAM 800", 188, 56);

      // Compact blue ID badge in middle-left
      const badgeX = 415;
      const badgeY = 30;
      const badgeW = 132;
      const badgeH = 54;
      ctx.fillStyle = "#0284c7";
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
        ctx.fill();
      } else {
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 28px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(code, badgeX + badgeW * 0.5, badgeY + badgeH * 0.52);

      // BOBST Logo over right section: Red Brand Square + Bold BOBST
      const redSquareX = 638;
      const redSquareY = 38;
      const redSquareSize = 36;
      ctx.fillStyle = "#e11d48";
      ctx.fillRect(redSquareX, redSquareY, redSquareSize, redSquareSize);

      ctx.fillStyle = "#0f172a";
      ctx.font = '900 44px "Montserrat", "Arial Black", sans-serif';
      ctx.textAlign = "left";
      ctx.fillText("BOBST", redSquareX + redSquareSize + 16, 56);

      // Bottom edge ventilation louver clusters (as in photo)
      const louverPositions = [180, 315, 480, 620, 770, 910];
      louverPositions.forEach(lx => {
        ctx.fillStyle = "#64748b";
        for (let s = 0; s < 4; s++) {
          ctx.fillRect(lx, 94 + s * 6, 30, 3);
        }
      });
    } else if (variant === "rear_d800") {
      // Rear fascia for NOVALAM D 800 (NOVA D 800 LAMINATOR + BOBST)
      ctx.fillStyle = "#eef2f6";
      ctx.fillRect(0, 0, 1024, 128);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 5);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, 122, 1024, 6);

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      ctx.font = 'bold 34px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.fillText("NOVA D 800", 54, 56);
      ctx.fillStyle = "#334155";
      ctx.font = '500 32px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.fillText("LAMINATOR", 268, 56);

      const redSquareX = 638;
      const redSquareY = 38;
      const redSquareSize = 36;
      ctx.fillStyle = "#e11d48";
      ctx.fillRect(redSquareX, redSquareY, redSquareSize, redSquareSize);

      ctx.fillStyle = "#0f172a";
      ctx.font = '900 44px "Montserrat", "Arial Black", sans-serif';
      ctx.fillText("BOBST", redSquareX + redSquareSize + 16, 56);

      [140, 340, 520, 720, 900].forEach(lx => {
        ctx.fillStyle = "#64748b";
        for (let s = 0; s < 4; s++) {
          ctx.fillRect(lx, 94 + s * 6, 30, 3);
        }
      });
    } else {
      // LB-10 Studio NOVALAM 800 header beam (matching uploaded photos)
      ctx.fillStyle = "#eef2f6";
      ctx.fillRect(0, 0, 1024, 128);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 5);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, 122, 1024, 6);
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(510, 6, 3, 116);

      // Left: "NOVA" bold + "LAM 800" regular
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0f172a";
      ctx.font = 'bold 36px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.fillText("NOVA", 64, 56);
      ctx.fillStyle = "#334155";
      ctx.font = '500 36px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.fillText("LAM 800", 174, 56);

      // Compact blue badge: "LB-10"
      const badgeX = 376;
      const badgeY = 30;
      const badgeW = 112;
      const badgeH = 52;
      ctx.fillStyle = "#0284c7";
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
        ctx.fill();
      } else {
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 28px "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(code, badgeX + badgeW * 0.5, badgeY + badgeH * 0.52);

      // Right: Red Square + bold "BOBST"
      const redSquareX = 630;
      const redSquareY = 36;
      const redSquareSize = 40;
      ctx.fillStyle = "#e11d48";
      ctx.fillRect(redSquareX, redSquareY, redSquareSize, redSquareSize);

      ctx.fillStyle = "#0f172a";
      ctx.font = '900 48px "Montserrat", "Arial Black", sans-serif';
      ctx.textAlign = "left";
      ctx.fillText("BOBST", redSquareX + redSquareSize + 18, 56);

      // Bottom edge ventilation louvers (4 clusters matching front photo)
      [110, 440, 560, 880].forEach(lx => {
        ctx.fillStyle = "#64748b";
        for (let s = 0; s < 4; s++) {
          ctx.fillRect(lx, 94 + s * 6, 32, 3);
        }
      });
    }

    const tex = new THREE.CanvasTexture(canvas);
    _cachedHeaderTextures[key] = tex;
    return tex;
  }

  let _cachedEndLogoTex = null;
  function getBobstEndLogoTexture() {
    if (_cachedEndLogoTex) return _cachedEndLogoTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#eef2f6";
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 5);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(0, 122, 512, 6);

    const redSquareX = 115;
    const redSquareY = 40;
    const redSquareSize = 44;
    ctx.fillStyle = "#e11d48";
    ctx.fillRect(redSquareX, redSquareY, redSquareSize, redSquareSize);

    ctx.fillStyle = "#0f172a";
    ctx.font = '900 52px "Montserrat", "Arial Black", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("BOBST", redSquareX + redSquareSize + 18, 62);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedEndLogoTex = tex;
    return tex;
  }

  function getBobstHMITexture(jobLabel = "MET-PET 12µm / LLDPE 30µm") {
    if (_cachedHMITextures[jobLabel]) return _cachedHMITextures[jobLabel];
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(8, 8, 496, 38);

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(26, 27, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText("BOBST HMI · VISIONLAM 800", 44, 32);

    ctx.fillStyle = "#38bdf8";
    ctx.font = 'bold 16px "Consolas", monospace';
    ctx.fillText("450 m/min", 380, 32);

    ctx.fillStyle = "#334155";
    ctx.fillRect(8, 52, 496, 26);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = '12px "Consolas", monospace';
    ctx.fillText(`JOB: ${jobLabel} | NIP: 4.8 bar`, 18, 69);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(8, 84, 244, 150);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    for (let gy = 100; gy < 230; gy += 25) {
      ctx.beginPath();
      ctx.moveTo(12, gy);
      ctx.lineTo(248, gy);
      ctx.stroke();
    }
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(16, 175);
    ctx.lineTo(60, 140);
    ctx.lineTo(110, 155);
    ctx.lineTo(170, 125);
    ctx.lineTo(240, 135);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = 'bold 12px "Consolas", monospace';
    ctx.fillText("UNWIND TENSION: 165 N", 16, 218);

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(260, 84, 244, 150);

    const zones = [
      { name: "ZONE 1 (AIR)", temp: "85°C", pct: 0.72, col: "#22c55e" },
      { name: "ZONE 2 (DRY)", temp: "95°C", pct: 0.82, col: "#38bdf8" },
      { name: "ZONE 3 (CURE)", temp: "105°C", pct: 0.92, col: "#f59e0b" }
    ];

    zones.forEach((z, idx) => {
      const zy = 100 + idx * 42;
      ctx.fillStyle = "#cbd5e1";
      ctx.font = '11px "Consolas", monospace';
      ctx.fillText(`${z.name}: ${z.temp}`, 270, zy);

      ctx.fillStyle = "#334155";
      ctx.fillRect(270, zy + 6, 220, 14);
      ctx.fillStyle = z.col;
      ctx.fillRect(270, zy + 6, 220 * z.pct, 14);
    });

    const buttons = [
      { text: "START", col: "#15803d" },
      { text: "STOP", col: "#b91c1c" },
      { text: "JOG", col: "#475569" },
      { text: "AUTO NIP", col: "#0284c7" },
      { text: "CLEAN", col: "#475569" }
    ];
    const btnW = 92;
    buttons.forEach((b, i) => {
      const bx = 12 + i * 98;
      ctx.fillStyle = b.col;
      ctx.fillRect(bx, 246, btnW, 64);
      ctx.fillStyle = "#ffffff";
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(b.text, bx + btnW * 0.5, 283);
    });

    const tex = new THREE.CanvasTexture(canvas);
    _cachedHMITextures[jobLabel] = tex;
    return tex;
  }

  function getPushbuttonPanelTexture() {
    if (_cachedPBTex) return _cachedPBTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 96;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 96, 256);

    ctx.fillStyle = "#facc15";
    ctx.fillRect(14, 16, 68, 68);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(48, 50, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(48, 114, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(48, 114, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(48, 164, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(48, 164, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(36, 204, 24, 24);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(45, 200, 6, 32);

    const tex = new THREE.CanvasTexture(canvas);
    _cachedPBTex = tex;
    return tex;
  }

  function getPrintedGoldFilmTexture() {
    if (_cachedGoldFilmTex) return _cachedGoldFilmTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#cbd5e1");
    grad.addColorStop(0.25, "#e2e8f0");
    grad.addColorStop(0.5, "#64748b");
    grad.addColorStop(0.75, "#f8fafc");
    grad.addColorStop(1, "#475569");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    for (let x = 20; x < 500; x += 120) {
      ctx.fillStyle = "#facc15";
      ctx.fillRect(x, 30, 84, 52);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(x + 8, 92, 68, 48);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 14, 152, 56, 22);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    _cachedGoldFilmTex = tex;
    return tex;
  }

  /**
   * Patterned Blue & White Film Texture (exact match to 1LB-09 photo web!)
   */
  function getBluePatternFilmTexture() {
    if (_cachedBlueFilmTex) return _cachedBlueFilmTex;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Clean bright translucent ice-white film substrate
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 0, 256, 256);

    // Repeating lanes of cobalt-blue packaging print graphics
    for (let row = 0; row < 4; row++) {
      const y = 14 + row * 62;
      for (let col = 0; col < 4; col++) {
        const x = 10 + col * 62;
        ctx.fillStyle = "#0284c7";
        ctx.fillRect(x, y, 48, 44);
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(x + 6, y + 6, 36, 12);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 10, y + 24, 28, 10);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    _cachedBlueFilmTex = tex;
    return tex;
  }

  return {
    createBobstMaterials,
    getBobstHeaderTexture,
    getBobstEndLogoTexture,
    getBobstHMITexture,
    getPushbuttonPanelTexture,
    getPrintedGoldFilmTexture,
    getBluePatternFilmTexture
  };
})();
