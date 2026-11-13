// ============================================================================
// Module: src/data/machines/converting.data.js
// Machine items for Bag Making arrays, Spout machines, and Slitter Rewinders
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.converting = [
  // --- Hall 1 Inspection & Rewinder Group ---
  {
    id: "sm_hall1_group",
    code: "SH/SM-W",
    name: "SH 02, SH 03, SM 14, SM 05 (เครื่องตรวจสอบและกรอม้วน)",
    category: "converting",
    hall: "hall_1",
    type: "inspection_group",
    bounds: [228, 545, 338, 588],
    height: 2.6,
    orientation: "EW",
    specs: "4 เครื่องย่อย Inspection & Rewinder (SH 02, SH 03, SM 14, SM 05)",
    description: "กลุ่มเครื่องตรวจสอบคุณภาพฟิล์มพิมพ์และกรอม้วนย่อยในอาคาร 1 (SH 02, SH 03, SM 14, SM 05)"
  },

  // --- Hall 2 Bag Making Lines ---
  {
    id: "bm_lines_group",
    code: "BM 04–17",
    name: "สายเครื่องขึ้นรูปถุงอัตโนมัติ (Bag Making BM 04–17 & Spout)",
    category: "converting",
    hall: "hall_2",
    type: "bag_making_array",
    bounds: [680, 742, 1055, 892],
    height: 2.8,
    orientation: "NS",
    specs: "13 สายการผลิต 5-Stage Pouch Lines (BM 14, 15, 12, 11, 17, 16, 04, 13, 05, 06, 07, 08, 10) + เครื่องตัดฝา Spout",
    description: "โถงเครื่องตัดและซีลขึ้นรูปถุงบรรจุภัณฑ์อัตโนมัติ 13 สายการผลิต พร้อมเครื่องตัดฝา Spout จัดวางตามผัง Hall 2 (Unwind ด้านใต้ · Outfeed ด้านเหนือ)"
  },
  {
    id: "spout_1sp_group",
    code: "1SP 01–07",
    name: "เครื่องติดฝาจุกอัตโนมัติ (Spout Insertion 1SP-01 ถึง 1SP-07)",
    category: "converting",
    hall: "hall_2",
    type: "spout_array",
    bounds: [702, 852, 992, 916],
    height: 2.6,
    orientation: "EW",
    specs: "7 เครื่องติดฝาเกลียวอัลตราโซนิก ST_SPOUT (แถวบน 1SP-02, 1SP-01 · แถวล่าง 1SP-03 ถึง 1SP-07) + สายพานออกกล่องและพาเลท",
    description: "กลุ่มเครื่องซีลติดฝาจุกอัลตราโซนิกอัตโนมัติ (Ultrasonic Spout Inserter & Welder) จัดวาง 2 แถวตามผัง Hall 2 พร้อมชามสั่นป้อนฝา ชุดหัวเชื่อมอัลตราโซนิก และสายพานลำเลียงลงกล่องสินค้า"
  },
  {
    id: "spout_south_group",
    code: "1SP 08–09",
    name: "เครื่องติดฝาจุกอัตโนมัติ โซนใต้ (Spout Insertion 1SP-08 & 1SP-09)",
    category: "converting",
    hall: "hall_2",
    type: "spout_array_south",
    bounds: [684, 1054, 804, 1086],
    height: 2.6,
    orientation: "EW",
    specs: "2 เครื่องติดฝาเกลียวอัลตราโซนิก ST_SPOUT (1SP-08, 1SP-09) · วางด้านใต้มุมตะวันตกของ Hall 2 ใต้แนว BM 09",
    description: "เครื่องซีลติดฝาจุกอัลตราโซนิกอัตโนมัติเพิ่มใหม่ 2 เครื่อง (1SP-08 และ 1SP-09) จัดวางคู่ขนานบริเวณมุมทิศตะวันตกเฉียงใต้ของ Hall 2 ใต้แนวเครื่องขึ้นรูปถุง BM 09"
  },
  {
    id: "sm_slitter_hall2",
    code: "SM / 2RW / BM09",
    name: "โซนเครื่องตัดซอยและกรอม้วน (Slitter SM 01–20, 2RW-18 & BM-09)",
    category: "converting",
    hall: "hall_2",
    type: "slitter_array",
    bounds: [680, 910, 1055, 1038],
    height: 2.6,
    orientation: "EW",
    specs: "13 แท่น VENUS III Duplex Slitter (SM 01..12, 2RW-18, SM 08, SH 01, SM 07, SM13) + BM 09 แนวนอน",
    description: "กลุ่มเครื่องตัดซอยม้วนฟิล์มความเร็วสูง VENUS III (แถวหลัก SM 01, 2SM 17, SM 15, SM 06, 1SM 19, 1SM 20, SM 11, SM 12 + 2RW 18 + กลุ่มขวา SM 08, SH 01, SM 07, SM13) พร้อมสาย BM 09 วางแนวนอนมุมซ้ายล่าง"
  }
];
