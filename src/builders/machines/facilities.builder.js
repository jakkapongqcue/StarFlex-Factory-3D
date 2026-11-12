// ============================================================================
// Module: src/builders/machines/facilities.builder.js
// Facade & Coordinator for Factory Facilities, Cleanrooms & Utilities.
// Modular implementations located in src/builders/facilities/:
// - locker-rooms.builder.js
// - restrooms-stairs.builder.js
// - hygiene.builder.js
// - walkway.builder.js
// - south-offices.builder.js
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Facilities = window.Starflex3D.Builders.Facilities || {};

(function () {
  const Fac = window.Starflex3D.Builders.Facilities;

  function buildLockerRoom(...args) {
    if (typeof Fac.buildLockerRoom === "function" && Fac.buildLockerRoom !== buildLockerRoom) {
      return Fac.buildLockerRoom(...args);
    }
  }

  function buildStairsAndRestrooms(...args) {
    if (typeof Fac.buildStairsAndRestrooms === "function" && Fac.buildStairsAndRestrooms !== buildStairsAndRestrooms) {
      return Fac.buildStairsAndRestrooms(...args);
    }
  }

  function buildProductionWalkway(...args) {
    if (typeof Fac.buildProductionWalkway === "function" && Fac.buildProductionWalkway !== buildProductionWalkway) {
      return Fac.buildProductionWalkway(...args);
    }
  }

  function buildHall1SouthOffice(...args) {
    if (typeof Fac.buildHall1SouthOffice === "function" && Fac.buildHall1SouthOffice !== buildHall1SouthOffice) {
      return Fac.buildHall1SouthOffice(...args);
    }
  }

  // Preserve existing namespace functions if already assigned by modular sub-builders,
  // or export the coordinator wrappers as fallback.
  Fac.buildLockerRoom = Fac.buildLockerRoom || buildLockerRoom;
  Fac.buildStairsAndRestrooms = Fac.buildStairsAndRestrooms || buildStairsAndRestrooms;
  Fac.buildProductionWalkway = Fac.buildProductionWalkway || buildProductionWalkway;
  Fac.buildHall1SouthOffice = Fac.buildHall1SouthOffice || buildHall1SouthOffice;
})();
