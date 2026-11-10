// ============================================================================
// Module: src/data/buildings.data.js
// Architectural definitions for the 4 main factory halls, front 2-story
// corporate office wing, and auxiliary buildings (Pump House & Guardhouse).
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};

window.Starflex3D.Data.buildings = [
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
];
