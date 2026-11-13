// ============================================================================
// Module: src/data/machines/printing.data.js
// Machine items for Rotogravure Printing presses, cylinders, and ink systems
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.printing = [
  // --- Hall 1 ---
  {
    id: "cylinder_storage_area",
    code: "CYL-STORE",
    name: "คลังจัดเก็บลูกกลิ้งแม่พิมพ์กราเวียร์ (Gravure Cylinder Storage Area)",
    category: "printing",
    hall: "hall_1",
    type: "cylinder_storage",
    bounds: [238, 250, 552, 385],
    height: 4.2,
    orientation: "EW",
    specs: "คลังเก็บลูกกลิ้งแม่พิมพ์แนวตั้ง ห่อกระดาษลูกฟูกกันกระแทก · พร้อมป้ายข้อมูลสเปกและพาเลทจัดเก็บ",
    description: "คลังจัดเก็บลูกกลิ้งแม่พิมพ์กราเวียร์ (Gravure Cylinders) ในอาคาร 1 จัดเก็บลูกกลิ้งแม่พิมพ์แนวตั้งที่ผ่านการพันห่อด้วยกระดาษลูกฟูกหนา (Kraft Cardboard Packaging) ปิดหัวท้ายและติดป้าย Spec Sheet / Delivery Card จัดเรียงบนพาเลทไม้อย่างเป็นระเบียบ พร้อมสถานีล้างทำความสะอาดและทางวิ่งรถเข็นแม่พิมพ์"
  },
  {
    id: "beiren_2pg05",
    code: "2PG-05",
    name: "Beiren 2PG-05 (เครื่องพิมพ์กราเวียร์)",
    category: "printing",
    hall: "hall_1",
    type: "gravure_press",
    bounds: [230, 418, 370, 470],
    height: 4.5,
    orientation: "EW",
    specs: "Gravure Printing Press · สายการผลิตอาคาร 1",
    description: "เครื่องพิมพ์กราเวียร์ Beiren 2PG-05 รองรับการพิมพ์ฟิล์มหลายชั้นพร้อมชุดควบคุมความตึงอัตโนมัติ"
  },
  {
    id: "xinda_pt03",
    code: "PT-03",
    name: "Xinda PT-03 + Burner (เครื่องพิมพ์กราเวียร์)",
    category: "printing",
    hall: "hall_1",
    type: "gravure_press",
    bounds: [418, 418, 554, 470],
    height: 4.5,
    orientation: "EW",
    specs: "Multi-Station Gravure Press · พร้อมชุด Burner",
    description: "เครื่องพิมพ์กราเวียร์ Xinda PT-03 พร้อมห้องเผาไหม้ลมร้อนด้านท้ายเครื่อง"
  },
  {
    id: "beiren_pt04",
    code: "PT-04",
    name: "Beiren PT-04 + Burner (เครื่องพิมพ์กราเวียร์)",
    category: "printing",
    hall: "hall_1",
    type: "gravure_press",
    bounds: [406, 485, 554, 535],
    height: 4.5,
    orientation: "EW",
    specs: "Beiren 9-Color Rotogravure Press · Teal Guard & Orange Mesh Turret",
    description: "เครื่องพิมพ์กราเวียร์ 9 สี Beiren PT-04 โครงสร้างสีเทาตัดแถบราวนิรภัยสีน้ำเงินอมเขียว (Teal) พร้อมหน้าจอ LED สีแดง ตู้ควบคุม HMI ประจำแท่นและโต๊ะคอนโซลเอียง ประตูตะแกรงนิรภัยสีส้ม และชุดรับม้วนฟิล์มโลหะเปิดโล่ง"
  },
  {
    id: "ink_dispensing",
    code: "INK-DISP",
    name: "Ink Dispenser & Ink Dispensing (ชุดจ่ายผสมหมึกอัตโนมัติ)",
    category: "printing",
    hall: "hall_1",
    type: "ink_dispenser",
    bounds: [246, 482, 362, 528],
    height: 3.2,
    orientation: "EW",
    specs: "Automated Color Matching & Dispensing System",
    description: "สถานีผสมและจ่ายหมึกพิมพ์ด้วยระบบคอมพิวเตอร์เพื่อความแม่นยำของเฉดสี"
  },

  // --- Hall 2 ---
  {
    id: "caida_pt06",
    code: "PT-06",
    name: "CAIDA PT-06 (เครื่องพิมพ์กราเวียร์)",
    category: "printing",
    hall: "hall_2",
    type: "gravure_press",
    bounds: [674, 260, 828, 304],
    height: 4.5,
    orientation: "EW",
    specs: "High-Speed Rotogravure Printing Line",
    description: "เครื่องพิมพ์กราเวียร์ CAIDA PT-06 บริเวณทิศเหนือของอาคาร 2"
  },

  // --- Hall 4 ---
  {
    id: "printing_04",
    code: "04 · PRINT",
    name: "04 Printing Machine (เครื่องพิมพ์ความเร็วสูงสาย 4)",
    category: "printing",
    hall: "hall_4",
    type: "gravure_press",
    bounds: [1585, 635, 1628, 825],
    height: 5.0,
    orientation: "NS",
    specs: "High-Speed Multi-Color Printing Line 04",
    description: "สายเครื่องพิมพ์กราเวียร์ความเร็วสูง 04 ติดตั้งตามแนวเหนือ-ใต้ในโถงอาคารตะวันออก"
  },
  {
    id: "caida_pt07",
    code: "05 · PT-07",
    name: "05 Caida PT-07 (เครื่องพิมพ์กราเวียร์สาย 5)",
    category: "printing",
    hall: "hall_4",
    type: "gravure_press",
    bounds: [1660, 635, 1722, 825],
    height: 5.2,
    orientation: "NS",
    specs: "Caida High-Speed Rotogravure Press PT-07",
    description: "สายเครื่องพิมพ์กราเวียร์ขนาดใหญ่ Caida PT-07 อยู่กึ่งกลางใต้สันหลังคาระบายอากาศอาคาร 4"
  },
  {
    id: "printing_06",
    code: "06 · PRINT",
    name: "06 Printing Machine (เครื่องพิมพ์ความเร็วสูงสาย 6)",
    category: "printing",
    hall: "hall_4",
    type: "gravure_press",
    bounds: [1765, 635, 1810, 825],
    height: 5.0,
    orientation: "NS",
    specs: "High-Speed Multi-Color Printing Line 06",
    description: "สายเครื่องพิมพ์กราเวียร์ความเร็วสูง 06 ขนานกับเครื่อง PT-07"
  }
];
