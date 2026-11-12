// ============================================================================
// Module: src/config/layout.constants.js
// Single Source of Truth for 2D Blueprint Pixel Bounds and Coordinate Ranges.
// Conversion Formula:
//   X (world meters) = (px - 1050) * 0.1
//   Z (world meters) = (py - 760) * 0.1
//   Y (world meters) = elevation above ground
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Config = window.Starflex3D.Config || {};

window.Starflex3D.Config.Layout = {
  // 1. Primary Factory Buildings & Halls
  BUILDINGS: {
    HALL_1: { id: "bld_hall1", bounds: [200, 247, 632, 1098], name: "Hall 1 (อาคาร 1 - สโตร์และรีดฟิล์ม)" },
    HALL_2: { id: "bld_hall2", bounds: [632, 247, 1062, 1098], name: "Hall 2 (อาคาร 2 - พิมพ์และเคลือบ)" },
    OFFICE_HQ: { id: "bld_office", bounds: [674, 1098, 1018, 1190], name: "Office HQ (สำนักงานใหญ่ 2 ชั้น)" },
    HALL_3_WH: { id: "bld_hall3", bounds: [1062, 247, 1498, 815], name: "Hall 3 Warehouse (คลังสินค้าและช่องโหลด)" },
    HALL_4: { id: "bld_hall4", bounds: [1498, 247, 1895, 1230], name: "Hall 4 (อาคาร 4 - เป่าฟิล์มและซอง)" }
  },

  // 2. Front Streetscape, Security & Gates
  FACADE: {
    FRONT_LAWN: [120, 1150, 460, 1545],
    FLAGPOLES: { x1: 375, x2: 435, py: 1510 },
    PORTE_COCHERE: [806, 1190, 886, 1255],
    SPIRIT_HOUSE: [965, 1225],
    CANOPY_OFFICE_NOOK: [1018, 1098, 1106, 1185],
    CANOPY_HALL2_WALKWAY: [1062, 815, 1106, 1098],
    CANOPY_L_EAST_EDGE: 1106, // Continuous east fascia edge py: 815..1185
    BUILDING_4_FRONT: [1395, 1085, 1895, 1230],
    SIGN_WALL: [695, 1552, 878, 1568],
    GATE_IN: [878, 1558, 1145, 1564],
    ATM_TTB: [1140, 1546, 1165, 1572],
    GUARDHOUSE: [1165, 1445, 1295, 1560],
    GATE_OUT: [1295, 1558, 1450, 1564],
    FENCE_FRONT_WEST: [185, 1560, 695, 1560],
    FENCE_FRONT_EAST: [1450, 1560, 2035, 1560]
  },

  // 3. Central Courtyard & Loading Bay
  COURTYARD: {
    LOADING_COURTYARD: [1062, 815, 1410, 1430],
    LOADING_DOCK_CANOPY: [1062, 815, 1398, 874],
    FRONT_DRIVEWAY: [460, 1150, 1680, 1565],
    OFFICE_NOOK_APRON: [1018, 1098, 1062, 1150],
    WALKWAY_PROD: [1056, 318, 1102, 815] // Main white walkway & North hygiene station
  },

  // 4. Auxiliary Facilities & Hall 1 Zones
  AUXILIARY: {
    CHEM_WH: [240, 80, 540, 190],
    NE_PUMP_ROOM: [1940, 78, 2038, 198],
    HALL1_SOUTH_OFFICES: [200, 1030, 632, 1098] // SW2, Spare Parts, Data, Production, QA, QA Lab, Fire Exit
  }
};
