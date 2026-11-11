// ============================================================================
// Module: src/data/machines/blown-film.data.js
// Machine items for Hall 4 Blown Film tower (1BF-01) and associated utilities
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};
window.Starflex3D.Data.Machines = window.Starflex3D.Data.Machines || {};

window.Starflex3D.Data.Machines.blownFilm = [
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
    id: "film_roll_racks_pos1",
    code: "RACK-FILM",
    name: "ชั้นวางเก็บม้วนฟิล์มสีขาว 2 แถว (White Film Roll Storage Racks)",
    category: "warehouse",
    hall: "hall_4",
    type: "film_roll_racks",
    bounds: [1515, 270, 1625, 525],
    height: 5.2,
    orientation: "NS",
    specs: "ชั้นวางโครงสร้างเหล็กอุตสาหกรรม 2 แถวคู่ × 3 ชั้น · จัดเก็บม้วนฟิล์มสีขาว (Blown Film Rolls)",
    description: "ชั้นวางเก็บม้วนฟิล์มสีขาว (Blown Film Rolls) ตำแหน่งที่ 1 ทางทิศเหนือของอาคาร 4 โครงสร้างเหล็ก 2 แถวคู่ 3 ชั้นความสูง รองรับม้วนฟิล์มวางแนวนอนบนรางประกบและม้วนฟิล์มตั้งบนพาเลท"
  },
  {
    id: "resin_storage_pos2",
    code: "RESIN-ST",
    name: "ชั้นวางเก็บถุงกระสอบเรซิน 2 แถว (Resin & Raw Films Storage Racks)",
    category: "warehouse",
    hall: "hall_4",
    type: "resin_storage",
    bounds: [1655, 270, 1775, 525],
    height: 5.2,
    orientation: "NS",
    specs: "ชั้นวางโครงสร้างเหล็กอุตสาหกรรม 2 แถวคู่ × 3 ชั้น · จัดเก็บพาเลทถุงกระสอบเรซิน 25 กก. และม้วนฟิล์ม",
    description: "ชั้นวางโครงสร้างเหล็ก 2 แถวคู่ 3 ชั้นความสูง ตำแหน่งที่ 2 โซนหน้าหอเป่าฟิล์ม 1BF-01 สำหรับจัดเก็บพาเลทถุงกระสอบเม็ดพลาสติก Polymer Resin (Blown Film Grade 25 kg/sack) และม้วนฟิล์มตั้งบนพาเลท"
  }
];
