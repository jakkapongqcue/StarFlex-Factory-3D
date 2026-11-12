// ============================================================================
// Module: src/data/machines/converting.data.js
// Machine items for Bag Making arrays, Spout machines, and Slitter Rewinders
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.converting = [
  // --- Hall 1 Slitter Group ---
  {
    id: "sm_hall1_group",
    code: "SH/SM-W",
    name: "SH 02, SH 03, SM 14, SM 05 (เครื่องตรวจสอบและกรอม้วน)",
    category: "converting",
    hall: "hall_1",
    type: "slitter_group",
    bounds: [228, 545, 338, 588],
    height: 2.6,
    orientation: "EW",
    specs: "4 เครื่องย่อย (SH 02, SH 03, SM 14, SM 05)",
    description: "กลุ่มเครื่องตรวจสอบคุณภาพฟิล์มพิมพ์และกรอม้วนย่อยในอาคาร 1"
  },

  // --- Hall 2 Bag Making Lines ---
  {
    id: "bm_lines_group",
    code: "BM 04–17",
    name: "สายเครื่องขึ้นรูปถุงอัตโนมัติ (Bag Making BM 04–17 & Spout)",
    category: "converting",
    hall: "hall_2",
    type: "bag_making_array",
    bounds: [724, 755, 1042, 955],
    height: 2.8,
    orientation: "NS",
    specs: "14 สายการผลิตขนาน (BM 14, Spout, BM 15, 12, 11, 17, 16, 04, 13, 05, 06, 07, 08, 10)",
    description: "โถงเครื่องตัดและซีลขึ้นรูปถุงบรรจุภัณฑ์อัตโนมัติ (Stand-up Pouch, Zipper Bag, Retort Pouch, Quad Seal) เรียงแถวขนาน 14 สายการผลิต"
  },
  {
    id: "spout_1sp_group",
    code: "1SP 01–07",
    name: "เครื่องติดฝาจุกอัตโนมัติ (Spout Insertion 1SP-01 ถึง 1SP-07)",
    category: "converting",
    hall: "hall_2",
    type: "spout_array",
    bounds: [748, 942, 982, 986],
    height: 2.5,
    orientation: "EW",
    specs: "7 เครื่องติดฝาเกลียว/จุกหลอด (1SP-01 .. 1SP-07)",
    description: "กลุ่มเครื่องซีลติดฝาจุก (Spout Pouch Machines) สำหรับซองบรรจุของเหลว เครื่องดื่ม และผลิตภัณฑ์ดูแลร่างกาย"
  },
  {
    id: "sm_slitter_hall2",
    code: "SM / 2RW / BM09",
    name: "โซนเครื่องตัดซอยและกรอม้วน (Slitter SM 01–20, 2RW-18 & BM-09)",
    category: "converting",
    hall: "hall_2",
    type: "slitter_array",
    bounds: [736, 868, 1046, 1056],
    height: 2.6,
    orientation: "EW",
    specs: "เครื่องตัดซอยฟิล์มความเร็วสูง 14 เครื่อง + BM-09",
    description: "กลุ่มเครื่องตัดซอยม้วนฟิล์ม (High-Speed Slitter Rewinders: SM 01, 2SM 17, SM 15, SM 06, 1SM 19, 1SM 20, SM 11, SM 12, SM 07, SM 08, SH 01, SM 13, 2RW 18) และเครื่องทำถุง BM 09"
  }
];
