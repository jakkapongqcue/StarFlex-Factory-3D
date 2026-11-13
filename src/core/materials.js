// ============================================================================
// Module: src/core/materials.js
// Centralized Three.js PBR material registry with dynamic clipping plane support.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};

window.Starflex3D.Materials = {
  create(clippingPlanes) {
    const clipProps = clippingPlanes ? { clippingPlanes, clipShadows: true } : {};

    return {
      slab: new THREE.MeshStandardMaterial({ color: 0x7e8b9b, roughness: 0.75, metalness: 0.06 }),
      slabEdge: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, metalness: 0.08 }),
      road: new THREE.MeshStandardMaterial({ color: 0xeef2f6, roughness: 0.9, metalness: 0.02 }),

      wallSolid: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.65,
        metalness: 0.1,
        ...clipProps
      }),
      wallPartition: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.7,
        metalness: 0.08,
        transparent: false,
        opacity: 1.0,
        ...clipProps
      }),
      wallCutawayFront: new THREE.MeshStandardMaterial({
        color: 0xdce4ee,
        roughness: 0.55,
        metalness: 0.12,
        transparent: false,
        opacity: 1.0,
        ...clipProps
      }),

      steelColumn: new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.45,
        metalness: 0.55,
        ...clipProps
      }),
      trussSteel: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85,
        ...clipProps
      }),

      roofSheet: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.45,
        metalness: 0.2,
        transparent: false,
        opacity: 1.0,
        side: THREE.DoubleSide,
        ...clipProps
      }),
      solarPanel: new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        roughness: 0.25,
        metalness: 0.65,
        transparent: false,
        opacity: 1.0,
        ...clipProps
      }),

      officeGlass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.38,
        ...clipProps
      }),
      canopyGreen: new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.72,
        ...clipProps
      }),
      rampBlue: new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.5,
        metalness: 0.15
      }),
      craneYellow: new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.35,
        metalness: 0.4,
        ...clipProps
      }),

      machineBody: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.4,
        metalness: 0.3,
        ...clipProps
      }),
      machineDark: new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.45,
        metalness: 0.6,
        ...clipProps
      }),
      chromeRoll: new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.2,
        metalness: 0.85,
        ...clipProps
      }),
      filmRollWhite: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1,
        ...clipProps
      }),
      filmBubble: new THREE.MeshPhysicalMaterial({
        color: 0x7dd3fc,
        roughness: 0.1,
        metalness: 0.05,
        transparent: true,
        opacity: 0.52,
        side: THREE.DoubleSide,
        ...clipProps
      }),
      palletWood: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.75,
        metalness: 0.05,
        ...clipProps
      }),
      cartonBox: new THREE.MeshStandardMaterial({
        color: 0xfde68a,
        roughness: 0.7,
        metalness: 0.05,
        ...clipProps
      })
    };
  }
};
