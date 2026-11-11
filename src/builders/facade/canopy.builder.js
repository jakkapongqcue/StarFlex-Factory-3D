// ============================================================================
// Module: src/builders/facade/canopy.builder.js
// Continuous L-Shaped Canopy connecting Office-HQ East nook to Hall 2 East Walkway.
// Flushes seamlessly at px: 1062..1106, py: 1098 at H = 4.05m.
// Ground beneath is completely flat and open for driveway/apron traffic.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Canopy = {
  build(fMats) {
    const { rect, addEdges } = window.Starflex3D.Coords;
    const { createACUnit } = window.Starflex3D.Builders.Facade.Common;
    const group = new THREE.Group();
    group.name = "FacadeLCanopy";

    const canopyH = 4.05;

    // 1. Arm 1: Office-HQ East Nook Canopy Deck (px: 1018..1106, py: 1098..1185)
    const extCanopyR = rect([1018, 1098, 1106, 1185]);
    const extCanopyDeck = new THREE.Mesh(
      new THREE.BoxGeometry(extCanopyR.w, 0.22, extCanopyR.d),
      fMats.guardRoofTile
    );
    extCanopyDeck.position.set(extCanopyR.x, canopyH, extCanopyR.z);
    extCanopyDeck.castShadow = true;
    extCanopyDeck.receiveShadow = true;
    addEdges(extCanopyDeck, 0x475569, 0.7);
    group.add(extCanopyDeck);

    // Front (South) fascia trim along py = 1185 (px: 1018..1106)
    const extFasciaFront = new THREE.Mesh(
      new THREE.BoxGeometry(extCanopyR.w + 0.16, 0.38, 0.16),
      fMats.charcoalFascia
    );
    extFasciaFront.position.set(extCanopyR.x, canopyH - 0.06, extCanopyR.z2 + 0.08);
    addEdges(extFasciaFront, 0x94a3b8, 0.75);
    group.add(extFasciaFront);

    // Row of 4 AC outdoor condenser units mounted on the nook canopy roof
    const numAcUnits = 4;
    for (let i = 0; i < numAcUnits; i++) {
      const acZ = extCanopyR.z1 + (extCanopyR.d * (i + 0.5)) / numAcUnits;
      const acUnit = createACUnit(extCanopyR.x1 + 1.15, canopyH + 0.44, acZ, 0, fMats);
      group.add(acUnit);
    }

    // 2. Arm 2: Hall 2 East Walkway Canopy Deck (px: 1062..1106, py: 815..1098)
    const walkCanopyR = rect([1062, 815, 1106, 1098]);
    const walkCanopyDeck = new THREE.Mesh(
      new THREE.BoxGeometry(walkCanopyR.w, 0.22, walkCanopyR.d),
      fMats.guardRoofTile
    );
    walkCanopyDeck.position.set(walkCanopyR.x, canopyH, walkCanopyR.z);
    walkCanopyDeck.castShadow = true;
    walkCanopyDeck.receiveShadow = true;
    addEdges(walkCanopyDeck, 0x475569, 0.7);
    group.add(walkCanopyDeck);

    // 3. Continuous Charcoal Fascia Trim along the entire outer (East) roof edge (py: 815..1185 at px = 1106)
    const lEastFasciaR = rect([1106, 815, 1106, 1185]);
    const walkFasciaEast = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.38, lEastFasciaR.d + 0.16),
      fMats.charcoalFascia
    );
    walkFasciaEast.position.set(lEastFasciaR.x + 0.08, canopyH - 0.06, lEastFasciaR.z);
    addEdges(walkFasciaEast, 0x94a3b8, 0.75);
    group.add(walkFasciaEast);

    return group;
  }
};
