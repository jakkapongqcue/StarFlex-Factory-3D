// ============================================================================
// Module: src/main.js
// Application Entry Point: Initializes State, SceneManager, 3D Builders,
// UI Controllers, DOM Event Listeners, and the Main Render Loop.
// ============================================================================

(function () {
  const App = window.Starflex3D;

  // 1. Central Application State
  const state = {
    mode: "explore",             // 'explore' | 'tour'
    structureMode: "cutaway",    // 'cutaway' | 'xray' | 'full' | 'open'
    floorMode: "blueprint_soft", // 'blueprint_soft' | 'blueprint_full' | 'overlay' | 'satellite'
    showLabels: true,
    showFlows: true,
    selectedCategory: "all",
    selectedItemId: null,
    tourIndex: 0,
    camPresetIdx: 0,
    textures: {},
    itemMeshes: new Map(),
    labelElements: [],
    flowParticles: [],
    cameraTargetLerp: null,
    cameraPosLerp: null
  };

  App.state = state;

  // 2. Initialize Three.js Scene & Materials
  const container = document.getElementById("canvas-container");
  const { scene, clipPlaneZ } = App.SceneManager.init(container, state);
  const mats = App.Materials.create([clipPlaneZ]);
  App.mats = mats;

  // 3. Build 3D Factory World
  App.Builders.Site.build(scene, mats, state);
  App.Builders.Architecture.build(scene, mats, state);
  App.Builders.FrontFacade.build(scene, mats, state);
  App.Builders.Machines.build(scene, mats, state);
  App.Builders.Flows.build(scene, state);

  // 4. Initialize UI Modules
  App.UI.Labels.init(state);
  App.UI.Drawer.init(state);
  App.UI.Inspector.initRaycasting(state);

  // Update total item count on "ส่วนประกอบ" button
  const compCountEl = document.getElementById("components-count");
  if (compCountEl) {
    compCountEl.textContent = `ส่วนประกอบ (${App.Data.items.length})`;
  }

  // 5. Bind UI Controls to Modular Actions (Exposed for inline or programmatic use)
  window.StarflexActions = {
    toggleComponentsDrawer: () => App.UI.Drawer.toggle(),
    setAppMode: mode => App.UI.Tour.setAppMode(state, mode),
    toggleLabels: () => App.UI.Labels.toggle(state),
    toggleFlows: () => App.UI.Toolbar.toggleFlows(state),
    cycleStructureMode: () => App.UI.Toolbar.cycleStructureMode(state, mats),
    toggleSolarRoofPreview: () => App.UI.Toolbar.toggleSolarRoofPreview(state, mats),
    cycleFloorOverlay: () => App.UI.Toolbar.cycleFloorOverlay(state),
    cycleCameraPreset: () => App.UI.Toolbar.cycleCameraPreset(state),
    toggleFullscreen: () => App.UI.Toolbar.toggleFullscreen(),
    resetCamera: () => App.UI.Toolbar.resetCamera(state),
    clearSelection: () => App.UI.Inspector.clearSelection(state),
    prevTourStep: () => App.UI.Tour.prevStep(state),
    nextTourStep: () => App.UI.Tour.nextStep(state),
    toggleCutawayPopover: () => App.UI.Toolbar.toggleCutawayPopover(),
    updateClipSlider: val => App.UI.Toolbar.updateClipSlider(state, val),
    updateRoofOpacity: val => App.UI.Toolbar.updateRoofOpacity(state, mats, val),
    updateBlueprintOpacity: val => App.UI.Toolbar.updateBlueprintOpacity(state, val)
  };

  // Optional URL query parameter overrides
  const urlParams = new URLSearchParams(window.location.search);
  const isCaptureMode = urlParams.get("capture") === "1";
  if (urlParams.get("struct")) {
    App.UI.Toolbar.applyStructureMode(state, mats, urlParams.get("struct"));
  }
  if (urlParams.get("floor")) {
    while (state.floorMode !== urlParams.get("floor")) {
      App.UI.Toolbar.cycleFloorOverlay(state);
    }
  }

  // 6. Main Render & Animation Loop
  function renderFrame() {
    App.SceneManager.updateCameraFlight(state);
    App.Builders.Flows.updateParticles(state);
    state.controls.update();
    state.renderer.render(state.scene, state.camera);
    App.UI.Labels.updateProjection(state);
  }

  window.__triggerRender = renderFrame;

  function animate() {
    if (!isCaptureMode) {
      requestAnimationFrame(animate);
    }
    renderFrame();
  }

  animate();
})();
