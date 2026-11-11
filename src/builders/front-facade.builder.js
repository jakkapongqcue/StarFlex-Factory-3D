// ============================================================================
// Module: src/builders/front-facade.builder.js
// Builds the authentic front company architecture & streetscape of Starflex PCL
// referenced directly from the 5 real-world street-view & aerial photos:
//   1. Building 2 Front 2-Story Office with Curved Arch Roof, Starflex 3D Logo,
//      and Hipped-Roof Porte-Cochere with Stone Columns (Images 1 & 3)
//   2. Building 4 Modern 2-Story Blue Glass Curtain Wall Facade with Dark
//      Cantilevered Fascia, Iconic White V-Shaped Columns & Grey Tent (Images 2, 4, 5)
//   3. Front Perimeter Fence with Gold Globe Lamps, Blue "STARFLEX" Sign Wall,
//      Sliding Gate, 3 Flagpoles (Thai & Starflex flags) & Green Lawn (Images 1 & 3)
//   4. Hipped-Roof Security Guardhouse Pavilion with Driveway Awning, Red-White
//      Curb, ISO Certification Board & Blue "ttb" ATM Booth (Images 1 & 2)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.FrontFacade = {
  build(scene, mats, state) {
    const { pt, rect, addEdges } = window.Starflex3D.Coords;

    const frontGroup = new THREE.Group();
    frontGroup.name = "AuthenticFrontFacade";
    state.frontFacadeGroup = frontGroup;

    // Shared specialized materials for authentic front architecture
    const fMats = {
      blueBrand: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.2 }),
      blueSign: new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.35, metalness: 0.15 }),
      charcoalFascia: new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.35 }),
      greyBlueWall: new THREE.MeshStandardMaterial({ color: 0x7c8ea6, roughness: 0.6, metalness: 0.1 }),
      whiteTrim: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, metalness: 0.08 }),
      reflectiveGlass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.12,
        metalness: 0.25,
        transparent: true,
        opacity: 0.58
      }),
      stonePillar: new THREE.MeshStandardMaterial({ color: 0x9a7b56, roughness: 0.85, metalness: 0.05 }),
      hipRoofTile: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.55, metalness: 0.2 }),
      guardRoofTile: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6, metalness: 0.15 }),
      lawnGreen: new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.9, metalness: 0.02 }),
      hedgeGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 }),
      goldLamp: new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.25,
        roughness: 0.25,
        metalness: 0.7
      }),
      tentFabric: new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.65, metalness: 0.1 }),
      ttbOrange: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 }),
      darkWindow: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.4 })
    };

    // Helper: create high-res Starflex logo textures using assets/Starflex_logo.png
    function createStarflexLogoSignTexture(options = {}) {
      const width = options.width || 2048;
      const height = options.height || 256;
      const bgHex = options.bgHex || "#143a75";
      const showSubtext = options.showSubtext !== false;
      const whiteLetters = options.whiteLetters !== false;
      const border = options.border !== false;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      function renderFallback() {
        ctx.fillStyle = bgHex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (border) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
          ctx.lineWidth = 4;
          ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
        }

        // Authentic ribbon fallback: 3-leaf ribbon
        const icX = showSubtext ? canvas.width * 0.22 : canvas.width * 0.28;
        const icY = showSubtext ? 100 : canvas.height / 2;
        const r = showSubtext ? 46 : 56;

        // Teal ribbon
        ctx.fillStyle = "#5bc2a7";
        ctx.beginPath();
        ctx.moveTo(icX, icY - r);
        ctx.lineTo(icX + r * 0.86, icY - r * 0.5);
        ctx.lineTo(icX + r * 0.45, icY - r * 0.25);
        ctx.lineTo(icX, icY - r * 0.5);
        ctx.closePath();
        ctx.fill();

        // Cyan ribbon
        ctx.fillStyle = "#33aad0";
        ctx.beginPath();
        ctx.moveTo(icX - r * 0.86, icY - r * 0.5);
        ctx.lineTo(icX, icY);
        ctx.lineTo(icX - r * 0.45, icY + r * 0.25);
        ctx.lineTo(icX - r * 0.86, icY);
        ctx.closePath();
        ctx.fill();

        // Deep blue ribbon
        ctx.fillStyle = "#073674";
        ctx.beginPath();
        ctx.moveTo(icX, icY + r);
        ctx.lineTo(icX + r * 0.86, icY + r * 0.5);
        ctx.lineTo(icX + r * 0.45, icY + r * 0.25);
        ctx.lineTo(icX, icY + r * 0.5);
        ctx.closePath();
        ctx.fill();

        // Bold STARFLEX lettering in crisp white
        ctx.fillStyle = "#ffffff";
        ctx.font =
          "900 " +
          (showSubtext ? "82px" : "96px") +
          ' "Montserrat", "Segoe UI", Arial, sans-serif';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("STARFLEX", icX + (showSubtext ? 75 : 90), icY);

        if (showSubtext) {
          ctx.fillStyle = "#f1f5f9";
          ctx.font = 'bold 30px "Kanit", "Prompt", "Segoe UI", Arial, sans-serif';
          ctx.textAlign = "center";
          ctx.textBaseline = "alphabetic";
          ctx.fillText(
            "PUBLIC COMPANY LIMITED  ·  บริษัท สตาร์เฟล็กซ์ จำกัด (มหาชน)",
            canvas.width / 2,
            218
          );

          ctx.fillStyle = "#93c5fd";
          ctx.font = 'bold 20px "Kanit", "Prompt", "Segoe UI", Arial, sans-serif';
          ctx.textAlign = "right";
          ctx.fillText("เลขที่ 189/48-49 ม.3", canvas.width - 24, 220);
        }
      }

      renderFallback();

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;

      if (typeof Image !== "undefined") {
        const img = new Image();
        const logoSrc =
          (window.STARFLEX_TEXTURES && window.STARFLEX_TEXTURES.starflexLogo) ||
          "assets/Starflex_logo.png";

        if (typeof logoSrc === "string" && logoSrc.startsWith("http")) {
          img.crossOrigin = "anonymous";
        }

        img.onload = function () {
          let processedSource = img;
          if (whiteLetters) {
            try {
              const off = document.createElement("canvas");
              off.width = img.width;
              off.height = img.height;
              const offCtx = off.getContext("2d");
              offCtx.drawImage(img, 0, 0);
              const imgData = offCtx.getImageData(0, 0, off.width, off.height);
              const d = imgData.data;
              for (let i = 0; i < d.length; i += 4) {
                const a = d[i + 3];
                if (a > 30) {
                  const r = d[i],
                    g = d[i + 1],
                    b = d[i + 2];
                  const isGrayscale =
                    Math.abs(r - g) < 22 &&
                    Math.abs(g - b) < 22 &&
                    Math.abs(r - b) < 22;
                  if (isGrayscale && r < 120) {
                    d[i] = 255;
                    d[i + 1] = 255;
                    d[i + 2] = 255;
                  }
                }
              }
              offCtx.putImageData(imgData, 0, 0);
              processedSource = off;
            } catch (err) {
              console.warn("Could not recolor logo for sign:", err);
              processedSource = img;
            }
          }

          ctx.fillStyle = bgHex;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          if (border) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 4;
            ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
          }

          const aspect = img.width / img.height;
          let drawH = showSubtext ? 142 : 180;
          let drawW = drawH * aspect;
          if (drawW > canvas.width - 80) {
            drawW = canvas.width - 80;
            drawH = drawW / aspect;
          }
          const drawX = (canvas.width - drawW) / 2;
          const drawY = showSubtext ? 18 : (canvas.height - drawH) / 2;

          ctx.drawImage(processedSource, drawX, drawY, drawW, drawH);

          if (showSubtext) {
            ctx.fillStyle = "#ffffff";
            ctx.font = 'bold 30px "Kanit", "Prompt", "Segoe UI", Arial, sans-serif';
            ctx.textAlign = "center";
            ctx.textBaseline = "alphabetic";
            ctx.fillText(
              "PUBLIC COMPANY LIMITED  ·  บริษัท สตาร์เฟล็กซ์ จำกัด (มหาชน)",
              canvas.width / 2,
              218
            );

            ctx.fillStyle = "#93c5fd";
            ctx.font = 'bold 20px "Kanit", "Prompt", "Segoe UI", Arial, sans-serif';
            ctx.textAlign = "right";
            ctx.fillText("เลขที่ 189/48-49 ม.3", canvas.width - 24, 220);
          }

          texture.needsUpdate = true;
          if (window.__triggerRender) window.__triggerRender();
        };

        img.onerror = function (e) {
          console.warn("Starflex logo image failed to load for sign", e);
        };

        img.src = logoSrc;
      }

      return texture;
    }

    // ========================================================================
    // 1. GREEN FRONT LAWN & 3 FLAGPOLES (West Front Yard — Images 1 & 3)
    // ========================================================================
    const lawnRect = rect([205, 1135, 660, 1395]);
    const lawnMesh = new THREE.Mesh(
      new THREE.BoxGeometry(lawnRect.w, 0.16, lawnRect.d),
      fMats.lawnGreen
    );
    lawnMesh.position.set(lawnRect.x, -0.32, lawnRect.z);
    lawnMesh.receiveShadow = true;
    frontGroup.add(lawnMesh);

    // Ornamental bushes along the lawn edge (Image 3)
    for (let px = 240; px <= 640; px += 35) {
      const bp = pt(px, 1135);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), fMats.hedgeGreen);
      bush.position.set(bp.x, 0.25, bp.z);
      frontGroup.add(bush);
    }

    // 3 Tall Flagpoles (Thai National Flag in center + 2 Corporate Flags — Image 1)
    const flagPositions = [
      { px: 375, py: 1360, h: 11.5, type: "corp" },
      { px: 405, py: 1360, h: 12.8, type: "thai" },
      { px: 435, py: 1360, h: 11.5, type: "corp" }
    ];
    flagPositions.forEach(fp => {
      const p = pt(fp.px, fp.py);
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.11, fp.h, 8),
        fMats.whiteTrim
      );
      pole.position.set(p.x, fp.h * 0.5, p.z);
      pole.castShadow = true;
      frontGroup.add(pole);

      // Flag cloth
      const flagCanvas = document.createElement("canvas");
      flagCanvas.width = 128;
      flagCanvas.height = 84;
      const fg = flagCanvas.getContext("2d");
      if (fp.type === "thai") {
        const stripes = ["#ef4444", "#ffffff", "#1e3a8a", "#1e3a8a", "#ffffff", "#ef4444"];
        stripes.forEach((col, i) => {
          fg.fillStyle = col;
          fg.fillRect(0, (i * 84) / 6, 128, 84 / 6 + 1);
        });
      } else {
        fg.fillStyle = "#ffffff";
        fg.fillRect(0, 0, 128, 84);
        fg.fillStyle = "#1d4ed8";
        fg.beginPath();
        fg.arc(64, 42, 20, 0, Math.PI * 2);
        fg.fill();
      }
      const flagTex = new THREE.CanvasTexture(flagCanvas);
      const flagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.35),
        new THREE.MeshBasicMaterial({ map: flagTex, side: THREE.DoubleSide })
      );
      flagMesh.position.set(p.x + 1.1, fp.h - 0.8, p.z);
      frontGroup.add(flagMesh);
    });

    // ========================================================================
    // 2. BUILDING 2 FRONT 2-STORY OFFICE WITH ARCH ROOF & PORTE-COCHERE (Images 1 & 3)
    // ========================================================================
    const offR = rect([674, 1098, 1018, 1190]);
    const offH = 7.6;

    // 2A. 2-Story Grey-Blue Wall Body with White Grid Framing
    const offBody = new THREE.Mesh(
      new THREE.BoxGeometry(offR.w, offH, offR.d),
      fMats.greyBlueWall
    );
    offBody.position.set(offR.x, offH * 0.5, offR.z);
    offBody.castShadow = true;
    offBody.receiveShadow = true;
    addEdges(offBody, 0xffffff, 0.85);
    frontGroup.add(offBody);

    // White horizontal mid-floor band & top cornice band
    [offH * 0.5, offH - 0.25].forEach(by => {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(offR.w + 0.18, 0.32, offR.d + 0.18),
        fMats.whiteTrim
      );
      band.position.set(offR.x, by, offR.z);
      frontGroup.add(band);
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
      frontGroup.add(pilaster);

      if (i < numBays && i !== 4) {
        // 1st & 2nd floor vertical windows
        [1.9, 5.6].forEach(wy => {
          const win = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 2.2, 0.15),
            fMats.reflectiveGlass
          );
          win.position.set(bx + (offR.w / numBays) * 0.5, wy, offR.z2 + 0.06);
          addEdges(win, 0xffffff, 0.9);
          frontGroup.add(win);
        });
      }
    }

    // 2B. Curved Barrel-Arch Roof over Building 2 Front Office (Images 1 & 3)
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
      frontGroup.add(archRoofSeg);

      // Curved grey tympanum front wall fill under the arch
      const avgY = (y1 + y2) * 0.5;
      if (avgY > offH + 0.1) {
        const tymp = new THREE.Mesh(
          new THREE.BoxGeometry(Math.abs(x2 - x1) + 0.05, avgY - offH, 0.25),
          fMats.greyBlueWall
        );
        tymp.position.set((x1 + x2) * 0.5, offH + (avgY - offH) * 0.5, offR.z2 - 0.1);
        frontGroup.add(tymp);
      }
    }

    // 3D Starflex Emblem mounted on the center of the Curved Arch Gable (Image 3)
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
    frontGroup.add(gableLogo);

    // 2C. Hipped-Roof Entrance Porte-Cochere with 2 Stone Columns (Image 3)
    const porchR = rect([808, 1190, 892, 1248]);
    const porchH = 3.8;

    // 2 Stone-clad front columns
    [-porchR.w * 0.38, porchR.w * 0.38].forEach(dx => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, porchH, 0.55),
        fMats.stonePillar
      );
      col.position.set(porchR.x + dx, porchH * 0.5, porchR.z2 - 0.4);
      col.castShadow = true;
      addEdges(col, 0x78350f, 0.6);
      frontGroup.add(col);

      // Manicured topiary bush in front of each stone pillar
      const shrub = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.3, 10), fMats.hedgeGreen);
      shrub.position.set(porchR.x + dx, 0.65, porchR.z2 + 0.35);
      frontGroup.add(shrub);
    });

    // Hipped roof pyramid over the entrance porch
    const porchBase = new THREE.Mesh(
      new THREE.BoxGeometry(porchR.w + 0.8, 0.28, porchR.d + 0.6),
      fMats.whiteTrim
    );
    porchBase.position.set(porchR.x, porchH, porchR.z);
    const porchHip = new THREE.Mesh(
      new THREE.ConeGeometry(porchR.w * 0.68, 1.55, 4),
      fMats.hipRoofTile
    );
    porchHip.position.set(porchR.x, porchH + 0.9, porchR.z);
    porchHip.rotation.y = Math.PI / 4;
    addEdges(porchHip, 0xffffff, 0.6);
    frontGroup.add(porchBase, porchHip);

    // Golden Spirit House (ศาลพระภูมิสีทอง) & Palm Trees on right of office (Image 1)
    const shrinePos = pt(965, 1225);
    const shrinePedestal = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.4), fMats.whiteTrim);
    shrinePedestal.position.set(shrinePos.x, 0.45, shrinePos.z);
    const shrineTop = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.5, 4), fMats.goldLamp);
    shrineTop.position.set(shrinePos.x, 1.65, shrinePos.z);
    shrineTop.rotation.y = Math.PI / 4;
    frontGroup.add(shrinePedestal, shrineTop);

    // ========================================================================
    // 3. BUILDING 4 MODERN 2-STORY BLUE GLASS & WHITE V-COLUMN FACADE (Images 2, 4, 5)
    // ========================================================================
    const eastFrontR = rect([1395, 1085, 1895, 1230]);
    const eastH = 8.4;

    // 3A. Solid Inner Backing Core (Blocks see-through into Hall 4 from outside!)
    const solidInnerCore = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w - 0.3, eastH - 0.1, eastFrontR.d - 0.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 })
    );
    solidInnerCore.position.set(eastFrontR.x, eastH * 0.5, eastFrontR.z - 0.08);
    frontGroup.add(solidInnerCore);

    // Solid Roof Deck Slab over the entire 2-Story Annex (Seals top connection to Hall 4!)
    const annexRoofCap = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w + 0.4, 0.35, eastFrontR.d + 1.2),
      fMats.charcoalFascia
    );
    annexRoofCap.position.set(eastFrontR.x, eastH + 0.15, eastFrontR.z);
    frontGroup.add(annexRoofCap);

    // 2-Story Reflective Blue Glass Curtain Wall Shell
    const glassBox = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w, eastH, eastFrontR.d),
      fMats.reflectiveGlass
    );
    glassBox.position.set(eastFrontR.x, eastH * 0.5, eastFrontR.z);
    addEdges(glassBox, 0x1e293b, 0.75);
    frontGroup.add(glassBox);

    // 3B. Royal-Blue Feature Wall Fin on West Corner of Building 4 (Image 2)
    const blueFinR = rect([1395, 1085, 1432, 1234]);
    const blueFin = new THREE.Mesh(
      new THREE.BoxGeometry(blueFinR.w, eastH + 0.1, blueFinR.d),
      fMats.blueBrand
    );
    blueFin.position.set(blueFinR.x, eastH * 0.5, blueFinR.z);
    addEdges(blueFin, 0x93c5fd, 0.6);
    frontGroup.add(blueFin);

    // 3C. Bold Dark-Charcoal Stepped Cantilevered Roof Fascia (Images 2, 4, 5)
    const mainFascia = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w * 0.76, 1.15, eastFrontR.d + 2.8),
      fMats.charcoalFascia
    );
    mainFascia.position.set(eastFrontR.x - eastFrontR.w * 0.1, eastH + 0.55, eastFrontR.z + 0.6);
    addEdges(mainFascia, 0x71717a, 0.7);
    frontGroup.add(mainFascia);

    // Right lower stepped fascia wing (Image 4 & 5 right side)
    const rightFascia = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w * 0.28, 0.95, eastFrontR.d + 2.0),
      fMats.charcoalFascia
    );
    rightFascia.position.set(eastFrontR.x + eastFrontR.w * 0.38, eastH - 0.35, eastFrontR.z + 0.3);
    addEdges(rightFascia, 0x71717a, 0.7);
    frontGroup.add(rightFascia);

    // 3D. Signature White V-Shaped Angled Columns across the Front Glass Facade! (Images 2, 4, 5)
    const vPairs = 5;
    const vStartX = eastFrontR.x1 + 5.5;
    const vSpanW = eastFrontR.w * 0.64;
    for (let v = 0; v < vPairs; v++) {
      const vx = vStartX + (vSpanW * v) / (vPairs - 1);
      const vz = eastFrontR.z2 + 0.65;

      [-1, 1].forEach(dir => {
        const strutLen = Math.hypot(1.35, eastH);
        const strutAng = Math.atan2(1.35 * dir, eastH);
        const strut = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.13, strutLen, 8),
          fMats.whiteTrim
        );
        strut.position.set(vx + dir * 0.68, eastH * 0.5, vz);
        strut.rotation.z = -strutAng;
        strut.castShadow = true;
        frontGroup.add(strut);
      });
    }

    // 3E. Modern Flat Dark-Charcoal Entrance Porte-Cochere Canopy (Images 2 & 4)
    const eastPorchR = rect([1465, 1230, 1595, 1288]);
    const eastPorchRoof = new THREE.Mesh(
      new THREE.BoxGeometry(eastPorchR.w, 0.65, eastPorchR.d),
      fMats.charcoalFascia
    );
    eastPorchRoof.position.set(eastPorchR.x, 4.2, eastPorchR.z);
    addEdges(eastPorchRoof, 0x94a3b8, 0.7);
    frontGroup.add(eastPorchRoof);

    [-eastPorchR.w * 0.42, eastPorchR.w * 0.42].forEach(dx => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 4.2, 0.38),
        fMats.charcoalFascia
      );
      col.position.set(eastPorchR.x + dx, 2.1, eastPorchR.z2 - 0.35);
      frontGroup.add(col);
    });

    // 3F. Grey Arched Storage Tent in East Yard (Images 4 & 5)
    const tentR = rect([1905, 1135, 1995, 1245]);
    const tentBody = new THREE.Mesh(
      new THREE.BoxGeometry(tentR.w, 3.2, tentR.d),
      fMats.tentFabric
    );
    tentBody.position.set(tentR.x, 1.6, tentR.z);
    const tentArch = new THREE.Mesh(
      new THREE.CylinderGeometry(tentR.w * 0.5, tentR.w * 0.5, tentR.d, 14, 1, false, 0, Math.PI),
      fMats.tentFabric
    );
    tentArch.rotation.z = Math.PI / 2;
    tentArch.rotation.y = Math.PI / 2;
    tentArch.position.set(tentR.x, 3.2, tentR.z);
    addEdges(tentBody, 0x64748b, 0.6);
    frontGroup.add(tentBody, tentArch);

    // ========================================================================
    // 4. FRONT PERIMETER FENCE, BLUE STARFLEX SIGN WALL, GATE, GUARDHOUSE & ttb ATM
    //    (Images 1, 2, 4, 5)
    // ========================================================================
    function buildFenceRun(px1, py1, px2, py2, stepPx = 55) {
      const p1 = pt(px1, py1);
      const p2 = pt(px2, py2);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const len = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      // Lower concrete wall + upper grille rail
      const lowWall = new THREE.Mesh(new THREE.BoxGeometry(len, 0.95, 0.22), fMats.greyBlueWall);
      lowWall.position.set((p1.x + p2.x) * 0.5, 0.48, (p1.z + p2.z) * 0.5);
      lowWall.rotation.y = -angle;
      addEdges(lowWall, 0xffffff, 0.7);
      frontGroup.add(lowWall);

      const topRail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, 0.14), fMats.whiteTrim);
      topRail.position.set((p1.x + p2.x) * 0.5, 1.85, (p1.z + p2.z) * 0.5);
      topRail.rotation.y = -angle;
      frontGroup.add(topRail);

      // Fence pillars + Gold Globe Lamps
      const distPx = Math.hypot(px2 - px1, py2 - py1);
      const numPosts = Math.max(2, Math.round(distPx / stepPx));
      for (let i = 0; i <= numPosts; i++) {
        const t = i / numPosts;
        const fx = p1.x + dx * t;
        const fz = p1.z + dz * t;

        const post = new THREE.Mesh(new THREE.BoxGeometry(0.36, 2.05, 0.36), fMats.whiteTrim);
        post.position.set(fx, 1.02, fz);
        frontGroup.add(post);

        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), fMats.goldLamp);
        globe.position.set(fx, 2.2, fz);
        frontGroup.add(globe);
      }
    }

    // West Front Fence (px: 185..695, py = 1410)
    buildFenceRun(185, 1410, 695, 1410, 52);
    // East Front Fence (px: 1325..2035, py = 1410) & East Return Fence (px = 2035, py: 1080..1410)
    buildFenceRun(1325, 1410, 2035, 1410, 52);
    buildFenceRun(2035, 1410, 2035, 1080, 52);

    // 4B. Royal-Blue "STARFLEX PUBLIC COMPANY LIMITED" Sign Wall (Image 1)
    const signR = rect([695, 1402, 878, 1418]);
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
    frontGroup.add(signBase, signWall, signFace);

    // 4C. Sliding White Steel Main Gate (Image 1)
    const gateR = rect([878, 1408, 1145, 1414]);
    const gateMesh = new THREE.Mesh(
      new THREE.BoxGeometry(gateR.w, 1.75, 0.16),
      fMats.whiteTrim
    );
    gateMesh.position.set(gateR.x, 0.9, gateR.z);
    addEdges(gateMesh, 0x64748b, 0.8);
    frontGroup.add(gateMesh);

    // 4D. Blue "ttb" ATM Booth at Main Gate Entrance (Integrated into front perimeter fence line)
    const atmR = rect([1145, 1396, 1178, 1422]);
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
    frontGroup.add(atmBody, atmHeader, atmAccent);

    // 4E. Hipped-Roof Security Guardhouse Pavilion INSIDE the fence perimeter (py: 1290..1405 < 1410)
    // Matches Loading_Dock_1_StreetView.jpg & Front_View_1..2:
    // Guardhouse sits on the inside (North) of the perimeter fence/gate line, facing the driveway entrance!
    const ghR = rect([1180, 1290, 1310, 1405]);
    const ghWallH = 3.1;
    const ghBody = new THREE.Mesh(
      new THREE.BoxGeometry(ghR.w, ghWallH, ghR.d),
      fMats.whiteTrim
    );
    ghBody.position.set(ghR.x, ghWallH * 0.5, ghR.z);
    addEdges(ghBody, 0x64748b, 0.7);

    // Guardhouse Inspection Windows on West & South faces
    const ghWinWest = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2, ghR.d * 0.65), fMats.darkWindow);
    ghWinWest.position.set(ghR.x1 + 0.06, 1.6, ghR.z);
    addEdges(ghWinWest, 0xffffff, 0.9);
    const ghWinSouth = new THREE.Mesh(new THREE.BoxGeometry(ghR.w * 0.6, 1.2, 0.12), fMats.darkWindow);
    ghWinSouth.position.set(ghR.x, 1.6, ghR.z2 - 0.06);
    addEdges(ghWinSouth, 0xffffff, 0.9);
    frontGroup.add(ghWinWest, ghWinSouth);

    // Large Grey Hipped Roof on Guardhouse
    const ghRoof = new THREE.Mesh(
      new THREE.ConeGeometry(ghR.d * 0.78, 2.3, 4),
      fMats.guardRoofTile
    );
    ghRoof.position.set(ghR.x, ghWallH + 1.15, ghR.z);
    ghRoof.rotation.y = Math.PI / 4;
    ghRoof.scale.set(ghR.w / ghR.d, 1, 1);
    addEdges(ghRoof, 0x475569, 0.65);

    // Cantilevered Grey Awning projecting over the West driveway inspection lane (Loading_Dock_1_StreetView.jpg right foreground)
    const ghAwning = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.18, ghR.d * 0.95),
      fMats.guardRoofTile
    );
    ghAwning.position.set(ghR.x1 - 1.5, 2.65, ghR.z);
    ghAwning.rotation.z = 0.18;
    addEdges(ghAwning, 0x475569, 0.6);

    // Red-and-White painted curb around the guardhouse driveway island (Loading_Dock_1_StreetView.jpg)
    const curbW = ghR.w + 3.8;
    const curbD = ghR.d + 1.2;
    const curbPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(curbW, 0.22, curbD),
      fMats.whiteTrim
    );
    curbPlinth.position.set(ghR.x - 1.4, 0.11, ghR.z);
    addEdges(curbPlinth, 0xdc2626, 0.85);

    // Alternating red and white curb edge stripes on driveway side
    const curbSegs = 10;
    for (let c = 0; c < curbSegs; c++) {
      const cz = ghR.z - curbD * 0.5 + (curbD * (c + 0.5)) / curbSegs;
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.24, curbD / curbSegs * 0.92),
        c % 2 === 0 ? new THREE.MeshLambertMaterial({ color: 0xdc2626 }) : fMats.whiteTrim
      );
      stripe.position.set(ghR.x - 1.4 - curbW * 0.5, 0.12, cz);
      frontGroup.add(stripe);
    }

    frontGroup.add(ghBody, ghRoof, ghAwning, curbPlinth);

    // ========================================================================
    // 5. AUTHENTIC LOADING DOCK COURTYARD ARCHITECTURE
    //    (Referenced from Loading_Dock_1_StreetView.jpg & Loading_Dock_2_CloseUp.jpg)
    // ========================================================================
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

    // Helper: create a realistic wall-mounted AC outdoor condenser unit with dark fan circle
    function createACUnit(x, y, z, rotY = 0) {
      const ac = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.66, 0.38), dMats.acBody);
      addEdges(box, 0x94a3b8, 0.6);
      const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.4, 10), dMats.acGrille);
      fan.rotation.x = Math.PI / 2;
      fan.position.set(-0.12, 0, 0.02);
      ac.add(box, fan);
      ac.position.set(x, y, z);
      ac.rotation.y = rotY;
      return ac;
    }

    // 5A. 7-Bay Loading Dock Upper Clerestory Facade, Straight Gutter Eave & 8 Curved Downspouts
    const dockSpanR = rect([1062, 814, 1395, 818]);
    const dockEaveH = 8.8;
    const dockCanopyH = 4.55;
    const numDockBays = 7;
    const bayW = dockSpanR.w / numDockBays;

    // Upper exterior cladding panel (y = 4.55m .. 8.8m) so it looks crisp even in Cutaway mode
    const upperCladding = new THREE.Mesh(
      new THREE.BoxGeometry(dockSpanR.w, dockEaveH - dockCanopyH, 0.24),
      dMats.upperWall
    );
    upperCladding.position.set(dockSpanR.x, (dockEaveH + dockCanopyH) * 0.5, dockSpanR.z + 0.08);
    addEdges(upperCladding, 0x94a3b8, 0.55);
    dockFacadeGroup.add(upperCladding);

    // Straight Horizontal Roof Eave Overhang & Rain Gutter across all 7 bays
    const eaveOverhang = new THREE.Mesh(
      new THREE.BoxGeometry(dockSpanR.w + 0.6, 0.34, 1.15),
      fMats.whiteTrim
    );
    eaveOverhang.position.set(dockSpanR.x, dockEaveH - 0.05, dockSpanR.z + 0.45);
    addEdges(eaveOverhang, 0x64748b, 0.7);
    dockFacadeGroup.add(eaveOverhang);

    // 8 White Structural Columns + Curved White Rainwater Downspouts (ท่อน้ำฝนสีขาวโค้งจากชายคา)
    for (let i = 0; i <= numDockBays; i++) {
      const cx = dockSpanR.x1 + i * bayW;
      const cz = dockSpanR.z + 0.22;

      // Vertical white pilaster & downspout pipe
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, dockEaveH - dockCanopyH, 8),
        fMats.whiteTrim
      );
      pipe.position.set(cx, (dockEaveH + dockCanopyH) * 0.5, cz + 0.08);
      dockFacadeGroup.add(pipe);

      // Curved elbow neck connecting roof gutter to column downspout
      const elbow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.85, 8),
        fMats.whiteTrim
      );
      elbow.position.set(cx, dockEaveH - 0.35, cz + 0.38);
      elbow.rotation.x = 0.78;
      dockFacadeGroup.add(elbow);

      // Per-bay upper windows & AC units (Bays 0..6)
      if (i < numDockBays) {
        const bx = cx + bayW * 0.5;
        const wz = cz + 0.03;

        if (i === 0) {
          // Bay 1 (Leftmost): Wide dark-framed 3-pane window
          const win = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.15, 0.12), dMats.darkWindow);
          win.position.set(bx, 6.35, wz);
          addEdges(win, 0xffffff, 0.9);
          dockFacadeGroup.add(win);
        } else if (i === 1) {
          // Bay 2: Twin narrow horizontal slot windows + 2 AC units on right
          [-0.75, 0.55].forEach(dx => {
            const slotWin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.45, 0.12), dMats.darkWindow);
            slotWin.position.set(bx + dx, 6.65, wz);
            addEdges(slotWin, 0xffffff, 0.9);
            dockFacadeGroup.add(slotWin);
          });
          dockFacadeGroup.add(createACUnit(bx + 1.65, 6.75, wz + 0.2));
          dockFacadeGroup.add(createACUnit(bx + 1.65, 5.85, wz + 0.2));
        } else {
          // Bays 3..7 (5 Main Dock Bays): 3-pane green-tinted glass window with white frame + AC unit
          const frame = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.22, 0.1), fMats.whiteTrim);
          frame.position.set(bx - 0.15, 6.25, wz);
          const gWin = new THREE.Mesh(new THREE.BoxGeometry(2.38, 1.06, 0.14), dMats.greenGlass);
          gWin.position.set(bx - 0.15, 6.25, wz + 0.02);
          addEdges(gWin, 0xffffff, 0.95);
          dockFacadeGroup.add(frame, gWin);

          // Vertical mullions dividing into 3 panes
          [-0.4, 0.4].forEach(mx => {
            const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.1, 0.16), fMats.whiteTrim);
            mullion.position.set(bx - 0.15 + mx, 6.25, wz + 0.03);
            dockFacadeGroup.add(mullion);
          });

          // AC condenser unit mounted beside window
          dockFacadeGroup.add(createACUnit(bx + 1.55, 5.95, wz + 0.2));
          if (i === 6) {
            dockFacadeGroup.add(createACUnit(bx + 1.55, 6.75, wz + 0.2));
          }
        }
      }
    }

    // 5B. Full-Width Cantilevered Steel Loading Dock Canopy (px: 1062..1398, py: 815..874)
    const canopyR = rect([1062, 815, 1398, 874]);
    const canopyDeck = new THREE.Mesh(
      new THREE.BoxGeometry(canopyR.w, 0.22, canopyR.d),
      fMats.charcoalFascia
    );
    canopyDeck.position.set(canopyR.x, dockCanopyH, canopyR.z);
    canopyDeck.castShadow = true;
    addEdges(canopyDeck, 0x64748b, 0.7);
    dockFacadeGroup.add(canopyDeck);

    // Underside steel cantilever I-beam rafters at each bay
    for (let i = 0; i <= numDockBays; i++) {
      const rx = dockSpanR.x1 + i * bayW;
      const rafter = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.32, canopyR.d * 0.95),
        fMats.charcoalFascia
      );
      rafter.position.set(rx, dockCanopyH - 0.2, canopyR.z);
      dockFacadeGroup.add(rafter);
    }

    // 5C. Left Courtyard Wing (Hall 2 East Wall: Overhanging Eave, Exhaust Hoods, Side Canopy & AC Row)
    const leftWallR = rect([1060, 815, 1065, 1100]);
    // Overhanging upper roof eave on Hall 2 East wall
    const leftUpperEave = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.28, leftWallR.d),
      fMats.guardRoofTile
    );
    leftUpperEave.position.set(leftWallR.x + 0.55, 10.35, leftWallR.z);
    leftUpperEave.rotation.z = -0.15;
    dockFacadeGroup.add(leftUpperEave);

    // 4 Black Angled Industrial Exhaust Fan Hoods & Louver Band (Loading_Dock_2 left top)
    for (let py = 855; py <= 1035; py += 58) {
      const hp = pt(1063, py);
      const hood = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 1.25), dMats.exhaustHood);
      hood.position.set(hp.x + 0.45, 7.8, hp.z);
      hood.rotation.z = -0.25;
      addEdges(hood, 0x52525b, 0.7);
      dockFacadeGroup.add(hood);
    }

    // Cantilevered Side Canopy along Hall 2 East Wall (px: 1062..1108, py: 820..1105, y = 4.15m)
    const leftCanopyR = rect([1062, 820, 1108, 1105]);
    const leftCanopy = new THREE.Mesh(
      new THREE.BoxGeometry(leftCanopyR.w, 0.2, leftCanopyR.d),
      fMats.guardRoofTile
    );
    leftCanopy.position.set(leftCanopyR.x, 4.15, leftCanopyR.z);
    leftCanopy.rotation.z = -0.06;
    addEdges(leftCanopy, 0x475569, 0.65);
    dockFacadeGroup.add(leftCanopy);

    // Row of 8 AC Condenser Units mounted above Left Side Canopy
    for (let py = 845; py <= 1080; py += 32) {
      const ap = pt(1063, py);
      dockFacadeGroup.add(createACUnit(ap.x + 0.32, 4.85, ap.z, Math.PI / 2));
    }

    // 5D. Right Courtyard Wing (Hall 4 West Wall: Green Windows & 18-Unit AC Condenser Matrix!)
    const rightWallX = pt(1395, 900).x;
    // 3 Green-tinted upper factory windows along Hall 4 West Courtyard Wall
    [845, 920, 995].forEach(py => {
      const wp = pt(1395, py);
      const rWin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.1, 2.4), dMats.greenGlass);
      rWin.position.set(rightWallX - 0.18, 7.6, wp.z);
      addEdges(rWin, 0xffffff, 0.9);
      dockFacadeGroup.add(rWin);
    });

    // Iconic 4x3 + Upper Row AC Condenser Matrix on Hall 4 West Wall (Loading_Dock_2 right side!)
    const acColsPy = [925, 948, 972, 996];
    const acTiersY = [2.2, 3.15, 4.1, 5.05];
    acColsPy.forEach(py => {
      const ap = pt(1395, py);
      // Vertical steel support rack & cable conduit pipe
      const conduit = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.2, 0.12), fMats.whiteTrim);
      conduit.position.set(rightWallX - 0.16, 4.2, ap.z - 0.55);
      dockFacadeGroup.add(conduit);

      acTiersY.forEach(ay => {
        dockFacadeGroup.add(createACUnit(rightWallX - 0.32, ay, ap.z, -Math.PI / 2));
      });
    });
    // Upper row of 5 AC units below the eaves on the right wall
    [830, 852, 874, 935, 965].forEach(py => {
      const ap = pt(1395, py);
      dockFacadeGroup.add(createACUnit(rightWallX - 0.32, 6.3, ap.z, -Math.PI / 2));
    });

    // 5E. Courtyard Pavement Markings (Yellow Dashed Line, White Arrow & Orange Traffic Cones)
    for (let py = 885; py <= 1140; py += 22) {
      const yp = pt(1132, py);
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 1.25), dMats.yellowPaint);
      dash.position.set(yp.x, -0.31, yp.z);
      dockFacadeGroup.add(dash);
    }

    // White directional pavement arrow on left parking lane
    const arrowPos = pt(1095, 1065);
    const arrowShaft = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 1.8), fMats.whiteTrim);
    arrowShaft.position.set(arrowPos.x, -0.31, arrowPos.z);
    const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.9, 3), fMats.whiteTrim);
    arrowHead.rotation.x = -Math.PI / 2;
    arrowHead.position.set(arrowPos.x, -0.31, arrowPos.z - 1.1);
    dockFacadeGroup.add(arrowShaft, arrowHead);

    frontGroup.add(dockFacadeGroup);

    scene.add(frontGroup);
    return frontGroup;
  }
};
