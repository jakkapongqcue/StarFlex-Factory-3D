// ============================================================================
// Module: src/builders/machines/chemical-warehouse.builder.js
// Facade & Coordinator for North Exterior Yard Facilities (Chemical & Solvents).
// Modular implementations located in src/builders/north-yard/:
//   - north-yard.common.js
//   - solvent-facilities.builder.js (Zones 14 & 15)
//   - lpg-station.builder.js (Zone 13)
//   - chemical-storage.builder.js (Zones 20A & 20B)
//   - raw-material.builder.js (Zone 5)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.ChemicalWarehouse = window.Starflex3D.Builders.ChemicalWarehouse || {};

(function () {
  const NY = window.Starflex3D.Builders.NorthYard || {};

  function buildChemicalWarehouse(...args) {
    if (typeof NY.buildChemicalWarehouse === "function") {
      return NY.buildChemicalWarehouse(...args);
    }
  }

  function buildSolventDistillation(...args) {
    if (typeof NY.buildSolventDistillation === "function") {
      return NY.buildSolventDistillation(...args);
    }
  }

  function buildSolventMixing(...args) {
    if (typeof NY.buildSolventMixing === "function") {
      return NY.buildSolventMixing(...args);
    }
  }

  function buildLPGStation(...args) {
    if (typeof NY.buildLPGStation === "function") {
      return NY.buildLPGStation(...args);
    }
  }

  function buildRawMaterialWarehouse(...args) {
    if (typeof NY.buildRawMaterialWarehouse === "function") {
      return NY.buildRawMaterialWarehouse(...args);
    }
  }

  window.Starflex3D.Builders.ChemicalWarehouse = {
    buildChemicalWarehouse,
    buildSolventDistillation,
    buildSolventMixing,
    buildLPGStation,
    buildRawMaterialWarehouse
  };
})();
