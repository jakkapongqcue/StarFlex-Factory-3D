// ============================================================================
// Module: src/builders/machines/printing.builder.js
// Coordinator forwarding Printing & Ink Cleanroom builders to modular models
// under src/builders/machines/printing/.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.Printing = (function () {
  const {
    GravurePress,
    BeirenPT04,
    InkDispenser
  } = window.Starflex3D.Builders.PrintingModels;

  function buildGravurePress(inner, L, W, H, mats, accentMat, lightAccentMat, item) {
    if (item && (item.code === "PT-04" || item.id === "beiren_pt04")) {
      BeirenPT04.build(inner, L, W, H, mats, item);
      return;
    }
    GravurePress.build(inner, L, W, H, mats, accentMat, lightAccentMat);
  }

  return {
    buildGravurePress,
    buildBeirenPT04: BeirenPT04.build,
    buildInkDispenserStation: InkDispenser.build
  };
})();
