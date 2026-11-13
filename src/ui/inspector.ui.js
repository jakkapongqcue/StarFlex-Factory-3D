// ============================================================================
// Module: src/ui/inspector.ui.js
// Handles 3D raycast picking, selection highlight wireframe, and the right-side
// machine/building detail card.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Inspector = {
  initRaycasting(state) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };
    const domEl = state.renderer.domElement;

    domEl.addEventListener("pointerdown", e => {
      downPos = { x: e.clientX, y: e.clientY };
    });

    domEl.addEventListener("pointerup", e => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 5) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, state.camera);

      const roots = Array.from(state.itemMeshes.values());
      const hits = raycaster.intersectObjects(roots, true);
      if (hits.length > 0) {
        let obj = hits[0].object;
        while (obj && (!obj.userData || !obj.userData.item)) {
          obj = obj.parent;
        }
        if (obj && obj.userData && obj.userData.item) {
          this.selectItem(state, obj.userData.item.id, true, state.mode !== "tour");
        }
      }
    });
  },

  selectItem(state, itemId, flyTo = true, openCard = true) {
    const group = state.itemMeshes.get(itemId);
    if (!group) return;

    state.selectedItemId = itemId;
    const { item, category, rect } = group.userData;
    const elevation = group.userData.elevation || 0;
    const buildings = window.Starflex3D.Data.buildings;

    // 1. Update 3D Selection Highlight Wireframe Box
    state.highlightBox.scale.set(rect.w + 1.0, (item.height || 4) + 0.8, rect.d + 1.0);
    state.highlightBox.position.set(rect.x, elevation + (item.height || 4) * 0.5, rect.z);
    state.highlightBox.visible = true;

    // 2. Populate Detail Card
    const card = document.getElementById("detail-card");
    const badge = document.getElementById("detail-badge");
    badge.textContent = category.name;
    badge.style.background = category.badgeBg;
    badge.style.color = category.badgeText;

    document.getElementById("detail-title").textContent = item.name;
    document.getElementById("detail-specs").textContent = item.specs;
    document.getElementById("detail-desc").textContent = item.description;
    document.getElementById("detail-code").textContent = item.code;

    const hallObj = buildings.find(b => b.id === item.hall);
    document.getElementById("detail-hall").textContent = hallObj ? hallObj.code : item.hall;
    document.getElementById("detail-size").textContent = `${rect.w.toFixed(1)} × ${rect.d.toFixed(1)} ม.`;
    document.getElementById("detail-height").textContent = `${(item.height || 4.0).toFixed(1)} ม.`;

    card.classList.toggle("hidden", !openCard);
    window.Starflex3D.UI.Drawer.renderList(state);

    if (flyTo) {
      window.Starflex3D.SceneManager.flyTo(
        state,
        new THREE.Vector3(rect.x, elevation + 2, rect.z),
        new THREE.Vector3(rect.x - 14, Math.max(26, (item.height || 4) * 4.5), rect.z + 36)
      );
    }
  },

  clearSelection(state) {
    state.selectedItemId = null;
    state.highlightBox.visible = false;
    document.getElementById("detail-card").classList.add("hidden");
    window.Starflex3D.UI.Drawer.renderList(state);
  }
};
