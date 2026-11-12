// ============================================================================
// Module: src/builders/common/signboard.helper.js
// Centralized 3D signboard generator with high-resolution canvas text,
// auto-scaling font, border styling, and flexible parameter overload support.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Common = window.Starflex3D.Builders.Common || {};

(function () {
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
   * Supports both:
   *   createSignboardMesh(w, h, title, subtitle, bgColor, textColor, borderColor)
   *   createSignboardMesh(title, subtitle, w, h, bgColor, textColor, borderColor)
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

  // Register in primary and backward-compatible namespaces
  window.Starflex3D.Builders.Common.createSignboardMesh = createSignboardMesh;
  window.Starflex3D.Builders.MachineCommon = window.Starflex3D.Builders.MachineCommon || {};
  window.Starflex3D.Builders.MachineCommon.createSignboardMesh = createSignboardMesh;
})();
