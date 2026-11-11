// ============================================================================
// Module: src/data/tour.data.js
// Interactive Guided Production Tour Steps ("ทัวร์สายการผลิต")
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Data = window.Starflex3D.Data || {};

window.Starflex3D.Data.tourSteps = [
  {
    title: "ภาพรวมโรงงาน บมจ. สตาร์เฟล็กซ์ (Starflex PCL)",
    subtitle: "โครงสร้างจริง 4 อาคารหลัก · มุมมองผ่าตัดขวาง 3 มิติ (Cutaway View)",
    description: "โมเดล 3 มิติจำลองตามผังโรงงานจริง (Starflex Plant Layout) ประกอบด้วยอาคารฝั่งตะวันตก (หลังคาโซลาร์เซลล์ 4 ช่วง), อาคารคลังสินค้าชั้นวางสูงตรงกลางพร้อมท่าเทียบรถบรรทุก, อาคารผลิตฝั่งตะวันออกที่มีสันหลังคายกสูง (Monitor Roof) และอาคารสำนักงานหน้า 2 ชั้น",
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
    subtitle: "อาคาร 1 & 2 (Xinda PT-03, Beiren PT-04, Caida PT-06/07)",
    description: "ฟิล์มถูกส่งเข้าสู่เครื่องพิมพ์กราเวียร์ 8–10 สี (เช่น Xinda PT-03, Beiren, และ Caida PT-07) โดยเชื่อมต่อกับคลังลูกกลิ้งแม่พิมพ์แนวตั้ง (Cylinder Storage) ระบบจ่ายหมึกอัตโนมัติ และสถานีเตรียมแม่พิมพ์",
    targetPx: [460, 520],
    camOffset: [-35, 42, 52],
    highlightId: "xinda_pt03"
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
];
