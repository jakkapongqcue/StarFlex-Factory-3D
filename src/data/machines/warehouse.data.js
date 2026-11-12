// ============================================================================
// Module: src/data/machines/warehouse.data.js
// Warehouse storage racks, WIP racks, Finish Goods, and Loading Dock zones
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.warehouse = [
  // --- Hall 1 Warehouse Zones ---
  {
    id: "wip_laminate_rack",
    code: "WIP-RACK",
    name: "WIP Laminate Rack แขวน (ชั้นแขวนพักม้วนฟิล์มรอเคลือบ)",
    category: "warehouse",
    hall: "hall_1",
    type: "hanging_rack",
    bounds: [235, 592, 328, 685],
    height: 3.6,
    orientation: "EW",
    specs: "โครงเหล็กสีน้ำเงินแขวนม้วนฟิล์มบนเพลาเหล็ก 2 ชั้น + พาเลทพื้น LOSCAM · พร้อมรถยก Stacker ไฟฟ้า DLX",
    description: "โครงเหล็กสีน้ำเงินสำหรับแขวนพักม้วนฟิล์มพิมพ์ลายระหว่างกระบวนการผลิต (WIP Hanging Racks) ประกอบด้วยคานรับเพลาเหล็กแขวนม้วนฟิล์มจัมโบ้ 2 ระดับ (ชั้นกลางและชั้นบน) ค้ำยันมุมเสา พาเลทสีแดง LOSCAM และพาเลทดำวางม้วนฟิล์มรอเคลือบด้านล่าง พร้อมรถยกไฟฟ้า Walkie Stacker (DLX) ประจำจุด"
  },
  {
    id: "wh_prd_hall1",
    code: "WH-PRD",
    name: "WH-PRD (คลังเก็บสินค้าและวัตถุดิบฝ่ายผลิต อาคาร 1)",
    category: "warehouse",
    hall: "hall_1",
    type: "warehouse_racks",
    bounds: [230, 885, 536, 965],
    height: 5.4,
    orientation: "EW",
    specs: "ชั้นแขวนม้วนฟิล์มแนวสูง 3 แถวยาว × 5 ชั้น · เสาโครงถักสีน้ำเงิน + คานขารับเพลาสีส้ม · แขวนม้วนฟิล์มลามิเนตทุกช่อง",
    description: "คลังแขวนม้วนฟิล์มฝ่ายผลิต (WH-PRD Hanging Film Roll Racks) ประจำอาคาร 1 โครงสร้างเสาเหล็กเจาะรูสีน้ำเงินพร้อมโครงถักทแยงความสูง 5 ชั้น ติดตั้งคานและขารับเพลาสีส้มสำหรับแขวนม้วนฟิล์มพิมพ์ลายและฟิล์มลามิเนตฟอยล์บนท่อเพลาเหล็กกลมทุกช่อง (ไม่มีพาเลทไม้และกล่องกระดาษ) เว้นทางเดินระหว่างแถว 2.0 เมตร และช่องทางเดินตัดกลาง 2.4 เมตร"
  },

  // --- Hall 2 Warehouses ---
  {
    id: "central_warehouse",
    code: "WH-MAIN",
    name: "คลังสินค้าหลัก (Central Warehouse - Selective Racks)",
    category: "warehouse",
    hall: "hall_2",
    type: "warehouse_racks",
    bounds: [674, 348, 1005, 542],
    height: 5.2,
    orientation: "EW",
    specs: "5 แถวยาว (แนวนอน EW) × 4 ชั้นความสูง · โครงสร้าง Selective Pallet Rack 12 ช่องต่อแถว",
    description: "คลังสินค้าหลักกึ่งกลางอาคาร 2 จัดวางชั้นวางพาเลทอุตสาหกรรมแนวยาว 5 แถว สำหรับจัดเก็บม้วนฟิล์มและวัตถุดิบรอจ่ายเข้าสายการผลิต ขยายพื้นที่รองรับพาเลทและช่องทางสัญจรโฟล์คลิฟต์เต็มพื้นที่"
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

  // --- Hall 3 High-Bay Racks & Loading Dock ---
  {
    id: "highbay_racks_north",
    code: "RACK-HB-N",
    name: "คลังชั้นวางพาเลทสูง โซนเหนือ (High-Bay Racks North)",
    category: "warehouse",
    hall: "hall_3",
    type: "highbay_racks",
    bounds: [1158, 300, 1445, 480],
    height: 5.8,
    orientation: "NS",
    specs: "6 แถวคู่ × 4 ชั้นความสูง (สูง 5.8m) · โครงสร้าง Selective Pallet Rack",
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
    height: 5.8,
    orientation: "NS",
    specs: "6 แถวคู่ × 4 ชั้นความสูง (สูง 5.8m) · โครงสร้าง Selective Pallet Rack",
    description: "ชั้นวางพาเลทอุตสาหกรรมความสูงพิเศษโซนใต้ เชื่อมต่อโดยตรงกับทางขึ้นลงรถโฟร์คลิฟท์และท่าโหลดสินค้า"
  },
  {
    id: "loading_dock_trucks",
    code: "DOCK-BAY",
    name: "พื้นที่ท่าโหลดสินค้า, ห้องควบคุมท่าโหลด & ลานขนส่ง (Loading Dock)",
    category: "warehouse",
    hall: "hall_3",
    type: "loading_dock",
    bounds: [1062, 815, 1395, 1020],
    height: 8.8,
    orientation: "EW",
    specs: "ชานชาลายกพื้นขาว · ประตูม้วนดำ 4 ช่อง + ประตูส้ม High-Speed · ห้องควบคุมขาว · รถโฟร์คลิฟท์ฟ้า · แผงแอร์ 18 ตัว",
    description: "พื้นที่ท่าโหลดสินค้าหลัก (Loading Dock) ด้านหน้าอาคารคลังสินค้า ประกอบด้วยชานชาลาคอนกรีตยกพื้นสูงสีขาวพร้อมยางกันกระแทกสีดำ ห้องควบคุมท่าโหลดสีขาว ป้ายไฟดิจิตอลสีแดง ประตูม้วนเหล็กสีเทาเข้ม 4 ช่อง และประตูม้วนความเร็วสูงสีส้ม-แดง 1 ช่อง พาเลทกล่องสินค้าวางเรียงราย รถโฟร์คลิฟท์ไฟฟ้าสีฟ้า-ดำ กันสาดโครงเหล็กยื่นยาว หน้าต่างชั้นบนสีเขียวพร้อมท่อระบายน้ำฝนโค้ง 7 ช่องเสา และแผงคอยล์ร้อนแอร์ 18 เครื่องบนผนังฝั่งขวา"
  }
];
