# Starflex Factory 3D — AI & Developer Architecture Guide (AGENTS.md)

Welcome to the **StarFlex-FactoryLayout3D** project. This file is the primary orientation index for AI coding assistants and developers to navigate, read, and edit this codebase with maximum speed and zero hallucinations.

---

## 1. Tech Stack & Runtime Model

- **Core Engine**: Three.js (r128), OrbitControls, Vanilla JavaScript (ES2020), HTML5 Canvas.
- **Pipeline**: **No-build / No-bundler**. Runs directly in modern browsers via static web server or `file://`.
- **Global Architecture**: Single global root `window.Starflex3D` containing modular namespaces:
  - `window.Starflex3D.Config` (`src/config/constants.js`, `src/config/layout.constants.js`, `src/config/categories.js`)
  - `window.Starflex3D.Coords` (`src/core/coordinates.js`: `pt`, `rect`, `addEdges`)
  - `window.Starflex3D.Materials` (`src/core/materials.js`)
  - `window.Starflex3D.Scene` (`src/core/scene-manager.js`)
  - `window.Starflex3D.Builders` (`src/builders/` — `Site`, `Architecture`, `FrontFacade`, `Machines`, `Flows`)
  - `window.Starflex3D.Data` (`src/data/` — `buildings`, `machines`, `flows`, `tour`)
  - `window.Starflex3D.UI` (`src/ui/` — `toolbar`, `drawer`, `inspector`, `labels`, `tour`)

> **Crucial Rule**: When creating any new `.js` file, wrap it in `window.Starflex3D = window.Starflex3D || {};` and register a `<script src="...">` tag in `index.html` in dependency order.

---

## 2. Coordinate System & Conversion Formulas

All 3D models align 1:1 with the factory 2D blueprint (`2340 x 1590` pixels).

```text
Blueprint Center:  centerX = 1050,  centerY = 760
Scale Ratio:       0.1 meter per pixel (10 blueprint pixels = 1.0 meter in 3D)

Conversion:
  X (world 3D) = (px - 1050) * 0.1   (+X points East / Right)
  Z (world 3D) = (py - 760) * 0.1    (+Z points South / Front)
  Y (world 3D) = height in meters    (+Y points Up)
```

### Coordinate Helpers (`src/core/coordinates.js`)
- `pt(px, py)` -> `{ x, z }` (Center position in 3D world space).
- `rect([x1, y1, x2, y2])` -> `{ x, z, w, d, x1, z1, x2, z2 }`
  - `w`: width in 3D meters along X axis `(x2 - x1) * 0.1`
  - `d`: depth in 3D meters along Z axis `(y2 - y1) * 0.1`
  - `x`, `z`: 3D center position `((x1+x2)/2, (y1+y2)/2)` converted.
- `addEdges(mesh, colorHex, opacity)` -> Attaches crisp architectural line outlines (`LineSegments`).

---

## 3. Directory Map & Quick Edit Lookup

| If you need to edit... | Primary File to Edit | Key Coordinates / Symbols |
| :--- | :--- | :--- |
| **All Building & Facility Coordinates** | `src/config/layout.constants.js` | `BUILDINGS`, `FACADE`, `COURTYARD`, `AUXILIARY` |
| **Office HQ (สำนักงานใหญ่)** | `src/builders/facade/office.builder.js` | `[674, 1098, 1018, 1190]`, Arch Roof, Logo, Entrance Doors |
| **Office Porte-Cochere & Spirit House** | `src/builders/facade/office.builder.js` | `[806, 1190, 886, 1255]`, Stone Pillars, Stairs, Spirit House |
| **L-Shaped Canopy (หลังคารูปตัว L)** | `src/builders/facade/canopy.builder.js` | Nook `[1018..1106, 1098..1185]`, Walkway `[1062..1106, 815..1098]` |
| **Security Guardhouse & ATM** | `src/builders/facade/guardhouse.builder.js` | `[1165, 1445, 1295, 1560]`, ATM `[1140..1165]`, Curb |
| **Sliding Gates & Perimeter Fences** | `src/builders/facade/guardhouse.builder.js` | In Gate, Out Gate, Front West Fence `[185, 1560..695, 1560]` |
| **Building 4 Glass Facade & V-Columns**| `src/builders/facade/building4.builder.js` | `[1395, 1085, 1895, 1230]`, 5 V-Columns, Fascia, Tent |
| **Loading Dock Facade & Courtyard** | `src/builders/facade/dock-facade.builder.js` | Canopy `[1062, 815, 1398, 874]`, AC Matrix, Downspouts |
| **Front Lawn & Flagpoles** | `src/builders/facade/landscape.builder.js` | Garden Island `[185..1040, 1145..1555]`, Trees, 3 Flagpoles `px = 870..950` |
| **Facade Common Helpers** | `src/builders/facade/common.js` | `createHippedRoofGeometry`, `createACUnit`, `createLogoTexture` |
| **Facade Orchestrator** | `src/builders/front-facade.builder.js` | Assembles all facade sub-builders into `frontGroup` |
| **Chemical Warehouse (CHEM-WH)** | `src/builders/machines/chemical-warehouse.builder.js` | `[240, 80, 540, 190]`, North Yard behind Hall 1 |
| **Hall 1 Production Warehouse (WH-PRD)** | `src/data/machines/warehouse.data.js` | `[230, 885, 536, 965]`, 3 Pallet Rack Rows EW, 6.5m Corridor |
| **Hall 1 South Office Suite** | `src/builders/machines/facilities.builder.js` | `[200..632, 1030..1098]`, SW2, Spare, Data, Prod, QA, Lab, Fire Exit |
| **Main Warehouse (WH-MAIN Racks)** | `src/builders/machines/warehouse.builder.js` | `[674, 348, 1005, 542]`, 5 Rack Rows, 12 Bays |
| **Main Walkway & Hygiene Room (WALK-PROD)** | `src/builders/machines/facilities.builder.js` | `[1056, 318, 1102, 815]`, White Path, Air Shower, 2 Doors |
| **Factory Outer Walls & Solar Roofs** | `src/builders/architecture.builder.js` | Outer Walls, Solar Panels, Gabled Roofs, Cutaway |
| **Ground Pavements, Roads & Plinths** | `src/builders/site.builder.js` | `courtyardRects`, `factoryInteriorSections`, Grid |
| **Machine Data / Metadata / Specs** | `src/data/machines/*.data.js` | Machine IDs, Dimensions, Spec Sheets, Descriptions |
| **UI Toolbar, Cutaway, X-Ray Controls**| `src/ui/toolbar.ui.js` | Cutaway sliders, X-Ray toggle, Camera Presets |

---

## 4. Key Building Elevation Standards (Y-levels)

- Ground / Road Asphalt Surface: `y = -0.38m` (Grid at `y = -0.46m`)
- Factory Interior Concrete Plinth: `y = +1.25m` (Level with truck loading dock)
- Office / Guardhouse Ground Level: `y = 0.0m` to `+0.75m`
- Walkway Canopy Height: `y = 4.05m`
- Loading Dock Canopy Deck: `y = 4.55m`
- 2-Story Office Cornice: `y = 7.6m` (Curved arch rises to `y = 10.0m`)
- Factory Eaves: `y = 8.8m` to `10.5m`
- Building 4 Fascia: `y = 8.4m` to `9.55m`

---

## 5. Best Practices for Modifying 3D Elements

1. **Avoid Z-Fighting**: Never place two co-planar surfaces at identical coordinates. Offset by at least `0.02m` to `0.05m`.
2. **Hipped Roof Geometry**: Always use `createHippedRoofGeometry(w, d, h)` from `src/builders/facade/common.js`. Do **NOT** use sheared/rotated `ConeGeometry(..., 4)` because it skews on non-square rectangles.
3. **Materials**: Reuse materials from `fMats` or `mats` rather than instantiating hundreds of redundant new `MeshStandardMaterial` instances.
4. **Shadows**: Only enable `castShadow = true` on primary structural columns/canopies/bodies; avoid over-subscribing shadow maps on hundreds of tiny bolts or decorative trims.
5. **Syntax Verification**: Always verify syntax with `node -c <file.js>` before committing.
