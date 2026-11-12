// ============================================================================
// Module: src/data/machines/laminating.data.js
// Machine items for Extrusion lines, Dry/Solventless Laminators, and Curing Ovens
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.laminating = [
  // --- Hall 1 ---
  {
    id: "tandem_extrusion_et02",
    code: "ET-02",
    name: "Tandem Extrusion ET-02 (เครื่องเคลือบเอกซ์ทรูชันคู่)",
    category: "film_extrusion",
    hall: "hall_1",
    type: "extrusion_line",
    bounds: [380, 665, 518, 730],
    height: 5.2,
    orientation: "EW",
    specs: "Tandem Co-Extrusion Coating & Laminating Line",
    description: "เครื่องเคลือบประกบฟิล์มด้วยเรซินหลอมเหลวระบบ Tandem Extrusion (ET-02) สำหรับสร้างชั้นป้องกันความชื้นและออกซิเจนสูง"
  },
  {
    id: "sb02_laminate",
    code: "SB-02",
    name: "Solvent base SB-02 (เครื่องเคลือบกาวฐานตัวทำละลาย)",
    category: "lamination",
    hall: "hall_1",
    type: "laminator",
    bounds: [236, 762, 304, 808],
    height: 3.8,
    orientation: "EW",
    specs: "Dry Laminator (Solvent-Based)",
    description: "เครื่องเคลือบประกบฟิล์มระบบกาวตัวทำละลาย (Solvent Base SB-02) พร้อมอุโมงค์อบแห้ง"
  },
  {
    id: "sl01_laminate",
    code: "SL-01",
    name: "Solvent less SL-01 (เครื่องเคลือบกาวไร้ตัวทำละลาย)",
    category: "lamination",
    hall: "hall_1",
    type: "laminator",
    bounds: [358, 762, 426, 808],
    height: 3.6,
    orientation: "EW",
    specs: "Solventless Laminator · เป็นมิตรต่อสิ่งแวดล้อม",
    description: "เครื่องเคลือบประกบฟิล์มระบบไร้ตัวทำละลาย (Solventless SL-01) ประหยัดพลังงานและปราศจากสารระเหยตกค้าง"
  },
  {
    id: "sb01_laminate",
    code: "SB-01",
    name: "Solvent base SB-01 (เครื่องเคลือบกาวฐานตัวทำละลาย)",
    category: "lamination",
    hall: "hall_1",
    type: "laminator",
    bounds: [442, 762, 522, 808],
    height: 3.8,
    orientation: "EW",
    specs: "Dry Laminator (Solvent-Based)",
    description: "เครื่องเคลือบประกบฟิล์มระบบกาวตัวทำละลาย SB-01 สำหรับโครงสร้างถุงรีทอร์ทและงานรับแรงสูง"
  },
  {
    id: "bobst_1lb09",
    code: "1LB-09",
    name: "Lamination (Bobst) Nova 800 DA 1LB-09",
    category: "lamination",
    hall: "hall_1",
    type: "laminator",
    bounds: [236, 862, 334, 922],
    height: 4.2,
    orientation: "EW",
    specs: "Bobst Nova 800 DA · Multi-Technology Laminator",
    description: "เครื่องเคลือบประกบฟิล์มประสิทธิภาพสูง Bobst Nova 800 DA (1LB-09) มาตรฐานยุโรป"
  },
  {
    id: "comaxi_1ll07",
    code: "1LL-07",
    name: "COMAXI Solvent Free 1LL-07",
    category: "lamination",
    hall: "hall_1",
    type: "laminator",
    bounds: [378, 868, 440, 920],
    height: 3.6,
    orientation: "EW",
    specs: "Comaxi Solventless Laminating Machine",
    description: "เครื่องเคลือบประกบฟิล์มไร้ตัวทำละลาย COMAXI 1LL-07 ความเร็วสูง"
  },
  {
    id: "beiren_sb04",
    code: "SB-04",
    name: "Beiren Laminate SB-04",
    category: "lamination",
    hall: "hall_1",
    type: "laminator",
    bounds: [444, 868, 526, 912],
    height: 3.8,
    orientation: "EW",
    specs: "Dry Laminating Line SB-04",
    description: "เครื่องเคลือบประกบฟิล์ม Beiren Laminate SB-04 พร้อมชุดอบแห้งด้านบน"
  },

  // --- Hall 4 ---
  {
    id: "extrusion_07",
    code: "07 · EXTR",
    name: "07 Extrusion (สายเครื่องเคลือบเอกซ์ทรูชันอาคารตะวันออก)",
    category: "film_extrusion",
    hall: "hall_4",
    type: "extrusion_line",
    bounds: [1835, 635, 1882, 825],
    height: 5.4,
    orientation: "NS",
    specs: "High-Output Extrusion Laminating Line 07",
    description: "สายเครื่องเคลือบเอกซ์ทรูชันขนาดใหญ่ (07 Extrusion) ประจำอาคาร 4"
  },
  {
    id: "bobst_08",
    code: "08 · BOBST",
    name: "08 Bobst (เครื่องเคลือบประกบฟิล์ม Bobst)",
    category: "lamination",
    hall: "hall_4",
    type: "laminator",
    bounds: [1650, 890, 1810, 955],
    height: 4.5,
    orientation: "EW",
    specs: "Bobst High-Barrier Laminating Line 08",
    description: "เครื่องเคลือบประกบฟิล์ม Bobst (08) ประจำโซนใต้ของอาคาร 4"
  },
  {
    id: "fujikikai_2lb06",
    code: "09 · 2LB-06",
    name: "09 Fuji Kikai 2LB-06 (เครื่องเคลือบประกบฟิล์ม Fuji Kikai)",
    category: "lamination",
    hall: "hall_4",
    type: "laminator",
    bounds: [1635, 965, 1828, 1045],
    height: 4.8,
    orientation: "EW",
    specs: "Fuji Kikai Dry Laminator 2LB-06 · มาตรฐานญี่ปุ่น",
    description: "เครื่องเคลือบประกบฟิล์มระดับพรีเมียม Fuji Kikai 2LB-06 พร้อมเชื่อมต่อห้องอบบ่มกาวด้านข้าง"
  },
  {
    id: "oven_room_east",
    code: "OVEN-E",
    name: "Oven Room (ห้องอบบ่มกาว อาคารตะวันออก)",
    category: "lamination",
    hall: "hall_4",
    type: "oven_chamber",
    bounds: [1895, 920, 1968, 1055],
    height: 4.8,
    orientation: "NS",
    specs: "Large Capacity Curing Oven Room",
    description: "ห้องอบบ่มม้วนฟิล์มลามิเนตขนาดใหญ่ ยื่นออกจากผนังด้านตะวันออกใกล้เครื่อง Bobst 08 และ Fuji Kikai 2LB-06"
  }
];
