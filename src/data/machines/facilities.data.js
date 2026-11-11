// ============================================================================
// Module: src/data/machines/facilities.data.js
// Offices, locker rooms, corridors, utilities, pump house, and guardhouse
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.facilities = [
  // --- Hall 1 QA / Office ---
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

  // --- Hall 2 Warehouse Office SW5 ---
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

  // --- Front Admin HQ Office ---
  {
    id: "admin_vip_office",
    code: "OFFICE-HQ",
    name: "สำนักงานใหญ่ 2 ชั้น (หลังคาโค้ง Arch Roof + ซุ้มทางเข้าเสาหินปั้นหยา)",
    category: "office_utility",
    hall: "office_front",
    type: "hq_office",
    bounds: [674, 1020, 1018, 1190],
    height: 7.8,
    orientation: "EW",
    specs: "หลังคาโค้งติดโลโก้ STARFLEX · ซุ้มปั้นหยาเสาหิน · สนามหญ้า & เสาธง 3 ต้น",
    description: "อาคารสำนักงานหน้า 2 ชั้น โทนสีเทา-อมฟ้าคาดกรอบขาว หลังคาทรงโค้งมนพร้อมตราสัญลักษณ์ STARFLEX ด้านหน้ามีซุ้มทางเข้าหลังคาทรงปั้นหยารองรับด้วยเสาหินประดับคู่ ศาลพระภูมิ และสนามหญ้าพร้อมเสาธง 3 ต้น"
  },

  // --- Hall 3 Locker Rooms & Main Production Corridor ---
  {
    id: "locker_room_yellow",
    code: "LCK-02",
    name: "ห้องเปลี่ยนชุดพนักงาน #2 - โซนสีเหลือง (Gowning Room #2)",
    category: "office_utility",
    hall: "hall_3",
    type: "locker_room_yellow",
    bounds: [1102, 436, 1156, 520],
    height: 3.6,
    orientation: "EW",
    specs: "ห้องเปลี่ยนชุด/ตู้ล็อกเกอร์พนักงาน (Cleanroom Gowning Room) · โซนสีเหลือง-ส้ม",
    description: "ห้องเปลี่ยนชุดและตู้ล็อกเกอร์พนักงานโซนสีเหลือง สำหรับเตรียมความพร้อมก่อนเข้าสู่สายการผลิต ภายในมีตู้ล็อกเกอร์เหล็ก ม้านั่งยาวสแตนเลสสำหรับเปลี่ยนรองเท้าคลีนรูม และจุดแขวนชุดคลีนสูท"
  },
  {
    id: "locker_room_blue",
    code: "LCK-01",
    name: "ห้องเปลี่ยนชุดพนักงาน #1 - โซนสีน้ำเงิน (Gowning Room #1)",
    category: "office_utility",
    hall: "hall_3",
    type: "locker_room_blue",
    bounds: [1102, 524, 1156, 610],
    height: 3.6,
    orientation: "EW",
    specs: "ห้องเปลี่ยนชุด/ตู้ล็อกเกอร์พนักงาน (Cleanroom Gowning Room) · โซนสีน้ำเงิน",
    description: "ห้องเปลี่ยนชุดและตู้ล็อกเกอร์พนักงานโซนสีน้ำเงิน สำหรับเตรียมความพร้อมก่อนเข้าสู่สายการผลิต ภายในมีตู้ล็อกเกอร์เหล็ก ม้านั่งยาวสแตนเลสสำหรับเปลี่ยนรองเท้าคลีนรูม และจุดแขวนชุดคลีนสูท"
  },
  {
    id: "facility_stairs_toilets",
    code: "WC-STAIR",
    name: "ทางขึ้นลงบันไดและห้องน้ำ (Stairs & Restrooms)",
    category: "office_utility",
    hall: "hall_3",
    type: "utility_stairs_wc",
    bounds: [1102, 614, 1156, 712],
    height: 3.6,
    orientation: "EW",
    specs: "บันไดโครงเหล็กทางขึ้นลงชั้น 2 + ห้องน้ำพนักงานแยกชาย-หญิง",
    description: "บันไดโครงสร้างเหล็กทางขึ้นลงสู่ชั้นลอย/ชั้น 2 และห้องน้ำพนักงานแยกชาย-หญิงติดแนวทางเดินหลัก"
  },
  {
    id: "production_entry_corridor",
    code: "WALK-PROD",
    name: "ทางเดินหลักเข้าไลน์ผลิต & ประตูทางเข้า 2 บาน (Main Access Corridor & Doors)",
    category: "office_utility",
    hall: "hall_3",
    type: "production_walkway",
    bounds: [1056, 318, 1102, 815],
    height: 3.4,
    orientation: "NS",
    specs: "ทางเดินหลัก Safety Walkway ยกพื้นสูงเท่าชานชาลา (+1.25m) พร้อมเส้นทางลูกศรแดง · ประตูทางเข้า 2 บาน · บันไดทางเข้าหลักเชื่อมต่อลานขนส่ง",
    description: "เส้นทางเดินหลักสำหรับพนักงานเข้าสู่พื้นที่การผลิต (Safety Walkway) โดยพื้นภายในยกสูงระดับเดียวกับชานชาลาท่าโหลดสินค้า (+1.25m) มีประตูทางเข้าหลักบานคู่ บันไดคอนกรีตลงสู่ลานขนส่งภายนอก ภายในเชื่อมต่อไปยังห้องเปลี่ยนชุดพนักงาน ห้องน้ำ คลังสินค้าสำเร็จรูป และสายการผลิต"
  },

  // --- Hall 4 East Facade & MDB ---
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
    id: "east_ramps_shipping",
    code: "EAST-FACADE",
    name: "โถงด้านหน้าอาคารตะวันออก (ผนังกระจกสีฟ้า 2 ชั้น & เสาเฉียง V-Column)",
    category: "office_utility",
    hall: "hall_4",
    type: "ramp_group",
    bounds: [1420, 755, 1605, 1290],
    height: 8.4,
    orientation: "NS",
    specs: "ผนังกระจกสีฟ้าสะท้อนแสง · ชายคาสีเทาเข้ม · เสาเฉียงรูปตัว V สีขาว 5 คู่",
    description: "ส่วนหน้าอาคารผลิตฝั่งตะวันออก (อาคาร 4) ดีไซน์โมเดิร์น 2 ชั้น โดดเด่นด้วยผนังกระจกสีฟ้าสะท้อนแสง เสาโครงสร้างเฉียงรูปตัว V สีขาว ชายคายื่นสีเทาเข้ม ผนังฟินสีน้ำเงินเข้ม และเต็นท์โค้งเก็บสินค้าด้านข้าง"
  },

  // --- Auxiliaries ---
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
    code: "GATE / GUARD",
    name: "ป้อม รปภ. หลังคาปั้นหยา (ในเขตรั้ว), ตู้ ATM ttb & ป้ายหน้าบริษัท STARFLEX",
    category: "office_utility",
    hall: "guardhouse",
    type: "guard_station",
    bounds: [1165, 1445, 1295, 1560],
    height: 4.8,
    orientation: "NS",
    specs: "ป้อม รปภ. ในเขตรั้ว · เกาะทางเข้าขอบขาว-แดง · กันสาดตรวจการ · ตู้ ATM ttb",
    description: "อาคารป้อม รปภ. ตั้งอยู่ภายในแนวรั้วโรงงานทางฝั่งทิศตะวันออกของประตูทางเข้าหลัก มีกันสาดยื่นคลุมเลนตรวจรถ เกาะทางเข้าทาสีขอบขาว-แดง ตู้ ATM ttb และป้ายชื่อบริษัท STARFLEX หน้าแนวรั้วตรงตามมุมมองภาพถ่ายจริง Loading_Dock_1_StreetView.jpg"
  },
  {
    id: "chem_storage_building",
    code: "CHEM-WH",
    name: "อาคารจัดเก็บสารเคมี (Chemical Storage Warehouse)",
    category: "office_utility",
    hall: "exterior",
    type: "chemical_warehouse",
    bounds: [240, 80, 540, 190],
    height: 5.6,
    orientation: "EW",
    specs: "อาคารเก็บสารเคมีเดี่ยวภายนอก · หลังคาทรงจั่ว · ระบบระบายอากาศและกักเก็บสารเคมีรั่วไหล",
    description: "อาคารจัดเก็บสารเคมีและตัวทำละลาย (Chemicals & Solvent Storage) ตั้งอยู่ภายนอกโรงงานด้านหลังฝั่งทิศเหนือ โครงสร้างแยกเดี่ยวเพื่อความปลอดภัย มีคันกั้นสารเคมีรั่วไหล (Spill Containment) ประตูม้วนขนถ่ายสารเคมีหันสู่ Hall 1 บานเกล็ดระบายไอสารเคมี และจัดเก็บถังเคมี 200 ลิตรพร้อมถัง IBC 1,000L ตามมาตรฐานความปลอดภัยโรงงาน"
  }
];
