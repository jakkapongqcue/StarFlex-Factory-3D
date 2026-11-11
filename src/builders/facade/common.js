// ============================================================================
// Module: src/builders/facade/common.js
// Shared geometry generators, materials, and logo texture loaders for Facade.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Common = {
  getMaterials(mats) {
    return {
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
      darkWindow: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.4 }),
      acBody: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45, metalness: 0.15 }),
      acGrille: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.3 })
    };
  },

  /**
   * Builds a true 3D rectangular Hipped Roof (หลังคาปั้นหยา) geometry.
   * Perfectly squared with axes, zero tilt/skew/crookedness, with crisp horizontal apex ridge cap.
   */
  createHippedRoofGeometry(w, d, h) {
    const halfW = w * 0.5;
    const halfD = d * 0.5;
    const isLongX = w >= d;
    const ridgeL = isLongX ? Math.max(0, w - d * 0.75) : Math.max(0, d - w * 0.75);
    const halfR = ridgeL * 0.5;

    const positions = [];
    const uvs = [];

    const v0 = [-halfW, 0, halfD];  // Front-Left (South-West)
    const v1 = [halfW, 0, halfD];   // Front-Right (South-East)
    const v2 = [halfW, 0, -halfD];  // Back-Right (North-East)
    const v3 = [-halfW, 0, -halfD]; // Back-Left (North-West)

    let r0, r1;
    if (isLongX) {
      r0 = [-halfR, h, 0];
      r1 = [halfR, h, 0];
    } else {
      r0 = [0, h, -halfR];
      r1 = [0, h, halfR];
    }

    function addTri(a, b, c) {
      positions.push(...a, ...b, ...c);
      uvs.push(0, 0, 1, 0, 0.5, 1);
    }
    function addQuad(a, b, c, d) {
      addTri(a, b, c);
      addTri(a, c, d);
    }

    if (isLongX) {
      addQuad(v0, v1, r1, r0); // South
      addQuad(v2, v3, r0, r1); // North
      addTri(v1, v2, r1);      // East
      addTri(v3, v0, r0);      // West
    } else {
      addQuad(v1, v2, r0, r1); // East
      addQuad(v3, v0, r1, r0); // West
      addTri(v0, v1, r1);      // South
      addTri(v2, v3, r0);      // North
    }

    addQuad(v0, v3, v2, v1);   // Bottom ceiling soffit

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  },

  createACUnit(x, y, z, rotY = 0, fMats) {
    const { addEdges } = window.Starflex3D.Coords;
    const ac = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.66, 0.38), fMats.acBody);
    addEdges(box, 0x94a3b8, 0.6);
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.4, 10), fMats.acGrille);
    fan.rotation.x = Math.PI / 2;
    fan.position.set(-0.12, 0, 0.02);
    ac.add(box, fan);
    ac.position.set(x, y, z);
    ac.rotation.y = rotY;
    return ac;
  },

  createStarflexLogoSignTexture(options = {}) {
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

      // Bold STARFLEX lettering
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 " + (showSubtext ? "82px" : "96px") + ' "Montserrat", "Segoe UI", Arial, sans-serif';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("STARFLEX", icX + (showSubtext ? 75 : 90), icY);

      if (showSubtext) {
        ctx.fillStyle = "#f1f5f9";
        ctx.font = 'bold 30px "Kanit", "Prompt", "Segoe UI", Arial, sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText("PUBLIC COMPANY LIMITED  ·  บริษัท สตาร์เฟล็กซ์ จำกัด (มหาชน)", canvas.width / 2, 218);

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
      const logoSrc = (window.STARFLEX_TEXTURES && window.STARFLEX_TEXTURES.starflexLogo) || "assets/Starflex_logo.png";

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
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const isGrayscale = Math.abs(r - g) < 22 && Math.abs(g - b) < 22 && Math.abs(r - b) < 22;
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
          ctx.fillText("PUBLIC COMPANY LIMITED  ·  บริษัท สตาร์เฟล็กซ์ จำกัด (มหาชน)", canvas.width / 2, 218);

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
};
