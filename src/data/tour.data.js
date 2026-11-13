// ============================================================================
// Module: src/data/tour.data.js
// Interactive Guided Production Tour Steps ("ทัวร์สายการผลิต")
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};

window.Starflex3D.Data.tourSteps = [
  {
    tag: "OVERVIEW",
    title: "ภาพรวมโรงงาน บมจ. สตาร์เฟล็กซ์ (Starflex PCL)",
    description: "โมเดล 3 มิติจำลองตามผังโรงงานจริง ครบทั้ง 4 อาคารผลิตหลัก โซนคลังเคมีและวัตถุดิบด้านหลัง อาคารสำนักงานใหญ่ 2 ชั้น และท่าโหลดสินค้า",
    flowChips: [
      "คลังวัตถุดิบ & สารเคมี (North Yard)",
      "เป่าฟิล์ม 1BF-01 & พิมพ์กราเวียร์",
      "เคลือบประกบหลายชั้น → บ่มกาว",
      "ทำถุง ตัดซอย → คลัง & ส่งออก"
    ],
    targetPx: [1050, 760],
    camOffset: [0, 115, 135],
    highlightId: null
  },
  {
    tag: "NORTH YARD · RAW MATERIALS & CHEMICALS",
    title: "คลังวัตถุดิบ โซนเคมี และสถานี LPG (North Yard)",
    description: "พื้นที่จัดเก็บและเตรียมสารเคมีภายนอกทางทิศเหนือ ประกอบด้วยคลังวัตถุดิบ (โซน 5), คลังเคมี 1–2 (โซน 20), โรงกลั่น/โรงผสม Solvent (โซน 14–15) และสถานีถังก๊าซ LPG",
    flowChips: [
      "คลังวัตถุดิบ (โซน 5) → เม็ดเรซิน",
      "โรงผสม & กลั่น Solvent (โซน 14–15)",
      "สถานี LPG (โซน 13) → Deluge"
    ],
    targetPx: [650, 135],
    camOffset: [-18, 46, 58],
    highlightId: "raw_material_wh_5"
  },
  {
    tag: "BLOWN FILM EXTRUSION",
    title: "หอเป่าฟิล์ม 3 ชั้น 1BF-01 และ Rewinder (Hall 4)",
    description: "เริ่มต้นผลิตฟิล์มชั้นในด้วยหอเป่าฟิล์มความสูงพิเศษ 1BF-01 หลอมเม็ดพลาสติกเป่าขึ้นเป็นบอลลูนแนวตั้ง เชื่อมต่อระบบหล่อเย็น Chiller และเครื่องกรอม้วน 03 Rewinder",
    flowChips: [
      "เม็ดพลาสติกเรซิน → หลอมเป่าแนวตั้ง",
      "1BF-01 → 03 Rewinder (VENUS III)",
      "ชั้นวางม้วนฟิล์มขาว"
    ],
    targetPx: [1835, 395],
    camOffset: [30, 36, 46],
    highlightId: "blow_film_1bf01"
  },
  {
    tag: "GRAVURE PRINTING",
    title: "สายเครื่องพิมพ์กราเวียร์ 9 สี และห้องผสมหมึก (Hall 1)",
    description: "พิมพ์ลวดลายบนม้วนฟิล์มด้วยเครื่องพิมพ์กราเวียร์ความเร็วสูง (Beiren PT-04, Xinda PT-03, Beiren 2PG-05) พร้อมชุดจ่ายผสมหมึกอัตโนมัติและคลังลูกกลิ้งแม่พิมพ์แนวตั้ง",
    flowChips: [
      "คลังแม่พิมพ์ (CYL-STORE)",
      "Ink Dispenser → PT-04 / PT-03",
      "ม้วนฟิล์มพิมพ์ลาย → WIP Rack"
    ],
    targetPx: [400, 480],
    camOffset: [-34, 38, 48],
    highlightId: "beiren_pt04"
  },
  {
    tag: "LAMINATION & EXTRUSION",
    title: "เคลือบประกบฟิล์มหลายชั้น Bobst & Beiren (Hall 1)",
    description: "เคลือบประกบฟิล์มพิมพ์เข้ากับชั้นฟอยล์หรือฟิล์มกั้นออกซิเจนด้วยเครื่อง Tandem Extrusion (ET-02), Bobst NOVALAM/VISIONLAM (LB-10, 1LB-09) และ Beiren SLII400 (SB-04)",
    flowChips: [
      "WIP Laminate Rack → ป้อนฟิล์ม",
      "Bobst LB-10 / 1LB-09 · Beiren SB-04",
      "คลังแขวนม้วน WH-PRD"
    ],
    targetPx: [380, 770],
    camOffset: [-32, 36, 46],
    highlightId: "bobst_lb10"
  },
  {
    tag: "BAG MAKING & SPOUT",
    title: "โถงขึ้นรูปถุงอัตโนมัติ BM 04–17 และ Spout (Hall 2)",
    description: "ม้วนฟิล์มที่บ่มกาวสมบูรณ์แล้วเข้าสู่โถงเครื่องขึ้นรูปถุง 13 สายการผลิต (BM 04–17), เครื่องตัดฝา Spout และแถวเครื่องติดฝาจุกอัตโนมัติ (1SP-01..07)",
    flowChips: [
      "Unwind & Festoon → V-Plow Forming",
      "แท่นซีล 4 สถานี → Outfeed Conveyor",
      "1SP-01..07 ติดฝาจุกอัตโนมัติ"
    ],
    targetPx: [865, 825],
    camOffset: [0, 36, 46],
    highlightId: "bm_lines_group"
  },
  {
    tag: "SLITTING & REWINDING",
    title: "โซนเครื่องตัดซอย VENUS III และ BM 09 (Hall 2)",
    description: "ตัดซอยและกรอม้วนฟิล์มตามหน้ากว้างที่กำหนดด้วยเครื่อง High-Speed Duplex Slitter Rewinders (SM 01–20, 2RW 18, SH 01) พร้อมสายงาน BM 09 แนวนอนและพาเลทพักม้วน",
    flowChips: [
      "Master Unwind → ใบมีดตัดซอย",
      "แกน Rewind คู่ (Shaft 1 & 2)",
      "พาเลทม้วนฟิล์ม 3 ชั้น"
    ],
    targetPx: [865, 965],
    camOffset: [0, 30, 38],
    highlightId: "sm_slitter_hall2"
  },
  {
    tag: "WAREHOUSE & FINISH GOOD",
    title: "คลังสินค้าหลักและพื้นที่ Finish Good (Hall 2 & 3)",
    description: "สินค้าที่ผ่านการตรวจคุณภาพจัดเก็บเข้าสู่พื้นที่ Finish Good (FG-AREA), คลังสินค้าหลัก 5 แถว (WH-MAIN) และคลังพาเลทสูง High-Bay Racks ใน Hall 3",
    flowChips: [
      "แพ็กสินค้า → Finish Good Area",
      "WH-MAIN (5 แถว) → High-Bay 5.8 ม.",
      "เตรียมจ่ายขึ้นรถขนส่ง"
    ],
    targetPx: [1060, 520],
    camOffset: [18, 52, 62],
    highlightId: "highbay_racks_south"
  },
  {
    tag: "LOADING DOCK & LOGISTICS",
    title: "ท่าโหลดสินค้าและลานขนส่ง (Loading Dock)",
    description: "ท่าโหลดชานชาลายกพื้นขาว (+1.25 ม.) พร้อมประตูม้วนอุตสาหกรรม ประตู High-Speed กันสาดโครงเหล็ก รถโฟร์คลิฟท์ไฟฟ้า และรถบรรทุกตู้คอนเทนเนอร์ Starflex",
    flowChips: [
      "โฟร์คลิฟท์ลำเลียงพาเลท",
      "ชานชาลา +1.25 ม. → ตู้คอนเทนเนอร์",
      "ป้อม รปภ. → ประตูขาออก"
    ],
    targetPx: [1230, 920],
    camOffset: [22, 34, 48],
    highlightId: "loading_dock_trucks"
  },
  {
    tag: "OFFICE HQ & CLEANROOM HYGIENE",
    title: "อาคารสำนักงานใหญ่ 2 ชั้น และห้องสุขอนามัย (HQ & Cleanroom)",
    description: "ด้านหน้าเป็นอาคารสำนักงานใหญ่ 2 ชั้น ซุ้มเสาหิน และสนามหญ้า 3 เสาธง เชื่อมต่อทางเดินพนักงานสู่ห้องเปลี่ยนชุดคลีนรูม 2 โซน และห้อง Air Shower ก่อนเข้าสายผลิต",
    flowChips: [
      "Office HQ 2 ชั้น & อาคาร 4 กระจกฟ้า",
      "ห้องเปลี่ยนชุดโซนสีน้ำเงิน / เหลือง",
      "อ่างล้างมือตัว L → Air Shower"
    ],
    targetPx: [960, 1020],
    camOffset: [-18, 42, 64],
    highlightId: "admin_vip_office"
  }
];
