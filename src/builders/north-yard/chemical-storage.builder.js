// ============================================================================
// Module: src/builders/north-yard/chemical-storage.builder.js
// Procedural 3D Builder for Zone 20: อาคารจัดเก็บสารเคมี 1 & 2 (Chemical Storage 1 & 2).
// Includes North waste sorting shed ("โรงคัดแยกขยะ"), color-coded recycling bins,
// hazardous chemical drum spill pallets and safety warning boards.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.NorthYard = window.Starflex3D.Builders.NorthYard || {};

(function () {
  const { addEdges } = window.Starflex3D.Coords;
  const { createSignboardMesh } = window.Starflex3D.Builders.Common || window.Starflex3D.Builders.MachineCommon || {};
  const NYCommon = window.Starflex3D.Builders.NorthYard.Common;

  function buildChemicalWarehouse(group, r, H, mats, item) {
    const { mats: nyMats, buildGabledShellEW, addSouthShutterDoor, addRoofVentilators } = NYCommon;
    const bldgGroup = new THREE.Group();
    group.add(bldgGroup);

    const eaveH = 4.2;
    const ridgeH = H || 5.6;
    const halfW = r.w * 0.5;
    const halfD = r.d * 0.5;
    const isZone20A = item && item.id === "chem_storage_building";

    if (isZone20A) {
      // Zone 20A has North Waste Sorting Bay ("โรงคัดแยกขยะ") + Main Chemical Storage + East Flammable Bay
      const wasteD = r.d * 0.28;
      const mainD = r.d - wasteD;
      const mainZ = wasteD * 0.5;
      const wasteZ = -halfD + wasteD * 0.5;

      // Main South Chemical Warehouse Shell
      buildGabledShellEW(bldgGroup, r.w, mainD, eaveH, ridgeH, mainZ);
      addRoofVentilators(bldgGroup, [-r.w * 0.32, 0, r.w * 0.32], ridgeH, mainZ);

      // North Waste Sorting Shed Annex ("โรงคัดแยกขยะ")
      const shedH = 3.5;
      const shedFloor = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.98, 0.26, wasteD), nyMats.floorSlabMat);
      shedFloor.position.set(0, 0.13, wasteZ);
      const shedWall = new THREE.Mesh(new THREE.BoxGeometry(r.w * 0.96, shedH, wasteD * 0.96), nyMats.wallMat);
      shedWall.position.set(0, shedH * 0.5, wasteZ);
      addEdges(shedWall, 0x94a3b8, 0.6);
      const shedRoof = new THREE.Mesh(new THREE.BoxGeometry(r.w + 0.5, 0.14, wasteD + 0.4), nyMats.roofMat);
      shedRoof.position.set(0, shedH + 0.07, wasteZ);
      addEdges(shedRoof, 0x1e293b, 0.65);
      bldgGroup.add(shedFloor, shedWall, shedRoof);

      // Color-coded Waste & Recycle Bins along North Waste Sorting Bay
      const binColors = [0x1d4ed8, 0xfacc15, 0x16a34a, 0xdc2626, 0x1d4ed8, 0xfacc15];
      binColors.forEach((col, idx) => {
        const bx = -r.w * 0.35 + (r.w * 0.70 * idx) / (binColors.length - 1);
        const bin = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 1.25, 1.0),
          new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 })
        );
        bin.position.set(bx, 0.26 + 0.625, wasteZ);
        addEdges(bin, 0x0f172a, 0.5);
        bldgGroup.add(bin);
      });

      const wasteSign = createSignboardMesh(4.6, 0.75, "20 · โรงคัดแยกขยะ", "WASTE SORTING & RECYCLE", "#15803d");
      wasteSign.rotation.y = Math.PI;
      wasteSign.position.set(0, shedH - 0.45, -halfD - 0.06);
      bldgGroup.add(wasteSign);

      // South Doors & Signboard on Main Chemical Section
      const southWallZ = halfD * 0.96;
      [-r.w * 0.25, r.w * 0.18].forEach(dx => {
        addSouthShutterDoor(bldgGroup, dx, southWallZ, 3.0, 2.9);
      });

      const sign = createSignboardMesh(
        6.2,
        0.88,
        "20 · อาคารจัดเก็บสารเคมี 1 และของเหลวไวไฟ",
        "CHEMICAL STORAGE 1 & FLAMMABLE LIQUIDS",
        "#dc2626"
      );
      sign.position.set(0, 3.55, southWallZ + 0.08);
      bldgGroup.add(sign);
    } else {
      // Zone 20B: Long East-West Chemical Storage 2 behind Hall 2
      buildGabledShellEW(bldgGroup, r.w, r.d, eaveH, ridgeH, 0);
      addRoofVentilators(bldgGroup, [-r.w * 0.36, -r.w * 0.12, r.w * 0.12, r.w * 0.36], ridgeH, 0);

      const southWallZ = halfD * 0.96;
      [-r.w * 0.30, 0, r.w * 0.30].forEach(dx => {
        addSouthShutterDoor(bldgGroup, dx, southWallZ, 3.0, 2.9);
      });

      const sign = createSignboardMesh(
        6.0,
        0.88,
        "20 · อาคารจัดเก็บสารเคมี 2 (HAZCHEM)",
        "CHEMICAL & SOLVENT STORAGE WAREHOUSE 2",
        "#dc2626"
      );
      sign.position.set(0, 3.55, southWallZ + 0.08);
      bldgGroup.add(sign);
    }

    // Populate Interior with 200L Chemical Drums & 1,000L IBC Totes
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const numPallets = Math.max(4, Math.floor(r.w / 4.2));
    for (let p = 0; p < numPallets; p++) {
      const px = -r.w * 0.38 + (r.w * 0.76 * p) / Math.max(1, numPallets - 1);
      const palletZ = isZone20A ? r.d * 0.05 : -halfD * 0.22;

      const spPallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 1.4), nyMats.curbMat);
      spPallet.position.set(px, 0.3 + 0.11, palletZ);
      const grate = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 1.36), grateMat);
      grate.position.set(px, 0.3 + 0.24, palletZ);
      bldgGroup.add(spPallet, grate);

      [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]].forEach(([dx, dz], dIdx) => {
        const drumMat = (p + dIdx) % 3 === 0 ? nyMats.drumRedMat : (p + dIdx) % 2 === 0 ? nyMats.drumBlueMat : nyMats.drumGreenMat;
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.92, 12), drumMat);
        drum.position.set(px + dx, 0.3 + 0.26 + 0.46, palletZ + dz);
        addEdges(drum, 0x0f172a, 0.4);
        bldgGroup.add(drum);
      });
    }
  }

  window.Starflex3D.Builders.NorthYard.buildChemicalWarehouse = buildChemicalWarehouse;
})();
