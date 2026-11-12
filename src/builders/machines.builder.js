// ============================================================================
// Module: src/builders/machines.builder.js
// Main Coordinator & Dispatcher for all procedural 3D equipment and facilities.
// Delegates building to modular domain builders under src/builders/machines/.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Machines = (function () {
  const { rect } = window.Starflex3D.Coords;

  function build(scene, mats, state) {
    const items = window.Starflex3D.Data.items;
    const categories = window.Starflex3D.Categories;

    const { createSignboardMesh, buildRoomBlock } = window.Starflex3D.Builders.MachineCommon;
    const { buildGravurePress } = window.Starflex3D.Builders.Printing;
    const { buildBlowFilmTower } = window.Starflex3D.Builders.BlownFilm;
    const { buildExtrusionLine, buildLaminator, buildOvenChamber } = window.Starflex3D.Builders.Laminating;
    const { buildBagMakingArray, buildSpoutOrSlitter } = window.Starflex3D.Builders.Converting;
    const { buildPalletRacks } = window.Starflex3D.Builders.Warehouse;
    const { buildLoadingDockTrucks } = window.Starflex3D.Builders.LoadingDock;
    const { buildLockerRoom, buildStairsAndRestrooms, buildProductionWalkway, buildHall1SouthOffice } = window.Starflex3D.Builders.Facilities;
    const { buildFilmRollRacks, buildResinStorage } = window.Starflex3D.Builders.ResinFilmStorage;
    const { buildChemicalWarehouse } = window.Starflex3D.Builders.ChemicalWarehouse;
    const { buildCylinderStorage } = window.Starflex3D.Builders.CylinderStorage;

    const itemsGroup = new THREE.Group();
    itemsGroup.name = "MachinesAndZones";

    // Factory Interior Floor is elevated at +1.25m (equal to loading dock level)
    const factoryElevation = 1.25;

    items.forEach(item => {
      const cat = categories[item.category] || categories.office_utility;
      const r = rect(item.bounds);
      const isOutsideGroundItem = (
        item.id === "loading_dock_trucks" ||
        item.id === "guardhouse_item" ||
        item.id === "pump_house_item" ||
        item.id === "chem_storage_building" ||
        item.hall === "exterior" ||
        item.type === "chemical_warehouse" ||
        item.id === "east_ramps_shipping" ||
        item.id === "admin_vip_office"
      );
      const itemY = isOutsideGroundItem ? 0 : factoryElevation;
      const group = new THREE.Group();
      group.position.set(r.x, itemY, r.z);
      group.userData = { item, category: cat, rect: r, elevation: itemY };

      const accentMat = new THREE.MeshStandardMaterial({
        color: cat.color,
        roughness: 0.32,
        metalness: 0.35
      });
      const lightAccentMat = new THREE.MeshStandardMaterial({
        color: cat.accent,
        roughness: 0.35,
        metalness: 0.25
      });

      const isNS = item.orientation === "NS" || r.d > r.w * 1.25;
      const L = isNS ? r.d : r.w;
      const W = isNS ? r.w : r.d;
      const H = item.height || 4.0;

      const inner = new THREE.Group();
      if (isNS) inner.rotation.y = Math.PI / 2;

      switch (item.type) {
        case "gravure_press":
          buildGravurePress(inner, L, W, H, mats, accentMat, lightAccentMat);
          break;
        case "blow_film_tower":
          buildBlowFilmTower(inner, L, W, H, mats, accentMat);
          break;
        case "extrusion_line":
          buildExtrusionLine(inner, L, W, H, mats, accentMat, lightAccentMat);
          break;
        case "laminator":
        case "converting_group":
          buildLaminator(inner, L, W, H, mats, accentMat);
          break;
        case "oven_chamber":
        case "burner_unit":
          buildOvenChamber(inner, L, W, H, accentMat);
          break;
        case "bag_making_array":
          buildBagMakingArray(group, r, mats, accentMat);
          break;
        case "spout_array":
        case "slitter_array":
        case "slitter_group":
          buildSpoutOrSlitter(group, item.type, r, mats, accentMat);
          break;
        case "locker_room_yellow":
          buildLockerRoom(group, r, H, mats, 0xf59e0b, "ห้องเปลี่ยนชุดพนักงาน #2 (หญิง)", "GOWNING ROOM 2");
          break;
        case "locker_room_blue":
          buildLockerRoom(group, r, H, mats, 0x2563eb, "ห้องเปลี่ยนชุดพนักงาน #1 (ชาย)", "GOWNING ROOM 1");
          break;
        case "utility_stairs_wc":
          buildStairsAndRestrooms(group, r, H, mats);
          break;
        case "production_walkway":
          buildProductionWalkway(group, r, H, mats);
          break;
        case "hall1_south_office":
          buildHall1SouthOffice(group, item, r, H, mats);
          break;
        case "highbay_racks":
        case "rack_zone":
        case "warehouse_racks":
        case "warehouse_zone":
        case "staging_racks":
        case "hanging_rack":
          buildPalletRacks(group, item, r, H, mats);
          break;
        case "loading_dock":
          buildLoadingDockTrucks(group, r, mats);
          break;
        case "film_roll_racks":
          buildFilmRollRacks(group, r, H, mats);
          break;
        case "resin_storage":
          buildResinStorage(group, r, H, mats);
          break;
        case "chemical_warehouse":
          buildChemicalWarehouse(group, r, H, mats);
          break;
        case "cylinder_storage":
          buildCylinderStorage(group, r, H, mats);
          break;
        case "hq_office":
        case "guard_station":
        case "ramp_group":
          // Fully modeled by FrontFacade builder, avoid duplicate meshes & Z-fighting
          break;
        default:
          buildRoomBlock(group, item.type, r, H, mats, cat.color, accentMat);
          break;
      }

      group.add(inner);
      itemsGroup.add(group);
      state.itemMeshes.set(item.id, group);
    });

    scene.add(itemsGroup);
    return itemsGroup;
  }

  return { build };
})();
