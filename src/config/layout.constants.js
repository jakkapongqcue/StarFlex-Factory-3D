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
    FRONT_LAWN: [185, 1170, 1040, 1555], // Polygon garden island strictly parallel to Hall 1 (py = 1170) & Office HQ
    FLAGPOLES: { x1: 875, x2: 945, py: 1515 },
    PORTE_COCHERE: [806, 1190, 886, 1255],
    SPIRIT_HOUSE: [965, 1225],
    CANOPY_OFFICE_NOOK: [1018, 1098, 1106, 1185],
    CANOPY_HALL2_WALKWAY: [1062, 815, 1106, 1098],
    CANOPY_L_EAST_EDGE: 1106, // Continuous east fascia edge py: 815..1185
    BUILDING_4_FRONT: [1395, 1085, 1895, 1230],
    SIGN_WALL: [820, 1552, 1000, 1568], // Directly in front of the 3 Flagpoles
    GATE_IN: [1000, 1558, 1145, 1564],
    ATM_TTB: [1140, 1546, 1165, 1572],
    GUARDHOUSE: [1165, 1445, 1295, 1560],
    GATE_OUT: [1295, 1558, 1450, 1564],
    FENCE_FRONT_WEST: [185, 1560, 820, 1560],
    FENCE_FRONT_EAST: [1450, 1560, 2035, 1560]
  },

  // 3. Central Courtyard & Loading Bay
  COURTYARD: {
    LOADING_COURTYARD: [1062, 815, 1410, 1430],
    LOADING_DOCK_CANOPY: [1062, 815, 1398, 874],
    FRONT_DRIVEWAY: [460, 1150, 1680, 1565],
    OFFICE_NOOK_APRON: [1018, 1098, 1062, 1150],
    WALKWAY_PROD: [1056, 318, 1102, 815], // Main white walkway
    HYGIENE_ROOM: [1056, 320, 1156, 400]  // Hygiene station extending Eastward flush with locker rooms
  },

  // 4. Auxiliary Facilities & Hall 1 Zones
  AUXILIARY: {
    DISTILL_14: [152, 138, 198, 190],
    SOLVENT_MIX_15: [200, 108, 268, 190],
    CHEM_WH_20A: [282, 58, 495, 190],
    LPG_STATION_13: [502, 115, 608, 190],
    CHEM_WH_20B: [615, 105, 918, 190],
    RAW_MAT_WH_5: [922, 48, 1060, 190],
    NE_PUMP_ROOM: [1940, 78, 2038, 198],
    HALL1_SOUTH_OFFICES: [200, 1030, 605, 1098], // SW2, Spare Parts, Data, Production, QA, QA Lab
    HALL1_EAST_WALLS: [
      { py1: 247, py2: 395, name: "Circle 1: Maintenance & Cylinder" },
      { py1: 448, py2: 602, name: "Circle 2: Printing & Burner" },
      { py1: 648, py2: 803, name: "Circle 3: Extrusion & Lamination" },
      { py1: 851, py2: 904, name: "Circle 4: Solvent & Oven Room" }
    ],
    HALL2_WEST_WALLS: [
      { py1: 348, py2: 542, name: "Circle 1: WH-MAIN Warehouse West Wall" },
      { py1: 615, py2: 1015, name: "Circle 2: Finish Good & Bag Making BM Line West Wall" },
      { py1: 1035, py2: 1098, name: "Circle 3: South Office / Fire Exit Corridor West Wall" }
    ]
  }
};
