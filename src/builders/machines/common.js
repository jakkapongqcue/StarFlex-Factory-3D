// ============================================================================
// Module: src/builders/machines/common.js
// Shared 3D helpers, textures, edge styling and signboards for machine builders.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.MachineCommon = (function () {
  const { addEdges } = window.Starflex3D.Coords;

  /**
   * Create an illuminated 3D signboard with canvas-rendered text and subtitle
   */
  function createSignboardMesh(w, h, title, subtitle, bgColorHex, textColorHex, borderColorHex) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = bgColorHex;
    ctx.fillRect(0, 0, 512, 128);

    if (borderColorHex) {
      ctx.strokeStyle = borderColorHex;
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, 506, 122);
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textColorHex || "#ffffff";
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillText(title, 256, subtitle ? 48 : 64);

    if (subtitle) {
      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.fillStyle = textColorHex || "#e2e8f0";
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

  return {
    createSignboardMesh,
    buildRoomBlock
  };
})();
