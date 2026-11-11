// ============================================================================
// Module: src/data/flows.data.js
// 3D Process Flow paths connecting Starflex manufacturing stages.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};

window.Starflex3D.Data.processFlows = [
  {
    id: "flow_film_to_print_e",
    label: "1. เป่าฟิล์ม 1BF-01 → กรอม้วน → พิมพ์สี (อาคาร 4)",
    color: 0x0284c7,
    points: [
      [1835, 375], [1826, 510], [1826, 580], [1690, 580], [1690, 680]
    ]
  },
  {
    id: "flow_print_to_lam_e",
    label: "2. พิมพ์ PT-07 / Extrusion 07 → เคลือบฟิล์ม Bobst 08 & Fuji Kikai 2LB-06 → ห้องอบ",
    color: 0x7c3aed,
    points: [
      [1690, 810], [1690, 860], [1730, 920], [1730, 1005], [1930, 1005]
    ]
  },
  {
    id: "flow_print_w",
    label: "3. เบิกแม่พิมพ์/หมึกพิมพ์ → พิมพ์กราเวียร์ PT-03, PT-04 (อาคาร 1)",
    color: 0x8b5cf6,
    points: [
      [340, 280], [340, 350], [340, 440], [470, 505], [470, 570]
    ]
  },
  {
    id: "flow_lam_w",
    label: "4. พักม้วน WIP → Tandem Extrusion ET-02 → เคลือบ SB/SL/1LB-09 → ห้องอบบ่มกาว",
    color: 0xd97706,
    points: [
      [470, 595], [450, 755], [282, 755], [282, 845], [285, 950], [480, 1005]
    ]
  },
  {
    id: "flow_converting",
    label: "5. ส่งต่อม้วนลามิเนต → ตัดซอย (SM) & ขึ้นรูปถุงอัตโนมัติ (BM 04–17) & ติดฝาจุก (1SP)",
    color: 0x059669,
    points: [
      [518, 950], [655, 950], [655, 850], [870, 850], [870, 965], [870, 1015]
    ]
  },
  {
    id: "flow_warehouse_ship",
    label: "6. สินค้าสำเร็จรูป (FG Area) → คลังชั้นวางสูง (High-Bay Racks) → โหลดขึ้นรถบรรทุก",
    color: 0xeab308,
    points: [
      [850, 755], [850, 650], [1080, 685], [1280, 600], [1280, 780], [1130, 865]
    ]
  }
];
