// ============================================================================
// Module: src/builders/front-facade.builder.js
// Orchestrates the authentic front streetscape & architecture of Starflex PCL:
//   1. Landscape: Lawn, curbs, shrubs & 3 flagpoles (landscape.builder.js)
//   2. Office: 2-Story Office, curved arch roof & porte-cochere (office.builder.js)
//   3. Canopy: Seamless L-shaped canopy & AC units (canopy.builder.js)
//   4. Building 4: Modern blue glass curtain wall & V-columns (building4.builder.js)
//   5. Guardhouse: Security pavilion, ATM, sign & gates (guardhouse.builder.js)
//   6. Loading Dock: 7-bay dock facade & courtyard architecture (dock-facade.builder.js)
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};

window.Starflex3D.Builders.FrontFacade = {
  build(scene, mats, state) {
    const frontGroup = new THREE.Group();
    frontGroup.name = "AuthenticFrontFacade";
    state.frontFacadeGroup = frontGroup;

    const fMats = window.Starflex3D.Builders.Facade.Common.getMaterials(mats);

    // 1. Green Front Lawn & 3 Flagpoles
    if (window.Starflex3D.Builders.Facade.Landscape) {
      frontGroup.add(window.Starflex3D.Builders.Facade.Landscape.build(fMats));
    }

    // 2. Building 2 Front Office & Hipped-Roof Porte-Cochere
    if (window.Starflex3D.Builders.Facade.Office) {
      frontGroup.add(window.Starflex3D.Builders.Facade.Office.build(fMats));
    }

    // 3. Continuous L-Shaped Canopy (Office Nook & Hall 2 Walkway)
    if (window.Starflex3D.Builders.Facade.Canopy) {
      frontGroup.add(window.Starflex3D.Builders.Facade.Canopy.build(fMats));
    }

    // 4. Building 4 Modern Blue Glass Curtain Wall & White V-Columns
    if (window.Starflex3D.Builders.Facade.Building4) {
      frontGroup.add(window.Starflex3D.Builders.Facade.Building4.build(fMats));
    }

    // 5. Perimeter Fences, Gates, Blue Sign, ATM & Security Guardhouse
    if (window.Starflex3D.Builders.Facade.Guardhouse) {
      frontGroup.add(window.Starflex3D.Builders.Facade.Guardhouse.build(fMats));
    }

    // 6. Loading Dock Courtyard Facade, Exhaust Hoods & AC Matrix
    if (window.Starflex3D.Builders.Facade.DockFacade) {
      frontGroup.add(window.Starflex3D.Builders.Facade.DockFacade.build(fMats));
    }

    scene.add(frontGroup);
    return frontGroup;
  }
};
