// ============================================================================
// Module: src/ui/drawer.ui.js
// Manages the "ส่วนประกอบ" left component drawer, category filtering & search.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.UI = window.Starflex3D.UI || {};

window.Starflex3D.UI.Drawer = {
  init(state) {
    const items = window.Starflex3D.Data.items;
    const categories = window.Starflex3D.Categories;
    const container = document.getElementById("cat-pills");

    let html = `<button class="cat-pill active" data-cat="all" data-action="filter-cat">ทั้งหมด (${items.length})</button>`;
    Object.values(categories).forEach(cat => {
      const count = items.filter(i => i.category === cat.id).length;
      html += `<button class="cat-pill" data-cat="${cat.id}" data-action="filter-cat">${cat.shortName} (${count})</button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll("[data-action='filter-cat']").forEach(btn => {
      btn.addEventListener("click", () => this.filterByCategory(state, btn.dataset.cat));
    });

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => this.renderList(state));

    this.renderList(state);
  },

  filterByCategory(state, catId) {
    state.selectedCategory = catId;
    document.querySelectorAll(".cat-pill").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cat === catId);
    });

    state.itemMeshes.forEach(group => {
      const item = group.userData.item;
      const match = catId === "all" || item.category === catId;
      group.visible = true;
      group.scale.y = match ? 1.0 : 0.35;
    });

    this.renderList(state);
  },

  renderList(state) {
    const items = window.Starflex3D.Data.items;
    const categories = window.Starflex3D.Categories;
    const listEl = document.getElementById("drawer-list");
    const q = (document.getElementById("search-input").value || "").trim().toLowerCase();

    const filtered = items.filter(item => {
      const catMatch = state.selectedCategory === "all" || item.category === state.selectedCategory;
      const textMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.specs.toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    listEl.innerHTML = filtered
      .map(item => {
        const cat = categories[item.category];
        const colorHex = "#" + cat.color.toString(16).padStart(6, "0");
        const activeClass = state.selectedItemId === item.id ? "active" : "";
        return `
          <div class="drawer-item ${activeClass}" data-item-id="${item.id}">
            <div class="drawer-item-left">
              <span class="drawer-dot" style="background:${colorHex}"></span>
              <span class="drawer-item-name">${item.name}</span>
            </div>
            <span class="drawer-item-code">${item.code}</span>
          </div>
        `;
      })
      .join("");

    listEl.querySelectorAll(".drawer-item").forEach(el => {
      el.addEventListener("click", () => {
        window.Starflex3D.UI.Inspector.selectItem(state, el.dataset.itemId, true);
      });
    });
  },

  toggle() {
    const drawer = document.getElementById("components-drawer");
    const btn = document.getElementById("btn-components");
    const isHidden = drawer.classList.toggle("hidden");
    btn.classList.toggle("active", !isHidden);
  }
};
