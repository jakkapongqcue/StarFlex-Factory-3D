// ============================================================================
// Module: src/builders/machines/common.js
// Shared 3D helpers, textures, edge styling and signboards for machine builders.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.MachineCommon = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  function toColorString(val, fallback = "#1e293b") {
    if (typeof val === "number") {
      return "#" + val.toString(16).padStart(6, "0");
    }
    if (typeof val === "string" && val.length > 0) {
      return val.startsWith("#") ? val : "#" + val;
    }
    return fallback;
  }

  /**
   * Create an illuminated 3D signboard with canvas-rendered text and subtitle.
   * Supports both (w, h, title, subtitle, ...) and (title, subtitle, w, h, ...) overloads safely.
   */
  function createSignboardMesh(arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    let w, h, title, subtitle, bgColor, textColor, borderColor;

    if (typeof arg1 === "string") {
      title = arg1;
      subtitle = typeof arg2 === "string" ? arg2 : "";
      w = typeof arg3 === "number" ? arg3 : 3.0;
      h = typeof arg4 === "number" ? arg4 : 0.6;
      bgColor = toColorString(arg5, "#1e293b");
      textColor = toColorString(arg6, "#ffffff");
      borderColor = arg7 ? toColorString(arg7, "#38bdf8") : null;
    } else {
      w = typeof arg1 === "number" ? arg1 : 3.0;
      h = typeof arg2 === "number" ? arg2 : 0.6;
      title = typeof arg3 === "string" ? arg3 : "";
      subtitle = typeof arg4 === "string" ? arg4 : "";
      bgColor = toColorString(arg5, "#1e293b");
      textColor = toColorString(arg6, "#ffffff");
      borderColor = arg7 ? toColorString(arg7, "#38bdf8") : null;
    }

    w = Math.max(0.1, Number(w) || 3.0);
    h = Math.max(0.1, Number(h) || 0.6);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 128);

    if (borderColor) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, 506, 122);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillText(title, 256, subtitle ? 48 : 64);

    if (subtitle) {
      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.fillStyle = textColor;
      ctx.fillText(subtitle, 256, 92);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const signMat = new THREE.MeshBasicMaterial({ map: tex });
    // Box materials: [right, left, top, bottom, front (+Z), back (-Z)]
    const materials = [frameMat, frameMat, frameMat, frameMat, signMat, frameMat];
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), materials);
    return mesh;
  }

  /**
   * Generic enclosed utility / office room block
   */
  function buildRoomBlock(group, itemType, r, H, mats, catColor, accentMat) {
    const boxH = Math.min(H, 4.5);
    const roomMesh = new THREE.Mesh(
      new THREE.BoxGeometry(r.w * 0.94, boxH, r.d * 0.94),
      itemType === "hq_office" ? mats.officeGlass : mats.wallPartition
    );
    roomMesh.position.y = boxH * 0.5;
    addEdges(roomMesh, catColor, 0.65);
    group.add(roomMesh);

    const header = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.95, 0.26, r.d * 0.95), accentMat);
    header.position.y = boxH + 0.13;
    group.add(header);
  }

  /**
   * Build a 100% visible, orientation-proof DoubleSide 3D quad ribbon connecting p1 to p2.
   * Supports both solid colors and patterned film textures along the web run.
   */
  function createWebRibbon(p1, p2, width, material) {
    const halfW = width * 0.5;
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      p1.x, p1.y, p1.z - halfW,
      p1.x, p1.y, p1.z + halfW,
      p2.x, p2.y, p2.z - halfW,

      p2.x, p2.y, p2.z - halfW,
      p1.x, p1.y, p1.z + halfW,
      p2.x, p2.y, p2.z + halfW
    ]);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const len = Math.max(0.1, Math.hypot(dx, dy, dz));
    const uvs = new Float32Array([
      0, 0,
      0, 1,
      len, 0,

      len, 0,
      0, 1,
      len, 1
    ]);
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
    geom.computeBoundingSphere();
    return new THREE.Mesh(geom, material);
  }

  return {
    createSignboardMesh,
    buildRoomBlock,
    createWebRibbon
  };
})();
