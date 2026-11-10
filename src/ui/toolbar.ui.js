// ============================================================================
// Module: src/ui/toolbar.ui.js
// Controls Cutaway/X-Ray/Full structure modes, floor blueprint/satellite
// overlays, camera presets, fullscreen, and bottom cutaway sliders.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Toolbar = {
  applyStructureMode(state, mats, mode) {
    state.structureMode = mode;
    const { backWallsGroup, partitionWallsGroup, frontWallsGroup, roofTrussGroup, roofShellGroup } = state.archGroups;
    const statusText = document.getElementById("status-mode-text");
    const btnCutaway = document.getElementById("btn-cutaway");
    const btnRoof = document.getElementById("btn-roof");

    if (mode === "cutaway") {
      backWallsGroup.visible = true;
      partitionWallsGroup.visible = true;
      frontWallsGroup.visible = false;
      roofTrussGroup.visible = true;
      roofShellGroup.visible = false;
      if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;
      mats.wallSolid.opacity = 1.0;
      mats.wallSolid.transparent = false;
      document.getElementById("slider-roof").value = 0;
      btnCutaway.classList.add("active");
      btnRoof.classList.remove("active");
      statusText.textContent = "โหมดมองทะลุ 3D (Cutaway) · พร้อมสถาปัตยกรรมหน้าบริษัทจริง";
    } else if (mode === "full") {
      // 100% Solid Enclosed Exterior & Roof (Cannot see interior from outside!)
      backWallsGroup.visible = true;
      partitionWallsGroup.visible = true;
      frontWallsGroup.visible = true;
      roofTrussGroup.visible = true;
      roofShellGroup.visible = true;
      if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;

      mats.wallCutawayFront.opacity = 1.0;
      mats.wallCutawayFront.transparent = false;
      mats.wallCutawayFront.needsUpdate = true;

      mats.roofSheet.opacity = 1.0;
      mats.roofSheet.transparent = false;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.opacity = 1.0;
      mats.solarPanel.transparent = false;
      mats.solarPanel.needsUpdate = true;

      document.getElementById("slider-roof").value = 95;
      btnCutaway.classList.remove("active");
      btnRoof.classList.add("active");
      statusText.textContent = "โหมดปิดทึบโครงสร้างภายนอกจริง (Full Exterior) · หลังคาโค้งและโซลาร์เซลล์";
    } else if (mode === "xray") {
      backWallsGroup.visible = true;
      partitionWallsGroup.visible = true;
      frontWallsGroup.visible = true;
      roofTrussGroup.visible = true;
      roofShellGroup.visible = true;
      if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;

      mats.wallCutawayFront.transparent = true;
      mats.wallCutawayFront.opacity = 0.28;
      mats.wallCutawayFront.needsUpdate = true;

      mats.roofSheet.transparent = true;
      mats.roofSheet.opacity = 0.26;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.transparent = true;
      mats.solarPanel.opacity = 0.42;
      mats.solarPanel.needsUpdate = true;

      document.getElementById("slider-roof").value = 40;
      btnCutaway.classList.add("active");
      btnRoof.classList.add("active");
      statusText.textContent = "โหมดโปร่งแสง X-Ray · แสดงโครงหลังคาโค้งและโซลาร์เซลล์ทะลุภายใน";
    } else if (mode === "open") {
      backWallsGroup.visible = false;
      partitionWallsGroup.visible = false;
      frontWallsGroup.visible = false;
      roofTrussGroup.visible = false;
      roofShellGroup.visible = false;
      if (state.frontFacadeGroup) state.frontFacadeGroup.visible = false;
      btnCutaway.classList.remove("active");
      btnRoof.classList.remove("active");
      statusText.textContent = "โหมดเปิดโล่งไร้ผนัง (Open Floor) · ดูเครื่องจักร 360°";
    }
  },

  cycleStructureMode(state, mats) {
    const order = ["cutaway", "full", "xray", "open"];
    const next = order[(order.indexOf(state.structureMode) + 1) % order.length];
    this.applyStructureMode(state, mats, next);
  },

  toggleSolarRoofPreview(state, mats) {
    if (state.structureMode !== "full") {
      this.applyStructureMode(state, mats, "full");
    } else {
      this.applyStructureMode(state, mats, "cutaway");
    }
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
