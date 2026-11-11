// ============================================================================
// Module: src/builders/facade/building4.builder.js
// Building 4 Modern 2-Story Blue Glass Curtain Wall Facade,
// Stepped Charcoal Cantilever Fascia, White V-Columns, Porch & Storage Tent.
// References: References/Front_View_2_Guardhouse_ATM_and_East_Building.jpg,
//             Front_View_4_East_Building_V_Columns.jpg, Front_View_5
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facade = window.Starflex3D.Builders.Facade || {};

window.Starflex3D.Builders.Facade.Building4 = {
  build(fMats) {
    const { rect, addEdges } = window.Starflex3D.Coords;
    const group = new THREE.Group();
    group.name = "FacadeBuilding4";

    const eastFrontR = rect([1395, 1085, 1895, 1230]);
    const eastH = 8.4;

    // 1. Solid Inner Backing Core (blocks see-through into Hall 4)
    const solidInnerCore = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w - 0.3, eastH - 0.1, eastFrontR.d - 0.3),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 })
    );
    solidInnerCore.position.set(eastFrontR.x, eastH * 0.5, eastFrontR.z - 0.08);
    group.add(solidInnerCore);

    // Solid Roof Deck Slab over the entire 2-story annex
    const annexRoofCap = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w + 0.4, 0.35, eastFrontR.d + 1.2),
      fMats.charcoalFascia
    );
    annexRoofCap.position.set(eastFrontR.x, eastH + 0.15, eastFrontR.z);
    group.add(annexRoofCap);

    // 2-Story Reflective Blue Glass Curtain Wall Shell
    const glassBox = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w, eastH, eastFrontR.d),
      fMats.reflectiveGlass
    );
    glassBox.position.set(eastFrontR.x, eastH * 0.5, eastFrontR.z);
    addEdges(glassBox, 0x1e293b, 0.75);
    group.add(glassBox);

    // 2. Royal-Blue Feature Wall Fin on West Corner of Building 4
    const blueFinR = rect([1395, 1085, 1432, 1234]);
    const blueFin = new THREE.Mesh(
      new THREE.BoxGeometry(blueFinR.w, eastH + 0.1, blueFinR.d),
      fMats.blueBrand
    );
    blueFin.position.set(blueFinR.x, eastH * 0.5, blueFinR.z);
    addEdges(blueFin, 0x93c5fd, 0.6);
    group.add(blueFin);

    // 3. Bold Dark-Charcoal Stepped Cantilevered Roof Fascia
    const mainFascia = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w * 0.76, 1.15, eastFrontR.d + 2.8),
      fMats.charcoalFascia
    );
    mainFascia.position.set(eastFrontR.x - eastFrontR.w * 0.1, eastH + 0.55, eastFrontR.z + 0.6);
    addEdges(mainFascia, 0x71717a, 0.7);
    group.add(mainFascia);

    // Right lower stepped fascia wing
    const rightFascia = new THREE.Mesh(
      new THREE.BoxGeometry(eastFrontR.w * 0.28, 0.95, eastFrontR.d + 2.0),
      fMats.charcoalFascia
    );
    rightFascia.position.set(eastFrontR.x + eastFrontR.w * 0.38, eastH - 0.35, eastFrontR.z + 0.3);
    addEdges(rightFascia, 0x71717a, 0.7);
    group.add(rightFascia);

    // 4. Signature White V-Shaped Angled Columns across Front Glass Facade
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
        group.add(strut);
      });
    }

    // 5. Modern Flat Dark-Charcoal Entrance Canopy
    const eastPorchR = rect([1465, 1230, 1595, 1288]);
    const eastPorchRoof = new THREE.Mesh(
      new THREE.BoxGeometry(eastPorchR.w, 0.65, eastPorchR.d),
      fMats.charcoalFascia
    );
    eastPorchRoof.position.set(eastPorchR.x, 4.2, eastPorchR.z);
    addEdges(eastPorchRoof, 0x94a3b8, 0.7);
    group.add(eastPorchRoof);

    [-eastPorchR.w * 0.42, eastPorchR.w * 0.42].forEach(dx => {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 4.2, 0.38),
        fMats.charcoalFascia
      );
      col.position.set(eastPorchR.x + dx, 2.1, eastPorchR.z2 - 0.35);
      group.add(col);
    });

    // 6. Grey Arched Storage Tent in East Yard
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
    group.add(tentBody, tentArch);

    return group;
  }
};
