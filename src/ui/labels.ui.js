// ============================================================================
// Module: src/ui/labels.ui.js
// Manages 3D-to-2D projected floating HTML machine badges.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Labels = {
  init(state) {
    const container = document.getElementById("labels-container");
    const items = window.Starflex3D.Data.items;
    const categories = window.Starflex3D.Categories;
    const { rect } = window.Starflex3D.Coords;

    container.innerHTML = "";
    state.labelElements = [];

    items.forEach(item => {
      const cat = categories[item.category] || categories.office_utility;
      const r = rect(item.bounds);
      const el = document.createElement("div");
      el.className = "label-3d";
      el.innerHTML = `<span class="dot" style="background:#${cat.color.toString(16).padStart(6, "0")}"></span><span>${item.code}</span>`;
      el.title = item.name;
      el.onclick = e => {
        e.stopPropagation();
        window.Starflex3D.UI.Inspector.selectItem(state, item.id, true);
      };
      container.appendChild(el);

      const isOutsideGroundItem = (
        item.id === "loading_dock_trucks" ||
        item.id === "guardhouse_item" ||
        item.id === "pump_house_item" ||
        item.id === "east_ramps_shipping" ||
        item.id === "admin_vip_office"
      );
      const baseElev = isOutsideGroundItem ? 0 : 1.25;

      state.labelElements.push({
        id: item.id,
        el,
        pos: new THREE.Vector3(r.x, baseElev + (item.height || 4) + 1.1, r.z),
        category: item.category
      });
    });
  },

  updateProjection(state) {
    const container = document.getElementById("labels-container");
    if (!state.showLabels || state.mode === "tour") {
      container.style.display = "none";
      return;
    }
    container.style.display = "block";
    const halfW = window.innerWidth * 0.5;
    const halfH = window.innerHeight * 0.5;

    state.labelElements.forEach(lbl => {
      if (state.selectedCategory !== "all" && lbl.category !== state.selectedCategory) {
        lbl.el.style.display = "none";
        return;
      }
      const v = lbl.pos.clone().project(state.camera);
      if (v.z > 1) {
        lbl.el.style.display = "none";
        return;
      }
      const x = v.x * halfW + halfW;
      const y = -v.y * halfH + halfH;
      lbl.el.style.display = "inline-flex";
      lbl.el.style.left = `${x}px`;
      lbl.el.style.top = `${y}px`;
      lbl.el.classList.toggle("active", state.selectedItemId === lbl.id);
    });
  },

  toggle(state) {
    state.showLabels = !state.showLabels;
    document.getElementById("btn-labels").classList.toggle("active", state.showLabels);
  }
};
