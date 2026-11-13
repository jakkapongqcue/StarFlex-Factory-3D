# Starflex Factory 3D (บมจ. สตาร์เฟล็กซ์)

🌐 **Live Web Demo (GitHub Pages):** [https://jakkapongqcue.github.io/StarFlex-Factory-3D/](https://jakkapongqcue.github.io/StarFlex-Factory-3D/)

แบบจำลองโรงงานผลิตบรรจุภัณฑ์ **บริษัท สตาร์เฟล็กซ์ จำกัด (มหาชน) (Starflex PCL)** ในรูปแบบ **3D Cutaway Interactive Model** อ้างอิงสัดส่วนพิกัด 1:1 จากผังโรงงานจริง (`Starflex Plant Layout.jpeg`) และโครงสร้างหลังคาโซลาร์เซลล์/ตัวอาคารจากภาพถ่ายดาวเทียม Google Maps

---

## โครงสร้างโปรเจกต์ (Modular Architecture)

```text
StarFlex-FactoryLayout3D/
├── index.html                        # Entry point หลักของแอปพลิเคชัน
├── README.md                         # เอกสารอธิบายโครงสร้างและการดูแลรักษา
├── References/                       # ไฟล์ภาพผังโรงงานและภาพถ่ายดาวเทียมต้นฉบับ
│   ├── Starflex Plant Layout.jpeg
│   ├── Starflex from google map.png
│   └── Starflex from google map over Layout.png
├── assets/
│   ├── css/
│   │   └── main.css                  # สไตล์ UI ทั้งหมด แยกส่วนตามคอมโพเนนต์
│   ├── textures/
│   │   └── textures.js               # ข้อมูลพื้นผิว Base64 สำหรับโหลดใช้งานได้ทั้งแบบ file:// และ HTTP
│   └── vendor/
│       ├── three.min.js              # Three.js r128
│       └── OrbitControls.js          # Three.js OrbitControls
└── src/
    ├── config/
    │   ├── constants.js              # ค่าคงที่ สเกลผังโรงงาน (10px = 1m) และมุมกล้องเริ่มต้น
    │   └── categories.js             # หมวดหมู่แผนกและชุดสี (Printing, Extrusion, Lamination, Converting, Warehouse, Office)
    ├── data/
    │   ├── buildings.data.js         # ข้อมูลโครงสร้างอาคารหลักทั้ง 4 โถง, อาคารสำนักงานหน้า 2 ชั้น, ห้องปั๊ม และป้อม รปภ.
    │   ├── machines.data.js          # พิกัดและรายละเอียดเครื่องจักร/คลังสินค้าทั้งหมด 42 รายการ
    │   └── tour.data.js              # ขั้นตอนการนำชมสายการผลิต (Guided Tour Steps)
    ├── core/
    │   ├── coordinates.js            # ฟังก์ชันแปลงพิกัด 2D Pixel (2340×1590) เป็น 3D World Space (เมตร)
    │   ├── materials.js              # ศูนย์รวมวัสดุ Three.js PBR และระนาบตัดขวาง (Clipping Plane)
    │   └── scene-manager.js          # จัดการ Scene, Camera, Renderer, แสงเงา และการเคลื่อนที่ของกล้อง
    ├── builders/
    │   ├── site.builder.js           # สร้างตารางพื้น, เส้นขอบเขตโรงงาน, แผ่นพื้นคอนกรีต, ทางลาดสีฟ้า, กันสาด และต้นไม้
    │   ├── architecture.builder.js   # สร้างผนังแบบมองทะลุ (Cutaway), เสา H-Beam, โครงหลังคาโค้ง (Curved Arch Roof) & โซลาร์เซลล์ และเครนเหนือศีรษะ
    │   ├── front-facade.builder.js   # สร้างสถาปัตยกรรมหน้าบริษัทตามสถานที่จริง (สำนักงานหลังคาโค้ง+ซุ้มปั้นหยาเสาหิน, อาคารขวาผนังกระจกสีฟ้า+เสา V-Column, รั้วโคมไฟทอง, ป้าย STARFLEX สีน้ำเงิน, เสาธง 3 ต้น, ตู้ ATM ttb และป้อม รปภ. หลังคาปั้นหยา)
    │   └── machines.builder.js       # สร้างโมเดล 3D เครื่องจักรแยกตามประเภท (Gravure, Blow Film, Extrusion, Laminator, BM, Racks)
    ├── ui/
    │   ├── labels.ui.js              # ป้ายชื่อเครื่องจักรลอยตัวใน 3D
    │   ├── drawer.ui.js              # แผงรายการ "ส่วนประกอบ" ระบบค้นหา และตัวกรองหมวดหมู่
    │   ├── inspector.ui.js           # ระบบคลิกเลือกเครื่องจักร (Raycasting) และการ์ดแสดงรายละเอียด
    │   ├── toolbar.ui.js             # แถบเครื่องมือสลับโหมด Cutaway / X-Ray / หลังคาโซลาร์เซลล์ / พื้นผังโรงงาน
    │   └── tour.ui.js                # ระบบควบคุมโหมด "สำรวจ" และ "ทัวร์สายการผลิต"
    └── main.js                       # ตัวเริ่มต้นระบบ (Bootstrapper) และ Main Animation Loop
```

---

## การแก้ไขและบำรุงรักษา (Maintenance Guide)

1. **การเพิ่มหรือย้ายตำแหน่งเครื่องจักร**:
   - แก้ไขที่ไฟล์ [`src/data/machines.data.js`](src/data/machines.data.js)
   - กำหนดค่า `bounds: [px1, py1, px2, py2]` ตามพิกัดพิกเซลบนผัง `Starflex Plant Layout.jpeg` (ขนาด `2340 × 1590`) ระบบจะคำนวณตำแหน่งและสัดส่วน 3D ให้อัตโนมัติ
2. **การปรับแต่งรูปทรงโมเดล 3D ของเครื่องจักร**:
   - แก้ไขฟังก์ชันสร้างรูปทรงแยกตามประเภทใน [`src/builders/machines.builder.js`](src/builders/machines.builder.js)
3. **การปรับโครงสร้างผนัง เสา หรือหลังคาโซลาร์เซลล์**:
   - แก้ไขที่ไฟล์ [`src/builders/architecture.builder.js`](src/builders/architecture.builder.js)
4. **การปรับเปลี่ยนสีประจำแผนกหรือมุมกล้อง**:
   - แก้ไขที่ไฟล์ [`src/config/categories.js`](src/config/categories.js) และ [`src/config/constants.js`](src/config/constants.js)
