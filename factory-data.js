// ============================================================================
// Starflex Public Company Limited (บมจ. สตาร์เฟล็กซ์) — 3D Factory Layout Data
// Exact 1:1 coordinate mapping from "Starflex Plant Layout.jpeg" (2340 x 1590)
// and structural roof/site geometry from Google Maps satellite imagery.
// Scale: 10 blueprint pixels = 1.0 meter in 3D world space.
// ============================================================================

window.STARFLEX_DATA = {
  meta: {
    title: "Starflex Factory 3D",
    subtitle: "บมจ. สตาร์เฟล็กซ์ · โมเดลโรงงาน 3 มิติ (Cutaway View)",
    blueprintWidth: 2340,
    blueprintHeight: 1590,
    centerX: 1050,
    centerY: 760,
    scale: 0.1 // 10 px = 1m
  },

  // Categories for color-coding (inspired by Fusion Plant 3D reference image)
  categories: {
    printing: {
      id: "printing",
      name: "งานพิมพ์กราเวียร์ (Gravure Printing)",
      color: 0x7c3aed,       // Rich purple/violet manifold accent (like Image 4)
      accent: 0xa78bfa,
      bodyColor: 0xe2e8f0,
      badgeBg: "#f3e8ff",
      badgeText: "#6d28d9"
    },
    film_extrusion: {
      id: "film_extrusion",
      name: "เป่าฟิล์มและเอกซ์ทรูชัน (Blow Film & Extrusion)",
      color: 0x0284c7,       // Cyan/blue industrial accent
      accent: 0x38bdf8,
      bodyColor: 0xe2e8f0,
      badgeBg: "#e0f2fe",
      badgeText: "#0369a1"
    },
    lamination: {
      id: "lamination",
      name: "เคลือบประกบและอบฟิล์ม (Lamination & Curing Oven)",
      color: 0xd97706,       // Warm amber/gold accent
      accent: 0xfbbf24,
      bodyColor: 0xe2e8f0,
      badgeBg: "#fef3c7",
      badgeText: "#b45309"
    },
    converting: {
      id: "converting",
      name: "ตัดซอย ขึ้นรูปถุง และติดฝาจุก (Bag Making, Slitting & Spout)",
      color: 0x059669,       // Emerald green accent
      accent: 0x34d399,
      bodyColor: 0xe2e8f0,
      badgeBg: "#d1fae5",
      badgeText: "#047857"
    },
    warehouse: {
      id: "warehouse",
      name: "คลังสินค้าและชั้นวางพาเลท (Warehouse & Logistics)",
      color: 0xeab308,       // Industrial yellow/gold racking & cranes
      accent: 0xfacc15,
      bodyColor: 0xf1f5f9,
      badgeBg: "#fef9c3",
      badgeText: "#a16207"
    },
    office_utility: {
      id: "office_utility",
      name: "สำนักงาน ห้องแล็ป และระบบวิศวกรรม (Office, QA & Utility)",
      color: 0x475569,       // Architectural slate
      accent: 0x94a3b8,
      bodyColor: 0xf8fafc,
      badgeBg: "#f1f5f9",
      badgeText: "#334155"
    }
  },

  // 4 Main Building Halls + Office Wing + Auxiliary Buildings (from Google Maps & Layout)
  buildings: [
    {
      id: "hall_1",
      name: "อาคารผลิต 1 (ฝั่งตะวันตก: งานพิมพ์ เอกซ์ทรูชัน และเคลือบฟิล์ม)",
      code: "HALL-1 (West Plant)",
      bounds: [200, 247, 632, 1098],
      height: 10.5,
      roofType: "gable_2span_solar",
      spans: 2,
      description: "อาคารหลักฝั่งตะวันตก โครงสร้างหลังคา 2 ช่วงกว้างติดตั้งแผงโซลาร์เซลล์เต็มพื้นที่ ภายในประกอบด้วยโซนเตรียมหมึก/ลูกกลิ้ง เครื่องพิมพ์กราเวียร์ (Rotomec, Beiren, Xinda) เครื่อง Tandem Extrusion (ET-02) เครื่องเคลือบฟิล์ม (Bobst, Comaxi, Solvent Base/Less) และห้องแล็ป QA ด้านทิศใต้"
    },
    {
      id: "hall_2",
      name: "อาคารผลิต 2 (ส่วนกลาง-ตะวันตก: คลังสินค้า ขึ้นรูปถุง BM และติดฝาจุก)",
      code: "HALL-2 (Central-West Plant)",
      bounds: [632, 247, 1062, 1098],
      height: 10.5,
      roofType: "gable_2span_solar",
      spans: 2,
      description: "อาคารหลักช่วงกลาง-ตะวันตก เชื่อมต่อเป็นผืนหลังคาโซลาร์เซลล์ 4 ช่วงร่วมกับอาคาร 1 ภายในประกอบด้วยเครื่องพิมพ์ CAIDA PT-06 ห้องควบคุมอุณหภูมิ ALU คลังสินค้ากลาง พื้นที่ Finish Good Area และโถงเครื่องทำถุงอัตโนมัติ (BM 04–17) เครื่องติดฝาจุก (Spout) และเครื่องตัดซอย (Slitter)"
    },
    {
      id: "office_front",
      name: "อาคารสำนักงานหน้าและห้องประชุม VIP (2 ชั้น)",
      code: "ADMIN-VIP (Front Office)",
      bounds: [674, 1098, 1018, 1190],
      height: 8.2,
      roofType: "flat_modern",
      spans: 1,
      description: "ส่วนอาคารสำนักงานต้อนรับด้านหน้า (จุดปักหมุดบริษัท สตาร์เฟล็กซ์ จำกัด (มหาชน) บน Google Maps) ประกอบด้วยแผนก MKT, HR, IT, PUR, ห้องประชุม VIP และโถงทางเข้าพร้อมหลังคากันสาด"
    },
    {
      id: "hall_3",
      name: "อาคารคลังสินค้าชั้นวางสูงและจุดโหลดสินค้า (Central High-Bay Warehouse)",
      code: "HALL-3 (High-Bay Rack & Dock)",
      bounds: [1062, 247, 1498, 815],
      height: 11.2,
      roofType: "warehouse_solar",
      spans: 2,
      description: "อาคารคลังสินค้าโครงสร้างหลังคาสูงติดตั้งโซลาร์เซลล์แบบสลับแนว ภายในเป็นชั้นวางพาเลทสูง (High-Bay Selective Racks) 12 แถวคู่ ด้านทิศใต้เว้าเป็นลานจอดรถบรรทุกและท่าเทียบโหลดสินค้า (Loading Dock)"
    },
    {
      id: "hall_4",
      name: "อาคารผลิต 4 (ฝั่งตะวันออก: เป่าฟิล์ม Blow Film, พิมพ์ และเคลือบฟิล์ม)",
      code: "HALL-4 (East High-Bay Plant)",
      bounds: [1498, 247, 1895, 1148],
      height: 12.8,
      roofType: "monitor_highbay_solar",
      spans: 1,
      description: "อาคารโรงงานขนาดใหญ่ฝั่งตะวันออก โดดเด่นด้วยโครงสร้างหลังคายกสันระบายอากาศตรงกลาง (Raised Central Roof Monitor) พร้อมแผงโซลาร์เซลล์ทั้งสองปีก ภายในประกอบด้วยหอเป่าฟิล์ม 1BF-01, เครื่องพิมพ์ความเร็วสูง (04, PT-07, 06), เครื่อง Extrusion (07) และเครื่องเคลือบ Bobst (08) / Fuji Kikai 2LB-06 (09)"
    },
    {
      id: "pump_room",
      name: "อาคารห้องปั๊มน้ำ (Pump House)",
      code: "UTIL-PUMP",
      bounds: [1940, 78, 2038, 198],
      height: 5.5,
      roofType: "shed",
      spans: 1,
      description: "อาคารสถานีปั๊มน้ำและระบบดับเพลิงประจำโรงงาน บริเวณมุมทิศตะวันออกเฉียงเหนือ"
    },
    {
      id: "guardhouse",
      name: "ป้อม รปภ. และทางเข้าหลัก (Security Gatehouse)",
      code: "SEC-GATE",
      bounds: [1185, 1430, 1292, 1560],
      height: 4.2,
      roofType: "flat_modern",
      spans: 1,
      description: "ป้อมรักษาการณ์และจุดควบคุมการเข้า-ออกรถขนส่งและผู้มาติดต่อด้านหน้าโรงงาน"
    }
  ],

  // All 68 Machines, Production Lines, Racks & Rooms mapped directly from blueprint pixels
  items: [
    // ================= HALL 1: PRINTING & PREP =================
    {
      id: "rotomec_pt01",
      code: "PT-01",
      name: "Rotomec PT-01 (เครื่องพิมพ์กราเวียร์)",
      category: "printing",
      hall: "hall_1",
      type: "gravure_press",
      bounds: [238, 320, 444, 382],
      height: 4.8,
      orientation: "EW",
      specs: "9-10 สี · ระบบอบแห้งความเร็วสูง · พิมพ์ฟิล์มบรรจุภัณฑ์",
      description: "สายการพิมพ์กราเวียร์หลัก Rotomec PT-01 สำหรับพิมพ์ลวดลายความละเอียดสูงลงบนฟิล์มพลาสติก พร้อมชุดเตาอบลมร้อน (Burner) และท่อดูดระบายอากาศด้านบน"
    },
    {
      id: "burner_pt01",
      code: "BURNER-01",
      name: "Burner (ชุดเตาให้ความร้อน PT-01)",
      category: "printing",
      hall: "hall_1",
      type: "burner_unit",
      bounds: [450, 320, 493, 382],
      height: 4.2,
      orientation: "EW",
      specs: "Thermal Heater Unit · เชื่อมต่อ Rotomec PT-01",
      description: "ชุดกำเนิดลมร้อนสำหรับระบบอบหมึกพิมพ์ของเครื่อง Rotomec PT-01"
    },
    {
      id: "beiren_2pg05",
      code: "2PG-05",
      name: "Beiren 2PG-05 (เครื่องพิมพ์กราเวียร์)",
      category: "printing",
      hall: "hall_1",
      type: "gravure_press",
      bounds: [230, 478, 370, 530],
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
      bounds: [418, 478, 554, 530],
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
      bounds: [406, 545, 554, 595],
      height: 4.5,
      orientation: "EW",
      specs: "High-Speed Gravure Press · พร้อมชุด Burner",
      description: "เครื่องพิมพ์กราเวียร์ Beiren PT-04 ติดตั้งคู่ขนานกับ Xinda PT-03 พร้อมชุดจ่ายหมึกอัตโนมัติใกล้เคียง"
    },
    {
      id: "ink_area",
      code: "INK-01",
      name: "Ink Area (ห้องเตรียมและเก็บหมึกพิมพ์)",
      category: "printing",
      hall: "hall_1",
      type: "prep_room",
      bounds: [278, 250, 395, 305],
      height: 3.6,
      orientation: "EW",
      specs: "พื้นที่จัดเก็บและผสมสีหมึกพิมพ์",
      description: "ห้องจัดเก็บและเตรียมหมึกพิมพ์กราเวียร์ อยู่ชิดผนังทิศเหนือด้านหลังเครื่อง Rotomec PT-01"
    },
    {
      id: "cylinder_nw",
      code: "CYL-01",
      name: "Cylinder Area & ห้องล้าง (พื้นที่เก็บลูกกลิ้งแม่พิมพ์)",
      category: "printing",
      hall: "hall_1",
      type: "cylinder_bay",
      bounds: [395, 250, 552, 325],
      height: 3.6,
      orientation: "EW",
      specs: "ชั้นเก็บลูกกลิ้งแม่พิมพ์กราเวียร์และห้องล้างทำความสะอาด",
      description: "พื้นที่จัดเก็บลูกกลิ้งแม่พิมพ์ทองแดงชุบโครเมียม (Gravure Cylinders) และห้องล้างทำความสะอาดแม่พิมพ์หลังใช้งาน"
    },
    {
      id: "ink_dispensing",
      code: "INK-DISP",
      name: "Ink Dispenser & Ink Dispensing (ชุดจ่ายผสมหมึกอัตโนมัติ)",
      category: "printing",
      hall: "hall_1",
      type: "ink_dispenser",
      bounds: [246, 542, 362, 588],
      height: 3.2,
      orientation: "EW",
      specs: "Automated Color Matching & Dispensing System",
      description: "สถานีผสมและจ่ายหมึกพิมพ์ด้วยระบบคอมพิวเตอร์เพื่อความแม่นยำของเฉดสี"
    },
    {
      id: "sm_hall1_group",
      code: "SH/SM-W",
      name: "SH 02, SH 03, SM 14, SM 05 (เครื่องตรวจสอบและกรอม้วน)",
      category: "converting",
      hall: "hall_1",
      type: "slitter_group",
      bounds: [228, 605, 338, 648],
      height: 2.6,
      orientation: "EW",
      specs: "4 เครื่องย่อย (SH 02, SH 03, SM 14, SM 05)",
      description: "กลุ่มเครื่องตรวจสอบคุณภาพฟิล์มพิมพ์และกรอม้วนย่อยในอาคาร 1"
    },

    // ================= HALL 1: EXTRUSION, LAMINATION & OVEN =================
    {
      id: "wip_laminate_rack",
      code: "WIP-RACK",
      name: "WIP Laminate Rack แขวน (ชั้นแขวนพักม้วนฟิล์มรอเคลือบ)",
      category: "warehouse",
      hall: "hall_1",
      type: "hanging_rack",
      bounds: [235, 702, 328, 795],
      height: 4.2,
      orientation: "EW",
      specs: "โครงแขวนม้วนฟิล์มระหว่างกระบวนการผลิต (WIP)",
      description: "โครงเหล็กแขวนม้วนฟิล์ม WIP (Work In Process) เพื่อพักม้วนฟิล์มก่อนและหลังเข้ากระบวนการ Extrusion / Lamination"
    },
    {
      id: "tandem_extrusion_et02",
      code: "ET-02",
      name: "Tandem Extrusion ET-02 (เครื่องเคลือบเอกซ์ทรูชันคู่)",
      category: "film_extrusion",
      hall: "hall_1",
      type: "extrusion_line",
      bounds: [380, 725, 518, 790],
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
      bounds: [236, 822, 304, 868],
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
      bounds: [358, 822, 426, 868],
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
      bounds: [442, 822, 522, 868],
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
      bounds: [236, 922, 334, 982],
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
      bounds: [378, 928, 440, 980],
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
      bounds: [444, 928, 526, 972],
      height: 3.8,
      orientation: "EW",
      specs: "Dry Laminating Line SB-04",
      description: "เครื่องเคลือบประกบฟิล์ม Beiren Laminate SB-04 พร้อมชุดอบแห้งด้านบน"
    },
    {
      id: "wx_sboard_group",
      code: "1LB-08 / WX",
      name: "1LB-08 S-Board M/C, WX-01 & WX-02",
      category: "lamination",
      hall: "hall_1",
      type: "converting_group",
      bounds: [232, 992, 376, 1044],
      height: 2.8,
      orientation: "EW",
      specs: "ชุดเครื่อง WX-01, WX-02 และ 1LB-08 S-Board",
      description: "กลุ่มเครื่องเคลือบและแปรรูปพิเศษบริเวณทิศใต้ของโถงผลิตอาคาร 1"
    },
    {
      id: "oven_room_hall1",
      code: "OVEN-01",
      name: "OVEN ROOM AREA (ห้องอบบ่มกาวอาคาร 1)",
      category: "lamination",
      hall: "hall_1",
      type: "oven_chamber",
      bounds: [442, 985, 518, 1024],
      height: 4.0,
      orientation: "EW",
      specs: "Thermal Curing Chamber (45–55°C)",
      description: "ห้องควบคุมอุณหภูมิสำหรับบ่มกาว (Curing Oven) หลังผ่านการเคลือบประกบฟิล์ม เพื่อให้ชั้นกาวเซ็ตตัวสมบูรณ์"
    },
    {
      id: "office_qa_hall1",
      code: "QA-LAB / OFF-W",
      name: "สำนักงานฝ่ายผลิต, ประกันคุณภาพ & ห้องแล็ป QA",
      category: "office_utility",
      hall: "hall_1",
      type: "office_block",
      bounds: [200, 1005, 590, 1098],
      height: 3.6,
      orientation: "EW",
      specs: "MTN · อะไหล่ · บันทึกข้อมูล · ฝ่ายผลิต · QA · ห้องแล็ป QA",
      description: "โซนสำนักงานควบคุมการผลิต ห้องอะไหล่ซ่อมบำรุง และห้องปฏิบัติการตรวจสอบคุณภาพ (QA Lab) ทดสอบแรงดึงและการซึมผ่านของบรรจุภัณฑ์"
    },

    // ================= HALL 2: PRINTING, WAREHOUSE, BAG MAKING & SPOUT =================
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
    {
      id: "alu_temp_room",
      code: "ALU-ROOM",
      name: "Cylinder Area & ห้องควบคุมอุณหภูมิพื้นที่ ALU",
      category: "printing",
      hall: "hall_2",
      type: "prep_room",
      bounds: [890, 248, 1062, 326],
      height: 3.8,
      orientation: "EW",
      specs: "Climate-Controlled Aluminum Foil & Cylinder Storage",
      description: "ห้องควบคุมอุณหภูมิและความชื้นสำหรับจัดเก็บฟอยล์อลูมิเนียม (ALU) และลูกกลิ้งแม่พิมพ์"
    },
    {
      id: "central_warehouse",
      code: "WH-MAIN",
      name: "คลังสินค้า (คลังพักสินค้าและวัตถุดิบกลาง)",
      category: "warehouse",
      hall: "hall_2",
      type: "warehouse_zone",
      bounds: [738, 398, 995, 540],
      height: 6.0,
      orientation: "EW",
      specs: "Enclosed Central Storage Zone",
      description: "คลังสินค้าหลักกึ่งกลางอาคาร 2 สำหรับจัดเก็บม้วนฟิล์มและวัตถุดิบรอจ่ายเข้าสายการผลิต"
    },
    {
      id: "finish_good_area",
      code: "FG-AREA",
      name: "Finish Good Area (พื้นที่จัดเก็บสินค้าสำเร็จรูป)",
      category: "warehouse",
      hall: "hall_2",
      type: "rack_zone",
      bounds: [676, 556, 1002, 732],
      height: 5.5,
      orientation: "NS",
      specs: "6 แถวชั้นวางคู่ + โซนพาเลทสินค้าสำเร็จรูปพร้อมส่ง",
      description: "พื้นที่ชั้นวางสินค้าสำเร็จรูป (Finished Goods) ที่ผ่านการตรวจสอบคุณภาพแล้ว พร้อมเครนยกและทางลำเลียงสู่จุดโหลดสินค้า"
    },
    {
      id: "sw5_office",
      code: "OFF-SW5",
      name: "สำนักงานคลังสินค้า (SW5)",
      category: "office_utility",
      hall: "hall_2",
      type: "office_block",
      bounds: [1010, 498, 1048, 615],
      height: 3.5,
      orientation: "NS",
      specs: "Warehouse Control Office (SW5)",
      description: "ห้องสำนักงานควบคุมคลังสินค้าและจ่ายงาน Finish Good Area"
    },
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
    },
    {
      id: "admin_vip_office",
      code: "OFFICE-HQ",
      name: "สำนักงานใหญ่ ห้องแล็ปนวัตกรรม (INNO) และห้องประชุม VIP",
      category: "office_utility",
      hall: "office_front",
      type: "hq_office",
      bounds: [674, 1020, 1018, 1190],
      height: 7.8,
      orientation: "EW",
      specs: "Image · INNO · LAB INNO · Training · MKT · HR · IT · PUR · VIP",
      description: "อาคารสำนักงานหน้าและศูนย์พัฒนานวัตกรรมบรรจุภัณฑ์ (INNO Lab) ห้องฝึกอบรม และห้องรับรองผู้บริหาร VIP"
    },

    // ================= HALL 3: HIGH-BAY WAREHOUSE & LOADING DOCK =================
    {
      id: "highbay_racks_north",
      code: "RACK-HB-N",
      name: "คลังชั้นวางพาเลทสูง โซนเหนือ (High-Bay Racks North)",
      category: "warehouse",
      hall: "hall_3",
      type: "highbay_racks",
      bounds: [1158, 300, 1445, 480],
      height: 8.8,
      orientation: "NS",
      specs: "6 แถวคู่ × 4 ชั้นความสูง · โครงสร้าง Selective Pallet Rack",
      description: "ชั้นวางพาเลทอุตสาหกรรมความสูงพิเศษโซนเหนือ รองรับการจัดเก็บม้วนฟิล์มวัตถุดิบและพาเลทสินค้าจำนวนมาก"
    },
    {
      id: "highbay_racks_south",
      code: "RACK-HB-S",
      name: "คลังชั้นวางพาเลทสูง โซนใต้ (High-Bay Racks South)",
      category: "warehouse",
      hall: "hall_3",
      type: "highbay_racks",
      bounds: [1158, 500, 1445, 670],
      height: 8.8,
      orientation: "NS",
      specs: "6 แถวคู่ × 4 ชั้นความสูง · โครงสร้าง Selective Pallet Rack",
      description: "ชั้นวางพาเลทอุตสาหกรรมความสูงพิเศษโซนใต้ เชื่อมต่อโดยตรงกับทางขึ้นลงรถโฟร์คลิฟท์และท่าโหลดสินค้า"
    },
    {
      id: "west_staging_racks",
      code: "RACK-STG",
      name: "ชั้นวางพักสินค้าและทางขึ้นลง #1 (Staging Racks & Ramp 1)",
      category: "warehouse",
      hall: "hall_3",
      type: "staging_racks",
      bounds: [1102, 435, 1156, 712],
      height: 5.2,
      orientation: "EW",
      specs: "11 ช่องชั้นวางพัก + ทางลาดขึ้นลงสีฟ้า (Ramp #1)",
      description: "โซนชั้นวางพักสินค้าเตรียมจัดส่ง พร้อมทางลาดขึ้นลงรถโฟร์คลิฟท์และแนวสวนต้นไม้ด้านข้าง"
    },
    {
      id: "loading_dock_trucks",
      code: "DOCK-BAY",
      name: "ท่าโหลดสินค้าและจุดจอดรถบรรทุกขนส่ง (Loading Dock)",
      category: "warehouse",
      hall: "hall_3",
      type: "loading_dock",
      bounds: [1080, 715, 1395, 905],
      height: 5.0,
      orientation: "NS",
      specs: "โถงกระจายสินค้า · ช่องจอดรถบรรทุก 3 คัน · ห้องน้ำส่วนกลาง",
      description: "โถงขนถ่ายสินค้าและลานจอดรถบรรทุกเทรลเลอร์ด้านหน้าอาคารคลังสินค้า ตรงตามภาพถ่ายดาวเทียมและสัญลักษณ์รถบรรทุกในผัง"
    },

    // ================= HALL 4: EAST PLANT (BLOW FILM, PRINTING, EXTRUSION, LAMINATION) =================
    {
      id: "utility_01_blowfilm",
      code: "01-UTIL",
      name: "01 ระบบสนับสนุนหอเป่าฟิล์ม (Water Cabinet, Chiller, Blower)",
      category: "office_utility",
      hall: "hall_4",
      type: "chiller_utility",
      bounds: [1812, 248, 1895, 292],
      height: 4.2,
      orientation: "EW",
      specs: "Water Cabinet · Blower · Chiller · Exhaust Blower · Main Cabinet",
      description: "ห้องเครื่องระบบหล่อเย็น (Chiller) พัดลมเป่าอากาศ (Blower) และตู้ควบคุมไฟฟ้าหลักสำหรับหอเป่าฟิล์ม"
    },
    {
      id: "blow_film_1bf01",
      code: "02 · 1BF-01",
      name: "02 BLOW FILM 1BF-01 (หอเป่าฟิล์มหลายชั้นความสูงพิเศษ)",
      category: "film_extrusion",
      hall: "hall_4",
      type: "blow_film_tower",
      bounds: [1785, 295, 1885, 452],
      height: 11.8,
      orientation: "NS",
      specs: "Multi-Layer Co-Extrusion Blown Film Tower",
      description: "หอเป่าฟิล์มขนาดใหญ่ (1BF-01) หลอมเม็ดพลาสติกเป่าขึ้นเป็นบอลลูนฟิล์มแนวตั้งผ่านโครงหอสูง 3 ชั้น ก่อนรีดพับและม้วนเก็บ"
    },
    {
      id: "rewinder_03",
      code: "03 · REW",
      name: "03 Rewinder (เครื่องกรอและปรับแต่งม้วนฟิล์ม)",
      category: "film_extrusion",
      hall: "hall_4",
      type: "slitter_group",
      bounds: [1785, 492, 1868, 530],
      height: 3.2,
      orientation: "EW",
      specs: "Primary Film Roll Rewinder · ต่อเนื่องจาก 1BF-01",
      description: "เครื่องกรอและตัดแต่งขอบม้วนฟิล์มที่ผลิตจากหอเป่าฟิล์ม 1BF-01"
    },
    {
      id: "mdb_east",
      code: "MDB-E",
      name: "MDB (ห้องควบคุมไฟฟ้าหลัก อาคารตะวันออก)",
      category: "office_utility",
      hall: "hall_4",
      type: "prep_room",
      bounds: [1895, 490, 1950, 545],
      height: 4.5,
      orientation: "EW",
      specs: "Main Distribution Board (HUB 5)",
      description: "ห้องตู้สวิตช์บอร์ดไฟฟ้าหลัก (MDB) ยื่นออกจากผนังด้านตะวันออกของอาคาร 4"
    },
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
    },
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
    },
    {
      id: "east_ramps_shipping",
      code: "RAMP 2–5",
      name: "ทางขึ้นลง #2–#5 และโถงขนถ่ายสินค้าฝั่งตะวันออก",
      category: "warehouse",
      hall: "hall_4",
      type: "ramp_group",
      bounds: [1420, 755, 1605, 1290],
      height: 3.5,
      orientation: "NS",
      specs: "ทางลาดสีฟ้า 4 จุด + กันสาดโหลดสินค้าคู่ด้านทิศใต้",
      description: "ระบบทางลาดขึ้นลงระหว่างระดับพื้นอาคารคลังสินค้าและอาคารผลิตตะวันออก พร้อมจุดรับ-ส่งสินค้าด้านหน้า"
    },

    // ================= AUXILIARY BUILDINGS =================
    {
      id: "pump_house_item",
      code: "PUMP-RM",
      name: "ห้อง PUMP (สถานีปั๊มน้ำและถังสำรองน้ำ)",
      category: "office_utility",
      hall: "pump_room",
      type: "pump_station",
      bounds: [1940, 78, 2038, 198],
      height: 5.0,
      orientation: "NS",
      specs: "Fire Pump & Industrial Water Supply (HUB 10)",
      description: "สถานีปั๊มน้ำแรงดันสูงและระบบสำรองน้ำดับเพลิงประจำโรงงาน"
    },
    {
      id: "guardhouse_item",
      code: "GUARD",
      name: "ป้อม รปภ. (จุดรักษาความปลอดภัยหน้าโรงงาน)",
      category: "office_utility",
      hall: "guardhouse",
      type: "guard_station",
      bounds: [1185, 1430, 1292, 1560],
      height: 3.8,
      orientation: "NS",
      specs: "Security Checkpoint (HUB 11)",
      description: "ป้อม รปภ. ตรวจสอบรถขนส่งและผู้มาติดต่อบริเวณทางเข้าหลักด้านถนน"
    }
  ],

  // 3D Process Flow Lines (connecting departments through the production lifecycle)
  processFlows: [
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
      label: "3. เตรียมหมึก/แม่พิมพ์ → พิมพ์กราเวียร์ PT-01, PT-03, PT-04 (อาคาร 1)",
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
  ],

  // Interactive Guided Tour Steps ("ทัวร์สายการผลิต")
  tourSteps: [
    {
      title: "ภาพรวมโรงงาน บมจ. สตาร์เฟล็กซ์ (Starflex PCL)",
      subtitle: "โครงสร้างจริง 4 อาคารหลัก · มุมมองผ่าตัดขวาง 3 มิติ (Cutaway View)",
      description: "โมเดล 3 มิติจำลองตามผังโรงงานจริงและภาพถ่ายดาวเทียม Google Maps ประกอบด้วยอาคารฝั่งตะวันตก (หลังคาโซลาร์เซลล์ 4 ช่วง), อาคารคลังสินค้าชั้นวางสูงตรงกลางพร้อมท่าเทียบรถบรรทุก, อาคารผลิตฝั่งตะวันออกที่มีสันหลังคายกสูง (Monitor Roof) และอาคารสำนักงานหน้า 2 ชั้น",
      targetPx: [1050, 760],
      camOffset: [0, 115, 135],
      highlightId: null
    },
    {
      title: "ขั้นตอนที่ 1: หอเป่าฟิล์ม 1BF-01 (Blow Film Extrusion)",
      subtitle: "อาคาร 4 (ทิศตะวันออกเฉียงเหนือ) · รหัส 02 BLOW FILM 1BF-01",
      description: "เริ่มต้นจากการหลอมเม็ดพลาสติกเรซินแล้วเป่าขึ้นเป็นบอลลูนฟิล์มแนวตั้งบนหอสูง (1BF-01) พร้อมห้องเครื่อง Chiller/Blower (01) และเครื่องกรอม้วน Rewinder (03) เพื่อผลิตฟิล์มชั้นในคุณภาพสูง",
      targetPx: [1825, 385],
      camOffset: [32, 38, 48],
      highlightId: "blow_film_1bf01"
    },
    {
      title: "ขั้นตอนที่ 2: งานพิมพ์กราเวียร์ความละเอียดสูง (Gravure Printing)",
      subtitle: "อาคาร 1 & 2 (Rotomec PT-01, Xinda PT-03, Beiren PT-04, Caida PT-06/07)",
      description: "ฟิล์มถูกส่งเข้าสู่เครื่องพิมพ์กราเวียร์ 8–10 สี (เช่น Rotomec PT-01, Beiren, Xinda และ Caida PT-07) โดยมีห้องเตรียมหมึก (Ink Area) ระบบจ่ายหมึกอัตโนมัติ และคลังลูกกลิ้งแม่พิมพ์อยู่ด้านหลัง",
      targetPx: [400, 460],
      camOffset: [-35, 42, 52],
      highlightId: "rotomec_pt01"
    },
    {
      title: "ขั้นตอนที่ 3: เคลือบประกบฟิล์มหลายชั้น & บ่มกาว (Extrusion & Lamination)",
      subtitle: "อาคาร 1 & 4 (Tandem Extrusion ET-02, Bobst 1LB-09, Fuji Kikai 2LB-06)",
      description: "การนำฟิล์มพิมพ์แล้วมาเคลือบประกบกับชั้นฟอยล์หรือฟิล์มกั้นออกซิเจนด้วยเครื่อง Tandem Extrusion (ET-02), เครื่องเคลือบไร้ตัวทำละลาย (SL-01, 1LL-07) และเครื่อง Bobst / Fuji Kikai ก่อนนำเข้าห้องอบบ่มกาว (Oven Room)",
      targetPx: [390, 870],
      camOffset: [-32, 38, 48],
      highlightId: "tandem_extrusion_et02"
    },
    {
      title: "ขั้นตอนที่ 4: ตัดซอย ขึ้นรูปถุงอัตโนมัติ และติดฝาจุก (Bag Making & Spout)",
      subtitle: "อาคาร 2 (BM 04–17, เครื่องติดฝา Spout 1SP-01..07, Slitter SM)",
      description: "ม้วนฟิล์มที่บ่มกาวเสร็จสมบูรณ์จะถูกตัดซอยด้วยเครื่อง Slitter (SM) และป้อนเข้าสู่โถงเครื่องทำถุงอัตโนมัติ 14 สาย (BM 04–17) และเครื่องซีลติดฝาจุก (1SP-01..07) เพื่อขึ้นรูปเป็นบรรจุภัณฑ์พร้อมใช้งาน",
      targetPx: [880, 880],
      camOffset: [10, 40, 50],
      highlightId: "bm_lines_group"
    },
    {
      title: "ขั้นตอนที่ 5: คลังสินค้าชั้นวางสูงและจุดโหลดขึ้นรถบรรทุก (High-Bay Warehouse)",
      subtitle: "อาคาร 2 & 3 (Finish Good Area, High-Bay Racks & Loading Dock)",
      description: "สินค้าสำเร็จรูปที่ผ่านการตรวจสอบจากห้องแล็ป QA จะถูกลำเลียงเข้าสู่พื้นที่ Finish Good Area และคลังชั้นวางพาเลทสูง (High-Bay Racks) ก่อนลำเลียงผ่านทางลาดสีฟ้า (ทางขึ้นลง) สู่รถบรรทุกขนส่งบริเวณ Loading Dock",
      targetPx: [1250, 620],
      camOffset: [25, 48, 62],
      highlightId: "highbay_racks_south"
    }
  ]
};
