// ============================================================================
// Module: src/builders/machines/laminating.builder.js
// Coordinator & Dispatcher for Laminating, Extrusion & Oven 3D Models.
// Forwards to dedicated model modules under src/builders/machines/laminating/.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Laminating = (function () {
  const {
    BobstLB10,
    BobstLB09,
    BeirenSB04,
    ExtrusionOven
  } = window.Starflex3D.Builders.LaminatingModels;

  function buildLaminator(inner, L, W, H, mats, accentMat, item) {
    if (item && (item.code === "1LB-09" || item.id === "bobst_1lb09")) {
      BobstLB09.build(inner, L, W, H, mats, item);
      return;
    }

    if (item && (item.code === "SB-04" || item.id === "beiren_sb04")) {
      BeirenSB04.build(inner, L, W, H, mats, item);
      return;
    }

    const isBobstLB10 = item && (
      item.code === "LB-10" ||
      item.id === "bobst_lb10" ||
      (item.name && item.name.toLowerCase().includes("bobst"))
    );

    if (isBobstLB10) {
      BobstLB10.build(inner, L, W, H, mats, item);
      return;
    }

    ExtrusionOven.buildGenericLaminator(inner, L, W, H, mats, accentMat);
  }

  return {
    buildExtrusionLine: ExtrusionOven.buildExtrusionLine,
    buildLaminator,
    buildBobstLB10: BobstLB10.build,
    buildBobstLB09: BobstLB09.build,
    buildBeirenSB04: BeirenSB04.build,
    buildOvenChamber: ExtrusionOven.buildOvenChamber
  };
})();
