// ============================================================================
// Module: src/ui/toolbar.ui.js
// Controls Cutaway/X-Ray/Full structure modes, floor blueprint/satellite
// overlays, camera presets, fullscreen, and bottom cutaway sliders.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

(function () {
  /**
   * 3D camera-to-focus sightline corridor test for a vertical wall segment.
   * Returns true only when the wall sits between camera C and focus target T
   * within the viewing corridor AND reaches high enough to block view onto T.
   */
  function isSegmentBlockingSight(seg, cx, cy, cz, tx, ty, tz, fx, fz, rx, rz, lenXZ, vy) {
    const sA = (seg.x1 - cx) * fx + (seg.z1 - cz) * fz;
    const sB = (seg.x2 - cx) * fx + (seg.z2 - cz) * fz;
    const sMin = 0.5;
    const sMax = lenXZ - 0.35;
    if (sMax <= sMin) return false;
    if ((sA <= sMin && sB <= sMin) || (sA >= sMax && sB >= sMax)) return false;

    let t0 = 0;
    let t1 = 1;
    const ds = sB - sA;
    if (Math.abs(ds) > 1e-6) {
      let a = (sMin - sA) / ds;
      let b = (sMax - sA) / ds;
      if (ds < 0) {
        const tmp = a;
        a = b;
        b = tmp;
      }
      if (a > t0) t0 = a;
      if (b < t1) t1 = b;
      if (t0 > t1) return false;
    }

    const uA = (seg.x1 - cx) * rx + (seg.z1 - cz) * rz;
    const uB = (seg.x2 - cx) * rx + (seg.z2 - cz) * rz;
    const du = uB - uA;
    const u0 = uA + t0 * du;
    const u1 = uA + t1 * du;
    const s0 = sA + t0 * ds;
    const s1 = sA + t1 * ds;

    let sHit;
    let absU;
    if (u0 * u1 <= 0) {
      absU = 0;
      const frac = Math.abs(u1 - u0) > 1e-6 ? Math.max(0, Math.min(1, -u0 / (u1 - u0))) : 0.5;
      sHit = s0 + frac * (s1 - s0);
    } else if (Math.abs(u0) < Math.abs(u1)) {
      absU = Math.abs(u0);
      sHit = s0;
    } else {
      absU = Math.abs(u1);
      sHit = s1;
    }

    const corridorHalfW =
      seg.role === "low_partition" ? 4.2 : Math.min(18.0, Math.max(7.5, lenXZ * 0.22));
    if (absU > corridorHalfW) return false;

    const tRay = Math.max(0, Math.min(1, sHit / lenXZ));
    const yRay = cy + tRay * vy;
    const clearDrop = seg.role === "low_partition" ? 1.15 : 4.2;
    return seg.maxY > yRay - clearDrop;
  }

  /**
   * Checks whether a foreground facade building (e.g. Office HQ, Building 4)
   * sits between a South camera and a North-focused interior machine at low camera angle.
   */
  function isObstacleBlockingSight(obs, cx, cy, cz, tx, ty, tz, lenXZ, vy) {
    if (cz <= obs.maxZ || tz >= obs.minZ || lenXZ < 1.0) return false;
    const dzTotal = tz - cz;
    if (Math.abs(dzTotal) < 1e-4) return false;
    const tHit = (obs.cz - cz) / dzTotal;
    if (tHit <= 0.02 || tHit >= 0.98) return false;
    const hitX = cx + (tx - cx) * tHit;
    if (hitX < obs.minX - 6.0 || hitX > obs.maxX + 6.0) return false;
    const yRay = cy + vy * tHit;
    return obs.maxY > yRay - 3.5;
  }

  function syncNorthYardMaterials(isXray) {
    const nyCommon =
      window.Starflex3D.Builders &&
      window.Starflex3D.Builders.NorthYard &&
      window.Starflex3D.Builders.NorthYard.Common;
    if (!nyCommon || !nyCommon.mats) return;
    const { wallMat, roofMat } = nyCommon.mats;
    if (wallMat) {
      wallMat.transparent = isXray;
      wallMat.opacity = isXray ? 0.28 : 1.0;
      wallMat.needsUpdate = true;
    }
    if (roofMat) {
      roofMat.transparent = isXray;
      roofMat.opacity = isXray ? 0.24 : 1.0;
      roofMat.needsUpdate = true;
    }
  }

window.Starflex3D.UI.Toolbar = {
  /**
   * Cut-away and X-Ray Modes can work TOGETHER (พร้อมกัน) or INDEPENDENTLY (แยกกัน):
   * 1. Cut-away (state.isCutaway): Camera-focus dynamic cut-away (กำแพงหน้ากล้อง/บังจุด Focus หายอัตโนมัติ)
   * 2. X-ray (state.isXray): Translucent see-through structure (มองทะลุกำแพงและหลังคา)
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
    syncNorthYardMaterials(isXray);

    // 3. Structural element visibility
    if (wallsNorth) wallsNorth.visible = true;
    if (wallsSouth) wallsSouth.visible = true;
    if (wallsWest) wallsWest.visible = true;
    if (wallsEast) wallsEast.visible = true;
    if (partitionWallsGroup) partitionWallsGroup.visible = true;
    if (roofTrussGroup) roofTrussGroup.visible = true;
    if (state.frontFacadeGroup) state.frontFacadeGroup.visible = true;

    const showRoofs = !isCutaway || isXray;
    if (roofShellGroup) roofShellGroup.visible = showRoofs;
    if (Array.isArray(state.cutawayRoofs)) {
      state.cutawayRoofs.forEach(rObj => {
        rObj.visible = showRoofs;
      });
    }

    if (isCutaway) {
      this.updateDynamicCutaway(state);
    } else {
      // Cut-away disabled: restore every wall segment, obstacle & roof slice to solid view
      if (Array.isArray(state.cutawaySegments)) {
        state.cutawaySegments.forEach(seg => {
          seg.obj.visible = true;
        });
      }
      if (Array.isArray(state.cutawayObstacles)) {
        state.cutawayObstacles.forEach(obs => {
          obs.obj.visible = true;
        });
      }
      if (Array.isArray(state.northCutSlices)) {
        state.northCutSlices.forEach(slice => {
          slice.obj.visible = true;
        });
      }
    }

    // 4. Update status display text
    if (statusText) {
      if (isCutaway && isXray) {
        statusText.textContent = "✂️⚡ โหมด Cut-away + X-ray (กำแพงหน้ากล้องหายอัตโนมัติ + มองทะลุโปร่งแสง)";
      } else if (isCutaway && !isXray) {
        statusText.textContent = "✂️ โหมด Cut-away อ้างอิงมุมกล้อง (กำแพงหน้าจุด Focus หายอัตโนมัติ 360°)";
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
   * Dynamic Camera-Focus Cut-away:
   * Evaluates every exterior wall & internal partition segment relative to
   * camera.position -> controls.target. Walls facing the camera or obstructing
   * the camera-to-focus sightline disappear cleanly, while walls behind the focus stay solid.
   */
  updateDynamicCutaway(state) {
    if (!state.isCutaway) return;
    if (!state.camera || !state.archGroups) return;

    const cam = state.camera;
    const cx = cam.position.x;
    const cy = cam.position.y;
    const cz = cam.position.z;

    const hasTarget = state.controls && state.controls.target;
    const tx = hasTarget ? state.controls.target.x : 5;
    const ty = hasTarget ? state.controls.target.y : 2;
    const tz = hasTarget ? state.controls.target.z : 4;

    const dx = tx - cx;
    const dy = ty - cy;
    const dz = tz - cz;
    const lenXZ = Math.hypot(dx, dz);
    const dist3D = Math.hypot(dx, dy, dz);

    // Preserve perimeter wall framing in nearly vertical top-down plan view
    const isTopDown = lenXZ < 8.0 || (cy - ty) / (dist3D || 1) > 0.92;
    const fx = lenXZ > 1e-4 ? dx / lenXZ : 0;
    const fz = lenXZ > 1e-4 ? dz / lenXZ : -1;
    const rx = -fz;
    const rz = fx;

    const segments = state.cutawaySegments;
    if (Array.isArray(segments) && segments.length > 0) {
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (isTopDown) {
          seg.obj.visible = true;
          continue;
        }
        if (seg.role === "exterior") {
          const vx = cx - seg.cx;
          const vz = cz - seg.cz;
          const vLen = Math.hypot(vx, vz) || 1;
          const facingCam = (seg.nx * vx + seg.nz * vz) / vLen > 0.1;
          const blocking = isSegmentBlockingSight(seg, cx, cy, cz, tx, ty, tz, fx, fz, rx, rz, lenXZ, dy);
          seg.obj.visible = !(facingCam || blocking);
        } else {
          seg.obj.visible = !isSegmentBlockingSight(seg, cx, cy, cz, tx, ty, tz, fx, fz, rx, rz, lenXZ, dy);
        }
      }

      if (Array.isArray(state.northCutSlices)) {
        for (let i = 0; i < state.northCutSlices.length; i++) {
          const sl = state.northCutSlices[i];
          const hideSlice = cz < sl.cz + 6.0 || (dist3D < 75.0 && tz < sl.z1 + 16.0);
          sl.obj.visible = !hideSlice;
        }
      }

      if (Array.isArray(state.cutawayObstacles)) {
        for (let i = 0; i < state.cutawayObstacles.length; i++) {
          const obs = state.cutawayObstacles[i];
          obs.obj.visible = isTopDown
            ? true
            : !isObstacleBlockingSight(obs, cx, cy, cz, tx, ty, tz, lenXZ, dy);
        }
      }
      return;
    }

    // Legacy fallback if cutawaySegments was not populated
    const { wallsNorth, wallsSouth, wallsWest, wallsEast } = state.archGroups;
    if (!wallsNorth || !wallsSouth || !wallsWest || !wallsEast || lenXZ < 0.001) return;
    const threshold = 0.16;
    const dirX = -fx;
    const dirZ = -fz;
    wallsSouth.visible = dirZ <= threshold;
    wallsNorth.visible = dirZ >= -threshold;
    wallsWest.visible = dirX >= -threshold;
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
    const { roofShellGroup } = state.archGroups;
    const showRoofs = op > 0.02;
    if (roofShellGroup) roofShellGroup.visible = showRoofs;
    if (Array.isArray(state.cutawayRoofs)) {
      state.cutawayRoofs.forEach(rObj => {
        rObj.visible = showRoofs;
      });
    }
    if (!showRoofs) return;

    const isSolid = op >= 0.9;
    [mats.roofSheet, mats.solarPanel].forEach(mat => {
      if (!mat) return;
      mat.transparent = !isSolid;
      mat.opacity = isSolid ? 1.0 : op;
      mat.needsUpdate = true;
    });
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
})();
