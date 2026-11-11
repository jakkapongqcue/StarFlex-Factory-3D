// ============================================================================
// Module: src/ui/toolbar.ui.js
// Controls Cutaway/X-Ray/Full structure modes, floor blueprint/satellite
// overlays, camera presets, fullscreen, and bottom cutaway sliders.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Toolbar = {
  /**
   * Cut-away and X-Ray Modes can work TOGETHER (พร้อมกัน) or INDEPENDENTLY (แยกกัน):
   * 1. Cut-away (state.isCutaway): Dynamic 360° cut-away (มองมุมไหน กำแพงหายมุมนั้น)
   * 2. X-ray (state.isXray): Translucent see-through structure (มองทะลุกำแพงและหลังคา)
   *
   * Both active simultaneously: Dynamic wall vanishing on camera-facing side + translucent see-through opposite walls & roofs!
   */
  applyStructureModes(state, mats) {
    if (state.isCutaway === undefined) state.isCutaway = true;
    if (state.isXray === undefined) state.isXray = false;

    const isCutaway = state.isCutaway;
    const isXray = state.isXray;

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
    const sliderRoof = document.getElementById("slider-roof");

    // 1. Update toolbar button active states independently
    if (btnCutaway) btnCutaway.classList.toggle("active", isCutaway);
    if (btnXray) btnXray.classList.toggle("active", isXray);

    // 2. Adjust material opacities and transparency based on X-Ray mode
    if (isXray) {
      // Translucent see-through walls & roofs
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

      if (sliderRoof) sliderRoof.value = 40;
    } else {
      // Solid opaque walls & roofs
      mats.wallSolid.transparent = false;
      mats.wallSolid.opacity = 1.0;
      mats.wallSolid.needsUpdate = true;

      mats.wallCutawayFront.transparent = false;
      mats.wallCutawayFront.opacity = 1.0;
      mats.wallCutawayFront.needsUpdate = true;

      mats.wallPartition.transparent = false;
      mats.wallPartition.opacity = 1.0;
      mats.wallPartition.needsUpdate = true;

      mats.roofSheet.transparent = false;
      mats.roofSheet.opacity = 1.0;
      mats.roofSheet.needsUpdate = true;

      mats.solarPanel.transparent = false;
      mats.solarPanel.opacity = 1.0;
      mats.solarPanel.needsUpdate = true;

      if (sliderRoof) sliderRoof.value = isCutaway ? 0 : 95;
    }

    // 3. Structural element visibility
    if (partitionWallsGroup) partitionWallsGroup.visible = true;
    if (roofTrussGroup) roofTrussGroup.visible = true;
    if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;

    if (isCutaway) {
      // Cut-away enabled: evaluate camera angle in real time to hide camera-facing exterior wall
      if (roofShellGroup) roofShellGroup.visible = isXray; // In Cutaway + Xray, show translucent roof; in pure Cutaway, open roof
      this.updateDynamicCutaway(state);
    } else {
      // Cut-away disabled: restore all exterior walls
      if (wallsNorth) wallsNorth.visible = true;
      if (wallsSouth) wallsSouth.visible = true;
      if (wallsWest) wallsWest.visible = true;
      if (wallsEast) wallsEast.visible = true;
      if (roofShellGroup) roofShellGroup.visible = true;
    }

    // 4. Update status display text
    if (statusText) {
      if (isCutaway && isXray) {
        statusText.textContent = "✂️⚡ โหมด Cut-away + X-ray (กำแพงหายตามมุมกล้อง + มองทะลุโปร่งแสง)";
      } else if (isCutaway && !isXray) {
        statusText.textContent = "✂️ โหมด Cut-away (มองมุมไหน กำแพงหายมุมนั้น) · Dynamic 360°";
      } else if (!isCutaway && isXray) {
        statusText.textContent = "⚡ โหมด X-ray (มองทะลุกำแพงและหลังคา) · โครงสร้างโปร่งแสง 3D";
      } else {
        statusText.textContent = "🏢 โหมดโครงสร้างทึบเต็มรูปแบบ (Full Solid Structure)";
      }
    }

    if (window.__triggerRender) window.__triggerRender();
  },

  toggleCutaway(state, mats) {
    state.isCutaway = !state.isCutaway;
    this.applyStructureModes(state, mats);
  },

  toggleXray(state, mats) {
    state.isXray = !state.isXray;
    this.applyStructureModes(state, mats);
  },

  setStructureMode(state, mats, mode) {
    if (mode === "cutaway") {
      this.toggleCutaway(state, mats);
    } else if (mode === "xray") {
      this.toggleXray(state, mats);
    } else {
      this.applyStructureModes(state, mats);
    }
  },

  applyStructureMode(state, mats, mode) {
    this.setStructureMode(state, mats, mode);
  },

  /**
   * Dynamic Wall Cut-away (มองมุมไหน กำแพงหายมุมนั้น):
   * Evaluates camera angle relative to factory center in real-time.
   * Any exterior wall facing towards the camera is automatically hidden.
   */
  updateDynamicCutaway(state) {
    if (!state.isCutaway) return;
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
    // 4-step cycle:
    // 1. Cutaway only (T, F) -> 2. Both Cutaway + Xray (T, T) -> 3. Xray only (F, T) -> 4. Full Solid (F, F)
    if (state.isCutaway && !state.isXray) {
      state.isCutaway = true;
      state.isXray = true;
    } else if (state.isCutaway && state.isXray) {
      state.isCutaway = false;
      state.isXray = true;
    } else if (!state.isCutaway && state.isXray) {
      state.isCutaway = false;
      state.isXray = false;
    } else {
      state.isCutaway = true;
      state.isXray = false;
    }
    this.applyStructureModes(state, mats);
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
      const op = parseFloat(val) / 100;
      state.blueprintPlane.material.opacity = op;
      state.blueprintPlane.visible = op > 0.02;
      if (op > 0.02) {
        state.blueprintPlane.position.y = 15.0;
        state.blueprintPlane.renderOrder = 999;
      } else {
        state.blueprintPlane.position.y = -0.34;
      }
    }
  },

  cycleFloorOverlay(state) {
    const modes = ["clean", "blueprint_soft", "blueprint_full"];
    const next = modes[(modes.indexOf(state.floorMode) + 1) % modes.length];
    state.floorMode = next;
    const bp = state.blueprintPlane;
    const sat = state.satPlane;
    const statusText = document.getElementById("status-mode-text");

    if (sat) {
      sat.visible = false;
      sat.material.opacity = 0;
    }

    if (next === "clean") {
      bp.visible = false;
      bp.position.y = -0.34;
      document.getElementById("slider-bp").value = 0;
      statusText.textContent = "พื้นคอนกรีตสถาปัตยกรรม 3D (ซ่อนผังแบบแปลน)";
    } else if (next === "blueprint_soft") {
      bp.visible = true;
      bp.material.opacity = 0.45;
      bp.position.y = 15.0;
      bp.renderOrder = 999;
      document.getElementById("slider-bp").value = 45;
      statusText.textContent = "แสดงผังโรงงานแบบโปร่งใส 45%";
    } else if (next === "blueprint_full") {
      bp.visible = true;
      bp.material.opacity = 0.88;
      bp.position.y = 15.0;
      bp.renderOrder = 999;
      document.getElementById("slider-bp").value = 88;
      statusText.textContent = "แสดงผังโรงงานจริง 100% (Starflex Plant Layout.jpeg)";
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

    // Show blueprint when in high angle (top_down), hide when in other 3D views
    if (state.blueprintPlane) {
      if (p.id === "top_down") {
        state.blueprintPlane.visible = true;
        state.blueprintPlane.material.opacity = 0.85;
        state.blueprintPlane.position.y = 15.0;
        state.blueprintPlane.renderOrder = 999;
      } else {
        if (state.floorMode !== "blueprint_full" && state.floorMode !== "blueprint_soft") {
          state.blueprintPlane.visible = false;
          state.blueprintPlane.position.y = -0.34;
        }
      }
    }
  },

  resetCamera(state) {
    const cfg = window.Starflex3D.Config.scene;
    state.camPresetIdx = 0;
    window.Starflex3D.SceneManager.flyTo(
      state,
      new THREE.Vector3(...cfg.defaultCameraTarget),
      new THREE.Vector3(...cfg.defaultCameraPos)
    );

    // Hide blueprint in normal default view
    if (state.blueprintPlane && state.floorMode !== "blueprint_full" && state.floorMode !== "blueprint_soft") {
      state.blueprintPlane.visible = false;
      state.blueprintPlane.position.y = -0.34;
    }
  },

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
};
