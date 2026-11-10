// ============================================================================
// Module: src/config/constants.js
// Global project metadata, blueprint coordinate scale, and camera presets.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};

window.Starflex3D.Config = {
  meta: {
    title: "Starflex Factory 3D",
    subtitle: "บมจ. สตาร์เฟล็กซ์ · โมเดลโรงงาน 3 มิติ (Cutaway View)",
    blueprintWidth: 2340,
    blueprintHeight: 1590,
    centerX: 1050,
    centerY: 760,
    scale: 0.1 // 10 blueprint pixels = 1.0 meter in 3D world space
  },

  scene: {
    backgroundColor: 0xf6f8fb,
    fogDensity: 0.0022,
    defaultCameraPos: [-18, 108, 142],
    defaultCameraTarget: [5, 2, 4],
    fov: 38,
    near: 1,
    far: 900,
    minDistance: 18,
    maxDistance: 340
  },

  cameraPresets: [
    {
      id: "isometric",
      target: [5, 2, 10],
      pos: [-18, 102, 148],
      label: "มุมมอง 3D Isometric Cutaway (เริ่มต้น)"
    },
    {
      id: "front_street",
      target: [12, 5, 42],
      pos: [-8, 16, 118],
      label: "มุมมองด้านหน้าบริษัท (Street View ตามสถานที่จริง)"
    },
    {
      id: "east_v_facade",
      target: [58, 5, 38],
      pos: [85, 18, 108],
      label: "มุมมองอาคารฝั่งขวา (เสา V-Column & ผนังกระจกโมเดิร์น)"
    },
    {
      id: "top_down",
      target: [5, 0, 4],
      pos: [5, 215, 6],
      label: "มุมมองผังด้านบน (Top-Down Plan View)"
    },
    {
      id: "east_hall",
      target: [62, 4, -5],
      pos: [115, 62, 65],
      label: "มุมมองอาคาร 4 (Blow Film 1BF-01 & Caida PT-07)"
    },
    {
      id: "west_hall",
      target: [-45, 3, -5],
      pos: [-105, 62, 65],
      label: "มุมมองอาคาร 1 (Rotomec PT-01 & Tandem Extrusion)"
    }
  ]
};
