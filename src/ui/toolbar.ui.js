// ============================================================================
// Module: src/ui/toolbar.ui.js
// Controls Cutaway/X-Ray/Full structure modes, floor blueprint/satellite
// overlays, camera presets, fullscreen, and bottom cutaway sliders.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Toolbar = {
  /**
   * Only 2 Viewing Modes as requested:
   * 1. 'cutaway': Dynamic 360° cut-away (มองมุมไหน กำแพงหายมุมนั้น)
   * 2. 'xray': See-through transparent structure (มองทะลุกำแพงและหลังคา)
   */
  applyStructureMode(state, mats, mode) {
    if (mode !== "xray" && mode !== "cutaway") {
      mode = "cutaway";
    }
    state.structureMode = mode;
    const {
      wallsNorth,
      wallsSouth,
      wallsWest,
      wallsEast,
      partitionWallsGroup,
      roofTrussGroup,
      roofShellGroup
    } = state.archGroups || {};

    const statusText = document.getElementById("status-mode-text");
    const btnCutaway = document.getElementById("btn-cutaway");
    const btnXray = document.getElementById("btn-xray") || document.getElementById("btn-roof");

    if (mode === "cutaway") {
      if (partitionWallsGroup) partitionWallsGroup.visible = true;
      if (roofTrussGroup) roofTrussGroup.visible = true;
      if (roofShellGroup) roofShellGroup.visible = false;
      if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;

      // Restore solid opaque materials
      mats.wallSolid.opacity = 1.0;
      mats.wallSolid.transparent = false;
      mats.wallSolid.needsUpdate = true;

      mats.wallCutawayFront.opacity = 1.0;
      mats.wallCutawayFront.transparent = false;
      mats.wallCutawayFront.needsUpdate = true;

      mats.wallPartition.opacity = 1.0;
      mats.wallPartition.transparent = false;
      mats.wallPartition.needsUpdate = true;

      mats.roofSheet.opacity = 1.0;
      mats.roofSheet.transparent = false;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.opacity = 1.0;
      mats.solarPanel.transparent = false;
      mats.solarPanel.needsUpdate = true;

      const sliderRoof = document.getElementById("slider-roof");
      if (sliderRoof) sliderRoof.value = 0;

      // Run dynamic wall occlusion immediately for current camera orientation
      this.updateDynamicCutaway(state);

      if (btnCutaway) btnCutaway.classList.add("active");
      if (btnXray) btnXray.classList.remove("active");
      if (statusText) {
        statusText.textContent = "✂️ โหมด Cut-away (มองมุมไหน กำแพงหายมุมนั้น) · Dynamic 360°";
      }
    } else if (mode === "xray") {
      // In X-Ray mode: ALL exterior walls and full roofs are visible, but see-through!
      if (wallsNorth) wallsNorth.visible = true;
      if (wallsSouth) wallsSouth.visible = true;
      if (wallsWest) wallsWest.visible = true;
      if (wallsEast) wallsEast.visible = true;
      if (partitionWallsGroup) partitionWallsGroup.visible = true;
      if (roofTrussGroup) roofTrussGroup.visible = true;
      if (roofShellGroup) roofShellGroup.visible = true;
      if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;

      // X-Ray translucent materials
      mats.wallSolid.transparent = true;
      mats.wallSolid.opacity = 0.26;
      mats.wallSolid.needsUpdate = true;

      mats.wallCutawayFront.transparent = true;
      mats.wallCutawayFront.opacity = 0.26;
      mats.wallCutawayFront.needsUpdate = true;

      mats.wallPartition.transparent = true;
      mats.wallPartition.opacity = 0.32;
      mats.wallPartition.needsUpdate = true;

      mats.roofSheet.transparent = true;
      mats.roofSheet.opacity = 0.22;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.transparent = true;
      mats.solarPanel.opacity = 0.36;
      mats.solarPanel.needsUpdate = true;

      const sliderRoof = document.getElementById("slider-roof");
      if (sliderRoof) sliderRoof.value = 40;

      if (btnCutaway) btnCutaway.classList.remove("active");
      if (btnXray) btnXray.classList.add("active");
      if (statusText) {
        statusText.textContent = "⚡ โหมด X-ray (มองทะลุกำแพงและหลังคา) · โครงสร้างโปร่งแสง 3D";
      }
    }

    if (window.__triggerRender) window.__triggerRender();
  },

  /**
   * Dynamic Wall Cut-away (มองมุมไหน กำแพงหายมุมนั้น):
   * Evaluates camera angle relative to factory center in real-time.
   * Any exterior wall facing towards the camera is automatically hidden,
   * opening an unobstructed view into the factory interior from that angle!
   */
  updateDynamicCutaway(state) {
    if (state.structureMode !== "cutaway") return;
    if (!state.camera || !state.archGroups) return;

    const cam = state.camera;
    const { wallsNorth, wallsSouth, wallsWest, wallsEast } = state.archGroups;
    if (!wallsNorth || !wallsSouth || !wallsWest || !wallsEast) return;

    // Factory center in 3D coordinates
    const target =
      state.controls && state.controls.target
        ? state.controls.target
        : new THREE.Vector3(5, 2, 4);

    const dx = cam.position.x - target.x;
    const dz = cam.position.z - target.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.001) return;

    const dirX = dx / len;
    const dirZ = dz / len;

    // Angular threshold with small margin so corner views hide both adjacent walls
    const threshold = 0.16;

    // South front walls (facing +Z): hide when camera is to the South
    wallsSouth.visible = dirZ <= threshold;

    // North back walls (facing -Z): hide when camera is to the North
    wallsNorth.visible = dirZ >= -threshold;

    // West walls (facing -X): hide when camera is to the West
    wallsWest.visible = dirX >= -threshold;

    // East walls (facing +X): hide when camera is to the East
    wallsEast.visible = dirX <= threshold;
  },

  cycleStructureMode(state, mats) {
    const next = state.structureMode === "cutaway" ? "xray" : "cutaway";
    this.applyStructureMode(state, mats, next);
  },

  toggleSolarRoofPreview(state, mats) {
    this.cycleStructureMode(state, mats);
  },

  updateClipSlider(state, val) {
    state.clipPlaneZ.constant = parseFloat(val);
  },

  updateRoofOpacity(state, mats, val) {
    const op = parseFloat(val) / 100;
    const { frontWallsGroup, roofShellGroup } = state.archGroups;
    if (op <= 0.02) {
      roofShellGroup.visible = false;
      frontWallsGroup.visible = false;
    } else if (op >= 0.9) {
      roofShellGroup.visible = true;
      frontWallsGroup.visible = true;
      mats.roofSheet.transparent = false;
      mats.roofSheet.opacity = 1.0;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.transparent = false;
      mats.solarPanel.opacity = 1.0;
      mats.solarPanel.needsUpdate = true;

      mats.wallCutawayFront.transparent = false;
      mats.wallCutawayFront.opacity = 1.0;
      mats.wallCutawayFront.needsUpdate = true;
    } else {
      roofShellGroup.visible = true;
      frontWallsGroup.visible = true;
      mats.roofSheet.transparent = true;
      mats.roofSheet.opacity = op;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.transparent = true;
      mats.solarPanel.opacity = op;
      mats.solarPanel.needsUpdate = true;

      mats.wallCutawayFront.transparent = true;
      mats.wallCutawayFront.opacity = op;
      mats.wallCutawayFront.needsUpdate = true;
    }
  },

  updateBlueprintOpacity(state, val) {
    if (state.blueprintPlane) {
      state.blueprintPlane.material.opacity = parseFloat(val) / 100;
      state.blueprintPlane.visible = parseFloat(val) > 1;
    }
  },

  cycleFloorOverlay(state) {
    const modes = ["blueprint_soft", "blueprint_full", "overlay", "satellite"];
    const next = modes[(modes.indexOf(state.floorMode) + 1) % modes.length];
    state.floorMode = next;
    const bp = state.blueprintPlane;
    const sat = state.satPlane;
    const statusText = document.getElementById("status-mode-text");

    if (next === "blueprint_soft") {
      bp.visible = true;
      bp.material.opacity = 0.32;
      sat.visible = false;
      document.getElementById("slider-bp").value = 32;
      statusText.textContent = "พื้นคอนกรีตสถาปัตยกรรม + เส้นผังโรงงานบาง";
    } else if (next === "blueprint_full") {
      bp.visible = true;
      bp.material.opacity = 0.88;
      sat.visible = false;
      document.getElementById("slider-bp").value = 88;
      statusText.textContent = "แสดงผังโรงงานจริง 100% (Starflex Plant Layout.jpeg)";
    } else if (next === "overlay") {
      bp.visible = true;
      bp.material.opacity = 0.55;
      if (state.textures.overlay) {
        sat.material.map = state.textures.overlay;
        sat.material.needsUpdate = true;
      }
      sat.visible = true;
      sat.material.opacity = 0.85;
      statusText.textContent = "เปรียบเทียบผังโรงงานซ้อนภาพถ่ายดาวเทียม Google Maps";
    } else if (next === "satellite") {
      bp.visible = false;
      if (state.textures.satellite) {
        sat.material.map = state.textures.satellite;
        sat.material.needsUpdate = true;
      }
      sat.visible = true;
      sat.material.opacity = 0.92;
      statusText.textContent = "เปรียบเทียบสถานที่จริงจากภาพถ่ายดาวเทียม Google Maps";
    }
  },

  toggleFlows(state) {
    state.showFlows = !state.showFlows;
    if (state.flowGroup) state.flowGroup.visible = state.showFlows;
    document.getElementById("btn-flows").classList.toggle("active", state.showFlows);
  },

  toggleCutawayPopover() {
    document.getElementById("cutaway-popover").classList.toggle("hidden");
  },

  cycleCameraPreset(state) {
    const presets = window.Starflex3D.Config.cameraPresets;
    state.camPresetIdx = ((state.camPresetIdx || 0) + 1) % presets.length;
    const p = presets[state.camPresetIdx];
    window.Starflex3D.SceneManager.flyTo(
      state,
      new THREE.Vector3(...p.target),
      new THREE.Vector3(...p.pos)
    );
    document.getElementById("status-mode-text").textContent = p.label;
  },

  resetCamera(state) {
    const cfg = window.Starflex3D.Config.scene;
    state.camPresetIdx = 0;
    window.Starflex3D.SceneManager.flyTo(
      state,
      new THREE.Vector3(...cfg.defaultCameraTarget),
      new THREE.Vector3(...cfg.defaultCameraPos)
    );
  },

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
};
