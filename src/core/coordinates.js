// ============================================================================
// Module: src/core/coordinates.js
// Coordinate conversion between 2D blueprint pixels (2340 x 1590) and
// 3D world space in meters, plus wireframe edge geometry helpers.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};

window.Starflex3D.Coords = (function () {
  const meta = window.Starflex3D.Config.meta;
  const CX = meta.centerX;
  const CY = meta.centerY;
  const S = meta.scale;

  /**
   * Convert blueprint pixel point (px, py) -> 3D world coordinates { x, z }
   */
  function pt(px, py) {
    return {
      x: (px - CX) * S,
      z: (py - CY) * S
    };
  }

  /**
   * Convert blueprint pixel bounding box [px1, py1, px2, py2] -> 3D center & dimensions
   */
  function rect(b) {
    const w = Math.abs(b[2] - b[0]) * S;
    const d = Math.abs(b[3] - b[1]) * S;
    const x = ((b[0] + b[2]) * 0.5 - CX) * S;
    const z = ((b[1] + b[3]) * 0.5 - CY) * S;
    return {
      x,
      z,
      w,
      d,
      x1: (b[0] - CX) * S,
      z1: (b[1] - CY) * S,
      x2: (b[2] - CX) * S,
      z2: (b[3] - CY) * S
    };
  }

  /**
   * Attach crisp architectural edge lines to a Three.js mesh
   */
  function addEdges(mesh, color = 0x94a3b8, opacity = 0.45) {
    const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity })
    );
    mesh.add(line);
    return line;
  }

  return {
    pt,
    rect,
    addEdges
  };
})();
