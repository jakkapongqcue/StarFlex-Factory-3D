// ============================================================================
// Module: src/builders/common/pallets.helper.js
// Standard industrial Euro/ISO wooden pallet and roll support generator.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Common = window.Starflex3D.Builders.Common || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords || { addEdges: () => {} };

  const palletWoodMat = new THREE.MeshStandardMaterial({
    color: 0xc89d68,
    roughness: 0.85,
    metalness: 0.05
  });

  const redPalletMat = new THREE.MeshStandardMaterial({
    color: 0xb91c1c,
    roughness: 0.7,
    metalness: 0.05
  });

  /**
   * Create standard wooden or plastic pallet
   * @param {number} w - Width along X (default: 1.2m)
   * @param {number} d - Depth along Z (default: 1.0m)
   * @param {number} h - Height (default: 0.14m)
   * @param {string} type - 'wood' | 'red'
   */
  function createPalletMesh(w = 1.2, d = 1.0, h = 0.14, type = "wood") {
    const mat = type === "red" ? redPalletMat : palletWoodMat;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    if (window.Starflex3D.Coords && window.Starflex3D.Coords.addEdges) {
      window.Starflex3D.Coords.addEdges(mesh, 0x78350f, 0.5);
    }
    return mesh;
  }

  window.Starflex3D.Builders.Common.createPalletMesh = createPalletMesh;
  window.Starflex3D.Builders.Common.palletWoodMat = palletWoodMat;
  window.Starflex3D.Builders.Common.redPalletMat = redPalletMat;
})();
